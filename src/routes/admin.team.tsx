import { createFileRoute } from "@tanstack/react-router";
import { listTeam } from "@/admin/api/team";
import { TeamScreen } from "@/admin/screens/Team";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/team")({
  loader: () => listTeam(),
  head: () => ({ meta: [{ title: "Users & Access — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { members } = Route.useLoaderData();
  return <TeamScreen members={members} />;
}
