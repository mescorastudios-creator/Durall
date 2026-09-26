import type { FieldSpec, SectionSpec } from "@/admin/form/spec";
import { PROJECT_TAGS } from "@/content/categories";
import { PARTNER_MARKS, PRACTICE_MARKS } from "@/components/durall/partners/marks";
import type { ProjectDoc } from "@/content/types";
import { area, group, list, number, paragraphs, photo, strings, text, toggle } from "./build";

const facts = (path: string, label: string): FieldSpec =>
  list<{ label: string; value: string }>(
    path,
    label,
    [text("label", "Label"), text("value", "Value")],
    (item) => (item.label ? `${item.label}: ${item.value}` : ""),
    { create: () => ({ label: "", value: "" }), max: 16 },
  );

/** The project editor, minus the name/slug/status block drawn above it. */
export function projectForm(others: ProjectDoc[]): SectionSpec[] {
  return [
    {
      id: "basics",
      title: "Basics",
      fields: [
        strings("title", "Title lines", {
          hint: "How the name is broken over lines in the hero.",
          addLabel: "Add Line",
          min: 1,
        }),
        text("location", "Location"),
        text("architect", "Architect"),
        number("year", "Year completed", { min: 1900, max: 2100 }),
        {
          kind: "checkboxes",
          path: "categories",
          label: "Categories",
          hint: "The filters it appears under on the Projects page.",
          options: PROJECT_TAGS.map((tag) => ({ value: tag, label: tag })),
        },
        area("description", "Summary", {
          rows: 3,
          hint: "Used in search results and when the page is shared.",
        }),
        toggle(
          "placeholder",
          "Case study in preparation",
          "A reminder to yourself; the dashboard lists these until they are written.",
        ),
      ],
    },
    {
      id: "listing",
      title: "Where It Appears",
      fields: [
        toggle("inPortfolio", "In the Projects grid"),
        toggle(
          "isFeatured",
          "Featured at the top of the Projects page",
          "Only one project can be featured.",
        ),
        {
          kind: "select",
          path: "nextSlug",
          label: "“Next project” link",
          hint: "Automatic follows the order of the list.",
          options: [
            { value: "", label: "Automatic (next in order)" },
            ...others.map((p) => ({ value: p.slug, label: p.name || p.slug })),
          ],
        },
        group("home", "Card on the home page", [
          toggle("show", "Show on the home page"),
          text("title", "Card title"),
          text("subtitle", "Card line", { hint: "For example: Murud — SPASM Architects" }),
          {
            kind: "image",
            path: "image",
            label: "Square photograph",
            hint: "Cropped square on the home page.",
          },
        ]),
      ],
    },
    {
      id: "hero",
      title: "Opening (Hero)",
      fields: [
        photo("hero", "Photograph", { hint: "Also the photograph in the Projects grid." }),
        {
          kind: "optional",
          path: "figure",
          label: "Figure",
          toggleLabel: "Rolling figure in the hero",
          hint: "A number that counts up, like 750 m² built area.",
          create: () => ({ label: "Built area", value: 0, unit: "m²" }),
          fields: [text("label", "Label"), number("value", "Number"), text("unit", "Unit")],
        },
        {
          kind: "optional",
          path: "card",
          label: "Card photograph",
          toggleLabel: "Own photograph for “Next project” links",
          hint: "Off: the hero photograph is used.",
          create: () => ({ image: { kind: "asset", key: "heroParikrama" }, alt: "" }),
          fields: [photo("", "Photograph")],
        },
      ],
    },
    { id: "facts", title: "Project Information", fields: [facts("facts", "Facts")] },
    {
      id: "intro",
      title: "Introduction",
      fields: [text("intro.heading", "Heading"), paragraphs("intro.paragraphs")],
    },
    {
      id: "gallery",
      title: "Photography",
      description: "The gallery. The first eight are laid out by hand in the Detail view.",
      fields: [
        list<{ caption: string; alt: string }>(
          "plates",
          "Photographs",
          [photo("", "Photograph"), text("caption", "Caption", { wide: true })],
          (item, index) => item.caption || item.alt || `Photograph ${index + 1}`,
          {
            create: () => ({
              image: { kind: "asset", key: "heroParikrama" },
              alt: "",
              caption: "",
            }),
            addLabel: "Add Photograph",
            max: 40,
          },
        ),
      ],
    },
    {
      id: "scope",
      title: "Durall’s Scope",
      fields: [
        photo("scope", "Photograph"),
        text("scope.heading", "Heading"),
        paragraphs("scope.paragraphs"),
        facts("scope.facts", "Facts"),
      ],
    },
    {
      id: "system",
      title: "The System",
      fields: [
        photo("system", "Photograph"),
        strings("system.title", "Title lines", { addLabel: "Add Line", min: 1 }),
        area("system.body", "Text", { rows: 4 }),
        strings("system.points", "Points", { addLabel: "Add Point" }),
      ],
    },
    {
      id: "experience",
      title: "The Experience",
      fields: [
        photo("experience", "Photograph"),
        text("experience.heading", "Heading"),
        area("experience.body", "Text"),
      ],
    },
  ];
}

/** Shown only for the featured project. */
export const FEATURE_FORM: SectionSpec = {
  id: "feature",
  title: "Featured Presentation",
  description: "How this project is presented at the top of the Projects page.",
  fields: [
    text("feature.eyebrow", "Small heading"),
    text("feature.location", "Location"),
    strings("feature.title", "Title lines", { addLabel: "Add Line", min: 1 }),
    text("feature.architect", "Architect"),
    area("feature.description", "Text", { rows: 4 }),
    list<{ label: string; value: string }>(
      "feature.specs",
      "Specifications",
      [
        text("label", "Label"),
        area("value", "Value", { rows: 2, hint: "A new line breaks the value." }),
      ],
      (item) => item.label,
      { create: () => ({ label: "", value: "" }), max: 3 },
    ),
    {
      kind: "optional",
      path: "feature.award",
      label: "Award",
      toggleLabel: "Show an award",
      create: () => ({ name: "", year: String(new Date().getFullYear()) }),
      fields: [text("name", "Award"), text("year", "Year")],
    },
    list<{ alt: string }>(
      "feature.gallery",
      "Slideshow",
      [photo("", "Photograph")],
      (item, index) => item.alt || `Photograph ${index + 1}`,
      {
        create: () => ({ image: { kind: "asset", key: "heroParikrama" }, alt: "" }),
        addLabel: "Add Photograph",
        max: 12,
      },
    ),
  ],
};

export const ROLE_FIELDS: FieldSpec[] = [
  text("title", "Role"),
  toggle("open", "Open", "Closed roles stay here but are hidden from the site."),
  text("team", "Team"),
  text("location", "Location"),
  text("type", "Type", { placeholder: "Full time" }),
  area("summary", "Summary", { rows: 3 }),
];

export function partnerFields(kind: "partner" | "practice"): FieldSpec[] {
  const marks = kind === "partner" ? PARTNER_MARKS : PRACTICE_MARKS;
  return [
    text("name", "Name"),
    toggle("visible", "Show on the site"),
    text("country", "Country"),
    area("description", "What they do", { rows: 2 }),
    { kind: "logo", path: "logo", label: "Logo" },
    {
      kind: "select",
      path: "mark",
      label: "Style without a logo",
      hint: "How the name is drawn when there is no logo file.",
      options: marks.map((mark) => ({
        value: mark,
        label: mark === "plain" ? "Plain name" : mark,
      })),
    },
  ];
}
