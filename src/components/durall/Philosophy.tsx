import { useClipReveal, useParallax, useSectionIntro } from "@/lib/anim";
import { destination, imageOf, TwoToneText } from "@/content/render";
import type { HomePage } from "@/content/types";
import { UnderlineLink } from "./ui";

export function Philosophy({ content }: { content: HomePage["philosophy"] }) {
  const [lead, ...rest] = content.paragraphs;
  /* One timeline for the whole section. This used to be five independent
   * hooks — copy, frame, parallax, heading, clip — firing at two different
   * scroll positions on two different curves, which is why the heading and
   * the paragraph beneath it never looked like one thing arriving. */
  const sectionRef = useSectionIntro<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(10);
  const clipRef = useClipReveal<HTMLDivElement>();

  return (
    <section id="philosophy" className="relative bg-white py-[clamp(4.5rem,9vw,11.25rem)]">
      <div
        ref={sectionRef}
        className="mx-auto grid max-w-[120rem] grid-cols-1 gap-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.25rem,3.75vw,4.5rem)] lg:grid-cols-[minmax(0,46.8125rem)_minmax(0,1fr)] lg:gap-[clamp(1.5rem,2.4vw,2.875rem)] lg:pr-0 lg:pl-[clamp(3rem,13.6vw,16.3125rem)]"
      >
        <div className="min-w-0 pt-4">
          <h2
            data-anim="lines"
            className="font-display text-[clamp(2.125rem,3.6vw,4rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy"
          >
            <TwoToneText value={content.heading} />
          </h2>

          <p
            data-anim
            className="mt-[clamp(2rem,2.7vw,3.25rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate"
          >
            {lead}
          </p>
          {rest.map((paragraph, index) => (
            <p
              key={index}
              data-anim
              data-anim-lead
              className="mt-[clamp(1.25rem,1.4vw,1.625rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate"
            >
              {paragraph}
            </p>
          ))}

          <div data-anim className="mt-[clamp(2.25rem,3.3vw,3.875rem)]">
            <UnderlineLink {...destination(content.link.href)}>{content.link.label}</UnderlineLink>
          </div>
        </div>

        {/* `self-start`: the wrapper is the photograph's height rather than
         * the row's, so the frame below matches the photograph instead of
         * hanging past it wherever the copy column is the taller. `z-[1]`
         * stacks it over the connector line, which starts under its foot. */}
        <div
          data-anim="media"
          className="relative min-w-0 lg:z-[1] lg:-mt-[1.625rem] lg:self-start"
        >
          {/* Thin outlined frame behind the photograph (Figma: Rectangle 29),
           * offset down and to the left. It runs off the page with the
           * photograph, so it has no right-hand side. */}
          <div
            aria-hidden="true"
            className="absolute top-[1.625rem] right-0 -left-[1.375rem] hidden h-full border-y border-l border-navy lg:block"
          />
          {/* The connector line in the projects section starts at this
           * photograph's foot. */}
          <div
            ref={clipRef}
            data-connector-start
            className="relative aspect-[871/779] w-full overflow-hidden"
          >
            {/* The uncover moves this wrapper, not the photograph — the
                photograph is already carrying the parallax drift. */}
            <div data-clip-inner className="h-full w-full">
              <img
                ref={imageRef}
                {...imageOf(content.photo.image)}
                alt={content.photo.alt}
                sizes="(min-width: 64rem) 45vw, 100vw"
                loading="lazy"
                decoding="async"
                className="h-[112%] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
