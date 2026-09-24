## Technical notes

- New CDN asset pointer for the updated contact glass plate (`image-20.png` from the export); the old plate pointer is left in place but no longer imported. The insights screenshot in the export is a flattened mockup and is rebuilt as real markup, reusing existing project photos as the featured image and the three thumbnails.
- `src/components/durall/Insights.tsx`: rewritten body — heading keeps its split-line reveal; the featured article and the three rows become `<article>` elements inside a `lg:grid-cols-2` grid, each still wrapped in the existing `Interactive` hover component and revealed with the same staggered `useReveal` config. `ViewMore` stays.
- `src/components/durall/Contact.tsx`: swap the plate image, update `Invitation` copy (new serif heading, new lede, drop the wordmark block), drop the privacy note, and add the right-hand vertical rule + caption outside the frame. The container-query overlay percentages are re-measured against the new plate so the two panes land on the glass.
- No changes to `SiteHeader`, `Hero`, `Philosophy`, `Projects`, `Process`, footer, tokens, or the scroll/animation layer. Reduced-motion fallbacks carry over unchanged.

## Verification

Playwright pass at 390 / 768 / 1280 / 1920: no horizontal overflow, insights columns align and stack correctly, contact panes sit inside the new frame, and the enquiry form still submits to its success state.
