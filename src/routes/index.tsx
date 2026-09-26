import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { Hero } from "@/components/durall/Hero";
import { Philosophy } from "@/components/durall/Philosophy";
import { Projects } from "@/components/durall/Projects";
import { Process } from "@/components/durall/Process";
import { Insights } from "@/components/durall/Insights";
import { Contact } from "@/components/durall/Contact";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { seoHead } from "@/content/head";
import { fetchHome } from "@/content/api";

export const Route = createFileRoute("/")({
  loader: () => fetchHome(),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: Index,
});

function Index() {
  const { page, cards, articles } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <Hero content={page.hero} />
        <Philosophy content={page.philosophy} />
        <Projects content={page.projects} cards={cards} />
        <Process />
        <Insights content={page.insights} articles={articles} />
        <Contact />
      </main>
      <DurallFooter />
    </div>
  );
}
