import { IMAGES } from "@/assets/images";
import { useClipReveal, useParallax, useReveal, useSplitLines } from "@/lib/anim";

export function MeetsEngineering() {
  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 28 });
  const frameRef = useReveal<HTMLDivElement>({ y: 48, duration: 1.1 });
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const clipRef = useClipReveal<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(8);

  return (
    <section className="bg-white py-[clamp(4rem,8vw,9rem)]">
      <div className="shell grid grid-cols-1 items-center gap-[clamp(2.5rem,4vw,3rem)] xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
        <div ref={copyRef} className="min-w-0">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.11] font-medium tracking-tight text-balance text-navy"
          >
            Where architecture meets engineering.
          </h2>
          <span
            aria-hidden="true"
            data-reveal
            className="mt-[clamp(1.5rem,2.4vw,2rem)] flex items-center"
          >
            <span className="block h-px w-[7.5rem] bg-accent-blue" />
            <span className="block h-1.5 w-1.5 bg-accent-blue" />
          </span>
          <p
            data-reveal
            className="mt-[clamp(1.5rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.875rem)] leading-relaxed text-slate"
          >
            Durall operates at the intersection of architectural intent and technical execution.
          </p>
          <p
            data-reveal
            className="mt-5 max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.875rem)] leading-[1.57] text-slate"
          >
            We coordinate systems, materials and specialist partners to deliver solutions that
            perform as designed — beautifully, efficiently and for the long term.
          </p>
        </div>

        <div ref={frameRef} className="min-w-0">
          <div
            ref={clipRef}
            className="relative aspect-[820/480] w-full overflow-hidden rounded-3xl"
          >
            <img
              ref={imageRef}
              {...IMAGES.aboutLake}
              alt="An infinity terrace framed by Durall sliding systems above the water"
              sizes="(min-width: 80rem) 58vw, 100vw"
              loading="lazy"
              decoding="async"
              className="h-[110%] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
