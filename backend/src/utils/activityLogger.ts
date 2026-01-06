import { Activity, type ActivityType } from "../models/Activity";
import { Types } from "mongoose";

type LogActivityParams = {
  orgId: string;
  actorId: string;
  type: ActivityType;
  projectId?: string;
  taskId?: string;
  meta?: Record<string, any>;
};

export const logActivity = async ({
  orgId,
  actorId,
  type,
  projectId,
  taskId,
  meta
}: LogActivityParams) => {
  await Activity.create({
    orgId: new Types.ObjectId(orgId),
    projectId: projectId ? new Types.ObjectId(projectId) : undefined,
    taskId: taskId ? new Types.ObjectId(taskId) : undefined,
    actorId: new Types.ObjectId(actorId),
    type,
    meta
  });
};