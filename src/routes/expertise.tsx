import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PhotoHero } from "@/components/durall/PhotoHero";
import { OurExpertise } from "@/components/durall/expertise/OurExpertise";
import { HowWeWork } from "@/components/durall/expertise/HowWeWork";
import { TrustedWith } from "@/components/durall/expertise/TrustedWith";
import { InTheDetail } from "@/components/durall/expertise/InTheDetail";
import { OpeningCta } from "@/components/durall/expertise/OpeningCta";
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
        <PhotoHero content={page.opening} wash={{ corners: true, left: 1 }} />
        <OurExpertise content={page.intro} />
        <HowWeWork content={page.process} />
        <TrustedWith content={page.trusted} />
        <InTheDetail content={page.detail} />
        <OpeningCta band={page.cta} />
      </main>
      <DurallFooter />
    </div>
  );
}
