import { Link } from "@tanstack/react-router";
import { useSectionIntro } from "@/lib/anim";
import { linkTo } from "@/content/render";
import type { ExpertisePage } from "@/content/types";
import { EYEBROW, PAPER, SHELL } from "./styles";

const LINK =
  "inline-flex min-h-11 items-center font-display text-[0.8125rem] font-medium tracking-[0.14em] text-navy uppercase underline underline-offset-4 hover:text-accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue";

/** "The world's finest systems, engineered for where you build.": the
 * statement under the hero, its text and link set to the right as in the
 * design, over the rule that closes the section. */
export function OurExpertise({ content }: { content: ExpertisePage["intro"] }) {
  const ref = useSectionIntro<HTMLDivElement>();
  const link = linkTo(content.link.href);
  const label = (
    <>
      {content.link.label}&nbsp;<span aria-hidden="true">→</span>
    </>
  );

  return (
    <section className={`${PAPER} pt-[clamp(4rem,7.3vw,8.75rem)]`}>
      <div ref={ref} className={SHELL}>
        <p data-anim className={`${EYEBROW} text-slate`}>
          {content.eyebrow}
        </p>
        <h2
          data-anim="lines"
          className="mt-[clamp(1.5rem,1.9vw,2.25rem)] max-w-[18.5em] font-display text-[clamp(2rem,3.33vw,4rem)] leading-[1.156] font-medium tracking-[-0.025em] text-pretty text-navy"
        >
          {content.heading}
        </h2>
        <div className="mt-[clamp(2rem,4.43vw,5.3125rem)] lg:ml-[41.57%]">
          <p
            data-anim
            data-fx="words"
            className="max-w-[38.8rem] font-display text-[clamp(1rem,1.04vw,1.25rem)] leading-[1.55] text-pretty text-slate"
          >
            {content.body}
          </p>
          {content.link.label ? (
            <p data-anim className="mt-[clamp(0.75rem,0.95vw,1.15rem)]">
              {"to" in link ? (
                <Link {...link} className={LINK}>
                  {label}
                </Link>
              ) : (
                <a href={link.href} className={LINK}>
                  {label}
                </a>
              )}
            </p>
          ) : null}
        </div>
        <div aria-hidden="true" data-fx="rule" className="mt-[0.6875rem] h-px bg-navy/12" />
      </div>
    </section>
  );
}
