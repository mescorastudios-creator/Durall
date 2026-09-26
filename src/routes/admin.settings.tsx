import { createFileRoute } from "@tanstack/react-router";
import { loadSettings } from "@/admin/api/content";
import { SettingsEditor } from "@/admin/screens/SettingsEditor";
import { SITE_SETTINGS_FORM } from "@/admin/specs/settings";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/settings")({
  loader: () => loadSettings(),
  head: () => ({ meta: [{ title: "Site Settings — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { settings } = Route.useLoaderData();
  return (
    <SettingsEditor
      title="Site Settings"
      description="Motion, the default share image, and the page-not-found message."
      sections={SITE_SETTINGS_FORM}
      parts={["seo", "behaviour", "notFound"]}
      settings={settings}
    />
  );
}
