import { createServerFn } from "@tanstack/react-start";
import {
  byOrder,
  cardOf,
  featuredProject,
  homeCardsOf,
  nextProjectOf,
  portfolioOf,
  projectSlidesOf,
  publishedArticles,
  publishedProjects,
} from "@/content/select";
import { isPageKey } from "@/content/pages";
import type { PageKey, PageMap } from "@/content/types";
import { cachePublicly } from "@/server/cache";
import { contentStore } from "@/server/store";

/**
 * What each public page loads. Each function returns only what its page
 * draws — list pages get cards, not whole documents — and only published
 * content.
 */

/** Settings, the shared sections and the project slides, for the root route
 * (header, footer, enquiry band…). */
export const fetchSite = createServerFn({ method: "GET" }).handler(async () => {
  cachePublicly();
  const store = contentStore();
  const [settings, shared, projects] = await Promise.all([
    store.settings(),
    store.shared(),
    store.projects(),
  ]);
  return { settings, shared, slides: projectSlidesOf(projects) };
});

export const fetchHome = createServerFn({ method: "GET" }).handler(async () => {
  cachePublicly();
  const store = contentStore();
  const [page, projects, articles] = await Promise.all([
    store.page("home"),
    store.projects(),
    store.articles(),
  ]);
  return {
    page,
    cards: homeCardsOf(projects),
    articles: publishedArticles(articles).slice(0, 4).map(cardOf),
  };
});

export const fetchPartners = createServerFn({ method: "GET" }).handler(async () => {
  cachePublicly();
  const store = contentStore();
  const [page, all] = await Promise.all([store.page("partners"), store.partners()]);
  const visible = all.filter((p) => p.visible).sort(byOrder);
  return {
    page,
    partners: visible.filter((p) => p.kind === "partner"),
    practices: visible.filter((p) => p.kind === "practice"),
  };
});

export const fetchCareers = createServerFn({ method: "GET" }).handler(async () => {
  cachePublicly();
  const store = contentStore();
  const [page, roles] = await Promise.all([store.page("careers"), store.roles()]);
  return { page, roles: roles.filter((r) => r.open).sort(byOrder) };
});

export const fetchInsights = createServerFn({ method: "GET" }).handler(async () => {
  cachePublicly();
  const store = contentStore();
  const [page, articles] = await Promise.all([store.page("insights"), store.articles()]);
  return { page, articles: publishedArticles(articles).map(cardOf) };
});

/** One article, the three after it for "More insights", and the page chrome. */
export const fetchArticle = createServerFn({ method: "GET" })
  .inputValidator((slug: unknown) => {
    if (typeof slug !== "string" || slug.length > 200) throw new Error("Bad slug");
    return slug;
  })
  .handler(async ({ data: slug }) => {
    cachePublicly();
    const store = contentStore();
    const [page, articles] = await Promise.all([store.page("insights"), store.articles()]);
    const live = publishedArticles(articles);
    const found = live.find((a) => a.slug === slug);
    if (!found) return null;
    const { id: _id, status: _status, pinned: _pinned, ...article } = found;
    return {
      page,
      article,
      more: live
        .filter((a) => a.slug !== slug)
        .slice(0, 3)
        .map(cardOf),
    };
  });

export const fetchProjects = createServerFn({ method: "GET" }).handler(async () => {
  cachePublicly();
  const store = contentStore();
  const [page, projects] = await Promise.all([store.page("projects"), store.projects()]);
  const featured = featuredProject(projects);
  return {
    page,
    featured: featured ? { slug: featured.slug, feature: featured.feature } : null,
    portfolio: portfolioOf(projects),
  };
});

/** One project, the one after it, and the labels around the page. */
export const fetchProject = createServerFn({ method: "GET" })
  .inputValidator((slug: unknown) => {
    if (typeof slug !== "string" || slug.length > 200) throw new Error("Bad slug");
    return slug;
  })
  .handler(async ({ data: slug }) => {
    cachePublicly();
    const store = contentStore();
    const [page, projects] = await Promise.all([store.page("projects"), store.projects()]);
    const project = publishedProjects(projects).find((p) => p.slug === slug);
    if (!project) return null;
    const next = nextProjectOf(projects, slug) ?? project;
    return { labels: page.detail, project, next };
  });

const fetchPageData = createServerFn({ method: "GET" })
  .inputValidator((key: unknown) => {
    if (!isPageKey(key)) throw new Error("Unknown page");
    return key;
  })
  .handler(async ({ data }) => {
    cachePublicly();
    return { page: await contentStore().page(data) };
  });

/** A page whose loader needs nothing but its own content. */
export async function fetchPage<K extends PageKey>(key: K): Promise<{ page: PageMap[K] }> {
  return (await fetchPageData({ data: key })) as { page: PageMap[K] };
}
