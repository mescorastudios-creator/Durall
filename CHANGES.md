# Durall — responsiveness, performance, animation, navigation

Enhancement only: existing visual design and copy are preserved throughout,
except where a section is named below as new.

Verified at 375 / 768 / 853 / 900 / 1024 / 1151 / 1152 / 1280 / 1707 / 1920 px
wide and at browser zoom from 75 % to 150 % (emulated as the CSS viewport each
zoom level produces), across all nine routes.

Nothing is committed — this repository has no git history. Run `bun install`
before deploying: `package.json` lost 41 dependencies and `bun.lock` is stale.

---

## Responsiveness

**Container widths now converge** — `src/styles.css`
`shell-narrow` expressed its 287 px Figma inset as plain `14.95vw`, so it
stayed proportionally huge all the way down: 191 px gutters at 1280 px and
56 px at 375 px, against `shell`'s 48 px and 20 px. Projects and Insights were
inset 36 px further than the rest of the page on a phone. The track now
matches `shell` exactly up to 1600 px, then ramps to the full inset by 1920 px.

| viewport | before (`shell` / `shell-narrow`) | after                      |
| -------: | --------------------------------- | -------------------------- |
|   375 px | 20 px / 56 px                     | 20 px / 20 px              |
|   768 px | 29 px / 115 px                    | 28.8 px / 28.8 px          |
|  1280 px | 48 px / 191 px                    | 48 px / 48 px              |
|  1920 px | 72 px / 287 px                    | 72 px / 287 px (unchanged) |

**Process freeze-frame no longer hides content** — `Process.tsx`
The pin was gated on width alone, so a 1024×640 window — a 1280×800 laptop at
125 % zoom — still froze the section while step 05 and the section's only CTA
fell outside the frame, unreachable because Lenis owns the wheel. The gate is
now a runtime measurement of what the column actually needs, and every height
lock hangs off that measurement rather than off the `lg` breakpoint, so a
wide-but-short window keeps two columns at its natural height instead of
clamping and clipping.

The accordion also opens one step at a time rather than cumulatively (your
call). That takes the column from 891 px to 639 px at 1280×800, which is what
lets the freeze-frame run on ordinary laptops at all — it never actually fit
before, it just clipped quietly.

**Contact plate starts at 1600 px, not 1024 px** — `Contact.tsx`
The overlay is sized in container-query units for a 1920 px canvas. At a
1280 px viewport that resolved to 9.98 px body copy and 9.47 px form inputs.
Below 1600 px the responsive two-column layout now runs instead: 16 px lede,
14 px inputs, 44 px field height. The plate's own box was also declared
`aspect-[1920/872]` while the photograph is 1920×826, which left every overlay
percentage sitting slightly low on the glazing bars.

**Touch targets** — header, Process, Insights, Contact, ProjectGrid,
FeaturedProject, DurallFooter
28 of 41 interactive elements on the home page were under 44 px tall at 375 px,
including every nav link (18–20 px at 10 px type). All four routes now report
zero. Where padding would have cost layout height — the Process accordion, the
project filter tabs, the sort control — the target is grown with a
pseudo-element so the row keeps its original box.

**Header height is measured, not guessed** — `SiteHeader.tsx`, `styles.css`
Taller nav rows made the absolutely-positioned header overlap the About,
Partners and Projects hero copy on mobile. The header now publishes its
measured height as `--header-h` and those three reserve it, with the original
desktop padding kept as a floor (1280 px is unchanged at 144 px).

Also: `touch-action: manipulation` and an intentional tap-highlight on every
control; `env(safe-area-inset-*)` on the full-bleed hero and the footer.

---

## Images

**The real photography is now vendored and optimized.**

Every photograph resolved through a `*.asset.json` sidecar pointing at
Lovable's asset CDN, which 404s outside Lovable's own dev proxy — so the site
had no images at all when run locally. More importantly, that CDN serves the
untouched original: no WebP or AVIF on `Accept`, no resizing unless you pass an
undocumented `?w=`. The 27 images the site uses were **34.8 MB of PNG**, 4.06 MB
of it the hero backdrop alone.

They are downloaded, re-encoded to WebP at the widths the layout actually uses,
and imported through a small registry (`src/assets/images.ts`) that carries
`src`, `srcSet`, `width` and `height` together. Nothing was substituted — this
is the same Parikrama House, Patina and Chiltron photography, re-encoded.

| page        | images before |     phone (375 px) | desktop (1280 px, DPR 2) |
| ----------- | ------------: | -----------------: | -----------------------: |
| `/`         |      15.12 MB | **723 kB** (−96 %) |     **1,486 kB** (−91 %) |
| `/about`    |       6.41 MB | **466 kB** (−93 %) |       **678 kB** (−90 %) |
| `/projects` |      17.64 MB | **222 kB** (−99 %) |       **680 kB** (−97 %) |
| `/partners` |       6.46 MB | **253 kB** (−97 %) |       **465 kB** (−93 %) |

Encoding notes: photographs at q=78–82 with `-sharp_yuv`; the wordmark stays
lossless because it is flat colour on transparency. Lossless was tried on the
drawings first and preserved the source scans' noise at five times the size —
the line-house drawing was 146 kB lossless against 30 kB at q=90, and the two
are indistinguishable at display size.

