import { createFileRoute } from "@tanstack/react-router";
import { loadSettings } from "@/admin/api/content";
import { SettingsEditor } from "@/admin/screens/SettingsEditor";
import { COMPANY_FORM } from "@/admin/specs/settings";
import { ScreenSkeleton } from "@/admin/ui/controls";

export const Route = createFileRoute("/admin/company")({
  loader: () => loadSettings(),
  head: () => ({ meta: [{ title: "Company & Contact — Durall Admin" }] }),
  pendingComponent: ScreenSkeleton,
  component: Screen,
});

function Screen() {
  const { settings } = Route.useLoaderData();
  return (
    <SettingsEditor
      title="Company & Contact"
      description="The company name, the direct lines, and the head office on the map."
      sections={COMPANY_FORM}
      parts={["company", "contact", "office"]}
      settings={settings}
    />
  );
}
