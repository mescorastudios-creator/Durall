import { useMemo, useRef, useState } from "react";
import { Check, ImageUp, Search } from "lucide-react";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/admin/context";
import {
  ACCEPT_ATTR,
  BUILT_IN,
  libraryImageOf,
  sameImage,
  uploadImage,
  useMediaLibrary,
  useRefreshMedia,
  type LibraryImage,
} from "@/admin/lib/media";
import { Button, EmptyState, Skeleton, TextInput } from "@/admin/ui/controls";
import { Dialog, errorMessage, useToast } from "@/admin/ui/overlay";

/**
 * Choose an image for a field: from the uploads, from the photographs the
 * site shipped with, or upload a new one on the spot.
 */
export function MediaPicker({
  open,
  onClose,
  current,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  current: ImageRef | null | undefined;
  onPick: (image: LibraryImage) => void;
}) {
  const { editable, uploads } = useAdmin();
  const media = useMediaLibrary();
  const refresh = useRefreshMedia();
  const toast = useToast();
  // Open on the tab the current image comes from.
  const [tab, setTab] = useState<"uploads" | "built-in">(
    current?.kind === "upload" ? "uploads" : "built-in",
  );
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploaded = useMemo(() => (media.data?.items ?? []).map(libraryImageOf), [media.data]);
  const list = tab === "uploads" ? uploaded : BUILT_IN;
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? list.filter((image) => `${image.name} ${image.alt}`.toLowerCase().includes(needle))
    : list;

  const upload = async (file: File) => {
    setBusy("Preparing…");
    try {
      const item = await uploadImage(file, "", setBusy);
      await refresh();
      toast({ tone: "success", title: "Image uploaded" });
      onPick(libraryImageOf(item));
    } catch (error) {
      toast({ tone: "error", title: "Upload failed", body: errorMessage(error) });
    } finally {
      setBusy(null);
    }
  };

  const canUpload = editable && uploads;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="xl"
      title="Choose an Image"
      description="Pick one of your uploads or one of the site's own photographs, or upload a new image."
      footer={
        <>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT_ATTR}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void upload(file);
            }}
          />
          <p className="mr-auto text-xs text-slate">
            {canUpload
              ? "Uploads are resized for the web automatically."
              : "Uploading is available once the database is connected."}
          </p>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!canUpload || Boolean(busy)}
            busy={Boolean(busy)}
            onClick={() => fileRef.current?.click()}
          >
            {!busy ? <ImageUp className="h-4 w-4" aria-hidden="true" /> : null}
            {busy ?? "Upload New Image"}
          </Button>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Image source"
          className="inline-flex rounded-full bg-navy/6 p-1"
        >
          {(
            [
              ["uploads", `Uploads (${uploaded.length})`],
              ["built-in", `Site photographs (${BUILT_IN.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "admin-focus min-h-8 rounded-full px-3.5 text-xs font-medium transition-colors duration-150",
                tab === key ? "bg-white text-navy shadow-sm" : "text-slate hover:text-navy",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate"
          />
          <TextInput
            type="search"
            aria-label="Search images"
            placeholder="Search images…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
      </div>

      {tab === "uploads" && media.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          title={needle ? "No images match that search" : "No uploads yet"}
          body={
            needle
              ? "Try another word, or look in the other tab."
              : "Upload an image, or choose one of the site's own photographs."
          }
          action={
            !needle ? (
              <Button onClick={() => setTab("built-in")}>Browse Site Photographs</Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {shown.map((image) => {
            const selected = sameImage(image.ref, current);
            return (
              <li key={image.key} className="min-w-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onPick(image)}
                  className={cn(
                    "admin-focus group relative block w-full overflow-hidden rounded-xl border bg-white text-left transition-[border-color,box-shadow] duration-150",
                    selected
                      ? "border-accent-blue shadow-[0_0_0_2px_var(--color-accent-blue)]"
                      : "border-navy/10 hover:border-navy/30",
                  )}
                >
                  <span className="block aspect-[4/3] bg-[conic-gradient(#eef0f1_90deg,#fff_90deg_180deg,#eef0f1_180deg_270deg,#fff_270deg)] bg-[length:16px_16px]">
                    <img
                      src={image.thumb}
                      alt=""
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="block truncate px-2.5 pt-2 text-xs font-medium text-navy">
                    {image.name}
                  </span>
                  <span className="block px-2.5 pb-2 text-[0.6875rem] text-slate tabular-nums">
                    {image.width} × {image.height}
                  </span>
                  {selected ? (
                    <span className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-accent-blue text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">Selected</span>
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
}
