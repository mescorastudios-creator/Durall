import type { ContactPage } from "../../types";

export const CONTACT_SEED: ContactPage = {
  seo: {
    title: "Contact Durall — Start a Conversation",
    description:
      "Talk to Durall's engineering team about aluminium windows, doors, façades and architectural systems — send an enquiry or reach us directly.",
    image: null,
  },
  intro: {
    title: "Start a conversation.",
    lede: "Tell us about the project — its stage, its site, and what the envelope has to do. We’ll put you in front of the engineer who can answer it.",
  },
  map: { eyebrow: "Head office", directions: "Get directions", openInMaps: "Open in Maps" },
  formHeading: "Send an Enquiry",
  form: {
    name: { label: "Your Name", placeholder: "Jane Mehta…" },
    email: { label: "Your Email", placeholder: "jane@studio.com…" },
    subject: { label: "Subject", placeholder: "Sliding systems for a coastal residence…" },
    message: {
      label: "Your Message",
      placeholder:
        "Tell us about the project — location, stage, and what you need from the envelope…",
    },
    submit: "Send Enquiry",
    sending: "Sending…",
    sentHeading: "Thank you — your enquiry is with us.",
    sentAgain: "Send Another Enquiry",
  },
  detailsHeading: "Direct Lines",
};
