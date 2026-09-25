import { useEffect, useRef, type RefObject } from "react";
import {
  loadGsap,
  markAnimReady,
  playAfterIntro,
  splitToLines,
  visibleOnLoad,
  type SplitHandle,
} from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";

/* ── Project page motion ──────────────────────────────────────────────────
 *
 * The project page takes its motion from the reference case study
 * (kononenkogroup.com/work/kotelnaya-kinetics), measured in a real browser:
 *
 *   - text arrives line by line, each line rising out of its own mask, and
 *     it *plays* once when its block comes into view rather than being
 *     scrubbed by the scroll bar — the rest of the site scrubs;
 *   - every move rides one curve, a fast start with a long, soft landing
 *     (`cubic-bezier(0.17, 0.84, 0.44, 1)`, very close to GSAP's `expo.out`);
 *   - photographs settle from an overscan rather than fading, so nothing is
 *     ever washed out against the white page on its way in.
 */
export const LANDING = "expo.out";

/**
 * Line-by-line reveal for a block of copy, played once on entry.
 *
 * Inside the returned ref, in DOM order:
 *   [data-line]  text split into masked lines that rise into place
 *   [data-rise]  anything else, which lifts and fades in
 *   [data-rule]  a hairline that draws from the left
 *
 * `data-with-prev` starts an element with the one before it instead of after.
 *
 * Once the reveal has played the split is undone, so the copy reflows
 * normally from then on — the lines are only lines while they are moving.
 */
export function useLineReveal<T extends HTMLElement = HTMLDivElement>({
  start = "clamp(top 86%)",
  stagger = 0.09,
}: { start?: string; stagger?: number } = {}): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    let cancelled = false;
    let dispose = () => {};

    void (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled || !ref.current) return;

      let splits: SplitHandle[] = [];
      let tl: gsap.core.Timeline | undefined;
      let trigger: ScrollTrigger | undefined;
      let played = false;
      let width = root.clientWidth;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const parts = () =>
        Array.from(root.querySelectorAll<HTMLElement>("[data-line], [data-rise], [data-rule]"));

      const teardown = () => {
        trigger?.kill();
        tl?.kill();
        splits.forEach((split) => split.revert());
        splits = [];
      };

      const finish = () => {
        splits.forEach((split) => split.revert());
        splits = [];
        gsap.set(parts(), { clearProps: "transform,opacity" });
        observer.disconnect();
      };

      const build = async () => {
        teardown();
        const elements = parts();
        const lines = new Map<HTMLElement, HTMLElement[]>();
        for (const el of elements) {
          if (!el.hasAttribute("data-line")) continue;
          const split = await splitToLines(el, "reveal-line");
          if (cancelled) {
            split.revert();
            return;
          }
          splits.push(split);
          lines.set(el, split.inners);
        }

        const timeline = gsap.timeline({
          paused: true,
          defaults: { ease: LANDING },
          onComplete: finish,
        });
        let at = 0;
        elements.forEach((el, index) => {
          if (index > 0 && !el.hasAttribute("data-with-prev")) at += stagger;
          const inners = lines.get(el);
          if (inners) {
            gsap.set(el, { opacity: 1 });
            timeline.fromTo(
              inners,
              { yPercent: 125 },
              { yPercent: 0, duration: 1.25, stagger: 0.075 },
              at,
            );
            // A long paragraph still hands on promptly: the next element
            // waits for about half of this one's cascade, not all of it.
            at += (inners.length - 1) * 0.04;
            return;
          }
          if (el.hasAttribute("data-rule")) {
            timeline.fromTo(
              el,
              { scaleX: 0, transformOrigin: "0% 50%" },
              { scaleX: 1, duration: 1.3 },
              at,
            );
            return;
          }
          timeline.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1 }, at);
        });
        tl = timeline;
        markAnimReady();

        if (played) {
          timeline.progress(1);
          return;
        }
        if (visibleOnLoad(root)) {
          played = true;
          playAfterIntro(timeline, () => cancelled);
          return;
        }
        // Not `once: true`: a once-trigger that fires while ScrollTrigger is
        // refreshing (a page reloaded part-way down, say) removes itself from
        // the list being walked and crashes the refresh. This one fires on
        // entry and simply stays, doing nothing further.
        trigger = ScrollTrigger.create({
          trigger: root,
          start,
          onEnter: () => {
            if (played) return;
            played = true;
            timeline.play();
          },
        });
      };

      // Line breaks only move when the width does, and only matter until the
      // reveal has played — after that the split is gone anyway.
      const observer = new ResizeObserver(() => {
        if (played) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          const next = root.clientWidth;
          if (Math.abs(next - width) < 2) return;
          width = next;
          void build();
        }, 180);
      });

      await build();
      if (cancelled) return;
      observer.observe(root);
      void document.fonts?.ready.then(() => {
        if (!played && !cancelled) void build();
      });

      dispose = () => {
        if (timer) clearTimeout(timer);
        observer.disconnect();
        teardown();
        gsap.set(parts(), { clearProps: "transform,opacity" });
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
 * A photograph uncovered from the bottom edge up, then left to drift.
 *
 * The frame is the returned ref and clips. Inside it:
 *   [data-curtain]          slides up from below the frame…
 *   [data-curtain-counter]  …while this slides down by the same amount, so
 *                           the photograph itself holds still and only the
 *                           window onto it opens — a wipe, done with two
 *                           transforms instead of an animated clip-path;
 *   [data-drift]            a taller layer that moves slower than the page
 *                           for as long as the frame is on screen;
 *   img                     settles out of an overscan as the wipe runs.
 */
export function useCurtainReveal<T extends HTMLElement = HTMLDivElement>({
  start = "clamp(top 88%)",
  drift = 7,
}: { start?: string; drift?: number } = {}): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame || prefersReducedMotion()) return;
    let cancelled = false;
    let dispose = () => {};

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const slide = frame.querySelector<HTMLElement>("[data-curtain]");
      const counter = frame.querySelector<HTMLElement>("[data-curtain-counter]");
      const layer = frame.querySelector<HTMLElement>("[data-drift]");
      const img = frame.querySelector<HTMLElement>("img");
      if (!slide || !counter || !img) return;

      const onScreen = visibleOnLoad(frame);
      const tl = gsap.timeline({
        paused: onScreen,
        defaults: { ease: LANDING },
        ...(onScreen
          ? {}
          : {
              // Plays on entry and never reverses; see useLineReveal on `once`.
              scrollTrigger: { trigger: frame, start, toggleActions: "play none none none" },
            }),
      });
      tl.fromTo(slide, { yPercent: 100 }, { yPercent: 0, duration: 1.5 }, 0)
        .fromTo(counter, { yPercent: -100 }, { yPercent: 0, duration: 1.5 }, 0)
        .fromTo(img, { scale: 1.28 }, { scale: 1, duration: 2.3 }, 0);
      markAnimReady();
      if (onScreen) playAfterIntro(tl, () => cancelled);

      const parallax = layer
        ? gsap.fromTo(
            layer,
            { yPercent: -drift / 2 },
            {
              yPercent: drift / 2,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          )
        : undefined;

      dispose = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        parallax?.scrollTrigger?.kill();
        parallax?.kill();
        gsap.set([slide, counter, img, layer].filter(Boolean), { clearProps: "transform" });
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
