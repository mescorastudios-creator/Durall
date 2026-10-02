import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { blankArticle, blankPartner, blankProject, blankRole } from "@/content/defaults";
import { withDefaults } from "@/content/merge";
import { isPageKey, PAGES } from "@/content/pages";
import { readingTimeOf } from "@/content/select";
import { SEED } from "@/content/seed";
import type {
  ArticleDoc,
  PageKey,
  PageMap,
  PartnerDoc,
  ProjectDoc,
  RoleDoc,
  SharedContent,
  SiteSettings,
} from "@/content/types";
import { can, type Member, type Section } from "@/admin/permissions";
import { currentMember, fail, logActivity, requireMember, requireOwner } from "@/server/auth";
import { purgeContentCache } from "@/server/cache";
import { databaseStore, markImported, seedStore, type ContentStore } from "@/server/store";
import { isSupabaseConfigured } from "@/server/supabase";
import { docSchema, idSchema, input, parse, slugSchema } from "@/server/validate";

/**
 * Reading and saving content from the admin panel.
 *
 * Reads go through the signed-in member's session, so drafts are included;
 * before the database exists, or before the first import, they return the
 * bundled content and mark it read-only. Every save checks the member's
 * access to the section, is written through row-level security as that
 * member, lands in the activity log and purges the CDN copies of the site.
 */

type Session = NonNullable<Awaited<ReturnType<typeof currentMember>>>;

async function isImported(db: SupabaseClient) {
  const { data, error } = await db.from("settings").select("key").eq("key", "site").maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/** The store the panel reads from, and whether what it shows can be saved. */
async function adminStore(
  section?: Section,
): Promise<{ store: ContentStore; editable: boolean; member: Member | null }> {
  if (!isSupabaseConfigured()) return { store: seedStore, editable: false, member: null };
  const { db, member } = await requireMember(section);
  if (!(await isImported(db))) return { store: seedStore, editable: false, member };
  return { store: databaseStore(db), editable: true, member };
}

async function saved(
  session: Session,
  action: string,
  entity: string,
  id: string,
  summary: string,
) {
  await logActivity(session, action, entity, id, summary);
  await purgeContentCache();
}

function dbError(error: { message: string; code?: string } | null, what: string): void {
  if (!error) return;
  if (error.code === "23505") fail(`Another ${what} already uses that web address.`, 409);
  console.error(`[admin] ${what} write failed`, error);
  fail(`The ${what} could not be saved: ${error.message}`, 500);
}

/* ── Status ──────────────────────────────────────────────────────────────── */

/** Whether the database is connected and imported, for the dashboard's setup card. */
export const getContentStatus = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseConfigured()) return { configured: false, imported: false };
  const { db } = await requireMember();
  return { configured: true, imported: await isImported(db) };
});

/**
 * Copies the bundled content into the database — the owner's first step
 * after connecting it. Refuses to overwrite unless asked to, since after the
 * first import the database is where the real content lives.
 */
export const importSiteContent = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ overwrite: z.boolean() })))
  .handler(async ({ data }) => {
    const session = await requireOwner();
    const { db, member } = session;
    if ((await isImported(db)) && !data.overwrite) {
      fail("The site's content is already in the database.", 409);
    }
    const by = member.id;
    const steps = [
      db.from("settings").upsert([
        { key: "site", content: SEED.settings, updated_by: by },
        { key: "shared", content: SEED.shared, updated_by: by },
      ]),
      db
        .from("pages")
        .upsert(
          PAGES.map((page) => ({ key: page.key, content: SEED.pages[page.key], updated_by: by })),
        ),
      db.from("projects").upsert(SEED.projects.map((p) => projectRow(p, by))),
      db.from("articles").upsert(SEED.articles.map((a) => articleRow(a, by))),
      db.from("career_roles").upsert(SEED.roles.map((r) => roleRow(r, by))),
      db.from("partners").upsert(SEED.partners.map((p) => partnerRow(p, by))),
    ];
    for (const step of steps) {
      const { error } = await step;
      dbError(error, "import");
    }
    markImported(true);
    await saved(session, "import", "site", "", "Imported the site's current content");
    return { ok: true };
  });

