import { asset, photo } from "../../render";
import type { PartnersPage } from "../../types";

export const PARTNERS_PAGE_SEED: PartnersPage = {
  seo: {
    title: "Partners & International Systems — Durall Systems",
    description:
      "Durall Systems partners with specialists across Europe, Asia and the Americas — minimal windows, glass railings, security mesh, insect screens and indoor climate — delivered with local precision in India.",
    image: null,
  },
  opening: {
    photo: photo(
      "heroPartners",
      "Living room with a long clerestory window onto a garden, under a board-marked concrete wall",
    ),
    heading: "International expertise.\nIntegrated locally.",
    body: "Durall brings world-class systems from trusted international partners to architectural projects in India — specified, engineered and delivered by one team.",
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
};
