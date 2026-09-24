# Durall — notes for Claude

@AGENTS.md

## Stack
TanStack Start + React + TypeScript + Tailwind CSS, shadcn/ui components in `src/components/ui`.
Site sections live in `src/components/durall/`, pages in `src/routes/`.

## UI quality bar
All UI work in this project follows the Web Interface Guidelines in
`docs/web-interface-guidelines.md` (accessibility, focus states, forms,
animation, typography, images, performance, navigation, dark mode, copy).

- Apply those rules when writing or changing any component — not only when reviewing.
- Use TanStack Router `<Link>` for navigation, never `<div onClick>`.
- Motion must respect `prefers-reduced-motion` (see `src/lib/motion-prefs.ts`);
  animate `transform`/`opacity` only, and never `transition: all`.
- After finishing a UI change, review the changed files against every rule in
  `docs/web-interface-guidelines.md` (or run `/web-interface-guidelines <files>`
  if that command is installed in `.claude/commands/`) and fix what it reports.

If the UI Pro skill is installed (`.claude/skills/`), use it for design decisions
(palette, typography, layout patterns); the guidelines above still apply on top.
