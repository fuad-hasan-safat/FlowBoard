import { useQuery } from "@tanstack/react-query";
import { useOrgStore } from "../../store/org.store";
import { fetchActivityApi } from "../../api/activityApi";


export default function ActivityFeed() {
  const orgId = useOrgStore((s) => s.orgId);

  const { data } = useQuery({
    queryKey: ["activity", orgId],
    queryFn: () => fetchActivityApi(orgId!),
    enabled: !!orgId
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Activity</h3>

      <div className="space-y-2">
        {data?.map((a) => (
          <div key={a._id} className="text-xs text-slate-300">
            <span className="font-medium">{a.actorId.name}</span>{" "}
            <span className="text-slate-400">
              {a.type.replace("_", " ").toLowerCase()}
            </span>
            <div className="text-[10px] text-slate-500">
              {new Date(a.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
