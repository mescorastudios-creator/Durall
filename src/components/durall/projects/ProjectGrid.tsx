import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { TRAVEL, useReveal } from "@/lib/anim";
import { useReducedMotion } from "@/lib/motion-prefs";
import { CATEGORIES, SORTS, type Category, type SortKey } from "@/content/categories";
import { imageOf } from "@/content/render";
import type { PortfolioItem } from "@/content/select";
import type { ProjectsPage } from "@/content/types";
import { CURVE, transition } from "@/lib/motion-tokens";
import { CardFrame } from "../ui";

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true" className="h-2.5 w-2.5">
      <path d="M1.5 8.5L8.5 1.5M3.5 1.5h5v5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ProjectGrid({
  projects: PROJECTS,
  labels,
}: {
  projects: readonly PortfolioItem[];
  labels: ProjectsPage["grid"];
}) {
  const reduced = useReducedMotion();
  const barRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 16, stagger: 0.08 });
  /* No scroll reveal on this grid, deliberately.
   *
   * The cards are already animated by AnimatePresence below — they have to
   * be, because filtering adds and removes them — and a GSAP scrub on the
   * same elements meant two libraries writing `opacity` on every frame. GSAP
   * won, and because its window ran to `bottom 55%` of a tall six-card grid,
   * cards sat half-transparent against white for most of the time they were
   * on screen: 0.53 / 0.40 / 0.26 / 0.13 with the whole grid in view.
   *
   * The entrance belongs to whichever system owns the element's lifecycle,
   * and here that is AnimatePresence. */

  /* Filter and sort read from and write to the URL, so a filtered view is
   * linkable and survives the back button. Defaults are dropped from the
   * query string to keep the canonical /projects URL clean. */
  const { category = "All", sort = "featured" } = useSearch({ from: "/projects/" });
  const navigate = useNavigate({ from: "/projects/" });
  const [sortOpen, setSortOpen] = useState(false);

  const apply = (next: Partial<{ category: Category; sort: SortKey }>) =>
    void navigate({
      // Defaults are omitted rather than written out, so the unfiltered view
      // stays on a bare /projects URL instead of ?category=All&sort=featured.
      search: (prev) => {
        const merged = { category, sort, ...prev, ...next };
        return {
          ...(merged.category === "All" ? {} : { category: merged.category }),
          ...(merged.sort === "featured" ? {} : { sort: merged.sort }),
        };
      },
      replace: true,
      resetScroll: false,
    });
  const setCategory = (next: Category) => apply({ category: next });
  const setSort = (next: SortKey) => apply({ sort: next });

  const visible = useMemo(() => {
    const filtered =
      category === "All" ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(category));
    const sorted = [...filtered];
    if (sort === "newest") sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [PROJECTS, category, sort]);

  return (
    <section id="portfolio" className="bg-white pb-[clamp(3.5rem,6vw,7.5rem)]">
      <div className="shell">
        <div
          ref={barRef}
          className="flex flex-col gap-4 border-b border-navy-14 pb-3 md:flex-row md:items-end md:justify-between"
        >
          <div data-reveal className="flex min-w-0 flex-wrap gap-x-[clamp(1rem,2vw,2rem)] gap-y-2">
            {CATEGORIES.map((item) => {
              const active = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item)}
                  className={`relative pb-1 font-display text-xs font-bold tracking-[0.0625rem] uppercase transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] ${
                    active ? "text-navy" : "text-slate hover:text-navy"
                  }`}
                >
                  {item}
                  {active ? (
                    <motion.span
                      layoutId="project-tab"
                      className="absolute -bottom-[13px] left-0 h-px w-full bg-navy"
                      transition={transition("short", reduced)}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="relative shrink-0" data-reveal>
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              aria-expanded={sortOpen}
              className="relative flex items-center gap-2 pb-1 font-display text-xs font-bold tracking-[0.0625rem] text-slate uppercase transition-colors hover:text-navy after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']"
            >
              {labels.sort}
              <motion.span
                animate={{ rotate: reduced || !sortOpen ? 0 : 180 }}
                transition={transition("short", reduced)}
                className="inline-flex"
              >
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3 w-3">
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence>
              {sortOpen ? (
                <motion.ul
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={transition("micro", reduced, CURVE.micro)}
                  className="absolute right-0 z-10 mt-2 w-40 border border-navy-14 bg-white py-2 shadow-sm"
                >
                  {SORTS.map((option) => (
                    <li key={option.key}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(option.key);
                          setSortOpen(false);
                        }}
                        className={`flex min-h-11 w-full items-center px-4 text-left font-body text-xs transition-colors ${
                          sort === option.key ? "text-navy" : "text-slate hover:text-navy"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <ul className="mt-[clamp(2rem,3.4vw,3rem)] grid grid-cols-1 gap-x-[clamp(1.25rem,2.1vw,2.5rem)] gap-y-[clamp(2.25rem,3.6vw,4.25rem)] sm:grid-cols-2">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((project) => (
              <motion.li
                key={project.slug}
                data-card
                layout={!reduced}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: TRAVEL.sm }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={transition("medium", reduced)}
                className="group min-w-0"
              >
                <motion.article
                  whileHover={reduced ? { opacity: 0.9 } : { y: -6 }}
                  transition={transition("short", reduced, CURVE.micro)}
                  className="relative"
                >
                  <div className="relative aspect-[848/565] w-full">
                    {/* The same line as the home page's cards, drawn on hover. */}
                    <CardFrame />
                    <div className="relative h-full w-full overflow-hidden rounded-sm bg-mist">
                      <div data-fx="parallax" className="h-full w-full">
                        <img
                          draggable={false}
                          {...imageOf(project.hero.image)}
                          alt={`${project.name} — ${project.location}, ${project.architect}`}
                          sizes="(min-width: 40rem) 50vw, 100vw"
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-[clamp(1.25rem,1.6vw,1.5rem)] flex items-center gap-3">
                    <p className="font-body text-xs font-bold text-navy">{project.index}</p>
                    <span className="h-px w-4 bg-navy-14" />
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="min-w-0 font-display text-[clamp(1.125rem,1.4vw,1.5rem)] font-medium tracking-tight text-navy">
                      {project.name}
                    </h3>
                    {/* Every project has a page now; this used to point back
                     * at the grid. The link's box is stretched over the whole
                     * card, so the photograph is a way in too. */}
                    <Link
                      to="/projects/$slug"
                      params={{ slug: project.slug }}
                      className="mt-1.5 inline-flex shrink-0 items-center gap-2 border-b border-navy pb-0.5 font-display text-xs font-bold tracking-[0.0625rem] text-navy uppercase after:absolute after:inset-0 after:content-['']"
                    >
                      {labels.view}
                      <span className="sr-only">: {project.name}</span>
                      <span className="hover-arrow inline-flex">
                        <ArrowUpRight />
                      </span>
                    </Link>
                  </div>

                  <p className="mt-3 font-body text-sm text-slate">
                    {project.location} · {project.architect}
                  </p>
                </motion.article>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {visible.length === 0 ? (
          <p className="mt-12 font-body text-sm text-slate">{labels.empty}</p>
        ) : null}
      </div>
    </section>
  );
}
