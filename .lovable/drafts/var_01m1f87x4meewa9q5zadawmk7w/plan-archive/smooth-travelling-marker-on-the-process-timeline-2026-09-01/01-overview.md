# Smooth travelling marker on the process timeline

Two changes inside section 04 — How we work. Nothing else on the page changes.

## 1. The dot glides instead of jumping

Today each of the five steps owns its own dot, and the "filled" state simply hops
from one dot to the next when a step activates — which reads as a jump.

Instead, the five dots stay as quiet outline markers (the rail track), and one
solid navy marker rides the rail continuously. Its position is driven by the same
pinned scroll progress that expands the steps, so between Discover and Design the
marker is physically travelling down the rail rather than teleporting at the
handover. A soft spring smooths out any re-measurement when an accordion opens and
shifts the step below it.

A thin navy progress line also fills the rail behind the marker, so the trail
follows it down.

## 2. Slightly shorter freeze

The pinned sequence currently runs about 1.7 viewports of scroll per stage. That
drops to roughly 1.15, and the scrub lag eases from 1.6 to 1.1 — still cinematic
and smooth, just less scrolling to get through all five steps. Snap timing is
tightened to match so it never feels like it is waiting.
