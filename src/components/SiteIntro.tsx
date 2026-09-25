import { useEffect, useRef, useState, type CSSProperties } from "react";
import { INTRO_SEEN_KEY, isIntroPending, releaseIntro } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const WORDMARK = "DURALL SYSTEMS";

/* The loading half has to be shown for at least this long from navigation
 * start, or on a warm cache the mark would not finish drawing before the
 * doors part. The cap is the other side of the bargain: however slow the
 * hero image is, the reader is never held behind the curtain longer. */
const MIN_MS = 1250;
const CAP_MS = 2600;

const EASE_ENTRANCE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_MICRO = "cubic-bezier(0.33, 1, 0.68, 1)";
/* The one place a symmetric in-out curve is right: two heavy panels starting
 * from rest and coming to rest off-screen, like the sliding doors they are
 * standing in for. Everything that *arrives* still uses the entrance curve. */
const EASE_DOORS = "cubic-bezier(0.76, 0, 0.24, 1)";
const DOORS_MS = 1000;
const DOORS_DELAY_MS = 320;

/**
 * First-visit opening: the Durall mark draws itself, the wordmark rises, a
 * hairline fills as the page gets ready — then the screen parts down the
 * middle like one of Durall's own sliding doors, onto the page's entrance.
 *
 * The loading half is pure CSS (styles.css, "Site intro"), so it starts on
 * the very first paint instead of waiting for the JavaScript bundle. Script
 * only decides when to leave, runs the exit, and hands off to the page.
 *
 * Once per browser session, never on a client-side navigation, never under
 * reduced motion, and any wheel, key or tap skips straight to the exit.
 */
export function SiteIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isIntroPending()) {
      releaseIntro();
      setDone(true);
      return;
    }

    // The pre-paint script's safety net is only for a page whose script
    // never arrives. It has arrived; this component owns the curtain now.
    const w = window as Window & { __introSafety?: number };
    if (w.__introSafety) window.clearTimeout(w.__introSafety);

    lockScroll();
    window.scrollTo(0, 0);
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "seen");
    } catch {
      // Private mode or blocked storage: the intro simply plays again next
      // time, which is the right way to fail.
    }

    let exiting = false;
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const finish = () => {
      if (cancelled) return;
      document.documentElement.classList.remove("intro-pending");
      unlockScroll();
      setDone(true);
    };

    const exit = () => {
      if (exiting || cancelled) return;
      exiting = true;
      removeListeners();

      const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
      const content = q<HTMLElement>("[data-intro-content]");
      const bar = q<HTMLElement>("[data-intro-bar]");
      const left = q<HTMLElement>('[data-door="left"]');
      const right = q<HTMLElement>('[data-door="right"]');
      const edges = root.querySelectorAll<HTMLElement>("[data-door-edge]");

      // Finish the hairline from wherever the CSS fill has reached — a skip
      // can land at any point in it.
      if (bar) {
        const from = getComputedStyle(bar).scale || "0 1";
        bar.animate([{ scale: from }, { scale: "1 1" }], {
          duration: 260,
          easing: EASE_MICRO,
          fill: "forwards",
        });
      }
      content?.animate(
        [
          { opacity: 1, translate: "0 0" },
          { opacity: 0, translate: "0 -1.25rem" },
        ],
        { duration: 420, delay: 140, easing: EASE_MICRO, fill: "forwards" },
      );
      edges.forEach((edge) =>
        edge.animate([{ scale: "1 0" }, { scale: "1 1" }], {
          duration: 420,
          delay: 60,
          easing: EASE_ENTRANCE,
          fill: "forwards",
        }),
      );

      const doorOptions: KeyframeAnimationOptions = {
        duration: DOORS_MS,
        delay: DOORS_DELAY_MS,
        easing: EASE_DOORS,
        fill: "forwards",
      };
      left?.animate([{ translate: "0 0" }, { translate: "-101% 0" }], doorOptions);
      const opening = right?.animate([{ translate: "0 0" }, { translate: "101% 0" }], doorOptions);

      // The page's own entrance starts just as the gap opens, so the hero's
      // heading is rising into the light rather than finished behind it.
      later(releaseIntro, DOORS_DELAY_MS + 140);
      if (opening) void opening.finished.then(finish, finish);
      else later(finish, DOORS_DELAY_MS + DOORS_MS);
    };

    const onSkip = () => exit();
    const onKey = (event: KeyboardEvent) => {
      // Let the skip link and assistive shortcuts through untouched.
      if (event.key === "Tab" || event.metaKey || event.ctrlKey || event.altKey) return;
      exit();
    };
    const removeListeners = () => {
      window.removeEventListener("wheel", onSkip);
      window.removeEventListener("touchstart", onSkip);
      window.removeEventListener("pointerdown", onSkip);
      window.removeEventListener("keydown", onKey);
    };
    window.addEventListener("wheel", onSkip, { passive: true });
    window.addEventListener("touchstart", onSkip, { passive: true });
    window.addEventListener("pointerdown", onSkip);
    window.addEventListener("keydown", onKey);

    // Leave once the page is genuinely ready and the mark has had its moment,
    // or at the cap, whichever comes first.
    const elapsed = () => performance.now();
    const hero = document.querySelector<HTMLImageElement>('img[fetchpriority="high"]');
    const ready = Promise.all([
      document.fonts?.ready,
      hero?.decode ? hero.decode().catch(() => undefined) : undefined,
      new Promise((r) => later(() => r(undefined), Math.max(0, MIN_MS - elapsed()))),
    ]);
    const cap = new Promise((r) => later(() => r(undefined), Math.max(0, CAP_MS - elapsed())));
    void Promise.race([ready, cap]).then(exit);

    return () => {
      cancelled = true;
      removeListeners();
      timers.forEach((t) => window.clearTimeout(t));
      if (!exiting) unlockScroll();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="site-intro" aria-hidden="true">
      <div data-door="left" className="absolute inset-y-0 left-0 right-[calc(50%-1px)] bg-navy">
        <span data-door-edge className="intro-edge right-0" />
      </div>
      <div data-door="right" className="absolute inset-y-0 right-0 left-1/2 bg-navy">
        <span data-door-edge className="intro-edge left-0" />
      </div>

      <div
        data-intro-content
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="intro-mark h-[clamp(2.75rem,4vw,3.75rem)] w-auto"
        >
          <path
            pathLength={1}
            d="M4 4h7a8 8 0 0 1 0 16H4V4Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path pathLength={1} d="M14 12h7" stroke="currentColor" strokeWidth="1.1" />
        </svg>

        <p className="mt-[clamp(1.25rem,2.2vw,1.75rem)] font-display text-[clamp(1rem,1.7vw,1.375rem)] font-bold tracking-[0.3125rem] uppercase">
          <span className="intro-word">
            {Array.from(WORDMARK).map((char, i) => (
              <span key={i} className="intro-char" style={{ "--i": i } as CSSProperties}>
                {char === " " ? " " : char}
              </span>
            ))}
          </span>
        </p>

        <span className="relative mt-[clamp(1.5rem,2.6vw,2.25rem)] block h-px w-[clamp(8rem,13vw,12rem)] bg-white/15">
          <span data-intro-bar className="intro-bar absolute inset-0 bg-white/80" />
        </span>
      </div>
    </div>
  );
}
