import type { RoleDoc } from "../types";

/* The design's sample roles, there to show the layout: replace them in the
 * admin panel (and clear the note under the list, Pages → Careers), or close
 * them all and the page shows its "nothing open right now" state. */
export const ROLES_SEED: RoleDoc[] = [
  {
    id: "role-1",
    order: 0,
    open: true,
    title: "Façade Design Engineer",
    team: "Engineering",
    location: "Mumbai",
    type: "Full time",
    summary:
      "Detail sliding, glazing and façade systems with architects, from first sketch to shop drawing.",
  },
  {
    id: "role-2",
    order: 1,
    open: true,
    title: "Shop Drawing Draughtsperson",
    team: "Engineering",
    location: "Mumbai",
    type: "Full time",
    summary: "Turn approved designs into fabrication drawings the workshop can build from.",
  },
  {
    id: "role-3",
    order: 2,
    open: true,
    title: "Fabrication Supervisor",
    team: "Workshop",
    location: "Mahape",
    type: "Full time",
    summary: "Run a workshop team and check every frame before it leaves for site.",
  },
  {
    id: "role-4",
    order: 3,
    open: true,
    title: "Site Installation Lead",
    team: "Site",
    location: "Mumbai + travel",
    type: "Full time",
    summary: "Lead installation crews on residential and hospitality sites across India.",
  },
  {
    id: "role-5",
    order: 4,
    open: true,
    title: "Project Coordinator",
    team: "Projects",
    location: "Mumbai",
    type: "Full time",
    summary: "Keep architects, site teams and international partners on the same programme.",
  },
];
