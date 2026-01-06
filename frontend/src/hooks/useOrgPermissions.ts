import { useOrgStore } from "../store/org.store";
import { ORG_PERMISSIONS } from "../constants/permissions";

export const useOrgPermissions = () => {
  const role = useOrgStore((s) => s.role);

  if (!role) return null;
  return ORG_PERMISSIONS[role as keyof typeof ORG_PERMISSIONS];
};