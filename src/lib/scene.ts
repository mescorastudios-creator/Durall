import { useEffect, useRef } from "react";

/**
 * Scroll-driven scenes: a tall section whose first child is `position:
 * sticky` and one viewport high. The page appears to freeze while the
 * section's extra height scrolls past underneath, and that distance is the
 * scene's timeline.
 *
 * Sticky rather than a GSAP pin, deliberately. A pin reparents or offsets
 * the element and has to measure a pin-spacer, which is what made the old
 * "How we work" freeze depend on a runtime height check and fall back to a
 * different layout on shorter screens. Sticky is resolved by the browser's
 * own layout: it holds at every viewport size and zoom level, survives
 * resizes and route changes without a refresh, and costs nothing per frame.
 *
 * Progress is read from the section's own rect once per frame that
 * scrolled. That is a layout read, but nothing a scene writes (transform and
 * opacity only) invalidates layout, so it never forces a reflow.
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Hermite smoothstep: eases both ends of a 0–1 ramp. */
export const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/** 0 → 1 as `value` crosses [from, to]. */
export const ramp = (value: number, from: number, to: number) =>
  to === from ? (value >= to ? 1 : 0) : clamp01((value - from) / (to - from));

export function sceneProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const range = rect.height - window.innerHeight;
  return range > 0 ? clamp01(-rect.top / range) : 0;
}

/** The absolute scroll position at which a scene reaches `progress`. */
export function sceneScrollY(el: HTMLElement, progress: number) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  const range = el.offsetHeight - window.innerHeight;
  return top + Math.max(0, range) * clamp01(progress);
}

/**
 * Calls `onFrame(progress)` once per animation frame in which the page
 * scrolled or resized, while `query` matches. `onFrame` is read through a
 * ref, so it can close over fresh state without resubscribing.
 */
export function useSceneProgress<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onFrame: (progress: number) => void,
  {
    query = "(min-width: 64rem)",
    onLeaveQuery,
  }: {
    query?: string;
    /** Called when `query` stops matching, to clear any inline styles the
     *  scene wrote — the layout underneath is no longer the scene's. */
    onLeaveQuery?: () => void;
  } = {},
) {
  const callback = useRef(onFrame);
  callback.current = onFrame;
  const leave = useRef(onLeaveQuery);
  leave.current = onLeaveQuery;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = window.matchMedia(query);
    let frame = 0;

    const read = () => {
      frame = 0;
      if (!media.matches) return;
      callback.current(sceneProgress(el));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    const onMediaChange = () => {
      if (!media.matches) leave.current?.();
      schedule();
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", onMediaChange);
    void document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", onMediaChange);
    };
  }, [ref, query]);
}
