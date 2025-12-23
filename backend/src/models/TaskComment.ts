import { Schema, model, Types } from "mongoose";

const taskCommentSchema = new Schema(
  {
    orgId: { type: Types.ObjectId, required: true, index: true },
    projectId: { type: Types.ObjectId, required: true, index: true },
    taskId: { type: Types.ObjectId, required: true, index: true },
    authorId: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export const TaskComment = model("TaskComment", taskCommentSchema);
