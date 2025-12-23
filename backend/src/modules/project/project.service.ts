import { Types } from "mongoose";
import { Project } from "../../models/Project";
import { CreateProjectInput, UpdateProjectInput } from "./project.schema";

export const createProject = async (
  orgId: string,
  userId: string,
  data: CreateProjectInput
) => {
  const project = await Project.create({
    orgId: new Types.ObjectId(orgId),
    name: data.name,
    description: data.description,
    createdBy: new Types.ObjectId(userId)
  });

  return project;
};

export const listProjectsForOrg = async (orgId: string) => {
  const projects = await Project.find({ orgId }).sort({ createdAt: -1 });
  return projects;
};

export const getProjectById = async (orgId: string, projectId: string) => {
  const project = await Project.findOne({ _id: projectId, orgId });
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};

export const updateProject = async (
  orgId: string,
  projectId: string,
  data: UpdateProjectInput
) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, orgId },
    { $set: data },
    { new: true }
  );

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const deleteProject = async (orgId: string, projectId: string) => {
  const project = await Project.findOneAndDelete({ _id: projectId, orgId });
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};
