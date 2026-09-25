import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PageIntro } from "@/components/durall/PageIntro";
import { PageCta } from "@/components/durall/PageCta";
import { Systems } from "@/components/durall/expertise/Systems";
import { Process } from "@/components/durall/Process";
import { DurallFooter } from "@/components/durall/DurallFooter";

const TITLE = "Expertise — Durall Systems";
const DESCRIPTION =
  "Window, door and façade systems designed, engineered, fabricated and installed as one continuous discipline — and the five-stage process that gets them built.";

export const Route = createFileRoute("/expertise")({
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
  component: ExpertisePage,
});

/**
 * The nav's "Expertise" entry used to scroll to `/#process` — a section in
 * the middle of the home page, which no active state can describe and no
 * one can link to meaningfully. The section itself is the best thing on the
 * site, so this page opens around it rather than duplicating it.
 */
function ExpertisePage() {
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader variant="light" />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PageIntro
          eyebrow="03 — Expertise"
          title="Engineered before it is drawn."
          lede="Durall designs, engineers, fabricates and installs the envelope as one continuous discipline — so the detail an architect draws is the detail that reaches site."
        />
        <Systems />
        <Process />
        <PageCta
          heading="Bring us in early."
          body="The cost of a change is lowest while it is still a line on a drawing. Talk to the engineer who will answer for the detail, not to a sales desk."
        />
      </main>
      <DurallFooter />
    </div>
  );
}
