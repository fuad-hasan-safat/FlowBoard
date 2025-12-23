import axiosClient from "./axiosClient";

export type Activity = {
  _id: string;
  type: string;
  createdAt: string;
  actorId: {
    name: string;
    email: string;
  };
  meta?: Record<string, any>;
};

export const fetchActivityApi = async (orgId: string): Promise<Activity[]> => {
  const res = await axiosClient.get(`/orgs/${orgId}/activity`);
  return res.data;
};
