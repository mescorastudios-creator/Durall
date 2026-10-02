import { useClipReveal, useParallax, useReveal, useSplitLines } from "@/lib/anim";
import { iconOf } from "@/content/icons";
import { destination, imageOf } from "@/content/render";
import type { AboutPage } from "@/content/types";
import { UnderlineLink } from "../ui";

export function AboutPhilosophy({ content }: { content: AboutPage["philosophy"] }) {
  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 32 });
  const listRef = useReveal<HTMLUListElement>({ selector: "li", y: 16 });
  const frameRef = useReveal<HTMLDivElement>({ y: 56, duration: 0.9 });
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const clipRef = useClipReveal<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(8);

  return (
    <section id="philosophy" className="bg-white pt-[clamp(4rem,8vw,9rem)]">
      <div className="shell-about grid grid-cols-1 gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,1.05fr)_1px_minmax(0,0.5fr)_minmax(0,1.05fr)] lg:gap-[clamp(1.5rem,2.4vw,2.25rem)]">
        <div ref={copyRef} className="min-w-0">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(2rem,2.7vw,3rem)] leading-[1.1] font-medium tracking-tight text-pretty text-navy"
          >
            {content.heading}
          </h2>
          <p
            data-reveal
            data-fx="words"
            className="mt-[clamp(1.5rem,2.4vw,2rem)] max-w-[30rem] font-body text-[clamp(0.8125rem,0.95vw,0.875rem)] leading-[1.75] text-slate"
          >
            {content.body}
          </p>
          <p
            data-reveal
            className="mt-5 max-w-[30rem] font-body text-[clamp(0.8125rem,0.95vw,0.875rem)] leading-[1.75] font-bold text-navy"
          >
            {content.emphasis}
          </p>
          <div data-reveal className="mt-[clamp(2rem,3vw,2.5rem)]">
            <UnderlineLink {...destination(content.link.href)}>{content.link.label}</UnderlineLink>
          </div>
        </div>

        <div aria-hidden="true" className="hidden w-px bg-navy-14 lg:block" />

        <ul ref={listRef} className="min-w-0 space-y-[clamp(1.75rem,2.6vw,2.25rem)] lg:pt-2">
          {content.features.map(({ icon, title, body }) => {
            const Icon = iconOf(icon);
            return (
              <li key={title} className="flex min-w-0 items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-navy-14 bg-paper">
                  <Icon aria-hidden="true" className="h-3.5 w-3.5 text-navy" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[0.6875rem] font-bold tracking-eyebrow text-navy uppercase">
                    {title}
                  </span>
                  <span className="mt-1 block font-body text-[0.75rem] leading-snug text-slate">
                    {body}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div ref={frameRef} className="min-w-0">
          <div ref={clipRef} className="relative aspect-[1023/840] w-full overflow-hidden">
            <div data-clip-inner className="h-full w-full">
              <img
                draggable={false}
                ref={imageRef}
                {...imageOf(content.photo.image)}
                alt={content.photo.alt}
                sizes="(min-width: 64rem) 34vw, 100vw"
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
