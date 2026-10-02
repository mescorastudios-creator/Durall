import { Link } from "@tanstack/react-router";
import { TRAVEL, useReveal, useSectionIntro } from "@/lib/anim";
import { formatDate, lengthOf, topicKey, topicsOf, type ArticleCard } from "@/content/select";
import type { InsightsPage } from "@/content/types";
import { Meta, ReadArticle } from "../Insights";
import { CardImage } from "./media";

export type InsightsFilter = {
  topic?: string | undefined;
  format?: "article" | "video" | undefined;
};

/** The search for a filter, keeping whichever of the two is not changing. */
function searchFor(filter: InsightsFilter): InsightsFilter {
  return {
    ...(filter.topic ? { topic: filter.topic } : {}),
    ...(filter.format ? { format: filter.format } : {}),
  };
}

const CHIP =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 font-body text-sm whitespace-nowrap transition-colors duration-[var(--dur-short)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue";

function Chip({
  active,
  search,
  children,
  count,
}: {
  active: boolean;
  search: InsightsFilter;
  children: string;
  count?: number;
}) {
  return (
    <Link
      to="/insights"
      search={search}
      replace
      resetScroll={false}
      // Exact, or the router counts "no filter" as matching every filtered view.
      activeOptions={{ exact: true }}
      aria-current={active ? "true" : undefined}
      className={`${CHIP} ${active ? "bg-navy text-white" : "bg-mist text-navy hover:bg-navy/10"}`}
    >
      {children}
      {count !== undefined ? (
        <span className={active ? "text-white/60" : "text-slate"}>{count}</span>
      ) : null}
    </Link>
  );
}

/* Column widths alternate row by row (wide + narrow, then narrow + wide),
 * and the narrow card sits lower, so the list reads as a spread rather than
 * a wall of equal tiles. One column below md. */
function placement(index: number) {
  const wide = index % 4 === 0 || index % 4 === 3;
  return wide ? "md:col-span-7" : "md:col-span-5 md:mt-[clamp(3rem,7vw,7.5rem)]";
}

function IndexCard({ card, labels }: { card: ArticleCard; labels: InsightsPage["labels"] }) {
  const film = card.format === "video";
  const length = lengthOf(card);
  return (
    <article className="group relative flex min-w-0 flex-col has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-8 has-[a:focus-visible]:outline-accent-blue">
      <CardImage
        photo={card.cover}
        film={film}
        sizes="(min-width: 48rem) 56vw, 100vw"
        className="aspect-[4/3] w-full"
      />
      <div className="mt-[clamp(1rem,1.6vw,1.5rem)]">
        <Meta
          format={film ? labels.film : undefined}
          category={card.category}
          date={formatDate(card.publishedAt)}
          iso={card.publishedAt}
        />
      </div>
      <h3 className="mt-[clamp(0.625rem,1vw,0.875rem)] max-w-[32ch] font-display text-[clamp(1.25rem,1.75vw,1.75rem)] leading-[1.2] font-medium tracking-tight text-pretty text-navy">
        <Link
          to="/insights/$slug"
          params={{ slug: card.slug }}
          className="outline-none after:absolute after:inset-0"
        >
          {card.title}
        </Link>
      </h3>
      {card.excerpt ? (
        <p className="mt-3 line-clamp-3 max-w-[52ch] font-body text-sm leading-relaxed text-pretty text-slate">
          {card.excerpt}
        </p>
      ) : null}
      <div className="mt-[clamp(1rem,1.6vw,1.5rem)] flex items-center gap-5">
        <ReadArticle label={film ? labels.watch : labels.read} />
        {length ? <span className="font-body text-xs text-slate">{length}</span> : null}
      </div>
    </article>
  );
}

function Grid({
  cards,
  labels,
}: {
  cards: readonly ArticleCard[];
  labels: InsightsPage["labels"];
}) {
  const ref = useReveal<HTMLUListElement>({
    selector: "[data-card]",
    y: TRAVEL.lg,
    stagger: 0.1,
    start: "clamp(top 94%)",
    end: "clamp(top 45%)",
    scrub: 0.8,
  });
  return (
    <ul
      ref={ref}
      className="mt-[clamp(2.5rem,4.5vw,4.5rem)] grid grid-cols-1 items-start gap-x-[clamp(2rem,5vw,6rem)] gap-y-[clamp(3rem,6vw,6rem)] md:grid-cols-12"
    >
      {cards.map((card, index) => (
        <li key={card.slug} data-card className={`min-w-0 ${placement(index)}`}>
          {/* The narrow cards travel a little against the wide ones beside
              them (ScrollFx, from `lg`). */}
          <div
            {...(index % 4 === 1 || index % 4 === 2
              ? { "data-fx": "drift", "data-fx-by": 28 }
              : {})}
          >
            <IndexCard card={card} labels={labels} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Everything published, filterable by topic and, once there are films, by
 * format. The filters are links: each view has its own address, works
 * without JavaScript, and can be shared. With no filter set, the lead story
 * above is left out so it does not appear twice in a row.
 */
export function InsightIndex({
  cards,
  leadSlug,
  filter,
  content,
  labels,
}: {
  cards: readonly ArticleCard[];
  leadSlug: string | undefined;
  filter: InsightsFilter;
  content: InsightsPage["index"];
  labels: InsightsPage["labels"];
}) {
  const headRef = useSectionIntro<HTMLDivElement>();
  const topics = topicsOf(cards);
  const hasFilms = cards.some((card) => card.format === "video");
  const hasArticles = cards.some((card) => card.format !== "video");
  const filtered = Boolean(filter.topic || filter.format);
  const shown = cards.filter(
    (card) =>
      (!filter.topic || topicKey(card.category) === filter.topic) &&
      (!filter.format || card.format === filter.format) &&
      (filtered || card.slug !== leadSlug),
  );

  // Nothing beyond the lead story yet: no list to show under it.
  if (!cards.length || (!filtered && !shown.length)) return null;

  return (
    <section
      id="all"
      aria-labelledby="all-heading"
      className="scroll-mt-[calc(var(--header-h)+1rem)] bg-white py-[clamp(4rem,8vw,8.5rem)]"
    >
      <div className="shell">
        <div ref={headRef}>
          <h2
            id="all-heading"
            data-anim="lines"
            className="max-w-[20ch] font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] font-medium tracking-section text-balance text-navy"
          >
            {content.heading}
          </h2>
        </div>

        {topics.length > 1 || (hasFilms && hasArticles) ? (
          <nav
            aria-label="Filter insights"
            className="mt-[clamp(1.75rem,3vw,2.75rem)] flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
          >
            {topics.length > 1 ? (
              <ul className="-mx-[clamp(1.25rem,3.75vw,4.5rem)] flex gap-2 overflow-x-auto overscroll-x-contain px-[clamp(1.25rem,3.75vw,4.5rem)] pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
                <li>
                  <Chip active={!filter.topic} search={searchFor({ format: filter.format })}>
                    {content.allTopics}
                  </Chip>
                </li>
                {topics.map((topic) => (
                  <li key={topic.key}>
                    <Chip
                      active={filter.topic === topic.key}
                      search={searchFor({ topic: topic.key, format: filter.format })}
                      count={topic.count}
                    >
                      {topic.label}
                    </Chip>
                  </li>
                ))}
              </ul>
            ) : (
              <span />
            )}
            {hasFilms && hasArticles ? (
              <ul className="flex w-fit shrink-0 gap-1 rounded-full bg-mist p-1">
                {(
                  [
                    [undefined, content.allFormats],
                    ["article", content.articles],
                    ["video", content.films],
                  ] as const
                ).map(([format, label]) => (
                  <li key={label}>
                    <Link
                      to="/insights"
                      search={searchFor({ topic: filter.topic, format })}
                      replace
                      resetScroll={false}
                      activeOptions={{ exact: true }}
                      aria-current={filter.format === format ? "true" : undefined}
                      className={`${CHIP} px-4 ${filter.format === format ? "bg-white text-navy shadow-[0_1px_3px_rgb(5_8_52/0.12)]" : "text-slate hover:text-navy"}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </nav>
        ) : null}

        {shown.length ? (
          // Keyed by the filter so the reveal starts over for the new set.
          <Grid
            key={`${filter.topic ?? ""}|${filter.format ?? ""}`}
            cards={shown}
            labels={labels}
          />
        ) : filtered ? (
          <div className="mt-[clamp(2.5rem,4.5vw,4.5rem)] flex flex-col items-start gap-5 border-t border-navy/10 pt-[clamp(2rem,3.5vw,3rem)]">
            <p className="max-w-[40ch] font-display text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug text-navy">
              {content.empty}
            </p>
            <Link
              to="/insights"
              search={{}}
              replace
              resetScroll={false}
              activeOptions={{ exact: true }}
              className={`${CHIP} bg-navy text-white hover:bg-[#0b1152]`}
            >
              {content.showAll}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
