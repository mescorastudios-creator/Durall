import type { SectionSpec } from "@/admin/form/spec";
import type { PageKey } from "@/content/types";
import {
  area,
  cta,
  ctaBand,
  group,
  iconItems,
  image,
  lines,
  link,
  list,
  number,
  paragraphs,
  photo,
  seo,
  strings,
  text,
  twoTone,
} from "./build";

/**
 * Every page's edit form, section by section in the order they appear on the
 * page. The descriptions say where each one is, in the words someone
 * looking at the site would use.
 */

const SEO: SectionSpec = {
  id: "seo",
  title: "Search & Sharing",
  description: "How the page appears in Google results and when a link to it is shared.",
  fields: [seo()],
};

/** The full-width photographic opening (About, Partners, Projects, Expertise). */
const photoHero = (description: string): SectionSpec => ({
  id: "opening",
  title: "Opening (Hero)",
  description,
  fields: [
    photo("opening.photo", "Background photograph"),
    lines("opening.heading", "Heading"),
    area("opening.body", "Text", { rows: 3 }),
  ],
});
export const PAGE_FORMS: Record<PageKey, SectionSpec[]> = {
  home: [
    {
      id: "hero",
      title: "Opening (Hero)",
      description: "The full-screen photograph and heading at the top of the home page.",
      fields: [
        photo("hero.photo", "Background photograph"),
        text("hero.heading", "Heading"),
        area("hero.body", "Text", { rows: 3 }),
        cta("hero.primary", "First button"),
        cta("hero.secondary", "Second button"),
      ],
    },
    {
      id: "philosophy",
      title: "Philosophy",
      description: "“Luxury is never applied” — the section under the hero.",
      fields: [
        twoTone("philosophy.heading"),
        paragraphs("philosophy.paragraphs"),
        cta("philosophy.link", "Link"),
        photo("philosophy.photo", "Photograph"),
      ],
    },
    {
      id: "projects",
      title: "Projects",
      description:
        "The heading over the project cards. Which projects appear is set per project: open a project and switch on “Show on the home page”.",
      fields: [lines("projects.heading", "Heading"), area("projects.lede", "Text", { rows: 3 })],
    },
    {
      id: "insights",
      title: "Insights",
      description:
        "The heading over the latest articles. The four newest published articles appear here (a pinned one first).",
      fields: [text("insights.heading", "Heading")],
    },
    SEO,
  ],

  about: [
    photoHero("The full-width photograph and heading at the top of the About page."),
    {
      id: "approach",
      title: "Our Approach",
      description: "The animated diagram: four capabilities joining into the Durall mark.",
      fields: [
        text("approach.eyebrow", "Title above the diagram"),
        text("approach.heading", "Heading"),
        area("approach.body", "Text", { rows: 3 }),
        iconItems("approach.capabilities", "Capabilities", { fixed: true }),
        photo("approach.mark", "Centre mark"),
        photo("approach.drawing", "Drawing"),
        text("approach.outcomeTitle", "Outcome heading"),
        area("approach.outcomeBody", "Outcome text", { rows: 2 }),
      ],
    },
    {
      id: "philosophy",
      title: "Philosophy",
      description: "The heading, text and three principles under the hero.",
      fields: [
        text("philosophy.heading", "Heading"),
        area("philosophy.body", "Text", { rows: 4 }),
        text("philosophy.emphasis", "Bold line"),
        cta("philosophy.link", "Link"),
        iconItems("philosophy.features", "Principles", { fixed: true }),
        photo("philosophy.photo", "Photograph"),
      ],
    },
    {
      id: "spec",
      title: "System Specification",
      description:
        "The card with the profile photograph, the 16 MM figure and the performance ratings.",
      fields: [
        photo("spec.photo", "Profile photograph"),
        text("spec.value", "Figure"),
        text("spec.unit", "Unit"),
        text("spec.label", "Figure label"),
        area("spec.note", "Note", { rows: 2 }),
        photo("spec.drawing", "Section drawing"),
        list<{ label: string }>(
          "spec.metrics",
          "Ratings",
          [
            { kind: "icon", path: "icon", label: "Icon" },
            text("label", "Label"),
            text("value", "Value"),
          ],
          (item) => item.label,
          { fixed: true },
        ),
        text("spec.captionLeft", "Caption (left)"),
        text("spec.captionRight", "Caption (right)"),
      ],
    },
    {
      id: "meets",
      title: "Where Architecture Meets Engineering",
      fields: [
        text("meets.heading", "Heading"),
        paragraphs("meets.paragraphs"),
        photo("meets.photo", "Photograph"),
      ],
    },
    SEO,
  ],

  projects: [
    photoHero("The full-width photograph and heading at the top of the Projects page."),
    {
      id: "labels",
      title: "Portfolio Labels",
      description:
        "The words around the featured project and the grid. The projects themselves are edited under Projects.",
      fields: [
        text("featured.exploreLabel", "Featured project link"),
        text("grid.sort", "Sort button"),
        text("grid.view", "Card link"),
        text("grid.empty", "When a filter has no projects"),
      ],
    },
    {
      id: "cta",
      title: "Closing Band",
      description: "The navy band at the foot of the page.",
      fields: ctaBand("cta"),
    },
    {
      id: "detail",
      title: "Project Pages",
      description: "Labels and the closing band shared by every project’s own page.",
      fields: [
        text("detail.heroPrefix", "Before the location in the hero"),
        text("detail.info", "Facts heading"),
        text("detail.intro", "Introduction heading"),
        text("detail.gallery", "Gallery heading"),
        text("detail.plates", "After the photograph count"),
        text("detail.scope", "Scope heading"),
        text("detail.system", "System heading"),
        text("detail.experience", "Experience heading"),
        text("detail.next", "Next project label"),
        group("", "Closing band", ctaBand("detail.cta")),
      ],
    },
    SEO,
  ],

  expertise: [
    {
      id: "opening",
      title: "Opening (Hero)",
      description:
        "The full-width photograph and heading at the top of the Expertise page, with the strip of systems along its foot.",
      fields: [
        photo("opening.photo", "Background photograph"),
        lines("opening.heading", "Heading"),
        area("opening.body", "Text", { rows: 3 }),
        text("opening.credit", "Photograph credit"),
        text("opening.ribbon.count", "Number in the strip"),
        text("opening.ribbon.label", "Words beside the number"),
        strings("opening.ribbon.items", "Systems in the strip", { addLabel: "Add System" }),
      ],
    },
    {
      id: "statement",
      title: "What We Do",
      fields: [text("statement.eyebrow", "Small heading"), twoTone("statement.text", "Statement")],
    },
    {
      id: "anatomy",
      title: "Anatomy of a Frame",
      description:
        "The navy section with the sill drawing. The six parts match the six numbers on the drawing.",
      fields: [
        text("anatomy.eyebrow", "Small heading"),
        lines("anatomy.heading", "Heading"),
        area("anatomy.body", "Text", { rows: 3 }),
        list<{ title: string }>(
          "anatomy.parts",
          "Parts",
          [
            text("title", "Part"),
            area("body", "Text", { rows: 3 }),
            text("appliesTo", "Applies to"),
          ],
          (item, index) => `${String(index + 1).padStart(2, "0")} ${item.title}`,
          { fixed: true, hint: "Six parts, in the order of the numbers on the drawing." },
        ),
        text("anatomy.appliesToLabel", "“Applies to” label"),
        text("anatomy.outside", "Label over the outside"),
        text("anatomy.inside", "Label over the inside"),
        text("anatomy.elevation", "Label under the small elevation"),
        group("anatomy.detail", "Detail number", [text("label", "Label"), text("value", "Value")]),
        group("anatomy.drawing", "Drawing title", [
          text("label", "Label"),
          text("title", "Title"),
          text("hint", "Hint"),
        ]),
        group("anatomy.scale", "Scale", [text("label", "Label"), text("value", "Value")]),
        group("anatomy.download", "Download", [
          text("heading", "Label"),
          text("label", "Link text"),
          link("href", "File", { hint: "Leave empty to hide the download." }),
        ]),
      ],
    },
    {
      id: "process",
      title: "How We Work",
      description:
        "The five stages appear here and on the home page, so they are edited once, under Pages → Shared sections.",
      fields: [text("process.eyebrow", "Small heading")],
    },
    {
      id: "performance",
      title: "Tested Performance",
      fields: [
        text("performance.eyebrow", "Small heading"),
        lines("performance.heading", "Heading"),
        area("performance.body", "Text", { rows: 3 }),
        list<{ label: string }>(
          "performance.metrics",
          "Figures",
          [
            text("label", "Measure"),
            text("value", "Value"),
            text("unit", "Unit (set smaller, optional)"),
            number("rating", "Bars filled", { min: 0, max: 8 }),
            number("of", "Bars in all", { min: 1, max: 8 }),
            text("standard", "Standard"),
          ],
          (item) => item.label,
          {
            create: () => ({ label: "", value: "", unit: "", rating: 3, of: 5, standard: "" }),
            max: 6,
          },
        ),
        text("performance.low", "Left of the bars"),
        text("performance.high", "Right of the bars"),
        text("performance.note", "Note under the figures"),
        cta("performance.download", "Download", { hint: "Leave the link empty to hide it." }),
      ],
    },
    {
      id: "architects",
      title: "For Architects",
      fields: [
        text("architects.eyebrow", "Small heading"),
        text("architects.heading", "Heading"),
        area("architects.body", "Text", { rows: 2 }),
        list<{ title: string }>(
          "architects.cards",
          "Cards",
          [text("title", "Title"), area("body", "Text", { rows: 3 }), cta("link", "Link")],
          (item) => item.title,
          { fixed: true, hint: "Three cards; the middle one is drawn in navy." },
        ),
      ],
    },
    SEO,
  ],

  partners: [
    photoHero("The full-width photograph and heading at the top of the Partners page."),
    {
      id: "network",
      title: "International Systems",
      description:
        "The heading over the partner logos. The partners themselves are edited under Partners.",
      fields: [
        text("network.eyebrow", "Small heading"),
        text("network.heading", "Heading"),
        area("network.body", "Text", { rows: 3 }),
        image("network.map", "Map behind the logos", {
          hint: "Drawn faintly behind the grid; decorative, so it needs no description.",
        }),
        area("network.quote", "Closing statement", { rows: 3 }),
      ],
    },
    {
      id: "practices",
      title: "Architects & Design Practices",
      fields: [
        text("practices.eyebrow", "Small heading"),
        text("practices.heading", "Heading"),
        area("practices.lead", "Text", { rows: 3 }),
        area("practices.note", "Smaller text", { rows: 2 }),
        photo("practices.photo", "Drawing of the house"),
        text("practices.tagline", "Line under the logos"),
      ],
    },
    SEO,
  ],

  insights: [
    {
      id: "intro",
      title: "Opening",
      description:
        "The heading above the list of articles. The articles are edited under Insights.",
      fields: [text("intro.title", "Heading"), area("intro.lede", "Text", { rows: 3 })],
    },
    { id: "cta", title: "Closing Band", fields: ctaBand("cta") },
    {
      id: "article",
      title: "Article Pages",
      description: "The words around every article.",
      fields: [
        text("article.backLabel", "Back link"),
        text("article.moreHeading", "“More” heading"),
        group("", "Closing band", ctaBand("article.cta")),
      ],
    },
    SEO,
  ],

  careers: [
    {
      id: "hero",
      title: "Opening",
      fields: [
        text("hero.heading", "Heading"),
        area("hero.body", "Text", { rows: 3 }),
        cta("hero.cta", "Button"),
        photo("hero.photo", "Photograph"),
      ],
    },
    {
      id: "band",
      title: "Photograph Band",
      description: "One sentence over a full-width photograph.",
      fields: [
        area("band.heading", "Sentence", { rows: 2 }),
        image("band.image", "Photograph", {
          hint: "Decorative behind the sentence, so it needs no description.",
        }),
      ],
    },
    {
      id: "why",
      title: "What Working Here Is Like",
      fields: [
        text("why.heading", "Heading"),
        list<{ title: string }>(
          "why.reasons",
          "Points",
          [text("title", "Title"), area("body", "Text", { rows: 3 })],
          (item) => item.title,
          { create: () => ({ title: "", body: "" }), max: 8 },
        ),
      ],
    },
    {
      id: "openings",
      title: "Open Roles",
      description:
        "The words around the list of roles. The roles themselves are edited under Careers.",
      fields: [
        text("openings.heading", "Heading"),
        text("openings.applyLabel", "Apply link"),
        area("openings.empty", "When no role is open", {
          rows: 3,
          hint: "{email} is replaced with the careers email address.",
        }),
        text("openings.howHeading", "“How to apply” heading"),
        area("openings.howBody", "“How to apply” text", { rows: 3 }),
      ],
    },
    {
      id: "cta",
      title: "Closing Band",
      description: "Leave the button’s link empty to open an email to the careers address.",
      fields: ctaBand("cta"),
    },
    SEO,
  ],

  contact: [
    {
      id: "intro",
      title: "Opening",
      fields: [text("intro.title", "Heading"), area("intro.lede", "Text", { rows: 3 })],
    },
    {
      id: "map",
      title: "Map Card",
      description:
        "The labels on the office card over the map. The address itself is under Company & contact.",
      fields: [
        text("map.eyebrow", "Small heading"),
        text("map.directions", "Directions button"),
        text("map.openInMaps", "Maps button"),
      ],
    },
    {
      id: "form",
      title: "Enquiry Form",
      description: "Messages sent with this form arrive under Enquiries.",
      fields: [
        text("formHeading", "Heading over the form"),
        group("form.name", "Name field", [
          text("label", "Label"),
          text("placeholder", "Example text"),
        ]),
        group("form.email", "Email field", [
          text("label", "Label"),
          text("placeholder", "Example text"),
        ]),
        group("form.subject", "Subject field", [
          text("label", "Label"),
          text("placeholder", "Example text"),
        ]),
        group("form.message", "Message field", [
          text("label", "Label"),
          text("placeholder", "Example text"),
        ]),
        text("form.submit", "Send button"),
        text("form.sending", "While sending"),
        text("form.sentHeading", "After sending"),
        text("form.sentAgain", "“Send another” button"),
        text("detailsHeading", "Heading over the email and phone"),
      ],
    },
    SEO,
  ],
};

