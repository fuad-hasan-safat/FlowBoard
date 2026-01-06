import axiosClient from "./axiosClient";

export type TaskComment = {
  _id: string;
  content: string;
  createdAt: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
  };
};

export const fetchCommentsApi = async (
  orgId: string,
  projectId: string,
  taskId: string
): Promise<TaskComment[]> => {
  const res = await axiosClient.get(
    `/orgs/${orgId}/projects/${projectId}/tasks/${taskId}/comments`
  );
  return res.data;
};

export const createCommentApi = async (
  orgId: string,
  projectId: string,
  taskId: string,
  content: string
) => {
  const res = await axiosClient.post(
    `/orgs/${orgId}/projects/${projectId}/tasks/${taskId}/comments`,
    { content }
  );
  return res.data;
};
