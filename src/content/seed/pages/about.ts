import { photo } from "../../render";
import type { AboutPage } from "../../types";

export const ABOUT_SEED: AboutPage = {
  seo: {
    title: "About Durall — Engineering What Architecture Demands",
    description:
      "Durall brings architecture, engineering and precision fabrication together — coordinating systems, materials and specialist partners into aluminium envelopes built to endure.",
    image: null,
  },
  opening: {
    photo: photo("heroAbout", "Curved terrace and infinity pool facing the sea at sunset"),
    heading: "Engineering what\narchitecture\ndemands.",
    body: "Durall brings architecture, engineering and precision fabrication together to create aluminium systems shaped around the demands of each project.",
  },
  philosophy: {
    heading: "Luxury is never applied. It is engineered.",
    body: "Durall works alongside architects and developers long before a building becomes visible. Design intent, engineering tolerance and material performance are resolved together, before the first extrusion is cut.",
    emphasis: "The visible result is only the final expression of decisions made long before.",
    link: { label: "Our Approach", href: "#approach" },
    features: [
      {
        icon: "crosshair",
        title: "Precision",
        body: "Engineered tolerances ensure seamless performance.",
      },
      {
        icon: "layers",
        title: "Materiality",
        body: "Curated aluminium systems for strength, longevity and beauty.",
      },
      {
        icon: "shield-check",
        title: "Integrity",
        body: "Every connection is designed to last in real conditions.",
      },
    ],
    photo: photo("aboutVilla", "A contemporary villa wrapped in full-height Durall glazing"),
  },
  spec: {
    photo: photo("aboutProfile", "Cutaway of a Durall aluminium profile"),
    value: "16",
    unit: "MM",
    label: "Glass thickness",
    note: "Optimised for structural performance and acoustic comfort.",
    drawing: photo("aboutSectionDrawing", "Technical section drawing of the glazing system"),
    metrics: [
      { icon: "wind", label: "Air Tightness", value: "Class 4" },
      { icon: "droplet", label: "Water Tightness", value: "E1200" },
      { icon: "cpu", label: "Wind Load Resistance", value: "Up to 4.0 kPa" },
    ],
    captionLeft: "Profile / Material / Performance",
    captionRight: "D/S — Engineered to Endure",
  },
  meets: {
    heading: "Where architecture meets engineering.",
    paragraphs: [
      "Durall operates at the intersection of architectural intent and technical execution.",
      "We coordinate systems, materials and specialist partners to deliver solutions that perform as designed — beautifully, efficiently and for the long term.",
    ],
    photo: photo(
      "aboutLake",
      "An infinity terrace framed by Durall sliding systems above the water",
    ),
  },
  approach: {
    eyebrow: "Our Approach",
    heading: "Intelligence\nthat brings\nit all together.",
    body: "We don’t manufacture every component. We ensure the right systems, materials and expertise come together in perfect balance.",
    capabilities: [
      {
        icon: "network",
        title: "Architectural Intent",
        body: "Design vision and performance goals",
      },
      {
        icon: "share-2",
        title: "System Partners",
        body: "Carefully selected international partners",
      },
      {
        icon: "bar-chart-3",
        title: "Materials & Finishes",
        body: "Quality, durability and aesthetic fit",
      },
      {
        icon: "users",
        title: "Specialist Expertise",
        body: "Engineering, detailing and project coordination",
      },
    ],
    mark: photo("aboutDurallMark", "Durall Systems"),
    drawing: photo("aboutLineHouse", "Line drawing of a completed Durall-glazed pavilion"),
    outcomeTitle: "Architecture Realized",
    outcomeBody: "Seamless integration that performs beautifully and stands the test of time.",
  },
};
