import { IMAGES } from "@/assets/images";
import { useReveal, useSplitLines } from "@/lib/anim";
import { Interactive, ViewMore } from "./ui";

function ReadArticle({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 font-display text-[clamp(0.6875rem,0.78vw,0.75rem)] font-medium tracking-button text-navy uppercase transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 " +
        className
      }
    >
      Read article
      <span aria-hidden="true">→</span>
    </span>
  );
}

function Meta({ category, date, iso }: { category: string; date: string; iso: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[clamp(0.6875rem,0.72vw,0.75rem)] font-medium tracking-eyebrow uppercase">
      <span className="text-navy">{category}</span>
      <time dateTime={iso} className="text-slate">
        {date}
      </time>
    </div>
  );
}

const ROWS = [
  {
    category: "Fabrication",
    date: "12 Aug 2026",
    iso: "2026-08-12",
    title: "Precision in Fabrication: Why Small Details Matter at Scale",
    image: IMAGES.thumbChiltron,
    alt: "Modern white house with large glazed openings",
  },
  {
    category: "Materials",
    date: "04 Aug 2026",
    iso: "2026-08-04",
    title: "Why Aluminium Is Becoming the Material of Choice for Modern Envelopes",
    image: IMAGES.thumbJuhu,
    alt: "Aerial view of a modern residence with a courtyard pool",
  },
  {
    category: "Engineering",
    date: "21 Jul 2026",
    iso: "2026-07-21",
    title: "Thermal Performance Without Compromising Architectural Intent",
    image: IMAGES.thumbRitz,
    alt: "Curved pool deck overlooking clear blue water",
  },
];

export function Insights() {
  const headRef = useSplitLines<HTMLHeadingElement>();
  const gridRef = useReveal<HTMLDivElement>({
    selector: "[data-card]",
    y: 72,
    stagger: 0.22,
    start: "top 92%",
    end: "bottom 60%",
    scrub: 1.2,
  });

  return (
    <section id="insights" className="bg-white py-[clamp(4.5rem,8vw,9.375rem)]">
      <div className="shell-narrow">
        <h2
          ref={headRef}
          className="max-w-[50rem] font-display text-[clamp(2.125rem,3.6vw,4rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy"
        >
          Engineering insights that build better facades
        </h2>

        <div
          ref={gridRef}
          className="mt-[clamp(2.5rem,4vw,4.375rem)] grid grid-cols-1 gap-x-[clamp(2rem,4vw,5rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] lg:grid-cols-2"
        >
          {/* Featured article */}
          <Interactive as="article" data-card lift={-4} scale={1.004} className="min-w-0">
            <div className="group flex h-full min-w-0 flex-col">
              <div className="aspect-[16/11] w-full overflow-hidden">
                <img
                  {...IMAGES.thumbPatina}
                  alt="Slatted-ceiling interior opening to a pool and the ocean at dusk"
                  sizes="(min-width: 64rem) 46vw, 100vw"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="mt-[clamp(1.25rem,1.8vw,1.75rem)] flex min-w-0 flex-col">
                <Meta
                  category="Architecture / Performance"
                  date="28 Aug 2026 · 6 min read"
                  iso="2026-08-28"
                />
                <h3 className="mt-[clamp(0.75rem,1.2vw,1.125rem)] max-w-[30ch] font-display text-[clamp(1.5rem,2.5vw,2.75rem)] leading-[1.14] font-medium tracking-tight text-balance text-navy">
                  Designing Aluminium Systems for Performance, Not Just Appearance
                </h3>
                <p className="mt-[clamp(0.875rem,1.4vw,1.25rem)] max-w-[46ch] font-body text-[clamp(0.875rem,1vw,1rem)] leading-relaxed text-slate">
                  From thermal breaking to wind load resistance, the true value of an architectural
                  envelope lies in its invisible engineering.
                </p>
                <a
                  href="#insights"
                  className="group mt-[clamp(1.25rem,2vw,1.875rem)] inline-flex min-h-11 w-fit items-center"
                >
                  <ReadArticle />
                </a>
              </div>
            </div>
          </Interactive>

          {/* Compact rows */}
          <div className="flex min-w-0 flex-col">
            {ROWS.map((row, index) => (
              <Interactive
                as="article"
                key={row.title}
                data-card
                lift={-3}
                scale={1.004}
                className={
                  "min-w-0 py-[clamp(1.25rem,2vw,1.75rem)] " +
                  (index > 0 ? "border-t border-navy/15" : "lg:pt-0")
                }
              >
                <div className="group flex min-w-0 items-start justify-between gap-[clamp(1rem,2vw,2rem)]">
                  <div className="min-w-0 flex-1">
                    <Meta category={row.category} date={row.date} iso={row.iso} />
                    <h3 className="mt-[clamp(0.625rem,1vw,0.875rem)] max-w-[30ch] font-display text-[clamp(1.0625rem,1.35vw,1.5rem)] leading-[1.25] font-medium tracking-tight text-pretty text-navy">
                      {row.title}
                    </h3>
                    <a
                      href="#insights"
                      className="group mt-[clamp(0.875rem,1.4vw,1.25rem)] inline-flex min-h-11 w-fit items-center"
                    >
                      <ReadArticle />
                    </a>
                  </div>
                  <div className="w-[clamp(5.5rem,9vw,8.75rem)] shrink-0 overflow-hidden">
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        {...row.image}
                        alt={row.alt}
                        sizes="clamp(5.5rem, 9vw, 8.75rem)"
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                  </div>
                </div>
              </Interactive>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(2rem,3vw,2.875rem)] flex justify-center">
          <ViewMore href="#insights" />
        </div>
      </div>
    </section>
  );
}
