import { useMemo, useRef, useState, type DragEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, ImageUp, Search, Trash2 } from "lucide-react";
import { deleteMedia, updateMedia } from "@/admin/api/media";
import { loadAllContent } from "@/admin/api/content";
import { useAdmin } from "@/admin/context";
import {
  ACCEPT_ATTR,
  BUILT_IN,
  libraryImageOf,
  uploadImage,
  useMediaLibrary,
  useRefreshMedia,
  type LibraryImage,
} from "@/admin/lib/media";
import { usageOf } from "@/admin/lib/usage";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Notice,
  PageHeader,
  Skeleton,
  TextInput,
} from "@/admin/ui/controls";
import { Dialog, errorMessage, useConfirm, useToast } from "@/admin/ui/overlay";
import { cn } from "@/lib/utils";

const bytes = new Intl.NumberFormat("en", {
  style: "unit",
  unit: "kilobyte",
  maximumFractionDigits: 0,
});
const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export function MediaScreen() {
  const { editable, uploads, configured } = useAdmin();
  const media = useMediaLibrary();
  const refresh = useRefreshMedia();
  const everything = useQuery({
    queryKey: ["admin", "all-content"],
    queryFn: () => loadAllContent(),
  });
  const toast = useToast();
  const [tab, setTab] = useState<"uploads" | "built-in">("uploads");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LibraryImage | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploaded = useMemo(() => (media.data?.items ?? []).map(libraryImageOf), [media.data]);
  const list = tab === "uploads" ? uploaded : BUILT_IN;
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? list.filter((i) => `${i.name} ${i.alt}`.toLowerCase().includes(needle))
    : list;
  const canUpload = editable && uploads;

  const upload = async (files: FileList | File[]) => {
    const all = [...files];
    for (const [index, file] of all.entries()) {
      try {
        await uploadImage(file, "", (step) =>
          setProgress(all.length > 1 ? `${index + 1} of ${all.length}: ${step}` : step),
        );
      } catch (error) {
        toast({ tone: "error", title: `${file.name} was not uploaded`, body: errorMessage(error) });
      }
    }
    setProgress(null);
    setTab("uploads");
    await refresh();
    toast({ tone: "success", title: all.length > 1 ? "Images uploaded" : "Image uploaded" });
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (canUpload && event.dataTransfer.files.length) void upload(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(event) => {
        if (!canUpload) return;
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <PageHeader
        title="Media"
        description="Every image on the site: the photographs it shipped with, and everything uploaded here. Uploads are resized for phones, laptops and large screens automatically."
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT_ATTR}
              multiple
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => {
                if (event.target.files?.length) void upload(event.target.files);
                event.target.value = "";
              }}
            />
            <Button
              variant="primary"
              disabled={!canUpload || Boolean(progress)}
              busy={Boolean(progress)}
              onClick={() => fileRef.current?.click()}
            >
              {!progress ? <ImageUp className="h-4 w-4" aria-hidden="true" /> : null}
              {progress ?? "Upload Images"}
            </Button>
          </>
        }
      />
      {!configured ? (
        <div className="mb-5">
          <Notice tone="warning">Uploading needs the database and storage to be connected.</Notice>
        </div>
      ) : configured && !uploads ? (
        <div className="mb-5">
          <Notice tone="warning" title="Uploads are switched off">
            Add SUPABASE_SERVICE_ROLE_KEY to the site’s environment settings to allow uploads.
          </Notice>
        </div>
      ) : null}
      {dragging ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-4 z-40 grid place-items-center rounded-3xl border-2 border-dashed border-accent-blue bg-accent-blue/8 font-display text-lg font-medium text-accent-blue backdrop-blur-sm"
        >
          Drop to upload
        </div>
      ) : null}

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
        <div className="relative w-full sm:w-72">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate"
          />
          <TextInput
            type="search"
            aria-label="Search images"
            placeholder="Search images…"
            value={query}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {tab === "uploads" && media.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          title={needle ? "No images match that search" : "No uploads yet"}
          body={
            needle
              ? "Try another word."
              : canUpload
                ? "Upload images here, or drop them anywhere on this screen. They can then be used in any image field."
                : "Uploaded images will appear here."
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {shown.map((image) => (
            <li key={image.key} className="min-w-0">
              <button
                type="button"
                onClick={() => setSelected(image)}
                className="admin-focus group block w-full overflow-hidden rounded-xl border border-navy/10 bg-white text-left transition-[border-color,box-shadow] duration-150 hover:border-navy/30 hover:shadow-[0_8px_20px_-12px_rgb(5_8_52/0.3)]"
              >
                <span className="block aspect-[4/3] bg-glass">
                  <img
                    src={image.thumb}
                    alt={image.alt || ""}
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
              </button>
            </li>
          ))}
        </ul>
      )}

      <ImageDetails
        image={selected}
        usage={selected ? usageOf(everything.data, selected.ref) : []}
        usageLoading={everything.isLoading}
        onClose={() => setSelected(null)}
        onChanged={async () => {
          await refresh();
          await everything.refetch();
        }}
      />
    </div>
  );
}

