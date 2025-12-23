import axiosClient from "./axiosClient";

export interface Project {
  _id: string;
  orgId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchProjectsApi = async (orgId: string): Promise<Project[]> => {
  const res = await axiosClient.get<Project[]>(`/orgs/${orgId}/projects`);
  return res.data;
};

export const createProjectApi = async (
  orgId: string,
  data: { name: string; description?: string }
) => {
  const res = await axiosClient.post(`/orgs/${orgId}/projects`, data);
  return res.data;
};

export const fetchProjectApi = async (
  orgId: string,
  projectId: string
): Promise<Project> => {
  const res = await axiosClient.get<Project>(
    `/orgs/${orgId}/projects/${projectId}`
  );
  return res.data;
};
