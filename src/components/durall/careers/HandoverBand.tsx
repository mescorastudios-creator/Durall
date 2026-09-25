import { IMAGES } from "@/assets/images";
import { useParallax, useSplitLines } from "@/lib/anim";

/**
 * One sentence over a photograph, full bleed. It is the page's pause
 * between the hero and what it is like to work here, and the one place
 * the careers page picks up the navy of the rest of the site.
 */
export function HandoverBand() {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const imageRef = useParallax<HTMLImageElement>(10);

  return (
    <section className="relative flex min-h-[clamp(26rem,44vw,44rem)] items-end overflow-hidden bg-navy py-[clamp(3.5rem,7vw,6.5rem)]">
      {/* Decorative: the sentence carries the section. */}
      <img
        ref={imageRef}
        {...IMAGES.projectBangalore}
        alt=""
        sizes="100vw"
        loading="lazy"
        decoding="async"
        className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-navy/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/35 to-transparent"
      />

      <div className="shell-about relative w-full">
        <h2
          ref={headingRef}
          className="max-w-[19ch] font-display text-[clamp(2rem,4vw,4.25rem)] leading-[1.08] font-medium tracking-section text-balance text-white"
        >
          The person who drew the detail stands in front of it at handover.
        </h2>
      </div>
    </section>
  );
}
