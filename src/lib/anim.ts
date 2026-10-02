import { useEffect, useRef, type RefObject } from "react";
import { entranceGate } from "./intro";
import { prefersReducedMotion } from "./motion-prefs";

type GsapModule = (typeof import("gsap"))["gsap"];

/* ── The motion system ────────────────────────────────────────────────────
 *
 * Two curves, four durations, three travel distances, one scroll window.
 * Their CSS twins live in src/styles.css (`--ease-entrance`, `--ease-micro`,
 * `--dur-*`) so a hover and the entrance it follows are the same gesture.
 *
 * `power4.out` is quint-out and `power3.out` is cubic-out; those are what
 * `cubic-bezier(0.22, 1, 0.36, 1)` and `cubic-bezier(0.33, 1, 0.68, 1)`
 * approximate, which is why the pairing holds to the eye.
 *
 * Scrubbed motion uses neither. Scroll position is its clock, so its tweens
 * are linear and the phrasing comes from the stagger instead — an ease on a
 * scrubbed tween fights the reader's own hand.
 */
export const EASE = {
  entrance: "power4.out",
  micro: "power3.out",
} as const;

export const DUR = {
  micro: 0.18,
  short: 0.32,
  medium: 0.56,
  long: 0.9,
} as const;

export const TRAVEL = {
  sm: 16,
  md: 32,
  lg: 56,
} as const;

/**
 * The window every scroll reveal on the site opens across.
 *
 * `clamp()` (GSAP 3.12+) keeps both ends inside the document's real scroll
 * range, which is what makes the last section on a page reachable — an
 * unclamped `top 58%` on content near the footer can never be scrolled to,
 * and the reveal would sit permanently half-finished.
 *
 * 85% → 58% is about a quarter of the viewport: roughly one wheel gesture
 * with Lenis, so content completes quickly while still being driven by
 * scroll position rather than merely triggered by it. The 0.6 scrub lets it
 * lag the cursor slightly and settle — that lag is what reads as velocity.
 */
export const REVEAL_WINDOW = {
  start: "clamp(top 85%)",
  end: "clamp(top 58%)",
  scrub: 0.6,
} as const;

let loader: Promise<{
  gsap: GsapModule;
  ScrollTrigger: (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];
}> | null = null;

/**
 * Resolves once the page has been drawn, complete, under the opening curtain
 * (and straight away when there is no curtain).
 *
 * Every entrance starts by hiding what it is about to bring in. On a fast
 * connection the script can get there before the page's first paint, and
 * then the hero's text is first painted when the curtain has parted, which
 * is what the browser reports as LCP. Waiting for one painted frame costs
 * nothing the reader can see: the curtain is still closed over it.
 */
function paintedUnderCurtain(): Promise<void> {
  const { classList } = document.documentElement;
  if (!classList.contains("intro-covered")) return Promise.resolve();
  return new Promise((resolve) => {
    const check = () => {
      // Held back for the fonts (see the pre-paint script in __root.tsx).
      if (classList.contains("fonts-pending")) return void requestAnimationFrame(check);
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    };
    check();
  });
}

/** Loads GSAP + ScrollTrigger once, on the client only. */
export function loadGsap() {
  if (!loader) {
    loader = (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        paintedUnderCurtain(),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })();
  }
  return loader;
}

/**
 * Drops the `anim-pending` class that __root.tsx's inline script put on
 * <html> to hide entrance-animated content before first paint.
 *
 * Called once a hook has actually created its tween — GSAP's `from` tweens
 * write their start state as inline styles, which outrank the class rule, so
 * by the next frame the element is held by the tween rather than by the CSS
 * and the class is safe to remove. Deferring a frame avoids a one-frame flash
 * between the two.
 */
export function markAnimReady() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root.classList.contains("anim-pending")) return;
  requestAnimationFrame(() => root.classList.remove("anim-pending"));
}

export type SplitHandle = {
  inners: HTMLElement[];
  revert: () => void;
};

