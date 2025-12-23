import axiosClient from "./axiosClient";

export type OrgMember = {
  _id: string;
  role: "OWNER" | "MEMBER";
  userId: {
    _id: string;
    name: string;
    email: string;
  };
};

export const fetchMembersApi = async (orgId: string): Promise<OrgMember[]> => {
  const res = await axiosClient.get(`/orgs/${orgId}/members`);
  return res.data;
};

export const removeMemberApi = async (
  orgId: string,
  userId: string
) => {
  const res = await axiosClient.delete(
    `/orgs/${orgId}/members/${userId}`
  );
  return res.data;
};
