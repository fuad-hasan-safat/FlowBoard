import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrgStore } from "../../store/org.store";
import {
  fetchProjectsApi,
  createProjectApi,
  type Project,
} from "../../api/projectApi";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const orgId = useOrgStore((s) => s.orgId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", orgId],
    queryFn: () => fetchProjectsApi(orgId!),
    enabled: !!orgId,
  });

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createProjectApi(orgId!, data),
    onSuccess: () => {
      setForm({ name: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["projects", orgId] });
    },
  });

  const handleCreateProject = (e: FormEvent) => {
    e.preventDefault();
    if (!orgId || !form.name.trim()) return;
    createProject({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
    });
  };

  if (!orgId) {
    return (
      <div className="text-sm text-slate-300">No organization selected.</div>
    );
  }

  return (
    <div className="grid grid-cols-[2fr,3fr] gap-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">Projects</h2>

        {isLoading ? (
          <p className="text-sm text-slate-400">Loading projects...</p>
        ) : projects && projects.length > 0 ? (
          <ul className="space-y-2">
            {projects.map((p: Project) => (
              <li
                key={p._id}
                onClick={() => navigate(`/app/projects/${p._id}`)}
                className="border border-slate-800 rounded-lg px-3 py-2 bg-slate-900 hover:bg-slate-800 cursor-pointer"
              >
                <div className="text-sm font-medium">{p.name}</div>
                {p.description && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    {p.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">No projects yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Create new project</h2>
        <form onSubmit={handleCreateProject} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Name</label>
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-slate-50 px-4 py-2 text-sm font-medium"
          >
            {isPending ? "Creating..." : "Create project"}
          </button>
        </form>
      </section>
    </div>
  );
}
