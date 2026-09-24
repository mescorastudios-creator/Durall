# Full-bleed process stage + cinematic scroll pass

Two things: reshape section 04 so the stage photo owns the entire right half of the screen on desktop, and layer a heavier, Faith Ibiza-style scroll choreography across the whole page.

## 1. Section 04 — split screen

On desktop (>=1280px) the section becomes a true 50/50 split, edge to edge:

- Right half: the five stage photos fill a full-height (100svh) panel — no aspect-ratio box, no letterboxing. All five stay stacked and cross-fade as today, `object-cover`, so every step fills the panel identically at any window size.
- Left half: eyebrow, heading, intro, the 5-step timeline with the travelling marker, and the "Explore our approach" link, vertically centred with comfortable inner padding.
- The "Current stage" callout moves inside the image panel's lower-left, sized in relative units so it never crowds the photo.
- Tablet and mobile keep today's stacked order (copy, then image) with the image as a tall-but-bounded panel — no full-height takeover on small screens.

## 2. Cinematic scroll, site-wide

Reference behaviour from faithibiza.com: slow inertia, image reveals that grow/uncover rather than pop, text that arrives line by line, and generous scroll distance per section.

- Lenis retuned: longer duration, gentler easing, slightly reduced wheel multiplier so a flick travels further and settles slowly.
- Every section heading switches from a block fade to a line-by-line masked reveal (split-type + GSAP), driven by ScrollTrigger.
- Images across Hero, Philosophy, Projects, Insights and Contact get a scrub-linked reveal: clip-path uncover plus a slow internal scale/parallax drift tied to scroll position, not a one-shot fade.
- Section-level pacing: extra scroll travel added to Projects and Insights so cards enter in a staggered sequence instead of all at once.
- Section 04 pinning stays; its scrub is softened to match the new global feel.
- Reduced motion: every new effect resolves instantly to the final state, and Lenis stays off.
