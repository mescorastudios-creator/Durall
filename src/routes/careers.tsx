import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PageCtaBand } from "@/components/durall/PageCta";
import { CareersHero } from "@/components/durall/careers/CareersHero";
import { HandoverBand } from "@/components/durall/careers/HandoverBand";
import { WhyDurall } from "@/components/durall/careers/WhyDurall";
import { Openings } from "@/components/durall/careers/Openings";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { seoHead } from "@/content/head";
import { fetchCareers } from "@/content/api";
import { useSite } from "@/content/site";

export const Route = createFileRoute("/careers")({
  loader: () => fetchCareers(),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: CareersPage,
});

function CareersPage() {
  const { page, roles } = Route.useLoaderData();
  const email = useSite().settings.contact.careersEmail;
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <CareersHero content={page.hero} />
        <HandoverBand content={page.band} />
        <WhyDurall content={page.why} />
        <Openings content={page.openings} roles={roles} email={email} />
        {/* An empty action link means "apply by email". */}
        <PageCtaBand
          band={{
            ...page.cta,
            action: { ...page.cta.action, href: page.cta.action.href || `mailto:${email}` },
          }}
        />
      </main>
      <DurallFooter />
    </div>
  );
}
