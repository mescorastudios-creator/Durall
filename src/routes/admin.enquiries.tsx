import { createFileRoute } from "@tanstack/react-router";
import { listEnquiries } from "@/admin/api/inbox";
import { EnquiriesScreen } from "@/admin/screens/Enquiries";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/enquiries")({
  loader: () => listEnquiries(),
  head: () => ({ meta: [{ title: "Enquiries — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { enquiries } = Route.useLoaderData();
  return <EnquiriesScreen enquiries={enquiries} />;
}
