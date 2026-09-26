import { asset, photo } from "../../render";
import type { CareersPage } from "../../types";

export const CAREERS_SEED: CareersPage = {
  seo: {
    title: "Careers — Durall Systems",
    description:
      "Design, engineering, workshop and site roles at Durall Systems, and how to apply. We design, make and install building envelopes under one roof.",
    image: null,
  },
  hero: {
    heading: "Build the part people touch.",
    body: "People open, close and lean on a building’s envelope every day. We design, make and install it under one roof.",
    cta: { label: "View open roles", href: "#openings" },
    photo: photo(
      "projectBanyan",
      "Timber deck and frameless glass balustrade above the forest at Banyan Villa, Phuket",
    ),
  },
  band: {
    heading: "The person who drew the detail stands in front of it at handover.",
    image: asset("projectBangalore"),
  },
  why: {
    heading: "What working here is like.",
    reasons: [
      {
        title: "Days, not quarters",
        body: "Drawings are tested against jigs in the workshop and against buildings on site, so you find out what worked while it still matters.",
      },
      {
        title: "In the room early",
        body: "We sit with architects while the intent is still being set, not after the specification has been priced.",
      },
      {
        title: "Systems from abroad",
        body: "You will learn systems from our partners in Italy, Austria, Belgium and Switzerland, and work out how they meet Indian sites.",
      },
      {
        title: "Nothing over the fence",
        body: "Design, engineering, workshop and site are one team, so a problem stays with the people who can solve it.",
      },
    ],
  },
  openings: {
    heading: "Open roles",
    empty:
      "Nothing is open right now. We still read everything that comes in, so send your work to {email} and we will come back to you when a seat opens.",
    applyLabel: "Apply",
    howHeading: "How to apply",
    howBody:
      "Send the work, not a cover letter. A drawing set, a detail you are proud of or a problem you solved on site tells us more than a page of adjectives.",
  },
  cta: {
    eyebrow: "Open application",
    heading: "No role that fits? Send your work anyway.",
    body: "We would rather hear from the right person a year early than not at all.",
    // Empty: apply by email, to the careers address in Company & contact.
    action: { label: "Send your work", href: "" },
  },
};
