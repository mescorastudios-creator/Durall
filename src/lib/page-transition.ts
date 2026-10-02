import type { ParsedLocation } from "@tanstack/react-router";
import { prefersReducedMotion } from "./motion-prefs";

/**
 * The page change: a circle reveal. The incoming page appears inside a
 * circle that opens from the point the reader clicked and grows until it
 * covers the screen.
 *
 * It runs on the browser's View Transitions API, which TanStack Router
 * drives through `defaultViewTransition`: the router snapshots the old page,
 * commits the new route, and the keyframes in styles.css ("Page
 * transition") clip the new snapshot to the growing circle.
 * PageTransition.tsx records where the click landed.
 *
 * Browsers without view transition *types* (Chrome < 125, Safari < 18.2)
 * keep the instant swap. Without types support the router would run a plain
 * cross-fade on every navigation — the projects filter included — so those
 * browsers get no transition at all rather than the wrong one.
 */

/** Keep in step with `--dur-reveal` in styles.css. */
export const REVEAL_MS = 600;

const TYPE = "circle-reveal";

type LocationChange = {
  fromLocation?: ParsedLocation;
  toLocation: ParsedLocation;
  pathChanged: boolean;
};

export function supportsReveal() {
  return (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof CSS !== "undefined" &&
    CSS.supports("selector(:active-view-transition-type(a))")
  );
}

/* Switched off from the admin panel (Site settings → Motion). */
let enabled = true;
export function setRevealEnabled(value: boolean) {
  enabled = value;
}

/** Whether this location change gets the reveal at all. */
export function willReveal(change: LocationChange) {
  if (!enabled) return false;
  // Never into, out of or within the admin panel.
  const admin = (location?: ParsedLocation) => location?.pathname.startsWith("/admin") ?? false;
  if (admin(change.toLocation) || admin(change.fromLocation)) return false;
  return change.pathChanged && supportsReveal() && !prefersReducedMotion();
}

/** The router's `types` callback. */
export function revealTypes(change: LocationChange): string[] | false {
  return willReveal(change) ? [TYPE] : false;
}

/**
 * Sets where the circle opens from, in viewport pixels, and the radius that
 * reaches the farthest corner of the screen from there.
 */
export function setRevealOrigin(x: number, y: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const radius = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y)));
  const style = document.documentElement.style;
  style.setProperty("--reveal-x", `${Math.round(x)}px`);
  style.setProperty("--reveal-y", `${Math.round(y)}px`);
  style.setProperty("--reveal-r", `${radius}px`);
}
