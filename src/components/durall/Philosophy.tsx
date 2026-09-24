import { IMAGES } from "@/assets/images";
import { useClipReveal, useParallax, useReveal, useSplitLines } from "@/lib/anim";
import { UnderlineLink } from "./ui";

export function Philosophy() {
  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 28 });
  const frameRef = useReveal<HTMLDivElement>({ y: 48, duration: 1.1 });
  const imageRef = useParallax<HTMLImageElement>(10);
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const clipRef = useClipReveal<HTMLDivElement>();

  return (
    <section id="philosophy" className="relative bg-white py-[clamp(4.5rem,9vw,11.25rem)]">
      <div className="mx-auto grid max-w-[120rem] grid-cols-1 gap-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.25rem,3.75vw,4.5rem)] lg:grid-cols-[minmax(0,46.8125rem)_minmax(0,1fr)] lg:gap-[clamp(1.5rem,2.4vw,2.875rem)] lg:pr-0 lg:pl-[clamp(3rem,13.6vw,16.3125rem)]">
        <div ref={copyRef} className="min-w-0 pt-4">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(2.125rem,3.6vw,4rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy"
          >
            Luxury is never applied. <span className="text-slate">It is engineered.</span>
          </h2>

          <p
            data-reveal
            className="mt-[clamp(2rem,2.7vw,3.25rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate"
          >
            Durall works alongside architects and developers long before a building becomes visible
            — coordinating design intent, engineering tolerance, and material performance into a
            single, precise envelope.
          </p>
          <p
            data-reveal
            className="mt-[clamp(1.25rem,1.4vw,1.625rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate"
          >
            Every threshold a building presents to the world — its windows, its skylights, its
            screens — is a system we design, engineer, fabricate and install as one continuous
            discipline.
          </p>

          <div data-reveal className="mt-[clamp(2.25rem,3.3vw,3.875rem)]">
            <UnderlineLink href="#process">How we work</UnderlineLink>
          </div>
        </div>

        <div ref={frameRef} className="relative min-w-0 lg:-mt-[1.625rem]">
          {/* Thin outlined frame, offset behind the photograph (Figma: Rectangle 29) */}
          <div
            aria-hidden="true"
            className="absolute -top-[1.625rem] -left-[1.375rem] hidden h-full w-full border border-navy lg:block"
          />
          <div ref={clipRef} className="relative aspect-[871/779] w-full overflow-hidden">
            <img
              ref={imageRef}
              {...IMAGES.philosophyPavilion}
              alt="Dining pavilion framed by full-height Durall sliding systems"
              sizes="(min-width: 64rem) 45vw, 100vw"
              loading="lazy"
              decoding="async"
              className="h-[112%] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
