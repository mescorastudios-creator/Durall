import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, SORTS, type Category, type SortKey } from "@/content/categories";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { PhotoHero } from "@/components/durall/PhotoHero";
import { FeaturedProject } from "@/components/durall/projects/FeaturedProject";
import { ProjectGrid } from "@/components/durall/projects/ProjectGrid";
import { PageCtaBand } from "@/components/durall/PageCta";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { fetchProjects } from "@/content/api";
import { seoHead } from "@/content/head";

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
  loader: () => fetchProjects(),
  head: ({ loaderData }) => seoHead(loaderData?.page.seo),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { page, featured, portfolio } = Route.useLoaderData();
  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="scroll-mt-24">
        <PhotoHero content={page.opening} wash={{ corners: true, left: 0.25, top: true }} />
        {featured ? (
          <FeaturedProject
            slug={featured.slug}
            feature={featured.feature}
            exploreLabel={page.featured.exploreLabel}
          />
        ) : null}
        <ProjectGrid projects={portfolio} labels={page.grid} />
        <PageCtaBand band={page.cta} />
      </main>
      <DurallFooter />
    </div>
  );
}
