import type { SupabaseClient } from "@supabase/supabase-js";
import { setResponseStatus } from "@tanstack/react-start/server";
import { can, isSection, type Member, type Role, type Section } from "@/admin/permissions";
import { isSupabaseConfigured, sessionClient } from "./supabase";

/** An error the admin panel shows as-is, with the HTTP status it deserves. */
export class AdminError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "AdminError";
  }
}

/** Sets the response status and throws, so callers can `return fail(...)` or just call it. */
export function fail(message: string, status = 400): never {
  try {
    setResponseStatus(status);
  } catch {
    // Outside a request.
  }
  throw new AdminError(message, status);
}

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  sections: string[] | null;
  disabled: boolean;
};

export function memberOf(row: ProfileRow): Member {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    sections: (row.sections ?? []).filter(isSection),
    disabled: row.disabled,
  };
}

/**
 * The signed-in team member this request belongs to, or null. The session
 * is verified with Supabase Auth (getUser), not merely decoded from the
 * cookie, and a disabled profile counts as signed out.
 *
 * Pass the client that has just signed in when there is one: the session
 * it opened is only in the response's cookies, which a new client (reading
 * the request's) cannot see until the next request.
 */
export async function currentMember(
  client?: SupabaseClient,
): Promise<{ member: Member; db: SupabaseClient } | null> {
  if (!isSupabaseConfigured()) return null;
  const db = client ?? sessionClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;
  const { data, error } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error || !data) return null;
  const member = memberOf(data as ProfileRow);
  if (member.disabled) return null;
  return { member, db };
}

/**
 * Every admin write starts here: no session, a disabled account, or a
 * section the member was not given access to, and the call stops.
 */
export async function requireMember(section?: Section) {
  if (!isSupabaseConfigured()) {
    fail("The database is not connected yet, so nothing can be saved.", 503);
  }
  const session = await currentMember();
  if (!session) fail("Your session has ended. Sign in again to continue.", 401);
  if (section && !can(session.member, section)) {
    fail("Your account does not have access to this section.", 403);
  }
  return session;
}

export async function requireOwner() {
  const session = await requireMember();
  if (session.member.role !== "owner") fail("Only the owner can manage accounts.", 403);
  return session;
}

/** A line in the activity log. Never fails the save it describes. */
export async function logActivity(
  session: { member: Member; db: SupabaseClient },
  action: string,
  entity: string,
  entityId: string,
  summary: string,
) {
  const { error } = await session.db.from("activity").insert({
    user_id: session.member.id,
    user_email: session.member.email,
    action,
    entity,
    entity_id: entityId,
    summary: summary.slice(0, 300),
  });
  if (error) console.warn("[activity] could not log", error.message);
}
