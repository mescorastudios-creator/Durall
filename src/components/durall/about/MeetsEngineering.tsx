import { useClipReveal, useParallax, useReveal, useSplitLines } from "@/lib/anim";
import { imageOf } from "@/content/render";
import type { AboutPage } from "@/content/types";

export function MeetsEngineering({ content }: { content: AboutPage["meets"] }) {
  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 32 });
  const frameRef = useReveal<HTMLDivElement>({ y: 56, duration: 0.9 });
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const clipRef = useClipReveal<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(8);

  return (
    <section className="bg-white pt-[clamp(4rem,8vw,9rem)] pb-[clamp(3rem,6vw,5.5rem)]">
      <div className="shell-about grid grid-cols-1 items-center gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,0.63fr)_minmax(0,1fr)]">
        <div ref={copyRef} className="min-w-0">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(2rem,3vw,3.5rem)] leading-[1.11] font-medium tracking-tight text-balance text-navy"
          >
            {content.heading}
          </h2>
          <span
            aria-hidden="true"
            data-reveal
            className="mt-[clamp(1.5rem,2.4vw,2rem)] flex items-center"
          >
            <span className="block h-px w-[7.5rem] bg-accent-blue" />
            <span className="block h-1.5 w-1.5 bg-accent-blue" />
          </span>
          {content.paragraphs.map((paragraph, index) =>
            index === 0 ? (
              <p
                key={index}
                data-reveal
                className="mt-[clamp(1.5rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.875rem)] leading-relaxed text-slate"
              >
                {paragraph}
              </p>
            ) : (
              <p
                key={index}
                data-reveal
                className="mt-5 max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.875rem)] leading-[1.57] text-slate"
              >
                {paragraph}
              </p>
            ),
          )}
        </div>

        <div ref={frameRef} className="min-w-0">
          <div ref={clipRef} className="relative aspect-[820/480] w-full overflow-hidden">
            <div data-clip-inner className="h-full w-full">
              <img
                ref={imageRef}
                {...imageOf(content.photo.image)}
                alt={content.photo.alt}
                sizes="(min-width: 64rem) 45vw, 100vw"
                loading="lazy"
                decoding="async"
                className="h-[110%] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
