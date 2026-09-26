import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { blankPartner, blankRole } from "@/content/defaults";
import type { PartnerDoc, RoleDoc } from "@/content/types";
import { savePartners, saveRoles } from "@/admin/api/content";
import { FieldControl } from "@/admin/form/fields";
import type { FieldSpec } from "@/admin/form/spec";
import { SaveBar, useEditor } from "@/admin/lib/editor";
import { partnerFields, ROLE_FIELDS } from "@/admin/specs/collections";
import { Card, Notice, PageHeader } from "@/admin/ui/controls";
import { cn } from "@/lib/utils";

/* Careers and Partners: short lists edited and saved as a whole. */

const INLINE_LINK = "admin-focus rounded font-medium text-accent-blue hover:underline";

export function CareersScreen({ roles }: { roles: RoleDoc[] }) {
  const editor = useEditor(
    roles,
    async (list) => (await saveRoles({ data: { roles: list } })).roles,
  );
  const open = editor.draft.filter((role) => role.open).length;
  const spec: FieldSpec = {
    kind: "list",
    path: "",
    label: "Roles",
    fields: ROLE_FIELDS,
    itemTitle: ((role: RoleDoc) =>
      `${role.title || "Untitled role"}${role.open ? "" : " (closed)"}`) as (item: never) => string,
    create: () => blankRole(),
    addLabel: "Add Role",
    max: 50,
  };
  return (
    <>
      <SaveBar
        title="Careers"
        dirty={editor.dirty}
        saving={editor.saving}
        editable={editor.editable}
        onSave={() => void editor.submit()}
        onDiscard={() => void editor.discard()}
      />
      <PageHeader
        title="Careers"
        description={`${open} open ${open === 1 ? "role" : "roles"} on the Careers page. Close a role to hide it without deleting it; with none open, the page says so and invites people to write anyway.`}
      />
      <div className="grid gap-5">
        <Notice>
          The page’s headings and texts are under{" "}
          <Link to="/admin/pages/$page" params={{ page: "careers" }} className={INLINE_LINK}>
            Pages → Careers
          </Link>
          ; the address applications go to is under{" "}
          <Link to="/admin/company" className={INLINE_LINK}>
            Company &amp; Contact
          </Link>
          .
        </Notice>
        <Card>
          <fieldset disabled={!editor.editable}>
            <FieldControl
              spec={spec}
              value={editor.draft}
              onChange={(next) => editor.setDraft(next as RoleDoc[])}
            />
          </fieldset>
        </Card>
      </div>
    </>
  );
}

type PartnerLists = { partner: PartnerDoc[]; practice: PartnerDoc[] };

export function PartnersScreen({ partners }: { partners: PartnerDoc[] }) {
  const initial: PartnerLists = {
    partner: partners.filter((p) => p.kind === "partner"),
    practice: partners.filter((p) => p.kind === "practice"),
  };
  const [tab, setTab] = useState<"partner" | "practice">("partner");
  // Only the list that changed is sent, so each save logs what it touched.
  const lastSaved = useRef(initial);
  const editor = useEditor(initial, async (value: PartnerLists): Promise<PartnerLists> => {
    const next: PartnerLists = { ...value };
    for (const kind of ["partner", "practice"] as const) {
      if (JSON.stringify(value[kind]) === JSON.stringify(lastSaved.current[kind])) continue;
      next[kind] = (await savePartners({ data: { kind, items: value[kind] } })).items;
    }
    lastSaved.current = next;
    return next;
  });

  const spec = (kind: "partner" | "practice"): FieldSpec => ({
    kind: "list",
    path: kind,
    label: kind === "partner" ? "International partners" : "Design practices",
    fields: partnerFields(kind),
    itemTitle: ((item: PartnerDoc) =>
      `${item.name || "Untitled"}${item.visible ? "" : " (hidden)"}`) as (item: never) => string,
    create: () => blankPartner("", kind),
    addLabel: kind === "partner" ? "Add Partner" : "Add Practice",
    max: 40,
  });

  return (
    <>
      <SaveBar
        title="Partners"
        dirty={editor.dirty}
        saving={editor.saving}
        editable={editor.editable}
        onSave={() => void editor.submit()}
        onDiscard={() => void editor.discard()}
      />
      <PageHeader
        title="Partners"
        description="The two logo grids on the Partners page, in the order they appear."
      />
      <div
        className="mb-4 inline-flex rounded-full bg-navy/6 p-1"
        role="tablist"
        aria-label="Which list"
      >
        {(
          [
            ["partner", `International partners (${editor.draft.partner.length})`],
            ["practice", `Design practices (${editor.draft.practice.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "admin-focus min-h-8 rounded-full px-3.5 text-xs font-medium transition-colors duration-150",
              tab === key ? "bg-white text-navy shadow-sm" : "text-slate hover:text-navy",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <Card
        description={
          tab === "partner"
            ? "“A network built around specialised systems.” Logos are drawn at the height you set, so marks of different shapes carry the same weight."
            : "“Trusted alongside leading practices.”"
        }
      >
        <fieldset disabled={!editor.editable}>
          <FieldControl
            key={tab}
            spec={spec(tab)}
            value={editor.draft[tab]}
            onChange={(next) => editor.setDraft({ ...editor.draft, [tab]: next as PartnerDoc[] })}
          />
        </fieldset>
      </Card>
    </>
  );
}