/** The sections that appear on more than one page. */
export const SHARED_FORM: SectionSpec[] = [
  {
    id: "process",
    title: "Process",
    description:
      "“Concept to commissioning” — the five stages, on the home page and the Expertise page.",
    fields: [
      twoTone("process.heading"),
      area("process.lede", "Text", { rows: 2 }),
      list<{ title: string }>(
        "process.stages",
        "Stages",
        [text("title", "Stage"), area("body", "Text", { rows: 3 }), photo("photo", "Photograph")],
        (item) => item.title,
        { fixed: true, hint: "The scrolling scene is paced for five stages." },
      ),
      cta("process.link", "Link"),
    ],
  },
  {
    id: "enquiryBand",
    title: "Enquiry Band",
    description:
      "“Let’s frame the view.” — the navy band with the enquiry form and a slideshow of every published project, at the foot of Home, About, Partners and Expertise. Messages sent with it arrive under Enquiries.",
    fields: [
      text("enquiryBand.heading", "Heading"),
      text("enquiryBand.lede", "Text"),
      group("enquiryBand.fields.name", "Name field", [
        text("label", "Label"),
        text("placeholder", "Example text"),
      ]),
      group("enquiryBand.fields.email", "Email field", [
        text("label", "Label"),
        text("placeholder", "Example text"),
      ]),
      group("enquiryBand.fields.phone", "Phone field", [
        text("label", "Label"),
        text("placeholder", "Example text"),
      ]),
      group("enquiryBand.fields.location", "Location field", [
        text("label", "Label"),
        text("placeholder", "Example text"),
      ]),
      group("enquiryBand.fields.message", "Message field", [
        text("label", "Label"),
        text("placeholder", "Example text"),
      ]),
      text("enquiryBand.submit", "Send button"),
      text("enquiryBand.sending", "While sending"),
      text("enquiryBand.writeTo", "Words before the email address"),
      text("enquiryBand.sentHeading", "After sending"),
      text("enquiryBand.sentAgain", "“Send another” button"),
      text("enquiryBand.viewProject", "Button on each slide"),
    ],
  },
];
