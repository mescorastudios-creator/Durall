import { IMAGES, type ImageAsset } from "@/assets/images";
import { PROJECTS, type Project } from "../projects/data";

/**
 * Project detail pages — one per project on the site.
 *
 * Parikrama is the only project with a written case study so far, brought
 * over from its own Lovable project. Every other project has a page built
 * from the same template with placeholder content (`placeholder: true`): its
 * own photograph, the facts already on file, plainly marked placeholder copy,
 * and Parikrama's photographs standing in for the rest, each labelled as a
 * placeholder. Replacing one is a matter of writing its entry out in full,
 * the way Parikrama's is — the route, the gallery and the next-project link
 * all read from this list.
 */

export type Photo = {
  image: ImageAsset;
  /** What the photograph shows, for screen readers. */
  alt: string;
};

export type Plate = Photo & {
  /** The longer caption shown under the photograph in the viewer. */
  caption: string;
};

export type ProjectDetail = {
  slug: string;
  /** True while the page is standing in for a case study not yet written. */
  placeholder?: boolean;
  /** The display title, one entry per line. */
  title: readonly string[];
  name: string;
  architect: string;
  location: string;
  description: string;
  /** The figure that rolls in on the hero, odometer-style. */
  figure?: { label: string; value: number; unit?: string };
  hero: Photo;
  /** The photograph used when another page offers this one as "next". */
  card?: Photo;
  facts: ReadonlyArray<readonly [label: string, value: string]>;
  intro: { heading: string; paragraphs: readonly string[] };
  plates: readonly Plate[];
  scope: Photo & {
    heading: string;
    paragraphs: readonly string[];
    facts: ReadonlyArray<readonly [label: string, value: string]>;
  };
  system: Photo & {
    title: readonly string[];
    body: string;
    points: readonly string[];
  };
  experience: Photo & { heading: string; body: string };
};

const PARIKRAMA: ProjectDetail = {
  slug: "parikrama-murud-house",
  title: ["Parikrama", "Murud House"],
  name: "Parikrama — Murud House",
  architect: "SPASM Design Architects",
  location: "Murud, Maharashtra",
  description:
    "Parikrama — Murud House by SPASM Design Architects: a house designed as a journey through stone, glass and landscape, with minimal glazing resolved by Durall Systems.",
  figure: { label: "Built area", value: 750, unit: "m²" },
  hero: {
    image: IMAGES.parikramaPalms,
    alt: "Parikrama, Murud House — the long dark elevation beneath coconut palms",
  },
  facts: [
    ["Project", "Parikrama — Murud House"],
    ["Architect", "SPASM Design Architects"],
    ["Location", "Murud, Maharashtra"],
    ["Area", "750 m²"],
    ["Completed", "2021"],
    ["Durall Role", "Window Consultant"],
    ["System", "PanoramAH! by Jofebar"],
    ["Recognition", "Architectural Hunter Award 2025"],
  ],
  intro: {
    heading: "A house designed as a journey.",
    paragraphs: [
      "Parikrama is organised around a continuous journey through living spaces, transitional zones and landscape, creating an architecture where movement and place remain in constant dialogue.",
      "Granite gives the house its weight; minimal glazing dissolves the threshold between interior and exterior. Shade, deep verandas and the mass of stone answer the coastal climate, so that the experience of the house is always tied to light, air and the land around it.",
    ],
  },
  plates: [
    {
      image: IMAGES.parikramaPavilion,
      alt: "The living pavilion under its cantilevered roof",
      caption: "The living pavilion — roof plane cantilevered over glass and stone",
    },
    {
      image: IMAGES.parikramaVeranda,
      alt: "The veranda with its stone floor and timber soffit",
      caption: "The veranda — stone floor, timber soffit, sliding glass pockets open",
    },
    {
      image: IMAGES.parikramaGarden,
      alt: "A view through the house to the garden",
      caption: "Looking through the house to the garden",
    },
    {
      image: IMAGES.parikramaGrove,
      alt: "The long elevation of the house in a coconut grove",
      caption: "The long elevation set within the coconut grove",
    },
    {
      image: IMAGES.parikramaBedroom,
      alt: "A bedroom opening onto the garden",
      caption: "The bedroom held against the garden",
    },
    {
      image: IMAGES.parikramaSteps,
      alt: "Steps and tropical planting along the veranda",
      caption: "Steps and planting along the veranda edge",
    },
    {
      image: IMAGES.parikramaDining,
      alt: "The dining pavilion open to the hills",
      caption: "The dining pavilion open to the hills",
    },
    {
      image: IMAGES.parikramaPalms,
      alt: "The house beneath the palms",
      caption: "The house beneath the palms, Murud",
    },
  ],
  scope: {
    image: IMAGES.parikramaVerandaOpen,
    alt: "The veranda with its sliding glass pockets fully open",
    heading: "Where the house opens, Durall enters.",
    paragraphs: [
      "The parikrama depends on thresholds that disappear — full-height openings where living spaces continue into veranda and grove.",
      "Durall Systems joined the project as window consultant, resolving the minimal glazing that allows stone, timber and landscape to read as one continuous space.",
    ],
    facts: [
      ["Role", "Window Consultant"],
      ["System", "PanoramAH! by Jofebar"],
    ],
  },
  system: {
    image: IMAGES.parikramaPavilionOpen,
    alt: "The living pavilion’s sliding glass panel open to the grove",
    title: ["PanoramAH!", "by Jofebar"],
    body: "A Swiss-patented, large-format minimal sliding window system. Durall Systems is a pioneer and market leader for PanoramAH! in the Asian subcontinent — with over one hundred prestigious projects for leading international architects.",
    points: [
      "Swiss-patented sliding window system",
      "Large-format minimal glazing",
      "Installed by Durall across the Asian subcontinent",
    ],
  },
  experience: {
    image: IMAGES.parikramaBedroomEvening,
    alt: "The bedroom against the garden in evening light",
    heading: "Stone, glass, landscape — and the light that moves through them.",
    body: "By day the house shades and breathes; by evening the glazing turns lantern-like against the grove. The apparent simplicity of the whole rests on precise technical resolution — the quiet work behind every opening.",
  },
};

