import { photo } from "../render";
import type { SharedContent } from "../types";

/** Sections that appear on more than one page: edited once, shown everywhere. */
export const SHARED_SEED: SharedContent = {
  // Home and Expertise.
  process: {
    heading: { text: "Concept to commissioning,", muted: "under one roof." },
    lede: "An integrated process that brings precision, accountability, and performance to every project.",
    stages: [
      {
        title: "Discover",
        body: "Site visit, brief, and intent — we read the architect's drawings before we read the BoQ.",
        photo: photo("stageDiscover", "Glass-walled terrace overlooking a lake at sunset"),
      },
      {
        title: "Design",
        body: "System selection, material strategy, and elevation studies. We draw alternates, not just options.",
        photo: photo("philosophyPavilion", "Dining pavilion framed by full-height sliding systems"),
      },
      {
        title: "Engineer",
        body: "Structural, thermal, acoustic, and weather performance — every detail load-tested before the workshop sees it.",
        photo: photo(
          "stageEngineer",
          "Interior with slatted ceiling and precise square light cutouts",
        ),
      },
      {
        title: "Fabricate",
        body: "In-house workshop discipline. Custom extrusions, jigged assemblies, and a single QC chain.",
        photo: photo(
          "stageFabricate",
          "Interior with wooden slat ceiling overlooking a pool at dusk",
        ),
      },
      {
        title: "Install",
        body: "Site supervision, sequencing, and handover — backed by a maintenance schedule we publish in writing.",
        photo: photo("stageInstall", "White modern balcony with glass railings"),
      },
    ],
    link: { label: "Explore our approach", href: "/about#approach" },
  },
  // About: the enquiry form on the frosted glass.
  enquiry: {
    eyebrow: "Start a Conversation",
    heading: "We’re here to\nhelp you build\nwhat’s next.",
    lede: "From concept to completion,\nour team is with you at\nevery step.",
    photo: photo("contactGlass", "A frosted glass pane in front of a contemporary house"),
    wallCaption: "Architecture\nstarts with\na conversation.",
    fields: {
      name: "Your name",
      email: "Your email",
      studio: "Studio / Company",
      // TODO: confirm these options.
      studioOptions: [
        "Architecture studio",
        "Interior design studio",
        "Developer",
        "Contractor",
        "Private client",
        "Other",
      ],
      projectType: "Project type",
      projectTypeOptions: [
        "Private residence",
        "Hospitality",
        "Commercial façade",
        "Institutional",
      ],
      message: "Tell us about your project",
    },
    submit: "Send Enquiry",
    sentHeading: "Thank you. Your enquiry is with us.",
    sentAgain: "Send Another Enquiry",
  },
};
