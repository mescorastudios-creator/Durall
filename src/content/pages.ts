import type { PageKey } from "./types";

/** Every page with its own content, in navigation order, for the admin panel and the loaders. */
export const PAGES = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "projects", label: "Projects", path: "/projects" },
  { key: "expertise", label: "Expertise", path: "/expertise" },
  { key: "partners", label: "Partners", path: "/partners" },
  { key: "insights", label: "Insights", path: "/insights" },
  { key: "careers", label: "Careers", path: "/careers" },
  { key: "contact", label: "Contact", path: "/contact" },
] as const satisfies readonly { key: PageKey; label: string; path: string }[];

export function isPageKey(key: unknown): key is PageKey {
  return typeof key === "string" && PAGES.some((page) => page.key === key);
}
