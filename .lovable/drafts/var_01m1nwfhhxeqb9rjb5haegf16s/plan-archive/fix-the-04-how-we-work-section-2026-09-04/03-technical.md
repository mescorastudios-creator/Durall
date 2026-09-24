## Technical notes

In `src/components/durall/Process.tsx`:

- Delete the fit pass (`measureReserved`/`run` layout effect, `--fit` and `--process-safe-inset` custom properties) and every `calc(... * var(--fit,1))` in the markup, restoring plain `clamp()` spacing and type sizes.
- Left column: `xl:h-full xl:flex xl:flex-col xl:justify-center` with fluid `py`, so it centres in the pinned frame instead of top-hugging a scaled block.
- Dot measurement: subtract the marker's own top offset (`0.5rem`) — compute offsets as `dot.top - rail.top - markerTop` — and re-run measurement on `ScrollTrigger.refresh` (`refreshInit`) plus the existing `ResizeObserver`.
- ScrollTrigger `end` from `viewportHeight * STAGES.length * 1.45` to `viewportHeight * (STAGES.length - 1) * 1.0`; keep `invalidateOnRefresh` and snap points.
- Pin media query to `(min-width: 80rem) and (min-height: 46rem)`; the fallback query becomes the complement, so 1280x700-class windows use the scroll-reveal path.
- `ConnectorLine`: add `overflow-hidden` (or reduce the height) on the projects wrapper so the hairline no longer crosses into section 04.

Verification: Chromium runs at 375/716/768/1024/1280x700/1440/1920 and simulated 90/110/125% zoom, checking the marker aligns with each dot, no gap below the column, pin-spacer height equals the trigger distance, and no horizontal overflow.
