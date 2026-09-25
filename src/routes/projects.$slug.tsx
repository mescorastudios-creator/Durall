import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { PageCta } from "@/components/durall/PageCta";
import { nextProject, projectBySlug } from "@/components/durall/project/data";
import { ProjectHero } from "@/components/durall/project/ProjectHero";
import { ProjectGallery } from "@/components/durall/project/ProjectGallery";
import { NextProject } from "@/components/durall/project/NextProject";
import {
  ProjectExperience,
  ProjectOverview,
  ProjectScope,
  ProjectSystem,
} from "@/components/durall/project/ProjectStory";

export const Route = createFileRoute("/projects/$slug")({
  // Resolved in the loader so an unknown project is a real 404, not an empty
  // page wearing the site's chrome.
  loader: ({ params }) => {
    const project = projectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) return {};
    const title = `${project.name} | Durall Systems`;
    return {
      meta: [
        { title },
        { name: "description", content: project.description },
        { property: "og:title", content: title },
        { property: "og:description", content: project.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();

  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader variant="dark" />
      {/* Keyed by project: moving from one project to the next keeps this
       * route mounted, and every entrance, split and gallery state below is
       * built once per mount — so each project gets a fresh one. */}
      <main key={project.slug} id="main" tabIndex={-1} className="scroll-mt-24">
        <ProjectHero project={project} />
        <ProjectOverview project={project} />
        <ProjectGallery project={project} />
        <ProjectScope project={project} />
        <ProjectSystem project={project} />
        <ProjectExperience project={project} />
        <NextProject next={nextProject(project.slug)} />
        <PageCta
          eyebrow="Built around the demands"
          heading="Built around the demands of architecture."
          body="From the first line on paper to the final fix on site, we bring the systems, engineering and execution together."
        />
      </main>
      <DurallFooter />
    </div>
  );
}
