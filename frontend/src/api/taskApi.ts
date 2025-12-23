import axiosClient from "./axiosClient";

export type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  _id: string;
  orgId: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string | null;
  createdBy: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchTasksApi = async (
  orgId: string,
  projectId: string
): Promise<Task[]> => {
  const res = await axiosClient.get<Task[]>(
    `/orgs/${orgId}/projects/${projectId}/tasks`
  );
  return res.data;
};

export const createTaskApi = async (
  orgId: string,
  projectId: string,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  }
): Promise<Task> => {
  const res = await axiosClient.post<Task>(
    `/orgs/${orgId}/projects/${projectId}/tasks`,
    data
  );
  return res.data;
};

export const updateTaskStatusApi = async (
  orgId: string,
  projectId: string,
  taskId: string,
  status: TaskStatus
): Promise<Task> => {
  const res = await axiosClient.patch<Task>(
    `/orgs/${orgId}/projects/${projectId}/tasks/${taskId}`,
    { status }
  );
  return res.data;
};

export const updateTaskApi = async (
  orgId: string,
  projectId: string,
  taskId: string,
  data: Partial<{
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string | null;
    dueDate: string | null;
  }>
): Promise<Task> => {
  const res = await axiosClient.patch<Task>(
    `/orgs/${orgId}/projects/${projectId}/tasks/${taskId}`,
    data
  );
  return res.data;
};

export const deleteTaskApi = async (
  orgId: string,
  projectId: string,
  taskId: string
): Promise<{ message: string; taskId: string }> => {
  const res = await axiosClient.delete(`/orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
  return res.data;
};
