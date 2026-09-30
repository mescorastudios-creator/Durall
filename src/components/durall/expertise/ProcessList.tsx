import { Link } from "@tanstack/react-router";
import { useReveal, useSectionIntro } from "@/lib/anim";
import { linkTo } from "@/content/render";
import { useSite } from "@/content/site";
import { ArrowRight } from "../ui";
import { EYEBROW, LEDE, PAPER, SECTION_Y, SHELL } from "./styles";

/**
 * "Concept to commissioning, under one roof." as the Expertise design draws
 * it: the five stages as a list on a timeline, rather than the home page's
 * scrolling scene. The words are the shared process, edited once for both.
 */
export function ProcessList({ eyebrow }: { eyebrow: string }) {
  const { process } = useSite().shared;
  const introRef = useSectionIntro<HTMLDivElement>();
  const listRef = useReveal<HTMLOListElement>({ selector: "[data-step]", y: 16, stagger: 0.08 });
  const link = linkTo(process.link.href);

  return (
    <section id="process" className={`${PAPER} ${SECTION_Y}`}>
      <div className={SHELL}>
        <div ref={introRef}>
          <p data-anim className={`${EYEBROW} text-slate`}>
            {eyebrow}
          </p>
          {/* Set heavier than the page's other headings and over three
              lines, as the design draws this one. */}
          <h2
            data-anim="lines"
            className="mt-[clamp(1rem,1.25vw,1.5rem)] max-w-[9.5em] font-display text-[clamp(2.5rem,3.75vw,4.5rem)] leading-[1.05] font-medium tracking-[-0.02em] text-navy"
          >
            {process.heading.text} {process.heading.muted}
          </h2>
          <p
            data-anim
            className={`mt-[clamp(1rem,1.25vw,1.5rem)] max-w-[40rem] ${LEDE} text-slate`}
          >
            {process.lede}
          </p>
        </div>

        <ol ref={listRef} className="relative mt-[clamp(2.5rem,3.3vw,4rem)]">
          {/* The timeline, from the first stage's node to the last's. */}
          <span
            aria-hidden="true"
            className="absolute top-[3.5rem] bottom-[3.5rem] left-[0.9375rem] w-0.5 bg-[#d2d6dc]"
          />
          {process.stages.map((stage, index) => {
            const first = index === 0;
            return (
              <li
                key={stage.title}
                data-step
                className={`relative flex items-start gap-[clamp(1rem,1.25vw,1.5rem)] py-8 ${
                  first ? "" : "border-t border-navy/8"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center"
                >
                  <span
                    className={
                      first
                        ? "size-2.5 rounded-full bg-navy"
                        : "size-2 rounded-full border border-[#b8bec6] bg-[#fdfdfb]"
                    }
                  />
                </span>
                <span
                  className={`w-[clamp(3.5rem,5.2vw,6.25rem)] shrink-0 font-serif text-[clamp(2rem,2.3vw,2.75rem)] leading-none italic tabular-nums ${
                    first ? "text-navy" : "text-slate/60"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-bold tracking-[0.04em] text-navy uppercase">
                    {stage.title}
                  </span>
                  <span className="mt-2 block font-body text-[0.9375rem] leading-[1.5] text-pretty text-slate">
                    {stage.body}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        {process.link.label ? (
          <p className="mt-[clamp(1.5rem,2.5vw,3rem)]">
            {"to" in link ? (
              <Link
                {...link}
                className="group hover-lift inline-flex min-h-11 items-center gap-3 border-b border-navy/40 font-display text-[0.8125rem] font-bold tracking-[0.06em] text-navy uppercase hover:border-navy"
              >
                {process.link.label}
                <ArrowRight className="hover-arrow h-4 w-4" />
              </Link>
            ) : (
              <a
                href={link.href}
                className="group hover-lift inline-flex min-h-11 items-center gap-3 border-b border-navy/40 font-display text-[0.8125rem] font-bold tracking-[0.06em] text-navy uppercase hover:border-navy"
              >
                {process.link.label}
                <ArrowRight className="hover-arrow h-4 w-4" />
              </a>
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
