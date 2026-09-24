## Technical notes

`src/components/durall/SiteHeader.tsx`
- Add an optional `variant?: "light" | "dark"` prop (default `dark`).
- Light: `bg-white/95`, `border-b border-navy/10`, logo/links `text-navy/70`, active/hover `text-navy`; motion hover colour switches to navy instead of `#ffffff`.
- `src/routes/index.tsx` passes `variant="light"`; `src/routes/about.tsx` unchanged.

`src/components/durall/Hero.tsx`
- Keep the intro `tl.from(image, { scale: 1.08, ... }, 0)`.
- Replace the current `gsap.to(image, { yPercent: 12, scale: 1.06, scrollTrigger: {...} })` with a scrub tween created in the timeline's `onComplete` (or with `immediateRender: false`) that animates only `yPercent: 0 -> 12`, leaving `scale` at the value the intro left (1). This removes the scale discontinuity that causes the jump.
- Keep the existing cleanup (`parallax?.scrollTrigger?.kill()`, `parallax?.kill()`), guarding for the case where the tween was never created.
- Reduced-motion path unchanged.

No token, asset, or copy changes. `src/components/durall/about/AboutHero.tsx` has the identical parallax setup and gets the same parallax fix.
