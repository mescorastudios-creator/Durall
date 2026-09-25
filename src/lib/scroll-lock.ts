type Lenis = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: number, options?: { immediate?: boolean; duration?: number }) => void;
};

let instance: Lenis | null = null;
let locks = 0;
let restoreOverflow = "";
let overflowLocked = false;

/** SmoothScroll registers its Lenis here so overlays can pause it. */
export function registerScroller(lenis: Lenis | null) {
  instance = lenis;
  // Lenis is created asynchronously, so an overlay can take a lock before it
  // exists — the opening sequence always does. Honour that lock the moment
  // it arrives, or the first wheel scrolls the page behind the curtain.
  if (instance && locks > 0) instance.stop();
}

/**
 * Scroll the page to an absolute position, through Lenis when it is running
 * so the move shares the site's smoothing, natively otherwise.
 */
export function scrollToY(y: number, { immediate = false } = {}) {
  if (instance) {
    instance.scrollTo(y, { immediate });
    return;
  }
  window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

/**
 * Stops the page scrolling behind a full-screen overlay.
 *
 * Lenis drives the real window scroll, so `overflow: hidden` alone leaves it
 * still running its own animation loop against a document that can no longer
 * move. `stop()` is the correct lever when it is present; the overflow lock
 * is the fallback for reduced motion, where Lenis is never created — and for
 * the window before Lenis has been created at all.
 *
 * Counted rather than boolean, so two overlays open at once cannot have the
 * first one closing unlock the page under the second. Whether the overflow
 * lock was taken is remembered separately, because Lenis can arrive between
 * the lock and the unlock.
 */
export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  if (instance) {
    instance.stop();
    return;
  }
  restoreOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  overflowLocked = true;
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  instance?.start();
  if (overflowLocked) {
    document.documentElement.style.overflow = restoreOverflow;
    overflowLocked = false;
  }
}
