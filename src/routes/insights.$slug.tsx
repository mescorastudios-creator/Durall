import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { PageCtaBand } from "@/components/durall/PageCta";
import { ArrowLeft } from "@/components/durall/ui";
import { Meta, ReadArticle } from "@/components/durall/Insights";
import { CardImage, VideoPlayer } from "@/components/durall/insights/media";
import {
  Contents,
  ContentsDisclosure,
  Share,
  type ContentsEntry,
} from "@/components/durall/insights/ArticleRail";
import { useClipReveal, useReveal, useSectionIntro } from "@/lib/anim";
import { fetchArticle } from "@/content/api";
import { seoHead } from "@/content/head";
import { imageOf, RichText } from "@/content/render";
import { formatDate, lengthOf, topicKey, type ArticleCard } from "@/content/select";
import type { ArticleBlock, InsightsPage } from "@/content/types";

export const Route = createFileRoute("/insights/$slug")({
  // Resolved in the loader so an unknown slug is a 404 rather than a page
  // that renders its own chrome around nothing.
  loader: async ({ params }) => {
    const data = await fetchArticle({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return {};
    return seoHead(
      {
        title: `${article.title} — Durall Systems`,
        description: article.excerpt,
        image: article.cover,
      },
      {
        type: "article",
        extra: [{ property: "article:published_time", content: article.publishedAt }],
      },
    );
  },
  component: ArticlePage,
});

/* The text keeps a reading measure (about 70 characters); photographs,
 * films and pull quotes run wider, into the space the measure leaves. */
const MEASURE = "max-w-[39rem]";
const PARAGRAPH = `mt-[clamp(1rem,1.5vw,1.375rem)] ${MEASURE} font-body text-[clamp(1rem,1.1vw,1.0625rem)] leading-[1.75] text-pretty text-slate`;
const WIDE = "mt-[clamp(2rem,3.5vw,3.25rem)] mb-[clamp(0.75rem,1.5vw,1.25rem)] max-w-[60rem]";
const CAPTION = "mt-3 max-w-[39rem] font-body text-xs leading-relaxed text-slate";

/* Ids that other parts of the page already use. */
const TAKEN = new Set(["main", "contact", "all", "films-heading", "all-heading"]);

type Section = { id: string | null; heading: string | null; blocks: ArticleBlock[] };

/** Groups the body's blocks into sections, each opened by its heading and given an anchor. */
function sectionsOf(body: readonly ArticleBlock[]): Section[] {
  const sections: Section[] = [];
  const used = new Map<string, number>();
  for (const block of body) {
    if (block.type === "heading") {
      let base = topicKey(block.text) || "section";
      if (TAKEN.has(base)) base = `${base}-section`;
      const count = (used.get(base) ?? 0) + 1;
      used.set(base, count);
      sections.push({
        id: count > 1 ? `${base}-${count}` : base,
        heading: block.text,
        blocks: [],
      });
    } else if (sections.length) sections[sections.length - 1]!.blocks.push(block);
    else sections.push({ id: null, heading: null, blocks: [block] });
  }
  return sections;
}

function Block({ block, playLabel }: { block: ArticleBlock; playLabel: string }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p data-reveal className={PARAGRAPH}>
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul data-reveal className={`${PARAGRAPH} list-disc space-y-2 pl-5 marker:text-accent-blue`}>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "quote":
      // A pull quote: set larger and wider than the text around it.
      return (
        <blockquote
          data-reveal
          data-fx="words"
          className="my-[clamp(2rem,3.5vw,3.25rem)] max-w-[48rem] border-l-2 border-accent-blue pl-[clamp(1.25rem,2vw,2rem)] font-serif text-[clamp(1.375rem,2.2vw,2rem)] leading-[1.4] text-pretty text-navy"
        >
          <RichText text={block.text} />
        </blockquote>
      );
    case "image":
      return (
        <figure data-reveal className={WIDE}>
          <img
            draggable={false}
            {...imageOf(block.photo.image)}
            alt={block.photo.alt}
            sizes="(min-width: 64rem) 60rem, 100vw"
            loading="lazy"
            decoding="async"
            className="w-full"
          />
          {block.caption ? <figcaption className={CAPTION}>{block.caption}</figcaption> : null}
        </figure>
      );
    case "video":
      return (
        <figure data-reveal className={WIDE}>
          <VideoPlayer
            url={block.url}
            title={block.caption || playLabel}
            playLabel={playLabel}
            sizes="(min-width: 64rem) 60rem, 100vw"
          />
          {block.caption ? <figcaption className={CAPTION}>{block.caption}</figcaption> : null}
        </figure>
      );
    default:
      return null;
  }
}

function ArticleBody({ sections, playLabel }: { sections: Section[]; playLabel: string }) {
  const ref = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 16, stagger: 0.12 });

  return (
    <div ref={ref} className="min-w-0">
      {sections.map((section, index) => (
        <section
          key={section.id ?? index}
          id={section.id ?? undefined}
          className="mt-[clamp(2.75rem,4.5vw,4.5rem)] scroll-mt-[calc(var(--header-h)+1.5rem)] first:mt-0"
        >
          {section.heading ? (
            <h2
              data-reveal
              className={`${MEASURE} font-display text-[clamp(1.375rem,2vw,2rem)] leading-[1.2] font-medium tracking-tight text-balance text-navy`}
            >
              {section.heading}
            </h2>
          ) : null}
          {section.blocks.map((block, blockIndex) => (
            <Block key={blockIndex} block={block} playLabel={playLabel} />
          ))}
        </section>
      ))}
    </div>
  );
}

