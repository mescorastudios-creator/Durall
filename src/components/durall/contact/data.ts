import { Mail, MapPin, Phone } from "lucide-react";

/**
 * Direct contact details.
 *
 * TODO — every value below is a deliberate placeholder. The codebase contains
 * no real email, phone number or address for Durall, and inventing plausible
 * ones would be worse than obviously fake ones: a real-looking number is the
 * kind of thing that ships. Replace `value` and `href` on each entry; the
 * labels, icons and layout need no changes.
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
  {
    icon: MapPin,
    label: "Studio",
    // Address lines rather than one string so the <address> element can break
    // them the way a postal address is actually written.
    value: ["Address line one", "Address line two", "City, State 000000"],
    href: null,
    note: "Visits by appointment.",
  },
] as const;

export const RESPONSE_NOTE =
  "A member of the Durall engineering team will respond within two working days.";
