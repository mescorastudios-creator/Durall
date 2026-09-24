# Fix the "04 — How we work" section

I reproduced the problem at 1440x900 and 1280x700. Three things are visibly wrong right now:

1. **The left column shrinks and floats.** A sizing pass measures the steps as if every one were open, then scales the whole text block down (to 85% at 1440 wide, 70% at 1280x700). Result: smaller-than-designed type, and a large empty gap under "Explore our approach" while the picture beside it is full height.
2. **The moving dot sits below the step it points at.** The dot's travel positions are measured against the wrong starting point, so it is offset by roughly half a line at every step.
3. **The frozen section holds far too long.** It currently takes about 8 screens of scrolling to walk through 5 steps, which reads as the page being stuck or as blank space.

A thin decorative line from the projects section above also spills over the top of the section-04 photo; that gets clipped back to its own section.

## What I will change

- Remove the shrink-to-fit scaling entirely. The steps get their designed size at every window size, and the column is laid out (top-aligned with even spacing, vertically balanced) so it fills the half it occupies without a dead zone.
- Keep the closed accordion heights fixed so no re-measuring is needed; only the open step's body expands, and the column is sized to fit the tallest state at the design sizes.
- Re-anchor the travelling dot to the same reference the step dots use, so it lands exactly on each dot, and re-measure after every layout change.
- Shorten the freeze to about 1 screen of scroll per step, so entering, stepping and exiting feel continuous with no leftover blank scroll.
- Raise the freeze threshold so it only engages when there is genuinely room (wide and tall enough); otherwise the section simply scrolls with each step revealing in turn — that path already looks correct at 716 wide.
- Clip the decorative line to the projects section.
