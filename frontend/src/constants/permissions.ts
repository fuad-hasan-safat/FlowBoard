export type OrgRole = "OWNER" | "MEMBER";

export const ORG_PERMISSIONS = {
  OWNER: {
    manageOrg: true,
    inviteMembers: true,
    removeMembers: true,
    manageProjects: true,
    manageTasks: true,
    assignTasks: true,
    viewActivity: true,
  },
  MEMBER: {
    manageOrg: false,
    inviteMembers: false,
    removeMembers: false,
    manageProjects: false,
    manageTasks: true,
    assignTasks: false,
    viewActivity: true,
  },
} as const;
