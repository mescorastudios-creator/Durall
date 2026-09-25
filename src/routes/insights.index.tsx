import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PageIntro } from "@/components/durall/PageIntro";
import { PageCta } from "@/components/durall/PageCta";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { Meta, ReadArticle } from "@/components/durall/Insights";
import { ARTICLES } from "@/components/durall/insights/data";
import { TRAVEL, useReveal } from "@/lib/anim";
import { Interactive } from "@/components/durall/ui";

const TITLE = "Insights — Durall Systems";
const DESCRIPTION =
  "Engineering notes on aluminium systems, fabrication tolerance, thermal performance and the details that decide how an envelope behaves.";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsIndex,
});

function ArticleIndex() {
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
        {ARTICLES.map((article) => (
          <Interactive as="li" key={article.slug} data-card lift={-5} scale={1.008}>
            <article className="group flex h-full min-w-0 flex-col">
              <div className="aspect-[16/11] w-full overflow-hidden">
                <img
                  {...article.image}
                  alt={article.alt}
                  sizes="(min-width: 64rem) 31vw, (min-width: 40rem) 46vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  className="media-zoom h-full w-full object-cover"
                />
              </div>
              <div className="mt-[clamp(1rem,1.6vw,1.5rem)] flex min-w-0 flex-1 flex-col">
                <Meta
                  category={article.category}
                  date={`${article.date} · ${article.readingTime}`}
                  iso={article.iso}
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
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader variant="light" />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PageIntro
          eyebrow="05 — Insights"
          title="Notes from the workshop floor."
          lede="What we learn detailing, fabricating and installing envelopes — written for the architects and engineers who have to live with the result."
        />
        <ArticleIndex />
        <PageCta
          eyebrow="Ask us directly"
          heading="A question these didn’t answer?"
          body="If there is a performance target, a detail or a tolerance you need a straight answer on, write to the engineering office rather than to a form."
          action="Ask an engineer"
        />
      </main>
      <DurallFooter />
    </div>
  );
}
