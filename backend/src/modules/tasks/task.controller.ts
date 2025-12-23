import { Request, Response, NextFunction } from "express";
import { createTaskSchema, updateTaskSchema } from "./task.schema";
import {
  createTask,
  listTasksForProject,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.service";

export const createTaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.orgMembership) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orgId } = req.orgMembership;
    const { projectId } = req.params;

    console.log("createTaskHandler params:", req.params); // debug

    const parsed = createTaskSchema.parse(req.body);
    const task = await createTask(orgId, projectId, req.user.userId, parsed);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const listTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.orgMembership) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orgId } = req.orgMembership;
    const { projectId } = req.params;

    const tasks = await listTasksForProject(orgId, projectId);

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.orgMembership) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orgId } = req.orgMembership;
    const { projectId, taskId } = req.params;

    const task = await getTaskById(orgId, projectId, taskId);

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.orgMembership) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orgId } = req.orgMembership;
    const { projectId, taskId } = req.params;

    const parsed = updateTaskSchema.parse(req.body);
    const task = await updateTask(orgId, projectId, taskId, req.user?.userId as string, parsed);

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.orgMembership) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { orgId } = req.orgMembership;
    const { projectId, taskId } = req.params;

    const task = await deleteTask(orgId, projectId, taskId, req.user?.userId as string);

    res.json({ message: "Task deleted", taskId: task._id });
  } catch (err) {
    next(err);
  }
};