`og:image` now points at a dedicated 1200×630 JPEG in `public/` rather than the
hero asset: social cards want 1.91∶1, crawler support for WebP cards is still
uneven, and the Lovable CDN sends `x-robots-tag: noindex, nofollow`, which is
not what you want on a card image.

**The tradeoff:** the site no longer depends on Lovable's asset pipeline for
photography, which is why it works locally. The flip side is that re-uploading
an image in the Lovable editor writes a new `*.asset.json` and will _not_ reach
`src/assets/images.ts`. The sidecars are left in place, unimported, so the
originals stay traceable — re-run the download-and-encode step when an image
changes. `contact-frame-2.png` and `stage-fabricate.png` also stay on disk
unimported: unlike the rest, those two were never on the CDN, so they are the
only masters.

---

## Contact page (`/contact`)

A dedicated contact route, built from the existing system — no new colours,
fonts, spacing steps or motion.

**Structure**
`SiteHeader variant="light"` → `ContactIntro` → `ContactBody` → `DurallFooter`.

- `ContactIntro` is `ProjectsIntro`'s shape: the quiet white opening rather
  than the full-height photographic hero, so the form is reachable without
  scrolling a viewport first. Same `--header-h` reservation, same
  `useSplitLines` heading and `useReveal` lede.
- `ContactBody` uses `AboutPhilosophy`'s three-track grid —
  `lg:grid-cols-[minmax(0,1.15fr)_1px_minmax(0,0.75fr)]` with the `bg-navy-14`
  hairline between — form left, direct lines right, stacking below `lg`.

**Reused rather than rebuilt:** `SiteHeader`, `DurallFooter`, `ArrowRight`, the
field underline and `focus-within` treatment from the home page's enquiry
panel, `OurApproach`'s icon chips, the existing navy submit-button styling, and
`AnimatePresence` for the form↔confirmation swap at the same durations.

**Written new:** validation state only. `react-hook-form` and `zod` were
removed as unused earlier in this pass and four fields do not justify adding
them back.

**Form behaviour** — validates on blur, re-validates on change only once a
field has been left, `noValidate` so the written messages show instead of the
browser's, focus moves to the first invalid field on submit. `aria-invalid`
and `aria-describedby` per field, `role="alert"` on messages, `role="status"`
plus `aria-live="polite"` on the confirmation. The submit button stays enabled
until the request is in flight, then shows a spinner and `aria-busy`. A failed
submission keeps every value and offers a retry.

Verified: 375 / 768 / 853 / 1024 / 1280 / 1920 px and 75–150 % zoom, no
overflow at any of them; 0 of 31 interactive elements under 44 px; error text
4.77∶1 on white.

**Two things to change before this is live**

1. `src/components/durall/contact/data.ts` holds deliberately fake contact
   details. There is no real email, phone or address anywhere in the codebase,
   and a plausible-looking invented number is the kind of thing that ships by
   accident — so they are obviously wrong instead. Replace `value` and `href`.
2. `src/components/durall/contact/submit.ts` simulates the request. Replace the
   function body with a real `fetch`; the form only depends on its
   `SubmitResult` shape. Append `?simulateError` to the URL to see the error
   state, or go offline — that check is real.

**One token worth a look:** field errors use `--destructive` (`#e7000b`). It is
defined in the project's tokens, but nothing else on the site renders red, so
it is the one colour here you have not seen in context. Swap it if it reads as
too loud against the navy.

**Also fixed:** `/projects` was passing the default transparent header over its
white intro, so the entire nav was rendering white-on-white and was invisible.
It now uses `variant="light"` like the home page. The nav, footer and both page
CTAs that pointed at `/#contact` now point at `/contact`; the glazing-plate
sections on `/` and `/about` stay as in-page shortcuts.

---

## Performance

|                       |                      before |                   after |
| --------------------- | --------------------------: | ----------------------: |
| CSS (render-blocking) | 111.10 kB raw / 19.01 kB gz | **64.83 kB / 12.40 kB** |
| Images on `/` (phone) |                15.12 MB PNG |         **723 kB WebP** |
| npm dependencies      |                          57 |                  **16** |
| `/partners` JS        |        + 41.53 kB gz motion |     **no motion chunk** |

**46 unused shadcn components removed**
Nothing outside `src/components/ui` imported any of them. They were still
swept by `@source "../src"`, so their utilities shipped in the stylesheet.
Deleted, along with `src/hooks/use-mobile.tsx`, and the Tailwind scan narrowed
to the directories the site actually renders. 41 dependencies dropped from
`package.json` (26 Radix packages, `recharts`, `date-fns`, `react-day-picker`,
`cmdk`, `vaul`, `embla`, `input-otp`, `react-resizable-panels`, `sonner`,
`zod`, `react-hook-form`, `class-variance-authority`, `tw-animate-css`,
`@gsap/react`). `components.json` is untouched, so `shadcn add` still works
when a component is genuinely needed.

