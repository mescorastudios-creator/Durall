import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PageIntro } from "@/components/durall/PageIntro";
import { PageCtaBand } from "@/components/durall/PageCta";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { Meta, ReadArticle } from "@/components/durall/Insights";
import { TRAVEL, useReveal } from "@/lib/anim";
import { Interactive } from "@/components/durall/ui";
import { fetchInsights } from "@/content/api";
import { seoHead } from "@/content/head";
import { imageOf } from "@/content/render";
import { formatDate, type ArticleCard } from "@/content/select";

export const Route = createFileRoute("/insights/")({
  loader: () => fetchInsights(),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: InsightsIndex,
});

function ArticleIndex({ articles }: { articles: readonly ArticleCard[] }) {
  const gridRef = useReveal<HTMLUListElement>({
    selector: "[data-card]",
    y: TRAVEL.lg,
    stagger: 0.12,
    start: "clamp(top 92%)",
    end: "clamp(top 35%)",
    scrub: 0.8,
  });

  return (
    <section className="bg-white pt-[clamp(1rem,2vw,2rem)] pb-[clamp(4rem,8vw,9rem)]">
      <ul
        ref={gridRef}
        className="shell grid grid-cols-1 gap-x-[clamp(2rem,3vw,3.5rem)] gap-y-[clamp(2.5rem,4vw,4rem)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {articles.map((article) => (
          <Interactive as="li" key={article.slug} data-card lift={-5} scale={1.008}>
            <article className="group flex h-full min-w-0 flex-col">
              <div className="aspect-[16/11] w-full overflow-hidden">
                <img
                  {...imageOf(article.cover.image)}
                  alt={article.cover.alt}
                  sizes="(min-width: 64rem) 31vw, (min-width: 40rem) 46vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  className="media-zoom h-full w-full object-cover"
                />
              </div>
              <div className="mt-[clamp(1rem,1.6vw,1.5rem)] flex min-w-0 flex-1 flex-col">
                <Meta
                  category={article.category}
                  date={`${formatDate(article.publishedAt)} · ${article.readingTime}`}
                  iso={article.publishedAt}
                />
                <h2 className="mt-[clamp(0.625rem,1vw,0.875rem)] font-display text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.22] font-medium tracking-tight text-pretty text-navy">
                  {article.title}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-pretty text-slate">
                  {article.excerpt}
                </p>
                <Link
                  to="/insights/$slug"
                  params={{ slug: article.slug }}
                  className="mt-auto inline-flex min-h-11 w-fit items-center pt-[clamp(0.875rem,1.4vw,1.25rem)]"
                >
                  <ReadArticle />
                  <span className="sr-only">: {article.title}</span>
                </Link>
              </div>
            </article>
          </Interactive>
        ))}
      </ul>
    </section>
  );
}

function InsightsIndex() {
  const { page, articles } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PageIntro title={page.intro.title} lede={page.intro.lede} />
        <ArticleIndex articles={articles} />
        <PageCtaBand band={page.cta} />
      </main>
      <DurallFooter />
    </div>
  );
}
