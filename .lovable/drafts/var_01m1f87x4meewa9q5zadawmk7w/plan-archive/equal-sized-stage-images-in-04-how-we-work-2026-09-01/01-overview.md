# Equal-sized stage images in 04 — How we work

The five stage photos already share one frame, but two things make them look different:

1. One photo (Design) is rendering slightly smaller than the others because its cross-fade scale state isn't reset in sync with the rest, so it sits at a different zoom than the active image.
2. The source files have different shapes — portrait (760x967), near-square (1714x1558 and 910x910) and wide (1382x996, 1382x736). Filling one portrait frame crops each of them by a different amount, so the subjects read at different scales.

The fix keeps the layout, animation and content exactly as they are and only normalises how the five images occupy the frame.
