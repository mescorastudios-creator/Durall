export const REASONS: readonly { title: string; body: string }[] = [
  {
    title: "Days, not quarters",
    body: "Drawings are tested against jigs in the workshop and against buildings on site, so you find out what worked while it still matters.",
  },
  {
    title: "In the room early",
    body: "We sit with architects while the intent is still being set, not after the specification has been priced.",
  },
  {
    title: "Systems from abroad",
    body: "You will learn systems from our partners in Italy, Austria, Belgium and Switzerland, and work out how they meet Indian sites.",
  },
  {
    title: "Nothing over the fence",
    body: "Design, engineering, workshop and site are one team, so a problem stays with the people who can solve it.",
  },
];

/* TODO: replace before launch.
 *
 * There is no careers content anywhere in this project: the footer's
 * "Careers" link pointed at /contact, and nothing in the codebase describes
 * a role, a team or a hiring process.
 *
 * So these openings are deliberately, visibly placeholder rather than
 * plausible. A convincing invented job posting is the kind of thing that
 * ships by accident and that someone then applies to; "Role title" cannot.
 * Swap the array for the real openings, or set it to [] and the page will
 * show its "nothing open right now" state instead, which is written and
 * working. */
export type Role = {
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
};

export const ROLES: readonly Role[] = [
  {
    title: "Role title (placeholder)",
    team: "Team",
    location: "Location",
    type: "Full time",
    summary:
      "One or two lines on what this person owns and who they work with. Replace with the real posting.",
  },
  {
    title: "Second role title (placeholder)",
    team: "Team",
    location: "Location",
    type: "Full time",
    summary:
      "One or two lines on what this person owns and who they work with. Replace with the real posting.",
  },
];

/* TODO: replace with the real address once recruitment has one. Kept
 * obviously fake for the same reason as the contact details. */
export const APPLY_EMAIL = "careers@example.com";
