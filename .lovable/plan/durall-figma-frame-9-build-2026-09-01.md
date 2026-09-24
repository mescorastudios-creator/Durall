# Durall — Figma Frame 9 build

A single scrolling landing page rebuilt exactly from the Figma export, with a full GSAP + Lenis + Motion animation layer.

## Sections (in order, one component file each)

1. **Hero** — full-bleed Parikrama cover image with the navy top-to-bottom gradient overlay, slim top bar, headline "Engineering spaces / without boundaries." at 128px medium, -2.56px tracking, supporting paragraph, and two buttons ("Explore Projects" outlined, "Discover Durall" filled navy).
2. **Philosophy** — "Luxury is never applied. It is engineered." (two-tone heading), two small body paragraphs, "HOW WE WORK →" underlined link, and the large offset interior image bleeding off the right edge with the thin outlined frame and the vector-27 connector line that runs down into the projects section.
3. **Projects — "What we've built together."** — 5-card grid (3 + 2) with the exact five images, project name in 24px navy and location caption in 12px grey, plus the pill "View More" + circular arrow button anchored to the end of the connector line.
4. **Process — "Concept to commissioning, under one roof."** — left column: eyebrow "04 — HOW WE WORK", two-tone heading, intro copy, and the 01–05 vertical timeline (Discover / Design / Engineer / Fabricate / Install) with the dotted rail, `+` expanders and "EXPLORE OUR APPROACH →". Right column: the large stage image with the "CURRENT STAGE / 01 DISCOVER" callout, 01—05 progress rail and prev/next circular controls. Rebuilt as real markup (the Figma layer is a flattened screenshot) so the stage can advance and animate; visuals matched to that screenshot.
5. **Insights — "Engineering insights that build better facades"** — featured article card (image left, PERFORMANCE / 28 AUG 2026 meta, headline, body, "READ ARTICLE →") plus two smaller article cards below, then the "View More" pill.
6. **Contact** — "START A CONVERSATION / We're ready when you are." serif heading, divider, copy, DURALL wordmark with the "ENGINEERING ARCHITECTURAL POSSIBILITIES SINCE 1992" lockup, and the right-hand form (name, email, studio/company, project type select, message, navy SEND ENQUIRY button, privacy note) set inside the sliding-glass-frame treatment on the light grey ground. Rebuilt as real accessible form markup; submit shows a success toast (no backend).
7. **Footer** — minimal footer strip consistent with the frame's base.

## Design tokens

Extracted from the export into `src/styles.css` under `@theme`: navy `#050834`, slate body `#5c6972`, white/72 and white/15 overlay values, greys `#f4f4f4` / light contact ground, plus the exact type scale (128 / 64 / 24 / 16 / 14 / 12px), tracking values (-2.56px, 1.2px, 1.3px), and weights 300/400/500/700. Fonts: Space Grotesk (display/UI) + Inter, loaded via `<link>` in the root route. No inline hex values in components.

## Animation layer

- **Lenis** smooth scroll mounted once at the root, driven by GSAP's ticker and `ScrollTrigger.scrollerProxy` so triggers stay in sync.
- **Hero**: split-type line-split reveal of the headline with a masked stagger on load, then paragraph, buttons and top bar fading/sliding in on a GSAP timeline.
- **Every section below the fold**: ScrollTrigger fade + 24–40px upward translate, staggered for grids (project cards, article cards, timeline rows).
- **Parallax**: hero cover image, the philosophy interior image, and the process stage image get subtle `yPercent` scrub parallax; the vector-27 connector line draws in via `strokeDashoffset` on scroll.
- **Motion (`motion/react`)**: hover lift/scale/colour transitions on all buttons, links, project cards and article cards; `AnimatePresence` for the process stage image/callout crossfade and the contact form success state.
- **prefers-reduced-motion**: a single hook gates all of it — Lenis falls back to native scroll, GSAP timelines resolve instantly to final state, Motion transitions drop to opacity-only.

## Technical notes

- Adds `gsap`, `@gsap/react`, `motion`, `lenis`, `split-type`.
- Page lives at `/` (replaces the placeholder index route) with its own SEO head metadata (title, description, og/twitter tags).
- All 19 exported assets uploaded via Lovable Assets and imported as pointer JSON, so no binaries land in the repo.
- Figma frame is 1920px absolute-positioned; it is ported to flow layout on a 1776px max content width with 72px gutters (261px/287px content insets preserved proportionally), so it reproduces exactly at desktop width and degrades sensibly on tablet/mobile.
- Semantic HTML throughout: `header`, `section` with headings, `article` for cards, real `form` with labels.
