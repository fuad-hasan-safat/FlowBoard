import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInvitesApi,
  acceptInviteApi,
  rejectInviteApi,
  type Invite
} from "../../api/inviteApi";

export default function InvitesPage() {
  const queryClient = useQueryClient();

  const { data: invites, isLoading } = useQuery({
    queryKey: ["invites"],
    queryFn: fetchInvitesApi
  });

  const acceptMutation = useMutation({
    mutationFn: acceptInviteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: rejectInviteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    }
  });

  if (isLoading) {
    return <div className="text-sm text-slate-400">Loading invites...</div>;
  }

  if (!invites || invites.length === 0) {
    return (
      <div className="text-sm text-slate-400">
        No pending invitations
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-100">
        Organization Invites
      </h1>

      {invites.map((invite: Invite) => (
        <div
          key={invite._id}
          className="border border-slate-800 bg-slate-900 rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <div className="text-sm font-medium text-slate-100">
              {invite.orgId.name}
            </div>
            <div className="text-xs text-slate-400">
              Role: {invite.role}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => acceptMutation.mutate(invite._id)}
              className="px-3 py-1.5 text-xs rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Accept
            </button>

            <button
              onClick={() => rejectMutation.mutate(invite._id)}
              className="px-3 py-1.5 text-xs rounded-md bg-rose-600 hover:bg-rose-500 text-white"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
