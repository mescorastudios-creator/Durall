import { Columns3, Layers, PanelsTopLeft, Thermometer } from "lucide-react";
import { useReveal, useSectionIntro } from "@/lib/anim";
import { Interactive } from "../ui";

/* The four headings the footer's Solutions column already names, given the
 * page they were pointing at. Copy stays inside what the rest of the site
 * already claims about these systems. */
const SYSTEMS = [
  {
    icon: PanelsTopLeft,
    title: "Window Systems",
    body: "Casement, sliding, tilt-turn and fixed lights, engineered to the opening rather than selected around it.",
  },
  {
    icon: Columns3,
    title: "Door Systems",
    body: "Full-height sliding and pivot assemblies sized to the load they actually carry, not to an elevation average.",
  },
  {
    icon: Layers,
    title: "Façade Systems",
    body: "Curtain walling, screens and skylights detailed as one envelope with the openings they meet.",
  },
  {
    icon: Thermometer,
    title: "Technical Performance",
    body: "Thermal, acoustic, structural and weather performance modelled as an assembly before the workshop sees it.",
  },
];

export function Systems() {
  const headRef = useSectionIntro<HTMLDivElement>();
  const listRef = useReveal<HTMLUListElement>({ selector: "li", y: 16, stagger: 0.12 });

  return (
    <section id="systems" className="bg-white pb-[clamp(3.5rem,7vw,7.5rem)]">
      <div className="shell">
        <div ref={headRef} className="max-w-[46rem]">
          <p
            data-anim
            className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase"
          >
            What we make
          </p>
          <h2
            data-anim="lines"
            className="mt-[clamp(0.75rem,1.4vw,1.25rem)] font-display text-[clamp(1.75rem,3vw,3rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy"
          >
            Four systems, <span className="text-slate">one discipline.</span>
          </h2>
        </div>

        <ul
          ref={listRef}
          className="mt-[clamp(2rem,3.5vw,3.5rem)] grid grid-cols-1 gap-[clamp(1.75rem,2.6vw,2.5rem)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {SYSTEMS.map(({ icon: Icon, title, body }) => (
            <Interactive
              as="li"
              key={title}
              lift={-3}
              scale={1.01}
              className="flex min-w-0 flex-col items-start border-t border-navy-14 pt-[clamp(1rem,1.6vw,1.5rem)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-14 bg-paper">
                <Icon aria-hidden="true" className="h-5 w-5 text-navy" strokeWidth={1.4} />
              </span>
              <h3 className="mt-[clamp(0.875rem,1.4vw,1.25rem)] font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
                {title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-pretty text-slate">
                {body}
              </p>
            </Interactive>
          ))}
        </ul>
      </div>
    </section>
  );
}
