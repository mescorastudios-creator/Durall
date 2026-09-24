## Technical notes

All changes stay inside `src/components/durall/Process.tsx`. Root cause: the pinned frame is set to `window.innerHeight` with `overflow: hidden`, while the accordion bodies animate `height: auto`, so the left column's natural height grows past the frame as steps open.

- Reserve the tall state: measure the copy column with all five bodies expanded (measure once on mount and on resize, off-screen via the existing bodies' `scrollHeight`), and set that as the column's reserved min-height so opening a step fills reserved space instead of pushing the list down.
- Fit pass: compare the reserved height against the frame's available height. Write the ratio, clamped to about `0.72–1`, into a CSS custom property on the section and drive the section's vertical rhythm off it — step `pb`, the `pt-2.5 pb-1` body padding, body leading, and the serif number size. Re-run the pass on resize before `ScrollTrigger.refresh()`.
- Keep the left column `min-h-0` inside the frame grid so it cannot exceed the frame, and remove reliance on the frame's `overflow: hidden` as the clip of last resort.
- The dot-offset `ResizeObserver` already re-measures on layout change, so the marker keeps tracking after the compression pass.
- Untouched: pin/scrub/snap config, `end` distance, image cross-fade, callout, prev/next controls, and the reduced-motion and short-viewport (`max-height: 639px`) branches.

## Verification

Playwright at 1280×800, 1440×900 and 1920×1080: scroll the section to full progress and confirm every step's body is inside the frame's bounding box, no clipping, no page-level overflow, and the marker sits on step 05.
