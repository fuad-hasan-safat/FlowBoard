import { useQuery } from "@tanstack/react-query";
import { fetchOrgActivityApi } from "../../api/activityApi";
import { useOrgStore } from "../../store/org.store";
import { useActivityRealtime } from "../../hooks/useActivityRealtime";

export default function ActivityFeed({type = "page"}) {
  const orgId = useOrgStore((s) => s.orgId);

  useActivityRealtime(orgId);

  const { data, isLoading } = useQuery({
    queryKey: ["activity", orgId],
    queryFn: () => fetchOrgActivityApi(orgId!),
    enabled: !!orgId,

    // 🔴 IMPORTANT
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 1 minute
  });

  if (!orgId) {
    return (
      <div className="text-sm text-slate-400">
        Select an organization to see activity.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-sm text-slate-400">Loading activity…</div>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-200">Recent Activity</h2>

      <div className="space-y-2">
        { data?.map((a, index) => {
          if(type === 'sidebar'){
            if(index > 9) return null;
          }
          return(
          <div
            key={a._id}
            className="bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs"
          >
            <div className="text-slate-200">
              <span className="font-medium">{a.actorId.name}</span>{" "}
              <span className="text-slate-400">
                {renderActivityText(a.type)}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {new Date(a.createdAt).toLocaleString()}
            </div>
          </div>
        )})}

        {!data?.length && (
          <div className="text-xs text-slate-500">No activity yet.</div>
        )}
      </div>
    </div>
  );
}

function renderActivityText(type: string) {
  switch (type) {
    case "TASK_CREATED":
      return "created a task";
    case "TASK_UPDATED":
      return "updated a task";
    case "TASK_DELETED":
      return "deleted a task";
    case "COMMENT_ADDED":
      return "added a comment";
    default:
      return type;
  }
}
