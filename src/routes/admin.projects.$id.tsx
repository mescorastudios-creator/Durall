import { createFileRoute, notFound } from "@tanstack/react-router";
import { listProjects } from "@/admin/api/content";
import { newProject, ProjectEditor } from "@/admin/screens/Projects";
import { ScreenSkeleton } from "@/admin/ui/controls";

/** One project's editor; "new" starts a blank one. */
export const Route = createFileRoute("/admin/projects/$id")({
  loader: async ({ params }) => {
    const { projects } = await listProjects();
    if (params.id === "new") return { project: newProject(projects), all: projects, isNew: true };
    const project = projects.find((p) => p.id === params.id);
    if (!project) throw notFound();
    return { project, all: projects, isNew: false };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.project.name || "New Project"} — Durall Admin` }],
  }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { project, all, isNew } = Route.useLoaderData();
  return <ProjectEditor key={project.id || "new"} project={project} all={all} isNew={isNew} />;
}
