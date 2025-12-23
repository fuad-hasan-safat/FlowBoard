import { Types } from "mongoose";
import { Task } from "../../models/Task";
import { Project } from "../../models/Project";
import { CreateTaskInput, UpdateTaskInput } from "./task.schema";
import { getIO } from "../../socket";

const getRoom = (orgId: string, projectId: string) =>
  `org:${orgId}:project:${projectId}`;

export const createTask = async (
  orgId: string,
  projectId: string,
  userId: string,
  data: CreateTaskInput
) => {
  // Ensure project belongs to org
  const project = await Project.findOne({ _id: projectId, orgId });
  if (!project) {
    throw new Error("Project not found in this organization");
  }

  const payload: any = {
    orgId: new Types.ObjectId(orgId),
    projectId: project._id,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    createdBy: new Types.ObjectId(userId)
  };

  if (data.assigneeId) {
    payload.assignee = new Types.ObjectId(data.assigneeId);
  }

  if (data.dueDate) {
    payload.dueDate = new Date(data.dueDate);
  }

  const task = await Task.create(payload);

  // 🔴 Emit realtime event
  const io = getIO();
  io.to(getRoom(orgId, projectId)).emit("task:created", task);

  return task;
};

export const listTasksForProject = async (
  orgId: string,
  projectId: string
) => {
  const project = await Project.findOne({ _id: projectId, orgId });
  if (!project) {
    throw new Error("Project not found in this organization");
  }

  const tasks = await Task.find({ orgId, projectId }).sort({ createdAt: -1 });
  return tasks;
};

export const getTaskById = async (
  orgId: string,
  projectId: string,
  taskId: string
) => {
  const task = await Task.findOne({ _id: taskId, orgId, projectId });
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};

export const updateTask = async (
  orgId: string,
  projectId: string,
  taskId: string,
  data: UpdateTaskInput
) => {
  const update: any = { ...data };

  if (data.assigneeId !== undefined) {
    update.assignee = data.assigneeId
      ? new Types.ObjectId(data.assigneeId)
      : null;
    delete update.assigneeId;
  }

  if (data.dueDate !== undefined) {
    update.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    delete update.dueDate;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, orgId, projectId },
    { $set: update },
    { new: true }
  );

  if (!task) {
    throw new Error("Task not found");
  }

  // 🔴 Emit realtime event
  const io = getIO();
  io.to(getRoom(orgId, projectId)).emit("task:updated", task);

  return task;
};

export const deleteTask = async (
  orgId: string,
  projectId: string,
  taskId: string
) => {
  const task = await Task.findOneAndDelete({
    _id: taskId,
    orgId,
    projectId
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // 🔴 Emit realtime event
  const io = getIO();
  io.to(getRoom(orgId, projectId)).emit("task:deleted", {
    taskId: task._id.toString()
  });

  return task;
};
