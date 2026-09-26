import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { holdEntrances } from "@/lib/intro";
import { REVEAL_MS, setRevealOrigin, willReveal } from "@/lib/page-transition";

/* The heading should rise as the circle opens over it, not finish unseen
 * before the reveal reaches it: let go a little past half way. */
const RELEASE_AT = REVEAL_MS * 0.5;
/* However the transition ends — finished, skipped by a second navigation —
 * nothing may be left held. */
const SAFETY_MS = REVEAL_MS + 400;
/* A click older than this did not start the navigation (Back, Forward, a
 * redirect), so the circle opens from the middle of the screen instead. */
const CLICK_FRESH_MS = 1500;

/**
 * Drives the circle reveal between pages (see lib/page-transition.ts).
 *
 * It records where the reader clicked, so the circle opens from that point,
 * and it holds the incoming page's entrances while the circle grows, through
 * the same gate the opening sequence uses. Renders nothing.
 */
export function PageTransition() {
  const router = useRouter();

  useEffect(() => {
    let lastClick: { x: number; y: number; at: number } | null = null;
    let release: (() => void) | null = null;
    const timers: number[] = [];

    const onClick = (event: MouseEvent) => {
      // A keyboard "click" on a link has no pointer position; open from the
      // middle of the element that was activated instead.
      if (event.detail === 0) {
        const target = (event.target as Element | null)?.closest?.("a, button");
        if (!target) return;
        const r = target.getBoundingClientRect();
        lastClick = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: performance.now() };
        return;
      }
      lastClick = { x: event.clientX, y: event.clientY, at: performance.now() };
    };
    document.addEventListener("click", onClick, { capture: true });

    const letGo = () => {
      release?.();
      release = null;
    };

    const offBefore = router.subscribe("onBeforeNavigate", (event) => {
      if (!willReveal(event)) return;
      const fresh = lastClick && performance.now() - lastClick.at < CLICK_FRESH_MS;
      if (fresh && lastClick) setRevealOrigin(lastClick.x, lastClick.y);
      else setRevealOrigin(window.innerWidth / 2, window.innerHeight / 2);
      lastClick = null;
      // A navigation during a reveal: the previous hold goes now.
      letGo();
      release = holdEntrances();
      timers.push(window.setTimeout(letGo, SAFETY_MS));
    });

    const offRendered = router.subscribe("onRendered", (event) => {
      if (!event.pathChanged || !release) return;
      timers.push(window.setTimeout(letGo, RELEASE_AT));
    });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      offBefore();
      offRendered();
      timers.forEach((t) => window.clearTimeout(t));
      letGo();
    };
  }, [router]);

  return null;
}
