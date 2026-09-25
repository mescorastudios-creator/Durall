/**
 * The first-visit opening sequence and the gate everything else waits on.
 *
 * `__root.tsx`'s pre-paint script adds `intro-pending` to <html> on the first
 * page load of a browser session (and never under reduced motion). While it
 * is there, the SiteIntro curtain covers the page, and every entrance that
 * would otherwise play on load — the hero, a page's own intro — builds its
 * start state underneath and then waits here. `releaseIntro()` is called as
 * the doors begin to part, so the page's own entrance plays into the reveal
 * instead of having finished, unseen, behind it.
 */
let release: (() => void) | undefined;

export const introGate: Promise<void> = new Promise((resolve) => {
  release = resolve;
});

export function releaseIntro() {
  release?.();
  release = undefined;
}

export function isIntroPending() {
  return (
    typeof document !== "undefined" && document.documentElement.classList.contains("intro-pending")
  );
}

export const INTRO_SEEN_KEY = "durall:intro";

if (!isIntroPending()) {
  // Nothing to wait for: already seen this session, reduced motion, SSR, or
  // the pre-paint script's own safety net has already given up on it.
  releaseIntro();
} else {
  // Belt and braces. Entrances build their start state and then wait on the
  // gate — if the curtain component somehow never mounts, that start state
  // would hold the page's headings invisible for good.
  setTimeout(releaseIntro, 6000);
}
