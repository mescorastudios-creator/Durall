import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { AboutHero } from "@/components/durall/about/AboutHero";
import { AboutPhilosophy } from "@/components/durall/about/AboutPhilosophy";
import { SystemSpec } from "@/components/durall/about/SystemSpec";
import { MeetsEngineering } from "@/components/durall/about/MeetsEngineering";
import { OurApproach } from "@/components/durall/about/OurApproach";
import { Contact } from "@/components/durall/Contact";
import { DurallFooter } from "@/components/durall/DurallFooter";

const TITLE = "About Durall — Engineering What Architecture Demands";
const DESCRIPTION =
  "Durall brings architecture, engineering and precision fabrication together — coordinating systems, materials and specialist partners into aluminium envelopes built to endure.";

export const Route = createFileRoute("/about")({
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
  component: About,
});

function About() {
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <AboutHero />
        <AboutPhilosophy />
        <SystemSpec />
        <MeetsEngineering />
        <OurApproach />
        <Contact />
      </main>
      <DurallFooter />
    </div>
  );
}
