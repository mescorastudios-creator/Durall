import { getRouteApi } from "@tanstack/react-router";
import type { SharedContent, SiteSettings } from "./types";

const root = getRouteApi("__root__");

/**
 * The site settings and shared sections the root route loaded, for the
 * components every page carries (header, footer, the shared sections).
 *
 * Deliberately no bundled fallback here: importing the seed would put every
 * word of the site into the browser bundle. The root loader always resolves
 * before any page renders.
 */
export function useSite(): { settings: SiteSettings; shared: SharedContent } {
  return root.useLoaderData();
}
