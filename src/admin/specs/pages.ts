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
        lines("approach.heading", "Heading"),
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
    photoHero("The full-width photograph and heading at the top of the Expertise page."),
    {
      id: "intro",
      title: "Our Expertise",
      description: "The statement under the opening photograph, with its text and link.",
      fields: [
        text("intro.eyebrow", "Small heading"),
        area("intro.heading", "Statement", { rows: 2 }),
        area("intro.body", "Text", { rows: 4 }),
        cta("intro.link", "Link", { optional: true }),
      ],
    },
    {
      id: "process",
      title: "How We Work",
      description: "The stages side by side, each with a tall picture.",
      fields: [
        lines("process.heading", "Heading"),
        area("process.lede", "Text", { rows: 3 }),
        list<{ title: string }>(
          "process.stages",
          "Stages",
          [
            text("title", "Name"),
            text("summary", "Line under the name"),
            area("body", "Text", { rows: 3 }),
            photo("photo", "Picture", {
              hint: "Shown tall and narrow (about 2 wide to 3 high), so choose or crop one that suits.",
            }),
          ],
          (item, index) => `${String(index + 1).padStart(2, "0")} ${item.title}`,
          {
            create: () => ({
              title: "",
              summary: "",
              body: "",
              photo: { image: { kind: "asset", key: "expStageDiscover" }, alt: "" },
            }),
            max: 6,
          },
        ),
        text("process.footLeft", "Under the stages, left"),
        text("process.footRight", "Under the stages, right"),
      ],
    },
    {
      id: "trusted",
      title: "What We’re Trusted With",
      description:
        "The navy section: kinds of work that open one at a time, each with the projects it was delivered on.",
      fields: [
        text("trusted.eyebrow", "Small heading"),
        lines("trusted.heading", "Heading"),
        area("trusted.body", "Text", { rows: 3 }),
        text("trusted.seenAt", "Before the number of projects"),
        text("trusted.viewProject", "Link on the photograph"),
        list<{ title: string }>(
          "trusted.kinds",
          "Kinds of work",
          [
            text("title", "Name"),
            area("body", "Text", { rows: 3 }),
            list<{ name: string }>(
              "projects",
              "Projects",
              [
                text("name", "Project"),
                text("place", "Place", { hint: "Under the name in the list." }),
                text("credit", "Caption on the photograph", {
                  hint: "Usually the architect and the place.",
                }),
                {
                  kind: "optional",
                  path: "photo",
                  label: "Photograph",
                  toggleLabel: "Has a photograph",
                  hint: "Off: an empty frame holds the project’s place.",
                  create: () => ({ image: { kind: "asset", key: "secretGardens" }, alt: "" }),
                  fields: [photo("", "Photograph")],
                },
                {
                  kind: "optional",
                  path: "thumb",
                  label: "Small picture",
                  toggleLabel: "Own picture in the list",
                  hint: "Off: the photograph is used.",
                  create: () => ({ image: { kind: "asset", key: "secretGardens" }, alt: "" }),
                  fields: [photo("", "Small picture")],
                },
                link("href", "Project page", {
                  hint: "Leave empty to hide “View project”.",
                }),
              ],
              (item) => item.name,
              {
                create: () => ({
                  name: "",
                  place: "",
                  credit: "",
                  photo: null,
                  thumb: null,
                  href: "",
                }),
                addLabel: "Add Project",
                max: 8,
              },
            ),
          ],
          (item, index) => `${String(index + 1).padStart(2, "0")} ${item.title}`,
          { create: () => ({ title: "", body: "", projects: [] }), max: 6 },
        ),
      ],
    },
    {
      id: "detail",
      title: "In the Detail",
      description: "The steps beside the sill drawing. The drawing itself is part of the design.",
      fields: [
        text("detail.eyebrow", "Small heading"),
        lines("detail.heading", "Heading"),
        area("detail.body", "Text", { rows: 3 }),
        list<{ title: string }>(
          "detail.steps",
          "Steps",
          [text("title", "Title"), area("body", "Text", { rows: 2 })],
          (item, index) => `${String(index + 1).padStart(2, "0")} ${item.title}`,
          { create: () => ({ title: "", body: "" }), max: 5 },
        ),
        photo("detail.photo", "Photograph behind the drawing"),
        text("detail.drawingLabel", "Drawing title"),
        text("detail.credit", "Photograph credit"),
        text("detail.scale", "Scale"),
      ],
    },
    { id: "cta", title: "Closing Band", fields: ctaBand("cta") },
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
    {
      id: "films",
      title: "Films",
      description:
        "The band of films under the lead story. It appears once an insight set to Film is published with a YouTube or Vimeo link.",
      fields: [
        text("films.heading", "Heading"),
        area("films.lede", "Text", { rows: 2 }),
        text("films.notes", "Link to the film's own page"),
      ],
    },
    {
      id: "index",
      title: "All Insights",
      description: "The full list under the films, and its filters.",
      fields: [
        text("index.heading", "Heading"),
        text("index.allTopics", "“All topics” filter"),
        text("index.allFormats", "“All” format filter"),
        text("index.articles", "Articles filter"),
        text("index.films", "Films filter"),
        text("index.empty", "When a filter finds nothing"),
        text("index.showAll", "Link that clears the filters"),
      ],
    },
    {
      id: "labels",
      title: "Card Words",
      description: "The small words on every article and film card.",
      fields: [
        text("labels.article", "Article label"),
        text("labels.film", "Film label"),
        text("labels.read", "Read link"),
        text("labels.watch", "Watch link"),
        text("labels.play", "Play button (read aloud by screen readers)"),
      ],
    },
    { id: "cta", title: "Closing Band", fields: ctaBand("cta") },
    {
      id: "article",
      title: "Article Pages",
      description: "The words around every article.",
      fields: [
        text("article.backLabel", "Back link"),
        text("article.moreHeading", "“More” heading"),
        text("article.contents", "Heading over the list of sections"),
        text("article.share", "Share heading"),
        text("article.copyLink", "Copy-link button"),
        text("article.copied", "Message once the link is copied"),
        group("", "Closing band", ctaBand("article.cta")),
      ],
    },
    SEO,
  ],

  careers: [
    {
      id: "opening",
      title: "Opening (Hero)",
      description:
        "The photograph and heading at the top of the Careers page. The number of open roles along its foot counts itself.",
      fields: [
        photo("opening.photo", "Background photograph"),
        lines("opening.heading", "Heading"),
        area("opening.body", "Text", { rows: 3 }),
        text("opening.credit", "Photograph credit"),
        text("opening.rolesLabel", "Words beside the number of roles"),
        text("opening.viewRoles", "Link down to the roles"),
      ],
    },
    {
      id: "roles",
      title: "Current Openings",
      description:
        "The words around the list of roles. The roles themselves are edited under Careers; the team filters are made from them.",
      fields: [
        text("roles.eyebrow", "Small heading"),
        text("roles.heading", "Heading"),
        text("roles.allRoles", "Filter that shows every team"),
        group("roles.columns", "Column headings", [
          text("role", "Role"),
          text("team", "Team"),
          text("location", "Location"),
          text("type", "Type"),
        ]),
        text("roles.applyLabel", "Apply button"),
        text("roles.note", "Note under the list", { hint: "Leave empty to hide it." }),
        area("roles.empty", "When no role is open", {
          rows: 3,
          hint: "{email} is replaced with the careers email address.",
        }),
      ],
    },
    {
      id: "open",
      title: "Don’t See Your Role?",
      description:
        "The box under the list. Its button and link open an email to the careers address (Company & Contact).",
      fields: [
        text("open.heading", "Heading"),
        area("open.body", "Text", { rows: 2 }),
        text("open.action", "Button"),
        text("open.orWrite", "Words before the email address"),
      ],
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
        [
          text("title", "Stage"),
          area("body", "Text", { rows: 3 }),
          photo("photo", "Photograph"),
          text("caption", "Line on the photograph (home page)"),
        ],
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
      group("enquiryBand.subscribe", "Subscribe tick box", [
        text("label", "Label"),
        area("note", "Line beneath it", { rows: 2 }),
      ]),
      text("enquiryBand.sentHeading", "After sending"),
      text("enquiryBand.sentAgain", "“Send another” button"),
      text("enquiryBand.viewProject", "Button on each slide"),
    ],
  },
];
