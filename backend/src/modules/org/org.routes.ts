import { Router } from "express";
import {
  createOrgHandler,
  listUserOrgsHandler,
  getOrgHandler,
  listOrgMembersHandler,
  removeOrgMemberHandler,
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

export default router;
