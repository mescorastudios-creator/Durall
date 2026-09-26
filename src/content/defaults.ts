import { asset } from "./render";
import type { ArticleDoc, PartnerDoc, Photo, ProjectDoc, RoleDoc } from "./types";

/* Empty documents: the starting point for "New project" and friends in the
 * admin panel, and the defaults a stored document is merged over when it
 * was saved before a field existed. */

const placeholderPhoto = (): Photo => ({ image: asset("heroParikrama"), alt: "" });

export function blankProject(id = "", order = 0): ProjectDoc {
  return {
    id,
    slug: "",
    status: "draft",
    order,
    nextSlug: "",
    placeholder: false,
    name: "",
    title: [""],
    location: "",
    architect: "",
    year: new Date().getFullYear(),
    categories: [],
    description: "",
    figure: null,
    hero: placeholderPhoto(),
    card: null,
    facts: [
      { label: "Project", value: "" },
      { label: "Architect", value: "" },
      { label: "Location", value: "" },
      { label: "Completed", value: "" },
      { label: "Durall Role", value: "" },
      { label: "System", value: "" },
    ],
    intro: { heading: "", paragraphs: [""] },
    plates: [],
    scope: { ...placeholderPhoto(), heading: "", paragraphs: [""], facts: [] },
    system: { ...placeholderPhoto(), title: [""], body: "", points: [] },
    experience: { ...placeholderPhoto(), heading: "", body: "" },
    inPortfolio: true,
    home: { show: false, title: "", subtitle: "", image: asset("heroParikrama") },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "",
      title: [""],
      architect: "",
      description: "",
      specs: [],
      award: null,
      gallery: [],
    },
  };
}

export function blankArticle(id = ""): ArticleDoc {
  return {
    id,
    slug: "",
    status: "draft",
    pinned: false,
    category: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    readingTime: "1 min read",
    title: "",
    excerpt: "",
    cover: placeholderPhoto(),
    body: [
      { type: "heading", text: "" },
      { type: "paragraph", text: "" },
    ],
  };
}

export function blankRole(id = "", order = 0): RoleDoc {
  return {
    id,
    order,
    open: true,
    title: "",
    team: "",
    location: "",
    type: "Full time",
    summary: "",
  };
}

export function blankPartner(id = "", kind: PartnerDoc["kind"] = "partner", order = 0): PartnerDoc {
  return {
    id,
    kind,
    order,
    visible: true,
    mark: "plain",
    logo: null,
    name: "",
    country: "",
    description: "",
  };
}

/** "Parikrama — Murud House" → "parikrama-murud-house" */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
