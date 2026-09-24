## Technical notes

All changes stay inside `src/components/durall/Process.tsx`.

- State: replace the single `open: number | null` with a `revealed` count driven by scroll, so steps `0..revealed` render expanded. Clicking a step still toggles it individually.
- Pin: one `ScrollTrigger` on the section for all breakpoints — `start: "top top"`, `pin: true`, `scrub: 1` (smoothing gives the cinematic lag), `end: "+=" + window.innerHeight * 5 * 1.1`, and `snap` at five evenly spaced progress points with a ~0.6s eased settle.
- The section already has `xl:min-h-svh xl:items-center`; extend that to all sizes so the pinned frame fits the viewport, and let the step list scroll-fit by tightening vertical rhythm on small screens.
- Mobile fallback: if the pinned content cannot fit a short viewport (under roughly 640px tall), keep the existing per-step `onEnter` triggers instead of pinning.
- Longer transitions: raise the image cross-fade to ~1.1s and the accordion height/opacity to ~0.5s `easeOut` to match the slower scroll.
- `prefers-reduced-motion`: no pin, no scrub — the list stays click-to-expand exactly as today.
- `ScrollTrigger.refresh()` on resize is handled by the existing GSAP matchMedia cleanup; Lenis stays synced through the existing ticker in `SmoothScroll.tsx`.
