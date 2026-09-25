import { IMAGES, type ImageAsset } from "@/assets/images";

export type Article = {
  slug: string;
  category: string;
  date: string;
  iso: string;
  readingTime: string;
  title: string;
  excerpt: string;
  image: ImageAsset;
  alt: string;
  /** Section heading plus its paragraphs. */
  body: ReadonlyArray<{ heading: string; paragraphs: readonly string[] }>;
};

/* TODO — editorial review.
 *
 * The titles, categories, dates and standfirsts below are the ones already
 * published on the site. The article bodies are not: the site carried four
 * headlines whose "Read article" links pointed back at the section they sat
 * in, so there was never any body copy to move across.
 *
 * What is here is written to the claims the existing standfirsts already
 * make, in the voice of the rest of the site, and it is deliberately short.
 * Have whoever owns Durall's technical writing read it before launch — an
 * engineering claim is not ours to invent. */
export const ARTICLES: readonly Article[] = [
  {
    slug: "performance-not-appearance",
    category: "Architecture / Performance",
    date: "28 Aug 2026",
    iso: "2026-08-28",
    readingTime: "6 min read",
    title: "Designing Aluminium Systems for Performance, Not Just Appearance",
    excerpt:
      "From thermal breaking to wind load resistance, the true value of an architectural envelope lies in its invisible engineering.",
    image: IMAGES.cardPatina,
    alt: "Slatted-ceiling interior opening to a pool and the ocean at dusk",
    body: [
      {
        heading: "The envelope is a system, not a surface",
        paragraphs: [
          "A window is the only part of a building that has to be structure, weather barrier, thermal boundary, acoustic boundary and view at the same time. Every one of those roles pulls the detail in a different direction, and the sightline the architect drew is the one the reader will actually see.",
          "Treating the envelope as a finish — something selected late, from a catalogue — is what produces the compromises that show up three years in: the sill that ponds, the sash that binds in August, the reveal that had to grow 40mm on site.",
        ],
      },
      {
        heading: "What the drawing cannot tell you",
        paragraphs: [
          "Thermal breaking, gasket compression, drainage path and glazing bite are all invisible in elevation. They are also where the performance lives. A profile can carry the same face width as its competitor and behave nothing like it once the section is opened.",
          "We test the alternates before the workshop sees them, because the cost of a change is lowest while it is still a line on a drawing.",
        ],
      },
      {
        heading: "Designing to the load, not to the average",
        paragraphs: [
          "Wind load is not a single number. It varies across an elevation, concentrates at corners and parapets, and is at its most demanding exactly where architects most want a slender frame. Sizing the whole façade to its average is how a building ends up with mullions it did not need in the middle and a corner that deflects.",
          "The discipline is to engineer each condition on its own terms and then rationalise — not to rationalise first and check afterwards.",
        ],
      },
    ],
  },
  {
    slug: "precision-in-fabrication",
    category: "Fabrication",
    date: "12 Aug 2026",
    iso: "2026-08-12",
    readingTime: "5 min read",
    title: "Precision in Fabrication: Why Small Details Matter at Scale",
    excerpt:
      "A tolerance that reads as negligible on one frame becomes the difference between a clean elevation and a visibly uneven one across a hundred.",
    image: IMAGES.cardChiltron,
    alt: "Modern white house with large glazed openings",
    body: [
      {
        heading: "Tolerance accumulates",
        paragraphs: [
          "Half a millimetre is nothing on a single frame. Across a run of forty openings it is twenty millimetres of drift, and drift is what the eye picks up long before it can name what is wrong with an elevation.",
          "This is why the tolerance that matters is not the one on the shop drawing but the one the jig actually holds, on the fortieth unit, on a warm afternoon.",
        ],
      },
      {
        heading: "One chain of custody",
        paragraphs: [
          "Fabrication split across vendors means every interface is a place for a tolerance to be reset and an assumption to be lost. Keeping cutting, machining and assembly under one roof means a variance found at installation can be traced back to the operation that produced it.",
          "It also means the person who will stand in front of the finished elevation is the person answering for the jig.",
        ],
      },
      {
        heading: "Measured, not asserted",
        paragraphs: [
          "Every assembly leaves the workshop with its dimensions recorded rather than assumed. That record is what makes a site variance a question with an answer instead of an argument between trades.",
        ],
      },
    ],
  },
  {
    slug: "aluminium-for-modern-envelopes",
    category: "Materials",
    date: "04 Aug 2026",
    iso: "2026-08-04",
    readingTime: "4 min read",
    title: "Why Aluminium Is Becoming the Material of Choice for Modern Envelopes",
    excerpt:
      "Strength-to-weight, formability and a genuinely circular end of life are what put aluminium at the centre of contemporary façade design.",
    image: IMAGES.cardJuhu,
    alt: "Aerial view of a modern residence with a courtyard pool",
    body: [
      {
        heading: "Slenderness is a structural argument",
        paragraphs: [
          "The reason contemporary glazing can carry the sightlines it does is strength-to-weight. Aluminium lets a frame take the load of a large pane without growing to the section a weaker material would need, which is why the openings architects are drawing now were not buildable in the same way thirty years ago.",
        ],
      },
      {
        heading: "Extrusion allows the detail to be designed",
        paragraphs: [
          "Extrusion means the profile can be drawn for the job rather than selected around it. Thermal breaks, drainage paths and gasket races can all be placed where the detail needs them instead of where a standard section happens to put them.",
          "That is the difference between specifying a system and engineering one.",
        ],
      },
      {
        heading: "An end of life worth counting",
        paragraphs: [
          "Aluminium is recycled without losing its properties, and the recycled route uses a fraction of the energy of primary production. On a material that will outlast several refurbishments, that matters to a building's whole-life carbon in a way the installed figure alone does not show.",
        ],
      },
    ],
  },
  {
    slug: "thermal-performance-and-intent",
    category: "Engineering",
    date: "21 Jul 2026",
    iso: "2026-07-21",
    readingTime: "5 min read",
    title: "Thermal Performance Without Compromising Architectural Intent",
    excerpt:
      "Meeting a thermal target and keeping the sightline the architect drew are usually presented as a trade. They do not have to be.",
    image: IMAGES.cardRitz,
    alt: "Curved pool deck overlooking clear blue water",
    body: [
      {
        heading: "The trade is usually a symptom of sequence",
        paragraphs: [
          "Thermal performance becomes a fight with the elevation when it is checked late. Brought in at the point the system is selected, it is a constraint like any other — one that shapes the profile rather than thickening it after the fact.",
        ],
      },
      {
        heading: "Where the heat actually goes",
        paragraphs: [
          "Frame, glass and edge seal each have their own path, and the weakest of them sets the result. A high-specification unit in a frame with a poor break is an expensive way to arrive at an average number.",
          "Modelling the assembly rather than its parts is what makes the target reachable without adding face width.",
        ],
      },
      {
        heading: "Comfort is not the same as compliance",
        paragraphs: [
          "A façade can meet its figure and still be unpleasant to sit beside in February. Surface temperature, draught and radiant asymmetry are what the occupant registers, and they are worth designing to even when no regulation asks for them.",
        ],
      },
    ],
  },
];

export const FEATURED = ARTICLES[0]!;
export const REST = ARTICLES.slice(1);

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
