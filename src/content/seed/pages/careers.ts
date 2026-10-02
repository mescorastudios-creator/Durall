import { photo } from "../../render";
import type { CareersPage } from "../../types";

export const CAREERS_SEED: CareersPage = {
  seo: {
    title: "Careers — Durall Systems",
    description:
      "Engineering, workshop, site and project roles at Durall Systems, and how to apply. We design, make and install building envelopes under one roof.",
    image: null,
  },
  opening: {
    photo: photo(
      "heroCareers",
      "Living room of House of Secret Gardens at dusk, open to the terrace through a wide timber-framed opening",
    ),
    heading: "Build the part\npeople touch.",
    body: "We design, make and install building envelopes under one roof. These are the roles we’re hiring for now.",
    credit: "House of Secret Gardens, Ahmedabad · SPASM Design · Photo: Edmund Sumner",
    rolesLabel: "Open roles",
    viewRoles: "View open roles",
  },
  roles: {
    eyebrow: "Open roles",
    heading: "Current openings.",
    allRoles: "All roles",
    columns: { role: "Role", team: "Team", location: "Location", type: "Type" },
    applyLabel: "Apply",
    // The roles the site ships with are the design's samples (seed/careers.ts);
    // clear this once they are replaced with real postings.
    note: "Sample roles for layout — replace with live postings.",
    empty:
      "Nothing is open right now. We still read everything that comes in, so send your work to {email} and we will come back to you when a seat opens.",
  },
  open: {
    heading: "Don’t see your role?",
    body: "Send your work anyway — a drawing set, a detail or a site you’re proud of.",
    action: "Send your work",
    orWrite: "or write to",
  },
};
