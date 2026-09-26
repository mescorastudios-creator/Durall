import { useEffect, useId, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Heading2,
  ImageIcon,
  List,
  Pilcrow,
  Pin,
  Plus,
  Quote,
  Search,
  Trash2,
} from "lucide-react";
import { blankArticle, slugify } from "@/content/defaults";
import { imageOf } from "@/content/render";
import { formatDate, readingTimeOf } from "@/content/select";
import type { ArticleBlock, ArticleDoc } from "@/content/types";
import { deleteArticle, saveArticle } from "@/admin/api/content";
import { useAdmin } from "@/admin/context";
import { FieldControl, PhotoField } from "@/admin/form/fields";
import { SaveBar, useEditor } from "@/admin/lib/editor";
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
  TextArea,
  TextInput,
  Toggle,
} from "@/admin/ui/controls";
import { errorMessage, useConfirm, useToast } from "@/admin/ui/overlay";
import { cn } from "@/lib/utils";

/* ── List ────────────────────────────────────────────────────────────────── */

export function ArticlesList({ articles }: { articles: ArticleDoc[] }) {
  const { editable } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt),
      ),
    [articles],
  );
  const needle = query.trim().toLowerCase();
  const shown = sorted.filter(
    (a) =>
      (status === "all" || a.status === status) &&
      (!needle || `${a.title} ${a.category} ${a.excerpt}`.toLowerCase().includes(needle)),
  );

  return (
    <>
      <PageHeader
        title="Insights"
        description="The articles on the Insights page. The newest published one leads the list, unless one is pinned."
        actions={
          editable ? (
            <ButtonLink to="/admin/insights/$id" params={{ id: "new" }} variant="primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Article
            </ButtonLink>
          ) : null
        }
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Show" className="inline-flex rounded-full bg-navy/6 p-1">
          {(["all", "published", "draft"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={status === key}
              onClick={() => setStatus(key)}
              className={cn(
                "admin-focus min-h-8 rounded-full px-3.5 text-xs font-medium capitalize transition-colors duration-150",
                status === key ? "bg-white text-navy shadow-sm" : "text-slate hover:text-navy",
              )}
            >
              {key === "all" ? "All" : key === "published" ? "Published" : "Drafts"}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate"
          />
          <TextInput
            type="search"
            aria-label="Search articles"
            placeholder="Search articles…"
            value={query}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {shown.length === 0 ? (
        <EmptyState
          title={articles.length ? "No articles match" : "No articles yet"}
          body={
            articles.length
              ? "Try another search or filter."
              : "Write the first one: it can stay a draft until it is ready."
          }
        />
      ) : (
        <ul className="grid gap-2">
          {shown.map((article) => {
            const cover = imageOf(article.cover.image);
            return (
              <li key={article.id}>
                <Link
                  to="/admin/insights/$id"
                  params={{ id: article.id }}
                  className="admin-focus flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-2.5 pr-4 transition-[border-color] duration-150 hover:border-navy/25"
                >
                  <img
                    src={cover.srcSet?.split(",")[0]?.trim().split(" ")[0] ?? cover.src}
                    alt=""
                    width={cover.width}
                    height={cover.height}
                    loading="lazy"
                    className="h-14 w-20 shrink-0 rounded-lg bg-glass object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-medium text-navy">
                        {article.title || "Untitled article"}
                      </span>
                      {article.pinned ? (
                        <Badge tone="info">
                          <Pin className="h-3 w-3" aria-hidden="true" /> Pinned
                        </Badge>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate">
                      {[article.category, formatDate(article.publishedAt), article.readingTime]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <Badge tone={article.status === "published" ? "success" : "neutral"}>
                    {article.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/* ── Editor ──────────────────────────────────────────────────────────────── */

export function ArticleEditor({
  article,
  categories,
  isNew,
}: {
  article: ArticleDoc;
  categories: string[];
  isNew: boolean;
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [autoTime, setAutoTime] = useState(isNew || article.readingTime === readingTimeOf(article));
  const editor = useEditor(
    article,
    async (doc) => (await saveArticle({ data: { doc, autoReadingTime: autoTime } })).doc,
  );
  const doc = editor.draft;
  const set = (patch: Partial<ArticleDoc>) => editor.setDraft({ ...doc, ...patch });
  const savedOnce = Boolean(editor.saved.id);
  const categoryList = useId();

  useEffect(() => {
    if (!isNew || !savedOnce) return;
    void navigate({
      to: "/admin/insights/$id",
      params: { id: editor.saved.id },
      replace: true,
      ignoreBlocker: true,
    });
  }, [editor.saved.id, isNew, navigate, savedOnce]);

  const remove = async () => {
    const ok = await confirm({
      title: `Delete “${doc.title || "this article"}”?`,
      body: "It disappears from the site straight away and cannot be brought back.",
      confirmLabel: "Delete Article",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteArticle({ data: { id: doc.id } });
      toast({ tone: "success", title: "Article deleted" });
      await navigate({ to: "/admin/insights", ignoreBlocker: true });
    } catch (error) {
      toast({ tone: "error", title: "Not deleted", body: errorMessage(error) });
    }
  };

  return (
    <>
      <SaveBar
        title={doc.title || "New article"}
        dirty={editor.dirty}
        saving={editor.saving}
        editable={editor.editable}
        onSave={() => void editor.submit()}
        onDiscard={() => void editor.discard()}
        extra={
          editor.saved.status === "published" && editor.saved.slug ? (
            <a
              href={`/insights/${editor.saved.slug}`}
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
        title={doc.title || "New Article"}
        back={{ to: "/admin/insights", label: "All articles" }}
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
      <fieldset
        disabled={!editor.editable}
        className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="grid min-w-0 gap-5">
          <Card title="Article">
            <div className="grid gap-5">
              <Field label="Title">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={doc.title}
                    autoComplete="off"
                    placeholder="Understanding Premium Glazing…"
                    onChange={(event) =>
                      set({
                        title: event.target.value,
                        ...(slugTouched ? {} : { slug: slugify(event.target.value) }),
                      })
                    }
                  />
                )}
              </Field>
              <Field
                label="Standfirst"
                hint="The line under the title, and the summary in lists and search results."
              >
                {({ id, describedBy }) => (
                  <TextArea
                    id={id}
                    aria-describedby={describedBy}
                    rows={3}
                    value={doc.excerpt}
                    onChange={(event) => set({ excerpt: event.target.value })}
                  />
                )}
              </Field>
              <PhotoField
                label="Cover photograph"
                value={doc.cover}
                onChange={(cover) => set({ cover })}
              />
            </div>
          </Card>
          <Card
            title="Body"
            description="Headings start new sections. Paragraphs, lists and quotes take **bold**, *italic* and [links](https://…)."
          >
            <BlockEditor blocks={doc.body} onChange={(body) => set({ body })} />
          </Card>
        </div>
        <div className="grid gap-5 xl:sticky xl:top-20">
          <Card title="Publishing">
            <div className="grid gap-5">
              <Field label="Status" hint="Drafts are saved but not shown on the site.">
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    aria-describedby={describedBy}
                    value={doc.status}
                    onChange={(event) =>
                      set({ status: event.target.value as ArticleDoc["status"] })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                )}
              </Field>
              <Field label="Date">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    type="date"
                    value={doc.publishedAt}
                    onChange={(event) => set({ publishedAt: event.target.value })}
                  />
                )}
              </Field>
              <Field label="Category" hint="For example: Engineering, Fabrication, Materials.">
                {({ id, describedBy }) => (
                  <>
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      list={categoryList}
                      value={doc.category}
                      autoComplete="off"
                      onChange={(event) => set({ category: event.target.value })}
                    />
                    <datalist id={categoryList}>
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </>
                )}
              </Field>
              <Toggle
                label="Pin to the top"
                description="Leads the Insights list and the home page ahead of newer articles."
                checked={doc.pinned}
                onChange={(pinned) => set({ pinned })}
              />
              <Field
                label="Web address"
                hint={
                  <>
                    /insights/<strong className="font-medium text-navy">{doc.slug || "…"}</strong>
                  </>
                }
              >
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={doc.slug}
                    spellCheck={false}
                    autoComplete="off"
                    className="font-mono text-[0.8125rem]"
                    onChange={(event) => {
                      setSlugTouched(true);
                      set({
                        slug: slugify(event.target.value) || event.target.value.toLowerCase(),
                      });
                    }}
                  />
                )}
              </Field>
              <Toggle
                label="Work out the reading time"
                description={`About ${readingTimeOf(doc)} at the length it is now.`}
                checked={autoTime}
                onChange={setAutoTime}
              />
              {!autoTime ? (
                <Field label="Reading time">
                  {({ id, describedBy }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      value={doc.readingTime}
                      onChange={(event) => set({ readingTime: event.target.value })}
                    />
                  )}
                </Field>
              ) : null}
            </div>
          </Card>
        </div>
      </fieldset>
    </>
  );
}

export function newArticle(): ArticleDoc {
  return blankArticle("");
}

/* ── Body blocks ─────────────────────────────────────────────────────────── */

const BLOCKS = [
  { type: "heading", label: "Heading", icon: Heading2 },
  { type: "paragraph", label: "Paragraph", icon: Pilcrow },
  { type: "list", label: "List", icon: List },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "image", label: "Image", icon: ImageIcon },
] as const;

function createBlock(type: ArticleBlock["type"]): ArticleBlock {
  switch (type) {
    case "heading":
      return { type, text: "" };
    case "paragraph":
      return { type, text: "" };
    case "quote":
      return { type, text: "" };
    case "list":
      return { type, items: [""] };
    case "image":
      return {
        type,
        photo: { image: { kind: "asset", key: "heroParikrama" }, alt: "" },
        caption: "",
      };
  }
}

/**
 * The article body as a column of blocks. Deliberately plain: headings,
 * paragraphs, lists, quotes and images, each moved with buttons rather than
 * dragged, so it works the same with a keyboard, a mouse or a phone.
 */
function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ArticleBlock[];
  onChange: (next: ArticleBlock[]) => void;
}) {
  const update = (index: number, next: ArticleBlock) =>
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  const insert = (index: number, type: ArticleBlock["type"]) => {
    const copy = [...blocks];
    copy.splice(index, 0, createBlock(type));
    onChange(copy);
  };
  const move = (from: number, to: number) => {
    const copy = [...blocks];
    const [block] = copy.splice(from, 1);
    copy.splice(to, 0, block!);
    onChange(copy);
  };

  return (
    <div className="grid gap-3">
      {blocks.length === 0 ? (
        <p className="text-sm text-slate">
          The article has no body yet. Add a heading or a paragraph to begin.
        </p>
      ) : null}
      <ol className="grid gap-3">
        {blocks.map((block, index) => {
          const meta = BLOCKS.find((b) => b.type === block.type)!;
          const Icon = meta.icon;
          return (
            <li
              key={index}
              className={cn(
                "rounded-xl border border-navy/10 bg-white",
                block.type === "heading" && index > 0 && "mt-3 border-navy/20",
              )}
            >
              <div className="flex items-center justify-between gap-2 border-b border-navy/8 py-1 pr-1 pl-3">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {meta.label}
                </span>
                <div className="flex">
                  <IconButton
                    label={`Move ${meta.label.toLowerCase()} up`}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    label={`Move ${meta.label.toLowerCase()} down`}
                    disabled={index === blocks.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    label={`Remove ${meta.label.toLowerCase()}`}
                    onClick={() => onChange(blocks.filter((_, i) => i !== index))}
                    className="hover:text-[#b42318]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                </div>
              </div>
              <div className="p-3">
                <BlockBody block={block} onChange={(next) => update(index, next)} />
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-navy/15 p-2">
        <span className="px-2 text-xs text-slate">Add</span>
        {BLOCKS.map(({ type, label, icon: Icon }) => (
          <Button key={type} size="sm" variant="ghost" onClick={() => insert(blocks.length, type)}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function BlockBody({
  block,
  onChange,
}: {
  block: ArticleBlock;
  onChange: (next: ArticleBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <TextInput
          aria-label="Heading"
          value={block.text}
          autoComplete="off"
          placeholder="Section heading…"
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          className="font-display text-base font-medium"
        />
      );
    case "paragraph":
    case "quote":
      return (
        <TextArea
          aria-label={block.type === "quote" ? "Quote" : "Paragraph"}
          value={block.text}
          rows={block.type === "quote" ? 2 : 4}
          placeholder={
            block.type === "quote" ? "A line worth pulling out…" : "Write the paragraph…"
          }
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          className={block.type === "quote" ? "font-serif text-base italic" : ""}
        />
      );
    case "list":
      return (
        <FieldControl
          spec={{
            kind: "strings",
            path: "",
            label: "Points",
            item: "text",
            addLabel: "Add Point",
            min: 1,
          }}
          value={block.items}
          onChange={(items) => onChange({ ...block, items: items as string[] })}
        />
      );
    case "image":
      return (
        <div className="grid gap-4">
          <PhotoField
            label="Image"
            value={block.photo}
            onChange={(photo) => onChange({ ...block, photo })}
          />
          <Field label="Caption (optional)">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={block.caption}
                onChange={(event) => onChange({ ...block, caption: event.target.value })}
              />
            )}
          </Field>
        </div>
      );
    default:
      return null;
  }
}
