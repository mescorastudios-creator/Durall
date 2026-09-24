# Keep all five stages inside the frozen frame

In section 04 "How we work", the pinned frame is exactly one viewport tall with overflow hidden. Each stage that opens adds body copy, so by the time all five are expanded the list is taller than the frame and the last steps get clipped below the edge.

The fix keeps the freeze-frame choreography exactly as it is and makes the step list always fit:

- The frame reserves the fully-expanded height from the start, so nothing grows past the bottom as steps open — the layout is stable from the first scroll increment.
- If that fully-expanded list is still taller than the available space (short laptops, mobile), the section's vertical rhythm compresses proportionally — tighter step padding, smaller number size, tighter body leading — until it fits.
- Nothing else changes: pin distance, scrub pacing, snapping, marker travel, image cross-fade, the "Current stage" callout, and the reduced-motion fallback all stay as they are.