/* ── Settings and shared sections ───────────────────────────────────────── */

/** Which admin section owns each part of the site settings. */
const SETTINGS_PARTS = {
  header: "navigation",
  footer: "navigation",
  company: "company",
  contact: "company",
  office: "company",
  seo: "settings",
  behaviour: "settings",
  notFound: "settings",
} as const satisfies Record<keyof SiteSettings, Section>;

type SettingsPart = keyof typeof SETTINGS_PARTS;

export const loadSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { store, editable } = await adminStore();
  return { settings: await store.settings(), editable };
});

export const saveSettingsParts = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        // partialRecord: zod 4's record with enum keys is exhaustive, and
        // would fill every part not sent with undefined, resetting the
        // other screens' settings and demanding access to all of them.
        parts: z.partialRecord(
          z.enum(Object.keys(SETTINGS_PARTS) as [SettingsPart, ...SettingsPart[]]),
          z.unknown(),
        ),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const names = (Object.keys(data.parts) as SettingsPart[]).filter(
      (name) => data.parts[name] !== undefined,
    );
    if (!names.length) fail("Nothing to save.");
    const session = await requireMember();
    for (const name of names) await requireMember(SETTINGS_PARTS[name]);
    // Only the parts sent are rewritten. The rest go back exactly as stored,
    // so the database can see which parts this save changed and check each
    // against the saver's sections (0003_section_access.sql).
    const { data: row, error: readError } = await session.db
      .from("settings")
      .select("content")
      .eq("key", "site")
      .maybeSingle();
    dbError(readError, "settings");
    const stored = ((row as { content?: unknown } | null)?.content ?? {}) as Record<
      string,
      unknown
    >;
    const content: Record<string, unknown> = { ...stored };
    for (const name of names) {
      content[name] = withDefaults(SEED.settings[name] as unknown, data.parts[name]);
    }
    const { error } = await session.db.from("settings").upsert({
      key: "site",
      content,
      updated_by: session.member.id,
      updated_at: new Date().toISOString(),
    });
    dbError(error, "settings");
    await saved(session, "update", "settings", names.join(","), `Updated ${names.join(", ")}`);
    return { settings: withDefaults(SEED.settings, content) };
  });

export const loadShared = createServerFn({ method: "GET" }).handler(async () => {
  const { store, editable } = await adminStore("pages");
  return { shared: await store.shared(), editable };
});

export const saveShared = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ content: docSchema })))
  .handler(async ({ data }) => {
    const session = await requireMember("pages");
    const next: SharedContent = withDefaults(SEED.shared, data.content);
    const { error } = await session.db.from("settings").upsert({
      key: "shared",
      content: next,
      updated_by: session.member.id,
      updated_at: new Date().toISOString(),
    });
    dbError(error, "shared sections");
    await saved(session, "update", "page", "shared", "Updated the shared sections");
    return { shared: next };
  });

/* ── Pages ───────────────────────────────────────────────────────────────── */

const pageKey = z.string().refine(isPageKey, "Unknown page") as unknown as z.ZodType<PageKey>;

export const loadPage = createServerFn({ method: "GET" })
  .inputValidator(input(pageKey))
  .handler(async ({ data: key }) => {
    const { store, editable } = await adminStore("pages");
    return { page: (await store.page(key)) as PageMap[PageKey], editable };
  });

export const savePage = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ key: pageKey, content: docSchema })))
  .handler(async ({ data }) => {
    const session = await requireMember("pages");
    const next = withDefaults(SEED.pages[data.key], data.content);
    const { error } = await session.db.from("pages").upsert({
      key: data.key,
      content: next,
      updated_by: session.member.id,
      updated_at: new Date().toISOString(),
    });
    dbError(error, "page");
    const label = PAGES.find((page) => page.key === data.key)?.label ?? data.key;
    await saved(session, "update", "page", data.key, `Updated the ${label} page`);
    return { page: next as PageMap[PageKey] };
  });

/* ── Collections ─────────────────────────────────────────────────────────── */

