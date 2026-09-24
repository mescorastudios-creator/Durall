import { IMAGES } from "@/assets/images";
import { useReveal, useSplitLines } from "@/lib/anim";
import { ConnectorLine } from "./ConnectorLine";
import { Interactive, ViewMore } from "./ui";

const PROJECTS = [
  {
    name: "Parikrama, Murud House",
    place: "Murud — Spasm Architects",
    image: IMAGES.thumbParikrama,
  },
  { name: "Patina", place: "Maldives — Studio MK27", image: IMAGES.thumbPatina },
  { name: "Chiltron House", place: "Singapore — WOW Architects", image: IMAGES.thumbChiltron },
  { name: "Juhu house", place: "Mumbai — Ernesto Bedmar", image: IMAGES.thumbJuhu },
  { name: "Ritz-Carlton", place: "Maldives — Kerry Hill Architects", image: IMAGES.thumbRitz },
];

export function Projects() {
  const headRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 30 });
  const gridRef = useReveal<HTMLUListElement>({
    selector: "[data-card]",
    y: 70,
    stagger: 0.22,
    start: "top 92%",
    end: "bottom 55%",
    scrub: 1.2,
  });
  const headingRef = useSplitLines<HTMLHeadingElement>();

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-white pb-[clamp(4.5rem,8vw,9.375rem)]"
    >
      <div className="shell-narrow">
        <div
          ref={headRef}
          className="flex flex-col justify-between gap-[clamp(1.5rem,3vw,2rem)] lg:flex-row lg:items-end"
        >
          <h2
            ref={headingRef}
            className="min-w-0 max-w-[38rem] font-display text-[clamp(2.125rem,3.7vw,4.25rem)] leading-none font-medium tracking-section text-balance text-navy"
          >
            What we&rsquo;ve
            <br />
            built together.
          </h2>
          <p
            data-reveal
            className="min-w-0 max-w-[35rem] font-body text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-slate lg:pb-4"
          >
            Selected residences and landmarks where Durall&rsquo;s systems became the
            architecture&rsquo;s most exacting details.
          </p>
        </div>

        <ul
          ref={gridRef}
          className="mt-[clamp(2.75rem,5.5vw,6.5625rem)] grid grid-cols-1 gap-x-[clamp(1rem,1.4vw,1.625rem)] gap-y-[clamp(1.75rem,2.2vw,2.1875rem)] sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROJECTS.map((project) => (
            <Interactive
              as="li"
              key={project.name}
              data-card
              lift={-6}
              scale={1.012}
              className="min-w-0"
            >
              <article className="group flex flex-col items-start text-left">
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    {...project.image}
                    alt={`${project.name} — ${project.place}`}
                    sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="flex w-full flex-col items-start px-0 text-left">
                  <h3 className="mt-[clamp(1rem,1.2vw,1.375rem)] font-display text-[clamp(1.125rem,1.4vw,1.5rem)] font-medium tracking-tight text-navy">
                    {project.name}
                  </h3>
                  <p className="mt-1.5 font-body text-xs tracking-wide text-slate">
                    {project.place}
                  </p>
                </div>
              </article>
            </Interactive>
          ))}
        </ul>

        <div className="mt-[clamp(2rem,3vw,3.5rem)] flex justify-center lg:mt-[-3.625rem] lg:justify-end">
          <ViewMore href="#projects" />
        </div>
      </div>

      <ConnectorLine />
    </section>
  );
}
