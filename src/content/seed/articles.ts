import type { ArticleDoc } from "../types";

/* TODO — editorial review: the article bodies were written for the launch
 * and have not been read by Durall's technical team. */
export const ARTICLES_SEED: ArticleDoc[] = [
  {
    id: "article-performance-not-appearance",
    slug: "performance-not-appearance",
    status: "published",
    pinned: false,
    format: "article",
    video: { url: "", duration: "" },
    category: "Architecture / Performance",
    publishedAt: "2026-08-28",
    readingTime: "6 min read",
    title: "Designing Aluminium Systems for Performance, Not Just Appearance",
    excerpt:
      "From thermal breaking to wind load resistance, the true value of an architectural envelope lies in its invisible engineering.",
    cover: {
      image: {
        kind: "asset",
        key: "cardPatina",
      },
      alt: "Slatted-ceiling interior opening to a pool and the ocean at dusk",
    },
    body: [
      {
        type: "heading",
        text: "The envelope is a system, not a surface",
      },
      {
        type: "paragraph",
        text: "A window is the only part of a building that has to be structure, weather barrier, thermal boundary, acoustic boundary and view at the same time. Every one of those roles pulls the detail in a different direction, and the sightline the architect drew is the one the reader will actually see.",
      },
      {
        type: "paragraph",
        text: "Treating the envelope as a finish — something selected late, from a catalogue — is what produces the compromises that show up three years in: the sill that ponds, the sash that binds in August, the reveal that had to grow 40mm on site.",
      },
      {
        type: "heading",
        text: "What the drawing cannot tell you",
      },
      {
        type: "paragraph",
        text: "Thermal breaking, gasket compression, drainage path and glazing bite are all invisible in elevation. They are also where the performance lives. A profile can carry the same face width as its competitor and behave nothing like it once the section is opened.",
      },
      {
        type: "paragraph",
        text: "We test the alternates before the workshop sees them, because the cost of a change is lowest while it is still a line on a drawing.",
      },
      {
        type: "heading",
        text: "Designing to the load, not to the average",
      },
      {
        type: "paragraph",
        text: "Wind load is not a single number. It varies across an elevation, concentrates at corners and parapets, and is at its most demanding exactly where architects most want a slender frame. Sizing the whole façade to its average is how a building ends up with mullions it did not need in the middle and a corner that deflects.",
      },
      {
        type: "paragraph",
        text: "The discipline is to engineer each condition on its own terms and then rationalise — not to rationalise first and check afterwards.",
      },
    ],
  },
  {
    id: "article-precision-in-fabrication",
    slug: "precision-in-fabrication",
    status: "published",
    pinned: false,
    format: "article",
    video: { url: "", duration: "" },
    category: "Fabrication",
    publishedAt: "2026-08-12",
    readingTime: "5 min read",
    title: "Precision in Fabrication: Why Small Details Matter at Scale",
    excerpt:
      "A tolerance that reads as negligible on one frame becomes the difference between a clean elevation and a visibly uneven one across a hundred.",
    cover: {
      image: {
        kind: "asset",
        key: "cardChiltron",
      },
      alt: "Modern white house with large glazed openings",
    },
    body: [
      {
        type: "heading",
        text: "Tolerance accumulates",
      },
      {
        type: "paragraph",
        text: "Half a millimetre is nothing on a single frame. Across a run of forty openings it is twenty millimetres of drift, and drift is what the eye picks up long before it can name what is wrong with an elevation.",
      },
      {
        type: "paragraph",
        text: "This is why the tolerance that matters is not the one on the shop drawing but the one the jig actually holds, on the fortieth unit, on a warm afternoon.",
      },
      {
        type: "heading",
        text: "One chain of custody",
      },
      {
        type: "paragraph",
        text: "Fabrication split across vendors means every interface is a place for a tolerance to be reset and an assumption to be lost. Keeping cutting, machining and assembly under one roof means a variance found at installation can be traced back to the operation that produced it.",
      },
      {
        type: "paragraph",
        text: "It also means the person who will stand in front of the finished elevation is the person answering for the jig.",
      },
      {
        type: "heading",
        text: "Measured, not asserted",
      },
      {
        type: "paragraph",
        text: "Every assembly leaves the workshop with its dimensions recorded rather than assumed. That record is what makes a site variance a question with an answer instead of an argument between trades.",
      },
    ],
  },
  {
    id: "article-aluminium-for-modern-envelopes",
    slug: "aluminium-for-modern-envelopes",
    status: "published",
    pinned: false,
    format: "article",
    video: { url: "", duration: "" },
    category: "Materials",
    publishedAt: "2026-08-04",
    readingTime: "4 min read",
    title: "Why Aluminium Is Becoming the Material of Choice for Modern Envelopes",
    excerpt:
      "Strength-to-weight, formability and a genuinely circular end of life are what put aluminium at the centre of contemporary façade design.",
    cover: {
      image: {
        kind: "asset",
        key: "cardJuhu",
      },
      alt: "Aerial view of a modern residence with a courtyard pool",
    },
    body: [
      {
        type: "heading",
        text: "Slenderness is a structural argument",
      },
      {
        type: "paragraph",
        text: "The reason contemporary glazing can carry the sightlines it does is strength-to-weight. Aluminium lets a frame take the load of a large pane without growing to the section a weaker material would need, which is why the openings architects are drawing now were not buildable in the same way thirty years ago.",
      },
      {
        type: "heading",
        text: "Extrusion allows the detail to be designed",
      },
      {
        type: "paragraph",
        text: "Extrusion means the profile can be drawn for the job rather than selected around it. Thermal breaks, drainage paths and gasket races can all be placed where the detail needs them instead of where a standard section happens to put them.",
      },
      {
        type: "paragraph",
        text: "That is the difference between specifying a system and engineering one.",
      },
      {
        type: "heading",
        text: "An end of life worth counting",
      },
      {
        type: "paragraph",
        text: "Aluminium is recycled without losing its properties, and the recycled route uses a fraction of the energy of primary production. On a material that will outlast several refurbishments, that matters to a building's whole-life carbon in a way the installed figure alone does not show.",
      },
    ],
  },
  {
    id: "article-thermal-performance-and-intent",
    slug: "thermal-performance-and-intent",
    status: "published",
    pinned: false,
    format: "article",
    video: { url: "", duration: "" },
    category: "Engineering",
    publishedAt: "2026-07-21",
    readingTime: "5 min read",
    title: "Thermal Performance Without Compromising Architectural Intent",
    excerpt:
      "Meeting a thermal target and keeping the sightline the architect drew are usually presented as a trade. They do not have to be.",
    cover: {
      image: {
        kind: "asset",
        key: "cardRitz",
      },
      alt: "Curved pool deck overlooking clear blue water",
    },
    body: [
      {
        type: "heading",
        text: "The trade is usually a symptom of sequence",
      },
      {
        type: "paragraph",
        text: "Thermal performance becomes a fight with the elevation when it is checked late. Brought in at the point the system is selected, it is a constraint like any other — one that shapes the profile rather than thickening it after the fact.",
      },
      {
        type: "heading",
        text: "Where the heat actually goes",
      },
      {
        type: "paragraph",
        text: "Frame, glass and edge seal each have their own path, and the weakest of them sets the result. A high-specification unit in a frame with a poor break is an expensive way to arrive at an average number.",
      },
      {
        type: "paragraph",
        text: "Modelling the assembly rather than its parts is what makes the target reachable without adding face width.",
      },
      {
        type: "heading",
        text: "Comfort is not the same as compliance",
      },
      {
        type: "paragraph",
        text: "A façade can meet its figure and still be unpleasant to sit beside in February. Surface temperature, draught and radiant asymmetry are what the occupant registers, and they are worth designing to even when no regulation asks for them.",
      },
    ],
  },
];
