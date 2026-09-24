## Technical notes

In `src/components/durall/Process.tsx`:

- Section: `min-h-svh` -> `lg:h-svh lg:min-h-0` so the desktop section is exactly one viewport tall; keep the mobile `min-h-svh` flow.
- Frame (`[data-frame]`): `lg:h-full`, grid stays `lg:grid-cols-2` (each track 50%).
- Stage column: `lg:h-full lg:w-full` (already `object-cover`), so the photo measures 50vw x 100svh at every zoom.
- Text column: add height-aware clamps — mix `vh` into the existing `clamp()` for eyebrow/heading/body/step spacing (e.g. `clamp(1rem, 2.2vh, 2.375rem)` for rhythm, `clamp(1.75rem, min(3.6vw, 6.2vh), 4rem)` for the heading) and add `lg:overflow-y-auto lg:overscroll-contain` as the floor case.
- matchMedia gates: pin on `(min-width: 64rem)`, fallback on `(max-width: 63.999rem)` — drop the 44rem height condition now that the section is height-bounded. Keep `invalidateOnRefresh` and the offset-based marker measurement.
- Verify in Chromium at 1024x768, 1152x720, 1280x800, 1440x900, 1920x1080 and short heights 1440x600, 1100x560: stage column width exactly 50% of viewport, height exactly viewport height, section height equal to viewport height, no horizontal overflow, marker aligned to the active dot, pin-spacer height equal to viewport height x 4.
