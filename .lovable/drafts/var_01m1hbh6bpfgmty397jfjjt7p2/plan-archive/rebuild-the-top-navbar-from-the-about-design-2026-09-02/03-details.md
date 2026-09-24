## Technical notes

- Edit `src/components/durall/SiteHeader.tsx` in place; both `src/routes/index.tsx` and `src/routes/about.tsx` already render it, so no route changes are needed.
- Nav model becomes seven entries. Hrefs: Projects `/#projects`, Systems `/#philosophy`, Expertise `/#process`, About `/about`, Partners `/#projects`, Insights `/#insights`, Contact `/#contact` — About uses TanStack `Link`, the rest stay anchor links so the existing Lenis smooth scroll keeps working. On the About page the homepage-anchor links are absolute (`/#…`) so they navigate home and then scroll.
- Styling with existing tokens only: `bg-navy/85` with `backdrop-blur-sm`, hairline `border-b border-white/10`, wordmark in `font-display` uppercase `tracking-[0.1875rem]` white, links `text-white/65` at the current clamp size and `tracking-eyebrow`, active link `text-white`.
- Active state derived from the current route via `useRouterState` (or `useMatchRoute`), not hardcoded per page.
- The "D" mark is drawn as a small inline SVG so no new asset is needed.
- Hover keeps the existing `motion.a` spring (`y: -2`, colour to white) with the `useReducedMotion` opacity fallback.
- Homepage impact: the header changes from a light bar to the dark bar on both pages — this is the requested change; no other homepage code is touched.
- Keys use `label` (unique) to avoid duplicate-key warnings from repeated hrefs.
