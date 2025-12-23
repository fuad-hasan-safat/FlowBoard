import { useOrgStore } from "../../store/org.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMembersApi,
  removeMemberApi,
  type OrgMember
} from "../../api/memberApi";

export default function MembersPage() {
  const orgId = useOrgStore((s) => s.orgId);
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["members", orgId],
    queryFn: () => fetchMembersApi(orgId!),
    enabled: !!orgId
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) =>
      removeMemberApi(orgId!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", orgId] });
    }
  });

  if (!orgId) {
    return <div className="text-sm text-slate-400">Select an organization</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-slate-400">Loading members...</div>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-lg font-semibold">Organization Members</h1>

      {members?.map((m: OrgMember) => (
        <div
          key={m.userId._id}
          className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
        >
          <div>
            <div className="text-sm font-medium">{m.userId.name}</div>
            <div className="text-xs text-slate-400">{m.userId.email}</div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800">
              {m.role}
            </span>

            {m.role !== "OWNER" && (
              <button
                onClick={() => {
                  if (confirm("Remove this member?")) {
                    removeMutation.mutate(m.userId._id);
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
