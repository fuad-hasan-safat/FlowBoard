import { create } from "zustand";

export type OrgRole = "OWNER" | "MEMBER"| "ADMIN";

type OrgState = {
  orgId: string | null;
  role: OrgRole | null;

  setOrg: (orgId: string, role: OrgRole) => void;
  clearOrg: () => void;
};

export const useOrgStore = create<OrgState>((set) => ({
  orgId: null,
  role: null,

  setOrg: (orgId, role) =>
    set({
      orgId,
      role,
    }),

  clearOrg: () =>
    set({
      orgId: null,
      role: null,
    }),
}));
