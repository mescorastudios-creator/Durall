import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "./controls";

/* ── Dialog ──────────────────────────────────────────────────────────────── */

/**
 * The native <dialog>: focus is trapped and restored by the browser, Escape
 * closes it, and the rest of the page is inert while it is open.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // The browser would focus the first control, the close button, and
      // Safari rings it. Start on the control marked data-autofocus, or on
      // the dialog itself so Tab begins at the top.
      (dialog.querySelector<HTMLElement>("[data-autofocus]") ?? dialog).focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-6xl" } as const;

  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "admin-root m-auto max-h-[min(90dvh,56rem)] w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-navy/10 bg-white p-0 text-navy shadow-[0_24px_64px_-12px_rgb(5_8_52/0.35)] outline-none open:flex open:flex-col",
        widths[size],
      )}
    >
      {open ? (
        <>
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-navy/8 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 id={titleId} className="font-display text-base font-medium text-navy">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm leading-relaxed text-pretty text-slate">{description}</p>
              ) : null}
            </div>
            <IconButton label="Close" onClick={onClose} className="-mt-1 -mr-2">
              <X className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </header>
          {children ? (
            // flex-auto, not flex-1: in a dialog with no set height Safari
            // resolves a 0% basis to nothing and the body collapses.
            <div className="admin-scroll min-h-0 flex-auto overflow-y-auto px-5 py-5 sm:px-6">
              {children}
            </div>
          ) : null}
          {footer ? (
            <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-navy/8 bg-paper/60 px-5 py-3.5 sm:px-6">
              {footer}
            </footer>
          ) : null}
        </>
      ) : null}
    </dialog>
  );
}

/* ── Confirm ─────────────────────────────────────────────────────────────── */

type ConfirmOptions = {
  title: string;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(
  async () => false,
);

/** `await confirm({...})` — every destructive action in the panel asks first. */
export const useConfirm = () => useContext(ConfirmContext);

function ConfirmProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<
    (ConfirmOptions & { resolve: (value: boolean) => void }) | null
  >(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setRequest({ ...options, resolve })),
    [],
  );

  const settle = (value: boolean) => {
    request?.resolve(value);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={Boolean(request)}
        onClose={() => settle(false)}
        size="sm"
        title={request?.title ?? ""}
        footer={
          <>
            {/* Enter should never delete by accident: a dangerous
                confirm starts on Cancel. */}
            <Button onClick={() => settle(false)} data-autofocus={request?.danger || undefined}>
              {request?.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              variant={request?.danger ? "danger" : "primary"}
              onClick={() => settle(true)}
              data-autofocus={!request?.danger || undefined}
            >
              {request?.confirmLabel ?? "Confirm"}
            </Button>
          </>
        }
      >
        {request?.body ? (
          <div className="text-sm leading-relaxed text-pretty text-slate-deep">{request.body}</div>
        ) : null}
      </Dialog>
    </ConfirmContext.Provider>
  );
}

/* ── Toasts ──────────────────────────────────────────────────────────────── */

type Toast = { id: number; title: string; body?: string; tone: "success" | "error" | "info" };

const ToastContext = createContext<(toast: Omit<Toast, "id">) => void>(() => {});

/** Short confirmations ("Saved") and errors, announced to screen readers. */
export const useToast = () => useContext(ToastContext);

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++next.current;
    setToasts((list) => [...list.slice(-3), { ...toast, id }]);
    // Errors stay until dismissed; the rest leave on their own.
    if (toast.tone !== "error") {
      window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4000);
    }
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={cn(
              "admin-fade-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-[0_12px_32px_-8px_rgb(5_8_52/0.3)]",
              toast.tone === "error" ? "border-[#b42318]/30" : "border-navy/10",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                toast.tone === "success" && "bg-[#1a8a50]",
                toast.tone === "error" && "bg-[#b42318]",
                toast.tone === "info" && "bg-accent-blue",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-navy">{toast.title}</p>
              {toast.body ? (
                <p className="mt-0.5 text-xs leading-relaxed break-words text-slate">
                  {toast.body}
                </p>
              ) : null}
            </div>
            <IconButton
              label="Dismiss"
              className="-my-1 -mr-2 h-8 w-8"
              onClick={() => setToasts((list) => list.filter((t) => t.id !== toast.id))}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </IconButton>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function OverlayProviders({ children }: { children: ReactNode }) {
  const tree = useMemo(() => children, [children]);
  return (
    <ToastProvider>
      <ConfirmProvider>{tree}</ConfirmProvider>
    </ToastProvider>
  );
}

/** The message of whatever a server function threw, for a toast. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Try again.";
}
