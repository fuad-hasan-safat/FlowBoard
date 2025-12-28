import { Schema, model, Types } from "mongoose";

export type NotificationType =
  | "COMMENT"
  | "TASK"
  | "INVITE"
  | "SYSTEM";

const notificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    orgId: {
      type: Types.ObjectId,
      required: true,
      index: true
    },

    type: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    read: {
      type: Boolean,
      default: false
    },

    meta: {
      type: Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

export const Notification = model(
  "Notification",
  notificationSchema
);
