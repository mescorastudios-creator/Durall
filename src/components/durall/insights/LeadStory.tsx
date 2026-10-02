import { Link } from "@tanstack/react-router";
import { useClipReveal, useSectionIntro } from "@/lib/anim";
import { formatDate, lengthOf, type ArticleCard } from "@/content/select";
import type { InsightsPage } from "@/content/types";
import { FEATURED_CUT, Meta, ReadArticle } from "../Insights";
import { CardImage } from "./media";

/**
 * The newest (or pinned) article, given the room of a cover story: the
 * photograph with the site's cut corner on the wider side, the words set
 * against its lower edge. The whole plate is one link.
 */
export function LeadStory({ card, labels }: { card: ArticleCard; labels: InsightsPage["labels"] }) {
  const textRef = useSectionIntro<HTMLDivElement>();
  const mediaRef = useClipReveal<HTMLDivElement>();
  const film = card.format === "video";

  return (
    <section aria-label={card.title} className="bg-white pb-[clamp(4rem,8vw,8.5rem)]">
      <div className="shell">
        <article className="group relative grid grid-cols-1 items-end gap-[clamp(1.75rem,4.5vw,5rem)] rounded-none has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-8 has-[a:focus-visible]:outline-accent-blue lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div ref={mediaRef} className={`w-full overflow-hidden ${FEATURED_CUT}`}>
            <div data-clip-inner className="h-full w-full">
              <CardImage
                photo={card.cover}
                film={film}
                eager
                sizes="(min-width: 64rem) 58vw, 100vw"
                className="aspect-[3/2] w-full"
              />
            </div>
          </div>

          <div ref={textRef} className="min-w-0 lg:pb-[clamp(0.5rem,2vw,2rem)]">
            <div data-anim>
              <Meta
                format={film ? labels.film : labels.article}
                category={card.category}
                date={formatDate(card.publishedAt)}
                iso={card.publishedAt}
              />
            </div>
            <h2
              data-anim
              className="mt-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1.875rem,3.3vw,3.25rem)] leading-[1.08] font-medium tracking-section text-balance text-navy"
            >
              <Link
                to="/insights/$slug"
                params={{ slug: card.slug }}
                className="outline-none after:absolute after:inset-0"
              >
                {card.title}
              </Link>
            </h2>
            <p
              data-anim
              className="mt-[clamp(1rem,1.6vw,1.5rem)] max-w-[42ch] font-body text-[clamp(0.9375rem,1.05vw,1.0625rem)] leading-relaxed text-pretty text-slate"
            >
              {card.excerpt}
            </p>
            <div data-anim className="mt-[clamp(1.5rem,2.6vw,2.5rem)] flex items-center gap-5">
              <ReadArticle label={film ? labels.watch : labels.read} />
              {lengthOf(card) ? (
                <span className="font-body text-xs text-slate">{lengthOf(card)}</span>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
