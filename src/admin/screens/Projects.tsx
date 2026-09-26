import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Star, Trash2 } from "lucide-react";
import { blankProject, slugify } from "@/content/defaults";
import { imageOf } from "@/content/render";
import { byOrder } from "@/content/select";
import type { ProjectDoc } from "@/content/types";
import { deleteProject, reorderProjects, saveProject } from "@/admin/api/content";
import { useAdmin } from "@/admin/context";
import { SchemaForm } from "@/admin/form/fields";
import { SaveBar, useEditor } from "@/admin/lib/editor";
import { FEATURE_FORM, projectForm } from "@/admin/specs/collections";
import {
  Badge,
  Button,
  ButtonLink,
  buttonClass,
  Card,
  EmptyState,
  Field,
  IconButton,
  PageHeader,
  Select,
  TextInput,
} from "@/admin/ui/controls";
import { errorMessage, useConfirm, useToast } from "@/admin/ui/overlay";

/* ── List ────────────────────────────────────────────────────────────────── */

export function ProjectsList({ projects: initial }: { projects: ProjectDoc[] }) {
  const { editable } = useAdmin();
  const toast = useToast();
  const router = useRouter();
  const [projects, setProjects] = useState(() => [...initial].sort(byOrder));
  const [saving, setSaving] = useState(false);

  const moveTo = async (from: number, to: number) => {
    const next = [...projects];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    setProjects(next);
    setSaving(true);
    try {
      await reorderProjects({ data: { ids: next.map((p) => p.id) } });
      await router.invalidate();
    } catch (error) {
      toast({ tone: "error", title: "Order not saved", body: errorMessage(error) });
      setProjects(projects);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every project on the site. Their order here is their order in the portfolio and in the “Next project” links."
        actions={
          editable ? (
            <ButtonLink to="/admin/projects/$id" params={{ id: "new" }} variant="primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Project
            </ButtonLink>
          ) : null
        }
      />
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          body="Add the first project and it appears in the portfolio as soon as it is published."
        />
      ) : (
        <ol aria-busy={saving} className="grid gap-2">
          {projects.map((project, index) => {
            const thumb = imageOf(project.home.show ? project.home.image : project.hero.image);
            return (
              <li
                key={project.id}
                className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-white p-2.5 pr-3 transition-[border-color] duration-150 hover:border-navy/25"
              >
                <span className="w-6 shrink-0 text-center text-xs text-slate tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img
                  src={thumb.srcSet?.split(",")[0]?.trim().split(" ")[0] ?? thumb.src}
                  alt=""
                  width={thumb.width}
                  height={thumb.height}
                  loading="lazy"
                  className="h-12 w-16 shrink-0 rounded-lg bg-glass object-cover"
                />
                <Link
                  to="/admin/projects/$id"
                  params={{ id: project.id }}
                  className="admin-focus min-w-0 flex-1 rounded-lg"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-navy">
                      {project.name || "Untitled project"}
                    </span>
                    {project.isFeatured ? (
                      <Badge tone="info">
                        <Star className="h-3 w-3" aria-hidden="true" /> Featured
                      </Badge>
                    ) : null}
                    {project.placeholder ? <Badge tone="warning">Case study to write</Badge> : null}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate">
                    {[project.location, project.architect].filter(Boolean).join(" · ") ||
                      "No details yet"}
                    {project.home.show ? " · On the home page" : ""}
                    {!project.inPortfolio ? " · Not in the grid" : ""}
                  </span>
                </Link>
                <Badge tone={project.status === "published" ? "success" : "neutral"}>
                  {project.status === "published" ? "Published" : "Draft"}
                </Badge>
                {editable ? (
                  <div className="hidden shrink-0 sm:flex">
                    <IconButton
                      label={`Move ${project.name} up`}
                      disabled={index === 0 || saving}
                      onClick={() => void moveTo(index, index - 1)}
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                    <IconButton
                      label={`Move ${project.name} down`}
                      disabled={index === projects.length - 1 || saving}
                      onClick={() => void moveTo(index, index + 1)}
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}

/* ── Editor ──────────────────────────────────────────────────────────────── */

export function ProjectEditor({
  project,
  all,
  isNew,
}: {
  project: ProjectDoc;
  all: ProjectDoc[];
  isNew: boolean;
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const editor = useEditor(project, async (doc) => (await saveProject({ data: { doc } })).doc);
  const doc = editor.draft;
  const others = useMemo(() => all.filter((p) => p.id !== doc.id), [all, doc.id]);
  const sections = useMemo(() => projectForm(others), [others]);
  const savedOnce = Boolean(editor.saved.id);

  const setName = (name: string) =>
    editor.setDraft({ ...doc, name, ...(slugTouched ? {} : { slug: slugify(name) }) });

  const remove = async () => {
    const ok = await confirm({
      title: `Delete “${doc.name || "this project"}”?`,
      body: "It disappears from the site straight away. Its photographs stay in the media library.",
      confirmLabel: "Delete Project",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteProject({ data: { id: doc.id } });
      toast({ tone: "success", title: "Project deleted" });
      await navigate({ to: "/admin/projects", ignoreBlocker: true });
    } catch (error) {
      toast({ tone: "error", title: "Not deleted", body: errorMessage(error) });
    }
  };

  // Once a new project is saved it has an id: move to its own address.
  useEffect(() => {
    if (!isNew || !savedOnce) return;
    void navigate({
      to: "/admin/projects/$id",
      params: { id: editor.saved.id },
      replace: true,
      ignoreBlocker: true,
    });
  }, [editor.saved.id, isNew, navigate, savedOnce]);

  return (
    <>
      <SaveBar
        title={doc.name || "New project"}
        dirty={editor.dirty}
        saving={editor.saving}
        editable={editor.editable}
        onSave={() => void editor.submit()}
        onDiscard={() => void editor.discard()}
        extra={
          editor.saved.status === "published" && editor.saved.slug ? (
            <a
              href={`/projects/${editor.saved.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("ghost", "sm")}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View on Site
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null
        }
      />
      <PageHeader
        title={doc.name || "New Project"}
        back={{ to: "/admin/projects", label: "All projects" }}
        actions={
          editor.editable && savedOnce ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void remove()}
              className="text-[#b42318] hover:bg-[#b42318]/8 hover:text-[#b42318]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </Button>
          ) : null
        }
      />
      <div className="grid gap-5">
        <Card title="Name & Status">
          <fieldset disabled={!editor.editable} className="grid gap-5 md:grid-cols-2">
            <Field label="Name">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={doc.name}
                  autoComplete="off"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Parikrama — Murud House…"
                />
              )}
            </Field>
            <Field label="Status" hint="Drafts are saved but not shown on the site.">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={doc.status}
                  onChange={(event) =>
                    editor.setDraft({ ...doc, status: event.target.value as ProjectDoc["status"] })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              )}
            </Field>
            <Field
              label="Web address"
              hint={
                <>
                  /projects/
                  <strong className="font-medium text-navy">{doc.slug || "…"}</strong>
                  {" · "}Changing it breaks links people already have.
                </>
              }
              className="md:col-span-2"
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={doc.slug}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(event) => {
                    setSlugTouched(true);
                    editor.setDraft({
                      ...doc,
                      slug: slugify(event.target.value) || event.target.value.toLowerCase(),
                    });
                  }}
                  className="font-mono text-[0.8125rem]"
                />
              )}
            </Field>
          </fieldset>
        </Card>
        <SchemaForm
          sections={
            doc.isFeatured
              ? [...sections.slice(0, 2), FEATURE_FORM, ...sections.slice(2)]
              : sections
          }
          value={doc}
          onChange={editor.setDraft}
          disabled={!editor.editable}
        />
      </div>
    </>
  );
}

/** The document a "New project" screen starts from. */
export function newProject(all: ProjectDoc[]): ProjectDoc {
  const order = all.reduce((max, p) => Math.max(max, p.order), -1) + 1;
  return blankProject("", order);
}
