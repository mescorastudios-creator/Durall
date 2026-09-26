import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import { SECTIONS, type Member, type Section } from "@/admin/permissions";
import { fail, logActivity, memberOf, requireMember, requireOwner } from "@/server/auth";
import { isSupabaseConfigured, serviceClient } from "@/server/supabase";
import { idSchema, input } from "@/server/validate";

/**
 * Accounts. Only the owner reaches any of this: inviting people, choosing
 * what each may edit, disabling, removing, and handing ownership on.
 *
 * Invitations are emailed by Supabase; the link lands on
 * /admin/set-password, where the new member chooses a password.
 */

const sectionKeys = SECTIONS.map((section) => section.key) as [Section, ...Section[]];

const access = z.object({
  name: z.string().trim().max(120),
  role: z.enum(["admin", "editor"]),
  sections: z.array(z.enum(sectionKeys)).max(SECTIONS.length),
});

export type TeamMember = Member & { lastSignIn: string | null; invited: boolean };

export const listTeam = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseConfigured()) return { members: [] as TeamMember[] };
  const { member } = await requireMember();
  if (member.role !== "owner") return { members: [] as TeamMember[] };
  const service = serviceClient();
  const [{ data: profiles, error }, { data: users }] = await Promise.all([
    service.from("profiles").select("*").order("created_at", { ascending: true }),
    service.auth.admin.listUsers({ perPage: 200 }),
  ]);
  if (error) fail(error.message, 500);
  const byId = new Map((users?.users ?? []).map((user) => [user.id, user]));
  return {
    members: (profiles ?? []).map((row) => {
      const user = byId.get((row as { id: string }).id);
      return {
        ...memberOf(row as Parameters<typeof memberOf>[0]),
        lastSignIn: user?.last_sign_in_at ?? null,
        invited: Boolean(user && !user.last_sign_in_at),
      } satisfies TeamMember;
    }),
  };
});

function redirectTo() {
  return `${new URL(getRequestUrl()).origin}/admin/set-password`;
}

export const inviteMember = createServerFn({ method: "POST" })
  .inputValidator(input(access.extend({ email: z.string().trim().toLowerCase().email() })))
  .handler(async ({ data }) => {
    const session = await requireOwner();
    const service = serviceClient();
    const { data: invited, error } = await service.auth.admin.inviteUserByEmail(data.email, {
      redirectTo: redirectTo(),
      data: { name: data.name },
    });
    if (error || !invited.user) {
      fail(
        error?.message.includes("already")
          ? "Someone with that email already has an account."
          : `The invitation could not be sent: ${error?.message}`,
        400,
      );
    }
    // The database trigger created the profile; give it the access chosen.
    const { error: profileError } = await service
      .from("profiles")
      .update({
        name: data.name,
        role: data.role,
        sections: data.role === "editor" ? data.sections : [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", invited.user.id);
    if (profileError) fail(profileError.message, 500);
    await logActivity(
      session,
      "invite",
      "account",
      invited.user.id,
      `Invited ${data.email} as ${data.role}`,
    );
    return { ok: true };
  });

async function notOwner(id: string, what: string) {
  const { data } = await serviceClient().from("profiles").select("role").eq("id", id).maybeSingle();
  if (!data) fail("That account no longer exists.", 404);
  if ((data as { role: string }).role === "owner")
    fail(`The owner's account cannot be ${what}.`, 400);
}

export const updateMember = createServerFn({ method: "POST" })
  .inputValidator(input(access.extend({ id: idSchema })))
  .handler(async ({ data }) => {
    const session = await requireOwner();
    await notOwner(data.id, "changed here");
    const { error } = await serviceClient()
      .from("profiles")
      .update({
        name: data.name,
        role: data.role,
        sections: data.role === "editor" ? data.sections : [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) fail(error.message, 500);
    await logActivity(
      session,
      "update",
      "account",
      data.id,
      `Changed access for ${data.name || "a member"}`,
    );
    return { ok: true };
  });

/** Disabling signs the person out everywhere and stops them signing in again. */
export const setMemberDisabled = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ id: idSchema, disabled: z.boolean() })))
  .handler(async ({ data }) => {
    const session = await requireOwner();
    await notOwner(data.id, "disabled");
    const service = serviceClient();
    const { error } = await service
      .from("profiles")
      .update({ disabled: data.disabled, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) fail(error.message, 500);
    await service.auth.admin.updateUserById(data.id, {
      ban_duration: data.disabled ? "876000h" : "none",
    });
    await logActivity(
      session,
      data.disabled ? "disable" : "enable",
      "account",
      data.id,
      data.disabled ? "Disabled an account" : "Re-enabled an account",
    );
    return { ok: true };
  });

export const removeMember = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const session = await requireOwner();
    await notOwner(data.id, "removed");
    const { error } = await serviceClient().auth.admin.deleteUser(data.id);
    if (error) fail(error.message, 500);
    await logActivity(session, "remove", "account", data.id, "Removed an account");
    return { ok: true };
  });

export const resendInvite = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ email: z.string().trim().toLowerCase().email() })))
  .handler(async ({ data }) => {
    const session = await requireOwner();
    // For someone who has never signed in, a reset email doubles as a fresh invitation.
    const { error } = await serviceClient().auth.resetPasswordForEmail(data.email, {
      redirectTo: redirectTo(),
    });
    if (error) fail(`The email could not be sent: ${error.message}`, 400);
    await logActivity(
      session,
      "invite",
      "account",
      data.email,
      `Re-sent the invitation to ${data.email}`,
    );
    return { ok: true };
  });

export const transferOwnership = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const session = await requireOwner();
    // Through the owner's own session: the database function checks that
    // the caller is the owner and swaps the two roles in one step.
    const { error } = await session.db.rpc("transfer_ownership", { target: data.id });
    if (error) fail(error.message, 400);
    await logActivity(
      session,
      "transfer",
      "account",
      data.id,
      "Handed ownership to another member",
    );
    return { ok: true };
  });