**The LCP headline no longer hides behind a lazy import** — `Hero.tsx`,
`AboutHero.tsx`, `__root.tsx`, `styles.css`
Both `<h1>`s shipped with `opacity-0` in the server-rendered HTML and only
became visible once two dynamic imports (`gsap`, `split-type`) resolved — and
never at all if either failed. The hidden state moved to a class that a
synchronous inline script applies before first paint, only when JS is running
and motion is allowed, with a 2.5 s failsafe that reveals the page if GSAP
never arrives. The same mechanism removes the flash where server-rendered copy
painted, was snapped to `opacity: 0` by GSAP's `from` tweens, then faded back.

**Images**

- `contact-frame-2.png` 807 kB → 26 kB WebP; `stage-fabricate.png` 747 kB →
  56 kB. The PNGs stay in `src/assets`, unimported, for re-encoding.
- `loading` corrected: the About and Partners hero plates were `lazy` (they are
  above the fold and LCP candidates); the home page's Philosophy image was
  eager and is below the fold.
- `width`/`height` added to the seven images that had neither dimensions nor an
  aspect-ratio ancestor — all on `/about` and `/partners`, and one of them
  (`about-line-house`) measured 0 px tall before load.

**Fonts** — `__root.tsx`
Space Grotesk and Inter (both variable, one file each) are preloaded as
`woff2` so they are fetched in parallel with the Google Fonts stylesheet
rather than after it parses. EB Garamond is left off the critical path.
The two gstatic URLs are version-pinned; if Google rotates them the preload
becomes a harmless unused-preload warning and the stylesheet still resolves
the correct file.

**`motion` off the critical path where it can be** — `ui.tsx`
`CtaButton`, `UnderlineLink`, `ViewMore` and `Interactive` were motion
components driving 2–3 px hover nudges. They are CSS transitions now, which
takes `/partners` off the motion chunk entirely. The home page, `/about` and
`/projects` still load it — Process's spring-driven marker and the
`AnimatePresence` transitions genuinely need it.

Also: `og:image` (the card was declaring `summary_large_image` with no image),
`theme-color`, and `will-change` cleared once split-line reveals settle.

---

## Animations

**Staggered grid reveals were dead and now run** — `ui.tsx`
`Interactive` destructured only the props it knew about and dropped the rest,
so the `data-card` / `data-cell` markers its call sites pass never reached the
DOM — `[data-card]` matched **zero** elements and the scrubbed reveals on the
home page's Projects and Insights grids and both Partners grids silently never
fired. Fixed by forwarding the rest props.

This is new motion you will see that was not there before.

**ScrollTrigger refreshes on route change** — `SmoothScroll.tsx`
A client-side navigation swaps the page without firing `load` or `resize`, so
every trigger the incoming route mounted measured a document whose images and
fonts had not settled. `SmoothScroll` also moved from each route to the root:
it was being torn down and rebuilt on every navigation, and briefly ran two
Lenis instances while routes swapped.

**Process pin stops fighting the user** — `Process.tsx`
Lenis smooths the wheel over ~1.6 s; the pin stacked `scrub: 1.2` on top and
`snap` on top of that, with `directional: false` — so a fast flick could settle
_backwards_ onto the previous step. Scrub tightened to 0.6 and snapping made
directional.

**Featured gallery has a real pause** — `FeaturedProject.tsx`
The 7-image, 5 s loop paused on `onMouseEnter`/`onFocus` on a wrapper with no
focusable children, so `onFocus` never fired and keyboard and touch users could
not stop it. There is now an explicit pause/resume button.

**`prefers-reduced-motion`**
Already handled well; three gaps closed. The setting is now honoured when
turned on mid-session (smooth scroll stops, in-flight reveals jump to their
end state). `ConnectorLine` and Process's marker measurement checked the
preference _after_ awaiting the GSAP import, so reduced-motion readers still
paid for ~45 kB of GSAP to be told not to animate.

---

## Accessibility & code health

- `/partners` had no `#contact` section, so DurallFooter's Careers, LinkedIn,
  Instagram and YouTube links were dead there. Every footer and nav destination
  is a router `Link` with an explicit route now — which also means the in-page
  nav items no longer force a full document reload from `/about`.
- Skip link, `<main id="main">` landmark on all four routes.
- Contact form: `autocomplete`, `inputmode`, `spellCheck={false}` on email,
  `aria-live` on the confirmation, an explicit `background-color`/`color` on the
  native `<select>` for Windows dark mode, and a stronger focus affordance on
  fields that suppress their own ring.
- `Process.tsx` timeline rail used `last:hidden` on a span that is never its
  parent's last child, so the rail always drew past the final dot.
- The duplicated hero timeline in `Hero.tsx` and `AboutHero.tsx` is one
  `useHeroIntro` hook.
- `SiteFooter` deleted; `DurallFooter` is used on all four routes (your call).
- Projects filter and sort live in the URL (`?category=…&sort=…`), defaults
  omitted so the canonical URL stays `/projects`.
- Curly apostrophes, `text-balance` / `text-pretty` on headings and ledes,
  `tabular-nums` on the two counters that change value.

---

## Contact page — office map beside the enquiry form

