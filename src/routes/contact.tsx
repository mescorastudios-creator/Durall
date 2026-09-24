import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { ContactIntro } from "@/components/durall/contact/ContactIntro";
import { ContactBody } from "@/components/durall/contact/ContactBody";
import { DurallFooter } from "@/components/durall/DurallFooter";

const TITLE = "Contact Durall — Start a Conversation";
const DESCRIPTION =
  "Talk to Durall's engineering team about aluminium windows, doors, façades and architectural systems — send an enquiry or reach us directly.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="relative bg-white font-body text-navy">
      {/* Light, because this page opens on white rather than on a navy hero —
          the transparent variant would put white nav links on a white band. */}
      <SiteHeader variant="light" />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <ContactIntro />
        <ContactBody />
      </main>
      <DurallFooter />
    </div>
  );
}
