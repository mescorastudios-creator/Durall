import { asset, photo } from "../../render";
import type { PartnersPage } from "../../types";

export const PARTNERS_PAGE_SEED: PartnersPage = {
  seo: {
    title: "Partners & International Systems — Durall Systems",
    description:
      "Durall Systems partners with specialists across Europe, Asia and the Americas — minimal windows, glass railings, security mesh, insect screens and indoor climate — delivered with local precision in India.",
    image: null,
  },
  hero: {
    photo: photo("heroParikrama", "Palm-framed Durall residence at dusk"),
    eyebrow: "01 — Partners",
    heading: "International expertise. Integrated locally.",
    body: "Durall Systems works with trusted international partners to bring world-class systems and specialist technologies to architectural projects in India. Our partnerships are built around precision, capability and the demands of each project.",
    cta: { label: "", href: "/contact" },
    caption: "D/S — Architectural Datum / 01",
    plates: [
      photo("aboutPlateLeft", "Facade detail of a Durall-glazed residence"),
      photo("aboutPlateRight", "Aerial view of the same residence within its palm canopy"),
    ],
    badge: "System Detail / 01",
  },
  network: {
    eyebrow: "International Systems",
    heading: "A network built around specialised systems.",
    body: "Our international partners expand Durall’s capabilities across windows, glass, mesh, shading, fenestration and other specialised systems.",
    map: asset("partnersWorldMap"),
    quote:
      "From minimal window systems to advanced mesh and climate solutions, our partners bring world-class innovation. Durall brings it together — with understanding, precision and local execution.",
  },
  practices: {
    eyebrow: "Architects & Design Practices",
    heading: "Trusted alongside leading practices.",
    lead: "Durall’s international experience is shaped through collaboration with visionary architects and designers across the globe.",
    note: "And also with all leading architects & interior designers on projects in India.",
    photo: photo("partnersVilla", "Rendered white residence with layered aluminium framed glazing"),
    tagline: "Collaboration beyond borders. Architecture without limits.",
  },
  closing: {
    eyebrow: "06 — Built around the demands",
    heading: "Built around the demands of architecture.",
    body: "From the first line on paper to the final fix on site, we bring the systems, engineering and execution together.",
    cta: { label: "Talk to our team", href: "/contact" },
  },
};
