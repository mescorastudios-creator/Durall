# Durall — responsiveness, performance & animation pass

Enhancement only: existing visual design and copy are preserved throughout.
Verified at 375 / 768 / 853 / 900 / 1024 / 1280 / 1707 / 1920 px wide and at
browser zoom from 75 % to 150 % (emulated as the CSS viewport each zoom level
produces), on all four routes.

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

| viewport | before (`shell` / `shell-narrow`) | after |
|---:|---|---|
| 375 px | 20 px / 56 px | 20 px / 20 px |
| 768 px | 29 px / 115 px | 28.8 px / 28.8 px |
| 1280 px | 48 px / 191 px | 48 px / 48 px |
| 1920 px | 72 px / 287 px | 72 px / 287 px (unchanged) |

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

| page | images before | phone (375 px) | desktop (1280 px, DPR 2) |
|---|---:|---:|---:|
| `/` | 15.12 MB | **723 kB** (−96 %) | **1,486 kB** (−91 %) |
| `/about` | 6.41 MB | **466 kB** (−93 %) | **678 kB** (−90 %) |
| `/projects` | 17.64 MB | **222 kB** (−99 %) | **680 kB** (−97 %) |
| `/partners` | 6.46 MB | **253 kB** (−97 %) | **465 kB** (−93 %) |

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
an image in the Lovable editor writes a new `*.asset.json` and will *not* reach
`src/assets/images.ts`. The sidecars are left in place, unimported, so the
originals stay traceable — re-run the download-and-encode step when an image
changes. `contact-frame-2.png` and `stage-fabricate.png` also stay on disk
unimported: unlike the rest, those two were never on the CDN, so they are the
only masters.

---

## Performance

| | before | after |
|---|---:|---:|
| CSS (render-blocking) | 111.10 kB raw / 19.01 kB gz | **64.83 kB / 12.40 kB** |
| Images on `/` (phone) | 15.12 MB PNG | **723 kB WebP** |
| npm dependencies | 57 | **16** |
| `/partners` JS | + 41.53 kB gz motion | **no motion chunk** |

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
*backwards* onto the previous step. Scrub tightened to 0.6 and snapping made
directional.

**Featured gallery has a real pause** — `FeaturedProject.tsx`
The 7-image, 5 s loop paused on `onMouseEnter`/`onFocus` on a wrapper with no
focusable children, so `onFocus` never fired and keyboard and touch users could
not stop it. There is now an explicit pause/resume button.

**`prefers-reduced-motion`**
Already handled well; three gaps closed. The setting is now honoured when
turned on mid-session (smooth scroll stops, in-flight reveals jump to their
end state). `ConnectorLine` and Process's marker measurement checked the
preference *after* awaiting the GSAP import, so reduced-motion readers still
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
