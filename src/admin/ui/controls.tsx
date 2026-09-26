import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/* The panel's controls. One shape rule throughout: anything you press is a
 * pill (buttons, badges, toggles, nav); anything you type into, and every
 * panel, has a 12–16px radius. */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const BUTTON_BASE =
  "admin-focus inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-display font-medium whitespace-nowrap transition-[background-color,color,border-color,box-shadow,opacity] duration-150 ease-[var(--ease-micro)] disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px";

const BUTTON_SIZE: Record<Size, string> = {
  sm: "min-h-9 px-3.5 text-xs",
  md: "min-h-10 px-4.5 text-[0.8125rem]",
};

const BUTTON_VARIANT: Record<Variant, string> = {
  primary: "bg-navy text-white shadow-[0_1px_2px_rgb(5_8_52/0.2)] hover:bg-[#0b1152]",
  secondary: "border border-navy/15 bg-white text-navy hover:border-navy/35 hover:bg-mist",
  ghost: "text-navy/75 hover:bg-navy/6 hover:text-navy",
  danger: "bg-[#b42318] text-white hover:bg-[#912018]",
};

export function buttonClass(variant: Variant = "secondary", size: Size = "md", className = "") {
  return cn(BUTTON_BASE, BUTTON_SIZE[size], BUTTON_VARIANT[variant], className);
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; busy?: boolean }
>(function Button({ variant = "secondary", size = "md", busy, className, children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-busy={busy || undefined}
      {...rest}
      className={buttonClass(variant, size, cn(busy && "cursor-progress", className))}
    >
      {busy ? <Spinner /> : null}
      {children}
    </button>
  );
});

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...rest
}: LinkProps & { variant?: Variant; size?: Size; className?: string; children: ReactNode }) {
  return (
    <Link {...rest} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cn(
        "admin-focus grid h-9 w-9 shrink-0 place-items-center rounded-full text-navy/70 transition-colors duration-150 hover:bg-navy/6 hover:text-navy disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Spinner({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0 motion-safe:animate-spin", className)}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
      <path
        d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Fields ──────────────────────────────────────────────────────────────── */

export const INPUT =
  "admin-focus w-full min-w-0 rounded-xl border border-navy/15 bg-white px-3 text-sm text-navy transition-[border-color,box-shadow] duration-150 placeholder:text-slate/60 hover:border-navy/30 focus-visible:border-accent-blue disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate aria-[invalid=true]:border-[#b42318]";

type FieldProps = {
  label: ReactNode;
  hint?: ReactNode | undefined;
  error?: string | null | undefined;
  /** Hide the label visually (it stays for screen readers). */
  hideLabel?: boolean | undefined;
  className?: string | undefined;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
};

export function Field({ label, hint, error, hideLabel, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("grid min-w-0 content-start gap-1.5", className)}>
      <label
        htmlFor={id}
        className={cn("text-[0.8125rem] font-medium text-navy", hideLabel && "sr-only")}
      >
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-pretty text-slate">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-[#b42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...rest }, ref) {
    return <input ref={ref} type="text" {...rest} className={cn(INPUT, "min-h-10", className)} />;
  },
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, rows = 3, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      {...rest}
      // Grows with its text where the browser can, so long copy is read in
      // full rather than in a scrolling slot.
      className={cn(
        INPUT,
        "min-h-20 resize-y py-2.5 leading-relaxed [field-sizing:content]",
        className,
      )}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        {...rest}
        className={cn(INPUT, "admin-select min-h-10 cursor-pointer pr-9", className)}
      >
        {children}
      </select>
    );
  },
);

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-[0.8125rem] font-medium text-navy">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-pretty text-slate">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "admin-focus relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-accent-blue" : "bg-navy/20",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-[var(--ease-micro)]",
            checked ? "translate-x-[1.125rem]" : "translate-x-[0.1875rem]",
          )}
        />
      </button>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-navy/10 bg-white p-3 transition-colors duration-150 hover:border-navy/25 has-[:checked]:border-accent-blue/50 has-[:checked]:bg-accent-blue/[0.04] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-blue",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent-blue)]"
      />
      <span className="min-w-0">
        <span className="block text-[0.8125rem] font-medium text-navy">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-slate">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

/* ── Surfaces ────────────────────────────────────────────────────────────── */

export function Card({
  title,
  description,
  actions,
  children,
  id,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 rounded-2xl border border-navy/10 bg-white shadow-[0_1px_2px_rgb(5_8_52/0.04)]",
        className,
      )}
    >
      {title || actions ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-navy/8 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-display text-[0.9375rem] font-medium text-balance text-navy">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 max-w-[60ch] text-xs leading-relaxed text-pretty text-slate">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children ? <div className={cn("px-5 py-5 sm:px-6", bodyClassName)}>{children}</div> : null}
    </section>
  );
}

type Tone = "neutral" | "success" | "info" | "warning" | "danger";

const BADGE: Record<Tone, string> = {
  neutral: "bg-navy/6 text-slate-deep",
  success: "bg-[#e6f4ec] text-[#116237]",
  info: "bg-accent-blue/10 text-accent-blue",
  warning: "bg-[#fdf2dc] text-[#8a5300]",
  danger: "bg-[#fdecea] text-[#9f1f14]",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-display text-[0.6875rem] font-medium whitespace-nowrap",
        BADGE[tone],
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string } | undefined;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        {back ? (
          <Link
            to={back.to}
            className="admin-focus mb-2 inline-flex min-h-8 items-center gap-1.5 rounded-full text-xs font-medium text-slate hover:text-navy"
          >
            <span aria-hidden="true">←</span> {back.label}
          </Link>
        ) : null}
        <h1 className="font-display text-[clamp(1.5rem,2.4vw,1.875rem)] leading-tight font-medium tracking-tight text-balance text-navy">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-pretty text-slate">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-navy/15 bg-white/60 px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-navy/40">{icon}</div> : null}
      <p className="font-display text-[0.9375rem] font-medium text-navy">{title}</p>
      {body ? (
        <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-slate">{body}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-xl bg-navy/[0.06] motion-safe:animate-pulse", className)}
    />
  );
}

/** A loading panel shaped like the screen it stands in for. */
export function ScreenSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading…" className="grid gap-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="mt-4 grid gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
  action,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const tones = {
    info: "border-accent-blue/25 bg-accent-blue/[0.05]",
    warning: "border-[#e8b44c]/50 bg-[#fdf6e7]",
    danger: "border-[#b42318]/30 bg-[#fdf1ef]",
    success: "border-[#116237]/25 bg-[#eef8f2]",
  } as const;
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 rounded-2xl border px-4 py-3.5 sm:px-5",
        tones[tone],
      )}
    >
      <div className="min-w-0 text-sm leading-relaxed text-pretty text-navy">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? (
          <div className={cn(title && "mt-0.5", "text-slate-deep")}>{children}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
