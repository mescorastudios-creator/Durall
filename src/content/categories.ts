/* The portfolio's filter tabs and sort options. The categories are the ones
 * a project can be tagged with in the admin panel ("All" is the filter's
 * own reset, not a tag). */
export const CATEGORIES = [
  "All",
  "Residential",
  "Hospitality",
  "Commercial",
  "Institutional",
  "International",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PROJECT_TAGS = CATEGORIES.filter((c) => c !== "All");

export const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "name", label: "A – Z" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];
