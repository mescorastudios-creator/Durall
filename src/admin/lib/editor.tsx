import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useBlocker } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/admin/context";
import { Button } from "@/admin/ui/controls";
import { errorMessage, useConfirm, useToast } from "@/admin/ui/overlay";

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * The editing loop every screen shares: a draft beside the saved copy,
 * "unsaved changes" when they differ, ⌘S / Ctrl+S to save, and a guard
 * that asks before leaving with changes — both inside the panel (router
 * navigation) and out of it (closing the tab).
 */
export function useEditor<T>(initial: T, save: (value: T) => Promise<T>) {
  const { editable } = useAdmin();
  const toast = useToast();
  const confirm = useConfirm();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dirty = !same(saved, draft);

  // A new document loaded under this screen (another project, another page).
  const initialRef = useRef(initial);
  useEffect(() => {
    if (same(initialRef.current, initial)) return;
    initialRef.current = initial;
    setSaved(initial);
    setDraft(initial);
  }, [initial]);

  const submit = useCallback(async () => {
    if (!editable || saving) return;
    setSaving(true);
    try {
      const next = await save(draft);
      setSaved(next);
      setDraft(next);
      toast({
        tone: "success",
        title: "Saved",
        body: "The live site updates within a few seconds.",
      });
    } catch (error) {
      toast({ tone: "error", title: "Not saved", body: errorMessage(error) });
    } finally {
      setSaving(false);
    }
  }, [draft, editable, save, saving, toast]);

  const discard = useCallback(async () => {
    const ok = await confirm({
      title: "Discard your changes?",
      body: "Everything you changed since the last save will be lost.",
      confirmLabel: "Discard Changes",
      danger: true,
    });
    if (ok) setDraft(saved);
  }, [confirm, saved]);

  // ⌘S / Ctrl+S saves instead of downloading the page.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty) void submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, submit]);

  useBlocker({
    shouldBlockFn: async () => {
      if (!dirty) return false;
      const leave = await confirm({
        title: "Leave without saving?",
        body: "You have changes on this screen that are not saved yet.",
        confirmLabel: "Leave Without Saving",
        cancelLabel: "Stay",
        danger: true,
      });
      return !leave;
    },
    enableBeforeUnload: () => dirty,
  });

  return { draft, setDraft, saved, dirty, saving, submit, discard, editable };
}

/**
 * The bar that follows an editor down the screen: what is being edited,
 * whether it is saved, and the buttons to save or discard.
 */
export function SaveBar({
  title,
  dirty,
  saving,
  editable,
  onSave,
  onDiscard,
  extra,
}: {
  title: ReactNode;
  dirty: boolean;
  saving: boolean;
  editable: boolean;
  onSave: () => void;
  onDiscard: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-navy/8 bg-paper/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="mx-auto flex max-w-[72rem] flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate font-display text-sm font-medium text-navy">{title}</p>
          <span
            aria-live="polite"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs whitespace-nowrap",
              dirty ? "text-[#8a5300]" : "text-slate",
            )}
          >
            {!editable ? (
              "Preview — read only"
            ) : dirty ? (
              <>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#e8a33c]" />
                Unsaved changes
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                All changes saved
              </>
            )}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {extra}
          {editable ? (
            <>
              <Button size="sm" variant="ghost" disabled={!dirty || saving} onClick={onDiscard}>
                Discard
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={!dirty}
                busy={saving}
                onClick={onSave}
                aria-keyshortcuts="Meta+S Control+S"
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
