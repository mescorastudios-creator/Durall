## Implementation

1. **Centralize viewport-change handling**
   - Extend the Lenis/GSAP integration with one cleaned-up, ~175 ms debounced handler for both `window.resize` and `visualViewport.resize`.
   - Run `lenis.resize()` first, then `ScrollTrigger.refresh()` after layout has settled; preserve reduced-motion native scrolling.
   - Keep legitimate zoom resizes enabled and avoid `ignoreMobileResize: true`.

2. **Make the pinned process section re-measurable**
   - Derive frame height and scroll distance from the current visual viewport with `dvh`/measured fallback rather than leaving stale `innerHeight` values.
   - Use refresh lifecycle hooks so height, fit scale, step-dot offsets, trigger endpoints, and GSAP’s pin spacer are recalculated together.
   - Debounce/remove the section’s competing resize callbacks, invalidate function-based measurements on refresh, and preserve cleanup.
   - Replace the hard desktop threshold behavior with a content/height-safe rule: pin only when the two-column frame fits; otherwise use the normal scrolling step reveal. This avoids a desktop zoom level activating a layout that cannot fit.

3. **Fluid layout cleanup**
   - Convert the remaining Durall spacing/type/tracking `px` values to `rem` or fluid tokens where scale matters; retain true one-pixel hairlines/borders.
   - Replace brittle negative offsets and decorative positioning with parent-relative percentages/rem values where appropriate.
   - Strengthen header and hero rows using shrink-safe grid/flex patterns so navigation, title, and CTAs wrap without collision around effective-width thresholds.
   - Remove the contact plate’s small-screen horizontal-scroll dependency by providing a fluid stacked/two-column presentation below the artwork-overlay range; keep proportional container-query overlays at large widths.
   - Add `height: auto` to unconstrained global images while preserving deliberate `h-full object-cover` media frames.

4. **Animation geometry hardening**
   - Refresh split-text measurements after font readiness and meaningful width changes, re-splitting lines where required instead of only refreshing the old masks.
   - Ensure image reveals, connector line, hero parallax, and section reveals receive the coordinated global refresh without duplicate listeners.

## Verification

- Automated Chromium checks at widths **375, 768, 1024, 1440, and 1920 CSS px**, including effective zoom equivalents for **67%, 80%, 90%, 100%, 110%, 125%, and 150%**.
- At each representative width/zoom pair, check document horizontal overflow, hero/header bounds, process pin-spacer width/height, step activation, contact/footer bounds, and post-pin scroll continuity.
- Capture focused screenshots for the hero/header, “How we work,” contact, and footer at narrow, desktop, zoomed-in, and zoomed-out states.
- Run the project’s type check and inspect build/runtime/console logs after edits.
- Browser coverage available in this environment will be exercised directly. Firefox/Edge/Safari-specific behavior that cannot be launched here will be flagged explicitly rather than claimed as tested.

## Acceptance criteria

- No page-level horizontal overflow or overlapping UI at the tested sizes.
- Zoom/resizing does not leave stale process widths, excess blank pin space, or early cut-off.
- Process steps remain synchronized with scroll in pinned mode and remain usable in non-pinned mode.
- Contact and footer remain readable without forced horizontal page scrolling.
- The viewport metadata and visual identity remain unchanged.
