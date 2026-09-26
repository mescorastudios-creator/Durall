import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useSectionIntro } from "@/lib/anim";
import { linkTo } from "@/content/render";
import type { CtaBand } from "@/content/types";

/**
 * The navy closing plate. Extracted from ProjectsCta so /expertise,
 * /insights and /careers close the same way the rest of the site does.
 *
 * The action used to be a `motion.a href="/contact"` on a spring: a plain
 * anchor across routes forces a full document reload, and the spring was one
 * of ten curves on a page that should have had one. It is a router Link on
 * the shared micro token now.
 */
export function PageCta({
  eyebrow = "Start a project",
  heading,
  body,
  action = "Talk to our team",
  to = "/contact",
  hash,
  href,
}: {
  eyebrow?: string;
  heading: ReactNode;
  body: ReactNode;
  action?: string;
  to?: string;
  hash?: string | undefined;
  /** A non-route destination such as a mailto: link. Takes precedence over `to`. */
  href?: string | undefined;
}) {
  const ref = useSectionIntro<HTMLDivElement>();
  const actionClass =
    "group hover-lift inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-8 py-4 font-display text-sm font-bold tracking-button text-navy uppercase hover:bg-mist";
  const actionInner = (
    <>
      {action}
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="hover-arrow h-3 w-3">
        <path d="M2 10L10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </>
  );

  return (
    <section id="contact" className="bg-navy py-[clamp(3.5rem,6vw,6.5rem)] text-white">
      <div ref={ref} className="shell flex flex-col items-center text-center">
        <p
          data-anim
          className="font-display text-xs font-bold tracking-[0.1875rem] text-accent-blue uppercase"
        >
          {eyebrow}
        </p>
        <h2
          data-anim="lines"
          className="mt-6 max-w-[50rem] font-display text-[clamp(2rem,4.4vw,4.25rem)] leading-[1.12] font-medium tracking-section text-balance text-white"
        >
          {heading}
        </h2>
        <p
          data-anim
          className="mt-6 max-w-[50rem] font-body text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.56] text-pretty text-white/70"
        >
          {body}
        </p>
        <div data-anim className="mt-[clamp(2rem,3.4vw,3rem)]">
          {href ? (
            <a href={href} className={actionClass}>
              {actionInner}
            </a>
          ) : (
            <Link to={to} {...(hash ? { hash } : {})} className={actionClass}>
              {actionInner}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/** The closing band from stored content. */
export function PageCtaBand({ band }: { band: CtaBand }) {
  const target = linkTo(band.action.href);
  return (
    <PageCta
      eyebrow={band.eyebrow}
      heading={band.heading}
      body={band.body}
      action={band.action.label}
      {...("to" in target ? { to: target.to, hash: target.hash } : { href: target.href })}
    />
  );
}