function projectRow(doc: ProjectDoc, by: string) {
  return {
    id: doc.id,
    slug: doc.slug,
    status: doc.status,
    position: doc.order,
    data: doc,
    updated_by: by,
    updated_at: new Date().toISOString(),
  };
}

function articleRow(doc: ArticleDoc, by: string) {
  return {
    id: doc.id,
    slug: doc.slug,
    status: doc.status,
    published_at: doc.publishedAt || null,
    data: doc,
    updated_by: by,
    updated_at: new Date().toISOString(),
  };
}

function roleRow(doc: RoleDoc, by: string) {
  return {
    id: doc.id,
    position: doc.order,
    open: doc.open,
    data: doc,
    updated_by: by,
    updated_at: new Date().toISOString(),
  };
}

function partnerRow(doc: PartnerDoc, by: string) {
  return {
    id: doc.id,
    kind: doc.kind,
    position: doc.order,
    visible: doc.visible,
    data: doc,
    updated_by: by,
    updated_at: new Date().toISOString(),
  };
}

const newId = () => crypto.randomUUID();

/* Projects */

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { store, editable } = await adminStore("projects");
  return { projects: await store.projects(), editable };
});

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ doc: docSchema })))
  .handler(async ({ data }) => {
    const session = await requireMember("projects");
    const doc: ProjectDoc = withDefaults(blankProject(), data.doc);
    doc.id ||= newId();
    doc.slug = parse(slugSchema, doc.slug);
    if (!doc.name.trim()) fail("Give the project a name.");
    const { error } = await session.db.from("projects").upsert(projectRow(doc, session.member.id));
    dbError(error, "project");
    // Only one project leads the portfolio.
    if (doc.isFeatured) {
      const others = (await databaseStore(session.db).projects()).filter(
        (p) => p.isFeatured && p.id !== doc.id,
      );
      for (const other of others) {
        await session.db
          .from("projects")
          .update({ data: { ...other, isFeatured: false } })
          .eq("id", other.id);
      }
    }
    await saved(session, "save", "project", doc.id, `Saved project "${doc.name}"`);
    return { doc };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const session = await requireMember("projects");
    const { error } = await session.db.from("projects").delete().eq("id", data.id);
    dbError(error, "project");
    await saved(session, "delete", "project", data.id, "Deleted a project");
    return { ok: true };
  });

/* Articles */

export const listArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { store, editable } = await adminStore("insights");
  return { articles: await store.articles(), editable };
});

export const saveArticle = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ doc: docSchema, autoReadingTime: z.boolean() })))
  .handler(async ({ data }) => {
    const session = await requireMember("insights");
    const doc: ArticleDoc = withDefaults(blankArticle(), data.doc);
    doc.id ||= newId();
    doc.slug = parse(slugSchema, doc.slug);
    if (!doc.title.trim()) fail("Give the article a title.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.publishedAt)) fail("Choose a publication date.");
    if (data.autoReadingTime) doc.readingTime = readingTimeOf(doc);
    const { error } = await session.db.from("articles").upsert(articleRow(doc, session.member.id));
    dbError(error, "article");
    await saved(session, "save", "article", doc.id, `Saved article "${doc.title}"`);
    return { doc };
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const session = await requireMember("insights");
    const { error } = await session.db.from("articles").delete().eq("id", data.id);
    dbError(error, "article");
    await saved(session, "delete", "article", data.id, "Deleted an article");
    return { ok: true };
  });

/* Careers: the roles, saved as one list (they are few and edited together). */

export const listRoles = createServerFn({ method: "GET" }).handler(async () => {
  const { store, editable } = await adminStore("careers");
  return { roles: await store.roles(), editable };
});

export const saveRoles = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ roles: z.array(docSchema).max(100) })))
  .handler(async ({ data }) => {
    const session = await requireMember("careers");
    const roles = data.roles.map((raw, index) => {
      const role: RoleDoc = withDefaults(blankRole(), raw);
      role.id ||= newId();
      role.order = index;
      if (!role.title.trim()) fail(`Role ${index + 1} needs a title.`);
      return role;
    });
    await replaceList(
      session,
      "career_roles",
      roles.map((r) => roleRow(r, session.member.id)),
    );
    await saved(session, "update", "careers", "", `Updated open roles (${roles.length})`);
    return { roles };
  });

