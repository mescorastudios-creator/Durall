import { createFileRoute } from "@tanstack/react-router";
import { listProjects } from "@/admin/api/content";
import { ProjectsList } from "@/admin/screens/Projects";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/projects/")({
  loader: () => listProjects(),
  head: () => ({ meta: [{ title: "Projects — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { projects } = Route.useLoaderData();
  return <ProjectsList projects={projects} />;
}
