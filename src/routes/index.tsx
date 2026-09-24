import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { Hero } from "@/components/durall/Hero";
import { Philosophy } from "@/components/durall/Philosophy";
import { Projects } from "@/components/durall/Projects";
import { Process } from "@/components/durall/Process";
import { Insights } from "@/components/durall/Insights";
import { Contact } from "@/components/durall/Contact";
import { DurallFooter } from "@/components/durall/DurallFooter";

const TITLE = "Durall — Engineering Spaces Without Boundaries";
const DESCRIPTION =
  "Premium aluminium systems for windows, doors, façades and architectural applications — designed, engineered, fabricated and installed as one continuous discipline.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader variant="light" />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <Hero />
        <Philosophy />
        <Projects />
        <Process />
        <Insights />
        <Contact />
      </main>
      <DurallFooter />
    </div>
  );
}
