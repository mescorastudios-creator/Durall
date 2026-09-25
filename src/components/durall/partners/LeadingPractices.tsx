import { IMAGES } from "@/assets/images";
import { REVEAL_WINDOW, useReveal, useSplitLines } from "@/lib/anim";
import { Interactive } from "../ui";
import { PRACTICES } from "./data";
import { PracticeLogo } from "./marks";

export function LeadingPractices() {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const introRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 16 });
  const imageRef = useReveal<HTMLDivElement>({ y: 32, start: REVEAL_WINDOW.start });
  const gridRef = useReveal<HTMLUListElement>({ selector: "[data-cell]", y: 32, stagger: 0.08 });
  const closingRef = useReveal<HTMLDivElement>({ y: 16 });

  return (
    <section
      id="practices"
      className="relative overflow-hidden bg-white pb-[clamp(3.5rem,8vw,7.5rem)]"
    >
      <div className="shell-about border-t border-navy/10 pt-[clamp(2.5rem,5vw,4.5rem)]" />

      <div className="grid grid-cols-1 items-center gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-2">
        <div ref={introRef} className="shell-about min-w-0 lg:pr-0">
          <p
            data-reveal
            className="flex items-center gap-3 font-display text-[clamp(0.625rem,0.72vw,0.6875rem)] font-bold tracking-eyebrow text-accent-blue uppercase"
          >
            Architects &amp; Design Practices
            <span
              aria-hidden="true"
              className="h-0 w-[clamp(1.5rem,3vw,2.5rem)] border-t border-accent-blue/60"
            />
          </p>
          <h2
            ref={headingRef}
            className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[18ch] font-display text-[clamp(1.75rem,3.2vw,3.5rem)] leading-[1.12] font-medium tracking-section text-balance text-navy"
          >
            Trusted alongside leading practices.
          </h2>
          <span
            aria-hidden="true"
            className="mt-[clamp(1rem,2vw,1.5rem)] block h-0 w-[clamp(2rem,3vw,2.5rem)] border-t-2 border-accent-blue"
          />
          <p
            data-reveal
            className="mt-[clamp(1.25rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.9375rem)] leading-relaxed text-slate"
          >
            Durall’s international experience is shaped through collaboration with visionary
            architects and designers across the globe.
          </p>
          <p
            data-reveal
            className="mt-[clamp(0.75rem,1.5vw,1.25rem)] max-w-[28rem] font-body text-[clamp(0.75rem,0.9vw,0.875rem)] leading-relaxed text-slate/80"
          >
            And also with all leading architects &amp; interior designers on projects in India.
          </p>
        </div>

        <div ref={imageRef} className="relative min-w-0">
          <img
            {...IMAGES.partnersVilla}
            alt="Rendered white residence with layered aluminium framed glazing"
            sizes="(min-width: 64rem) 50vw, 100vw"
            loading="lazy"
            decoding="async"
            className="w-full object-contain"
          />
        </div>
      </div>

      <ul
        ref={gridRef}
        className="shell-about relative mt-[clamp(2.5rem,5vw,4.5rem)] grid grid-cols-1 gap-y-[clamp(2rem,4vw,3rem)] sm:grid-cols-2 lg:grid-cols-4"
      >
        {PRACTICES.map((practice) => (
          <li key={practice.name} data-cell className="min-w-0">
            <Interactive
              lift={-4}
              scale={1.01}
              className="flex min-w-0 flex-col items-center px-[clamp(0.75rem,1.5vw,2rem)] text-center"
            >
              <span className="flex min-h-[clamp(2.5rem,3.5vw,3rem)] items-center justify-center">
                <PracticeLogo mark={practice.mark} name={practice.name} logo={practice.logo} />
              </span>
              <span className="mt-[clamp(0.875rem,1.8vw,1.5rem)] font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase">
                {practice.country}
              </span>
              <span className="mt-[clamp(0.875rem,1.8vw,1.5rem)] max-w-[11rem] font-body text-xs leading-snug text-navy">
                {practice.description}
              </span>
            </Interactive>
          </li>
        ))}
      </ul>

      <div ref={closingRef} className="shell-about mt-[clamp(2.5rem,5vw,4.5rem)] text-center">
        <p className="font-display text-[clamp(0.5625rem,0.75vw,0.6875rem)] font-bold tracking-eyebrow text-navy uppercase">
          Collaboration beyond borders. Architecture without limits.
        </p>
        <span
          aria-hidden="true"
          className="mx-auto mt-2 block h-0 w-[clamp(1.5rem,2.5vw,2rem)] border-t-2 border-accent-blue"
        />
      </div>
    </section>
  );
}
