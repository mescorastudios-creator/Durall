import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, SORTS, type Category, type SortKey } from "@/components/durall/projects/data";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { ProjectsIntro } from "@/components/durall/projects/ProjectsIntro";
import { FeaturedProject } from "@/components/durall/projects/FeaturedProject";
import { ProjectGrid } from "@/components/durall/projects/ProjectGrid";
import { ProjectsCta } from "@/components/durall/projects/ProjectsCta";
import { DurallFooter } from "@/components/durall/DurallFooter";

const TITLE = "Projects — Durall Systems Portfolio of Built Work";
const DESCRIPTION =
  "Residences, resorts and landmarks where Durall’s aluminium systems became the architecture's most exacting details — from Parikrama in Murud to Patina in the Maldives.";

/* Filter and sort live in the URL so a filtered view can be linked, opened in
 * a new tab and restored by the back button — it used to be component state
 * only, so /projects always came back showing everything. Hand-rolled rather
 * than schema-validated: both values are closed sets, and anything else falls
 * back to the default instead of erroring the route. */
type ProjectsSearch = { category?: Category; sort?: SortKey };

export const Route = createFileRoute("/projects/")({
  // Both keys are optional and defaults are simply absent, so the unfiltered
  // view keeps a bare /projects URL rather than ?category=All&sort=featured.
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => {
    const category = String(search["category"] ?? "");
    const sort = String(search["sort"] ?? "");
    const validCategory =
      (CATEGORIES as readonly string[]).includes(category) && category !== "All";
    const validSort =
      (SORTS as readonly { key: string }[]).some((s) => s.key === sort) && sort !== "featured";
    return {
      ...(validCategory ? { category: category as Category } : {}),
      ...(validSort ? { sort: sort as SortKey } : {}),
    };
  },
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
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader variant="light" />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <ProjectsIntro />
        <FeaturedProject />
        <ProjectGrid />
        <ProjectsCta />
      </main>
      <DurallFooter />
    </div>
  );
}
