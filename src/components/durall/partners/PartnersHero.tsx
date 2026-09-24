import { IMAGES } from "@/assets/images";
import { useParallax, useReveal, useSplitLines } from "@/lib/anim";

export function PartnersHero() {
  const headingRef = useSplitLines<HTMLHeadingElement>({ start: "top 95%" });
  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-hero-fade]", y: 26, delay: 0.25 });
  const imageRef = useParallax<HTMLImageElement>(8);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy pt-[max(calc(var(--header-h)+1.5rem),clamp(6rem,12vw,9rem))] pb-[clamp(6rem,12vw,9rem)]"
    >
      <img
        ref={imageRef}
        {...IMAGES.heroParikrama}
        alt="Palm-framed Durall residence at dusk"
        sizes="100vw"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-navy/55" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/80 to-navy/20" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[40%] bg-linear-to-b from-navy/60 to-transparent"
      />

      <div
        ref={copyRef}
        className="shell relative grid w-full grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)]"
      >
        <div className="min-w-0">
          <h1
            ref={headingRef}
            className="max-w-[14ch] font-display text-[clamp(2.25rem,5vw,5rem)] leading-[1.02] font-medium tracking-hero text-white"
          >
            International expertise. Integrated locally.
          </h1>
          <p
            data-hero-fade
            className="mt-[clamp(1.5rem,2.6vw,2rem)] max-w-[30rem] font-body text-[clamp(0.875rem,1.05vw,0.9375rem)] leading-relaxed text-white/72"
          >
            Durall Systems works with trusted international partners to bring world-class systems
            and specialist technologies to architectural projects in India. Our partnerships are
            built around precision, capability and the demands of each project.
          </p>
          <p
            data-hero-fade
            className="mt-[clamp(1.5rem,2.6vw,2rem)] font-display text-[0.625rem] font-bold tracking-eyebrow text-white/45 uppercase"
          >
            D/S — Architectural Datum / 01
          </p>
        </div>

        <div data-hero-fade className="relative min-w-0">
          <div className="relative grid grid-cols-2 overflow-hidden rounded-3xl shadow-2xl shadow-navy/40">
            <img
              {...IMAGES.aboutPlateLeft}
              alt="Facade detail of a Durall-glazed residence"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <img
              {...IMAGES.aboutPlateRight}
              alt="Aerial view of the same residence within its palm canopy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <p className="absolute bottom-[6%] left-[4%] flex items-center gap-2 rounded-md bg-navy/75 px-3 py-2 font-display text-[0.625rem] font-bold tracking-eyebrow text-white uppercase backdrop-blur-sm">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3 w-3">
                <path
                  d="M8 2 14.5 5.4 8 8.8 1.5 5.4 8 2Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path d="M1.5 9.2 8 12.6l6.5-3.4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              System Detail / 01
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
