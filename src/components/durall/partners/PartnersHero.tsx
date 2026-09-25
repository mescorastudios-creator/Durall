import { IMAGES } from "@/assets/images";
import { useHeroIntro } from "@/lib/anim";

export function PartnersHero() {
  /* The same full-screen hero as the home and About pages, on the same
   * entrance: `useHeroIntro` owns the masked heading, the `[data-hero-fade]`
   * blocks behind it, the backdrop's settle and parallax, and the copy's
   * dissolve on the way out. It replaced a shorter section driven by
   * `useSectionIntro` plus a separate `useParallax`, which arrived on a
   * different curve from the heroes it sits beside in the navigation. */
  const { sectionRef, headingRef, imageRef } = useHeroIntro<
    HTMLElement,
    HTMLHeadingElement,
    HTMLImageElement
  >();

  return (
    <section
      ref={sectionRef}
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
      {/* A light wash, as in the design: the palms and the sky read through
       * it, and the copy on the left keeps its contrast. */}
      <div aria-hidden="true" className="absolute inset-0 bg-navy/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-navy/55 via-navy/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[40%] bg-linear-to-b from-navy/60 to-transparent"
      />

      <div className="shell relative grid w-full grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)]">
        <div className="min-w-0">
          <p
            data-hero-fade
            className="font-display text-[0.6875rem] font-bold tracking-eyebrow text-white/70 uppercase"
          >
            01 — Partners
          </p>
          <h1
            ref={headingRef}
            data-anim-hide
            className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[14ch] font-display text-[clamp(2.5rem,5.2vw,5.5rem)] leading-[1.02] font-medium tracking-hero text-balance text-white"
          >
            International expertise. Integrated locally.
          </h1>
          <p
            data-hero-fade
            className="mt-[clamp(1.5rem,2.6vw,2rem)] max-w-[30rem] font-body text-[clamp(0.875rem,1.05vw,0.9375rem)] leading-relaxed text-pretty text-white/85"
          >
            Durall Systems works with trusted international partners to bring world-class systems
            and specialist technologies to architectural projects in India. Our partnerships are
            built around precision, capability and the demands of each project.
          </p>
          <p
            data-hero-fade
            className="mt-[clamp(1.75rem,3vw,2.25rem)] font-display text-[0.625rem] font-bold tracking-eyebrow text-white/45 uppercase"
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
