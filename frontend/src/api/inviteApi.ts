import http from "./axiosClient";

export type Invite = {
  _id: string;
  orgId: {
    _id: string;
    name: string;
  };
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

export const fetchInvitesApi = async (): Promise<Invite[]> => {
  const res = await http.get("/invites");
  return res.data;
};

export const acceptInviteApi = async (inviteId: string) => {
  const res = await http.post(`/invites/${inviteId}/accept`);
  return res.data;
};

export const rejectInviteApi = async (inviteId: string) => {
  const res = await http.post(`/invites/${inviteId}/reject`);
  return res.data;
};
