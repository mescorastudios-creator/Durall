# Keep the complete Process copy inside the frame

## Goal
Fix the remaining desktop Process overflow so both **“04 — How we work”** and **“Explore our approach”** remain visible when all five stages are expanded.

## Scope
- Change only the Process section.
- Keep the navbar, copy, imagery, accordion behavior, pinning, scrub/snap timing, stage transitions, and reduced-motion behavior unchanged.
- Preserve the existing mobile and short-viewport fallbacks.

## Implementation
1. Measure the complete copy column at its fully expanded state, including the eyebrow, heading, introduction, all five stage bodies, and approach link.
2. Replace the partial rhythm-only fit with a bounded inner-column scale/spacing strategy so every measured element participates in fitting.
3. Top-align the column whenever its expanded content approaches the frame limit, preventing centered content from being clipped equally above and below.
4. Reserve explicit safe space at both frame edges and recalculate on viewport/font/layout changes.
5. Verify the first label and final link remain within the pinned frame at compact laptop heights and wide desktop sizes, with every stage open.

## Validation
- Check fully expanded state at 1280×720, 1280×800, 1440×900, and 1920×1080.
- Confirm both boundary labels have visible clearance inside the frame.
- Confirm no horizontal overflow, animation regression, console error, or build error.
