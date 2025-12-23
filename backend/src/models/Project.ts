import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  orgId: Types.ObjectId;
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true
  }
);

projectSchema.index({ orgId: 1, name: 1 });

export const Project = model<IProject>("Project", projectSchema);
