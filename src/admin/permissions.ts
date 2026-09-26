/**
 * Who may open which part of the admin panel. Shared by the panel (to hide
 * what a person cannot use) and the server (which refuses it regardless).
 *
 * - owner   exactly one; everything, and the only one who manages accounts
 * - admin   every content and settings section, no account management
 * - editor  only the sections the owner ticked for them
 */

export const SECTIONS = [
  { key: "pages", label: "Pages" },
  { key: "projects", label: "Projects" },
  { key: "insights", label: "Insights" },
  { key: "careers", label: "Careers" },
  { key: "partners", label: "Partners" },
  { key: "media", label: "Media library" },
  { key: "enquiries", label: "Enquiries" },
  { key: "navigation", label: "Navigation & footer" },
  { key: "company", label: "Company & contact" },
  { key: "settings", label: "Site settings" },
] as const;

export type Section = (typeof SECTIONS)[number]["key"];

export const ROLES = [
  { key: "owner", label: "Owner", note: "Everything, including accounts" },
  { key: "admin", label: "Admin", note: "All content and settings" },
  { key: "editor", label: "Editor", note: "Only the sections ticked below" },
] as const;

export type Role = (typeof ROLES)[number]["key"];

export type Member = {
  id: string;
  email: string;
  name: string;
  role: Role;
  sections: Section[];
  disabled: boolean;
};

export function isSection(value: unknown): value is Section {
  return SECTIONS.some((section) => section.key === value);
}

export function can(member: Pick<Member, "role" | "sections"> | null, section: Section): boolean {
  if (!member) return false;
  if (member.role === "owner" || member.role === "admin") return true;
  return member.sections.includes(section);
}

export const isOwner = (member: Pick<Member, "role"> | null) => member?.role === "owner";
