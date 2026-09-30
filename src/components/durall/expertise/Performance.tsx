import { useReveal, useSectionIntro } from "@/lib/anim";
import { linkTo, Lines } from "@/content/render";
import type { ExpertisePage } from "@/content/types";
import { EYEBROW, HEADING, LEDE, PAPER, SECTION_Y, SHELL } from "./styles";

/** "Numbers we put our name to.": five tested figures, each with its rating
 * drawn as filled bars between "Base" and "Highest". */
export function Performance({ content }: { content: ExpertisePage["performance"] }) {
  const introRef = useSectionIntro<HTMLDivElement>();
  const gridRef = useReveal<HTMLUListElement>({ selector: "[data-metric]", y: 24, stagger: 0.08 });
  const download = content.download.href ? linkTo(content.download.href) : null;

  return (
    <section id="performance" className={`${PAPER} ${SECTION_Y}`}>
      <div className={SHELL}>
        <div
          ref={introRef}
          className="grid grid-cols-1 gap-x-12 gap-y-6 lg:items-center lg:[grid-template-columns:minmax(0,842fr)_minmax(0,521fr)]"
        >
          <div className="min-w-0">
            <p data-anim className={`${EYEBROW} text-navy`}>
              {content.eyebrow}
            </p>
            <h2 data-anim="lines" className={`mt-[clamp(1rem,1.25vw,1.5rem)] ${HEADING} text-navy`}>
              <Lines text={content.heading} />
            </h2>
          </div>
          <p
            data-anim
            className={`max-w-[32.5rem] ${LEDE} text-slate lg:mt-[clamp(1.5rem,2.8vw,3.4rem)]`}
          >
            {content.body}
          </p>
        </div>

        <ul
          ref={gridRef}
          className="mt-[clamp(3rem,6.4vw,7.6rem)] grid grid-cols-1 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {content.metrics.map((metric) => (
            <li
              key={metric.label}
              data-metric
              className="min-w-0 border-l border-navy/11 pr-4 pb-[clamp(1.5rem,3.7vw,4.4rem)] pl-[clamp(1rem,1.46vw,1.75rem)]"
            >
              <p className="pt-1.5 font-display text-xs leading-snug font-medium tracking-[0.15em] text-slate uppercase">
                {metric.label}
              </p>
              <p className="mt-[clamp(1.5rem,2.6vw,3.1rem)] font-display text-[clamp(2.25rem,3.33vw,4rem)] leading-none font-light tracking-[-0.03em] whitespace-nowrap text-navy">
                {metric.value}
                {metric.unit ? (
                  <span className="ml-1 text-[0.375em] tracking-normal">{metric.unit}</span>
                ) : null}
              </p>
              {/* The rating, drawn as the design draws it; the text beside it
                  says the same for anyone not seeing the bars. */}
              <div className="mt-[clamp(1.75rem,2.8vw,3.3rem)] max-w-[13.75rem]">
                <span aria-hidden="true" className="flex gap-1.5">
                  {Array.from({ length: Math.max(1, metric.of) }, (_, i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 ${i < metric.rating ? "bg-navy" : "bg-navy/12"}`}
                    />
                  ))}
                </span>
                <span className="sr-only">
                  {metric.rating} of {metric.of}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-3 flex justify-between font-display text-[0.6875rem] tracking-[0.09em] text-slate/60 uppercase"
                >
                  <span>{content.low}</span>
                  <span>{content.high}</span>
                </span>
              </div>
              <p className="mt-[clamp(1.5rem,2.6vw,3rem)] font-display text-[0.8125rem] text-slate">
                {metric.standard}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(2rem,3.1vw,3.75rem)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {content.note ? (
            <p className="font-display text-[0.8125rem] text-slate/80">{content.note}</p>
          ) : null}
          {download ? (
            <a
              href={"to" in download ? download.to : download.href}
              className="inline-flex min-h-11 items-center font-display text-[0.8125rem] font-medium tracking-[0.14em] text-slate uppercase underline underline-offset-4 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            >
              {content.download.label} <span aria-hidden="true">↓</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
