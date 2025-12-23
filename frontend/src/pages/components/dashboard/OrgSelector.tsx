import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {type FormEvent, useState } from "react";
import { createOrgApi, fetchOrgsApi } from "../../../api/orgApi";
import { useOrgStore } from "../../../store/org.store";

export default function OrgSelector() {
  const { data: orgs, isLoading } = useQuery({
    queryKey: ["orgs"],
    queryFn: fetchOrgsApi
  });

  const orgId = useOrgStore((s) => s.orgId);
  const setOrgId = useOrgStore((s) => s.setOrgId);

  const [newOrgName, setNewOrgName] = useState("");
  const queryClient = useQueryClient();

  const { mutate: createOrg, isPending } = useMutation({
    mutationFn: createOrgApi,
    onSuccess: () => {
      setNewOrgName("");
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    }
  });

  const handleCreateOrg = (e: FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    createOrg({ name: newOrgName.trim() });
  };

  if (isLoading) {
    return <span className="text-xs text-slate-400">Loading orgs...</span>;
  }

  return (
    <div className="flex items-center gap-4">
      <select
        className="bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-md px-2 py-1"
        value={orgId ?? ""}
        onChange={(e) => setOrgId(e.target.value || null)}
      >
        <option value="">Select organization</option>
        {orgs?.map((org) => (
          <option key={org.orgId} value={org.orgId}>
            {org.name} ({org.role})
          </option>
        ))}
      </select>

      <form onSubmit={handleCreateOrg} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="New org"
          className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-md px-2 py-1"
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
        />
        <button
          type="submit"
          disabled={isPending}
          className="text-xs bg-slate-700 hover:bg-slate-600 rounded-md px-2 py-1 text-gray-500"
        >
          {isPending ? "..." : "Create"}
        </button>
      </form>
    </div>
  );
}
