import { IMAGES } from "@/assets/images";
import { useReveal, useSplitLines } from "@/lib/anim";
import { Interactive } from "../ui";
import { PARTNERS } from "./data";
import { PartnerLogo } from "./marks";

export function InternationalNetwork() {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const introRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 24 });
  const gridRef = useReveal<HTMLUListElement>({ selector: "[data-cell]", y: 28, stagger: 0.06 });
  const quoteRef = useReveal<HTMLDivElement>({ y: 24 });

  return (
    <section
      id="international-systems"
      className="relative overflow-hidden bg-white py-[clamp(3.5rem,8vw,7.5rem)]"
    >
      <div ref={introRef} className="shell-narrow">
        <p
          data-reveal
          className="flex items-center gap-3 font-display text-[clamp(0.625rem,0.72vw,0.6875rem)] font-bold tracking-eyebrow text-accent-blue uppercase"
        >
          International Systems
          <span
            aria-hidden="true"
            className="h-0 w-[clamp(1.5rem,3vw,2.5rem)] border-t border-accent-blue/60"
          />
        </p>
        <h2
          ref={headingRef}
          className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[22ch] font-display text-[clamp(1.875rem,3.6vw,4rem)] leading-[1.1] font-medium tracking-section text-balance text-navy"
        >
          A network built around specialised systems.
        </h2>
        <p
          data-reveal
          className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[32rem] font-body text-[clamp(0.8125rem,1vw,0.9375rem)] leading-relaxed text-slate"
        >
          Our international partners expand Durall’s capabilities across windows, glass, mesh,
          shading, fenestration and other specialised systems.
        </p>
      </div>

      <div className="relative mt-[clamp(2.5rem,5vw,4.5rem)]">
        <img
          {...IMAGES.partnersWorldMap}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="pointer-events-none absolute top-1/2 left-1/2 w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-15 select-none"
          loading="lazy"
        />
        <ul
          ref={gridRef}
          className="shell-narrow relative grid grid-cols-1 gap-y-[clamp(2rem,4vw,3rem)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {PARTNERS.map((partner) => (
            <li key={partner.name} data-cell className="min-w-0">
              <Interactive
                lift={-4}
                scale={1.01}
                className="flex min-w-0 flex-col items-center px-[clamp(0.75rem,1.5vw,2rem)] text-center"
              >
                <span className="flex min-h-[clamp(2.75rem,4vw,3.5rem)] items-center justify-center">
                  <PartnerLogo mark={partner.mark} name={partner.name} />
                </span>
                <span className="mt-[clamp(1rem,2vw,1.75rem)] font-body text-xs font-medium text-slate">
                  {partner.country}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-0 w-4 border-t-[1.5px] border-accent-blue"
                />
                <span className="mt-[clamp(1rem,2vw,1.75rem)] max-w-[11rem] font-body text-xs leading-snug text-navy">
                  {partner.description}
                </span>
              </Interactive>
            </li>
          ))}
        </ul>
      </div>

      <div ref={quoteRef} className="shell-narrow relative mt-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="flex items-stretch gap-[clamp(1rem,2vw,1.75rem)]">
          <svg
            viewBox="0 0 33 112"
            fill="none"
            aria-hidden="true"
            className="h-[clamp(3.5rem,6vw,7rem)] w-auto shrink-0 text-navy/40"
            preserveAspectRatio="none"
          >
            <path d="M0.309 0.393 32.309 25.553V111.393" stroke="currentColor" />
          </svg>
          <p className="max-w-[46rem] self-end font-body text-[clamp(0.875rem,1.1vw,1.0625rem)] leading-relaxed text-navy">
            From minimal window systems to advanced mesh and climate solutions, our partners bring
            world-class innovation. Durall brings it together — with understanding, precision and
            local execution.
          </p>
        </div>
      </div>
    </section>
  );
}
