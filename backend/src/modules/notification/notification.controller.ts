import { Request, Response } from "express";
import { Notification } from "../../models/Notification";

export const listNotifications = async (
  req: Request,
  res: Response
) => {
  const notifications = await Notification.find({
    userId: req.user!.userId
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(notifications);
};

export const markNotificationRead = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  await Notification.updateOne(
    { _id: id, userId: req.user!.userId },
    { $set: { read: true } }
  );

  res.json({ success: true });
};
