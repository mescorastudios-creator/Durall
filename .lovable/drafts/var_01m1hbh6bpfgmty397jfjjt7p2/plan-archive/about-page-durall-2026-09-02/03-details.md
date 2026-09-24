## Reuse and shared code

- `SiteHeader`, `Contact`, `SmoothScroll`, `ui.tsx` (CtaButton, UnderlineLink, Interactive, arrows) and `lib/anim.ts` helpers are reused as-is. The one agreed change to shared code is the header's nav item list, updated to the Figma set: Projects, Systems, Expertise, About, Partners, Insights, Contact — the homepage renders the same header with those labels.
- Because the About hero sits under a dark photograph while the homepage header is a light bar, the header keeps its existing styling; no visual variant is added.
- The Figma footer replaces nothing: `SiteFooter` stays on the homepage, and a new `DurallFooter` renders on About only.

## Technical notes

- Route: `src/routes/about.tsx` with `createFileRoute("/about")` and its own `head()` (unique title, description, og:title, og:description, og:type, twitter:card).
- New components under `src/components/durall/about/`: `AboutHero`, `AboutPhilosophy`, `SystemSpec`, `MeetsEngineering`, `OurApproach`, plus `DurallFooter` in `src/components/durall/`.
- Assets from the export (hero photo, villa, hero-right visual, section drawings, feature icons, Durall Systems mark, line-drawing house, connector vectors) are uploaded through the asset pipeline and imported as `.asset.json` pointers, matching how the homepage handles imagery. The export's baked-in `image-22.png` contact plate is not re-uploaded — the existing contact frame asset is reused.
- The hero and connector diagram are rebuilt as live markup and SVG over the photographic plates, not shipped as flat images with text baked in.
- Theme: one new token `--color-accent-blue: #1e539c` in the `@theme` block of `src/styles.css`, used for the About eyebrow, rules and connector lines. Everything else uses existing navy / slate / mist / paper tokens and the existing display, body and serif families.
- Animation parity: `useReveal` for section fade + upward translate, `useSplitLines` for the hero and section headings, `useParallax` on layered photographs, `motion/react` hover lift on buttons, links, cards and footer links, and the existing `useReducedMotion` fallback everywhere. The global Lenis instance from `SmoothScroll` is reused; no second instance.
- Markup stays semantic: one `h1` in the hero, `h2` per section, `figure`/`figcaption` for the spec strip captions, `nav` with labelled link lists in the footer, alt text on every meaningful image.
- Below 1920px the absolute Figma coordinates are converted to responsive grid and clamp-based spacing, the same approach as the homepage sections.
