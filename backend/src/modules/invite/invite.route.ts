import { Router } from "express";
import {
  createInviteHandler,
  listMyInvitesHandler,
  acceptInviteHandler,
  rejectInviteHandler
} from "./invite.controller";
import { requireAuth } from "../../middleware/authMiddleware";
import { requireOrgMemberMiddleware } from "../../middleware/orgMiddleware";

const router = Router();

/**
 * OWNER invites a user
 */
router.post(
  "/orgs/:orgId/invites",
  requireAuth,
  requireOrgMemberMiddleware(["OWNER"]),
  createInviteHandler
);

/**
 * Logged-in user views their invites
 */
router.get(
  "/invites",
  requireAuth,
  listMyInvitesHandler
);

/**
 * Accept invite
 */
router.post(
  "/invites/:inviteId/accept",
  requireAuth,
  acceptInviteHandler
);

/**
 * Reject invite
 */
router.post(
  "/invites/:inviteId/reject",
  requireAuth,
  rejectInviteHandler
);

export default router;
