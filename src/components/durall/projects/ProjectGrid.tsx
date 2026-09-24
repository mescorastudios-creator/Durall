import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useReveal } from "@/lib/anim";
import { useReducedMotion } from "@/lib/motion-prefs";
import { CATEGORIES, PROJECTS, SORTS, type Category, type SortKey } from "./data";

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true" className="h-2.5 w-2.5">
      <path d="M1.5 8.5L8.5 1.5M3.5 1.5h5v5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ProjectGrid() {
  const reduced = useReducedMotion();
  const barRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 18, stagger: 0.05 });
  const gridRef = useReveal<HTMLUListElement>({
    selector: "[data-card]",
    y: 70,
    stagger: 0.22,
    start: "top 92%",
    end: "bottom 55%",
    scrub: 1.2,
  });

  /* Filter and sort read from and write to the URL, so a filtered view is
   * linkable and survives the back button. Defaults are dropped from the
   * query string to keep the canonical /projects URL clean. */
  const { category = "All", sort = "featured" } = useSearch({ from: "/projects" });
  const navigate = useNavigate({ from: "/projects" });
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
    if (sort === "newest") sorted.sort((a, b) => b.year - a.year);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [category, sort]);

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
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
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
              Sort
              <motion.span
                animate={{ rotate: reduced || !sortOpen ? 0 : 180 }}
                transition={{ duration: 0.25 }}
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
                  transition={{ duration: 0.2, ease: "easeOut" }}
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

        <ul
          ref={gridRef}
          className="mt-[clamp(2rem,3.4vw,3rem)] grid grid-cols-1 gap-x-[clamp(1.25rem,2.1vw,2.5rem)] gap-y-[clamp(2.25rem,3.6vw,4.25rem)] sm:grid-cols-2"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((project) => (
              <motion.li
                key={project.name}
                data-card
                layout={!reduced}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group min-w-0"
              >
                <motion.article
                  whileHover={reduced ? { opacity: 0.9 } : { y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                  <div className="aspect-[848/565] w-full overflow-hidden rounded-sm bg-mist">
                    <img
                      {...project.image}
                      alt={`${project.name} — ${project.location}, ${project.architect}`}
                      sizes="(min-width: 40rem) 50vw, 100vw"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>

                  <div className="mt-[clamp(1.25rem,1.6vw,1.5rem)] flex items-center gap-3">
                    <p className="font-body text-xs font-bold text-navy">{project.index}</p>
                    <span className="h-px w-4 bg-navy-14" />
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="min-w-0 font-display text-[clamp(1.125rem,1.4vw,1.5rem)] font-medium tracking-tight text-navy">
                      {project.name}
                    </h3>
                    <motion.a
                      href="#portfolio"
                      className="relative mt-1.5 inline-flex shrink-0 items-center gap-2 border-b border-navy pb-0.5 font-display text-xs font-bold tracking-[0.0625rem] text-navy uppercase after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']"
                      whileHover={reduced ? { opacity: 0.75 } : { x: 3 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                      View Project
                      <ArrowUpRight />
                    </motion.a>
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
          <p className="mt-12 font-body text-sm text-slate">No projects in this category yet.</p>
        ) : null}
      </div>
    </section>
  );
}
