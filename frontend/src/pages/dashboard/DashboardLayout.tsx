import { Outlet, NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useOrgStore } from "../../store/org.store";
import OrgSelector from "../components/dashboard/OrgSelector";
import { useQuery } from "@tanstack/react-query";
import { fetchInvitesApi } from "../../api/inviteApi";

export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orgId = useOrgStore((s) => s.orgId);

  // 🔔 fetch pending invites (for badge)
  const { data: invites } = useQuery({
    queryKey: ["invites"],
    queryFn: fetchInvitesApi,
  });

  const pendingCount = invites?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between bg-slate-900/70 backdrop-blur">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Task Manager</span>
            <span className="text-xs text-slate-400 border border-slate-700 rounded px-1.5 py-0.5">
              SaaS
            </span>
          </div>

          {/* Navigation */}
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `text-sm ${
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              }`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/app/invites"
            className={({ isActive }) =>
              `relative text-sm ${
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              }`
            }
          >
            Invites
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-3 text-[10px] bg-indigo-600 text-white rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </NavLink>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <OrgSelector />

          <NavLink
            to="/app/org/invite"
            className="text-sm text-slate-400 hover:text-white"
          >
            Invite member
          </NavLink>

          <NavLink
            to="/app/org/members"
            className="text-sm text-slate-400 hover:text-white"
          >
            Members
          </NavLink>

          <div className="flex items-center gap-3">
            <div className="text-xs text-right">
              <div className="font-medium">{user?.name}</div>
              <div className="text-slate-400">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="text-xs border border-slate-700 rounded-md px-2 py-1 hover:bg-slate-800 text-gray-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-4">
        {!orgId && (
          <div className="mb-4 text-sm text-yellow-300">
            Select or create an organization to get started.
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
