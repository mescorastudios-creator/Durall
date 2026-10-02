import type { ReactNode } from "react";
import { useHeroIntro } from "@/lib/anim";
import { imageOf, Lines } from "@/content/render";
import type { PhotoHero as Content } from "@/content/types";

/**
 * The full-width photographic opening of About, Partners, Projects,
 * Expertise and Careers: the photograph, the heading and a short
 * introduction set low on the left, under the clear header.
 *
 * Measured from the designs at 1920 × 964, where the heading is Space
 * Grotesk Medium at 120px and the text starts 152px in, level with the
 * logo. The photograph carries the designs' own washes: a navy-to-blue tint
 * top to bottom, a darkening along the foot for the text, and per page a
 * shade from the left or into the lower corners.
 */
export type Wash = {
  /** The two soft darkenings into the lower corners (Partners, Projects, Expertise). */
  corners?: boolean;
  /** Strength of the navy shade from the left edge, 0–1. */
  left?: number;
  /** A shade across the top, behind the header (Projects). */
  top?: boolean;
};

export function PhotoHero({
  content,
  wash = {},
  compact = false,
  focus,
  children,
}: {
  content: Content;
  wash?: Wash;
  /** The shorter opening (Careers): 680px tall at 1920 rather than 964px. */
  compact?: boolean;
  /** Which part of the photograph to keep in view, as a CSS object-position. */
  focus?: string;
  /** Anything set along the foot of the photograph (see HeroRibbon). */
  children?: ReactNode;
}) {
  const { sectionRef, headingRef, imageRef } = useHeroIntro<
    HTMLElement,
    HTMLHeadingElement,
    HTMLImageElement
  >();
  const { corners = false, left = 0, top = false } = wash;

  return (
    <section
      ref={sectionRef}
      id="top"
      data-hero-pin
      className={`relative flex items-end overflow-hidden bg-navy pt-[calc(var(--header-h)+2rem)] ${
        compact ? "min-h-[max(32rem,35.42vw)]" : "min-h-[max(36rem,min(100svh,50.2vw))]"
      }`}
    >
      <div data-hero-media className="absolute inset-0">
        <img
          draggable={false}
          ref={imageRef}
          {...imageOf(content.photo.image)}
          alt={content.photo.alt}
          sizes="100vw"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
          style={focus ? { objectPosition: focus } : undefined}
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_8_52/0.11),rgb(15_24_154/0.31)_87%)]" />
        {corners ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(208deg,transparent_69%,rgb(1_3_22/0.59))]" />
            <div className="absolute inset-0 bg-[linear-gradient(152deg,transparent_49%,rgb(5_8_52/0.57))]" />
          </>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-[43.6%] bg-linear-to-b from-transparent to-navy/72" />
        {left > 0 ? (
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_8_52/0.62),rgb(5_8_52/0.18)_55%,transparent_80%)]"
            style={{ opacity: left }}
          />
        ) : null}
        {top ? (
          <div className="absolute inset-x-0 top-0 h-[22.8%] bg-linear-to-b from-navy/60 to-transparent" />
        ) : null}
        {/* On a phone the text covers most of the photograph; this keeps it
            legible whatever part of the picture lands behind it. */}
        <div className="absolute inset-0 bg-navy/25 sm:hidden" />
        {/* Deepens as the page slides over the opening (lib/anim heroCover). */}
        <div data-hero-dim className="absolute inset-0 bg-navy opacity-0" />
      </div>

      <div className="relative mx-auto w-full max-w-[120rem] pr-[clamp(1.25rem,4.53vw,5.45rem)] pl-[clamp(1.25rem,7.92vw,9.5rem)]">
        <div className={children ? "" : "pb-[clamp(3rem,8.75vw,10.5rem)]"}>
          <h1
            ref={headingRef}
            data-anim-hide
            className="font-display text-[clamp(2.75rem,6.25vw,7.5rem)] leading-[0.98] font-medium tracking-[-0.02em] text-balance text-white"
          >
            <Lines text={content.heading} />
          </h1>
          <p
            data-hero-fade
            className="mt-[clamp(1.25rem,2.1vw,2.5rem)] max-w-[33em] font-display text-[clamp(1rem,1.04vw,1.25rem)] leading-[1.6] text-pretty text-white/88"
          >
            {content.body}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
