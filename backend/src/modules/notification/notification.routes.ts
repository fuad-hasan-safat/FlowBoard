import { Router } from "express";

import { requireAuth } from "../../middleware/authMiddleware";
import { listNotifications, markNotificationRead } from "./notification.controller";

const router = Router();

router.get("/", requireAuth, listNotifications);

router.patch("/:id/read", requireAuth, markNotificationRead);

export default router;
