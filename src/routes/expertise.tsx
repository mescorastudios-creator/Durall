import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PageIntro } from "@/components/durall/PageIntro";
import { PageCtaBand } from "@/components/durall/PageCta";
import { Systems } from "@/components/durall/expertise/Systems";
import { Process } from "@/components/durall/Process";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { seoHead } from "@/content/head";
import { fetchPage } from "@/content/api";

export const Route = createFileRoute("/expertise")({
  loader: () => fetchPage("expertise"),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: ExpertisePage,
});

/**
 * The nav's "Expertise" entry used to scroll to `/#process` — a section in
 * the middle of the home page, which no active state can describe and no
 * one can link to meaningfully. The section itself is the best thing on the
 * site, so this page opens around it rather than duplicating it.
 */
function ExpertisePage() {
  const { page } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PageIntro title={page.intro.title} lede={page.intro.lede} />
        <Systems content={page.systems} />
        <Process />
        <PageCtaBand band={page.cta} />
      </main>
      <DurallFooter />
    </div>
  );
}
