import { setResponseHeader } from "@tanstack/react-start/server";

/**
 * Netlify's CDN keeps a copy of every public page and content response,
 * tagged "content", so visitors are served from the edge instead of waiting
 * on the database. Every save in the admin panel purges the tag, so an edit
 * is live within seconds; should a purge ever fail, the copies expire on
 * their own after a minute and are refreshed in the background.
 *
 * Browsers are told to always revalidate, so nobody holds on to a stale
 * page locally.
 */
export const CONTENT_TAG = "content";

export function cachePublicly() {
  try {
    setResponseHeader("Cache-Control", "public, max-age=0, must-revalidate");
    setResponseHeader(
      "Netlify-CDN-Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=604800, durable",
    );
    setResponseHeader("Netlify-Cache-Tag", CONTENT_TAG);
  } catch {
    // Outside a request (a build step, a test): nothing to set.
  }
}

/** Drops the CDN's copies after a save. A no-op anywhere but on Netlify. */
export async function purgeContentCache(): Promise<void> {
  if (!process.env["NETLIFY_PURGE_API_TOKEN"]) return;
  try {
    const { purgeCache } = await import("@netlify/functions");
    await purgeCache({ tags: [CONTENT_TAG] });
  } catch (error) {
    // Not fatal: the copies expire within a minute anyway.
    console.warn("[cache] purge failed", error);
  }
}
