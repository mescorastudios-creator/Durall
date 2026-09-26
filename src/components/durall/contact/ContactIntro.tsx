import { REVEAL_WINDOW, useReveal, useSplitLines } from "@/lib/anim";
import type { Intro } from "@/content/types";

/**
 * Page opening, built to the same shape as ProjectsIntro: a quiet white band
 * rather than the full-height photographic hero /about and /partners use. A
 * contact page should not ask for a viewport of scrolling before the form is
 * reachable, and this is the pattern the site already has for that.
 */
export function ContactIntro({ content }: { content: Intro }) {
  const headingRef = useSplitLines<HTMLHeadingElement>({ start: REVEAL_WINDOW.start });
  const ref = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 32 });

  return (
    <section className="relative bg-white pt-[max(calc(var(--header-h)+2rem),clamp(5.5rem,9vw,9.5rem))] pb-[clamp(2rem,3.5vw,3.5rem)]">
      <div ref={ref} className="shell">
        <h1
          ref={headingRef}
          className="max-w-[60rem] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.06] font-medium tracking-section text-balance text-navy"
        >
          {content.title}
        </h1>
        <p
          data-reveal
          className="mt-[clamp(1.5rem,2.4vw,2.75rem)] max-w-[34rem] font-body text-[clamp(0.9375rem,1.1vw,1rem)] leading-relaxed text-pretty text-slate"
        >
          {content.lede}
        </p>
      </div>
    </section>
  );
}
