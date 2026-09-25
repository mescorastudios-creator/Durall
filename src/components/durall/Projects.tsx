import { Link } from "@tanstack/react-router";
import { IMAGES, type ImageAsset } from "@/assets/images";
import { PARIKRAMA_SLUG } from "./project/data";
import { TRAVEL, useReveal, useSectionIntro } from "@/lib/anim";
import { ConnectorLine } from "./ConnectorLine";
import { ViewMore } from "./ui";

/** Each card opens its project's page, /projects/<slug>. */
const PROJECTS: { name: string; place: string; image: ImageAsset; slug: string }[] = [
  {
    name: "Parikrama, Murud House",
    place: "Murud — Spasm Architects",
    image: IMAGES.cardParikrama,
    slug: PARIKRAMA_SLUG,
  },
  { name: "Patina", place: "Maldives — Studio MK27", image: IMAGES.cardPatina, slug: "patina" },
  {
    name: "Chiltron House",
    place: "Singapore — WOW Architects",
    image: IMAGES.cardChiltron,
    slug: "chiltron-house",
  },
  {
    name: "Juhu house",
    place: "Mumbai — Ernesto Bedmar",
    image: IMAGES.cardJuhu,
    slug: "juhu-house",
  },
  {
    name: "Ritz-Carlton",
    place: "Maldives — Kerry Hill Architects",
    image: IMAGES.cardRitz,
    slug: "ritz-carlton-maldives",
  },
];

/**
 * The line behind a card's photograph on hover: the photograph's outline,
 * offset up and to the left, its top-right corner cut at 45°. It rests
 * hidden behind the photograph and slides out from under it on hover or
 * keyboard focus; under reduced motion it only fades in, already in place.
 *
 * Drawn in a 100 × 100 box stretched over the square photograph, so the cut
 * stays at 45°; `non-scaling-stroke` keeps the line 1px at every size.
 */
function CardFrame() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="none"
      preserveAspectRatio="none"
      overflow="visible"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-[translate,opacity] duration-[var(--dur-short)] ease-[var(--ease-micro)] group-focus-within:-translate-x-2.5 group-focus-within:-translate-y-3 group-focus-within:opacity-100 group-hover:-translate-x-2.5 group-hover:-translate-y-3 group-hover:opacity-100 motion-reduce:-translate-x-2.5 motion-reduce:-translate-y-3 motion-reduce:transition-opacity"
    >
      <path
        d="M0 0H89.5L100 10.5V100H0Z"
        stroke="var(--color-navy)"
        strokeOpacity="0.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Projects() {
  const headRef = useSectionIntro<HTMLDivElement>();
  /* The grid gets a wider window than the header above it — the cascade is
   * the point — but it ends on the grid's own top rather than its bottom, so
   * the last card is opaque while the grid is still arriving instead of
   * after the reader has scrolled past it. */
  const gridRef = useReveal<HTMLUListElement>({
    selector: "[data-card]",
    y: TRAVEL.md,
    stagger: 0.08,
    start: "clamp(top 92%)",
    end: "clamp(top 45%)",
    scrub: 0.8,
  });

  return (
    <section
      id="projects"
      // Clipped sideways only: the connector line starts up in the
      // philosophy section, above this one, and has to show there.
      className="relative overflow-x-clip bg-white pb-[clamp(4.5rem,8vw,9.375rem)]"
    >
      {/* On desktop the right-hand margin is wider than the shell's own: it
       * is where the connector line runs, beside the grid rather than over
       * it. The width is the design's at 1920 (341px there), held to the
       * same share of the screen below that. */}
      <div className="shell-narrow lg:pr-[min(17.8vw,21.3125rem)]">
        <div
          ref={headRef}
          className="flex flex-col justify-between gap-[clamp(1.5rem,3vw,2rem)] lg:flex-row lg:items-end"
        >
          <h2
            data-anim="lines"
            className="min-w-0 max-w-[38rem] font-display text-[clamp(2.125rem,3.7vw,4.25rem)] leading-none font-medium tracking-section text-balance text-navy"
          >
            What we&rsquo;ve
            <br />
            built together.
          </h2>
          <p
            data-anim
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
            <li key={project.name} data-card className="min-w-0">
              <article className="group relative flex flex-col items-start text-left">
                <div className="relative aspect-square w-full">
                  <CardFrame />
                  <img
                    {...project.image}
                    alt={`${project.name} — ${project.place}`}
                    sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                    loading="lazy"
                    className="relative h-full w-full object-cover"
                  />
                </div>
                <div className="flex w-full flex-col items-start px-0 text-left">
                  <h3 className="mt-[clamp(1rem,1.2vw,1.375rem)] font-display text-[clamp(1.125rem,1.4vw,1.5rem)] font-medium tracking-tight text-navy">
                    {/* The whole card is the target; the link's box is
                     * stretched over it rather than wrapping it. */}
                    <Link
                      to="/projects/$slug"
                      params={{ slug: project.slug }}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className="mt-1.5 font-body text-xs tracking-wide text-slate">
                    {project.place}
                  </p>
                </div>
              </article>
            </li>
          ))}
          {/* Desktop: View More takes the grid's empty last cell, standing on
           * the same line as the foot of the photographs beside it. The
           * connector line ends in it. */}
          <li className="hidden min-w-0 lg:col-start-3 lg:block">
            <div data-connector-end className="flex aspect-square w-full items-end justify-end">
              <ViewMore to="/projects" />
            </div>
          </li>
        </ul>

        <div className="mt-[clamp(2rem,3vw,3.5rem)] flex justify-center lg:hidden">
          <ViewMore to="/projects" />
        </div>
      </div>

      <ConnectorLine />
    </section>
  );
}
