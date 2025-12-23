import { NextFunction, Request, Response } from "express";
import { OrgMember } from "../models/OrgMember";
import { OrgRole } from "../models/Organization";

export interface OrgMembership {
  orgId: string;
  userId: string;
  role: OrgRole;
}

declare global {
  namespace Express {
    interface Request {
      orgMembership?: OrgMembership;
    }
  }
}

export const requireOrgMemberMiddleware =
  (allowedRoles?: OrgRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { orgId } = req.params;
      console.log("ORG MIDDLEWARE PARAMS:", req.params); // debug
      if (!orgId) {
        return res
          .status(400)
          .json({ message: "Organization id is required in route params" });
      }

      const membership = await OrgMember.findOne({
        orgId,
        userId: req.user.userId,
      });

      if (!membership) {
        return res
          .status(403)
          .json({ message: "You are not a member of this organization" });
      }

      if (allowedRoles && !allowedRoles.includes(membership.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      req.orgMembership = {
        orgId: membership.orgId.toString(),
        userId: membership.userId.toString(),
        role: membership.role,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
