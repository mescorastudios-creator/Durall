import type { ArticleDoc, ProjectDoc } from "./types";

/* Pure views over the collections, shared by the server functions that feed
 * the site and by the admin panel's previews. Each takes the whole list and
 * decides for itself what is public. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-08-04" → "04 Aug 2026", with no time zone to shift the day. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  if (!year || !name || !day) return iso;
  return `${day.padStart(2, "0")} ${name} ${year}`;
}

/** Roughly 220 words a minute, rounded up, never under a minute. */
export function readingTimeOf(article: Pick<ArticleDoc, "body" | "excerpt">): string {
  const text = [
    article.excerpt,
    ...article.body.flatMap((block) =>
      block.type === "list"
        ? block.items
        : block.type === "image" || block.type === "video"
          ? [block.caption]
          : [block.text],
    ),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export function publishedProjects(projects: readonly ProjectDoc[]): ProjectDoc[] {
  return projects.filter((p) => p.status === "published").sort(byOrder);
}

/** The project at the top of /projects: the one flagged, else the first. */
export function featuredProject(projects: readonly ProjectDoc[]): ProjectDoc | undefined {
  const live = publishedProjects(projects);
  return live.find((p) => p.isFeatured) ?? live[0];
}

export type PortfolioItem = Pick<
  ProjectDoc,
  "slug" | "name" | "location" | "architect" | "categories" | "year" | "hero"
> & { index: string };

/**
 * The /projects grid. Numbered in portfolio order with the featured project
 * counted as 01, since it opens the list above the grid.
 */
export function portfolioOf(projects: readonly ProjectDoc[]): PortfolioItem[] {
  const featured = featuredProject(projects);
  const listed = publishedProjects(projects).filter(
    (p) => p.slug === featured?.slug || p.inPortfolio,
  );
  return listed
    .map((p, i) => ({
      slug: p.slug,
      index: String(i + 1).padStart(2, "0"),
      name: p.name,
      location: p.location,
      architect: p.architect,
      categories: p.categories,
      year: p.year,
      hero: p.hero,
    }))
    .filter((p) => p.slug !== featured?.slug);
}

export type HomeCard = { slug: string } & ProjectDoc["home"];

export function homeCardsOf(projects: readonly ProjectDoc[]): HomeCard[] {
  return publishedProjects(projects)
    .filter((p) => p.home.show)
    .map((p) => ({ slug: p.slug, ...p.home }));
}

/** A slide in the home page's enquiry band: every published project, in order. */
export type ProjectSlide = Pick<ProjectDoc, "slug" | "name" | "architect" | "location" | "hero">;

export function projectSlidesOf(projects: readonly ProjectDoc[]): ProjectSlide[] {
  return publishedProjects(projects).map(({ slug, name, architect, location, hero }) => ({
    slug,
    name,
    architect,
    location,
    hero,
  }));
}

/** The project after this one, wrapping round to the first. */
export function nextProjectOf(
  projects: readonly ProjectDoc[],
  slug: string,
): ProjectDoc | undefined {
  const live = publishedProjects(projects);
  const index = live.findIndex((p) => p.slug === slug);
  const chosen = live[index]?.nextSlug;
  const picked = chosen ? live.find((p) => p.slug === chosen && p.slug !== slug) : undefined;
  return picked ?? live[(index + 1) % live.length];
}

export function publishedArticles(articles: readonly ArticleDoc[]): ArticleDoc[] {
  return articles
    .filter((a) => a.status === "published")
    .sort(
      (a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt),
    );
}

/** An article as the lists show it: everything but the body. */
export type ArticleCard = Omit<ArticleDoc, "body" | "status" | "pinned" | "id">;

export function cardOf(article: ArticleDoc): ArticleCard {
  return {
    slug: article.slug,
    format: article.format,
    video: article.video,
    category: article.category,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
    title: article.title,
    excerpt: article.excerpt,
    cover: article.cover,
  };
}

/** A category as it appears in a filter's web address: "Architecture / Performance" → "architecture-performance". */
export function topicKey(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The topics in use, most-published first, for the filter row. */
export function topicsOf(
  cards: readonly ArticleCard[],
): { key: string; label: string; count: number }[] {
  const topics = new Map<string, { key: string; label: string; count: number }>();
  for (const card of cards) {
    const key = topicKey(card.category);
    if (!key) continue;
    const topic = topics.get(key) ?? { key, label: card.category.trim(), count: 0 };
    topic.count += 1;
    topics.set(key, topic);
  }
  return [...topics.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** What sits under a card's title: the reading time, or a film's length. */
export function lengthOf(card: Pick<ArticleCard, "format" | "video" | "readingTime">): string {
  return card.format === "video" ? card.video.duration : card.readingTime;
}
