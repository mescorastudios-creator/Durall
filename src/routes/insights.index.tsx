import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PageIntro } from "@/components/durall/PageIntro";
import { PageCtaBand } from "@/components/durall/PageCta";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { LeadStory } from "@/components/durall/insights/LeadStory";
import { FilmsBand } from "@/components/durall/insights/FilmsBand";
import { InsightIndex, type InsightsFilter } from "@/components/durall/insights/InsightIndex";
import { fetchInsights } from "@/content/api";
import { seoHead } from "@/content/head";
import { hasImage } from "@/content/render";
import { embedOf } from "@/content/video";

export const Route = createFileRoute("/insights/")({
  // The filters live in the address (/insights?topic=fabrication&format=video)
  // so a filtered view can be shared and works without JavaScript.
  validateSearch: (search: Record<string, unknown>): InsightsFilter => ({
    ...(typeof search["topic"] === "string" && /^[a-z0-9-]{1,80}$/.test(search["topic"])
      ? { topic: search["topic"] }
      : {}),
    ...(search["format"] === "article" || search["format"] === "video"
      ? { format: search["format"] }
      : {}),
  }),
  loader: () => fetchInsights(),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: InsightsIndex,
});

function InsightsIndex() {
  const { page, articles } = Route.useLoaderData();
  const filter = Route.useSearch();
  // The cover story is the newest (or pinned) written piece with a
  // photograph to lead with; films have their own stage just below it.
  const written = articles.filter((card) => card.format !== "video");
  const lead = written.find((card) => hasImage(card.cover.image)) ?? written[0];
  const films = articles.filter((card) => card.format === "video" && embedOf(card.video.url));

  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PageIntro title={page.intro.title} lede={page.intro.lede} />
        {lead ? <LeadStory card={lead} labels={page.labels} /> : null}
        {films.length ? (
          <FilmsBand films={films} content={page.films} labels={page.labels} />
        ) : null}
        <InsightIndex
          cards={articles}
          leadSlug={lead?.slug}
          filter={filter}
          content={page.index}
          labels={page.labels}
        />
        <PageCtaBand band={page.cta} />
      </main>
      <DurallFooter />
    </div>
  );
}
