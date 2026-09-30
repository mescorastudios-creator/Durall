import type { SiteSettings } from "../types";

/* TODO — the email and phone are deliberate placeholders, as they were in
 * the code: a real-looking number is the kind of thing that ships. Replace
 * them in the admin panel (Company & contact). The office address is real. */
export const SETTINGS_SEED: SiteSettings = {
  company: {
    name: "Durall Systems",
    legalName: "Durall Systems Pvt. Ltd.",
    tagline: "Enveloping Luxury",
  },
  contact: {
    details: [
      {
        icon: "mail",
        label: "Email",
        value: "hello@example.com",
        href: "mailto:hello@example.com",
        note: "For project enquiries and technical drawings.",
      },
      {
        icon: "phone",
        label: "Phone",
        value: "+00 00000 00000",
        href: "tel:+000000000000",
        note: "Weekdays, 9:30 to 18:00 IST.",
      },
    ],
    responseNote: "A member of the Durall engineering team will respond within two working days.",
    careersEmail: "careers@example.com",
  },
  office: {
    name: "Durall Systems India Pvt Ltd",
    lines: [
      "Kolivery Village, P and T Colony",
      "Vakola, Santacruz East",
      "Mumbai, Maharashtra 400098, India",
    ],
    plusCode: "3VC7+6M3",
    lng: 72.8641719,
    lat: 19.0705125,
    note: "Visits by appointment.",
    directions: "https://www.google.com/maps/dir/?api=1&destination=19.0705125%2C72.8641719",
    googleMaps:
      "https://www.google.com/maps/search/?api=1&query=Durall%20Systems%20India%20Pvt%20Ltd%2C%203VC7%2B6M3%20Mumbai",
  },
  header: {
    items: [
      { label: "Projects", fullLabel: "", href: "/projects", visible: true },
      { label: "Expertise", fullLabel: "", href: "/expertise", visible: true },
      {
        label: "Partners",
        fullLabel: "Partners / International Systems",
        href: "/partners",
        visible: true,
      },
      { label: "About", fullLabel: "", href: "/about", visible: true },
      { label: "Insights", fullLabel: "", href: "/insights", visible: true },
    ],
    cta: { label: "Start a Project", href: "/contact" },
    menuTagline: "Architecture\nstarts with\na conversation.",
  },
  footer: {
    blurb:
      "Premium aluminium window, door and façade systems — designed, engineered, fabricated and installed in India.",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Projects", href: "/projects" },
          { label: "Expertise", href: "/expertise" },
          { label: "Partners", href: "/partners" },
          { label: "About", href: "/about" },
          { label: "Insights", href: "/insights" },
          { label: "Careers", href: "/careers" },
        ],
      },
    ],
    officeHeading: "Head Office",
    contactHeading: "Talk to Us",
    hours: "Weekdays, 9:30–18:00 IST · Visits by appointment",
    // TODO — no real profile URLs yet: plain text until they are added.
    social: [
      { label: "LinkedIn", href: "" },
      { label: "Instagram", href: "" },
    ],
    // Plain text until the pages exist: an empty href renders no link.
    legal: [
      { label: "Privacy Policy", href: "" },
      { label: "Terms of Use", href: "" },
    ],
    backToTop: "Back to Top",
  },
  seo: {
    shareImage: "/og-durall.jpg",
    shareImageAlt: "Parikrama House, Murud — a Durall aluminium envelope framed by palms",
  },
  behaviour: {
    loadingScreen: true,
    pageTransition: true,
  },
  notFound: {
    heading: "Page not found",
    body: "The page you're looking for doesn't exist or has been moved.",
    action: "Go home",
  },
};
