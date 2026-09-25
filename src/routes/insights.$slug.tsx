import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { PageCta } from "@/components/durall/PageCta";
import { ARTICLES, articleBySlug, type Article } from "@/components/durall/insights/data";
import { ArrowLeft, Interactive } from "@/components/durall/ui";
import { Meta, ReadArticle } from "@/components/durall/Insights";
import { useClipReveal, useReveal, useSectionIntro } from "@/lib/anim";

export const Route = createFileRoute("/insights/$slug")({
  // Resolved in the loader so an unknown slug is a 404 rather than a page
  // that renders its own chrome around nothing.
  loader: ({ params }) => {
    const article = articleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return {};
    const title = `${article.title} — Durall Systems`;
    return {
      meta: [
        { title },
        { name: "description", content: article.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: article.excerpt },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: article.iso },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ArticlePage,
});

function ArticleBody({ article }: { article: Article }) {
  const ref = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 16, stagger: 0.12 });

  return (
    <div ref={ref} className="min-w-0">
      {article.body.map((section) => (
        <section key={section.heading} className="mt-[clamp(2.25rem,3.5vw,3.5rem)] first:mt-0">
          <h2
            data-reveal
            className="font-display text-[clamp(1.25rem,1.8vw,1.75rem)] leading-[1.25] font-medium tracking-tight text-balance text-navy"
          >
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              data-reveal
              // 65–75 characters is the readable measure; at this size 34rem
              // lands inside it at every step of the clamp.
              className="mt-[clamp(1rem,1.5vw,1.375rem)] max-w-[34rem] font-body text-[clamp(1rem,1.1vw,1.0625rem)] leading-[1.75] text-pretty text-slate"
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

function MoreArticles({ current }: { current: string }) {
  const ref = useReveal<HTMLUListElement>({ selector: "[data-card]", y: 32, stagger: 0.12 });
  const rest = ARTICLES.filter((a) => a.slug !== current).slice(0, 3);

  return (
    <section className="bg-paper py-[clamp(3rem,6vw,6rem)]">
      <div className="shell">
        <h2 className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
          More insights
        </h2>
        <ul
          ref={ref}
          className="mt-[clamp(1.5rem,2.5vw,2.5rem)] grid grid-cols-1 gap-[clamp(1.75rem,3vw,2.5rem)] sm:grid-cols-3"
        >
          {rest.map((article) => (
            <Interactive as="li" key={article.slug} data-card lift={-4} scale={1.006}>
              <article className="group flex h-full min-w-0 flex-col border-t border-navy-14 pt-[clamp(1rem,1.6vw,1.25rem)]">
                <Meta category={article.category} date={article.date} iso={article.iso} />
                <h3 className="mt-2.5 font-display text-[clamp(1rem,1.3vw,1.25rem)] leading-[1.25] font-medium tracking-tight text-pretty text-navy">
                  {article.title}
                </h3>
                <Link
                  to="/insights/$slug"
                  params={{ slug: article.slug }}
                  className="mt-auto inline-flex min-h-11 w-fit items-center pt-4"
                >
                  <ReadArticle />
                  <span className="sr-only">: {article.title}</span>
                </Link>
              </article>
            </Interactive>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const headRef = useSectionIntro<HTMLDivElement>();
  const mediaRef = useClipReveal<HTMLDivElement>();

  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader variant="light" />
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
                  All insights
                </Link>
              </div>
              <div data-anim className="mt-[clamp(0.75rem,1.4vw,1.25rem)]">
                <Meta
                  category={article.category}
                  date={`${article.date} · ${article.readingTime}`}
                  iso={article.iso}
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
            <div ref={mediaRef} className="aspect-[16/8] w-full overflow-hidden">
              <div data-clip-inner className="h-full w-full">
                <img
                  {...article.image}
                  alt={article.alt}
                  sizes="100vw"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="shell grid grid-cols-1 gap-[clamp(2rem,4vw,3rem)] pt-[clamp(2.5rem,4.5vw,4.5rem)] pb-[clamp(3.5rem,7vw,7rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
            <p className="font-display text-[0.6875rem] leading-[2.1] font-medium tracking-eyebrow text-navy uppercase lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
              {article.category}
              <span aria-hidden="true" className="mt-4 block h-px w-8 bg-accent-blue" />
            </p>
            <ArticleBody article={article} />
          </div>
        </article>

        <MoreArticles current={article.slug} />

        <PageCta
          eyebrow="Start a project"
          heading="Put this to work on your building."
          body="Every claim above came out of a real project. Tell us about yours and we’ll put you in front of the engineer who can answer it."
        />
      </main>
      <DurallFooter />
    </div>
  );
}