/* ── Placeholders ─────────────────────────────────────────────────────── */

const TBC = "To be confirmed";
const PLACEHOLDER_ALT = "Placeholder photograph";
const PLACEHOLDER_CAPTION = "Placeholder photograph — to be replaced with this project’s own";

/** One of Parikrama's photographs, standing in and labelled as such. */
const standIn = (image: ImageAsset): Plate => ({
  image,
  alt: PLACEHOLDER_ALT,
  caption: PLACEHOLDER_CAPTION,
});

const STAND_INS = [
  IMAGES.parikramaPavilion,
  IMAGES.parikramaVeranda,
  IMAGES.parikramaGarden,
  IMAGES.parikramaGrove,
  IMAGES.parikramaBedroom,
  IMAGES.parikramaSteps,
  IMAGES.parikramaDining,
].map(standIn);

type Basics = Pick<Project, "slug" | "name" | "location" | "architect" | "categories" | "image"> & {
  year?: number;
  title?: readonly string[];
  /** Further photographs of this project, if any are on file. */
  extra?: readonly Photo[];
  card?: Photo;
};

function placeholderProject({
  slug,
  name,
  location,
  architect,
  categories,
  image,
  year,
  title,
  extra = [],
  card,
}: Basics): ProjectDetail {
  const typology = categories[0]?.toLowerCase() ?? "architectural";
  const own: Photo = { image, alt: `${name} — ${architect}, ${location}` };
  const ownPlates: Plate[] = [own, ...extra].map((photo) => ({
    ...photo,
    caption: `${name}, ${location}`,
  }));

  return {
    slug,
    placeholder: true,
    title: title ?? name.split(" "),
    name,
    architect,
    location,
    description: `${name} by ${architect}, ${location}. Case study in preparation.`,
    ...(year ? { figure: { label: "Completed", value: year } } : {}),
    hero: own,
    ...(card ? { card } : {}),
    facts: [
      ["Project", name],
      ["Architect", architect],
      ["Location", location],
      ["Typology", categories.join(" · ")],
      ["Completed", year ? String(year) : TBC],
      ["Area", TBC],
      ["Durall Role", TBC],
      ["System", TBC],
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        `Placeholder text. This is where the story of ${name} will be told — ${architect}’s ${typology} project in ${location}, and how it meets its site.`,
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    // Eight plates, like Parikrama's, so every layout reads as it will.
    plates: [...ownPlates, ...STAND_INS].slice(0, 8),
    scope: {
      ...own,
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        ["Role", TBC],
        ["System", TBC],
      ],
    },
    system: {
      image: IMAGES.parikramaPavilionOpen,
      alt: PLACEHOLDER_ALT,
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: IMAGES.parikramaBedroomEvening,
      alt: PLACEHOLDER_ALT,
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
  };
}

const portfolio = (slug: string) => {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`No portfolio project "${slug}"`);
  return project;
};

/** Sentosa's library wall came over with the Parikrama page, as its next card. */
const sentosaLibrary: Photo = {
  image: IMAGES.sentosaLibrary,
  alt: "The library wall at Sentosa House",
};

/** In reading order — each page's "next project" is the one after it. */
export const PROJECT_DETAILS: readonly ProjectDetail[] = [
  PARIKRAMA,
  placeholderProject({
    ...portfolio("sentosa-house"),
    extra: [sentosaLibrary],
    card: sentosaLibrary,
  }),
  placeholderProject(portfolio("patina")),
  placeholderProject(portfolio("chiltron-house")),
  placeholderProject(portfolio("juhu-house")),
  placeholderProject(portfolio("project-bangalore")),
  placeholderProject(portfolio("banyan-villa")),
  // On the home page only, so not in the portfolio list.
  placeholderProject({
    slug: "ritz-carlton-maldives",
    name: "Ritz-Carlton, Maldives",
    title: ["Ritz-Carlton", "Maldives"],
    location: "Maldives",
    architect: "Kerry Hill Architects",
    categories: ["Hospitality", "International"],
    image: IMAGES.projectRitz,
  }),
];

export function projectBySlug(slug: string) {
  return PROJECT_DETAILS.find((project) => project.slug === slug);
}

/** The project after this one, wrapping round to the first. */
export function nextProject(slug: string): ProjectDetail {
  const index = PROJECT_DETAILS.findIndex((project) => project.slug === slug);
  return PROJECT_DETAILS[(index + 1) % PROJECT_DETAILS.length]!;
}

export const PARIKRAMA_SLUG = "parikrama-murud-house";
