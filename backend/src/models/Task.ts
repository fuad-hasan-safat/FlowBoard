import { Schema, model, Document, Types, ObjectId, InferSchemaType, HydratedDocument } from "mongoose";

export type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";


const taskSchema = new Schema(
  {
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"],
      default: "BACKLOG",
      index: true
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true
    },
    assignee: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ orgId: 1, projectId: 1 });
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assignee: 1 });

export type TaskType = InferSchemaType<typeof taskSchema>;
export type TaskDocument = HydratedDocument<TaskType>;

export const Task = model<TaskType>("Task", taskSchema);


