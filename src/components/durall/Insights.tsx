import { Link } from "@tanstack/react-router";
import { TRAVEL, useReveal, useSectionIntro } from "@/lib/anim";
import { FEATURED, REST } from "./insights/data";
import { ViewMore } from "./ui";

export function ReadArticle({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 font-display text-[clamp(0.6875rem,0.78vw,0.75rem)] font-medium tracking-button text-navy uppercase " +
        className
      }
    >
      Read article
      <span aria-hidden="true" className="hover-arrow">
        →
      </span>
    </span>
  );
}

export function Meta({ category, date, iso }: { category: string; date: string; iso: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[clamp(0.6875rem,0.72vw,0.75rem)] font-medium tracking-eyebrow uppercase">
      <span className="text-navy">{category}</span>
      <time dateTime={iso} className="text-slate">
        {date}
      </time>
    </div>
  );
}

/* The photographs' cut corner, as in the design: 45°, bottom right. The
 * featured photograph's is a fixed length so it stays 45° on a landscape
 * frame; the thumbnails are square, so a share of the side does the same. */
const FEATURED_CUT =
  "[clip-path:polygon(0_0,100%_0,100%_calc(100%-clamp(2.5rem,5.5vw,5.5rem)),calc(100%-clamp(2.5rem,5.5vw,5.5rem))_100%,0_100%)]";
const THUMB_CUT = "[clip-path:polygon(0_0,100%_0,100%_74%,74%_100%,0_100%)]";

export function Insights() {
  const headRef = useSectionIntro<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>({
    selector: "[data-card]",
    y: TRAVEL.lg,
    stagger: 0.12,
    start: "clamp(top 92%)",
    end: "clamp(top 35%)",
    scrub: 0.8,
  });

  return (
    <section id="insights" className="bg-white py-[clamp(4.5rem,8vw,9.375rem)]">
      <div className="shell-narrow">
        <div ref={headRef}>
          {/* 13.5em holds "that" on the first line, as in the design. */}
          <h2
            data-anim="lines"
            className="max-w-[13.5em] font-display text-[clamp(2.125rem,3.6vw,4rem)] leading-[1.17] font-medium tracking-tight text-pretty text-navy"
          >
            Engineering insights that build better facades
          </h2>
        </div>

        {/* The featured article takes the wider share of the row. */}
        <div
          ref={gridRef}
          className="mt-[clamp(2.5rem,4vw,4.375rem)] grid grid-cols-1 gap-x-[clamp(2rem,5.5vw,6rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,1.19fr)_minmax(0,1fr)]"
        >
          {/* Featured article */}
          <article data-card className="flex min-w-0 flex-col">
            <div className={`aspect-[29/20] w-full overflow-hidden ${FEATURED_CUT}`}>
              <img
                {...FEATURED.image}
                alt={FEATURED.alt}
                sizes="(min-width: 64rem) 50vw, 100vw"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-[clamp(1.25rem,1.8vw,1.75rem)] flex min-w-0 flex-col">
              <Meta
                category={FEATURED.category}
                date={`${FEATURED.date} · ${FEATURED.readingTime}`}
                iso={FEATURED.iso}
              />
              <h3 className="mt-[clamp(0.75rem,1.2vw,1.125rem)] max-w-[30ch] font-display text-[clamp(1.5rem,2.5vw,2.75rem)] leading-[1.14] font-medium tracking-tight text-balance text-navy">
                {FEATURED.title}
              </h3>
              <p className="mt-[clamp(0.875rem,1.4vw,1.25rem)] max-w-[46ch] font-body text-[clamp(0.875rem,1vw,1rem)] leading-relaxed text-slate">
                {FEATURED.excerpt}
              </p>
              <Link
                to="/insights/$slug"
                params={{ slug: FEATURED.slug }}
                className="group mt-[clamp(1.25rem,2vw,1.875rem)] inline-flex min-h-11 w-fit items-center"
              >
                <ReadArticle />
                <span className="sr-only">: {FEATURED.title}</span>
              </Link>
            </div>
          </article>

          {/* Compact rows */}
          <div className="flex min-w-0 flex-col">
            {REST.map((row, index) => (
              <article
                key={row.slug}
                data-card
                className={
                  "flex min-w-0 items-start justify-between gap-[clamp(1rem,2vw,2rem)] py-[clamp(1.25rem,2vw,1.75rem)] " +
                  (index > 0 ? "border-t border-navy/15" : "lg:pt-0")
                }
              >
                <div className="min-w-0 flex-1">
                  <Meta category={row.category} date={row.date} iso={row.iso} />
                  <h3 className="mt-[clamp(0.625rem,1vw,0.875rem)] max-w-[30ch] font-display text-[clamp(1.0625rem,1.35vw,1.5rem)] leading-[1.25] font-medium tracking-tight text-pretty text-navy">
                    {row.title}
                  </h3>
                  <Link
                    to="/insights/$slug"
                    params={{ slug: row.slug }}
                    className="group mt-[clamp(0.875rem,1.4vw,1.25rem)] inline-flex min-h-11 w-fit items-center"
                  >
                    <ReadArticle />
                    <span className="sr-only">: {row.title}</span>
                  </Link>
                </div>
                <div
                  className={`aspect-square w-[clamp(5.5rem,9vw,8.75rem)] shrink-0 overflow-hidden ${THUMB_CUT}`}
                >
                  <img
                    {...row.image}
                    alt={row.alt}
                    sizes="clamp(5.5rem, 9vw, 8.75rem)"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(2rem,3vw,2.875rem)] flex justify-center">
          <ViewMore to="/insights" />
        </div>
      </div>
    </section>
  );
}
