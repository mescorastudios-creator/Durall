import type { FieldSpec } from "@/admin/form/spec";

/* Small builders so the form definitions read like a list of fields rather
 * than a wall of object literals. */

type Extra = { hint?: string; wide?: boolean };

export const text = (
  path: string,
  label: string,
  extra: Extra & { placeholder?: string } = {},
): FieldSpec => ({
  kind: "text",
  path,
  label,
  ...extra,
});

export const area = (
  path: string,
  label: string,
  extra: Extra & { rows?: number } = {},
): FieldSpec => ({
  kind: "textarea",
  path,
  label,
  ...extra,
});

export const lines = (path: string, label: string, extra: Extra = {}): FieldSpec => ({
  kind: "lines",
  path,
  label,
  ...extra,
});

export const paragraphs = (
  path: string,
  label = "Paragraphs",
  extra: Extra & { min?: number } = {},
): FieldSpec => ({
  kind: "strings",
  item: "textarea",
  path,
  label,
  addLabel: "Add Paragraph",
  ...extra,
});

export const strings = (
  path: string,
  label: string,
  extra: Extra & { addLabel?: string; fixed?: boolean; min?: number } = {},
): FieldSpec => ({ kind: "strings", item: "text", path, label, ...extra });

export const twoTone = (path: string, label = "Heading", extra: Extra = {}): FieldSpec => ({
  kind: "twoTone",
  path,
  label,
  ...extra,
});

export const cta = (
  path: string,
  label = "Button",
  extra: Extra & { optional?: boolean } = {},
): FieldSpec => ({
  kind: "cta",
  path,
  label,
  ...extra,
});

export const link = (path: string, label: string, extra: Extra = {}): FieldSpec => ({
  kind: "link",
  path,
  label,
  ...extra,
});

export const photo = (path: string, label: string, extra: Extra = {}): FieldSpec => ({
  kind: "photo",
  path,
  label,
  ...extra,
});

export const image = (path: string, label: string, extra: Extra = {}): FieldSpec => ({
  kind: "image",
  path,
  label,
  ...extra,
});

export const icon = (path: string, label = "Icon"): FieldSpec => ({ kind: "icon", path, label });

export const toggle = (path: string, label: string, description?: string): FieldSpec => ({
  kind: "toggle",
  path,
  label,
  ...(description ? { description } : {}),
});

export const number = (
  path: string,
  label: string,
  extra: Extra & { step?: number; min?: number; max?: number } = {},
): FieldSpec => ({ kind: "number", path, label, ...extra });

export const group = (
  path: string,
  label: string,
  fields: FieldSpec[],
  extra: Extra = {},
): FieldSpec => ({
  kind: "group",
  path,
  label,
  fields,
  ...extra,
});

export const list = <T>(
  path: string,
  label: string,
  fields: FieldSpec[],
  itemTitle: (item: T, index: number) => string,
  extra: Extra & { create?: () => T; addLabel?: string; fixed?: boolean; max?: number } = {},
): FieldSpec => ({
  kind: "list",
  path,
  label,
  fields,
  itemTitle: itemTitle as (item: never, index: number) => string,
  ...extra,
});

export const seo = (path = "seo"): FieldSpec => ({ kind: "seo", path, label: "Search & sharing" });

/** The navy closing band's four fields. */
export const ctaBand = (path: string): FieldSpec[] => [
  text(`${path}.eyebrow`, "Small heading"),
  text(`${path}.heading`, "Heading"),
  area(`${path}.body`, "Text", { rows: 3 }),
  cta(`${path}.action`, "Button"),
];

export const iconItems = (
  path: string,
  label: string,
  extra: { fixed?: boolean; max?: number } = {},
) =>
  list<{ title: string }>(
    path,
    label,
    [icon("icon"), text("title", "Title"), area("body", "Text", { rows: 2 })],
    (item) => item.title,
    { create: () => ({ icon: "sparkles", title: "", body: "" }), ...extra },
  );
