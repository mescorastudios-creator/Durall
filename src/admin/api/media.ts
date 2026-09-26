import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fail, logActivity, requireMember } from "@/server/auth";
import { purgeContentCache } from "@/server/cache";
import { isSupabaseConfigured, serviceClient, supabaseConfig } from "@/server/supabase";
import { idSchema, input } from "@/server/validate";

/**
 * The media library's uploads.
 *
 * The browser resizes each image into web sizes itself (admin/lib/images.ts)
 * and uploads them straight to Supabase Storage through short-lived signed
 * URLs this server hands out — so a large photograph never passes through
 * the site's own function, and the browser never holds a storage key.
 */

export type MediaItem = {
  id: string;
  path: string;
  src: string;
  srcSet: string | null;
  width: number;
  height: number;
  alt: string;
  name: string;
  bytes: number;
  createdAt: string;
};

type MediaRow = {
  id: string;
  path: string;
  src: string;
  src_set: string | null;
  width: number;
  height: number;
  alt: string;
  name: string;
  bytes: number;
  created_at: string;
};

const BUCKET = "media";

const itemOf = (row: MediaRow): MediaItem => ({
  id: row.id,
  path: row.path,
  src: row.src,
  srcSet: row.src_set,
  width: row.width,
  height: row.height,
  alt: row.alt,
  name: row.name,
  bytes: row.bytes,
  createdAt: row.created_at,
});

export const listMedia = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseConfigured()) return { items: [] as MediaItem[], uploads: false };
  const { db } = await requireMember();
  const { data, error } = await db
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) fail(error.message, 500);
  return {
    items: ((data ?? []) as MediaRow[]).map(itemOf),
    uploads: Boolean(supabaseConfig().serviceKey),
  };
});

const FILE_TYPES = [
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/avif",
  "image/gif",
] as const;

/** Hands out one signed upload URL per size of a new image. */
export const startUpload = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        files: z
          .array(
            z.object({
              name: z.string().regex(/^[a-z0-9-]+\.(webp|jpg|png|svg|avif|gif)$/),
              type: z.enum(FILE_TYPES),
            }),
          )
          .min(1)
          .max(4),
      }),
    ),
  )
  .handler(async ({ data }) => {
    await requireMember("media");
    const folder = `uploads/${crypto.randomUUID()}`;
    const storage = serviceClient().storage.from(BUCKET);
    const targets = [];
    for (const file of data.files) {
      const path = `${folder}/${file.name}`;
      const { data: signed, error } = await storage.createSignedUploadUrl(path);
      if (error || !signed) fail(`Upload could not start: ${error?.message ?? "no URL"}`, 500);
      targets.push({
        name: file.name,
        uploadUrl: signed.signedUrl,
        publicUrl: storage.getPublicUrl(path).data.publicUrl,
      });
    }
    return { folder, targets };
  });

/** Files the finished upload in the library. */
export const finishUpload = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        folder: z.string().regex(/^uploads\/[0-9a-f-]{36}$/),
        src: z.string().url().max(1000),
        srcSet: z.string().max(4000).nullable(),
        width: z.number().int().positive().max(20000),
        height: z.number().int().positive().max(20000),
        name: z.string().trim().max(200),
        alt: z.string().trim().max(500),
        bytes: z.number().int().nonnegative(),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const session = await requireMember("media");
    const { url } = supabaseConfig();
    // Only files in this project's own bucket can be filed.
    if (!url || !data.src.startsWith(`${url}/storage/v1/object/public/${BUCKET}/${data.folder}/`)) {
      fail("That file is not in the media bucket.", 400);
    }
    const { data: row, error } = await session.db
      .from("media")
      .insert({
        path: data.folder,
        src: data.src,
        src_set: data.srcSet,
        width: data.width,
        height: data.height,
        name: data.name,
        alt: data.alt,
        bytes: data.bytes,
        created_by: session.member.id,
      })
      .select("*")
      .single();
    if (error || !row) fail(`The upload could not be filed: ${error?.message}`, 500);
    await logActivity(
      session,
      "upload",
      "media",
      String((row as MediaRow).id),
      `Uploaded "${data.name}"`,
    );
    return { item: itemOf(row as MediaRow) };
  });

export const updateMedia = createServerFn({ method: "POST" })
  .inputValidator(
    input(
      z.object({
        id: idSchema,
        alt: z.string().trim().max(500),
        name: z.string().trim().max(200),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const session = await requireMember("media");
    const { error } = await session.db
      .from("media")
      .update({ alt: data.alt, name: data.name })
      .eq("id", data.id);
    if (error) fail(error.message, 500);
    await logActivity(session, "update", "media", data.id, `Updated "${data.name}"`);
    return { ok: true };
  });

/**
 * Deletes an upload the site no longer uses. The panel checks usage first
 * and only offers this for unused images; the files go with the record.
 */
export const deleteMedia = createServerFn({ method: "POST" })
  .inputValidator(input(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const session = await requireMember("media");
    const { data: row, error } = await session.db
      .from("media")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !row) fail("That image no longer exists.", 404);
    const media = row as MediaRow;
    const storage = serviceClient().storage.from(BUCKET);
    const { data: files } = await storage.list(media.path);
    if (files?.length) {
      await storage.remove(files.map((file) => `${media.path}/${file.name}`));
    }
    const { error: deleteError } = await session.db.from("media").delete().eq("id", data.id);
    if (deleteError) fail(deleteError.message, 500);
    await logActivity(session, "delete", "media", data.id, `Deleted "${media.name}"`);
    await purgeContentCache();
    return { ok: true };
  });