function ImageDetails({
  image,
  usage,
  usageLoading,
  onClose,
  onChanged,
}: {
  image: LibraryImage | null;
  usage: string[];
  usageLoading: boolean;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const { editable } = useAdmin();
  const toast = useToast();
  const confirm = useConfirm();
  const [alt, setAlt] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [shownFor, setShownFor] = useState<string | null>(null);

  // Reset the form when a different image opens.
  if (image && shownFor !== image.key) {
    setShownFor(image.key);
    setAlt(image.alt);
    setName(image.name);
  }

  if (!image) return <Dialog open={false} onClose={onClose} title="" />;
  const media = image.media;
  const url = media?.src ?? image.thumb;

  const save = async () => {
    if (!media) return;
    setBusy(true);
    try {
      await updateMedia({ data: { id: media.id, alt, name } });
      toast({ tone: "success", title: "Image details saved" });
      await onChanged();
      onClose();
    } catch (error) {
      toast({ tone: "error", title: "Not saved", body: errorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!media) return;
    const ok = await confirm({
      title: `Delete “${image.name}”?`,
      body: "The files are removed from storage. This cannot be undone.",
      confirmLabel: "Delete Image",
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      await deleteMedia({ data: { id: media.id } });
      toast({ tone: "success", title: "Image deleted" });
      await onChanged();
      onClose();
    } catch (error) {
      toast({ tone: "error", title: "Not deleted", body: errorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={image.name}
      description={
        image.builtIn
          ? "Bundled with the site."
          : media
            ? `Uploaded ${when.format(new Date(media.createdAt))}`
            : undefined
      }
      footer={
        <>
          {!image.builtIn && editable ? (
            <Button
              variant="ghost"
              disabled={busy || usageLoading || usage.length > 0}
              onClick={() => void remove()}
              className="mr-auto text-[#b42318] hover:bg-[#b42318]/8 hover:text-[#b42318]"
              title={usage.length ? "Remove it from the places listed first." : undefined}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </Button>
          ) : null}
          <Button onClick={onClose}>Close</Button>
          {!image.builtIn && editable ? (
            <Button variant="primary" busy={busy} onClick={() => void save()}>
              Save Details
            </Button>
          ) : null}
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl bg-glass">
          <img
            src={url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="max-h-[50vh] w-full object-contain"
          />
        </div>
        <div className="grid content-start gap-5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
            <dt className="text-slate">Size</dt>
            <dd className="text-navy tabular-nums">
              {image.width} × {image.height}
            </dd>
            {media ? (
              <>
                <dt className="text-slate">Files</dt>
                <dd className="text-navy tabular-nums">
                  {media.srcSet?.split(",").length ?? 1} sizes ·{" "}
                  {bytes.format(Math.round(media.bytes / 1024))}
                </dd>
              </>
            ) : null}
          </dl>
          {!image.builtIn ? (
            <>
              <Field label="Name">
                {({ id }) => (
                  <TextInput
                    id={id}
                    value={name}
                    disabled={!editable}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </Field>
              <Field
                label="Default description (alt text)"
                hint="Offered whenever this image is chosen for a field."
              >
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={alt}
                    disabled={!editable}
                    onChange={(e) => setAlt(e.target.value)}
                  />
                )}
              </Field>
              <Button
                size="sm"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(url)
                    .then(() => toast({ tone: "success", title: "Address copied" }));
                }}
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                Copy Image Address
              </Button>
            </>
          ) : null}
          <div>
            <p className="text-[0.8125rem] font-medium text-navy">Used on</p>
            {usageLoading ? (
              <p className="mt-1 text-xs text-slate">Checking…</p>
            ) : usage.length ? (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {usage.map((place) => (
                  <li key={place}>
                    <Badge>{place}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-xs text-slate">Not used anywhere on the site yet.</p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
