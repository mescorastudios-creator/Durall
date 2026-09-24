# Photo always fills the right half of the screen

On desktop the photo in section 04 already sits in the right half at every width. What breaks is height: when the window is short — which is exactly what happens at 125% or 150% zoom — the text column grows taller than the screen, the whole section stretches past the viewport (measured at 133% of screen height at 1440x600), and the photo spills below the fold instead of reading as a clean half-screen image.

## What changes

- On desktop the section is locked to exactly one screen tall, and the photo panel becomes exactly half the screen wide and one full screen tall — at any zoom level.
- The text column is fitted to that same one screen: its spacing and type sizes scale with the window height as well as its width, so at short/zoomed windows the copy tightens instead of pushing the section taller.
- Because the content now always fits one screen, the step-by-step freeze behaviour turns on for any desktop-width window rather than being switched off on short ones — so zoomed-in desktop users get the same reveal as everyone else.
- Below desktop width nothing changes: the photo stays a full-width image above the stacked steps.

## Trade-off

At extreme zoom on a very short window the text has a floor it will not shrink past. If it ever cannot fit one screen, the text column scrolls inside its own half while the photo stays fixed at half the screen — the photo is never cropped or pushed off.
