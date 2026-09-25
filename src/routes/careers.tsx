import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PageCta } from "@/components/durall/PageCta";
import { CareersHero } from "@/components/durall/careers/CareersHero";
import { HandoverBand } from "@/components/durall/careers/HandoverBand";
import { WhyDurall } from "@/components/durall/careers/WhyDurall";
import { Openings } from "@/components/durall/careers/Openings";
import { APPLY_EMAIL } from "@/components/durall/careers/data";
import { DurallFooter } from "@/components/durall/DurallFooter";

const TITLE = "Careers — Durall Systems";
const DESCRIPTION =
  "Design, engineering, workshop and site roles at Durall Systems, and how to apply. We design, make and install building envelopes under one roof.";

export const Route = createFileRoute("/careers")({
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
  component: CareersPage,
});

function CareersPage() {
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader variant="light" />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <CareersHero />
        <HandoverBand />
        <WhyDurall />
        <Openings />
        <PageCta
          eyebrow="Open application"
          heading="No role that fits? Send your work anyway."
          body="We would rather hear from the right person a year early than not at all."
          action="Send your work"
          href={`mailto:${APPLY_EMAIL}`}
        />
      </main>
      <DurallFooter />
    </div>
  );
}
