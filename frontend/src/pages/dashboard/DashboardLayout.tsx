import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useOrgStore } from "../../store/org.store";
import OrgSelector from "../components/dashboard/OrgSelector";
import NotificationBell from "../../components/NotificationBell";
import { useNotificationRealtime } from "../../hooks/useNotificationRealtime";

export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orgId = useOrgStore((s) => s.orgId);
  useNotificationRealtime()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between bg-slate-900/70 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">FlowBoard</span>

          {orgId && (
            <nav className="flex gap-3 text-xs">
              <Link to="/app" className="text-slate-400 hover:text-slate-200">
                Projects
              </Link>

              <Link
                to="/app/activity"
                className="text-slate-400 hover:text-slate-200"
              >
                Activity
              </Link>

              <Link
                to="/app/invites"
                className="text-slate-400 hover:text-slate-200"
              >
                Invites
              </Link>

              <Link
                to="/app/org/members"
                className="text-slate-400 hover:text-slate-200"
              >
                Members
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-6">
          <OrgSelector />

          <div className="flex items-center gap-3">
            <div className="text-xs text-right">
              <div className="font-medium">{user?.name}</div>
              <div className="text-slate-400">{user?.email}</div>
            </div>
            <NotificationBell />

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
