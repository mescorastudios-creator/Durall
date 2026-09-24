## Technical notes

**Process.tsx**
- Replace the centred `max-w-[120rem]` grid with a full-width `xl:grid-cols-2` layout: left cell gets `px-[clamp(...)]` inner padding and `justify-center`; right cell is `xl:h-svh` with `overflow-hidden` and no aspect box. Below `xl`, keep the current single-column stacked layout with the image constrained by an aspect ratio.
- Keep all five `motion.img` layers stacked absolutely (avoids the previous AnimatePresence removeChild crash); only the container geometry changes.
- Move the "Current stage" callout to `bottom`/`left` inside the image panel, widths in `clamp()`/`%`.
- Soften ScrollTrigger `scrub` slightly; leave `start: "center center"`, pin and snap behaviour intact. Add `ScrollTrigger.refresh()` safety on resize via existing matchMedia teardown.

**Shared animation layer (`src/lib/anim.ts`)**
- Add `useSplitHeading()` — split-type by lines, wrap in overflow-hidden masks, GSAP `yPercent` stagger on ScrollTrigger enter; reduced-motion sets final state.
- Add `useScrollReveal({ clip: true, parallax })` — scrub-linked `clip-path: inset()` uncover plus inner-image `yPercent`/`scale` drift.
- All new hooks reuse the existing single `loadGsap()` loader and clean up on unmount.

**SmoothScroll.tsx**
- Lenis options tuned for weight: `duration ~1.6`, custom easing, `wheelMultiplier ~0.85`, `lerp` left unset; keep the existing `ScrollTrigger.update` / `gsap.ticker` sync so pinning stays accurate.

**Sections**
- Hero, Philosophy, Projects, Insights, Contact swap their current `useReveal` heading calls for the split-line hook and their image wrappers for the clip/parallax hook. Copy, order, colours, fonts and images are unchanged.

**Verification**
- Playwright pass at 390/768/1280/1920 widths: no horizontal overflow, stage photo fills the right half at desktop, pinned sequence still steps 01→05, and a reduced-motion run shows all content visible without animation.
