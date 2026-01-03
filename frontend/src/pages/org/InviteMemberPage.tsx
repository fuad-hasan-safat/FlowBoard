import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useOrgStore } from "../../store/org.store";
import axiosClient from "../../api/axiosClient";
import { useOrgPermissions } from "../../hooks/useOrgPermissions";

export default function InviteMemberPage() {
  const orgId = useOrgStore((s) => s.orgId);
  const [email, setEmail] = useState("");
  const perms = useOrgPermissions();

  const inviteMutation = useMutation({
    mutationFn: async () => {
      return axiosClient.post(`/orgs/${orgId}/invites`, { email });
    },
    onSuccess: () => {
      setEmail("");
      alert("Invitation sent");
    },
  });



  if (!orgId) {
    return (
      <div className="text-sm text-slate-400">
        Select an organization first.
      </div>
    );
  }

  if(!perms?.inviteMembers){
    return (
      <div>
        <h3>You are not allowed, only owner can Invite</h3>
      </div>
    )
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-lg font-semibold">Invite member</h1>

      <input
        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm"
        placeholder="user@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={() => inviteMutation.mutate()}
        disabled={inviteMutation.isPending}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
      >
        {inviteMutation.isPending ? "Sending..." : "Send invite"}
      </button>
    </div>
  );
}
