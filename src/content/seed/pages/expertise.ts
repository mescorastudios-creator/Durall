import type { ExpertisePage } from "../../types";

export const EXPERTISE_SEED: ExpertisePage = {
  seo: {
    title: "Expertise — Durall Systems",
    description:
      "Window, door and façade systems designed, engineered, fabricated and installed as one continuous discipline — and the five-stage process that gets them built.",
    image: null,
  },
  intro: {
    title: "Engineered before it is drawn.",
    lede: "Durall designs, engineers, fabricates and installs the envelope as one continuous discipline — so the detail an architect draws is the detail that reaches site.",
  },
  systems: {
    eyebrow: "What we make",
    heading: { text: "Four systems,", muted: "one discipline." },
    items: [
      {
        icon: "panels-top-left",
        title: "Window Systems",
        body: "Casement, sliding, tilt-turn and fixed lights, engineered to the opening rather than selected around it.",
      },
      {
        icon: "columns-3",
        title: "Door Systems",
        body: "Full-height sliding and pivot assemblies sized to the load they actually carry, not to an elevation average.",
      },
      {
        icon: "layers",
        title: "Façade Systems",
        body: "Curtain walling, screens and skylights detailed as one envelope with the openings they meet.",
      },
      {
        icon: "thermometer",
        title: "Technical Performance",
        body: "Thermal, acoustic, structural and weather performance modelled as an assembly before the workshop sees it.",
      },
    ],
  },
  cta: {
    eyebrow: "Start a project",
    heading: "Bring us in early.",
    body: "The cost of a change is lowest while it is still a line on a drawing. Talk to the engineer who will answer for the detail, not to a sales desk.",
    action: { label: "Talk to our team", href: "/contact" },
  },
};
