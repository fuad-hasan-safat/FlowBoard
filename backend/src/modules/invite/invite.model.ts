import { Schema, model, Types } from "mongoose";
import { InviteStatus, InviteRole } from "./invite.types";

const inviteSchema = new Schema(
  {
    orgId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    role: {
      type: String,
      enum: ["MEMBER"],
      default: "MEMBER"
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
      index: true
    },

    invitedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    acceptedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

/**
 * Prevent duplicate pending invites
 * Same org + email + PENDING
 */
inviteSchema.index(
  { orgId: 1, email: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "PENDING" } }
);

export const Invite = model("Invite", inviteSchema);
