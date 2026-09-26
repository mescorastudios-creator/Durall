import { useHeroIntro } from "@/lib/anim";
import { destination, imageOf } from "@/content/render";
import type { HomePage } from "@/content/types";
import { CtaButton } from "./ui";

export function Hero({ content }: { content: HomePage["hero"] }) {
  const { sectionRef, headingRef, imageRef } = useHeroIntro<
    HTMLElement,
    HTMLHeadingElement,
    HTMLImageElement
  >();

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy pb-[max(clamp(3rem,7vw,4rem),env(safe-area-inset-bottom))]"
    >
      <img
        ref={imageRef}
        {...imageOf(content.photo.image)}
        alt={content.photo.alt}
        sizes="100vw"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/0 to-navy/70" />

      <div className="shell relative pt-[clamp(8rem,15vw,10rem)] lg:pt-[6rem]">
        <h1
          ref={headingRef}
          data-anim-hide
          className="max-w-[20ch] font-display text-[clamp(2.25rem,6.7vw,8rem)] leading-[0.94] font-medium tracking-hero text-balance text-white"
        >
          {content.heading}
        </h1>

        <div className="mt-[clamp(1.5rem,3vw,2rem)] grid grid-cols-1 items-end gap-[clamp(1.5rem,3vw,2rem)] border-t border-white/15 pt-[clamp(1.5rem,3vw,2rem)] md:grid-cols-[minmax(0,1fr)_auto]">
          <p
            data-hero-fade
            className="min-w-0 max-w-[24.5rem] flex-1 font-body text-[clamp(0.875rem,1.1vw,1rem)] leading-relaxed text-pretty text-white/72"
          >
            {content.body}
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3.5">
            <CtaButton {...destination(content.primary.href)}>{content.primary.label}</CtaButton>
            <CtaButton {...destination(content.secondary.href)} variant="solid">
              {content.secondary.label}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
