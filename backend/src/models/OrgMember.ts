import { Schema, model, Document, Types } from "mongoose";
import { OrgRole } from "./Organization";

export interface IOrgMember extends Document {
  orgId: Types.ObjectId;
  userId: Types.ObjectId;
  role: OrgRole;
  createdAt: Date;
  updatedAt: Date;
}

const orgMemberSchema = new Schema<IOrgMember>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

orgMemberSchema.index({ orgId: 1, userId: 1 }, { unique: true });

export const OrgMember = model<IOrgMember>("OrgMember", orgMemberSchema);
