import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { serviceClient, supabaseConfig } from "@/server/supabase";

/**
 * The site's two enquiry forms post here. The message is checked, then
 * stored with the server's service key — the database accepts no enquiry
 * from the public key directly, so it cannot be flooded around this check.
 *
 * Returns the same `{ ok }` / `{ ok: false, message }` shape the forms
 * already handle.
 */

const enquiry = z.object({
  source: z.enum(["contact", "home", "about", "partners", "expertise"]),
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  studio: z.string().trim().max(200).default(""),
  projectType: z.string().trim().max(200).default(""),
  subject: z.string().trim().max(300).default(""),
  phone: z.string().trim().max(60).default(""),
  location: z.string().trim().max(200).default(""),
  message: z.string().trim().max(10_000).default(""),
  /** A field people never see; only a bot fills it. */
  website: z.string().max(500).default(""),
});

export type EnquiryInput = z.input<typeof enquiry>;

/** The sources the enquiries table accepted before migration 0002. */
const LEGACY_SOURCES = new Set(["contact", "home", "about"]);

/* A few messages a minute from one address is plenty for a person. Kept per
 * warm function instance — a speed bump for scripts, not a guarantee. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const LIMIT = 5;

function tooMany(ip: string): boolean {
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  times.push(now);
  recent.set(ip, times);
  if (recent.size > 5000) recent.clear();
  return times.length > LIMIT;
}

export const sendEnquiry = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => {
    const result = enquiry.safeParse(value);
    if (!result.success) throw new Error("Check the highlighted fields and try again.");
    return result.data;
  })
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; message: string }> => {
    // Bots fill every field; pretend it worked and store nothing.
    if (data.website) return { ok: true };
    const ip = (() => {
      try {
        return getRequestIP({ xForwardedFor: true }) ?? "unknown";
      } catch {
        return "unknown";
      }
    })();
    if (tooMany(ip)) {
      return {
        ok: false,
        message:
          "That didn’t send — too many messages in a short time. Try again in a few minutes.",
      };
    }
    const { url, serviceKey } = supabaseConfig();
    if (!url || !serviceKey) {
      // Before the database is connected there is nowhere to put it: say so
      // rather than pretend, and point at the direct lines.
      return {
        ok: false,
        message:
          "That didn’t send — our enquiry service is not connected yet. Please email us directly using the address on this page.",
      };
    }
    const row = {
      source: data.source,
      name: data.name,
      email: data.email,
      studio: data.studio,
      project_type: data.projectType,
      subject: data.subject,
      message: data.message,
    };
    let { error } = await serviceClient()
      .from("enquiries")
      .insert({ ...row, phone: data.phone, location: data.location });
    if (error?.code === "PGRST204" || error?.code === "23514") {
      // A database set up before migration 0002 has no phone or location
      // column (PGRST204) and takes only the first three forms as a source
      // (23514). Keep the enquiry rather than lose it: what it cannot hold
      // goes at the top of the message instead.
      const legacy = LEGACY_SOURCES.has(data.source);
      const noted = [
        legacy ? "" : `Form: ${data.source} page`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.location ? `Location: ${data.location}` : "",
      ].filter(Boolean);
      ({ error } = await serviceClient()
        .from("enquiries")
        .insert({
          ...row,
          source: legacy ? data.source : "home",
          message: [...noted, data.message].filter(Boolean).join("\n\n"),
        }));
    }
    if (error) {
      console.error("[enquiry] could not store", error);
      return {
        ok: false,
        message:
          "That didn’t send — our enquiry service is not responding. Try again in a moment, or email us directly.",
      };
    }
    return { ok: true };
  });
