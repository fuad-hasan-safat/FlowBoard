import { Request, Response, NextFunction } from "express";
import { createOrgSchema } from "./org.schema";
import { createOrganization, getUserOrganizations, getOrganizationForUser } from "./org.service";
import { OrgMember } from "../../models/OrgMember";

export const createOrgHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = createOrgSchema.parse(req.body);
    const org = await createOrganization(req.user.userId, parsed);

    res.status(201).json({
      orgId: org._id,
      name: org.name
    });
  } catch (err) {
    next(err);
  }
};

export const listUserOrgsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orgs = await getUserOrganizations(req.user.userId);
    res.json(orgs);
  } catch (err) {
    next(err);
  }
};

export const getOrgHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orgId } = req.params;
    const org = await getOrganizationForUser(req.user.userId, orgId);

    res.json(org);
  } catch (err) {
    next(err);
  }
};

export const listOrgMembersHandler = async (req: Request, res: Response) => {
  const { orgId } = req.params;

  const members = await OrgMember.find({ orgId })
    .populate("userId", "name email")
    .sort({ createdAt: 1 });

  res.json(members);
};

export const removeOrgMemberHandler = async (req: Request, res: Response) => {
  const { orgId, userId } = req.params;

  if (req.user!.userId === userId) {
    return res.status(400).json({ message: "Cannot remove yourself" });
  }

  const member = await OrgMember.findOne({ orgId, userId });
  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  if (member.role === "OWNER") {
    return res.status(400).json({ message: "Cannot remove owner" });
  }

  await member.deleteOne();
  res.json({ success: true });
};


