# Keep the desktop design at slight zoom

Right now the desktop version of the page only stays on screens wider than 1280 points. Zooming in even a little on a normal laptop pushes the effective width under that line, so the page flips to the stacked phone/tablet arrangement while the window is still clearly a desktop window.

## What changes

- Move the desktop switch-over point from 1280 down to 1024 points, so the full desktop composition survives 110%, 125% and even 150% zoom on common laptop and monitor sizes.
- The desktop compositions are already proportional (percentage placement, container-relative type, fluid spacing), so they scale down into that extra range instead of breaking.
- Sections affected: the philosophy split, the projects grid and its arrow, the how-we-work section (text column, photo column, floating stage card), the contact plate with the glazing photo, the footer columns and the decorative connector line.
- The projects grid goes to three columns from 1024 up (two columns in the middle range, one on phones) so the cards keep their designed proportion instead of stretching.
- The how-we-work freeze/scroll behaviour uses the same 1024 width, with a height guard so short windows still scroll normally rather than pinning a section that cannot fit.

Below that new line the page keeps the stacked mobile arrangement it has today — that part is unchanged.