**Layout.** The map of the head office is on the left; **Send an Enquiry** is
on the right, with email and phone ("Direct Lines") under the form. On phones
the map comes first and the form follows. The map is a fixed height (up to
44rem) and stays in view while the form column scrolls past it on desktop.

**The office.** Durall Systems India Pvt Ltd, Kolivery Village, P and T
Colony, Vakola, Santacruz East, Mumbai 400098 — placed at the centre of its
plus code, 3VC7+6M3 (19.07051° N, 72.86417° E), decoded rather than looked
up. The address card on the map has **Get directions** and **Open in Maps**
(both Google Maps, new tab). The old placeholder "Studio" address is gone;
email and phone are still placeholders.

**The map.** MapLibre GL with OpenFreeMap's free OpenStreetMap vector tiles
(no API key, no usage fees), restyled in `contact/mapTheme.ts` to the site's
palette: paper land, blue-grey water, white roads, navy place names, pale 3D
buildings from zoom 14, and a soft ring on the ground under a navy Durall pin.
When it comes into view the camera flies from a wide view of Mumbai to a
tilted close-up over the office (4.2 s), the buildings rising as it lands,
and the pin drops in and starts a slow pulse. Under reduced motion it opens
straight on the close-up with no pulse.

- **Never steals the page's scroll.** A plain wheel scrolls the page (the map
  says to hold ⌘/Ctrl to zoom); ⌘/Ctrl-scroll and trackpad pinch zoom the map
  without moving the page; on touch, one finger scrolls the page and two move
  the map. Zoom in/out and "back to the office" buttons, 44 px.
- **Loads only when needed.** MapLibre (273 kB gzipped) and its stylesheet are
  fetched when the map is within a screen of view, never with the page. Until
  then — or for good, if the tiles are blocked — the frame shows a faint
  drafting grid with the address card on top, so the address and directions
  never depend on the map.
- **Credit.** The OpenStreetMap / OpenFreeMap credit sits bottom-left; on
  narrow maps it folds behind its ⓘ so it doesn't run into the controls.
- One console warning ("Expected value to be of type number, but found null")
  comes from OpenFreeMap's own style and appears with it unmodified.

**Bug found while testing, fixed:** MapLibre's stylesheet sets the map
element to `position: relative`, overriding `absolute inset-0` on the same
element, so the map was built at its 300 px fallback height and the fly-in
landed 200 px off the office. The map now mounts inside a wrapper that does
the sizing.

