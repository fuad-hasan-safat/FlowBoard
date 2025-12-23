import { Types } from "mongoose";
import { Organization } from "../../models/Organization";
import { OrgMember } from "../../models/OrgMember";
import { CreateOrgInput } from "./org.schema";


export const createOrganization = async (userId: string, data: CreateOrgInput) => {
  const ownerObjectId = new Types.ObjectId(userId);

  const org = await Organization.create({
    name: data.name,
    ownerId: ownerObjectId
  });

  await OrgMember.create({
    orgId: org._id,
    userId: ownerObjectId,
    role: "OWNER"
  });

  return org;
};

export const getUserOrganizations = async (userId: string) => {
  const memberships = await OrgMember.find({ userId }).populate("orgId");

  return memberships.map((m) => ({
    orgId: m.orgId._id,
    name: (m.orgId as any).name,
    role: m.role
  }));
};

export const getOrganizationForUser = async (userId: string, orgId: string) => {
  const membership = await OrgMember.findOne({
    orgId,
    userId
  }).populate("orgId");

  if (!membership) {
    throw new Error("You are not a member of this organization");
  }

  const org = membership.orgId as any;

  return {
    orgId: org._id,
    name: org.name,
    role: membership.role
  };
};
