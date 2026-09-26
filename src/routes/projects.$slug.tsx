import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { DurallFooter } from "@/components/durall/DurallFooter";
import { PageCtaBand } from "@/components/durall/PageCta";
import { detailOf } from "@/components/durall/project/data";
import { ProjectHero } from "@/components/durall/project/ProjectHero";
import { ProjectGallery } from "@/components/durall/project/ProjectGallery";
import { NextProject } from "@/components/durall/project/NextProject";
import {
  ProjectExperience,
  ProjectOverview,
  ProjectScope,
  ProjectSystem,
} from "@/components/durall/project/ProjectStory";
import { fetchProject } from "@/content/api";
import { seoHead } from "@/content/head";

export const Route = createFileRoute("/projects/$slug")({
  // Resolved in the loader so an unknown project is a real 404, not an empty
  // page wearing the site's chrome.
  loader: async ({ params }) => {
    const data = await fetchProject({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) return {};
    return seoHead(
      { title: `${project.name} | Durall Systems`, description: project.description },
      { type: "article" },
    );
  },
  component: ProjectPage,
});

function ProjectPage() {
  const data = Route.useLoaderData();
  const project = detailOf(data.project);
  const labels = data.labels;

  return (
    <div className="relative bg-white font-body text-navy">
      <SiteHeader />
      {/* Keyed by project: moving from one project to the next keeps this
       * route mounted, and every entrance, split and gallery state below is
       * built once per mount — so each project gets a fresh one. */}
      <main key={project.slug} id="main" tabIndex={-1} className="scroll-mt-24">
        <ProjectHero project={project} labels={labels} />
        <ProjectOverview project={project} labels={labels} />
        <ProjectGallery project={project} labels={labels} />
        <ProjectScope project={project} labels={labels} />
        <ProjectSystem project={project} labels={labels} />
        <ProjectExperience project={project} labels={labels} />
        <NextProject next={detailOf(data.next)} labels={labels} />
        <PageCtaBand band={labels.cta} />
      </main>
      <DurallFooter />
    </div>
  );
}
