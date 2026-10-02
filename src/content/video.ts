/**
 * Films are hosted on YouTube or Vimeo and pasted into the admin as a plain
 * address. The player's address is never the pasted one: the provider and
 * the video's id are read out of it and the embed URL is built here, so a
 * stored link can only ever open one of these two players, never an
 * arbitrary page in an iframe.
 *
 * YouTube plays from youtube-nocookie.com and Vimeo with dnt=1, and nothing
 * loads from either until someone presses play.
 */

export type Embed = {
  provider: "youtube" | "vimeo";
  id: string;
  /** The player's address, set to start playing. */
  src: string;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** "90", "1m30s" or "1h2m3s" → seconds. */
function seconds(value: string | null): number {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
  if (!match) return 0;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

function youtube(url: URL): Embed | null {
  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;
  if (url.hostname === "youtu.be") id = parts[0];
  else if (parts[0] === "watch") id = url.searchParams.get("v") ?? undefined;
  else if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "")) id = parts[1];
  if (!id || !YOUTUBE_ID.test(id)) return null;
  const start = seconds(url.searchParams.get("t") ?? url.searchParams.get("start"));
  const query = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
  if (start) query.set("start", String(start));
  return {
    provider: "youtube",
    id,
    src: `https://www.youtube-nocookie.com/embed/${id}?${query}`,
  };
}

function vimeo(url: URL): Embed | null {
  const parts = url.pathname.split("/").filter(Boolean);
  const at = parts.findIndex((part) => /^\d{5,12}$/.test(part));
  if (at < 0) return null;
  const id = parts[at]!;
  // Unlisted films carry a privacy hash after the id, or as ?h=.
  const hash = url.searchParams.get("h") ?? parts[at + 1];
  const query = new URLSearchParams({ autoplay: "1", dnt: "1" });
  if (hash && /^[a-f0-9]{6,20}$/.test(hash)) query.set("h", hash);
  return { provider: "vimeo", id, src: `https://player.vimeo.com/video/${id}?${query}` };
}

/** The player for a pasted YouTube or Vimeo address, or null if it is neither. */
export function embedOf(address: string | null | undefined): Embed | null {
  if (!address) return null;
  let url: URL;
  try {
    url = new URL(address.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase();
  if (YOUTUBE_HOSTS.has(host)) return youtube(url);
  if (VIMEO_HOSTS.has(host)) return vimeo(url);
  return null;
}
