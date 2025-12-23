import axiosClient from "./axiosClient";

export interface OrgItem {
  orgId: string;
  name: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

export const fetchOrgsApi = async (): Promise<OrgItem[]> => {
  const res = await axiosClient.get<OrgItem[]>("/orgs");
  return res.data;
};

export const createOrgApi = async (data: { name: string }): Promise<{
  orgId: string;
  name: string;
}> => {
  const res = await axiosClient.post("/orgs", data);
  return res.data;
};
