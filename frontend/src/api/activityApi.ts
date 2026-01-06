import axiosClient from "./axiosClient";

export type Activity = {
  _id: string;
  orgId: string;
  projectId?: string;
  taskId?: string;
  actorId: {
    _id: string;
    name: string;
    email: string;
  };
  type: string;
  createdAt: string;
};

export const fetchOrgActivityApi = async (orgId: string) => {
  const res = await axiosClient.get<Activity[]>(
    `/orgs/${orgId}/activity`
  );
  return res.data;
};
