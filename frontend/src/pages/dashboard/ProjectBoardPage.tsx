import { useParams, Link } from "react-router-dom";
import { useOrgStore } from "../../store/org.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectApi } from "../../api/projectApi";
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskStatusApi,
  type Task,
  type TaskStatus,
} from "../../api/taskApi";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMemo, useState, type FormEvent } from "react";
import TaskModal from "../../components/TaskModal";
import { useTaskRealtime } from "../../hooks/useTaskRealtime";
import { useProjectRoom } from "../../hooks/useProjectRoom";

const STATUS_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "BACKLOG", title: "Backlog" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review" },
  { id: "DONE", title: "Done" },
];

export default function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const orgId = useOrgStore((s) => s.orgId);
  const queryClient = useQueryClient();

  // 🔴 Enable realtime sync
  useProjectRoom(orgId, projectId);
  useTaskRealtime(orgId, projectId);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", orgId, projectId],
    queryFn: () => fetchProjectApi(orgId!, projectId!),
    enabled: Boolean(orgId && projectId),
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", orgId, projectId],
    queryFn: () => fetchTasksApi(orgId!, projectId!),
    enabled: Boolean(orgId && projectId),
  });

  const { mutate: createTask, isPending: creatingTask } = useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      createTaskApi(orgId!, projectId!, {
        title: data.title,
        description: data.description,
        status: "BACKLOG",
        priority: "MEDIUM",
      }),
    onSuccess: () => {
      setNewTaskTitle("");
      setNewTaskDesc("");
      queryClient.invalidateQueries({ queryKey: ["tasks", orgId, projectId] });
    },
  });

  const { mutate: moveTask } = useMutation({
    mutationFn: (payload: { taskId: string; status: TaskStatus }) =>
      updateTaskStatusApi(orgId!, projectId!, payload.taskId, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", orgId, projectId] });
    },
  });

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      BACKLOG: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
    };

    (tasks ?? []).forEach((t) => {
      map[t.status].push(t);
    });

    return map;
  }, [tasks]);

  if (!orgId) {
    return (
      <div className="text-sm text-slate-300">No organization selected.</div>
    );
  }

  if (!projectId) {
    return <div className="text-sm text-slate-300">No project selected.</div>;
  }

  const handleNewTaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    createTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || undefined,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as TaskStatus;
    const destStatus = result.destination.droppableId as TaskStatus;

    if (sourceStatus === destStatus) return;

    const sourceTasks = tasksByStatus[sourceStatus];
    const movedTask = sourceTasks[result.source.index];
    if (!movedTask) return;

    moveTask({ taskId: movedTask._id, status: destStatus });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/app"
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            ← Back to projects
          </Link>

          <h1 className="text-xl font-semibold text-slate-50 mt-1">
            {projectLoading
              ? "Loading project..."
              : projectError
              ? "Project"
              : project?.name}
          </h1>

          {project?.description && (
            <p className="text-sm text-slate-400 mt-1">{project.description}</p>
          )}
        </div>

        <form
          onSubmit={handleNewTaskSubmit}
          className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 w-80 space-y-2"
        >
          <div className="text-xs font-medium text-slate-200">
            Add task to Backlog
          </div>

          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />

          <textarea
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
            placeholder="Description (optional)"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />

          <button
            type="submit"
            disabled={creatingTask}
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-slate-50 py-1.5 text-xs font-medium"
          >
            {creatingTask ? "Adding..." : "Add task"}
          </button>
        </form>
      </div>

      {tasksLoading ? (
        <div className="text-sm text-slate-400">Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-4">
            {STATUS_COLUMNS.map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-3 min-h-[200px] flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {col.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {tasksByStatus[col.id].length} tasks
                      </span>
                    </div>

                    <div className="space-y-2">
                      {tasksByStatus[col.id].map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 cursor-pointer hover:bg-slate-700 will-change-transform"
                              onClick={() => {
                                setSelectedTask(task);
                                setModalOpen(true);
                              }}
                            >
                              <div className="text-xs font-medium text-slate-50">
                                {task.title}
                              </div>

                              {task.description && (
                                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                                  {task.description}
                                </div>
                              )}

                              <div className="mt-1 text-[10px] text-slate-500">
                                {task.priority} •{" "}
                                {new Date(task.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

      <TaskModal
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        orgId={orgId}
        projectId={projectId!}
      />
    </div>
  );
}
