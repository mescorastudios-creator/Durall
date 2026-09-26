import { createFileRoute } from "@tanstack/react-router";
import { listPartners } from "@/admin/api/content";
import { PartnersScreen } from "@/admin/screens/Lists";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/partners")({
  loader: () => listPartners(),
  head: () => ({ meta: [{ title: "Partners — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { partners } = Route.useLoaderData();
  return <PartnersScreen partners={partners} />;
}
