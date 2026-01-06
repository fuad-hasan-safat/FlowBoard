
import { Schema, model, Types } from "mongoose";

export type ActivityType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "COMMENT_ADDED"
  | "TASK_ASSIGNED"
  | "MEMBER_INVITED"
  | "MEMBER_JOINED";

const activitySchema = new Schema(
  {
    orgId: { type: Types.ObjectId, required: true, index: true },
    projectId: { type: Types.ObjectId, index: true },
    taskId: { type: Types.ObjectId, index: true },

    actorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      required: true
    },

    meta: {
      type: Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

export const Activity = model("Activity", activitySchema);
