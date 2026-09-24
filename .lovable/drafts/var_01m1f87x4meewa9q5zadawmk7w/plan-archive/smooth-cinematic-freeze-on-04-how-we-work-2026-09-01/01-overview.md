# Smooth, cinematic freeze on "04 — How we work"

Right now the section snaps into its frozen position with a visible jolt: the page scrolls normally, then the section abruptly locks and shifts by a few pixels before the step sequence begins. Two things cause that jolt.

- The freeze starts when the section's centre reaches the screen centre, but the section is taller than the viewport at most sizes. At the moment of locking, the browser swaps the section to a fixed position and the leftover height difference is applied instantly — that offset is the jump.
- The step snapping starts fighting the smooth-scroll inertia right after the lock, so the first step also settles with a tug instead of drifting into place.

What the fix does:

- Make the frozen frame exactly one viewport tall, so locking changes nothing visually and the freeze is invisible — the section simply stops moving.
- Start the freeze when the top of that frame meets the top of the screen, which is the position it already looks like it's holding, so no offset is introduced.
- Let the first stage hold for a short beat before the first step opens, so entering the freeze reads as a settle rather than an instant start.
- Retune the settling between steps: gentler pull, longer ease, and no settling while the wheel is still moving, so steps drift to rest instead of clicking.
- Keep the marker glide, the cumulative step opening, the split layout, the copy, the imagery, and the reduced-motion fallback exactly as they are.
