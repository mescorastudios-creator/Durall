import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PhotoHero } from "@/components/durall/PhotoHero";
import { HeroRibbon } from "@/components/durall/expertise/HeroRibbon";
import { Statement } from "@/components/durall/expertise/Statement";
import { Anatomy } from "@/components/durall/expertise/Anatomy";
import { ProcessList } from "@/components/durall/expertise/ProcessList";
import { Performance } from "@/components/durall/expertise/Performance";
import { Architects } from "@/components/durall/expertise/Architects";
import { EnquiryBand } from "@/components/durall/EnquiryBand";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { seoHead } from "@/content/head";
import { fetchPage } from "@/content/api";

export const Route = createFileRoute("/expertise")({
  loader: () => fetchPage("expertise"),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: ExpertisePage,
});

function ExpertisePage() {
  const { page } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PhotoHero content={page.opening} wash={{ corners: true, left: 1 }}>
          <HeroRibbon content={page.opening} />
        </PhotoHero>
        <Statement content={page.statement} />
        <Anatomy content={page.anatomy} />
        <ProcessList eyebrow={page.process.eyebrow} />
        <Performance content={page.performance} />
        <Architects content={page.architects} />
        <EnquiryBand source="expertise" />
      </main>
      <DurallFooter />
    </div>
  );
}
