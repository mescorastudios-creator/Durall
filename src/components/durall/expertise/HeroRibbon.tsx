import type { ExpertisePage } from "@/content/types";

/** The photograph's credit and the strip of systems along the foot of the
 * Expertise hero, set inside PhotoHero. */
export function HeroRibbon({ content }: { content: ExpertisePage["opening"] }) {
  const { credit, ribbon } = content;
  return (
    <div data-hero-fade className="lg:mr-[3.4vw]">
      {credit ? <p className="font-display text-xs text-white/75 sm:text-right">{credit}</p> : null}
      <div className="mt-[clamp(1rem,2.2vw,2.6rem)] flex flex-col gap-4 border-t border-white/28 pt-[clamp(1rem,1.15vw,1.4rem)] pb-[clamp(1.5rem,2.3vw,2.75rem)] lg:flex-row lg:items-center lg:justify-between">
        <p className="flex items-center gap-2.5 text-white">
          <span className="font-display text-[1.875rem] leading-none font-light">
            {ribbon.count}
          </span>
          <span className="font-display text-[0.6875rem] font-medium tracking-[0.18em] text-white/75 uppercase">
            {ribbon.label}
          </span>
        </p>
        <ul className="flex flex-wrap gap-x-[clamp(1.25rem,2.9vw,3.5rem)] gap-y-2">
          {ribbon.items.map((item) => (
            <li
              key={item}
              className="font-display text-[0.8125rem] font-medium tracking-[0.15em] text-white/85 uppercase"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
