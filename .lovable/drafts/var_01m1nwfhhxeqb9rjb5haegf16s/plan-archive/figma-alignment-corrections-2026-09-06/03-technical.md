## Technical implementation

- **Project cards:** update the repeated card markup in the Home projects section to an explicit `flex flex-col items-start text-left` stack, with a zero-horizontal-padding text group below the full-width image. Keep the existing grid gaps as the sole inter-card spacing mechanism.
- **Shared header:** retain its absolute full-width placement and route-aware logic. For the dark variant, remove the background fill, bottom hairline, and blur; raise it to the requested overlay layer. Add an active underline using border styling on the text link itself. The light Home variant remains unchanged.
- **Hero overlays:** add a top-to-transparent navy fade to About and Partners, layered with their existing full-image contrast overlays so navigation remains readable without a hard bar.
- **About CTA:** remove only the secondary CTA. The shared CTA component already supplies the line arrow and its reduced-motion interaction.
- **Floating plates:** change both plate wrappers from 1.25rem to 1.5rem radius and use one consistent soft, broad shadow. Keep the inner images clipped by the wrapper and preserve the existing responsive grid.
- **Verification:** compare Home project text edges against image edges; verify About and Partners header blending, active states, single About CTA, and plate shape at mobile, tablet, and desktop widths. Check horizontal overflow, navigation wrapping, reduced-motion behavior, and current build/runtime signals.

No content, routes, footer sections, partner grids, or Home section 04 behavior will be changed.
