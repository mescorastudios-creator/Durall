import type { PageMap, SharedContent, SiteSettings } from "../types";
import { ARTICLES_SEED } from "./articles";
import { ROLES_SEED } from "./careers";
import { PARTNERS_SEED } from "./partners";
import { PROJECTS_SEED } from "./projects";
import { SHARED_SEED } from "./shared";
import { SETTINGS_SEED } from "./site";
import { ABOUT_SEED } from "./pages/about";
import { CAREERS_SEED } from "./pages/careers";
import { CONTACT_SEED } from "./pages/contact";
import { EXPERTISE_SEED } from "./pages/expertise";
import { HOME_SEED } from "./pages/home";
import { INSIGHTS_SEED } from "./pages/insights";
import { PARTNERS_PAGE_SEED } from "./pages/partners";
import { PROJECTS_PAGE_SEED } from "./pages/projects";

/**
 * The site's content as it shipped: what the admin panel's "Import current
 * site content" copies into the database, and what the site renders whenever
 * the database is not configured or cannot be reached.
 */
export const SEED = {
  settings: SETTINGS_SEED as SiteSettings,
  shared: SHARED_SEED as SharedContent,
  pages: {
    home: HOME_SEED,
    about: ABOUT_SEED,
    partners: PARTNERS_PAGE_SEED,
    expertise: EXPERTISE_SEED,
    careers: CAREERS_SEED,
    insights: INSIGHTS_SEED,
    contact: CONTACT_SEED,
    projects: PROJECTS_PAGE_SEED,
  } satisfies PageMap as PageMap,
  projects: PROJECTS_SEED,
  articles: ARTICLES_SEED,
  roles: ROLES_SEED,
  partners: PARTNERS_SEED,
};
