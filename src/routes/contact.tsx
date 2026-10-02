import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { ContactIntro } from "@/components/durall/contact/ContactIntro";
import { ContactBody } from "@/components/durall/contact/ContactBody";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { seoHead } from "@/content/head";
import { fetchPage } from "@/content/api";
import { STYLE_URL } from "@/components/durall/contact/mapTheme";

export const Route = createFileRoute("/contact")({
  loader: () => fetchPage("contact"),
  head: ({ loaderData }) => ({
    ...seoHead(loaderData?.page.seo),
    // The map's style starts downloading while the page is still loading,
    // instead of waiting for the map library to arrive first (OfficeMap).
    links: [{ rel: "preload", as: "fetch", href: STYLE_URL, crossOrigin: "anonymous" as const }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { page } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <ContactIntro content={page.intro} />
        <ContactBody content={page} />
      </main>
      <DurallFooter />
    </div>
  );
}
