import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PartnersHero } from "@/components/durall/partners/PartnersHero";
import { InternationalNetwork } from "@/components/durall/partners/InternationalNetwork";
import { LeadingPractices } from "@/components/durall/partners/LeadingPractices";
import { PartnersClosing } from "@/components/durall/partners/PartnersClosing";
import { DurallFooter } from "@/components/durall/DurallFooter";

const TITLE = "Partners & International Systems — Durall Systems";
const DESCRIPTION =
  "Durall Systems partners with specialists across Europe, Asia and the Americas — minimal windows, glass railings, security mesh, insect screens and indoor climate — delivered with local precision in India.";

export const Route = createFileRoute("/partners")({
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
  component: Partners,
});

function Partners() {
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PartnersHero />
        <InternationalNetwork />
        <LeadingPractices />
        <PartnersClosing />
      </main>
      <DurallFooter />
    </div>
  );
}
