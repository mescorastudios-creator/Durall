import { Link } from "@tanstack/react-router";
import { useLineReveal } from "./motion";
import { Eyebrow } from "./parts";
import type { ProjectsPage } from "@/content/types";
import type { ProjectDetail } from "./data";

/**
 * Hands the reader on to another project.
 *
 * On hover the title rolls: each line slides up out of its mask while an
 * identical copy rises in behind it, a beat apart — the reference's
 * next-work treatment. The photograph eases in at the same time.
 *
 * Every project has a page, so the chain runs through all of them and wraps
 * round from the last to the first (see `nextProject`).
 */
export function NextProject({
  next,
  labels,
}: {
  next: ProjectDetail;
  labels: ProjectsPage["detail"];
}) {
  const ref = useLineReveal<HTMLDivElement>();
  const photo = next.card ?? next.hero;

  return (
    <section className="shell pb-[clamp(5rem,9vw,8rem)]">
      <div ref={ref}>
        <span data-rule aria-hidden="true" className="block h-px w-full bg-navy-14" />
        <Eyebrow className="mt-5">{labels.next}</Eyebrow>
        <Link
          to="/projects/$slug"
          params={{ slug: next.slug }}
          data-rise
          className="group mt-[clamp(2rem,4vw,3rem)] grid items-center gap-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]"
        >
          <div className="aspect-[1.6] w-full overflow-hidden bg-mist">
            <div data-fx="parallax" className="h-full w-full">
              <img
                draggable={false}
                {...photo.image}
                alt=""
                sizes="(min-width: 48rem) 24rem, 92vw"
                loading="lazy"
                decoding="async"
                className="media-zoom h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.9] font-light tracking-[-0.04em] text-navy">
              <span className="sr-only">{next.name}</span>
              {next.title.map((line, index) => (
                <span
                  key={line}
                  aria-hidden="true"
                  className="relative block overflow-hidden pb-[0.06em]"
                  style={{ ["--roll-delay" as string]: `${index * 60}ms` }}
                >
                  <span className="roll-line block">{line}</span>
                  <span className="roll-line roll-line--copy absolute inset-x-0 top-0 block">
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p className="mt-6 flex items-center gap-3 font-display text-[0.6875rem] font-bold tracking-[0.18em] text-slate uppercase">
              {next.architect} · {next.location}
              <svg
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className="hover-arrow h-3.5 w-3.5 text-navy"
              >
                <path d="M2 10L10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
