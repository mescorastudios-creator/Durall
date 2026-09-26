import type { ProjectDoc } from "../types";

/* Generated from the three project lists the site used to carry (the home
 * cards, the portfolio and the detail pages), merged by slug. Edit in the
 * admin panel; this is only the starting content and the offline fallback. */
export const PROJECTS_SEED: ProjectDoc[] = [
  {
    id: "project-parikrama-murud-house",
    slug: "parikrama-murud-house",
    status: "published",
    order: 0,
    nextSlug: "sentosa-house",
    placeholder: false,
    name: "Parikrama — Murud House",
    title: ["Parikrama", "Murud House"],
    location: "Murud, Maharashtra",
    architect: "SPASM Design Architects",
    year: 2021,
    categories: ["Residential"],
    description:
      "Parikrama — Murud House by SPASM Design Architects: a house designed as a journey through stone, glass and landscape, with minimal glazing resolved by Durall Systems.",
    figure: {
      label: "Built area",
      value: 750,
      unit: "m²",
    },
    hero: {
      image: {
        kind: "asset",
        key: "parikramaPalms",
      },
      alt: "Parikrama, Murud House — the long dark elevation beneath coconut palms",
    },
    card: null,
    facts: [
      {
        label: "Project",
        value: "Parikrama — Murud House",
      },
      {
        label: "Architect",
        value: "SPASM Design Architects",
      },
      {
        label: "Location",
        value: "Murud, Maharashtra",
      },
      {
        label: "Area",
        value: "750 m²",
      },
      {
        label: "Completed",
        value: "2021",
      },
      {
        label: "Durall Role",
        value: "Window Consultant",
      },
      {
        label: "System",
        value: "PanoramAH! by Jofebar",
      },
      {
        label: "Recognition",
        value: "Architectural Hunter Award 2025",
      },
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
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "The living pavilion under its cantilevered roof",
        caption: "The living pavilion — roof plane cantilevered over glass and stone",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "The veranda with its stone floor and timber soffit",
        caption: "The veranda — stone floor, timber soffit, sliding glass pockets open",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "A view through the house to the garden",
        caption: "Looking through the house to the garden",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "The long elevation of the house in a coconut grove",
        caption: "The long elevation set within the coconut grove",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "A bedroom opening onto the garden",
        caption: "The bedroom held against the garden",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Steps and tropical planting along the veranda",
        caption: "Steps and planting along the veranda edge",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaDining",
        },
        alt: "The dining pavilion open to the hills",
        caption: "The dining pavilion open to the hills",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPalms",
        },
        alt: "The house beneath the palms",
        caption: "The house beneath the palms, Murud",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "parikramaVerandaOpen",
      },
      alt: "The veranda with its sliding glass pockets fully open",
      heading: "Where the house opens, Durall enters.",
      paragraphs: [
        "The parikrama depends on thresholds that disappear — full-height openings where living spaces continue into veranda and grove.",
        "Durall Systems joined the project as window consultant, resolving the minimal glazing that allows stone, timber and landscape to read as one continuous space.",
      ],
      facts: [
        {
          label: "Role",
          value: "Window Consultant",
        },
        {
          label: "System",
          value: "PanoramAH! by Jofebar",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
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
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "The bedroom against the garden in evening light",
      heading: "Stone, glass, landscape — and the light that moves through them.",
      body: "By day the house shades and breathes; by evening the glazing turns lantern-like against the grove. The apparent simplicity of the whole rests on precise technical resolution — the quiet work behind every opening.",
    },
    inPortfolio: false,
    home: {
      show: true,
      title: "Parikrama, Murud House",
      subtitle: "Murud — Spasm Architects",
      image: {
        kind: "asset",
        key: "cardParikrama",
      },
    },
    isFeatured: true,
    feature: {
      eyebrow: "Featured Project",
      location: "Murud, Maharashtra",
      title: ["Parikrama,", "Murud House"],
      architect: "SPASM Architects",
      description:
        "A tropical residence shaped around landscape, light and a continuous relationship between inside and outside. Set along the Konkan coast, Parikrama is a quiet dialogue with its surroundings — open to the climate, grounded in nature, and designed for a slower way of living.",
      specs: [
        {
          label: "Typology",
          value: "Residence",
        },
        {
          label: "Architect",
          value: "SPASM Architects",
        },
        {
          label: "Durall’s Role",
          value: "Systems ·\nEngineering Execution",
        },
      ],
      award: {
        name: "Architectural Hunter Award",
        year: "2025",
      },
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectFeatured",
          },
          alt: "Parikrama, Murud House — SPASM Architects",
        },
        {
          image: {
            kind: "asset",
            key: "projectPatina",
          },
          alt: "Patina — Studio MK27",
        },
        {
          image: {
            kind: "asset",
            key: "projectSentosa",
          },
          alt: "Sentosa House — Studio MK27",
        },
        {
          image: {
            kind: "asset",
            key: "projectChiltron",
          },
          alt: "Chiltron House — WOW Architects",
        },
        {
          image: {
            kind: "asset",
            key: "projectJuhu",
          },
          alt: "Juhu House — Ernesto Bedmar",
        },
        {
          image: {
            kind: "asset",
            key: "projectBangalore",
          },
          alt: "Project Bangalore — WOW Architects",
        },
        {
          image: {
            kind: "asset",
            key: "projectBanyan",
          },
          alt: "Banyan Villa — Studio MK27",
        },
      ],
    },
  },
  {
    id: "project-patina",
    slug: "patina",
    status: "published",
    order: 1,
    nextSlug: "chiltron-house",
    placeholder: true,
    name: "Patina",
    title: ["Patina"],
    location: "Maldives",
    architect: "Studio MK27",
    year: 2024,
    categories: ["Hospitality", "International"],
    description: "Patina by Studio MK27, Maldives. Case study in preparation.",
    figure: {
      label: "Completed",
      value: 2024,
      unit: "",
    },
    hero: {
      image: {
        kind: "asset",
        key: "projectPatina",
      },
      alt: "Patina — Studio MK27, Maldives",
    },
    card: null,
    facts: [
      {
        label: "Project",
        value: "Patina",
      },
      {
        label: "Architect",
        value: "Studio MK27",
      },
      {
        label: "Location",
        value: "Maldives",
      },
      {
        label: "Typology",
        value: "Hospitality · International",
      },
      {
        label: "Completed",
        value: "2024",
      },
      {
        label: "Area",
        value: "To be confirmed",
      },
      {
        label: "Durall Role",
        value: "To be confirmed",
      },
      {
        label: "System",
        value: "To be confirmed",
      },
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        "Placeholder text. This is where the story of Patina will be told — Studio MK27’s hospitality project in Maldives, and how it meets its site.",
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    plates: [
      {
        image: {
          kind: "asset",
          key: "projectPatina",
        },
        alt: "Patina — Studio MK27, Maldives",
        caption: "Patina, Maldives",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaDining",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "projectPatina",
      },
      alt: "Patina — Studio MK27, Maldives",
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        {
          label: "Role",
          value: "To be confirmed",
        },
        {
          label: "System",
          value: "To be confirmed",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
      alt: "Placeholder photograph",
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "Placeholder photograph",
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
    inPortfolio: true,
    home: {
      show: true,
      title: "Patina",
      subtitle: "Maldives — Studio MK27",
      image: {
        kind: "asset",
        key: "cardPatina",
      },
    },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "Maldives",
      title: ["Patina"],
      architect: "Studio MK27",
      description: "Patina by Studio MK27, Maldives. Case study in preparation.",
      specs: [],
      award: null,
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectPatina",
          },
          alt: "Patina — Studio MK27, Maldives",
        },
      ],
    },
  },
  {
    id: "project-sentosa-house",
    slug: "sentosa-house",
    status: "published",
    order: 2,
    nextSlug: "patina",
    placeholder: true,
    name: "Sentosa House",
    title: ["Sentosa", "House"],
    location: "Singapore",
    architect: "Studio MK27",
    year: 2023,
    categories: ["Residential", "International"],
    description: "Sentosa House by Studio MK27, Singapore. Case study in preparation.",
    figure: {
      label: "Completed",
      value: 2023,
      unit: "",
    },
    hero: {
      image: {
        kind: "asset",
        key: "projectSentosa",
      },
      alt: "Sentosa House — Studio MK27, Singapore",
    },
    card: {
      image: {
        kind: "asset",
        key: "sentosaLibrary",
      },
      alt: "The library wall at Sentosa House",
    },
    facts: [
      {
        label: "Project",
        value: "Sentosa House",
      },
      {
        label: "Architect",
        value: "Studio MK27",
      },
      {
        label: "Location",
        value: "Singapore",
      },
      {
        label: "Typology",
        value: "Residential · International",
      },
      {
        label: "Completed",
        value: "2023",
      },
      {
        label: "Area",
        value: "To be confirmed",
      },
      {
        label: "Durall Role",
        value: "To be confirmed",
      },
      {
        label: "System",
        value: "To be confirmed",
      },
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        "Placeholder text. This is where the story of Sentosa House will be told — Studio MK27’s residential project in Singapore, and how it meets its site.",
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    plates: [
      {
        image: {
          kind: "asset",
          key: "projectSentosa",
        },
        alt: "Sentosa House — Studio MK27, Singapore",
        caption: "Sentosa House, Singapore",
      },
      {
        image: {
          kind: "asset",
          key: "sentosaLibrary",
        },
        alt: "The library wall at Sentosa House",
        caption: "Sentosa House, Singapore",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "projectSentosa",
      },
      alt: "Sentosa House — Studio MK27, Singapore",
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        {
          label: "Role",
          value: "To be confirmed",
        },
        {
          label: "System",
          value: "To be confirmed",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
      alt: "Placeholder photograph",
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "Placeholder photograph",
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
    inPortfolio: true,
    home: {
      show: false,
      title: "Sentosa House",
      subtitle: "Singapore — Studio MK27",
      image: {
        kind: "asset",
        key: "projectSentosa",
      },
    },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "Singapore",
      title: ["Sentosa", "House"],
      architect: "Studio MK27",
      description: "Sentosa House by Studio MK27, Singapore. Case study in preparation.",
      specs: [],
      award: null,
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectSentosa",
          },
          alt: "Sentosa House — Studio MK27, Singapore",
        },
      ],
    },
  },
  {
    id: "project-chiltron-house",
    slug: "chiltron-house",
    status: "published",
    order: 3,
    nextSlug: "",
    placeholder: true,
    name: "Chiltron House",
    title: ["Chiltron", "House"],
    location: "Singapore",
    architect: "WOW Architects",
    year: 2022,
    categories: ["Residential", "International"],
    description: "Chiltron House by WOW Architects, Singapore. Case study in preparation.",
    figure: {
      label: "Completed",
      value: 2022,
      unit: "",
    },
    hero: {
      image: {
        kind: "asset",
        key: "projectChiltron",
      },
      alt: "Chiltron House — WOW Architects, Singapore",
    },
    card: null,
    facts: [
      {
        label: "Project",
        value: "Chiltron House",
      },
      {
        label: "Architect",
        value: "WOW Architects",
      },
      {
        label: "Location",
        value: "Singapore",
      },
      {
        label: "Typology",
        value: "Residential · International",
      },
      {
        label: "Completed",
        value: "2022",
      },
      {
        label: "Area",
        value: "To be confirmed",
      },
      {
        label: "Durall Role",
        value: "To be confirmed",
      },
      {
        label: "System",
        value: "To be confirmed",
      },
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        "Placeholder text. This is where the story of Chiltron House will be told — WOW Architects’s residential project in Singapore, and how it meets its site.",
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    plates: [
      {
        image: {
          kind: "asset",
          key: "projectChiltron",
        },
        alt: "Chiltron House — WOW Architects, Singapore",
        caption: "Chiltron House, Singapore",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaDining",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "projectChiltron",
      },
      alt: "Chiltron House — WOW Architects, Singapore",
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        {
          label: "Role",
          value: "To be confirmed",
        },
        {
          label: "System",
          value: "To be confirmed",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
      alt: "Placeholder photograph",
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "Placeholder photograph",
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
    inPortfolio: true,
    home: {
      show: true,
      title: "Chiltron House",
      subtitle: "Singapore — WOW Architects",
      image: {
        kind: "asset",
        key: "cardChiltron",
      },
    },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "Singapore",
      title: ["Chiltron", "House"],
      architect: "WOW Architects",
      description: "Chiltron House by WOW Architects, Singapore. Case study in preparation.",
      specs: [],
      award: null,
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectChiltron",
          },
          alt: "Chiltron House — WOW Architects, Singapore",
        },
      ],
    },
  },
  {
    id: "project-juhu-house",
    slug: "juhu-house",
    status: "published",
    order: 4,
    nextSlug: "",
    placeholder: true,
    name: "Juhu House",
    title: ["Juhu", "House"],
    location: "Mumbai",
    architect: "Ernesto Bedmar",
    year: 2021,
    categories: ["Residential"],
    description: "Juhu House by Ernesto Bedmar, Mumbai. Case study in preparation.",
    figure: {
      label: "Completed",
      value: 2021,
      unit: "",
    },
    hero: {
      image: {
        kind: "asset",
        key: "projectJuhu",
      },
      alt: "Juhu House — Ernesto Bedmar, Mumbai",
    },
    card: null,
    facts: [
      {
        label: "Project",
        value: "Juhu House",
      },
      {
        label: "Architect",
        value: "Ernesto Bedmar",
      },
      {
        label: "Location",
        value: "Mumbai",
      },
      {
        label: "Typology",
        value: "Residential",
      },
      {
        label: "Completed",
        value: "2021",
      },
      {
        label: "Area",
        value: "To be confirmed",
      },
      {
        label: "Durall Role",
        value: "To be confirmed",
      },
      {
        label: "System",
        value: "To be confirmed",
      },
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        "Placeholder text. This is where the story of Juhu House will be told — Ernesto Bedmar’s residential project in Mumbai, and how it meets its site.",
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    plates: [
      {
        image: {
          kind: "asset",
          key: "projectJuhu",
        },
        alt: "Juhu House — Ernesto Bedmar, Mumbai",
        caption: "Juhu House, Mumbai",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaDining",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "projectJuhu",
      },
      alt: "Juhu House — Ernesto Bedmar, Mumbai",
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        {
          label: "Role",
          value: "To be confirmed",
        },
        {
          label: "System",
          value: "To be confirmed",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
      alt: "Placeholder photograph",
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "Placeholder photograph",
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
    inPortfolio: true,
    home: {
      show: true,
      title: "Juhu house",
      subtitle: "Mumbai — Ernesto Bedmar",
      image: {
        kind: "asset",
        key: "cardJuhu",
      },
    },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "Mumbai",
      title: ["Juhu", "House"],
      architect: "Ernesto Bedmar",
      description: "Juhu House by Ernesto Bedmar, Mumbai. Case study in preparation.",
      specs: [],
      award: null,
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectJuhu",
          },
          alt: "Juhu House — Ernesto Bedmar, Mumbai",
        },
      ],
    },
  },
  {
    id: "project-project-bangalore",
    slug: "project-bangalore",
    status: "published",
    order: 5,
    nextSlug: "",
    placeholder: true,
    name: "Project Bangalore",
    title: ["Project", "Bangalore"],
    location: "Bangalore, Karnataka",
    architect: "WOW Architects",
    year: 2025,
    categories: ["Commercial", "Institutional"],
    description:
      "Project Bangalore by WOW Architects, Bangalore, Karnataka. Case study in preparation.",
    figure: {
      label: "Completed",
      value: 2025,
      unit: "",
    },
    hero: {
      image: {
        kind: "asset",
        key: "projectBangalore",
      },
      alt: "Project Bangalore — WOW Architects, Bangalore, Karnataka",
    },
    card: null,
    facts: [
      {
        label: "Project",
        value: "Project Bangalore",
      },
      {
        label: "Architect",
        value: "WOW Architects",
      },
      {
        label: "Location",
        value: "Bangalore, Karnataka",
      },
      {
        label: "Typology",
        value: "Commercial · Institutional",
      },
      {
        label: "Completed",
        value: "2025",
      },
      {
        label: "Area",
        value: "To be confirmed",
      },
      {
        label: "Durall Role",
        value: "To be confirmed",
      },
      {
        label: "System",
        value: "To be confirmed",
      },
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        "Placeholder text. This is where the story of Project Bangalore will be told — WOW Architects’s commercial project in Bangalore, Karnataka, and how it meets its site.",
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    plates: [
      {
        image: {
          kind: "asset",
          key: "projectBangalore",
        },
        alt: "Project Bangalore — WOW Architects, Bangalore, Karnataka",
        caption: "Project Bangalore, Bangalore, Karnataka",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaDining",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "projectBangalore",
      },
      alt: "Project Bangalore — WOW Architects, Bangalore, Karnataka",
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        {
          label: "Role",
          value: "To be confirmed",
        },
        {
          label: "System",
          value: "To be confirmed",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
      alt: "Placeholder photograph",
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "Placeholder photograph",
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
    inPortfolio: true,
    home: {
      show: false,
      title: "Project Bangalore",
      subtitle: "Bangalore, Karnataka — WOW Architects",
      image: {
        kind: "asset",
        key: "projectBangalore",
      },
    },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "Bangalore, Karnataka",
      title: ["Project", "Bangalore"],
      architect: "WOW Architects",
      description:
        "Project Bangalore by WOW Architects, Bangalore, Karnataka. Case study in preparation.",
      specs: [],
      award: null,
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectBangalore",
          },
          alt: "Project Bangalore — WOW Architects, Bangalore, Karnataka",
        },
      ],
    },
  },
  {
    id: "project-banyan-villa",
    slug: "banyan-villa",
    status: "published",
    order: 6,
    nextSlug: "",
    placeholder: true,
    name: "Banyan Villa",
    title: ["Banyan", "Villa"],
    location: "Phuket",
    architect: "Studio MK27",
    year: 2020,
    categories: ["Hospitality", "International"],
    description: "Banyan Villa by Studio MK27, Phuket. Case study in preparation.",
    figure: {
      label: "Completed",
      value: 2020,
      unit: "",
    },
    hero: {
      image: {
        kind: "asset",
        key: "projectBanyan",
      },
      alt: "Banyan Villa — Studio MK27, Phuket",
    },
    card: null,
    facts: [
      {
        label: "Project",
        value: "Banyan Villa",
      },
      {
        label: "Architect",
        value: "Studio MK27",
      },
      {
        label: "Location",
        value: "Phuket",
      },
      {
        label: "Typology",
        value: "Hospitality · International",
      },
      {
        label: "Completed",
        value: "2020",
      },
      {
        label: "Area",
        value: "To be confirmed",
      },
      {
        label: "Durall Role",
        value: "To be confirmed",
      },
      {
        label: "System",
        value: "To be confirmed",
      },
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        "Placeholder text. This is where the story of Banyan Villa will be told — Studio MK27’s hospitality project in Phuket, and how it meets its site.",
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    plates: [
      {
        image: {
          kind: "asset",
          key: "projectBanyan",
        },
        alt: "Banyan Villa — Studio MK27, Phuket",
        caption: "Banyan Villa, Phuket",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaDining",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "projectBanyan",
      },
      alt: "Banyan Villa — Studio MK27, Phuket",
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        {
          label: "Role",
          value: "To be confirmed",
        },
        {
          label: "System",
          value: "To be confirmed",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
      alt: "Placeholder photograph",
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "Placeholder photograph",
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
    inPortfolio: true,
    home: {
      show: false,
      title: "Banyan Villa",
      subtitle: "Phuket — Studio MK27",
      image: {
        kind: "asset",
        key: "projectBanyan",
      },
    },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "Phuket",
      title: ["Banyan", "Villa"],
      architect: "Studio MK27",
      description: "Banyan Villa by Studio MK27, Phuket. Case study in preparation.",
      specs: [],
      award: null,
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectBanyan",
          },
          alt: "Banyan Villa — Studio MK27, Phuket",
        },
      ],
    },
  },
  {
    id: "project-ritz-carlton-maldives",
    slug: "ritz-carlton-maldives",
    status: "published",
    order: 7,
    nextSlug: "",
    placeholder: true,
    name: "Ritz-Carlton, Maldives",
    title: ["Ritz-Carlton", "Maldives"],
    location: "Maldives",
    architect: "Kerry Hill Architects",
    year: null,
    categories: ["Hospitality", "International"],
    description:
      "Ritz-Carlton, Maldives by Kerry Hill Architects, Maldives. Case study in preparation.",
    figure: null,
    hero: {
      image: {
        kind: "asset",
        key: "projectRitz",
      },
      alt: "Ritz-Carlton, Maldives — Kerry Hill Architects, Maldives",
    },
    card: null,
    facts: [
      {
        label: "Project",
        value: "Ritz-Carlton, Maldives",
      },
      {
        label: "Architect",
        value: "Kerry Hill Architects",
      },
      {
        label: "Location",
        value: "Maldives",
      },
      {
        label: "Typology",
        value: "Hospitality · International",
      },
      {
        label: "Completed",
        value: "To be confirmed",
      },
      {
        label: "Area",
        value: "To be confirmed",
      },
      {
        label: "Durall Role",
        value: "To be confirmed",
      },
      {
        label: "System",
        value: "To be confirmed",
      },
    ],
    intro: {
      heading: "Case study in preparation.",
      paragraphs: [
        "Placeholder text. This is where the story of Ritz-Carlton, Maldives will be told — Kerry Hill Architects’s hospitality project in Maldives, and how it meets its site.",
        "The architectural intent, the envelope and the details Durall resolved will be written up here once the case study is complete.",
      ],
    },
    plates: [
      {
        image: {
          kind: "asset",
          key: "projectRitz",
        },
        alt: "Ritz-Carlton, Maldives — Kerry Hill Architects, Maldives",
        caption: "Ritz-Carlton, Maldives, Maldives",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaPavilion",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaVeranda",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGarden",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaGrove",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaBedroom",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaSteps",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
      {
        image: {
          kind: "asset",
          key: "parikramaDining",
        },
        alt: "Placeholder photograph",
        caption: "Placeholder photograph — to be replaced with this project’s own",
      },
    ],
    scope: {
      image: {
        kind: "asset",
        key: "projectRitz",
      },
      alt: "Ritz-Carlton, Maldives — Kerry Hill Architects, Maldives",
      heading: "Durall’s scope — to be confirmed.",
      paragraphs: [
        "Placeholder text. Durall’s role on this project — the openings it engineered and the systems it specified — will be described here.",
      ],
      facts: [
        {
          label: "Role",
          value: "To be confirmed",
        },
        {
          label: "System",
          value: "To be confirmed",
        },
      ],
    },
    system: {
      image: {
        kind: "asset",
        key: "parikramaPavilionOpen",
      },
      alt: "Placeholder photograph",
      title: ["System", "to be confirmed"],
      body: "Placeholder text. The window, door or facade system used on this project, and why it was chosen, will be described here.",
      points: [
        "System details to follow",
        "Performance data to follow",
        "Installation notes to follow",
      ],
    },
    experience: {
      image: {
        kind: "asset",
        key: "parikramaBedroomEvening",
      },
      alt: "Placeholder photograph",
      heading: "The finished building — to follow.",
      body: "Placeholder text. A closing note on light, landscape and daily life in the finished building will go here.",
    },
    inPortfolio: false,
    home: {
      show: true,
      title: "Ritz-Carlton",
      subtitle: "Maldives — Kerry Hill Architects",
      image: {
        kind: "asset",
        key: "cardRitz",
      },
    },
    isFeatured: false,
    feature: {
      eyebrow: "Featured Project",
      location: "Maldives",
      title: ["Ritz-Carlton", "Maldives"],
      architect: "Kerry Hill Architects",
      description:
        "Ritz-Carlton, Maldives by Kerry Hill Architects, Maldives. Case study in preparation.",
      specs: [],
      award: null,
      gallery: [
        {
          image: {
            kind: "asset",
            key: "projectRitz",
          },
          alt: "Ritz-Carlton, Maldives — Kerry Hill Architects, Maldives",
        },
      ],
    },
  },
];