**Dependency:** `maplibre-gl` added to `package.json`. `bun.lock` was not
updated (bun isn't installed here) — `bun install` updates it.

Verified at 1440×900, 1920×1080, 1024×768 and 390×844: the pin lands centred
in the part of the map the card leaves clear, nothing overlaps (pin, card,
controls, credit), no horizontal overflow, keyboard order runs card → map
controls → form, 0 console errors.

---

## Project detail page (`/projects/$slug`)

**New page: `/projects/parikrama-murud-house`**, brought over from its own
Lovable project (`5465a695…`) and rebuilt on this site's header, footer,
closing plate, type and colour. The content and section order are the Lovable
page's; its duplicate header, footer and empty contact box are replaced by the
site's own. Motion is taken from the reference case study,
kononenkogroup.com/work/kotelnaya-kinetics, studied frame by frame in a real
browser first.

What the reference does, and what this page now does:

| reference                                                                    | here                                                                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| photo settles from 110 % over ~2.5 s after its preloader                     | same; uncovered from the bottom edge first, except when the site opening just played |
| title rises line by line out of masks                                        | same (`expo.out`, 1.3 s, 0.1 s stagger)                                              |
| area figure rolls column by column, like an odometer                         | 750 m² rolls in, each column turning a different number of times                     |
| hero photo moves at 0.2× scroll                                              | same                                                                                 |
| copy reveals line by line, played once on entry (not scrubbed)               | same — `useLineReveal`; the split is undone afterwards so text reflows normally      |
| fixed pill: Detail / Masonry / Slider, shown while gallery is on screen      | same, with a sliding active pill; hidden below 768 px as on the reference            |
| switching layout flies every photo to its new place                          | same — `src/lib/flip.ts`                                                             |
| clicking a photo grows it to full screen, the rest fly into a thumbnail rail | same, plus captions, a counter, prev/next and swipe                                  |
| thumbnail swaps grow/shrink between rail and stage                           | same                                                                                 |
| closing flies everything home, scrolled to the photo viewed                  | same                                                                                 |
| next-work title rolls on hover                                               | same                                                                                 |

**Photographs never stretch in flight.** A plain FLIP distorts an
`object-fit: cover` image whenever the two boxes differ in proportion, which in
a layout switch is always. `flip.ts` counter-scales the image every frame so its
own scale stays uniform and exactly covers the box. Measured over six
switches — about 3,560 in-flight samples: worst distortion 0.002 % (rounding),
0 frames where a photo failed to cover its box, 0 frames over 20 ms.

**Nothing fades against white.** Photos arrive by a white shutter lifting off
them and a settle from overscan, not by opacity — the washed-out look the
project cards had before is not reintroduced here. Thumbnails in flight travel
at full strength and only dim once they land in the rail.

**Viewer** is a modal dialog: focus moves to Close and is trapped, Escape
closes, arrows step through, focus returns to the photo's own button, the page
underneath can't scroll, and leaving the page with it open can't leave the
next page locked.

**Routing.** `/projects` moved to `projects.index.tsx` (as Insights did) so
`/projects/$slug` can exist beside it; unknown slugs are a real 404 from the
loader.

**Every project has a page.** Parikrama's is the written case study. The
other seven — Sentosa House, Patina, Chiltron House, Juhu House, Project
Bangalore, Banyan Villa and the Ritz-Carlton, Maldives — are built from the
same template with placeholder content (`placeholder: true` in
`project/data.ts`):

- the project's own photograph as the hero, first gallery plate and scope
  image; the Ritz-Carlton's was cut out of its thumbnail's feathered border,
  the only photograph of it on file;
- the facts already on the site (architect, location, typology, year), with
  "To be confirmed" for area, Durall's role and system; the hero figure rolls
  in the completion year, or is left out where there isn't one;
- copy that says it is placeholder text rather than inventing claims about
  real buildings;
- Parikrama's photographs standing in for the rest of the gallery and two
  section images, each labelled "Placeholder photograph" to screen readers
  and in the viewer's caption.

Every card links to its page: the "View Project" links on `/projects` (which
pointed back at the grid), the Parikrama "Explore Project" link, and all five
project cards on the home page, whose whole card is the target. "Next
project" runs through all eight in order and wraps round. The page is keyed
by project, so moving from one to the next replays the arrival and resets the
gallery instead of carrying the last project's state over. To write up a
case study, replace its `placeholderProject(…)` call with a full entry like
Parikrama's.

**Images.** 12 photos, 25 files, 1.8 MB of WebP (from ~17 MB of PNG). The
originals were 1 px-feathered exports and one had a 183 px transparent band
across the top; each was cropped to its opaque area before encoding.

**Bugs found while testing, fixed:**

- ScrollTrigger crashed (`reading 'end'`) when the page was reloaded part-way
  down: a `once: true` trigger fired during a refresh and removed itself from
  the list being walked. The page's triggers now play on entry and stay.
- Under reduced motion the viewer still flew and faded, because
  `useReducedMotion()` reports `false` on its first render and the viewer does
  all of its work in its first render. It now reads the preference directly.
  GSAP, Lenis and split-type are no longer downloaded on this page under
  reduced motion.
- Line masks clipped descenders mid-reveal ("journey" read "iourneu"); masks
  are now padded past the glyphs with the padding taken back by a negative
  margin, as the reference does.
- `<span>` hairlines sat directly inside `<dl>`/`<ul>`; moved to valid spots.

Verified in a real browser at 1024×768, 1280×720, 1366×657, 1440×900,
1920×1080, 2560×1440 and 3440×1440: hero fits under the header with no overlap
between title and figure, no horizontal overflow, the pill appears only with
the gallery, the viewer's stage keeps each photo's proportions (1.500 for the
pavilion at every size), and 0 console errors. Also checked: first visit
(the site opening plays and the hero skips its own curtain), arrival by client
navigation (opens at the top, curtain plays, figure lands on 750, Projects is
active in the nav), reduced motion, and a 390 px phone (stacked, two-column
gallery, viewer with a bottom rail).

---

## Cinematic pass — opening, frozen scenes, scroll feel

Studied against the reference site in a real browser (Playwright) before
building anything: its scroll glide, its opening, and how it freezes the
window. The motion principles are carried over; its black-and-neon look is not.

**Scroll feel matched to the reference** — `SmoothScroll.tsx`
Lenis restarted a fixed 1.6s ease on every wheel event, so one notch took
**839ms** to cover 90% of its travel against the reference's **575ms**. Now
lerp-based (`0.075`): measured **525–547ms**, same 180px travel.

**First-visit opening** — `SiteIntro.tsx`, `lib/intro.ts`, `styles.css`
The Durall mark draws itself, the wordmark rises, a hairline fills as the page
gets ready, then the screen parts down the middle like one of Durall's own
sliding doors. **2.6s** end to end.

- The loading half is pure CSS, so it is on the very first paint instead of
  waiting for the JavaScript bundle.
- The page's own entrance waits under the curtain and plays _into_ the reveal
  (`introGate`) — the hero heading is rising as the doors part, not finished
  behind them. The header fades in last.
- Once per browser session; never on client-side navigation; never under
  reduced motion; any wheel, key or tap skips straight to the exit, and a
  wheel during it does not scroll the page behind.
- Fails safe: the pre-paint script drops the curtain at 4.5s if the bundle
  never arrives, and the gate releases itself at 6s regardless.

**04 — How we work, rebuilt as a sticky scene** — `Process.tsx`, `lib/scene.ts`
The reference freezes the window with CSS `position: sticky`, not a GSAP pin.
So does this now. The old pin switched stages at thresholds, animated the
accordion's `height` inside the frozen frame, snapped scroll after release,
and had to measure at runtime whether the column fit.

- Scroll position drives the scene continuously: the marker glides, each
  photograph eases in over the last while settling from overscan, the
  description hands over with a short empty beat so two paragraphs never
  share the slot.
- The rail and description slot are fixed-height, so the column fits one
  viewport at every size. Clicking a stage _scrolls to it_, so a click can
  never be undone by the next wheel tick.
- Verified at 1024×768, 1280×600, 1280×720, 1366×657, 1440×900, 1536×864,
  1920×1080, 2560×1440 and 3440×1440: frame freezes, content fits and clears
  the header, marker on its dot, stages 01→05. Wheel-driven: **60fps, 0
  frames over 33ms**.
- Reduced motion: still freezes and follows the scroll, but every change is
  an instant switch.

**Our Approach, a frozen cinematic sequence** — `about/OurApproach.tsx`
The four capabilities arrive one at a time; each draws a line; the four
converge and run into the Durall mark; the mark assembles with a pulse as the
line arrives; a line carries on to the drawing; the drawing is uncovered left
to right. One paused GSAP timeline, its progress set from the sticky scene.

- Connectors are measured from the live layout. The previous fixed SVG ran
  straight through the capability text at 1440px; now **0 crossings** and the
  line meets the mark's edge to the pixel at all nine sizes above.
- The drawing's wipe is two opposing transforms, not a `clip-path`.
- Reduced motion, phones, and pre-script: the finished composition, static.

**Hero dissolves on the way out** — `lib/anim.ts`
Copy lifts and fades across the first two-thirds of the hero's exit while the
photograph keeps its slower parallax (1.0 → 0.32 → 0 over 600px).

**Route changes opened mid-page** — `SmoothScroll.tsx`
Found during the sweep. While Lenis was still gliding out a previous gesture
it wrote its position back every frame, overwriting the router's reset:
clicking a nav link 5,000px down the home page opened `/about` **4,984px
down**. Masked until now because the header only existed at the top of each
page. Lenis now stands down on `onBeforeNavigate` and resumes after
`onRendered`. After: opens at **0**, Back restores the previous position,
hash links land on their section.

**Full-site sweep** — 9 routes × 5 sizes (1024×768 → 2560×1440), real wheel
input top to bottom: 0 console errors, 0 horizontal overflow, 0 stuck or
hidden content, footer reached everywhere. Four isolated frames over 33ms
(one of 133ms) appeared during the long sweep on the dev server; none
reproduced when each page was re-run fresh and warm.

---

## Motion system rebuild (landing page)

The landing page ran **ten distinct easing curves**: `power3.out`, `expo.out`
and `power4.out` in GSAP; `cubic-bezier(.22,1,.36,1)`, `ease-out` and the
browser default in CSS; `[0.16,1,0.3,1]`, `[0.4,0,0.2,1]`, `easeOut` and a
`spring(300, 22)` in motion/react. Durations ran 0.5 / 0.9 / 1.1 / 1.15 / 1.6 /
2.2 / 2.6 s against 120 / 200 / 220 / 300 / 900 ms. Travel distances used nine
values. Six different trigger points meant a heading fired at `top 88%` while
the paragraph beneath it fired at `top 85%` — no section arrived as one thing.

**Two curves now, and they are the same two everywhere** —
`src/lib/anim.ts`, `src/lib/motion-tokens.ts`, `src/styles.css`

| token                | GSAP         | CSS               | motion/react     |
| -------------------- | ------------ | ----------------- | ---------------- |
| entrance (quint-out) | `power4.out` | `--ease-entrance` | `CURVE.entrance` |
| micro (cubic-out)    | `power3.out` | `--ease-micro`    | `CURVE.micro`    |
| scrubbed             | `none`       | —                 | —                |

Durations collapse to `180 / 320 / 560 / 900 ms` (plus `2.2 s` for backdrops
and full-bleed stage imagery), travel to `16 / 32 / 56 px`. Scrubbed tweens are
deliberately linear — scroll position is their clock, and an ease on top of it
fights the reader's own hand.

**Sections enter as one timeline** — `useSectionIntro` in `src/lib/anim.ts`
One ScrollTrigger drives one timeline whose children enter in DOM order, marked
with `data-anim` / `data-anim="lines"` / `data-anim="media"`. Philosophy alone
had been running five independent hooks.

**Reveals are tied to scroll position, not viewport entry**
Every entrance now opens across one window — `clamp(top 85%)` to
`clamp(top 58%)`, `scrub: 0.6`. `clamp()` keeps both ends inside the document's
real scroll range, so a section near the footer is reachable instead of sitting
permanently half-revealed. The 0.6 lag rides Lenis's own velocity smoothing.

| landing page                    | before | after |
| ------------------------------- | -----: | ----: |
| ScrollTriggers                  |     20 |    17 |
| binary "play on viewport enter" |     13 |     0 |
| scroll-linked                   |      7 |    16 |
| distinct entrance windows       |      6 |     2 |
| distinct entrance curves        |     10 |     1 |

**Content visible before any scroll now plays instead of scrubbing**
`visibleOnLoad()` checks, at hook time, whether the element is already on
screen. It always is for a page's own intro — and a scrubbed reveal with no
scroll to drive it sits at progress 0, i.e. invisible. Caught on `/insights`,
where the h1 did not appear until the reader scrolled.

**`clip-path` is gone** — `useClipReveal`
It animated `clip-path` every scrubbed frame, which repaints the element and is
against the "transform and opacity only" rule in
`docs/web-interface-guidelines.md`. The wrapper already clips, so the media now
slides inside it by the amount the clip used to hide: identical uncover, two
compositor properties, no paint. The moving element is a new
`[data-clip-inner]` wrapper rather than the `<img>`, because in three of the
four places this is used the image already carries a parallax drift and in the
fourth it is a `motion.img` being cross-faded.

**`backgroundColor` off the main thread** — `Contact.tsx`
The plate's submit button animated `backgroundColor` through a motion spring.
It is a CSS `hover:bg-` on the shared micro token now, and the button is a
plain `<button>`.

**Micro-interactions unified** — `src/styles.css`, `ui.tsx`
`.interactive`, `.hover-lift`, `.hover-arrow` and `.media-zoom` back every
hover, press and focus movement on the site. Arrows travel rather than whole
labels; card image zoom retunes from 900 ms/`ease-out` to the micro token.
Eight motion/react springs at three stiffnesses are gone.

**Same-page anchors smooth-scroll** — `SmoothScroll.tsx`
`#philosophy` and friends were native jumps on a site that smooth-scrolls
everything else. Delegated at the document so any anchor added later inherits
it, offset by the measured header height, and focus moves to the target —
scrolling is not navigating.

**Verified in a real browser (Playwright), not a headless pane.** Warm scroll
across 7,000px: median frame **16.7ms (59.9fps)**, p99 **17.7ms**, **0 frames
over 33ms**. First-pass spikes were lazy-image decode, not animation work.
Under emulated `prefers-reduced-motion`, GSAP, Lenis and split-type are **never
downloaded at all**.

Two defects only a real browser could surface, both fixed: every page intro and
article heading sat at `opacity: 0` until the reader scrolled (a ScrollTrigger
attached to content the reader is already sitting on gets reset by the
`refresh()` that runs when a route settles — above-the-fold content now gets no
trigger at all); and `/partners` left the paragraph under its hero heading
stranded at its start opacity on every load, because two hooks were animating
one subtree. `PartnersHero` is a single timeline now, like every other section.

Reduced motion is unchanged in behaviour and still bails **before** the GSAP
import; the new CSS layer, the header slide and the menu cascade each have
their own `prefers-reduced-motion` branch.

**Card grids no longer sit half-transparent** — `ProjectGrid.tsx`,
`Projects.tsx`, `Insights.tsx`, `insights.index.tsx`

Two faults stacked on `/projects`. The grid was animated by GSAP _and_ by
motion/react at once — it has to keep its `AnimatePresence`, because filtering
adds and removes cards — so two libraries wrote `opacity` on the same elements
every frame. GSAP won, and because its window ran to `bottom 55%` of a tall
six-card grid, cards sat washed out against white for most of the time they
were on screen: measured **0.53 / 0.40 / 0.26 / 0.13 with the whole grid in
view**. The GSAP reveal is gone from that grid; the entrance belongs to
whichever system owns the element's lifecycle.

The other grids kept their reveal but now end on the grid's own **top** rather
than its bottom, so the cascade finishes while the grid is arriving instead of
after the reader has scrolled past it. Measured after: **0 cards faded once
fully on screen**, on every grid, at every scroll position.

---

---

## Navbar rebuild

**It was `position: absolute`.** Measured at scrollY 2000 its top sat at
-2000 px: on a 7,967 px landing page there was no navigation at all below the
hero, on every route.

**Fixed, direction-aware** — `SiteHeader.tsx`, `src/styles.css`
Transparent over a dark hero, white with a hairline and `backdrop-blur` past
24 px, slides away on scroll down past 400 px and returns the moment the reader
scrolls up. Transform only. A 6 px threshold stops a hand resting on a trackpad
flickering it. The handler is deliberately synchronous rather than deferred to
a rAF: the work is two comparisons against `scrollY`, and running it inline
means the bar's colour can never be a frame behind the ground beneath it.

**Eight items, one row, from 1152 px** — measured, not guessed

| label                              | width at the nav's type size |
| ---------------------------------- | ---------------------------: |
| `Partners / International Systems` |                   **251 px** |
| `International Systems`            |                       169 px |
| `Partners`                         |                        68 px |

The full label is nearly four times the next-widest item and takes a third of
the bar; inline it forces a 1181 px minimum. The bar shows **Partners**, the
accessible name carries **Partners / International Systems** (WCAG 2.5.3 holds
— the accessible name contains the visible label), and the menu shows it in
full. At 1152 px the eight items need 882 px and have 270 px of slack; at
1024 px they would fit with 18 px to spare, which is the definition of cramped.

**A real mobile menu, not a squeezed bar**
Full-screen navy panel, items cascading in on the entrance curve at 40 ms
apart. Focus trap in both directions, `Escape` closes and returns focus to the
toggle, `aria-expanded` / `aria-controls`, the panel is `hidden` when closed so
it leaves the accessibility tree, and the page behind it is paused through
Lenis (`lockScroll`, counted, with an `overflow` fallback for reduced motion
where Lenis never starts). Idle menu links measure **9.47:1** on navy.

**Active state** — `aria-current="page"` plus the underline the site already
used. `/insights/<slug>` lights up Insights.

White nav over the hero measures **8.25:1** against the brightest pixel the
photograph can supply under the navy scrim.

---

## Routing

Eight destinations, all real routes. Three did not exist.

| nav item                         | before                       | after                  |
| -------------------------------- | ---------------------------- | ---------------------- |
| Home                             | _not in the nav at all_      | `/`                    |
| About                            | `/about`                     | `/about`               |
| Projects                         | `/projects`                  | `/projects`            |
| Expertise                        | `/#process`                  | **`/expertise`** (new) |
| Partners / International Systems | `/partners`                  | `/partners`            |
| Insights                         | `/#insights`                 | **`/insights`** (new)  |
| Careers                          | `/contact` (from the footer) | **`/careers`** (new)   |
| Contact                          | `/contact`                   | `/contact`             |

**Nine dead links fixed.** Every one pointed at the section it already sat in:
`ViewMore → #projects`, `ViewMore → #insights`, and four "Read article"
controls → `#insights`, so no article ever opened. They reach `/projects`,
`/insights` and `/insights/$slug` now.

**Three full page reloads fixed.** `AboutHero`, `PartnersClosing` and
`ProjectsCta` used plain `<a href>` across routes. `CtaButton`, `UnderlineLink`
and `ViewMore` take a `to` prop and render a router `<Link>`.

**One mislabelled destination.** `Process.tsx` read "Explore our approach" and
went to the contact section; it goes to `/about#approach`.

**Footer remapped** — nine entries that pointed into the middle of the home
page now go to the page that owns the content.

---

## New pages

**`/expertise`** — opens around the existing five-stage `Process` section
rather than duplicating it, with a four-system grid built from the headings the
footer's Solutions column already named.

**`/insights`** + **`/insights/$slug`** — index and article pages over a shared
`ARTICLES` module. An unknown slug is a `notFound()` in the loader, so it 404s
instead of rendering chrome around nothing. Article metadata is the site's own;
**the article bodies are newly written** — the site had four headlines whose
links pointed back at themselves, so there was no body copy to carry across.
They are written to the claims the existing standfirsts already make. **Have
whoever owns Durall's technical writing read them before launch.**

**`/careers`** — nothing about careers existed anywhere in `src/`. The roles in
`careers/data.ts` are deliberately, visibly placeholder ("Role title —
placeholder") rather than plausible: a convincing invented job posting is the
kind of thing that ships by accident and that someone then applies to. Set
`ROLES` to `[]` and the page shows its written "nothing open right now" state.
`APPLY_EMAIL` is a placeholder for the same reason as the contact details.

**Shared `PageIntro` and `PageCta`** — `ProjectsIntro` and `ContactIntro` each
carried their own copy of the same opening band; `ProjectsCta` is now a
four-line wrapper over `PageCta`.

---

## Left alone, and why

- **The contact form does not send anywhere.** It calls `preventDefault()` and
  flips to a thank-you state. That is a product decision, not a bug to fix
  quietly.
- **Social links point at the contact section** because the site has no profile
  URLs to link to.
- **`og:image` is a relative path.** Make it absolute once the production
  domain is fixed — a few crawlers refuse to resolve relative ones.
- **`.dark` theme variables** are fully defined but `.dark` is never applied
  and there is no toggle. Left in place; removing them is a design decision.
- **The header scrolls away** and never returns. On a 7,500 px page there is no
  way back to the nav without scrolling to the top. Worth deciding on.
- **Images are vendored, not pipelined.** There is no build-time image step —
  the WebP files are committed as-is. A Vite image plugin would regenerate them
  from originals on every build, which is tidier but adds a dependency and
  build time for a set of photographs that rarely changes.
- **Core Web Vitals were not measured.** The browser pane runs its tab hidden,
  which throttles paint — it reported a 4.8 s LCP against a 259 ms
  `domComplete`. Every performance number above is a build measurement or a
  defect visible in the code, never a fabricated field metric. Run Lighthouse
  against a real deploy for LCP/CLS/INP.
- **Vercel-specific build and edge tuning does not apply.** This deploys to
  Netlify Functions (`netlify.toml`, `nitro: { preset: "netlify" }`). The Vercel
  document in `docs/` is the Web Interface Guidelines — a UI-quality standard
  that applies regardless of host — and it was used throughout.

**Per-project pages.** "Explore Project" and "View Project" on `/projects`
still point at `#portfolio`, the grid they already sit in. There are no project
detail routes and none of the eight nav destinations needs one, so building a
fifth page type was outside this pass. Their motion is on the shared tokens
now; the destinations are still dead.

**`/projects` and `/contact` intros.** Both could fold into the new
`PageIntro`, but `/projects` has no eyebrow and adding one is a content
decision, not a technical one. Their motion values were quantised onto the
token scale in place.

**Article bodies.** Written, not transcribed — see above. Not a technical risk,
an editorial one.
