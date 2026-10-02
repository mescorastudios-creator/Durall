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
 * The line behind a project photograph on hover: the photograph's outline,
 * set up and to the left of it, its top-right corner cut at 45°. On hover or
 * keyboard focus of the card (a `group`) it draws itself, starting at its
 * bottom-left corner and travelling up, across the top and round; on leaving
 * it runs back the same way. Under reduced motion it only fades in.
 *
 * Five straight pieces grown by `scale` one after another rather than a
 * dashed SVG stroke: transform only, and the same in every browser at every
 * size. The timings live with `.card-frame` in styles.css.
 *
 * Place it before the photograph inside a `relative` box of the same size.
 */
export function CardFrame() {
  return (
    <span aria-hidden="true" className="card-frame">
      <span data-edge="left" />
      <span data-edge="top" />
      <span data-edge="cut" />
      <span data-edge="right" />
      <span data-edge="bottom" />
    </span>
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

/* The site's buttons, from the style sheet in the design file ("One system,
 * used everywhere"): 48px tall, 24px either side, square corners, 13px Space
 * Grotesk Medium tracked 1px, and a 16px arrow 16px after the label. Hover
 * and pressed take Navy 700. Exported as class strings because several
 * buttons are not links (form submits, the viewer's Close). */
const BUTTON_BASE =
  "group hover-lift inline-flex h-12 cursor-pointer items-center justify-center gap-4 px-6 font-display text-[0.8125rem] leading-none font-medium tracking-[0.077em] whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-progress disabled:opacity-80";

export const BUTTON = {
  /** Solid navy: one per view. */
  primary: `${BUTTON_BASE} bg-navy text-white hover:bg-navy-700 active:bg-navy-700 focus-visible:outline-accent-blue`,
  /** Navy outline. */
  secondary: `${BUTTON_BASE} border border-navy text-navy hover:bg-navy hover:text-white active:bg-navy-700 active:text-white focus-visible:outline-accent-blue`,
  /** The primary on a photograph or on navy: white, navy label. */
  inverted: `${BUTTON_BASE} bg-white text-navy hover:bg-[#f4f4f2] active:bg-[#dadbe3] focus-visible:outline-white`,
  /** The secondary on a photograph or on navy. */
  outlineLight: `${BUTTON_BASE} border border-white text-white hover:bg-white hover:text-navy active:bg-[#f4f4f2] active:text-navy focus-visible:outline-white`,
} as const;

/** The sheet's text link: label and arrow on a navy rule, 24px tall. The
 * pseudo-element brings the target up to 44px without moving the rule. */
export const TEXT_LINK =
  "group hover-lift relative inline-flex h-6 w-fit items-start gap-4 border-b border-navy font-display text-[0.8125rem] leading-[1.28] font-medium tracking-[0.077em] whitespace-nowrap text-navy uppercase after:absolute after:-inset-x-2 after:-inset-y-2.5 after:content-[''] hover:border-navy-700 hover:text-navy-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue";

export function CtaButton({
  children,
  variant = "primary",
  href,
  to,
  hash,
}: { children: ReactNode; variant?: keyof typeof BUTTON } & Destination) {
  const className = BUTTON[variant];
  const inner = (
    <>
      <span>{children}</span>
      <ArrowRight className="hover-arrow h-4 w-4 shrink-0" />
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
  const inner = (
    <>
      {children}
      <ArrowRight className="hover-arrow h-4 w-4 shrink-0" />
    </>
  );

  if (to) {
    return (
      <Link {...destinationProps({ to, hash })} className={TEXT_LINK}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href ?? "#"} className={TEXT_LINK}>
      {inner}
    </a>
  );
}

/** The sheet's secondary button: it replaces the old "View More" pill. */
export function ViewMore({
  href,
  to,
  hash,
  label = "View More",
}: { label?: string } & Destination) {
  return (
    <CtaButton variant="secondary" href={href} to={to} hash={hash}>
      {label}
    </CtaButton>
  );
}
