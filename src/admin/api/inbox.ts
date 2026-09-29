import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fail, logActivity, requireMember } from "@/server/auth";
import { isSupabaseConfigured } from "@/server/supabase";
import { idSchema, input } from "@/server/validate";

/** Enquiries from the site's two forms, and the activity log. */

export type Enquiry = {
  id: string;
  createdAt: string;
  source: "contact" | "home" | "about";
  name: string;
  email: string;
  studio: string;
  projectType: string;
  subject: string;
  phone: string;
  location: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  notes: string;
};

type EnquiryRow = {
  id: string;
  created_at: string;
  source: Enquiry["source"];
  name: string;
  email: string;
  studio: string;
  project_type: string;
  subject: string;
  /** Absent until migration 0002 has run. */
  phone?: string;
  location?: string;
  message: string;
  status: Enquiry["status"];
  notes: string;
};

const enquiryOf = (row: EnquiryRow): Enquiry => ({
  id: row.id,
  createdAt: row.created_at,
  source: row.source,
  name: row.name,
  email: row.email,
  studio: row.studio,
  projectType: row.project_type,
  subject: row.subject,
  phone: row.phone ?? "",
  location: row.location ?? "",
  message: row.message,
  status: row.status,
  notes: row.notes,
});

export const listEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseConfigured()) return { enquiries: [] as Enquiry[] };
  const { db } = await requireMember("enquiries");
  const { data, error } = await db
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) fail(error.message, 500);
  return { enquiries: ((data ?? []) as EnquiryRow[]).map(enquiryOf) };
});

export const updateEnquiry = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        id: idSchema,
        status: z.enum(["new", "read", "replied", "archived"]),
        notes: z.string().max(5000),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const session = await requireMember("enquiries");
    const { error } = await session.db
      .from("enquiries")
      .update({ status: data.status, notes: data.notes })
      .eq("id", data.id);
    if (error) fail(error.message, 500);
    return { ok: true };
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const session = await requireMember("enquiries");
    const { error } = await session.db.from("enquiries").delete().eq("id", data.id);
    if (error) fail(error.message, 500);
    await logActivity(session, "delete", "enquiry", data.id, "Deleted an enquiry");
    return { ok: true };
  });

export type ActivityEntry = {
  id: number;
  at: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
};

export const listActivity = createServerFn({ method: "GET" })
  .inputValidator(input(z.object({ limit: z.number().int().min(1).max(500) })))
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return { entries: [] as ActivityEntry[] };
    const { db } = await requireMember();
    const { data: rows, error } = await db
      .from("activity")
      .select("*")
      .order("at", { ascending: false })
      .limit(data.limit);
    if (error) fail(error.message, 500);
    return {
      entries: (rows ?? []).map((row: Record<string, unknown>): ActivityEntry => ({
        id: Number(row["id"]),
        at: String(row["at"]),
        userEmail: String(row["user_email"] ?? ""),
        action: String(row["action"]),
        entity: String(row["entity"]),
        entityId: String(row["entity_id"] ?? ""),
        summary: String(row["summary"] ?? ""),
      })),
    };
  });

/** Unread enquiries, for the badge in the sidebar. */
export const countNewEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseConfigured()) return { count: 0 };
  const session = await requireMember();
  const { count, error } = await session.db
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) return { count: 0 };
  return { count: count ?? 0 };
});
