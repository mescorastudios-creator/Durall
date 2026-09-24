# Zoom- and device-resilient Durall layout

## Goal
Keep the Figma composition visually consistent while browser zoom and effective viewport size change, with no horizontal spill, overlaps, mistimed reveals, or stale pin spacing.

## Confirmed findings
- The viewport meta tag is already correct and unique: `width=device-width, initial-scale=1`.
- Most section spacing and type already use `rem`, percentages, container units, or `clamp()`. The remaining risky fixed value in shared Durall UI is the CTA’s `26px` horizontal padding; token typography/tracking also still contains fixed `px` values.
- The main instability is the pinned “How we work” frame. It writes `window.innerHeight` directly into the frame and calculates the pin distance from that same value, while refresh handling listens only to `window.resize` and is immediate rather than debounced.
- The process frame switches between one and two columns at `xl`; at effective widths around that threshold, zoom can move it between layouts while the pin and fit measurements are active.
- A Chromium runtime audit reproduced the issue: at simulated 110–150% page scaling, the GSAP `pin-spacer` and process grid retained widths larger than the visible viewport.
- The contact artwork deliberately uses a `60rem` minimum-width plate inside a horizontal scroller. That prevents clipping but is not an adaptive small-screen composition and needs a readable reflow rather than relying on sideways scrolling.
- Images are generally constrained by their wrappers, and global media already has `max-width: 100%`; explicit `height: auto` is missing for unconstrained images.

## Scope
This pass will adjust layout and animation infrastructure only. Content, imagery, color direction, and the intended Figma hierarchy remain unchanged.
