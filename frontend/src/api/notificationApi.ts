import axiosClient from "./axiosClient";

export type Notification = {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export const fetchNotificationsApi = async () => {
  const res = await axiosClient.get("/notifications");
  return res.data;
};

export const markNotificationReadApi = async (id: string) => {
  await axiosClient.patch(`/notifications/${id}/read`);
};
