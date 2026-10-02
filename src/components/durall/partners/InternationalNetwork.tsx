import { useReveal, useSplitLines } from "@/lib/anim";
import { imageOf } from "@/content/render";
import type { PartnerDoc, PartnersPage } from "@/content/types";
import { Interactive } from "../ui";
import { PartnerLogo } from "./marks";

export function InternationalNetwork({
  content,
  partners,
}: {
  content: PartnersPage["network"];
  partners: readonly PartnerDoc[];
}) {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const introRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 16 });
  const gridRef = useReveal<HTMLUListElement>({ selector: "[data-cell]", y: 32, stagger: 0.08 });
  const quoteRef = useReveal<HTMLDivElement>({ y: 16 });

  return (
    <section
      id="international-systems"
      className="relative isolate overflow-hidden bg-white pt-[clamp(3.5rem,8vw,7.5rem)]"
    >
      <div ref={introRef} className="shell-about">
        <p
          data-reveal
          className="flex items-center gap-3 font-display text-[clamp(0.625rem,0.72vw,0.6875rem)] font-bold tracking-eyebrow text-accent-blue uppercase"
        >
          {content.eyebrow}
          <span
            aria-hidden="true"
            className="h-0 w-[clamp(1.5rem,3vw,2.5rem)] border-t border-accent-blue/60"
          />
        </p>
        <h2
          ref={headingRef}
          className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[22ch] font-display text-[clamp(1.875rem,3.6vw,4rem)] leading-[1.1] font-medium tracking-section text-balance text-navy"
        >
          {content.heading}
        </h2>
        <p
          data-reveal
          className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[32rem] font-body text-[clamp(0.8125rem,1vw,0.9375rem)] leading-relaxed text-slate"
        >
          {content.body}
        </p>
      </div>

      <div className="relative mt-[clamp(2.5rem,5vw,4.5rem)]">
        {/* Behind everything in the section (-z-1 inside the section's own
            stacking context), not just behind the grid: it is taller than
            the grid and reaches up under the intro, and its translucent white
            backing would otherwise wash that text out. */}
        {/* The wrapper carries the map's slow drift against the logos over
            it (ScrollFx); the image keeps its own centring. */}
        <div data-fx="drift" data-fx-by="48" className="pointer-events-none absolute inset-0 -z-1">
          <img
            draggable={false}
            {...imageOf(content.map)}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute top-1/2 left-1/2 w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-45 select-none"
            loading="lazy"
          />
        </div>
        <ul
          ref={gridRef}
          className="shell-about relative grid grid-cols-1 gap-y-[clamp(2rem,4vw,3rem)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {partners.map((partner) => (
            <li key={partner.id} data-cell className="min-w-0">
              <Interactive
                lift={-4}
                scale={1.01}
                className="flex min-w-0 flex-col items-center px-[clamp(0.75rem,1.5vw,2rem)] text-center"
              >
                <span className="flex min-h-[clamp(2.75rem,4vw,3.5rem)] items-center justify-center">
                  <PartnerLogo mark={partner.mark} name={partner.name} logo={partner.logo} />
                </span>
                <span className="mt-[clamp(1rem,2vw,1.75rem)] font-body text-xs font-medium text-slate">
                  {partner.country}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-0 w-4 border-t-[1.5px] border-accent-blue"
                />
                <span className="mt-[clamp(1rem,2vw,1.75rem)] max-w-[11rem] font-body text-xs leading-snug text-navy">
                  {partner.description}
                </span>
              </Interactive>
            </li>
          ))}
        </ul>
      </div>

      {/* The closing statement sits in a drawn outline, as in the design: a
          hairline runs in from the left edge of the page, turns down through
          a 45° chamfer, drops beside the text and meets the rule beneath it.
          That rule is also the boundary with the practices section below,
          which is why this section has no bottom padding. */}
      <div ref={quoteRef} className="shell-about mt-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute top-0 right-[calc(100%-1.375rem)] h-px w-screen bg-navy/10"
          />
          <svg
            viewBox="0 0 27 21"
            fill="none"
            aria-hidden="true"
            className="absolute top-0 left-[1.375rem] h-[1.3125rem] w-[1.6875rem] overflow-visible"
          >
            <path d="M0 0.5 26.5 21" stroke="var(--color-navy)" strokeOpacity="0.1" />
          </svg>
          <span
            aria-hidden="true"
            className="absolute top-[1.3125rem] bottom-0 left-[3.0625rem] w-px bg-navy/10"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-0 -left-1.5 h-px w-[min(calc(100%+0.375rem),67.3rem)] bg-navy/10"
          />
          <p
            data-fx="words"
            className="max-w-[63.5rem] pt-[2.125rem] pb-[0.625rem] pl-[4.375rem] font-display text-[clamp(0.875rem,0.905vw,1rem)] leading-[1.6] text-pretty text-navy"
          >
            {content.quote}
          </p>
        </div>
      </div>
    </section>
  );
}
