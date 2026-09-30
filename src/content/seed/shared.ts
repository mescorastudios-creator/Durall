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
  // Home, About, Partners and Expertise: "Let's frame the view."
  enquiryBand: {
    heading: "Let’s frame the view.",
    lede: "Tell us about the project — we’ll take it from there.",
    fields: {
      name: { label: "Name", placeholder: "Your full name…" },
      email: { label: "Email", placeholder: "you@studio.com…" },
      phone: { label: "Phone", placeholder: "+91…" },
      location: { label: "Project Location", placeholder: "City…" },
      message: {
        label: "About the Project",
        placeholder: "Openings, sizes, the view you want to keep…",
      },
    },
    submit: "Send Enquiry",
    sending: "Sending…",
    sentHeading: "Thank you — your enquiry is with us.",
    sentAgain: "Send Another Enquiry",
    writeTo: "Or write to",
    viewProject: "View Project",
  },
};
