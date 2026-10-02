import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSectionIntro } from "@/lib/anim";
import { useReducedMotion } from "@/lib/motion-prefs";
import { formatDate, type ArticleCard } from "@/content/select";
import type { InsightsPage } from "@/content/types";
import { Meta } from "../Insights";
import { CardImage, PlayMark, VideoPlayer } from "./media";

/**
 * The films, watched here rather than on YouTube: one on the stage with its
 * notes beside it, the rest in a row underneath. Choosing one from the row
 * puts it on the stage and starts it, since that choice is already a press.
 */
export function FilmsBand({
  films,
  content,
  labels,
}: {
  films: readonly ArticleCard[];
  content: InsightsPage["films"];
  labels: InsightsPage["labels"];
}) {
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const headRef = useSectionIntro<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const film = films[current] ?? films[0]!;

  const choose = (index: number) => {
    setCurrent(index);
    setStarted(true);
    stageRef.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="films-heading" className="bg-paper py-[clamp(4rem,8vw,8.5rem)]">
      <div className="shell">
        <div ref={headRef} className="max-w-[40rem]">
          <h2
            id="films-heading"
            data-anim="lines"
            className="font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] font-medium tracking-section text-balance text-navy"
          >
            {content.heading}
          </h2>
          {content.lede ? (
            <p
              data-anim
              className="mt-[clamp(1rem,1.6vw,1.5rem)] max-w-[38rem] font-body text-[clamp(0.9375rem,1.05vw,1.0625rem)] leading-relaxed text-pretty text-slate"
            >
              {content.lede}
            </p>
          ) : null}
        </div>

        <div
          ref={stageRef}
          className="mt-[clamp(2rem,4vw,3.75rem)] grid scroll-mt-[calc(var(--header-h)+1rem)] grid-cols-1 gap-[clamp(1.5rem,3.2vw,3.5rem)] lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] lg:items-end"
        >
          <VideoPlayer
            key={film.slug}
            url={film.video.url}
            title={film.title}
            poster={film.cover}
            playLabel={labels.play}
            autoPlay={started}
            sizes="(min-width: 64rem) 64vw, 100vw"
          />
          <div aria-live="polite" className="min-w-0">
            <Meta
              format={labels.film}
              category={film.category}
              date={formatDate(film.publishedAt)}
              iso={film.publishedAt}
            />
            <h3 className="mt-[clamp(0.875rem,1.4vw,1.25rem)] font-display text-[clamp(1.375rem,2.1vw,2rem)] leading-[1.15] font-medium tracking-tight text-balance text-navy">
              {film.title}
            </h3>
            {film.excerpt ? (
              <p className="mt-[clamp(0.875rem,1.4vw,1.25rem)] line-clamp-5 max-w-[40ch] font-body text-sm leading-relaxed text-pretty text-slate">
                {film.excerpt}
              </p>
            ) : null}
            <div className="mt-[clamp(1.25rem,2.2vw,2rem)] flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                to="/insights/$slug"
                params={{ slug: film.slug }}
                className="group inline-flex min-h-11 items-center gap-2 font-display text-[clamp(0.6875rem,0.78vw,0.75rem)] font-medium tracking-button text-navy uppercase"
              >
                {content.notes}
                <span aria-hidden="true" className="hover-arrow">
                  →
                </span>
                <span className="sr-only">: {film.title}</span>
              </Link>
              {film.video.duration ? (
                <span className="font-body text-xs text-slate">{film.video.duration}</span>
              ) : null}
            </div>
          </div>
        </div>

        {films.length > 1 ? (
          <ul
            aria-label={content.heading}
            className="-mx-[clamp(1.25rem,3.75vw,4.5rem)] mt-[clamp(2rem,3.6vw,3.25rem)] flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,3.75vw,4.5rem)] gap-[clamp(1rem,2vw,1.75rem)] overflow-x-auto overscroll-x-contain px-[clamp(1.25rem,3.75vw,4.5rem)] pb-3 [scrollbar-width:thin]"
          >
            {films.map((item, index) => {
              const active = index === current;
              return (
                <li key={item.slug} className="w-[min(72vw,19rem)] shrink-0 snap-start">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(index)}
                    className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
                  >
                    <span
                      className={`relative block transition-[outline-color] duration-[var(--dur-short)] ${active ? "outline-2 outline-offset-4 outline-navy" : "outline-2 outline-offset-4 outline-transparent"}`}
                    >
                      <CardImage photo={item.cover} sizes="19rem" className="aspect-video w-full" />
                      {active ? null : (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <PlayMark size="sm" />
                        </span>
                      )}
                    </span>
                    <span className="mt-3 line-clamp-2 block font-display text-sm leading-snug font-medium text-navy">
                      {item.title}
                    </span>
                    {item.video.duration ? (
                      <span className="mt-1 block font-body text-xs text-slate">
                        {item.video.duration}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
