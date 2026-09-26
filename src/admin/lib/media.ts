import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IMAGES } from "@/assets/images";
import type { ImageKey } from "@/content/render";
import type { ImageRef } from "@/content/types";
import { finishUpload, listMedia, startUpload, type MediaItem } from "@/admin/api/media";

/* The media library on the client: the images bundled with the site, the
 * ones uploaded in the panel, and the upload itself. */

export type LibraryImage = {
  ref: ImageRef;
  /** Stable key for lists: the asset key or the upload id. */
  key: string;
  name: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  builtIn: boolean;
  media?: MediaItem;
};

/** "heroParikrama" → "Hero parikrama" */
function labelOf(key: string) {
  const words = key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function smallest(src: string, srcSet?: string | null) {
  const first = srcSet?.split(",")[0]?.trim().split(" ")[0];
  return first || src;
}

export const BUILT_IN: LibraryImage[] = (Object.keys(IMAGES) as ImageKey[]).map((key) => {
  const asset = IMAGES[key];
  return {
    ref: { kind: "asset", key },
    key,
    name: labelOf(key),
    thumb: smallest(asset.src, "srcSet" in asset ? asset.srcSet : undefined),
    width: asset.width,
    height: asset.height,
    alt: "",
    builtIn: true,
  };
});

export function uploadRef(item: MediaItem): ImageRef {
  return {
    kind: "upload",
    id: item.id,
    src: item.src,
    width: item.width,
    height: item.height,
    ...(item.srcSet ? { srcSet: item.srcSet } : {}),
  };
}

export function libraryImageOf(item: MediaItem): LibraryImage {
  return {
    ref: uploadRef(item),
    key: item.id,
    name: item.name || "Untitled image",
    thumb: smallest(item.src, item.srcSet),
    width: item.width,
    height: item.height,
    alt: item.alt,
    builtIn: false,
    media: item,
  };
}

/** A thumbnail URL and label for whatever an image field currently holds. */
export function describeRef(ref: ImageRef | null | undefined): {
  thumb: string;
  name: string;
  size: string;
} | null {
  if (!ref) return null;
  if (ref.kind === "asset") {
    const found = BUILT_IN.find((image) => image.key === ref.key);
    return found
      ? { thumb: found.thumb, name: found.name, size: `${found.width} × ${found.height}` }
      : { thumb: "", name: `Missing image (${ref.key})`, size: "" };
  }
  return {
    thumb: smallest(ref.src, ref.srcSet),
    name: "Uploaded image",
    size: `${ref.width} × ${ref.height}`,
  };
}

export function sameImage(a: ImageRef | null | undefined, b: ImageRef | null | undefined) {
  if (!a || !b) return false;
  if (a.kind === "asset" && b.kind === "asset") return a.key === b.key;
  if (a.kind === "upload" && b.kind === "upload") return a.id === b.id;
  return false;
}

export const MEDIA_QUERY = ["admin", "media"] as const;

export function useMediaLibrary() {
  return useQuery({ queryKey: MEDIA_QUERY, queryFn: () => listMedia(), staleTime: 30_000 });
}

export function useRefreshMedia() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: MEDIA_QUERY });
}

/* ── Upload ──────────────────────────────────────────────────────────────── */

const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];
export const ACCEPT_ATTR = ACCEPTED.join(",");
const MAX_BYTES = 30 * 1024 * 1024;
/** The widths the site's responsive images choose between. */
const WIDTHS = [640, 1280, 1920];
const LARGEST = 2560;

type Output = { name: string; blob: Blob; width: number; height: number };

async function dimensionsOf(file: Blob): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return { width: image.naturalWidth || 1, height: image.naturalHeight || 1 };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function encode(bitmap: ImageBitmap, width: number): Promise<Output> {
  const height = Math.max(1, Math.round((bitmap.height * width) / bitmap.width));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot resize images.");
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob) throw new Error("The image could not be converted.");
  return { name: `${width}.webp`, blob, width, height };
}

/**
 * Resizes an image into the site's web sizes as WebP, uploads every size
 * straight to storage, and files it in the library. SVG and GIF are kept as
 * they are: resizing would flatten a logo or stop an animation.
 */
export async function uploadImage(
  file: File,
  alt = "",
  onProgress?: (message: string) => void,
): Promise<MediaItem> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("Choose a JPG, PNG, WebP, AVIF, GIF or SVG image.");
  }
  if (file.size > MAX_BYTES) throw new Error("That image is over 30 MB. Export a smaller one.");

  onProgress?.("Preparing…");
  let outputs: Output[];
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    const { width, height } = await dimensionsOf(file);
    const extension = file.type === "image/svg+xml" ? "svg" : "gif";
    outputs = [{ name: `original.${extension}`, blob: file, width, height }];
  } else {
    const bitmap = await createImageBitmap(file);
    const widths = [
      ...new Set([...WIDTHS.filter((w) => w < bitmap.width), Math.min(bitmap.width, LARGEST)]),
    ].sort((a, b) => a - b);
    outputs = [];
    for (const width of widths) outputs.push(await encode(bitmap, width));
    bitmap.close();
  }

  onProgress?.("Uploading…");
  const { folder, targets } = await startUpload({
    data: { files: outputs.map((o) => ({ name: o.name, type: o.blob.type as never })) },
  });
  const urls: string[] = [];
  for (const [index, output] of outputs.entries()) {
    const target = targets[index]!;
    const response = await fetch(target.uploadUrl, {
      method: "PUT",
      headers: {
        "content-type": output.blob.type,
        "cache-control": "max-age=31536000",
        "x-upsert": "false",
      },
      body: output.blob,
    });
    if (!response.ok) throw new Error(`The upload failed (${response.status}). Try again.`);
    urls.push(target.publicUrl);
  }

  onProgress?.("Saving…");
  const largest = outputs[outputs.length - 1]!;
  const srcSet =
    outputs.length > 1 ? outputs.map((o, i) => `${urls[i]} ${o.width}w`).join(", ") : null;
  const { item } = await finishUpload({
    data: {
      folder,
      src: urls[urls.length - 1]!,
      srcSet,
      width: largest.width,
      height: largest.height,
      name: file.name.replace(/\.[^.]+$/, "").slice(0, 200),
      alt,
      bytes: outputs.reduce((sum, o) => sum + o.blob.size, 0),
    },
  });
  return item;
}
