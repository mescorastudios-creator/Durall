import { Link } from "@tanstack/react-router";
import { useSectionIntro } from "@/lib/anim";
import { linkTo } from "@/content/render";
import type { CtaBand } from "@/content/types";
import { ArrowRight, BUTTON } from "../ui";
import { SHELL } from "./styles";

/** "Have an opening in mind?": the page's closing band, centred, with the
 * style sheet's white button. */
export function OpeningCta({ band }: { band: CtaBand }) {
  const ref = useSectionIntro<HTMLDivElement>();
  const link = linkTo(band.action.href);

  return (
    <section className="bg-navy pt-[clamp(2.5rem,2.8vw,3.375rem)] pb-[clamp(3rem,3.45vw,4.125rem)] text-white">
      <div ref={ref} className={`${SHELL} flex flex-col items-center text-center`}>
        <p
          data-anim
          className="font-display text-[0.8125rem] leading-none font-medium tracking-[0.23em] text-silver/70 uppercase"
        >
          {band.eyebrow}
        </p>
        <h2
          data-anim="lines"
          className="mt-[clamp(1rem,1.05vw,1.25rem)] font-display text-[clamp(2rem,3.33vw,4rem)] leading-[1.125] tracking-[-0.022em] text-balance text-white"
        >
          {band.heading}
        </h2>
        <p
          data-anim
          className="mt-[clamp(1rem,1.6vw,1.9375rem)] max-w-[50rem] font-display text-[clamp(1rem,0.94vw,1.125rem)] leading-[1.56] text-pretty text-silver"
        >
          {band.body}
        </p>
        {band.action.label ? (
          <p data-anim className="mt-[clamp(1.5rem,1.9vw,2.25rem)]">
            {"to" in link ? (
              <Link {...link} className={BUTTON.inverted}>
                {band.action.label}
                <ArrowRight className="hover-arrow h-4 w-4 shrink-0" />
              </Link>
            ) : (
              <a href={link.href} className={BUTTON.inverted}>
                {band.action.label}
                <ArrowRight className="hover-arrow h-4 w-4 shrink-0" />
              </a>
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
