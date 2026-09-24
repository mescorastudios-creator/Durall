## What changes

In `src/components/durall/Process.tsx`, stage viewer only:

- Give every stage image the same box: absolutely positioned, `h-full w-full`, `object-cover`, `object-center`, inside the existing fixed-ratio frame. No per-image sizing.
- Reset the cross-fade so inactive images hold one shared resting scale and the active one lands on one shared final scale, driven off a single constant instead of per-render state. This removes the Design image being visibly smaller.
- Set `transform-origin: center` and keep `will-change: opacity, transform` so the drifting scale never shifts an image off-centre relative to the others.
- Add `object-position` per stage only if a subject ends up badly cropped after the change — a small centre offset, not a different size.

Untouched: section copy, order, timeline marker, pinning, scroll pacing, reduced-motion fallbacks, and every other section.

## Verification

- Step through all five stages and confirm each rendered image reports the identical width and height and the same scale.
- Check at mobile, tablet and desktop widths for no overflow and no letterboxing.
