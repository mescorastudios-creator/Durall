import { Mail, Phone } from "lucide-react";

/**
 * Direct contact details.
 *
 * TODO — the email and phone below are deliberate placeholders. The codebase
 * contains no real ones for Durall, and inventing plausible values would be
 * worse than obviously fake ones: a real-looking number is the kind of thing
 * that ships. Replace `value` and `href` on each entry; the labels, icons and
 * layout need no changes. The office address is real and lives in `OFFICE`.
 */
export const DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    note: "For project enquiries and technical drawings.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+00 00000 00000",
    href: "tel:+000000000000",
    note: "Weekdays, 9:30 to 18:00 IST.",
  },
] as const;

/**
 * The head office, shown on the contact page map.
 *
 * The coordinates are the centre of the address's plus code, 3VC7+6M3
 * (in full, 7JFJ3VC7+6M3), decoded rather than looked up.
 */
export const OFFICE = {
  name: "Durall Systems India Pvt Ltd",
  lines: [
    "Kolivery Village, P and T Colony",
    "Vakola, Santacruz East",
    "Mumbai, Maharashtra 400098, India",
  ],
  plusCode: "3VC7+6M3",
  /** [longitude, latitude], the order map libraries take. */
  lngLat: [72.8641719, 19.0705125] as [number, number],
  note: "Visits by appointment.",
  directions: "https://www.google.com/maps/dir/?api=1&destination=19.0705125%2C72.8641719",
  googleMaps:
    "https://www.google.com/maps/search/?api=1&query=Durall%20Systems%20India%20Pvt%20Ltd%2C%203VC7%2B6M3%20Mumbai",
} as const;

export const RESPONSE_NOTE =
  "A member of the Durall engineering team will respond within two working days.";
