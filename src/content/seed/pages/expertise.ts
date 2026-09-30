import { photo } from "../../render";
import type { ExpertisePage } from "../../types";

export const EXPERTISE_SEED: ExpertisePage = {
  seo: {
    title: "Expertise — Durall Systems",
    description:
      "Window, door and façade systems designed, engineered, fabricated and installed as one continuous discipline — and the five-stage process that gets them built.",
    image: null,
  },
  opening: {
    photo: photo(
      "heroPartners",
      "Living room of Chiltern House, Singapore, with a long clerestory window onto the garden",
    ),
    heading: "Engineered before\nit is drawn.",
    body: "Durall designs, engineers, fabricates and installs the envelope as one continuous discipline — so the detail an architect draws is the detail that reaches site.",
    credit: "Chiltern House, Singapore · WOW Architects",
    ribbon: {
      count: "04",
      label: "Systems · One discipline",
      items: ["Window Systems", "Door Systems", "Façade Systems", "Technical Performance"],
    },
  },
  statement: {
    eyebrow: "01 — What we do",
    text: {
      text: "We don’t supply windows. We engineer the opening",
      muted: "— and stay with it from the first sketch to the last seal.",
    },
  },
  anatomy: {
    eyebrow: "02 — Anatomy of a Durall frame",
    heading: "Every millimetre\nhas a job.",
    body: "A section through the sill of our flush sliding system. Six parts, each engineered for one job — and tested together, as one.",
    // TODO: confirm with Durall — only the thermal break's text is in the
    // design; the other five are written to suit and still to be checked.
    parts: [
      {
        title: "Glass unit",
        body: "Insulated glass bedded on setting blocks, so its weight travels into the frame and never onto the seals.",
        appliesTo: "Windows · Doors · Façades",
      },
      {
        title: "EPDM gaskets",
        body: "Seals on both faces of the glass that stay supple through heat and monsoon, and keep wind and water outside.",
        appliesTo: "Windows · Doors · Façades",
      },
      {
        title: "Thermal break",
        body: "Polyamide strips split every profile into an inner and an outer shell. Heat stays where it belongs — and the frame never sweats on the inside.",
        appliesTo: "Windows · Doors · Façades",
      },
      {
        title: "Rollers & track",
        body: "Stainless steel rollers on a hardened track, so even a large panel slides open with one hand.",
        appliesTo: "Sliding windows · Doors",
      },
      {
        title: "Concealed drainage",
        body: "Water that passes the outer seal is caught inside the sill and led out through hidden weep slots — nothing shows on the face of the frame.",
        appliesTo: "Windows · Doors",
      },
      {
        title: "Flush threshold",
        body: "The track sits in the floor, level with the finish inside and out, so the room runs onto the terrace without a step.",
        appliesTo: "Doors",
      },
    ],
    appliesToLabel: "Applies to",
    outside: "Outside",
    inside: "Inside",
    elevation: "Key elevation",
    detail: { label: "Detail", value: "D-03" },
    drawing: {
      label: "Drawing",
      title: "Sill section — flush sliding system",
      hint: "Select a number to explore each part",
    },
    scale: { label: "Scale", value: "1:2" },
    download: { heading: "Download", label: "DWG", href: "" },
  },
  process: { eyebrow: "03 — How we work" },
  performance: {
    eyebrow: "04 — Tested performance",
    heading: "Numbers we put\nour name to.",
    body: "Every system is tested as a complete assembly — frame, glass, gaskets and hardware together — against European standards, before it goes anywhere near a site.",
    // TODO: placeholder values from the design, to be replaced with Durall's
    // certified results (the note below says so on the page).
    metrics: [
      {
        label: "Air permeability",
        value: "Class 4",
        unit: "",
        rating: 4,
        of: 4,
        standard: "Tested to EN 12207",
      },
      {
        label: "Watertightness",
        value: "E1200",
        unit: "",
        rating: 5,
        of: 5,
        standard: "Tested to EN 12208",
      },
      {
        label: "Wind resistance",
        value: "4.0 kPa",
        unit: "",
        rating: 4,
        of: 5,
        standard: "Tested to EN 12210",
      },
      {
        label: "Acoustic insulation",
        value: "42 dB*",
        unit: "",
        rating: 4,
        of: 5,
        standard: "Tested to EN ISO 10140",
      },
      {
        label: "Thermal transmittance",
        value: "1.4",
        unit: "W/m²K*",
        rating: 4,
        of: 5,
        standard: "Tested to EN ISO 10077",
      },
    ],
    low: "Base",
    high: "Highest",
    note: "* Placeholder values — to be replaced with Durall’s certified test results per system.",
    download: { label: "Download Test Certificates", href: "" },
  },
  architects: {
    eyebrow: "05 — For architects",
    heading: "Bring us in early.",
    body: "The earlier we’re in the room, the slimmer the frame — and the fewer the surprises on site.",
    cards: [
      {
        title: "BIM & CAD library",
        body: "Revit families, DWG sections and specification text for every Durall system — ready to drop into your drawings.",
        link: { label: "Request Access", href: "/contact" },
      },
      {
        title: "Specification support",
        body: "We write the clauses with you and check every opening against real, tested performance — before tender, not after.",
        link: { label: "Send Us a Drawing", href: "/contact" },
      },
      {
        title: "Engineer on call",
        body: "A 30-minute session with a Durall engineer, in your studio or on video, while the design is still moving.",
        link: { label: "Book a Session", href: "/contact" },
      },
    ],
  },
};
