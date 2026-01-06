import { Schema, model, Document, Types } from "mongoose";

export type OrgRole = "OWNER" | "ADMIN" | "MEMBER";

export interface IOrganization extends Document {
  name: string;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true
  }
);

organizationSchema.index({ ownerId: 1 });

export const Organization = model<IOrganization>("Organization", organizationSchema);
