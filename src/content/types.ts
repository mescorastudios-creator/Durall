/**
 * The shape of everything the admin panel can edit.
 *
 * Content is plain JSON: it is stored as-is in the database (see
 * supabase/migrations) and the bundled seed in ./seed is the same shape, so
 * the site renders identically whichever one it was given. Nothing here may
 * hold a function, a component or an imported module — icons are stored by
 * name (./icons.ts) and images by reference (`ImageRef`).
 *
 * Text conventions, shared by the editor and the renderers in ./render.tsx:
 * - A newline in a heading is a forced line break (`<br />`).
 * - `TwoTone` is a heading whose second clause is set in the muted colour.
 * - Links are one string: "/about", "/about#approach", "#philosophy",
 *   "mailto:…", "tel:…" or "https://…".
 */

/* ── Primitives ─────────────────────────────────────────────────────────── */

/** An image bundled with the site (a key of IMAGES) or one uploaded in the admin. */
export type ImageRef =
  | { kind: "asset"; key: string }
  | {
      kind: "upload";
      id: string;
      src: string;
      width: number;
      height: number;
      srcSet?: string | undefined;
    };

export type Photo = { image: ImageRef; alt: string };

export type TwoTone = { text: string; muted: string };

export type Cta = { label: string; href: string };

export type Fact = { label: string; value: string };

export type Seo = {
  title: string;
  description: string;
  /** Share image for this page; the site default when null. */
  image: Photo | null;
};

/** Heading, body and action of the navy closing band (PageCta). */
export type CtaBand = {
  eyebrow: string;
  heading: string;
  body: string;
  action: Cta;
};

export type IconItem = { icon: string; title: string; body: string };

export type Status = "draft" | "published";

/* ── Site-wide ──────────────────────────────────────────────────────────── */

export type NavItem = {
  label: string;
  /** The accessible name and mobile-menu label, where it differs. */
  fullLabel: string;
  href: string;
  visible: boolean;
};

export type FooterColumn = { title: string; links: Cta[] };

export type ContactDetail = {
  icon: string;
  label: string;
  value: string;
  href: string;
  note: string;
};

export type SiteSettings = {
  company: {
    name: string;
    legalName: string;
    tagline: string;
  };
  contact: {
    details: ContactDetail[];
    responseNote: string;
    careersEmail: string;
  };
  office: {
    name: string;
    lines: string[];
    plusCode: string;
    lng: number;
    lat: number;
    note: string;
    directions: string;
    googleMaps: string;
  };
  header: {
    items: NavItem[];
    /** The button at the end of the bar. */
    cta: Cta;
    menuTagline: string;
  };
  footer: {
    /** The paragraph under the logo and tagline. */
    blurb: string;
    columns: FooterColumn[];
    officeHeading: string;
    contactHeading: string;
    /** The line under the email and phone. */
    hours: string;
    social: Cta[];
    legal: Cta[];
    backToTop: string;
  };
  seo: {
    shareImage: string;
    shareImageAlt: string;
  };
  behaviour: {
    loadingScreen: boolean;
    pageTransition: boolean;
  };
  notFound: { heading: string; body: string; action: string };
};

/* ── Sections shared by several pages ──────────────────────────────────── */

export type ProcessStage = { title: string; body: string; photo: Photo };

export type SharedContent = {
  process: {
    heading: TwoTone;
    lede: string;
    stages: ProcessStage[];
    link: Cta;
  };
  /** "Let's frame the view.": the navy enquiry band with the project
   * slideshow, at the foot of Home, About, Partners and Expertise. */
  enquiryBand: {
    heading: string;
    lede: string;
    fields: {
      name: FormField;
      email: FormField;
      phone: FormField;
      location: FormField;
      message: FormField;
    };
    submit: string;
    sending: string;
    sentHeading: string;
    sentAgain: string;
    /** The words before the email address beside the button. */
    writeTo: string;
    /** The button on each slide. */
    viewProject: string;
  };
};

