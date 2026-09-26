import { createFileRoute } from "@tanstack/react-router";
import { listRoles } from "@/admin/api/content";
import { CareersScreen } from "@/admin/screens/Lists";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/careers")({
  loader: () => listRoles(),
  head: () => ({ meta: [{ title: "Careers — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { roles } = Route.useLoaderData();
  return <CareersScreen roles={roles} />;
}
