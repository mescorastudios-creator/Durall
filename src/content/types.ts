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

/** `caption` is the line on the photograph in the home page's scene: the
 * project it shows. */
export type ProcessStage = { title: string; body: string; photo: Photo; caption?: string };

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
    /** The optional tick box above the button. */
    subscribe: { label: string; note: string };
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
  | { type: "image"; photo: Photo; caption: string }
  /** A YouTube or Vimeo film inside the text. */
  | { type: "video"; url: string; caption: string };

/** A film hosted on YouTube or Vimeo: the address as pasted, and its length. */
export type VideoRef = { url: string; duration: string };

export type ArticleDoc = {
  id: string;
  slug: string;
  status: Status;
  /** Pinned to the top of the list, ahead of the newest. */
  pinned: boolean;
  /** A film leads with its player instead of the cover photograph. */
  format: "article" | "video";
  video: VideoRef;
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

/** A project named under one kind of work on the Expertise page. */
export type TrustedProject = {
  name: string;
  /** Under the name in the list: "Ahmedabad". */
  place: string;
  /** Over the photograph: "SPASM Design Architects · Ahmedabad". */
  credit: string;
  /** The large photograph; an empty frame is drawn until there is one. */
  photo: Photo | null;
  /** A different picture for the small one in the list; the large one when null. */
  thumb: Photo | null;
  /** The project's own page; "View project" is hidden while this is empty. */
  href: string;
};

export type ExpertisePage = {
  seo: Seo;
  opening: PhotoHero;
  /** "The world's finest systems…": the statement under the hero. */
  intro: { eyebrow: string; heading: string; body: string; link: Cta };
  /** "Concept to commissioning": the stages side by side, each with a picture. */
  process: {
    heading: string;
    lede: string;
    stages: { title: string; summary: string; body: string; photo: Photo }[];
    footLeft: string;
    footRight: string;
  };
  /** The navy section: kinds of work, and the projects each was delivered on. */
  trusted: {
    eyebrow: string;
    heading: string;
    body: string;
    /** Before the number of projects: "Seen at". */
    seenAt: string;
    viewProject: string;
    kinds: { title: string; body: string; projects: TrustedProject[] }[];
  };
  /** "Decided on paper": the steps beside the sill drawing. */
  detail: {
    eyebrow: string;
    heading: string;
    body: string;
    steps: { title: string; body: string }[];
    /** The photograph the drawing is laid over. */
    photo: Photo;
    drawingLabel: string;
    credit: string;
    scale: string;
  };
  cta: CtaBand;
};

export type CareersPage = {
  seo: Seo;
  opening: PhotoHero & {
    /** Credit for the photograph, bottom right. */
    credit: string;
    /** Beside the number of open roles, along the foot. */
    rolesLabel: string;
    /** The link down to the list. */
    viewRoles: string;
  };
  /** The list of open roles; the roles themselves are a collection. */
  roles: {
    eyebrow: string;
    heading: string;
    /** The filter that shows every team. */
    allRoles: string;
    columns: { role: string; team: string; location: string; type: string };
    applyLabel: string;
    /** Small print under the list; hidden when empty. */
    note: string;
    /** Shown when no role is open; "{email}" becomes the careers address. */
    empty: string;
  };
  /** "Don't see your role?": the open application under the list. */
  open: { heading: string; body: string; action: string; orWrite: string };
};

export type InsightsPage = {
  seo: Seo;
  intro: Intro;
  /** Words on every card: the two formats and their links. */
  labels: { article: string; film: string; read: string; watch: string; play: string };
  /** The films band, shown once there is a published film. */
  films: { heading: string; lede: string; notes: string };
  /** The full list and its filters. */
  index: {
    heading: string;
    allTopics: string;
    allFormats: string;
    articles: string;
    films: string;
    empty: string;
    showAll: string;
  };
  cta: CtaBand;
  /** The chrome around every article. */
  article: {
    backLabel: string;
    moreHeading: string;
    /** The list of the article's sections beside the text. */
    contents: string;
    share: string;
    copyLink: string;
    copied: string;
    cta: CtaBand;
  };
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
