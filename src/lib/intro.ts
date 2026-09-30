/**
 * The page-load opening sequence and the gate everything else waits on.
 *
 * `__root.tsx`'s pre-paint script adds `intro-pending` to <html> on every
 * full page load (and never under reduced motion). While it
 * is there, the SiteIntro curtain covers the page, and every entrance that
 * would otherwise play on load — the hero, a page's own intro — builds its
 * start state underneath and then waits here. `releaseIntro()` is called as
 * the doors begin to part, so the page's own entrance plays into the reveal
 * instead of having finished, unseen, behind it.
 *
 * The gate can be taken again later: a page change holds it while the new
 * page slides in (see PageTransition.tsx), for the same reason.
 */
let release: (() => void) | undefined;

let gate: Promise<void> = new Promise((resolve) => {
  release = resolve;
});

/** The gate as it stands now. Read it at the moment an entrance is ready. */
export function entranceGate() {
  return gate;
}

export function releaseIntro() {
  release?.();
  release = undefined;
}

/**
 * Holds every on-load entrance that becomes ready from now on, until the
 * returned function is called. Holds stack: an entrance waits for all of
 * them, and for the opening sequence if that is still running.
 */
export function holdEntrances(): () => void {
  let letGo = () => {};
  const held = new Promise<void>((resolve) => {
    letGo = resolve;
  });
  gate = Promise.all([gate, held]).then(() => undefined);
  return () => letGo();
}

/** Whether the curtain is up and waiting for SiteIntro. Not while the
 * pre-paint script's safety net is already fading it out (`intro-bailout`). */
export function isIntroPending() {
  if (typeof document === "undefined") return false;
  const { classList } = document.documentElement;
  return classList.contains("intro-pending") && !classList.contains("intro-bailout");
}

if (!isIntroPending()) {
  // Nothing to wait for: reduced motion, SSR, or
  // the pre-paint script's own safety net has already given up on it.
  releaseIntro();
} else {
  // Belt and braces. Entrances build their start state and then wait on the
  // gate — if the curtain component somehow never mounts, that start state
  // would hold the page's headings invisible for good.
  setTimeout(releaseIntro, 6000);
}
