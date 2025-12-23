import { Router } from "express";
import {
  createProjectHandler,
  listProjectsHandler,
  getProjectHandler,
  updateProjectHandler,
  deleteProjectHandler
} from "./project.controller";

const router = Router();

// Base path: /api/orgs/:orgId/projects

router.post("/", createProjectHandler);          // create project
router.get("/", listProjectsHandler);            // list projects
router.get("/:projectId", getProjectHandler);    // get project
router.patch("/:projectId", updateProjectHandler); // update
router.delete("/:projectId", deleteProjectHandler); // delete

export default router;