/* Partners and practices, saved as one list per kind. */

export const listPartners = createServerFn({ method: "GET" }).handler(async () => {
  const { store, editable } = await adminStore("partners");
  return { partners: await store.partners(), editable };
});

export const savePartners = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        kind: z.enum(["partner", "practice"]),
        items: z.array(docSchema).max(100),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const session = await requireMember("partners");
    const items = data.items.map((raw, index) => {
      const item: PartnerDoc = withDefaults(blankPartner(), raw);
      item.id ||= newId();
      item.kind = data.kind;
      item.order = index;
      if (!item.name.trim()) fail(`Entry ${index + 1} needs a name.`);
      return item;
    });
    await replaceList(
      session,
      "partners",
      items.map((p) => partnerRow(p, session.member.id)),
      { column: "kind", value: data.kind },
    );
    const label = data.kind === "partner" ? "international partners" : "design practices";
    await saved(session, "update", "partners", data.kind, `Updated ${label} (${items.length})`);
    return { items };
  });

/**
 * Saves a whole list: upserts what is there and deletes what was removed.
 * `scope` limits the delete to one kind in a shared table.
 */
async function replaceList(
  session: Session,
  table: string,
  rows: { id: string }[],
  scope?: { column: string; value: string },
) {
  const { db } = session;
  if (rows.length) {
    const { error } = await db.from(table).upsert(rows);
    dbError(error, "list");
  }
  let query = db.from(table).select("id");
  if (scope) query = query.eq(scope.column, scope.value);
  const { data: existing, error } = await query;
  dbError(error, "list");
  const keep = new Set(rows.map((row) => row.id));
  const gone = ((existing ?? []) as { id: string }[])
    .map((row) => row.id)
    .filter((id) => !keep.has(id));
  if (gone.length) {
    const { error: deleteError } = await db.from(table).delete().in("id", gone);
    dbError(deleteError, "list");
  }
}

/** Moves projects in the portfolio (and the "next project" sequence). */
export const reorderProjects = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ ids: z.array(idSchema).max(500) })))
  .handler(async ({ data }) => {
    const session = await requireMember("projects");
    for (const [position, id] of data.ids.entries()) {
      const { data: row, error } = await session.db
        .from("projects")
        .select("data")
        .eq("id", id)
        .maybeSingle();
      dbError(error, "project");
      if (!row) continue;
      const { error: updateError } = await session.db
        .from("projects")
        .update({ position, data: { ...(row as { data: object }).data, order: position } })
        .eq("id", id);
      dbError(updateError, "project");
    }
    await saved(session, "reorder", "project", "", "Reordered projects");
    return { ok: true };
  });

/**
 * Everything at once, for the screens that look across the whole site: the
 * media library's "where is this used" and the dashboard's checklist.
 */
export const loadAllContent = createServerFn({ method: "GET" }).handler(async () => {
  const { store, editable, member } = await adminStore();
  // Every member sees what the site shows; drafts, closed roles and hidden
  // partners only in the sections they were given.
  const visible = <T>(section: Section, items: T[], live: (item: T) => boolean) =>
    !member || can(member, section) ? items : items.filter(live);
  const [settings, shared, allProjects, allArticles, allRoles, allPartners, pageList] =
    await Promise.all([
      store.settings(),
      store.shared(),
      store.projects(),
      store.articles(),
      store.roles(),
      store.partners(),
      Promise.all(PAGES.map(async (page) => [page.key, await store.page(page.key)] as const)),
    ]);
  return {
    editable,
    settings,
    shared,
    pages: Object.fromEntries(pageList) as PageMap,
    projects: visible("projects", allProjects, (p) => p.status === "published"),
    articles: visible("insights", allArticles, (a) => a.status === "published"),
    roles: visible("careers", allRoles, (r) => r.open),
    partners: visible("partners", allPartners, (p) => p.visible),
  };
});

export type AllContent = Awaited<ReturnType<typeof loadAllContent>>;