/**
 * Splits an element into lines and wraps each in a mask, returning the inner
 * spans to animate. Shared by the heading reveal and the section timeline so
 * both produce byte-identical markup.
 *
 * The mask is a `clip-path` a little larger than the line's own box, so
 * descenders and accents clear it at a tight leading ("journey" used to read
 * "iourneu" while it rose). It used to be `overflow: hidden` with padding
 * taken back by negative margins, which did not cancel out between lines:
 * a split block stood taller than the same text unsplit, and the page below
 * it jumped when the split was made and again when it was undone.
 */
export async function splitToLines(el: HTMLElement, lineClass: string): Promise<SplitHandle> {
  const { default: SplitType } = await import("split-type");
  const split = new SplitType(el, { types: "lines", lineClass });
  const lines = split.lines ?? [];
  const inners = lines.map((line) => {
    line.style.display = "block";
    line.style.clipPath = "inset(-0.1em -0.1em -0.16em)";
    const inner = document.createElement("span");
    inner.style.display = "block";
    inner.style.willChange = "transform, opacity";
    while (line.firstChild) inner.appendChild(line.firstChild);
    line.appendChild(inner);
    return inner;
  });
  return {
    inners,
    revert: () => split.revert(),
  };
}

/**
 * Plays an on-load entrance once whatever is covering the page lets go of
 * it — the opening sequence on a full load, the circle reveal on a page change
 * — and immediately when nothing is. The animation is built paused
 * beforehand so its start state is already holding the element.
 */
export function playAfterIntro(animation: { play: () => unknown }, isCancelled: () => boolean) {
  void entranceGate().then(() => {
    if (!isCancelled()) animation.play();
  });
}

/**
 * Whether this is a mouse-and-trackpad device. The scroll-linked drifts
 * (parallax, the push-in) are kept to those: a phone scrolls natively, on its
 * own thread, and a transform rewritten from the main thread on every scroll
 * event trails the finger by a frame, which reads as a wobble rather than as
 * depth. Reveals still play on touch; they are not tied to each frame.
 */
export function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Holding a compositor layer past the landing costs memory for no benefit. */
function releaseLayers(elements: HTMLElement[]) {
  elements.forEach((el) => {
    el.style.willChange = "auto";
  });
}

/**
 * True when the element is already on screen at the moment its hook runs.
 *
 * Content in this position gets **no ScrollTrigger at all** — it just plays.
 *
 * Scroll position cannot drive a reveal for something visible before any
 * scrolling has happened; there is no scroll to drive it with. Dropping the
 * scrub but keeping the trigger is not enough either: its start clamps to
 * scroll position 0, and the `ScrollTrigger.refresh()` that runs when a
 * route settles then re-applies the start state of a trigger the reader is
 * sitting exactly on top of — which left every page intro, and every article
 * heading, invisible until the reader scrolled.
 *
 * The hero has always worked this way. This makes every other above-the-fold
 * entrance work the same way. `inFirstScreen` below decides which content
 * that is; this only decides whether it can play straight away.
 */
export function visibleOnLoad(el: HTMLElement) {
  const { top, bottom } = el.getBoundingClientRect();
  return bottom > 0 && top < window.innerHeight * 0.9;
}

/**
 * True when the element sits in the first screen of the document — where
 * `visibleOnLoad` would be true at scroll position 0 — whatever the page is
 * scrolled to right now.
 *
 * This, not the current viewport, is what decides between playing and
 * scrubbing. A reload mid-page restores the scroll position before the hooks
 * run, so a hero is off screen at that moment; given a scrubbed trigger, its
 * `REVEAL_WINDOW` start and end both clamp to 0 (or the start alone does, for
 * content just above the fold), and at scroll 0 — the only place the reader
 * can see it from — the scrub sits at its start state for good. The hero's
 * heading, copy and image card on /partners stayed invisible that way.
 */
export function inFirstScreen(el: HTMLElement) {
  const { top, bottom } = el.getBoundingClientRect();
  return bottom + window.scrollY > 0 && top + window.scrollY < window.innerHeight * 0.9;
}

/**
 * Plays a paused first-screen entrance: after the opening when it is on
 * screen now, otherwise the first time it scrolls back into view, so a reader
 * returning to the top of a restored page still sees it arrive. Returns a
 * function that stops waiting.
 */
