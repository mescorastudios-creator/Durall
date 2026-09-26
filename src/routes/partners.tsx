import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PartnersHero } from "@/components/durall/partners/PartnersHero";
import { InternationalNetwork } from "@/components/durall/partners/InternationalNetwork";
import { LeadingPractices } from "@/components/durall/partners/LeadingPractices";
import { PartnersClosing } from "@/components/durall/partners/PartnersClosing";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { seoHead } from "@/content/head";
import { fetchPartners } from "@/content/api";

export const Route = createFileRoute("/partners")({
  loader: () => fetchPartners(),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: Partners,
});

function Partners() {
  const { page, partners, practices } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PartnersHero content={page.hero} />
        <InternationalNetwork content={page.network} partners={partners} />
        <LeadingPractices content={page.practices} practices={practices} />
        <PartnersClosing content={page.closing} />
      </main>
      <DurallFooter />
    </div>
  );
}
