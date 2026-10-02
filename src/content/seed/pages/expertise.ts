import { photo } from "../../render";
import type { ExpertisePage } from "../../types";

export const EXPERTISE_SEED: ExpertisePage = {
  seo: {
    title: "Expertise — Durall Systems",
    description:
      "Window, door and façade systems from Europe’s leading manufacturers, engineered, fabricated and installed in India as one continuous discipline.",
    image: null,
  },
  opening: {
    photo: photo(
      "heroPartners",
      "Living room of Chiltern House, Singapore, with a long clerestory window onto the garden",
    ),
    heading: "Engineered before\nit is drawn.",
    body: "Durall designs, engineers, fabricates and installs the envelope as one continuous discipline — so the detail an architect draws is the detail that reaches site.",
  },
  intro: {
    eyebrow: "Our expertise",
    heading: "The world’s finest systems, engineered for where you build.",
    body: "We work with leading manufacturers across Europe, and bring their systems to India through our own engineering, fabrication and installation. Every opening is chosen, detailed and fitted for its site, its climate and the way it will be lived in.",
    link: { label: "Meet our partners", href: "/partners" },
  },
  process: {
    heading: "Concept to commissioning,\nunder one roof.",
    lede: "From first drawing to final handover, every stage stays connected — architectural intent, engineering, fabrication and installation under one team.",
    stages: [
      {
        title: "Discover",
        summary: "Site, brief and intent.",
        body: "We walk the site, read the architect’s drawings and understand what the building has to face.",
        photo: photo("expStageDiscover", "Glass pavilion under a deep roof, seen across a lawn"),
      },
      {
        title: "Design",
        summary: "System and elevation studies.",
        body: "We choose the right system for every opening and resolve how it meets the architecture.",
        photo: photo("expStageDesign", "Section drawing through a sliding door and its sill"),
      },
      {
        title: "Engineer",
        summary: "Structure, weather and comfort.",
        body: "Each detail is worked through for wind, rain, heat and sound before it is released.",
        photo: photo(
          "expStageEngineer",
          "Full-height glass wall under a planted roof at House of Secret Gardens",
        ),
      },
      {
        title: "Fabricate",
        summary: "Precision, in our hands.",
        body: "Frames are fabricated, assembled and checked to the drawing — one opening at a time.",
        photo: photo(
          "expStageFabricate",
          "Slim sliding glass door beside a board-marked concrete wall",
        ),
      },
      {
        title: "Install",
        summary: "On site, to handover.",
        body: "Our own teams install, seal and hand over — the design intent delivered as drawn.",
        photo: photo(
          "expStageInstall",
          "Glass façade and balustrade of a white house above a pool",
        ),
      },
    ],
    footLeft: "A single, connected process",
    footRight: "Built for lasting architecture",
  },
  trusted: {
    eyebrow: "What we’re trusted with",
    heading: "Every site asks for\nsomething different.",
    body: "A garden, a coastline, a city skyline. Each project asks something different of the opening — here is what we have delivered, and where.",
    seenAt: "Seen at",
    viewProject: "View project",
    kinds: [
      {
        title: "Openings that disappear",
        body: "Minimal sliding glass walls that open whole rooms to the landscape — engineered to stay out of sight.",
        projects: [
          {
            name: "House of Secret Gardens",
            place: "Ahmedabad",
            credit: "SPASM Design Architects · Ahmedabad",
            photo: photo(
              "secretGardens",
              "Glass wall of House of Secret Gardens under a roof overgrown with bougainvillea",
            ),
            thumb: null,
            // TODO: no project page yet; link it here once one is published.
            href: "",
          },
          {
            name: "Patina Maldives",
            place: "Fari Islands, Maldives",
            credit: "Studio MK27 · Fari Islands, Maldives",
            photo: photo("patinaPool", "Pool deck and open timber pavilion at Patina Maldives"),
            thumb: null,
            href: "/projects/patina",
          },
          {
            name: "Parikrama House",
            place: "Nandgaon, Maharashtra",
            credit: "SPASM Design Architects · Nandgaon, Maharashtra",
            photo: photo("heroParikrama", "Glass pavilion of Parikrama House among coconut palms"),
            thumb: null,
            href: "/projects/parikrama-murud-house",
          },
          {
            name: "Chiltern House",
            place: "Singapore",
            credit: "WOW Architects · Singapore",
            photo: photo(
              "heroPartners",
              "Living room of Chiltern House with a long clerestory window onto the garden",
            ),
            thumb: null,
            href: "/projects/chiltron-house",
          },
          {
            name: "Juhu House",
            place: "Mumbai",
            credit: "Ernesto Bedmar · Mumbai",
            photo: photo("juhuFacade", "Juhu House seen over its stone boundary wall and palms"),
            thumb: null,
            href: "/projects/juhu-house",
          },
        ],
      },
      {
        title: "By the sea",
        body: "Island resorts where every opening frames the horizon — clean sightlines and seamless indoor–outdoor living.",
        projects: [
          {
            name: "Patina Maldives",
            place: "Fari Islands, Maldives",
            credit: "Studio MK27 · Fari Islands, Maldives",
            photo: photo(
              "patinaAerial",
              "Patina Maldives from above: a villa, its pool and the beach",
            ),
            thumb: photo("patinaPool", "Pool deck and open timber pavilion at Patina Maldives"),
            href: "/projects/patina",
          },
          {
            name: "Ritz-Carlton Maldives",
            place: "Fari Islands, Maldives",
            credit: "Kerry Hill Architects · Fari Islands, Maldives",
            photo: photo("projectRitz", "Circular water villa at the Ritz-Carlton Maldives"),
            thumb: photo("ritzVillas", "Row of water villas at the Ritz-Carlton Maldives"),
            href: "/projects/ritz-carlton-maldives",
          },
        ],
      },
      {
        title: "Windows & skylights",
        body: "Sliding window systems and skylight glazing that bring daylight deep into the home.",
        projects: [
          {
            name: "Villa in the Sky",
            place: "Mumbai",
            credit: "Mumbai",
            // TODO: photograph to come from Durall (the design marks it "photo needed").
            photo: null,
            thumb: null,
            href: "",
          },
          {
            name: "Ritz-Carlton Maldives",
            place: "Fari Islands, Maldives",
            credit: "Kerry Hill Architects · Fari Islands, Maldives",
            photo: photo("projectRitz", "Circular water villa at the Ritz-Carlton Maldives"),
            thumb: photo("ritzVillas", "Row of water villas at the Ritz-Carlton Maldives"),
            href: "/projects/ritz-carlton-maldives",
          },
        ],
      },
      {
        title: "Façades & screens",
        body: "The building envelope itself — façade glazing, and operable screens that slide across the façade for privacy, shade and view.",
        projects: [
          {
            name: "Mandala House",
            place: "Bengaluru",
            credit: "WOW Architects · Bengaluru",
            photo: photo(
              "mandalaCourt",
              "White house with a screened upper floor over a glazed ground floor and pool",
            ),
            thumb: photo("mandalaHouse", "Two wings of Mandala House either side of a pool court"),
            href: "",
          },
          {
            name: "Carmichael Residences",
            place: "Mumbai",
            credit: "Mumbai",
            // TODO: photograph to come from Durall (the design marks it "photo needed").
            photo: null,
            thumb: null,
            href: "",
          },
        ],
      },
    ],
  },
  detail: {
    eyebrow: "In the detail",
    heading: "Decided on paper,\nnot on site.",
    body: "Every opening is detailed, coordinated with the architect and checked before anything is made — so what arrives on site simply fits.",
    steps: [
      {
        title: "Early advice",
        body: "We review the design intent early, to flag technical considerations and opportunities.",
      },
      {
        title: "Detail coordination",
        body: "Architectural, structural and services inputs are aligned at the drawing stage.",
      },
      {
        title: "Buildable solutions",
        body: "Every detail is developed for performance, fabrication and installation.",
      },
      {
        title: "Approval & release",
        body: "Drawings are finalised and approved before production begins.",
      },
    ],
    photo: photo("expDetailDoor", "Slim glass door in a concrete wall at Chiltern House"),
    drawingLabel: "Sill detail — flush sliding door",
    credit: "Chiltern House, Singapore · WOW Architects",
    scale: "Scale 1:2",
  },
  cta: {
    eyebrow: "Bring us in early",
    heading: "Have an opening in mind?",
    body: "Share your drawings with our engineering team — we’ll help choose the right system, resolve every detail and see it through to handover.",
    action: { label: "Talk to an engineer", href: "/contact" },
  },
};