function playWhenSeen(el: HTMLElement, play: () => void, isCancelled: () => boolean) {
  if (visibleOnLoad(el) || typeof IntersectionObserver === "undefined") {
    playAfterIntro({ play }, isCancelled);
    return () => {};
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    playAfterIntro({ play }, isCancelled);
  });
  observer.observe(el);
  return () => observer.disconnect();
}

type RevealOptions = {
  /** Child selector to stagger. Omit to animate the element itself. */
  selector?: string;
  y?: number;
  stagger?: number;
  start?: string;
  end?: string;
  /**
   * Play once on enter instead of tracking scroll position. The site's
   * default is scroll-linked; this is for the few places where the element
   * is revealed by something other than scrolling.
   */
  once?: boolean;
  duration?: number;
  delay?: number;
  scrub?: number | boolean;
};

/**
 * The site's standard reveal: a fade and rise, driven by scroll position
 * across `REVEAL_WINDOW`. Returns to its start state on scroll back, because
 * the scroll bar is the transport.
 *
 * Falls back to the final state immediately under reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const {
    selector,
    y = TRAVEL.md,
    stagger = 0.12,
    start = REVEAL_WINDOW.start,
    end = REVEAL_WINDOW.end,
    once = false,
    duration = DUR.long,
    delay = 0,
    scrub = once ? false : REVEAL_WINDOW.scrub,
  } = options;

  useEffect(() => {
    const el = ref.current;
    // Under reduced motion nothing was hidden in the first place — the
    // pre-paint class is never applied — so there is no work to undo, and no
    // reason to pull ~45KB of GSAP down to do it.
    if (!el || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const targets: Element[] = selector ? Array.from(el.querySelectorAll(selector)) : [el];
      if (!targets.length) return;

      const onScreen = inFirstScreen(el);
      const scrubbing = scrub && !onScreen;
      const tween = gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: scrubbing ? "none" : EASE.entrance,
        stagger,
        paused: onScreen,
        ...(onScreen
          ? {}
          : { scrollTrigger: { trigger: el, start, ...(scrubbing ? { scrub, end } : {}) } }),
      });
      markAnimReady();
      const stopWaiting = onScreen
        ? playWhenSeen(
            el,
            () => tween.play(),
            () => cancelled,
          )
        : null;

      dispose = () => {
        stopWaiting?.();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      cancelled = true;
      dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

type IntroOptions = {
  /** Children to phrase, in DOM order. */
  selector?: string;
  /** Seconds between each child's entrance within the timeline. */
  stagger?: number;
  y?: number;
  start?: string;
  end?: string;
  scrub?: number | boolean;
};

/**
 * One timeline for a whole section.
 *
 * This replaces the pattern of hanging three to five independent hooks off
 * one section, which is what made sections arrive as loose parts: a heading
 * fired at `top 88%` while the paragraph under it fired at `top 85%`, on a
 * different curve, from a different distance. Philosophy alone ran five
 * separate triggers for what the reader sees as one thing appearing.
 *
 * Here a section is a single ScrollTrigger driving a single timeline, and
 * its children enter in DOM order:
 *
 *   <div ref={ref}>
 *     <p   data-anim />            ← eyebrow
 *     <h2  data-anim="lines" />    ← masked line-by-line reveal
 *     <p   data-anim />            ← lede
 *     <div data-anim="media" />    ← photograph, travels further and longer
 *   </div>
 *
 * `data-anim-lead` marks a child that should start with the one before it
 * rather than after it, for parts that read as a pair.
 */
