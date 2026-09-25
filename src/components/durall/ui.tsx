import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function ArrowRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowLeft({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M13.5 8h-11M6.5 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Hover/tap micro-interaction wrapper.
 *
 * The movement runs as a compositor-only CSS transition on the two motion
 * tokens (see the micro-interaction layer in styles.css) rather than through
 * motion/react, which used to drag the library onto the critical path of
 * every page for what is a hover nudge. The per-instance distances travel as
 * custom properties because Tailwind cannot generate utilities for values
 * computed at runtime.
 */
export function Interactive({
  children,
  className,
  lift = -3,
  scale = 1.02,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
  as?: "div" | "article" | "li";
} & Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "children">) {
  const Tag = as;

  return (
    // Two elements, deliberately. The outer one is what the reveal hooks
    // animate — `...rest` carries the `data-card` / `data-cell` marker they
    // select on, which an earlier implementation silently swallowed, so
    // `[data-card]` matched nothing and the staggered grid reveals on the
    // home page and both partners grids never actually ran.
    //
    // The hover lives on the inner one because GSAP claims an element's
    // transform by writing inline `transform`, `translate: none` and
    // `scale: none`, which a CSS hover on the same element cannot outrank.
    <Tag {...rest} className="min-w-0">
      <div
        className={`interactive h-full ${className ?? ""}`}
        style={{ "--lift": `${lift}px`, "--scale": scale } as CSSProperties}
      >
        {children}
      </div>
    </Tag>
  );
}

/* The three link primitives below take either `href` (an in-page anchor) or
 * `to` (a route). `to` renders a router <Link>: written as a plain anchor, a
 * cross-route href forces a full document reload, which is what three of
 * these call sites were doing. */
// Explicit `| undefined` rather than optional keys: the project runs with
// exactOptionalPropertyTypes, where forwarding a destructured optional prop
// is not the same as omitting it.
type Destination = {
  href?: string | undefined;
  to?: string | undefined;
  hash?: string | undefined;
};

function destinationProps({ href, to, hash }: Destination) {
  if (to) return { to, ...(hash ? { hash } : {}) } as const;
  return { href: href ?? "#" } as const;
}

export function CtaButton({
  children,
  variant = "outline",
  href,
  to,
  hash,
}: { children: ReactNode; variant?: "outline" | "solid" } & Destination) {
  const className =
    "group hover-lift inline-flex min-h-12 items-center gap-2.5 border px-[clamp(1.125rem,2vw,1.625rem)] py-4 font-display text-xs font-bold tracking-button uppercase " +
    (variant === "solid"
      ? "border-navy bg-navy text-white hover:bg-[#0b1152]"
      : "border-white text-white hover:bg-white/12");
  const inner = (
    <>
      <span>{children}</span>
      <ArrowRight className="hover-arrow h-3.5 w-3.5" />
    </>
  );

  if (to) {
    return (
      <Link {...destinationProps({ to, hash })} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href ?? "#"} className={className}>
      {inner}
    </a>
  );
}

export function UnderlineLink({ children, href, to, hash }: { children: ReactNode } & Destination) {
  const className =
    "group hover-lift inline-flex min-h-11 w-fit items-center gap-3 border-b border-navy-14 pb-1.5 font-display text-xs font-bold tracking-eyebrow text-navy uppercase hover:border-navy";
  const inner = (
    <>
      {children}
      <ArrowRight className="hover-arrow h-3 w-3" />
    </>
  );

  if (to) {
    return (
      <Link {...destinationProps({ to, hash })} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href ?? "#"} className={className}>
      {inner}
    </a>
  );
}

export function ViewMore({
  href,
  to,
  hash,
  label = "View More",
}: { label?: string } & Destination) {
  const className = "group hover-lift inline-flex items-stretch gap-1";
  const inner = (
    <>
      <span className="flex min-h-12 items-center rounded-full bg-mist px-8 py-3 font-body text-sm font-medium text-navy transition-colors duration-[var(--dur-short)] group-hover:bg-navy/10">
        {label}
      </span>
      <span className="flex min-h-12 w-12 items-center justify-center rounded-full bg-navy text-white transition-colors duration-[var(--dur-short)] group-hover:bg-[#0b1152]">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="hover-arrow h-4 w-4">
          <path d="M4 12L12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </>
  );

  if (to) {
    return (
      <Link {...destinationProps({ to, hash })} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href ?? "#"} className={className}>
      {inner}
    </a>
  );
}
