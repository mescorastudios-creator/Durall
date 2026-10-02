import type { ReactNode } from "react";

/**
 * The strip along the foot of a PhotoHero: the photograph's credit, then a
 * rule with a figure and its label on the left and whatever the page sets on
 * the right (Careers: the link down to the roles).
 *
 * From the Careers design at 1920: the credit directly under the
 * introduction, the rule 27px below it, the row 22px under that and 44px
 * clear of the photograph's foot.
 */
export function HeroRibbon({
  credit,
  count,
  label,
  children,
}: {
  credit: string;
  count: string;
  label: string;
  children?: ReactNode;
}) {
  return (
    <div data-hero-fade className="lg:mr-[3.4vw]">
      {credit ? (
        <p className="mt-4 font-display text-xs text-white/75 sm:mt-0 sm:text-right">{credit}</p>
      ) : null}
      <div className="mt-[clamp(1rem,1.4vw,1.7rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/28 pt-[clamp(0.75rem,1.15vw,1.4rem)] pb-[clamp(1.5rem,2.3vw,2.75rem)]">
        <p className="flex items-center gap-2.5 text-white">
          <span className="font-display text-[1.875rem] leading-[1.27] font-light tabular-nums">
            {count}
          </span>
          <span className="font-display text-[0.6875rem] font-medium tracking-[0.18em] text-white/75 uppercase">
            {label}
          </span>
        </p>
        {children}
      </div>
    </div>
  );
}
