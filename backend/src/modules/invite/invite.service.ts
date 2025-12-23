import { Types } from "mongoose";
import { Invite } from "./invite.model";
import { CreateInviteInput } from "./invite.schema";
import { OrgMember } from "../../models/OrgMember";
import { Organization } from "../../models/Organization";

export const createInvite = async (
  orgId: string,
  invitedByUserId: string,
  data: CreateInviteInput
) => {
  // Ensure org exists
  const org = await Organization.findById(orgId);
  if (!org) {
    throw new Error("Organization not found");
  }

  // Prevent inviting existing member
  const existingMember = await OrgMember.findOne({
    orgId,
    email: data.email.toLowerCase()
  });

  if (existingMember) {
    throw new Error("User is already a member of this organization");
  }

  const invite = await Invite.create({
    orgId: new Types.ObjectId(orgId),
    email: data.email.toLowerCase(),
    role: "MEMBER",
    invitedBy: new Types.ObjectId(invitedByUserId)
  });

  return invite;
};


export const listInvitesForUser = async (email: string) => {
  return Invite.find({
    email: email.toLowerCase(),
    status: "PENDING"
  }).populate("orgId", "name");
};

export const acceptInvite = async (inviteId: string, userId: string, email: string) => {
  const invite = await Invite.findOne({
    _id: inviteId,
    email: email.toLowerCase(),
    status: "PENDING"
  });

  if (!invite) {
    throw new Error("Invite not found or already handled");
  }

  // Prevent duplicate membership
  const existing = await OrgMember.findOne({
    orgId: invite.orgId,
    userId
  });

  if (existing) {
    throw new Error("You are already a member of this organization");
  }

  // Create membership
  await OrgMember.create({
    orgId: invite.orgId,
    userId: new Types.ObjectId(userId),
    role: invite.role
  });

  invite.status = "ACCEPTED";
  invite.acceptedAt = new Date();
  await invite.save();

  return invite;
};

export const rejectInvite = async (inviteId: string, email: string) => {
  const invite = await Invite.findOne({
    _id: inviteId,
    email: email.toLowerCase(),
    status: "PENDING"
  });

  if (!invite) {
    throw new Error("Invite not found or already handled");
  }

  invite.status = "REJECTED";
  await invite.save();

  return invite;
};
