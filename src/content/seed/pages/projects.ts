import type { ProjectsPage } from "../../types";

export const PROJECTS_PAGE_SEED: ProjectsPage = {
  seo: {
    title: "Projects — Durall Systems Portfolio of Built Work",
    description:
      "Residences, resorts and landmarks where Durall’s aluminium systems became the architecture's most exacting details — from Parikrama in Murud to Patina in the Maldives.",
    image: null,
  },
  intro: {
    title: "What we’ve built together.",
    lede: "A collection of spaces shaped through architecture, engineering and collaboration.",
  },
  featured: { exploreLabel: "Explore Project" },
  grid: { sort: "Sort", view: "View Project", empty: "No projects in this category yet." },
  cta: {
    eyebrow: "Start a project",
    heading: "Have a project in mind?",
    body: "Let’s build what comes next, together. Reach out to our engineering office to discuss system details, custom fabrications, and performance targets.",
    action: { label: "Talk to our team", href: "/contact" },
  },
  detail: {
    heroPrefix: "Project",
    info: "Project information",
    intro: "Introduction",
    gallery: "Project photography",
    plates: "plates",
    scope: "Durall’s scope",
    system: "The system",
    experience: "The experience",
    next: "Next project",
    cta: {
      eyebrow: "Built around the demands",
      heading: "Built around the demands of architecture.",
      body: "From the first line on paper to the final fix on site, we bring the systems, engineering and execution together.",
      action: { label: "Talk to our team", href: "/contact" },
    },
  },
};
