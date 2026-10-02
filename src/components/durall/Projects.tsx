import { Link } from "@tanstack/react-router";
import { TRAVEL, useReveal, useSectionIntro } from "@/lib/anim";
import { imageOf, Lines } from "@/content/render";
import type { HomeCard } from "@/content/select";
import type { HomePage } from "@/content/types";
import { ConnectorLine } from "./ConnectorLine";
import { CardFrame, ViewMore } from "./ui";

/** Each card opens its project's page, /projects/<slug>. */
export function Projects({
  content,
  cards,
}: {
  content: HomePage["projects"];
  cards: readonly HomeCard[];
}) {
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
            <Lines text={content.heading} />
          </h2>
          <p
            data-anim
            data-fx="words"
            className="min-w-0 max-w-[35rem] font-body text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-slate lg:pb-4"
          >
            {content.lede}
          </p>
        </div>

        <ul
          ref={gridRef}
          className="mt-[clamp(2.75rem,5.5vw,6.5625rem)] grid grid-cols-1 gap-x-[clamp(1rem,1.4vw,1.625rem)] gap-y-[clamp(1.75rem,2.2vw,2.1875rem)] sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((project, index) => (
            <li key={project.slug} data-card className="min-w-0">
              {/* The three columns travel at slightly different rates, so
                  the grid opens out as it passes rather than moving as one
                  sheet (ScrollFx, from `lg`). */}
              <article
                {...(index % 3
                  ? { "data-fx": "drift", "data-fx-by": index % 3 === 1 ? 30 : 16 }
                  : {})}
                className="group relative flex flex-col items-start text-left"
              >
                <div className="relative aspect-square w-full">
                  <CardFrame />
                  <div className="relative h-full w-full overflow-hidden">
                    <div data-fx="parallax" className="h-full w-full">
                      <img
                        draggable={false}
                        {...imageOf(project.image)}
                        alt={`${project.title} — ${project.subtitle}`}
                        sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                        loading="lazy"
                        // The same slow zoom as the cards on the Projects page.
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                    {/* On hover a navy shadow falls across the top-left of
                        the photograph and the project's name is set in it:
                        the shadow opens out from the corner, the name
                        follows it in. Only that side darkens. The name is
                        already the card's heading below, so this copy is
                        for the eye. */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                      <div className="absolute inset-0 origin-top-left scale-[0.72] bg-[radial-gradient(110%_85%_at_0%_0%,rgb(5_8_52/0.86)_0%,rgb(5_8_52/0.55)_26%,rgb(5_8_52/0.18)_48%,transparent_66%)] opacity-0 transition-[opacity,scale] duration-[var(--dur-medium)] ease-[var(--ease-entrance)] group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100 motion-reduce:scale-100" />
                      <span className="absolute top-[7%] left-[7%] max-w-[72%] -translate-x-3 -translate-y-2 font-display text-[clamp(1.25rem,1.67vw,2rem)] leading-[1.15] font-medium tracking-tight text-balance text-white opacity-0 transition-[opacity,translate] duration-[var(--dur-medium)] ease-[var(--ease-entrance)] group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:delay-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0">
                        {project.title}
                      </span>
                    </div>
                  </div>
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
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 font-body text-xs tracking-wide text-slate">
                    {project.subtitle}
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
