import { useClipReveal, useParallax, useSectionIntro } from "@/lib/anim";
import { destination, imageOf } from "@/content/render";
import type { CareersPage } from "@/content/types";
import { CtaButton } from "../ui";

/* From lg up the photograph runs to the edge of the page: the negative
 * margin is shell-about's own gutter, copied from its @utility. */
const BLEED = "lg:-mr-[clamp(1.25rem,max(3.75vw,26.6vw-11.95rem),17.9375rem)]";

export function CareersHero({ content }: { content: CareersPage["hero"] }) {
  const introRef = useSectionIntro<HTMLDivElement>();
  const clipRef = useClipReveal<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(6);

  return (
    <section
      id="top"
      className="relative overflow-x-clip bg-white pt-[max(calc(var(--header-h)+2rem),clamp(6rem,9vw,9.5rem))] pb-[clamp(4.5rem,8vw,8rem)]"
    >
      <div
        ref={introRef}
        className="shell-about grid grid-cols-1 items-center gap-[clamp(2.75rem,5vw,5rem)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <div className="min-w-0">
          <h1
            data-anim="lines"
            className="max-w-[11ch] font-display text-[clamp(2.5rem,4.4vw,4.75rem)] leading-[1.04] font-medium tracking-hero text-balance text-navy"
          >
            {content.heading}
          </h1>
          <p
            data-anim
            className="mt-[clamp(1.5rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.9375rem,1.15vw,1.0625rem)] leading-relaxed text-pretty text-slate"
          >
            {content.body}
          </p>
          <div data-anim className="mt-[clamp(1.75rem,3vw,2.5rem)]">
            <CtaButton {...destination(content.cta.href)} variant="solid">
              {content.cta.label}
            </CtaButton>
          </div>
        </div>

        <div data-anim="media" className={`relative min-w-0 ${BLEED}`}>
          {/* The hairline frame the home page puts behind its Philosophy
              photograph, at the same offsets: down and to the left, with no
              right-hand side because the photograph runs off the page. */}
          <div
            aria-hidden="true"
            className="absolute top-[1.625rem] right-0 -left-[1.375rem] hidden h-full border-y border-l border-navy lg:block"
          />
          <div
            ref={clipRef}
            className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[6/5]"
          >
            <div data-clip-inner className="absolute inset-0">
              {/* Taller than its frame and lifted by half the overscan, so
                  the parallax drift never uncovers an edge. */}
              <img
                ref={imageRef}
                {...imageOf(content.photo.image)}
                alt={content.photo.alt}
                sizes="(min-width: 64rem) 55vw, 100vw"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover object-[70%_50%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
