import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import type { Member } from "@/admin/permissions";
import { currentMember, fail, logActivity, requireMember } from "@/server/auth";
import {
  isSupabaseConfigured,
  serviceClient,
  sessionClient,
  supabaseConfig,
} from "@/server/supabase";
import { input } from "@/server/validate";

/**
 * Signing in and out, and setting a password from an invite or reset email.
 *
 * There is no sign-up: accounts are created by the owner (api/team.ts), and
 * public sign-up should also be switched off in Supabase itself, so the
 * public key cannot create one either.
 */

export type AdminState = {
  /** The database is connected (the URL and public key are set). */
  configured: boolean;
  /** The server can manage accounts and uploads (the service key is set). */
  serviceKey: boolean;
  member: Member | null;
};

export const getAdminState = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminState> => {
    const configured = isSupabaseConfigured();
    const serviceKey = Boolean(supabaseConfig().serviceKey);
    if (!configured) return { configured, serviceKey, member: null };
    const session = await currentMember();
    return { configured, serviceKey, member: session?.member ?? null };
  },
);

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Enter the email address of your account."),
  password: z.string().min(1, "Enter your password.").max(200),
});

export const signIn = createServerFn({ method: "POST" })
  .inputValidator(input(credentials))
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) fail("The database is not connected yet.", 503);
    const db = sessionClient();
    const { error } = await db.auth.signInWithPassword(data);
    // One message for every failure, so the form does not reveal which
    // email addresses have accounts.
    if (error) fail("That email and password do not match an account.", 401);
    const session = await currentMember(db);
    if (!session) {
      await db.auth.signOut();
      fail("This account has been disabled. Ask the site owner for access.", 403);
    }
    await logActivity(session, "sign-in", "account", session.member.id, "Signed in");
    return { member: session.member };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  if (!isSupabaseConfigured()) return { ok: true };
  await sessionClient().auth.signOut();
  return { ok: true };
});

/** Where invite and reset emails send people, on whichever domain this is. */
function setPasswordUrl() {
  const url = new URL(getRequestUrl());
  return `${url.origin}/admin/set-password`;
}

export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ email: z.string().trim().toLowerCase().email() })))
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) fail("The database is not connected yet.", 503);
    const { error } = await sessionClient().auth.resetPasswordForEmail(data.email, {
      redirectTo: setPasswordUrl(),
    });
    if (error) console.warn("[auth] reset email failed", error.message);
    // The same answer whether or not the address has an account.
    return { ok: true };
  });

/**
 * Opens the session an invite or reset link carries, then sets the new
 * password. Supabase sends one of three link shapes depending on the email
 * template and flow; all three are accepted.
 */
export const completePasswordSetup = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        code: z.string().max(500).optional(),
        tokenHash: z.string().max(500).optional(),
        type: z.enum(["invite", "recovery", "signup", "magiclink", "email"]).optional(),
        accessToken: z.string().max(5000).optional(),
        refreshToken: z.string().max(500).optional(),
        password: z
          .string()
          .min(10, "Use at least 10 characters.")
          .max(200, "That password is too long."),
        name: z.string().trim().max(120).optional(),
      }),
    ),
  )
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) fail("The database is not connected yet.", 503);
    const db = sessionClient();
    let opened = false;
    if (data.code) {
      opened = !(await db.auth.exchangeCodeForSession(data.code)).error;
    } else if (data.tokenHash && data.type) {
      opened = !(await db.auth.verifyOtp({ token_hash: data.tokenHash, type: data.type })).error;
    } else if (data.accessToken && data.refreshToken) {
      opened = !(
        await db.auth.setSession({
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
        })
      ).error;
    }
    if (!opened) fail("This link has expired or was already used. Ask for a new one.", 401);

    const { error } = await db.auth.updateUser({ password: data.password });
    if (error) fail(error.message, 400);

    const session = await currentMember(db);
    if (!session) fail("This account has been disabled. Ask the site owner for access.", 403);
    if (data.name) await saveOwnName(session.member.id, data.name);
    await logActivity(session, "password", "account", session.member.id, "Set a password");
    return { member: session.member };
  });

export const changePassword = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        password: z
          .string()
          .min(10, "Use at least 10 characters.")
          .max(200, "That password is too long."),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const session = await requireMember();
    const { error } = await session.db.auth.updateUser({ password: data.password });
    if (error) fail(error.message, 400);
    await logActivity(session, "password", "account", session.member.id, "Changed their password");
    return { ok: true };
  });

/* A member may change their own display name. Profiles are not writable
 * through the public API at all, so this goes through the service key,
 * scoped to the id of the session that asked. */
async function saveOwnName(id: string, name: string) {
  const { error } = await serviceClient()
    .from("profiles")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) fail("Your name could not be saved.", 500);
}

export const updateOwnName = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ name: z.string().trim().min(1, "Enter your name.").max(120) })))
  .handler(async ({ data }) => {
    const session = await requireMember();
    await saveOwnName(session.member.id, data.name);
    await logActivity(session, "update", "account", session.member.id, "Updated their name");
    return { member: { ...session.member, name: data.name } };
  });
