import { Router } from "express";
import {
  createOrgHandler,
  listUserOrgsHandler,
  getOrgHandler,
  listOrgMembersHandler,
  removeOrgMemberHandler,
  listTaskComments,
  createTaskComment,
  listOrgActivity,
} from "./org.controller";
import { requireAuth } from "../../middleware/authMiddleware";
import { requireOrgMemberMiddleware } from "../../middleware/orgMiddleware";

const router = Router();

router.post("/", requireAuth, createOrgHandler);

router.get("/", requireAuth, listUserOrgsHandler);

router.get("/:orgId", requireAuth, requireOrgMemberMiddleware(), getOrgHandler);
router.get(
  "/:orgId/members",
  requireAuth,
  requireOrgMemberMiddleware(),
  listOrgMembersHandler
);

router.delete(
  "/:orgId/members/:userId",
  requireAuth,
  requireOrgMemberMiddleware(["OWNER"]),
  removeOrgMemberHandler
);

router.get(
  "/:orgId/projects/:projectId/tasks/:taskId/comments",
  requireAuth,
  requireOrgMemberMiddleware(),
  listTaskComments
);

router.post(
  "/:orgId/projects/:projectId/tasks/:taskId/comments",
  requireAuth,
  requireOrgMemberMiddleware(),
  createTaskComment
);

router.get(
  "/:orgId/activity",
  requireAuth,
  requireOrgMemberMiddleware(),
  listOrgActivity
);

export default router;
