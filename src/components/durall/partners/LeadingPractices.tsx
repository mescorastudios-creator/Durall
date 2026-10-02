import { REVEAL_WINDOW, useReveal, useSplitLines } from "@/lib/anim";
import { imageOf } from "@/content/render";
import type { PartnerDoc, PartnersPage } from "@/content/types";
import { Interactive } from "../ui";
import { PracticeLogo } from "./marks";

export function LeadingPractices({
  content,
  practices,
}: {
  content: PartnersPage["practices"];
  practices: readonly PartnerDoc[];
}) {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const introRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 16 });
  const imageRef = useReveal<HTMLDivElement>({ y: 32, start: REVEAL_WINDOW.start });
  const gridRef = useReveal<HTMLUListElement>({ selector: "[data-cell]", y: 32, stagger: 0.08 });
  const closingRef = useReveal<HTMLDivElement>({ y: 16 });

  return (
    <section
      id="practices"
      className="relative overflow-hidden bg-white pb-[clamp(3.5rem,8vw,7.5rem)]"
    >
      {/* The intro, with the house drawn large to its right. From lg up the
          picture is taken out of flow: it hangs from just under the outline
          that closes the section above, runs off the right edge of the page,
          and fades into the white at its foot, as in the design. The row is
          given the picture's height (69vw at 1365 × 648, less the faded
          foot) so the logos below start where it has faded out. */}
      <div className="relative lg:min-h-[31vw]">
        <div
          ref={introRef}
          className="shell-about relative z-[1] min-w-0 pt-[clamp(3rem,6.4vw,6.5rem)]"
        >
          <p
            data-reveal
            className="flex items-center gap-2.5 font-display text-[0.625rem] font-bold tracking-eyebrow text-accent-blue uppercase"
          >
            {content.eyebrow}
            <span aria-hidden="true" className="h-0 w-6 border-t border-accent-blue/60" />
          </p>
          {/* 1.105, not the design's 1.2: split into lines for the reveal, each
              line carries 0.1em of padding whose negative margins only
              partly collapse, which puts that back between the lines. */}
          <h2
            ref={headingRef}
            className="mt-[clamp(1rem,1.7vw,1.75rem)] max-w-[14ch] font-display text-[clamp(1.75rem,2.59vw,2.75rem)] leading-[1.105] font-normal tracking-section text-balance text-navy"
          >
            {content.heading}
          </h2>
          <span
            aria-hidden="true"
            className="mt-[clamp(0.5rem,1vw,1rem)] block h-0 w-[2.3rem] border-t-2 border-accent-blue"
          />
          <p
            data-reveal
            className="mt-[clamp(1rem,1.6vw,1.625rem)] max-w-[28rem] font-display text-[clamp(0.75rem,0.754vw,0.875rem)] leading-[1.56] text-slate"
          >
            {content.lead}
          </p>
          <p
            data-reveal
            className="mt-[clamp(0.625rem,0.82vw,0.875rem)] max-w-[28rem] font-display text-[clamp(0.6875rem,0.645vw,0.75rem)] leading-[1.56] text-slate/80"
          >
            {content.note}
          </p>
        </div>

        <div
          ref={imageRef}
          className="relative mt-[clamp(2rem,4vw,3rem)] min-w-0 lg:absolute lg:top-[1.3rem] lg:right-0 lg:mt-0 lg:w-[69vw]"
        >
          <img
            draggable={false}
            {...imageOf(content.photo.image)}
            alt={content.photo.alt}
            sizes="(min-width: 64rem) 69vw, 100vw"
            loading="lazy"
            decoding="async"
            className="w-full object-contain [mask-image:linear-gradient(to_bottom,black_60%,transparent_92%)]"
          />
        </div>
      </div>

      <ul
        ref={gridRef}
        className="shell-about relative mt-[clamp(2.5rem,5vw,4.5rem)] grid grid-cols-1 gap-y-[clamp(2rem,4vw,3rem)] sm:grid-cols-2 lg:grid-cols-4"
      >
        {practices.map((practice) => (
          <li key={practice.id} data-cell className="min-w-0">
            <Interactive
              lift={-4}
              scale={1.01}
              className="flex min-w-0 flex-col items-center px-[clamp(0.75rem,1.5vw,2rem)] text-center"
            >
              <span className="flex min-h-[clamp(2.5rem,3.5vw,3rem)] items-center justify-center">
                <PracticeLogo mark={practice.mark} name={practice.name} logo={practice.logo} />
              </span>
              <span className="mt-[clamp(0.875rem,1.8vw,1.5rem)] font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase">
                {practice.country}
              </span>
              <span className="mt-[clamp(0.875rem,1.8vw,1.5rem)] max-w-[11rem] font-body text-xs leading-snug text-navy">
                {practice.description}
              </span>
            </Interactive>
          </li>
        ))}
      </ul>

      <div ref={closingRef} className="shell-about mt-[clamp(2.5rem,5vw,4.5rem)] text-center">
        <p className="font-display text-[clamp(0.5625rem,0.75vw,0.6875rem)] font-bold tracking-eyebrow text-navy uppercase">
          {content.tagline}
        </p>
        <span
          aria-hidden="true"
          className="mx-auto mt-2 block h-0 w-[clamp(1.5rem,2.5vw,2rem)] border-t-2 border-accent-blue"
        />
      </div>
    </section>
  );
}