/**
 * The next article, given room, and the two after it as short rows: the
 * same pairing the home page uses, so the end of an article reads as the
 * start of the next rather than a list of leftovers.
 */
function MoreArticles({
  heading,
  rest,
  labels,
}: {
  heading: string;
  rest: readonly ArticleCard[];
  labels: InsightsPage["labels"];
}) {
  const headRef = useSectionIntro<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>({ selector: "[data-card]", y: 32, stagger: 0.12 });
  const [next, ...others] = rest;
  if (!next) return null;
  const nextFilm = next.format === "video";

  return (
    <section aria-labelledby="more-heading" className="bg-paper py-[clamp(4rem,7.5vw,7.5rem)]">
      <div className="shell">
        <div ref={headRef}>
          <h2
            id="more-heading"
            data-anim="lines"
            className="font-display text-[clamp(1.875rem,3.2vw,3rem)] leading-[1.1] font-medium tracking-section text-balance text-navy"
          >
            {heading}
          </h2>
        </div>
        <div
          ref={gridRef}
          className="mt-[clamp(2rem,3.5vw,3.5rem)] grid grid-cols-1 gap-x-[clamp(2rem,5vw,6rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] lg:grid-cols-12"
        >
          <article
            data-card
            className="group relative flex min-w-0 flex-col has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-8 has-[a:focus-visible]:outline-accent-blue lg:col-span-7"
          >
            <CardImage
              photo={next.cover}
              film={nextFilm}
              sizes="(min-width: 64rem) 55vw, 100vw"
              className="aspect-[16/10] w-full"
            />
            <div className="mt-[clamp(1rem,1.6vw,1.5rem)]">
              <Meta
                format={nextFilm ? labels.film : undefined}
                category={next.category}
                date={formatDate(next.publishedAt)}
                iso={next.publishedAt}
              />
            </div>
            <h3 className="mt-[clamp(0.625rem,1vw,0.875rem)] max-w-[30ch] font-display text-[clamp(1.375rem,2.2vw,2.25rem)] leading-[1.15] font-medium tracking-tight text-balance text-navy">
              <Link
                to="/insights/$slug"
                params={{ slug: next.slug }}
                className="outline-none after:absolute after:inset-0"
              >
                {next.title}
              </Link>
            </h3>
            {next.excerpt ? (
              <p className="mt-3 line-clamp-3 max-w-[48ch] font-body text-sm leading-relaxed text-pretty text-slate">
                {next.excerpt}
              </p>
            ) : null}
            <div className="mt-[clamp(1rem,1.6vw,1.5rem)] flex items-center gap-5">
              <ReadArticle label={nextFilm ? labels.watch : labels.read} />
              {lengthOf(next) ? (
                <span className="font-body text-xs text-slate">{lengthOf(next)}</span>
              ) : null}
            </div>
          </article>

          {others.length ? (
            <ul className="flex min-w-0 flex-col lg:col-span-5">
              {others.map((card, index) => {
                const film = card.format === "video";
                return (
                  <li
                    key={card.slug}
                    data-card
                    className={
                      index > 0
                        ? "border-t border-navy/12 pt-[clamp(1.5rem,2.2vw,2rem)]"
                        : "pb-[clamp(1.5rem,2.2vw,2rem)]"
                    }
                  >
                    <article className="group relative flex min-w-0 items-start gap-[clamp(1rem,2vw,1.75rem)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent-blue">
                      <div className="min-w-0 flex-1">
                        <Meta
                          format={film ? labels.film : undefined}
                          category={card.category}
                          date={formatDate(card.publishedAt)}
                          iso={card.publishedAt}
                        />
                        <h3 className="mt-2.5 font-display text-[clamp(1.0625rem,1.35vw,1.375rem)] leading-[1.25] font-medium tracking-tight text-pretty text-navy">
                          <Link
                            to="/insights/$slug"
                            params={{ slug: card.slug }}
                            className="outline-none after:absolute after:inset-0"
                          >
                            {card.title}
                          </Link>
                        </h3>
                        <div className="mt-3">
                          <ReadArticle label={film ? labels.watch : labels.read} />
                        </div>
                      </div>
                      <CardImage
                        photo={card.cover}
                        film={film}
                        sizes="8rem"
                        className="aspect-square w-[clamp(5.5rem,9vw,8rem)] shrink-0"
                      />
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ArticlePage() {
  const { article, more, page } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const headRef = useSectionIntro<HTMLDivElement>();
  const mediaRef = useClipReveal<HTMLDivElement>();
  const film = article.format === "video";
  const length = lengthOf(article);
  const sections = sectionsOf(article.body);
  const contents: ContentsEntry[] = sections.flatMap((section) =>
    section.id && section.heading ? [{ id: section.id, label: section.heading }] : [],
  );
  const shareLabels = {
    share: page.article.share,
    copyLink: page.article.copyLink,
    copied: page.article.copied,
  };

  return (
    // timeline-scope lets the progress line at the top follow the article
    // below it, though the two are not parent and child.
    <div className="relative bg-white font-body text-navy [timeline-scope:--article]">
      <div aria-hidden="true" className="read-progress" />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <article>
          <header className="bg-white pt-[max(calc(var(--header-h)+2rem),clamp(5.5rem,9vw,9.5rem))] pb-[clamp(1.5rem,3vw,2.5rem)]">
            <div ref={headRef} className="shell">
              <div data-anim>
                <Link
                  to="/insights"
                  className="group hover-lift inline-flex min-h-11 w-fit items-center gap-2 font-display text-[0.6875rem] font-bold tracking-eyebrow text-slate uppercase hover:text-navy"
                  style={{ "--lift-x": "-0.25rem", "--lift-y": "0" } as React.CSSProperties}
                >
                  <ArrowLeft className="h-3 w-3" />
                  {page.article.backLabel}
                </Link>
              </div>
              <div data-anim className="mt-[clamp(0.75rem,1.4vw,1.25rem)]">
                <Meta
                  format={film ? page.labels.film : undefined}
                  category={article.category}
                  date={
                    length
                      ? `${formatDate(article.publishedAt)} · ${length}`
                      : formatDate(article.publishedAt)
                  }
                  iso={article.publishedAt}
                />
              </div>
              <h1
                data-anim="lines"
                className="mt-[clamp(0.875rem,1.8vw,1.5rem)] max-w-[46rem] font-display text-[clamp(2rem,3.8vw,3.5rem)] leading-[1.08] font-medium tracking-section text-balance text-navy"
              >
                {article.title}
              </h1>
              <p
                data-anim
                className="mt-[clamp(1.25rem,2vw,2rem)] max-w-[38rem] font-serif text-[clamp(1.125rem,1.5vw,1.375rem)] leading-[1.55] text-pretty text-slate"
              >
                {article.excerpt}
              </p>
            </div>
          </header>

          <div className="shell">
            {film ? (
              // A film leads with its player, the cover as its poster.
              <VideoPlayer
                url={article.video.url}
                title={article.title}
                poster={article.cover}
                playLabel={page.labels.play}
                eager
              />
            ) : (
              <div ref={mediaRef} className="aspect-[16/8] w-full overflow-hidden">
                <div data-clip-inner className="h-full w-full">
                  <img
                    draggable={false}
                    {...imageOf(article.cover.image)}
                    alt={article.cover.alt}
                    sizes="100vw"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="shell grid grid-cols-1 gap-x-[clamp(2rem,5vw,6rem)] gap-y-[clamp(1.5rem,3vw,2.5rem)] pt-[clamp(2.5rem,5vw,5rem)] pb-[clamp(4rem,8vw,8rem)] [view-timeline-name:--article] lg:grid-cols-12">
            {/* Beside the text on wide screens: where you are, and a way to pass it on. */}
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-[calc(var(--header-h)+2rem)] grid max-h-[calc(100dvh-var(--header-h)-4rem)] gap-[clamp(2rem,3vw,2.75rem)] overflow-y-auto overscroll-contain pb-2">
                <Contents heading={page.article.contents} entries={contents} />
                <Share title={article.title} path={`/insights/${slug}`} labels={shareLabels} />
              </div>
            </aside>

            <div className="lg:hidden">
              <ContentsDisclosure heading={page.article.contents} entries={contents} />
            </div>

            <div className="min-w-0 lg:col-span-9">
              <ArticleBody sections={sections} playLabel={page.labels.play} />
              {/* Narrow screens: sharing once the reader has finished. */}
              <div className="mt-[clamp(3rem,6vw,4rem)] border-t border-navy/12 pt-6 lg:hidden">
                <Share title={article.title} path={`/insights/${slug}`} labels={shareLabels} />
              </div>
            </div>
          </div>
        </article>

        <MoreArticles heading={page.article.moreHeading} rest={more} labels={page.labels} />

        <PageCtaBand band={page.article.cta} />
      </main>
      <DurallFooter />
    </div>
  );
}
