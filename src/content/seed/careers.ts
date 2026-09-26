import type { RoleDoc } from "../types";

/* Deliberately, visibly placeholder: replace in the admin panel, or close
 * both and the page shows its "nothing open right now" state. */
export const ROLES_SEED: RoleDoc[] = [
  {
    id: "role-1",
    order: 0,
    open: true,
    title: "Role title (placeholder)",
    team: "Team",
    location: "Location",
    type: "Full time",
    summary:
      "One or two lines on what this person owns and who they work with. Replace with the real posting.",
  },
  {
    id: "role-2",
    order: 1,
    open: true,
    title: "Second role title (placeholder)",
    team: "Team",
    location: "Location",
    type: "Full time",
    summary:
      "One or two lines on what this person owns and who they work with. Replace with the real posting.",
  },
];
