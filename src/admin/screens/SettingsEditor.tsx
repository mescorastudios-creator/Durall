import type { SectionSpec } from "@/admin/form/spec";
import { saveSettingsParts } from "@/admin/api/content";
import type { SiteSettings } from "@/content/types";
import { SectionedEditor } from "./SectionedEditor";

/**
 * One of the three settings screens. Each saves only its own parts of the
 * settings, so two people on two screens cannot overwrite each other.
 */
export function SettingsEditor({
  title,
  description,
  sections,
  parts,
  settings,
}: {
  title: string;
  description: string;
  sections: SectionSpec[];
  parts: (keyof SiteSettings)[];
  settings: SiteSettings;
}) {
  return (
    <SectionedEditor<SiteSettings>
      title={title}
      description={description}
      sections={sections}
      initial={settings}
      viewPath="/"
      save={async (value) => {
        const chosen = Object.fromEntries(parts.map((part) => [part, value[part]]));
        const { settings: next } = await saveSettingsParts({ data: { parts: chosen } });
        return next;
      }}
    />
  );
}
