import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PhotoHero } from "@/components/durall/PhotoHero";
import { AboutPhilosophy } from "@/components/durall/about/AboutPhilosophy";
import { SystemSpec } from "@/components/durall/about/SystemSpec";
import { MeetsEngineering } from "@/components/durall/about/MeetsEngineering";
import { OurApproach } from "@/components/durall/about/OurApproach";
import { EnquiryBand } from "@/components/durall/EnquiryBand";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { seoHead } from "@/content/head";
import { fetchPage } from "@/content/api";

export const Route = createFileRoute("/about")({
  loader: () => fetchPage("about"),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: About,
});

function About() {
  const { page } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PhotoHero content={page.opening} wash={{ left: 1 }} />
        <OurApproach content={page.approach} />
        <AboutPhilosophy content={page.philosophy} />
        <SystemSpec content={page.spec} />
        <MeetsEngineering content={page.meets} />
        <EnquiryBand source="about" />
      </main>
      <DurallFooter />
    </div>
  );
}
