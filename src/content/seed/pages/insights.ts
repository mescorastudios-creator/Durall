import type { InsightsPage } from "../../types";

export const INSIGHTS_SEED: InsightsPage = {
  seo: {
    title: "Insights — Durall Systems",
    description:
      "Engineering notes on aluminium systems, fabrication tolerance, thermal performance and the details that decide how an envelope behaves.",
    image: null,
  },
  intro: {
    title: "Notes from the workshop floor.",
    lede: "What we learn detailing, fabricating and installing envelopes — written for the architects and engineers who have to live with the result.",
  },
  cta: {
    eyebrow: "Ask us directly",
    heading: "A question these didn’t answer?",
    body: "If there is a performance target, a detail or a tolerance you need a straight answer on, write to the engineering office rather than to a form.",
    action: { label: "Ask an engineer", href: "/contact" },
  },
  article: {
    backLabel: "All insights",
    moreHeading: "More insights",
    cta: {
      eyebrow: "Start a project",
      heading: "Put this to work on your building.",
      body: "Every claim above came out of a real project. Tell us about yours and we’ll put you in front of the engineer who can answer it.",
      action: { label: "Talk to our team", href: "/contact" },
    },
  },
};
