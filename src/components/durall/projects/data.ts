import { IMAGES, type ImageAsset } from "@/assets/images";

export const CATEGORIES = [
  "All",
  "Residential",
  "Hospitality",
  "Commercial",
  "Institutional",
  "International",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "name", label: "A – Z" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

export type Project = {
  index: string;
  name: string;
  location: string;
  architect: string;
  categories: Category[];
  image: ImageAsset;
  year: number;
};

export const FEATURED = {
  eyebrow: "Featured Project",
  location: "Murud, Maharashtra",
  title: ["Parikrama,", "Murud House"],
  architect: "SPASM Architects",
  description:
    "A tropical residence shaped around landscape, light and a continuous relationship between inside and outside. Set along the Konkan coast, Parikrama is a quiet dialogue with its surroundings — open to the climate, grounded in nature, and designed for a slower way of living.",
  specs: [
    { label: "Typology", value: "Residence" },
    { label: "Architect", value: "SPASM Architects" },
    { label: "Durall’s Role", value: "Systems ·\nEngineering Execution" },
  ],
  award: { name: "Architectural Hunter Award", year: "2025" },
};

export const PROJECTS: Project[] = [
  {
    index: "02",
    name: "Patina",
    location: "Maldives",
    architect: "Studio MK27",
    categories: ["Hospitality", "International"],
    image: IMAGES.projectPatina,
    year: 2024,
  },
  {
    index: "03",
    name: "Sentosa House",
    location: "Singapore",
    architect: "Studio MK27",
    categories: ["Residential", "International"],
    image: IMAGES.projectSentosa,
    year: 2023,
  },
  {
    index: "04",
    name: "Chiltron House",
    location: "Singapore",
    architect: "WOW Architects",
    categories: ["Residential", "International"],
    image: IMAGES.projectChiltron,
    year: 2022,
  },
  {
    index: "05",
    name: "Juhu House",
    location: "Mumbai",
    architect: "Ernesto Bedmar",
    categories: ["Residential"],
    image: IMAGES.projectJuhu,
    year: 2021,
  },
  {
    index: "06",
    name: "Project Bangalore",
    location: "Bangalore, Karnataka",
    architect: "WOW Architects",
    categories: ["Commercial", "Institutional"],
    image: IMAGES.projectBangalore,
    year: 2025,
  },
  {
    index: "07",
    name: "Banyan Villa",
    location: "Phuket",
    architect: "Studio MK27",
    categories: ["Hospitality", "International"],
    image: IMAGES.projectBanyan,
    year: 2020,
  },
];

/** Featured gallery: the hero frame plus the portfolio photos ("01 / 07"). */
export const FEATURED_GALLERY = [
  { image: IMAGES.projectFeatured, alt: "Parikrama, Murud House — SPASM Architects" },
  ...PROJECTS.map((p) => ({ image: p.image, alt: `${p.name} — ${p.architect}` })),
];
