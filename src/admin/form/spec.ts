import type { ReactNode } from "react";

/**
 * A declarative description of an edit form. Each page editor is a list of
 * sections, each section a list of fields bound to a path in the document;
 * SchemaForm draws them. Keeping the editors as data means every page gets
 * the same controls, labels and behaviour, and adding a field to the site is
 * one line here.
 */

export type Option = { value: string; label: string };

type Base = {
  /** Dot path into the value being edited, e.g. "hero.photo". "" is the value itself. */
  path: string;
  label: string;
  hint?: string;
  /** Spans the full width of a two-column row. */
  wide?: boolean;
};

export type FieldSpec =
  | (Base & { kind: "text"; placeholder?: string; max?: number })
  | (Base & { kind: "textarea"; rows?: number; placeholder?: string })
  /** A string whose line breaks are forced line breaks on the page. */
  | (Base & { kind: "lines"; rows?: number })
  /** A paragraph that may carry **bold**, *italic* and [links](…). */
  | (Base & { kind: "rich"; rows?: number })
  /** A list of strings: paragraphs, points, title lines, dropdown options. */
  | (Base & {
      kind: "strings";
      item?: "text" | "textarea";
      addLabel?: string;
      fixed?: boolean;
      min?: number;
    })
  | (Base & { kind: "twoTone" })
  | (Base & { kind: "cta"; optional?: boolean })
  | (Base & { kind: "link"; placeholder?: string })
  | (Base & { kind: "photo" })
  | (Base & { kind: "image" })
  | (Base & { kind: "logo" })
  | (Base & { kind: "icon" })
  | (Base & { kind: "toggle"; description?: string })
  | (Base & { kind: "number"; step?: number; min?: number; max?: number })
  | (Base & { kind: "select"; options: readonly Option[] })
  | (Base & { kind: "checkboxes"; options: readonly Option[] })
  | (Base & { kind: "date" })
  | (Base & { kind: "email" })
  | (Base & {
      kind: "list";
      fields: FieldSpec[];
      /** A short name for each row, shown when it is collapsed. */
      itemTitle: (item: never, index: number) => string;
      create?: () => unknown;
      addLabel?: string;
      /** The layout is designed for this many; edit in place, no add/remove. */
      fixed?: boolean;
      max?: number;
    })
  | (Base & { kind: "group"; fields: FieldSpec[] })
  /** A part that can be switched off (stored as null). */
  | (Base & { kind: "optional"; fields: FieldSpec[]; create: () => unknown; toggleLabel: string })
  | (Base & { kind: "seo" })
  | (Base & {
      kind: "custom";
      render: (value: unknown, onChange: (next: unknown) => void) => ReactNode;
    });

export type SectionSpec = {
  id: string;
  title: string;
  /** Where on the site this appears, in plain words. */
  description?: string;
  fields: FieldSpec[];
};

/* ── Paths ───────────────────────────────────────────────────────────────── */

const parts = (path: string) => (path ? path.split(".") : []);

export function getIn(value: unknown, path: string): unknown {
  let current = value;
  for (const key of parts(path)) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** A copy of `value` with `path` replaced; everything else is shared, not cloned. */
export function setIn<T>(value: T, path: string, next: unknown): T {
  const keys = parts(path);
  if (!keys.length) return next as T;
  const [head, ...rest] = keys as [string, ...string[]];
  const source = (value ?? {}) as Record<string, unknown>;
  const child = setIn(source[head], rest.join("."), next);
  if (Array.isArray(source)) {
    const copy = [...source];
    copy[Number(head)] = child;
    return copy as T;
  }
  return { ...source, [head]: child } as T;
}
