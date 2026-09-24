## Build details

**Route:** new `src/routes/projects.tsx` (`/projects`) with its own page title
and description metadata, mirroring the structure of the About route:
`SmoothScroll`, `SiteHeader`, sections, `DurallFooter`.

**New components** under `src/components/durall/projects/`:

- `ProjectsIntro.tsx` — heading (split-line reveal) + lede + connector rule.
- `FeaturedProject.tsx` — two-column layout; photo rotates on an interval
  (default ~5s) with a crossfade and an animated progress bar; pauses on
  hover/focus and is static under reduced motion.
- `ProjectFilters.tsx` — tab row and sort dropdown; state lives in the parent
  grid section, tabs are real buttons with `aria-pressed`.
- `ProjectGrid.tsx` — two-column card grid driven by a local `PROJECTS` array
  carrying number, name, place, architect, category and image; filtering and
  sorting animate via Motion layout transitions.
- `ProjectsCta.tsx` — dark closing band with the pill button.

**Data and images:** the six grid photos plus the featured photo come from the
attached design assets, registered as CDN asset pointers in `src/assets/`
(names prefixed `projects-`) so no existing asset pointer is touched. Small
arrow/chevron glyphs are drawn as inline SVG rather than imported images,
matching how the current `ui.tsx` icons work.

**Animation parity:** reuse `useReveal`, `useSplitLines`, `useClipReveal`,
`useParallax` from `src/lib/anim.ts` and `Interactive` / `UnderlineLink` from
`src/components/durall/ui.tsx` — same easings, stagger and reduced-motion
fallbacks as the homepage. No new animation utilities.

**Tokens and responsiveness:** only existing tokens (`navy`, `slate`,
`accent-blue`, `mist`, `font-display`, `font-body`, `tracking-*`) and the
`shell` / `shell-narrow` containers. Absolute Figma coordinates are converted
to flex/grid with `clamp()` sizing as elsewhere; grid is one column on mobile,
two from `sm`, and the featured block stacks under `xl`.

**Untouched:** all existing routes, shared components and `src/styles.css`.
The navbar's "Projects" item currently points to the homepage anchor; leaving
it as-is per the no-edit constraint, so `/projects` is reachable by URL until
you want that link repointed.
