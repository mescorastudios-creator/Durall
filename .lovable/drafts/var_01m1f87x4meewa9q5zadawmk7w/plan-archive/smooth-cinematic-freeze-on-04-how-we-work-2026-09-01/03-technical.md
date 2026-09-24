## Technical notes

All changes are in `src/components/durall/Process.tsx` (plus one small easing tweak if needed in `src/components/SmoothScroll.tsx`).

- Pin an inner wrapper sized to `h-svh` (`min-height: 100svh; max-height: 100svh; overflow: hidden`) instead of the whole `#process` section, and pin that element with `start: "top top"`. Equal pin height and viewport height means zero layout offset at the pin swap — this is the actual cause of the jump, not the scrub value.
- Keep `pinSpacing: true`; drop `anticipatePin` (it pre-shifts and, with Lenis, reads as a hitch) or lower to `0`. Set `pinReparent: false`.
- Add a lead-in hold: map raw progress through a small dead zone (`progress` remapped so the first ~8% keeps stage 01 fully settled) before the 0→4 stage ramp, so the entry reads as a settle.
- Stage math: `raw = clamp01((p - 0.08) / 0.92) * (STAGES.length - 1)`; keep `applyFraction(raw)` for the travelling marker and `select(Math.round(raw))` so a step opens as the marker arrives rather than 0.4 early.
- Snap: `snapTo` unchanged, `duration: { min: 0.5, max: 1.1 }`, `delay: 0.35`, `ease: "power2.inOut"`, and gate with `directional: false` so reversing does not yank back.
- Scrub stays around `1.2`; the smoothness gain comes from removing the offset, not from more lag.
- Because the pinned frame is clamped to one viewport, verify the left column (heading, intro, five steps, CTA) fits at 1280×800 and 1440×900 with the existing `clamp()` rhythm; tighten step vertical padding via `clamp()` only if it overflows.
- Short viewports (`max-height: 639px`) keep the existing non-pinned per-step reveal; `prefers-reduced-motion` keeps click-to-expand with no pin.
- Verification: Playwright pass at 1440×900, 1280×800, 768×1024, 390×844 — capture frames just before and just after the lock to confirm no vertical shift, confirm all five steps open before release, and confirm no horizontal overflow.
