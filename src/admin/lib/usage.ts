import { PAGES } from "@/content/pages";
import type { ImageRef } from "@/content/types";
import type { AllContent } from "@/admin/api/content";

/**
 * Where an image appears on the site, in words: "Home page", "Project:
 * Patina", "Article: …". Used by the media library, which only lets an
 * upload be deleted once nothing uses it.
 */
function contains(value: unknown, match: (ref: ImageRef) => boolean): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some((item) => contains(item, match));
  const record = value as Record<string, unknown>;
  if ((record["kind"] === "asset" || record["kind"] === "upload") && match(record as ImageRef)) {
    return true;
  }
  return Object.values(record).some((item) => contains(item, match));
}

export function usageOf(content: AllContent | undefined, ref: ImageRef): string[] {
  if (!content) return [];
  const match = (other: ImageRef) =>
    ref.kind === "asset"
      ? other.kind === "asset" && other.key === ref.key
      : other.kind === "upload" && other.id === ref.id;
  const places: string[] = [];
  for (const page of PAGES) {
    if (contains(content.pages[page.key], match)) places.push(`${page.label} page`);
  }
  if (contains(content.shared, match)) places.push("Shared sections");
  if (contains(content.settings, match)) places.push("Site settings");
  for (const project of content.projects) {
    if (contains(project, match)) places.push(`Project: ${project.name}`);
  }
  for (const article of content.articles) {
    if (contains(article, match)) places.push(`Article: ${article.title}`);
  }
  for (const partner of content.partners) {
    if (contains(partner, match)) places.push(`Partner: ${partner.name}`);
  }
  return places;
}
