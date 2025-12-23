import { Router } from "express";
import {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler
} from "./task.controller";

const router = Router({ mergeParams: true });


// Base path in app.ts will be: /api/orgs/:orgId/projects/:projectId/tasks

router.post("/", createTaskHandler);             // create task
router.get("/", listTasksHandler);               // list tasks
router.get("/:taskId", getTaskHandler);          // get single task
router.patch("/:taskId", updateTaskHandler);     // update task
router.delete("/:taskId", deleteTaskHandler);    // delete task

export default router;
