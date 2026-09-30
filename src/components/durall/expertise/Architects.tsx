import { Link } from "@tanstack/react-router";
import { useReveal, useSectionIntro } from "@/lib/anim";
import { linkTo } from "@/content/render";
import type { ExpertisePage } from "@/content/types";
import { EYEBROW, HEADING, LEDE, PAPER, SECTION_Y, SHELL } from "./styles";

/** "Bring us in early.": three offers to architects, the middle one in navy
 * as in the design. */
export function Architects({ content }: { content: ExpertisePage["architects"] }) {
  const introRef = useSectionIntro<HTMLDivElement>();
  const cardsRef = useReveal<HTMLUListElement>({ selector: "[data-card]", y: 24, stagger: 0.1 });

  return (
    <section id="architects" className={`${PAPER} ${SECTION_Y}`}>
      <div className={SHELL}>
        <div
          ref={introRef}
          className="grid grid-cols-1 gap-x-12 gap-y-6 lg:[grid-template-columns:minmax(0,842fr)_minmax(0,521fr)] lg:items-end"
        >
          <div className="min-w-0">
            <p data-anim className={`${EYEBROW} text-slate`}>
              {content.eyebrow}
            </p>
            <h2 data-anim="lines" className={`mt-[clamp(1rem,1.25vw,1.5rem)] ${HEADING} text-navy`}>
              {content.heading}
            </h2>
          </div>
          <p data-anim className={`max-w-[32.5rem] ${LEDE} text-slate`}>
            {content.body}
          </p>
        </div>

        <ul
          ref={cardsRef}
          className="mt-[clamp(2.5rem,5.2vw,6.25rem)] grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {content.cards.map((card, index) => {
            const navy = index === 1;
            const link = linkTo(card.link.href);
            const linkClass = `mt-auto inline-flex min-h-11 w-fit items-center pt-[clamp(1.5rem,2.5vw,3rem)] font-display text-[0.8125rem] font-medium tracking-[0.14em] uppercase underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              navy
                ? "text-white hover:text-white/75 focus-visible:outline-white"
                : "text-navy hover:text-accent-blue focus-visible:outline-accent-blue"
            }`;
            return (
              <li
                key={card.title}
                data-card
                className={`flex min-h-[clamp(18rem,18.75vw,22.5rem)] min-w-0 flex-col p-[clamp(1.5rem,2.1vw,2.5rem)] ${
                  navy ? "bg-navy text-white" : "border border-navy/18 text-navy"
                }`}
              >
                <p
                  className={`font-display text-[0.8125rem] font-medium tracking-[0.12em] tabular-nums ${
                    navy ? "text-silver" : "text-slate"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-[clamp(2.5rem,3.75vw,4.4rem)] font-display text-[clamp(1.5rem,1.67vw,2rem)] leading-[1.19] tracking-[-0.02em]">
                  {card.title}
                </h3>
                <p
                  className={`mt-4 max-w-[22.5rem] font-display text-base leading-[1.56] text-pretty ${
                    navy ? "text-silver" : "text-slate"
                  }`}
                >
                  {card.body}
                </p>
                {card.link.label ? (
                  "to" in link ? (
                    <Link {...link} className={linkClass}>
                      {card.link.label} <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <a href={link.href} className={linkClass}>
                      {card.link.label} <span aria-hidden="true">→</span>
                    </a>
                  )
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
