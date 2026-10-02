import { photo } from "../../render";
import type { HomePage } from "../../types";

export const HOME_SEED: HomePage = {
  seo: {
    title: "Durall — Engineering Spaces Without Boundaries",
    description:
      "Premium aluminium systems for windows, doors, façades and architectural applications — designed, engineered, fabricated and installed as one continuous discipline.",
    image: null,
  },
  hero: {
    // The opening film's first frame: what shows until the film is running.
    photo: photo(
      "heroFilm",
      "A living room at dusk, its full-height sliding glass open on both sides to a palm garden",
    ),
    heading: "Engineering spaces without boundaries.",
    body: "Premium aluminium systems for windows, doors, façades and architectural applications — engineered with the architects who design tomorrow’s landmarks.",
    primary: { label: "Explore Projects", href: "/projects" },
    secondary: { label: "Discover Durall", href: "#philosophy" },
  },
  philosophy: {
    heading: { text: "Luxury is never\napplied.", muted: "It is engineered." },
    paragraphs: [
      "Durall works alongside architects and developers long before a building becomes visible — coordinating design intent, engineering tolerance, and material performance into a single, precise envelope.",
      "Every threshold a building presents to the world — its windows, its skylights, its screens — is a system we design, engineer, fabricate and install as one continuous discipline.",
    ],
    link: { label: "How we work", href: "/expertise" },
    photo: photo(
      "philosophyPavilion",
      "Dining pavilion framed by full-height Durall sliding systems",
    ),
  },
  projects: {
    heading: "What we’ve\nbuilt together.",
    lede: "Selected residences and landmarks where Durall’s systems became the architecture’s most exacting details.",
  },
  insights: {
    heading: "Engineering insights that build better facades",
  },
};
