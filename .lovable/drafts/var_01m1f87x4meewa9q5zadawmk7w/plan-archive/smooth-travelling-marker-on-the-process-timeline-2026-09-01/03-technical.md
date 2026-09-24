## Technical notes

All edits stay in `src/components/durall/Process.tsx`.

- Add a rail wrapper around the `<ol>` with one absolutely positioned marker
  element plus a fill line; the per-step dots lose their active/filled variant and
  stay as outline markers.
- Measure each step dot's offset top relative to the list with a
  `ResizeObserver` + layout effect, so positions stay correct as accordions open.
- Drive the marker from the existing pinned ScrollTrigger: on `onUpdate`, map raw
  `self.progress` onto the measured offsets by linear interpolation between the
  current and next step positions, then write it through a Motion `useSpring`
  (stiffness ~120, damping ~24) so re-measure shifts settle rather than snap.
  Non-pinned/short-viewport path falls back to animating to the active step's
  offset.
- Timing: pinned `end` multiplier 1.7 → 1.15, `scrub` 1.6 → 1.1, snap duration
  range 0.6–1.4 → 0.4–0.9.
- Reduced motion: marker position jumps directly to the active step with no spring
  and no transition, as with the other animations here.
