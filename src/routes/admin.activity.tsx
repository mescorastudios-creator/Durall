import { createFileRoute } from "@tanstack/react-router";
import { listActivity } from "@/admin/api/inbox";
import { ActivityScreen } from "@/admin/screens/Account";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/activity")({
  loader: () => listActivity({ data: { limit: 200 } }),
  head: () => ({ meta: [{ title: "Activity — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { entries } = Route.useLoaderData();
  return <ActivityScreen entries={entries} />;
}
