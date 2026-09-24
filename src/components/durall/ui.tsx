import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

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
 * Hover/tap micro-interaction wrapper that respects reduced motion.
 *
 * This was a `motion.*` element, which meant every card on every page dragged
 * motion/react onto the critical path for what is a hover nudge. The movement
 * is identical, but it now runs as a compositor-only CSS transition — and it
 * takes /partners, whose only other motion usage this was, off that dependency
 * entirely. The per-instance distances travel as custom properties because
 * Tailwind cannot generate utilities for values computed at runtime.
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
    // select on, which the previous implementation silently swallowed, so
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

/* The three link primitives below used to be `motion.a` for what amounts to a
 * 2-3px hover nudge. That pulled motion/react onto the critical path of every
 * page for a hover state CSS does natively, on the compositor, for free. They
 * are plain anchors with `motion-safe:` transitions now — same movement, same
 * easing feel, no JavaScript. */

export function CtaButton({
  children,
  variant = "outline",
  href = "#contact",
}: {
  children: ReactNode;
  variant?: "outline" | "solid";
  href?: string;
}) {
  return (
    <a
      href={href}
      className={
        "inline-flex min-h-12 items-center gap-2.5 border px-[clamp(1.125rem,2vw,1.625rem)] py-4 font-display text-xs font-bold tracking-button uppercase transition-colors duration-200 motion-safe:transition-[color,background-color,border-color,transform] motion-safe:hover:-translate-y-0.5 " +
        (variant === "solid"
          ? "border-navy bg-navy text-white hover:bg-[#0b1152]"
          : "border-white text-white hover:bg-white/12")
      }
    >
      <span>{children}</span>
      <ArrowRight />
    </a>
  );
}

export function UnderlineLink({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex min-h-11 w-fit items-center gap-3 border-b border-navy-14 pb-1.5 font-display text-xs font-bold tracking-eyebrow text-navy uppercase transition-colors hover:border-navy motion-safe:transition-[color,border-color,transform] motion-safe:hover:translate-x-0.5"
    >
      {children}
      <ArrowRight className="h-3 w-3" />
    </a>
  );
}

export function ViewMore({ href = "#" }: { href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-stretch gap-1 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
    >
      <span className="flex min-h-12 items-center rounded-full bg-mist px-8 py-3 font-body text-sm font-medium text-navy transition-colors group-hover:bg-navy/10">
        View More
      </span>
      <span className="flex min-h-12 w-12 items-center justify-center rounded-full bg-navy text-white transition-colors group-hover:bg-[#0b1152]">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
          <path d="M4 12L12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </a>
  );
}