export function useSectionIntro<T extends HTMLElement = HTMLDivElement>(
  options: IntroOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const {
    selector = "[data-anim]",
    stagger = 0.16,
    y = TRAVEL.md,
    start = REVEAL_WINDOW.start,
    end = REVEAL_WINDOW.end,
    scrub = REVEAL_WINDOW.scrub,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled || !ref.current) return;

      const children = Array.from(el.querySelectorAll<HTMLElement>(selector));
      if (!children.length) return;

      const splits: SplitHandle[] = [];
      const layered: HTMLElement[] = [];
      // Lines have to be measured before the timeline is built, and each
      // heading resolves to a different number of them, so the splitting is
      // done up front rather than inside the loop below.
      const lineMap = new Map<HTMLElement, HTMLElement[]>();
      for (const child of children) {
        if (child.dataset["anim"] !== "lines") continue;
        const handle = await splitToLines(child, "split-line");
        if (cancelled) {
          handle.revert();
          return;
        }
        splits.push(handle);
        lineMap.set(child, handle.inners);
        layered.push(...handle.inners);
        gsap.set(child, { opacity: 1 });
      }
      if (cancelled || !ref.current) {
        splits.forEach((s) => s.revert());
        return;
      }

      const onScreen = inFirstScreen(el);
      const scrubbing = scrub && !onScreen;
      const tl = gsap.timeline({
        paused: onScreen,
        ...(onScreen
          ? {}
          : { scrollTrigger: { trigger: el, start, ...(scrubbing ? { scrub, end } : {}) } }),
        onComplete: () => releaseLayers(layered),
      });

      let at = 0;
      children.forEach((child, index) => {
        const kind = child.dataset["anim"];
        const lead = child.dataset["animLead"] !== undefined;
        if (index > 0 && !lead) at += stagger;

        const lines = lineMap.get(child);
        if (lines?.length) {
          // A heading's own lines cascade inside the beat the heading owns,
          // so a three-line heading still occupies one step of the phrase.
          tl.from(
            lines,
            {
              yPercent: 112,
              opacity: 0,
              duration: DUR.long,
              ease: scrubbing ? "none" : EASE.entrance,
              stagger: stagger * 0.55,
            },
            at,
          );
          return;
        }

        const media = kind === "media";
        tl.from(
          child,
          {
            opacity: 0,
            y: media ? TRAVEL.lg : y,
            duration: media ? DUR.long : DUR.medium,
            ease: scrubbing ? "none" : EASE.entrance,
          },
          at,
        );
      });

      markAnimReady();
      const stopWaiting = onScreen
        ? playWhenSeen(
            el,
            () => tl.play(),
            () => cancelled,
          )
        : null;

      dispose = () => {
        stopWaiting?.();
        tl.scrollTrigger?.kill();
        tl.kill();
        splits.forEach((s) => s.revert());
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * What an opening photograph does while the page slides up over it.
 *
 * The openings are `position: sticky` (styles.css, "Opening photographs"):
 * they hold still and the next section travels over them. Under it the
 * photograph pushes in slightly and sinks into navy, so the page reads as
 * coming forward over something receding rather than as one flat sheet.
 * `[data-hero-media]` wraps the photograph (the entrance scales the image
 * itself, so the two never write to one element) and `[data-hero-dim]` is
 * the navy over it.
 *
 * Scroll positions are given as numbers: a trigger measured from a sticky
 * element reads wherever it happens to be stuck at the time.
 */
export function heroCover(gsap: GsapModule, section: HTMLElement) {
  const media = section.querySelector<HTMLElement>("[data-hero-media]");
  const dim = section.querySelector<HTMLElement>("[data-hero-dim]");
  const tl = gsap.timeline({
    defaults: { ease: "none", immediateRender: false },
    scrollTrigger: {
      start: 0,
      end: () => section.offsetHeight,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  if (media && finePointer()) tl.fromTo(media, { scale: 1 }, { scale: 1.12 }, 0);
  if (dim) tl.fromTo(dim, { opacity: 0 }, { opacity: 0.6 }, 0);
  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

/**
 * The shared hero entrance: a line-by-line masked reveal of the heading, the
 * supporting `[data-hero-fade]` block behind it, and a slow settle on the
 * backdrop image.
 *
 * This one plays rather than scrubs, because at scroll position 0 there is
 * no scroll to be driven by. It is the only played entrance on the site.
 */
export function useHeroIntro<
  S extends HTMLElement = HTMLElement,
  H extends HTMLElement = HTMLHeadingElement,
  I extends HTMLElement = HTMLImageElement,
>() {
  const sectionRef = useRef<S>(null);
  const headingRef = useRef<H>(null);
  const imageRef = useRef<I>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    // Nothing is hidden under reduced motion — the pre-paint class is never
    // applied — so the markup already reads correctly and GSAP is not needed.
    if (!section || !heading || prefersReducedMotion()) return;

    let dispose = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled || !sectionRef.current) return;
      const split = await splitToLines(heading, "hero-line");
      if (cancelled || !sectionRef.current) {
        split.revert();
        return;
      }

      const supporting = section.querySelectorAll("[data-hero-fade]");
      const inners = split.inners;
      // Built paused, so the start state is in place under the opening
      // curtain, and played the moment the doors begin to part.
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE.entrance },
        onComplete: () => releaseLayers(inners),
      });
      gsap.set(heading, { opacity: 1 });

      tl.from(inners, { yPercent: 112, duration: DUR.long * 1.3, stagger: 0.11 }).from(
        supporting,
        { opacity: 0, y: TRAVEL.md, duration: DUR.long, stagger: 0.11 },
        "-=0.55",
      );

      const image = imageRef.current;
      if (image) {
        // The backdrop settles out of its overscan across the whole intro,
        // so the photograph is still arriving as the last line lands.
        tl.from(image, { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0);
      }
      const stopCover = heroCover(gsap, section);
      /* The hero dissolves as it leaves rather than simply scrolling off:
       * its copy lifts and fades across the first two-thirds of the way out,
       * while the photograph behind is being covered (see heroCover). The copy
       * block is animated as a whole — the intro timeline owns the lines
       * and the supporting blocks inside it, so the two never touch the
       * same element. */
      const copy = heading.parentElement;
      const exit = copy
        ? gsap.fromTo(
            copy,
            { y: 0, opacity: 1 },
            {
              y: () => -window.innerHeight * 0.1,
              opacity: 0,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                start: 0,
                end: () => section.offsetHeight * 0.65,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          )
        : undefined;

      markAnimReady();
      playAfterIntro(tl, () => cancelled);

      dispose = () => {
        stopCover();
        exit?.scrollTrigger?.kill();
        exit?.kill();
        tl.kill();
        split.revert();
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return { sectionRef, headingRef, imageRef };
}

/** Subtle scrubbed parallax on a layered image. */
export function useParallax<T extends HTMLElement = HTMLImageElement>(
  strength = 10,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !finePointer()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const tween = gsap.fromTo(
        el,
        { yPercent: -strength / 2 },
        {
          yPercent: strength / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      dispose = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [strength]);

  return ref;
}

/**
 * Line-by-line masked heading reveal, driven by scroll position.
 *
 * Kept for the pages whose sections are not composed through
 * `useSectionIntro`; it now shares that hook's curve, window and travel, so
 * a heading revealed either way reads the same.
 */
export function useSplitLines<T extends HTMLElement = HTMLHeadingElement>(
  options: {
    start?: string;
    end?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
    scrub?: number | boolean;
  } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const {
    start = REVEAL_WINDOW.start,
    end = REVEAL_WINDOW.end,
    stagger = 0.1,
    duration = DUR.long,
    delay = 0,
    scrub = REVEAL_WINDOW.scrub,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled || !ref.current) return;

      let split: SplitHandle | undefined;
      let tween: gsap.core.Tween | undefined;
      let resizeTimer: ReturnType<typeof setTimeout> | undefined;
      let measuredWidth = el.clientWidth;
      // Set once a first-screen entrance has started, so a rebuild after
      // that lands it rather than playing it a second time.
      let played = false;
      let stopWaiting = () => {};
      const play = () => {
        played = true;
        tween?.play();
      };

      const build = async () => {
        stopWaiting();
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
        split = await splitToLines(el, "split-line");
        if (cancelled) {
          split.revert();
          return;
        }
        const inners = split.inners;
        gsap.set(el, { opacity: 1 });
        const onScreen = inFirstScreen(el);
        const scrubbing = scrub && !onScreen;
        tween = gsap.from(inners, {
          yPercent: 112,
          opacity: 0,
          duration,
          delay,
          stagger,
          ease: scrubbing ? "none" : EASE.entrance,
          paused: onScreen,
          ...(onScreen
            ? {}
            : { scrollTrigger: { trigger: el, start, ...(scrubbing ? { scrub, end } : {}) } }),
          onComplete: () => releaseLayers(inners),
        });
        markAnimReady();
        if (onScreen) {
          if (played) tween.progress(1);
          else stopWaiting = playWhenSeen(el, play, () => cancelled);
        }
      };
      await build();
      if (cancelled) return;

      // Only a real change in measured width can change where the lines
      // break, and only that is worth tearing the split down for. Font
      // loading is handled separately because it changes metrics without
      // changing the element's width.
      const onResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const nextWidth = el.clientWidth;
          if (Math.abs(nextWidth - measuredWidth) > 1) {
            measuredWidth = nextWidth;
            void build();
          }
        }, 175);
      };
      const observer = new ResizeObserver(onResize);
      observer.observe(el);
      void document.fonts?.ready.then(onResize);

      dispose = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        observer.disconnect();
        stopWaiting();
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * Cinematic image uncover, tied to scroll position.
 *
 * This used to animate `clip-path` frame by frame, which repaints the
 * element on every one of them — against the "transform and opacity only"
 * rule in docs/web-interface-guidelines.md, and the most expensive thing on
 * the page during a scroll. The same uncover is now a mask element the
 * media slides up inside: the wrapper already clips, so moving the media by
 * the amount the clip used to hide produces the identical reveal using two
 * compositor properties and no paint.
 *
 * Attach to the image wrapper. What moves is the `[data-clip-inner]` element
 * inside it, never the `<img>` itself — in three of the four places this is
 * used the image is already carrying a parallax drift, and in the fourth it
 * is a `motion.img` being cross-faded, so writing a transform onto it here
 * would take the element away from whichever ran second.
 */
export function useClipReveal<T extends HTMLElement = HTMLDivElement>(
  options: {
    inner?: string;
    /** Overscan the media starts at, as a scale factor. */
    scale?: number;
    /** Share of the frame the media is offset by at the start. */
    shift?: number;
    /** Seconds between one frame and the next, for a row of them. */
    stagger?: number;
  } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { inner = "[data-clip-inner]", scale = 1.14, shift = 14, stagger = 0 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const media = Array.from(el.querySelectorAll<HTMLElement>(inner));
      if (!media.length) return;

      const scrubbing = !inFirstScreen(el);
      const tl = gsap.timeline({
        paused: !scrubbing,
        ...(scrubbing
          ? {
              scrollTrigger: {
                trigger: el,
                start: REVEAL_WINDOW.start,
                end: "clamp(top 45%)",
                scrub: 1.2,
              },
            }
          : {}),
      });
      tl.fromTo(
        media,
        { yPercent: shift, scale, opacity: 0.55 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: scrubbing ? "none" : EASE.entrance,
          duration: DUR.long * 1.4,
          stagger,
        },
        0,
      );
      markAnimReady();
      const stopWaiting = scrubbing
        ? null
        : playWhenSeen(
            el,
            () => tl.play(),
            () => cancelled,
          );

      dispose = () => {
        stopWaiting?.();
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(media, { clearProps: "transform,opacity" });
      };
    });

    return () => {
      cancelled = true;
      dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * A slight push-in as a closing band arrives: its content settles from just
 * under full size across the reveal window, so the band reads as coming
 * forward rather than only sliding up. Transform only, scrubbed, and kept to
 * pointer devices (see `finePointer`).
 *
 * Attach to a wrapper inside the band, not the band itself: scaling the
 * coloured background would open a gap at its edges.
 */
export function usePushIn<T extends HTMLElement = HTMLDivElement>(
  from = 0.94,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !finePointer()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const tween = gsap.fromTo(
        el,
        { scale: from },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "clamp(top bottom)",
            end: "clamp(top 45%)",
            scrub: REVEAL_WINDOW.scrub,
          },
        },
      );
      dispose = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(el, { clearProps: "transform" });
      };
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [from]);

  return ref;
}
