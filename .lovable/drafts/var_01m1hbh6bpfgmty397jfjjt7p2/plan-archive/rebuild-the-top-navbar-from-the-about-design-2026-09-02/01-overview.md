# Rebuild the top navbar from the About design

Replace the current light-white header bar with the navbar exactly as it appears in the About Figma frame, and use that one header on both the homepage and the About page.

## What the About navbar looks like

- Full-width dark navy bar (translucent over the hero photo), fixed height, thin bottom hairline.
- Left: the Durall "D" mark followed by the wordmark **DURALL SYSTEMS** in white uppercase display type with wide letter spacing.
- Right: seven links — Projects, Systems, Expertise, About, Partners, Insights, Contact — small uppercase display type, tracked out, in muted white.
- The link for the current page is shown in solid white and bolder (About on the About page, Projects-style default on the homepage).

## Behaviour

- One shared header component, rendered by both routes — no second copy.
- Homepage links keep pointing to the existing homepage sections; About and any section that has no page yet point back to the homepage anchors, so nothing links to a dead route.
- Same hover micro-interaction already used today (slight lift plus colour shift via motion), with the reduced-motion fallback unchanged.
- Below desktop widths the link row wraps and shrinks with the existing clamp scale, same as now.
