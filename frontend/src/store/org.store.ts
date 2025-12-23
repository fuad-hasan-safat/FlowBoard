import { create } from "zustand";

interface OrgState {
  orgId: string | null;
  setOrgId: (id: string | null) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  orgId: null,
  setOrgId: (id) => set({ orgId: id })
}));
