import { useEffect, useRef } from "react";
import { loadGsap, markAnimReady, useSectionIntro } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";
import { imageOf, Lines } from "@/content/render";
import type { ExpertisePage } from "@/content/types";
import { PAPER, SHELL } from "./styles";

const FOOT =
  "font-display text-[0.6875rem] leading-none font-medium tracking-[0.18em] text-slate uppercase";

/**
 * "Concept to commissioning, under one roof.": the stages side by side, each
 * a number on a rule, a name, a line, a sentence and a tall picture.
 *
 * At 1920 the five columns are 249px wide on a 289px pitch, with a hairline
 * in each gap. The rows are shared between the columns (subgrid), so the
 * pictures line up however the text above them wraps. Where five no longer
 * fit, the same columns scroll sideways instead of stacking into a very
 * long page.
 *
 * The row is one journey from 01 to 05, and the scroll is what makes it:
 * while the numbers cross the middle of the window a line runs along the
 * rule from each number to the next, and as it reaches a stage that stage's
 * number appears and its words rise in. Scrolling back runs it backwards.
 * The pictures are uncovered left to right in the same way as they come up
 * into the window beneath.
 */
export function HowWeWork({ content }: { content: ExpertisePage["process"] }) {
  const introRef = useSectionIntro<HTMLDivElement>();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const stages = Array.from(list.querySelectorAll<HTMLElement>("[data-stage]"));
      const within = (stage: HTMLElement, selector: string) =>
        Array.from(stage.querySelectorAll<HTMLElement>(selector));
      const pictures = stages.flatMap((stage) => within(stage, "[data-clip-inner]"));

      // One unit of the timeline per stage; the scroll below is its clock.
      const journey = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: list,
          // From the numbers entering the lower part of the window to their
          // reaching its upper part: they are on screen for all of it.
          start: "clamp(top 80%)",
          end: "clamp(top 22%)",
          scrub: 0.6,
        },
      });
      stages.forEach((stage, index) => {
        journey
          .fromTo(
            within(stage, "[data-stage-number]"),
            // From nothing, not from a faint number: a faint one fails
            // contrast for as long as it waits.
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "none" },
            index,
          )
          .fromTo(
            within(stage, "[data-stage-line]"),
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: "none" },
            index,
          )
          .fromTo(
            within(stage, "[data-stage-copy]"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
            index + 0.05,
          );
      });

      const uncover = gsap.fromTo(
        pictures,
        { yPercent: 12, scale: 1.12, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          stagger: 0.35,
          scrollTrigger: {
            trigger: pictures[0]?.parentElement ?? list,
            start: "clamp(top 95%)",
            end: "clamp(top 45%)",
            scrub: 0.6,
          },
        },
      );
      markAnimReady();

      dispose = () => {
        journey.scrollTrigger?.kill();
        journey.kill();
        uncover.scrollTrigger?.kill();
        uncover.kill();
      };
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);
  const count = content.stages.length;

  return (
    <section
      id="process"
      className={`${PAPER} scroll-mt-24 pt-[clamp(3.5rem,5.6vw,6.7rem)] pb-[clamp(2.5rem,3.02vw,3.625rem)]`}
    >
      <div className={SHELL}>
        <div ref={introRef}>
          <h2
            data-anim="lines"
            className="font-display text-[clamp(2.5rem,3.75vw,4.5rem)] leading-[1.056] font-medium tracking-[-0.025em] text-balance text-navy"
          >
            <Lines text={content.heading} />
          </h2>
          <p
            data-anim
            className="mt-[clamp(0.5rem,0.57vw,0.6875rem)] max-w-[20.7rem] font-display text-[clamp(1rem,0.94vw,1.125rem)] leading-[1.56] text-pretty text-slate"
          >
            {content.lede}
          </p>
        </div>

        <div>
          <ol
            ref={listRef}
            // Scrolls sideways below `lg`, so it has to be reachable by keyboard.
            tabIndex={0}
            aria-label="How we work, stage by stage"
            className="-mx-[clamp(1.25rem,3.75vw,3rem)] mt-[clamp(2rem,2.24vw,2.6875rem)] grid snap-x snap-mandatory scroll-px-[clamp(1.25rem,3.75vw,3rem)] auto-cols-[min(72vw,16.5rem)] grid-flow-col grid-rows-[repeat(5,auto)] gap-x-10 overflow-x-auto overscroll-x-contain px-[clamp(1.25rem,3.75vw,3rem)] pb-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue lg:mx-0 lg:grid-flow-row lg:grid-cols-[repeat(var(--stages),minmax(0,1fr))] lg:overflow-visible lg:px-0 lg:pb-0"
            style={{ "--stages": count } as React.CSSProperties}
          >
            {content.stages.map((stage, index) => {
              const last = index === count - 1;
              return (
                <li
                  key={stage.title}
                  data-stage
                  className="relative row-span-5 grid min-w-0 snap-start grid-rows-subgrid"
                >
                  <div className="flex items-end gap-[1.25rem]">
                    <span
                      data-stage-number
                      className="font-display text-[1.875rem] leading-none font-light tracking-[-0.017em] text-navy tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative mb-[0.5625rem] h-px flex-1 bg-navy/18 ${last ? "" : "-mr-10"}`}
                    >
                      {/* The travelling line: it runs this rule on its way
                          to the next number, drawn by the scroll. Without
                          motion it is not there and the hairline stands. */}
                      <span
                        data-stage-line
                        className="absolute inset-x-0 -inset-y-px origin-left scale-x-0 bg-navy"
                      />
                    </span>
                  </div>
                  {/* The hairline in the gap before this column, from its name
                    to the foot of its picture. */}
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-[4.3125rem] bottom-0 -left-5 w-px bg-navy/8"
                    />
                  ) : null}
                  <h3
                    data-stage-copy
                    className="mt-[2.4375rem] font-display text-sm leading-[1.3] font-medium tracking-[0.2em] text-navy uppercase"
                  >
                    {stage.title}
                  </h3>
                  <p
                    data-stage-copy
                    className="mt-3 font-display text-[1.1875rem] leading-[1.37] text-navy"
                  >
                    {stage.summary}
                  </p>
                  <p
                    data-stage-copy
                    className="mt-4 max-w-[15rem] font-display text-[0.9375rem] leading-[1.53] text-slate"
                  >
                    {stage.body}
                  </p>
                  <div className="mt-[clamp(2rem,2.4vw,2.875rem)] aspect-[249/380] overflow-hidden bg-[#f4f4f1]">
                    <div data-clip-inner className="h-full w-full">
                      <img
                        draggable={false}
                        {...imageOf(stage.photo.image)}
                        alt={stage.photo.alt}
                        sizes="(min-width: 1024px) 14vw, 264px"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-[clamp(1.5rem,2.25vw,2.7rem)] flex flex-wrap items-center gap-x-7 gap-y-2">
          <p className={FOOT}>{content.footLeft}</p>
          <span
            aria-hidden="true"
            data-fx="rule"
            className="hidden h-px flex-1 bg-navy/18 sm:block"
          />
          <p className={FOOT}>{content.footRight}</p>
        </div>
      </div>
    </section>
  );
}