/* ── Collections ────────────────────────────────────────────────────────── */

export type Plate = Photo & { caption: string };

/** How a project appears as the featured project at the top of /projects. */
export type ProjectFeature = {
  eyebrow: string;
  location: string;
  title: string[];
  architect: string;
  description: string;
  specs: Fact[];
  award: { name: string; year: string } | null;
  gallery: Photo[];
};

export type ProjectDoc = {
  id: string;
  slug: string;
  status: Status;
  /** Position in the portfolio and in the "next project" sequence. */
  order: number;
  /** The project linked as "Next project"; empty for the next one in order. */
  nextSlug: string;
  /** A page standing in for a case study not yet written. */
  placeholder: boolean;
  name: string;
  /** The display title, one entry per line. */
  title: string[];
  location: string;
  architect: string;
  year: number | null;
  categories: string[];
  description: string;
  /** The figure that rolls in on the hero, odometer-style. */
  figure: { label: string; value: number; unit: string } | null;
  hero: Photo;
  /** The photograph used when another page offers this one as "next". */
  card: Photo | null;
  facts: Fact[];
  intro: { heading: string; paragraphs: string[] };
  plates: Plate[];
  scope: Photo & { heading: string; paragraphs: string[]; facts: Fact[] };
  system: Photo & { title: string[]; body: string; points: string[] };
  experience: Photo & { heading: string; body: string };
  /** Listed in the /projects grid (the featured project never is). */
  inPortfolio: boolean;
  /** The square card in "What we've built together" on the home page. */
  home: { show: boolean; title: string; subtitle: string; image: ImageRef };
  isFeatured: boolean;
  feature: ProjectFeature;
};

export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; photo: Photo; caption: string };

export type ArticleDoc = {
  id: string;
  slug: string;
  status: Status;
  /** Pinned to the top of the list, ahead of the newest. */
  pinned: boolean;
  category: string;
  /** yyyy-mm-dd */
  publishedAt: string;
  readingTime: string;
  title: string;
  excerpt: string;
  cover: Photo;
  body: ArticleBlock[];
};

export type RoleDoc = {
  id: string;
  order: number;
  open: boolean;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
};

export type PartnerDoc = {
  id: string;
  kind: "partner" | "practice";
  order: number;
  visible: boolean;
  /** The typographic stand-in drawn when there is no logo file. */
  mark: string;
  logo: { image: ImageRef; height: number } | null;
  name: string;
  country: string;
  description: string;
};

/* ── Pages ──────────────────────────────────────────────────────────────── */

