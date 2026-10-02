import { useClipReveal, useSectionIntro } from "@/lib/anim";
import { destination, imageOf, TwoToneText } from "@/content/render";
import type { HomePage } from "@/content/types";
import { UnderlineLink } from "./ui";

/**
 * "Luxury is never applied. It is engineered.": the statement on the left,
 * the pavilion photograph on the right, running off the edge of the page,
 * with a thin outline set behind it down and to the left.
 *
 * Measured from the design at 1920 wide, where the section starts under the
 * hero at 1284:
 *   - text from 261, in a 749 column; the photograph from 1063, 871 × 779,
 *     so its last 14 run off the page;
 *   - the photograph 66 below the section's top, the heading 170 below that;
 *   - the outline 22 left of the photograph and 26 below its top, ending 25
 *     short of its right edge and 25 below its foot;
 *   - 18 between heading and paragraphs, 37 above the link, and the next
 *     section starting 50 under the photograph.
 *
 * From `lg` every one of those is a share of the section's own width (`cqw`
 * of the container), not of the text size. They used to be in `rem`: the
 * text column was 46.8rem and the photograph took what was left, so making
 * the text bigger (browser zoom, or a larger default font) squeezed the
 * photograph. Now the photograph keeps its 45% whatever the text does.
 */
export function Philosophy({ content }: { content: HomePage["philosophy"] }) {
  const [lead, ...rest] = content.paragraphs;
  const sectionRef = useSectionIntro<HTMLDivElement>();
  const clipRef = useClipReveal<HTMLDivElement>();

  const PARAGRAPH =
    "max-w-[25rem] font-display text-[0.9375rem] leading-[1.75] text-slate mt-[clamp(1rem,0.94cqw,1.125rem)]";

  return (
    <section
      id="philosophy"
      // Clipped sideways only: the photograph runs past the page's edge, and
      // the connector line that starts under it has to show below.
      className="relative overflow-x-clip bg-white"
    >
      <div className="@container mx-auto max-w-[1920px]">
        <div
          ref={sectionRef}
          className="grid grid-cols-1 gap-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.25rem,3.75vw,4.5rem)] py-[clamp(4.5rem,9vw,6rem)] lg:grid-cols-[39.01cqw_minmax(0,1fr)] lg:items-start lg:gap-x-[2.76cqw] lg:gap-y-0 lg:pt-[3.44cqw] lg:pr-0 lg:pb-[2.6cqw] lg:pl-[13.594cqw]"
        >
          <div className="min-w-0 lg:pt-[8.83cqw] lg:pb-[clamp(2rem,4cqw,4.5rem)]">
            <h2
              data-anim="lines"
              className="font-display text-[clamp(2.125rem,3.333cqw,4rem)] leading-[1.172] font-medium tracking-[-0.007em] text-navy lg:whitespace-nowrap"
            >
              <TwoToneText value={content.heading} />
            </h2>

            <p data-anim data-fx="words" className={PARAGRAPH}>
              {lead}
            </p>
            {rest.map((paragraph, index) => (
              <p key={index} data-anim data-anim-lead data-fx="words" className={PARAGRAPH}>
                {paragraph}
              </p>
            ))}

            <div data-anim className="mt-[clamp(1.75rem,1.9cqw,2.3rem)] flex">
              <UnderlineLink {...destination(content.link.href)}>
                {content.link.label}
              </UnderlineLink>
            </div>
          </div>

          {/* 14 of the design's 871 wider than its column: that much runs
              off the page. `z-[1]` stacks it over the connector line, which
              starts under its foot. */}
          <div data-anim="media" className="relative min-w-0 lg:z-[1] lg:w-[calc(100%+0.73cqw)]">
            {/* The outline behind the photograph (design: Rectangle 29). */}
            <div
              aria-hidden="true"
              className="absolute top-[1.354cqw] right-[1.302cqw] -bottom-[1.302cqw] -left-[1.146cqw] hidden border border-navy lg:block"
            />
            {/* The connector line in the projects section starts at this
                photograph's foot. */}
            <div
              ref={clipRef}
              data-connector-start
              className="relative aspect-[871/779] w-full overflow-hidden"
            >
              <div data-clip-inner className="h-full w-full">
                <img
                  draggable={false}
                  {...imageOf(content.photo.image)}
                  alt={content.photo.alt}
                  sizes="(min-width: 64rem) 45vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
