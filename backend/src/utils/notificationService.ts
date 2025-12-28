import { Types } from "mongoose";
import { getIO } from "../socket";
import { Notification } from "../models/Notification";

type CreateNotificationParams = {
  userId: string;
  orgId: string;
  type: string;
  message: string;
  meta?: Record<string, any>;
};

export const createNotification = async ({
  userId,
  orgId,
  type,
  message,
  meta,
}: CreateNotificationParams) => {
  const notification = await Notification.create({
    userId: new Types.ObjectId(userId),
    orgId: new Types.ObjectId(orgId),
    type,
    message,
    meta,
  });

  // 🔔 realtime push
  const io = getIO();
  io.to(`user:${userId}`).emit("notification:new", notification);
  console.log("📣 emitting notification to", `user:${userId}`);

  return notification;
};
