import type { SectionSpec } from "@/admin/form/spec";
import { area, group, link, lines, list, number, strings, text, toggle } from "./build";

/** Navigation & footer. */
export const NAVIGATION_FORM: SectionSpec[] = [
  {
    id: "header",
    title: "Navigation Bar",
    description: "The pages in the bar at the top of every page, in order.",
    fields: [
      list<{ label: string; visible: boolean }>(
        "header.items",
        "Links",
        [
          text("label", "Label"),
          text("fullLabel", "Full name (optional)", {
            hint: "Read by screen readers and shown in the phone menu, where it differs from the label.",
          }),
          link("href", "Goes to"),
          { kind: "toggle", path: "visible", label: "Show in the bar" },
        ],
        (item) => `${item.label}${item.visible ? "" : " (hidden)"}`,
        { create: () => ({ label: "", fullLabel: "", href: "/", visible: true }), max: 10 },
      ),
      group("header.cta", "Button at the end of the bar", [
        text("label", "Label"),
        link("href", "Goes to"),
      ]),
      lines("header.menuTagline", "Line in the phone menu"),
    ],
  },
  {
    id: "footer",
    title: "Footer",
    description:
      "The foot of every page: the logo and tagline (under Company & Contact), a short description, columns of links, the office address and the email and phone.",
    fields: [
      area("footer.blurb", "Description under the tagline", { rows: 3 }),
      list<{ title: string }>(
        "footer.columns",
        "Columns",
        [
          text("title", "Column heading"),
          list<{ label: string }>(
            "links",
            "Links",
            [text("label", "Label"), link("href", "Goes to")],
            (item) => item.label,
            { create: () => ({ label: "", href: "/" }), max: 10 },
          ),
        ],
        (item) => item.title,
        { create: () => ({ title: "", links: [] }), max: 5 },
      ),
      text("footer.officeHeading", "Heading over the address"),
      text("footer.contactHeading", "Heading over the email and phone"),
      text("footer.hours", "Line under the email and phone"),
      list<{ label: string }>(
        "footer.social",
        "Social links",
        [
          text("label", "Label"),
          link("href", "Goes to", { hint: "Leave empty to show the label as plain text." }),
        ],
        (item) => item.label,
        { create: () => ({ label: "", href: "" }), max: 5 },
      ),
      list<{ label: string }>(
        "footer.legal",
        "Bottom line links",
        [
          text("label", "Label"),
          link("href", "Goes to", { hint: "Leave empty to show the label as plain text." }),
        ],
        (item) => item.label,
        { create: () => ({ label: "", href: "" }), max: 4 },
      ),
      text("footer.backToTop", "“Back to top” link"),
    ],
  },
];

/** Company & contact. */
export const COMPANY_FORM: SectionSpec[] = [
  {
    id: "company",
    title: "Company",
    fields: [
      text("company.name", "Name", { hint: "Shown in the navigation bar and the footer." }),
      text("company.legalName", "Registered name", { hint: "Used in the copyright line." }),
      text("company.tagline", "Footer tagline"),
    ],
  },
  {
    id: "contact",
    title: "Contact Details",
    description: "The email and phone under “Direct Lines” on the Contact page.",
    fields: [
      list<{ label: string; value: string }>(
        "contact.details",
        "Direct lines",
        [
          { kind: "icon", path: "icon", label: "Icon" },
          text("label", "Label"),
          text("value", "Shown as"),
          link("href", "Link", { hint: "mailto:name@durall.com or tel:+912212345678" }),
          area("note", "Note", { rows: 2 }),
        ],
        (item) => `${item.label}: ${item.value}`,
        { create: () => ({ icon: "mail", label: "", value: "", href: "", note: "" }), max: 4 },
      ),
      area("contact.responseNote", "Reply promise", {
        rows: 2,
        hint: "Shown under both enquiry forms and after sending.",
      }),
      {
        kind: "email",
        path: "contact.careersEmail",
        label: "Careers email",
        hint: "Where “Apply” and “Send your work” write to.",
      },
    ],
  },
  {
    id: "office",
    title: "Head Office",
    description: "The address card and the pin on the Contact page map.",
    fields: [
      text("office.name", "Name"),
      text("office.plusCode", "Plus code"),
      strings("office.lines", "Address lines", { addLabel: "Add Line" }),
      number("office.lat", "Latitude", {
        step: 0.000001,
        hint: "From Google Maps: right-click the pin.",
      }),
      number("office.lng", "Longitude", { step: 0.000001 }),
      text("office.note", "Note"),
      link("office.directions", "Directions link"),
      link("office.googleMaps", "Google Maps link"),
    ],
  },
];

/** Site settings. */
export const SITE_SETTINGS_FORM: SectionSpec[] = [
  {
    id: "behaviour",
    title: "Motion",
    fields: [
      toggle(
        "behaviour.loadingScreen",
        "Loading screen",
        "The Durall curtain that opens when the site is first loaded or refreshed.",
      ),
      toggle(
        "behaviour.pageTransition",
        "Page transition",
        "The circle that grows from where a visitor clicks when they change page.",
      ),
    ],
  },
  {
    id: "seo",
    title: "Default Share Image",
    description:
      "Shown when a page without its own share image is shared. A 1200 × 630 JPEG in the site’s public folder.",
    fields: [
      text("seo.shareImage", "Image address", { hint: "For example /og-durall.jpg" }),
      text("seo.shareImageAlt", "Description"),
    ],
  },
  {
    id: "notFound",
    title: "Page Not Found",
    description: "What someone sees when they follow a broken link.",
    fields: [
      group("notFound", "Words", [
        text("heading", "Heading"),
        area("body", "Text", { rows: 2 }),
        text("action", "Button"),
      ]),
    ],
  },
];
