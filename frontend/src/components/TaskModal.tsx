import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task, TaskPriority, TaskStatus } from "../api/taskApi";
import { updateTaskApi, deleteTaskApi } from "../api/taskApi";

type Props = {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  orgId: string | null;
  projectId: string | null;
};

const STATUS_OPTIONS: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"];
const PRIORITY_OPTIONS: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function TaskModal({ open, onClose, task, orgId, projectId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("BACKLOG");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setErrorMsg(null);
    if (task) {
      setTitle(task.title ?? "");
      setDescription(task.description ?? "");
      setStatus(task.status);
      setPriority(task.priority);
    } else {
      setTitle("");
      setDescription("");
      setStatus("BACKLOG");
      setPriority("MEDIUM");
    }
  }, [task]);

  // Guard: ensure required ids exist
  const valid = !!orgId && !!projectId && !!task;
  const queryKey = ["tasks", orgId, projectId];

  // Destructure the mutation result (mutateAsync + isPending) for type-safety
  const {
    mutateAsync: mutateUpdateTask,
    isPending: isUpdating
  } = useMutation({
    mutationFn: (data: Parameters<typeof updateTaskApi>[3]) =>
      updateTaskApi(orgId!, projectId!, task!._id, data),
    onMutate: async (newData) => {
      setErrorMsg(null);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[] | undefined>(queryKey, (old) => {
        if (!old) return old;
        return old.map((t) => (t._id === task!._id ? { ...t, ...newData } as Task : t));
      });

      return { previous };
    },
    onError: (err: any, _vars, context: any) => {
      console.error("updateTaskApi error:", err);
      setErrorMsg((err as any)?.response?.data?.message ?? "Failed to update task");
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const {
    mutateAsync: mutateDeleteTask,
    isPending: isDeleting
  } = useMutation({
    mutationFn: async () => deleteTaskApi(orgId!, projectId!, task!._id),
    onMutate: async () => {
      setErrorMsg(null);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[] | undefined>(queryKey, (old) =>
        old ? old.filter((t) => t._id !== task!._id) : old
      );
      return { previous };
    },
    onError: (err: any, _vars, context: any) => {
      console.error("deleteTaskApi error:", err);
      setErrorMsg((err as any)?.response?.data?.message ?? "Failed to delete task");
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  if (!open || !task) return null;

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!valid) {
      setErrorMsg("Missing project/org context");
      return;
    }
    setErrorMsg(null);

    try {
      await mutateUpdateTask({
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority
      });
      onClose();
    } catch (err) {
      // mutate's onError already set errorMsg and rollback
      console.warn("save failed", err);
    }
  }

  async function handleDelete() {
    if (!valid) {
      setErrorMsg("Missing project/org context");
      return;
    }
    if (!confirm("Delete this task?")) return;

    setErrorMsg(null);
    try {
      await mutateDeleteTask();
      onClose();
    } catch (err) {
      console.warn("delete failed", err);
    }
  }

  const disabled = isUpdating || isDeleting;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (!disabled) onClose();
        }}
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-6 z-10">
        <h3 className="text-lg font-semibold text-slate-50 mb-3">Task</h3>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Title</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Description</label>
            <textarea
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-2 text-sm text-slate-50"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={disabled}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Priority</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-2 text-sm text-slate-50"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                disabled={disabled}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMsg && <div className="text-sm text-red-400">{errorMsg}</div>}

          <div className="flex items-center justify-between pt-3">
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white"
                disabled={disabled}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!disabled) onClose();
                }}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200"
                disabled={disabled}
              >
                Cancel
              </button>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md border border-red-600 text-red-400 px-3 py-1.5 text-sm"
              disabled={disabled}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