export type HomePage = {
  seo: Seo;
  hero: {
    photo: Photo;
    heading: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
  philosophy: {
    heading: TwoTone;
    paragraphs: string[];
    link: Cta;
    photo: Photo;
  };
  projects: { heading: string; lede: string };
  insights: { heading: string };
};

/** The full-width photographic opening (About, Partners, Projects,
 * Expertise). Newlines in the heading are forced line breaks. */
export type PhotoHero = {
  photo: Photo;
  heading: string;
  body: string;
};

export type AboutPage = {
  seo: Seo;
  opening: PhotoHero;
  philosophy: {
    heading: string;
    body: string;
    emphasis: string;
    link: Cta;
    features: IconItem[];
    photo: Photo;
  };
  spec: {
    photo: Photo;
    value: string;
    unit: string;
    label: string;
    note: string;
    drawing: Photo;
    metrics: { icon: string; label: string; value: string }[];
    captionLeft: string;
    captionRight: string;
  };
  meets: { heading: string; paragraphs: string[]; photo: Photo };
  approach: {
    eyebrow: string;
    heading: string;
    body: string;
    capabilities: IconItem[];
    mark: Photo;
    drawing: Photo;
    outcomeTitle: string;
    outcomeBody: string;
  };
};

export type PartnersPage = {
  seo: Seo;
  opening: PhotoHero;
  network: {
    eyebrow: string;
    heading: string;
    body: string;
    /** Drawn faintly behind the partner grid; decorative, so no alt text. */
    map: ImageRef;
    quote: string;
  };
  practices: {
    eyebrow: string;
    heading: string;
    lead: string;
    note: string;
    photo: Photo;
    tagline: string;
  };
};

/** The plain white opening band (PageIntro). */
export type Intro = { title: string; lede: string };

/** One of the six numbered parts of the Expertise page's sill section. */
export type AnatomyPart = { title: string; body: string; appliesTo: string };

/** A tested figure on the Expertise page, with its rating out of `of`. */
export type Metric = {
  label: string;
  value: string;
  /** Set smaller after the value, e.g. W/m²K. */
  unit: string;
  rating: number;
  of: number;
  standard: string;
};

export type ExpertisePage = {
  seo: Seo;
  opening: PhotoHero & {
    /** Credit for the photograph, bottom right. */
    credit: string;
    /** The strip along the foot: a count, its label and the systems. */
    ribbon: { count: string; label: string; items: string[] };
  };
  statement: { eyebrow: string; text: TwoTone };
  anatomy: {
    eyebrow: string;
    heading: string;
    body: string;
    /** Exactly six, matching the numbers on the drawing. */
    parts: AnatomyPart[];
    appliesToLabel: string;
    outside: string;
    inside: string;
    elevation: string;
    detail: Fact;
    drawing: { label: string; title: string; hint: string };
    scale: Fact;
    /** Hidden until it links to a file. */
    download: Cta & { heading: string };
  };
  process: { eyebrow: string };
  performance: {
    eyebrow: string;
    heading: string;
    body: string;
    metrics: Metric[];
    low: string;
    high: string;
    note: string;
    /** Hidden until it links to a file. */
    download: Cta;
  };
  architects: {
    eyebrow: string;
    heading: string;
    body: string;
    /** The second card is drawn in navy, as in the design. */
    cards: { title: string; body: string; link: Cta }[];
  };
};

export type CareersPage = {
  seo: Seo;
  hero: { heading: string; body: string; cta: Cta; photo: Photo };
  /** One sentence over a full-bleed photograph (decorative, so no alt). */
  band: { heading: string; image: ImageRef };
  why: { heading: string; reasons: { title: string; body: string }[] };
  openings: {
    heading: string;
    /** Shown when no role is open; "{email}" becomes the careers address. */
    empty: string;
    applyLabel: string;
    howHeading: string;
    howBody: string;
  };
  cta: CtaBand;
};

export type InsightsPage = {
  seo: Seo;
  intro: Intro;
  cta: CtaBand;
  /** The chrome around every article. */
  article: { backLabel: string; moreHeading: string; cta: CtaBand };
};

type FormField = { label: string; placeholder: string };

export type ContactPage = {
  seo: Seo;
  intro: Intro;
  map: { eyebrow: string; directions: string; openInMaps: string };
  formHeading: string;
  form: {
    name: FormField;
    email: FormField;
    subject: FormField;
    message: FormField;
    submit: string;
    sending: string;
    sentHeading: string;
    sentAgain: string;
  };
  detailsHeading: string;
};

export type ProjectsPage = {
  seo: Seo;
  opening: PhotoHero;
  featured: { exploreLabel: string };
  grid: { sort: string; view: string; empty: string };
  cta: CtaBand;
  /** The labels around every project's own page. */
  detail: {
    heroPrefix: string;
    info: string;
    intro: string;
    gallery: string;
    plates: string;
    scope: string;
    system: string;
    experience: string;
    next: string;
    cta: CtaBand;
  };
};

export type PageMap = {
  home: HomePage;
  about: AboutPage;
  partners: PartnersPage;
  expertise: ExpertisePage;
  careers: CareersPage;
  insights: InsightsPage;
  contact: ContactPage;
  projects: ProjectsPage;
};

export type PageKey = keyof PageMap;
