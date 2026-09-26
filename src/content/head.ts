import { imageOf } from "./render";
import type { Seo } from "./types";

type Meta = { title?: string; name?: string; property?: string; content?: string };

/**
 * A page's <head> from its SEO fields. The share image falls back to the
 * site-wide one declared in __root.tsx; a page with its own image
 * overrides it (the later tag wins).
 */
export function seoHead(
  seo: (Pick<Seo, "title" | "description"> & { image?: Seo["image"] }) | undefined,
  { type = "website", extra = [] }: { type?: "website" | "article"; extra?: Meta[] } = {},
): { meta: Meta[] } {
  if (!seo) return { meta: [] };
  const meta: Meta[] = [
    { title: seo.title },
    { name: "description", content: seo.description },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
    ...extra,
  ];
  if (seo.image) {
    const src = imageOf(seo.image.image).src;
    meta.push(
      { property: "og:image", content: src },
      { property: "og:image:alt", content: seo.image.alt },
      { name: "twitter:image", content: src },
    );
  }
  return { meta };
}
