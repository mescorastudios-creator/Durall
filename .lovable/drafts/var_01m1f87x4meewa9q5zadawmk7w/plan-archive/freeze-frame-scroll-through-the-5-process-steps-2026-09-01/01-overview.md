# Freeze-frame scroll through the 5 process steps

Section 04 "How we work" currently pins only on large screens, advances with a fast scrub, and opens one step at a time (opening a new step closes the previous one). The goal is a slow, cinematic freeze-frame: the section locks in place, and each scroll increment reveals the next step until all five are expanded — then the page continues.

What changes:

- The section pins at every screen size (not just desktop), so the same choreography works on mobile and tablet.
- Scroll distance is stretched so each step takes roughly a full viewport of scrolling — a slow, deliberate pace rather than a flick.
- Steps expand cumulatively: Discover stays open when Design opens, and so on, so by the end all five are visible with the fifth highlighted.
- Gentle snapping between steps, so the section settles on a stage instead of resting mid-transition.
- The stage image and "Current stage" callout keep cross-fading with the active step, with a longer, softer fade to match the slower pacing.
- Reduced-motion users keep the current click-to-expand behavior with no pinning.
