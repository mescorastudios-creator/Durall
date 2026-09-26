import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

/**
 * The three ways the site talks to Supabase. Server-only: nothing here may
 * be imported by code that runs in the browser (the import-protection
 * plugin refuses anything under src/server/ in the client bundle).
 *
 * Environment (Netlify site settings, and .env.local for development):
 *   SUPABASE_URL                the project URL
 *   SUPABASE_ANON_KEY           the public "anon"/publishable key
 *   SUPABASE_SERVICE_ROLE_KEY   the secret service key — never exposed
 * The VITE_-prefixed names Lovable's Supabase integration writes are read
 * too, so connecting the project there works without renaming anything.
 */

function env(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
}

export function supabaseConfig() {
  const url = env("SUPABASE_URL", "VITE_SUPABASE_URL");
  const anonKey = env(
    "SUPABASE_ANON_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
  );
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY");
  return { url, anonKey, serviceKey };
}

/* The site never uses Supabase Realtime, but the client builds its
 * WebSocket transport when it is created, and Node before 22 has no
 * WebSocket — it would throw before a single query ran. Netlify runs Node
 * 22; this keeps older local Node working too. */
class NoRealtime {
  constructor() {
    throw new Error("Realtime is not used by this site");
  }
}
const realtime = {
  transport: (globalThis.WebSocket ?? NoRealtime) as never,
};

/** Whether the database is set up at all; without it the site runs on the bundled content. */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = supabaseConfig();
  return Boolean(url && anonKey);
}

let anonClient: SupabaseClient | undefined;

/** Reads as an anonymous visitor: row-level security shows only live content. */
export function publicClient(): SupabaseClient {
  const { url, anonKey } = supabaseConfig();
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  anonClient ??= createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime,
  });
  return anonClient;
}

/**
 * Acts as the signed-in team member whose session cookie came with this
 * request. Row-level security applies, so a write only succeeds for an
 * active member. A new client per call: it carries one request's cookies.
 */
export function sessionClient(): SupabaseClient {
  const { url, anonKey } = supabaseConfig();
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  return createServerClient(url, anonKey, {
    realtime,
    cookies: {
      getAll: () => Object.entries(getCookies()).map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies) {
          // The browser never reads the session itself — every admin call
          // goes through the server — so the cookie can be httpOnly.
          setCookie(name, value, {
            ...options,
            httpOnly: true,
            secure: process.env["NODE_ENV"] === "production",
            sameSite: "lax",
            path: "/",
          });
        }
      },
    },
    cookieOptions: { name: "durall-admin" },
  });
}

let adminClient: SupabaseClient | undefined;

/**
 * The service key: bypasses row-level security. Used only after the server
 * has checked who is asking — account management, enquiries from the public
 * form, and storage uploads.
 */
export function serviceClient(): SupabaseClient {
  const { url, serviceKey } = supabaseConfig();
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set on the server");
  }
  adminClient ??= createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime,
  });
  return adminClient;
}
