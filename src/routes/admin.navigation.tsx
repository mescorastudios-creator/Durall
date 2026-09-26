import { createFileRoute } from "@tanstack/react-router";
import { loadSettings } from "@/admin/api/content";
import { SettingsEditor } from "@/admin/screens/SettingsEditor";
import { NAVIGATION_FORM } from "@/admin/specs/settings";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/navigation")({
  loader: () => loadSettings(),
  head: () => ({ meta: [{ title: "Navigation & Footer — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { settings } = Route.useLoaderData();
  return (
    <SettingsEditor
      title="Navigation & Footer"
      description="The links at the top and foot of every page."
      sections={NAVIGATION_FORM}
      parts={["header", "footer"]}
      settings={settings}
    />
  );
}
