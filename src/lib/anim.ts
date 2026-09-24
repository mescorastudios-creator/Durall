import { useEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "./motion-prefs";

type GsapModule = (typeof import("gsap"))["gsap"];

let loader: Promise<{
  gsap: GsapModule;
  ScrollTrigger: (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];
}> | null = null;

/** Loads GSAP + ScrollTrigger once, on the client only. */
export function loadGsap() {
  if (!loader) {
    loader = (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
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

type RevealOptions = {
  /** Child selector to stagger. Omit to animate the element itself. */
  selector?: string;
  y?: number;
  stagger?: number;
  start?: string;
  duration?: number;
  delay?: number;
  /** Tie the reveal to scroll position instead of playing once. */
  scrub?: number | boolean;
  /** ScrollTrigger end, used with scrub for scroll-heavy pacing. */
  end?: string;
};

/**
 * Scroll-triggered fade + upward translate. Falls back to the final state
 * immediately when the user prefers reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const {
    selector,
    y = 32,
    stagger = 0.1,
    start = "top 85%",
    duration = 0.9,
    delay = 0,
    scrub,
    end,
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

      const tween = gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: scrub ? "none" : "power3.out",
        stagger,
        scrollTrigger: { trigger: el, start, ...(scrub ? { scrub, end: end ?? "top 30%" } : {}) },
      });
      markAnimReady();

      dispose = () => {
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

/**
 * The shared hero entrance: a line-by-line masked reveal of the heading, the
 * supporting `[data-hero-fade]` block behind it, and a slow settle plus
 * scroll parallax on the backdrop image.
 *
 * Hero.tsx and AboutHero.tsx each carried their own byte-identical copy of
 * this timeline. One implementation keeps them in step.
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
      const [{ gsap }, { default: SplitType }] = await Promise.all([
        loadGsap(),
        import("split-type"),
      ]);
      if (cancelled || !sectionRef.current) return;

      const supporting = section.querySelectorAll("[data-hero-fade]");
      const split = new SplitType(heading, { types: "lines", lineClass: "hero-line" });
      const lines = split.lines ?? [];
      lines.forEach((line) => {
        line.style.display = "block";
        line.style.overflow = "hidden";
        const inner = document.createElement("span");
        inner.className = "hero-line-inner block will-change-transform";
        while (line.firstChild) inner.appendChild(line.firstChild);
        line.appendChild(inner);
      });

      const inners = Array.from(heading.querySelectorAll<HTMLElement>(".hero-line-inner"));
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          inners.forEach((inner) => {
            inner.style.willChange = "auto";
          });
        },
      });
      gsap.set(heading, { opacity: 1 });
      tl.from(inners, { yPercent: 110, duration: 1.15, stagger: 0.12 }).from(
        supporting,
        { opacity: 0, y: 26, duration: 0.85, stagger: 0.12 },
        "-=0.6",
      );

      let parallax: gsap.core.Tween | undefined;
      const image = imageRef.current;
      if (image) {
        tl.from(image, { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0);
        parallax = gsap.fromTo(
          image,
          { yPercent: 0 },
          {
            yPercent: 12,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.1,
            },
          },
        );
      }
      markAnimReady();

      dispose = () => {
        parallax?.scrollTrigger?.kill();
        parallax?.kill();
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
    if (!el || prefersReducedMotion()) return;
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
 * Line-by-line masked heading reveal (split-type + GSAP).
 * Reduced motion leaves the heading untouched.
 */
export function useSplitLines<T extends HTMLElement = HTMLHeadingElement>(
  options: {
    start?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
  } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { start = "top 88%", stagger = 0.12, duration = 1.1, delay = 0 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void (async () => {
      const [{ gsap }, { default: SplitType }] = await Promise.all([
        loadGsap(),
        import("split-type"),
      ]);
      if (cancelled || !ref.current) return;

      let split: InstanceType<typeof SplitType> | undefined;
      let tween: gsap.core.Tween | undefined;
      let resizeTimer: ReturnType<typeof setTimeout> | undefined;
      let measuredWidth = el.clientWidth;

      const build = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
        split = new SplitType(el, { types: "lines", lineClass: "split-line" });
        const lines = split.lines ?? [];
        lines.forEach((line) => {
          line.style.overflow = "hidden";
          line.style.display = "block";
        });
        const inners = lines.map((line) => {
          const inner = document.createElement("span");
          inner.style.display = "block";
          inner.style.willChange = "transform, opacity";
          while (line.firstChild) inner.appendChild(line.firstChild);
          line.appendChild(inner);
          return inner;
        });
        tween = gsap.from(inners, {
          yPercent: 115,
          opacity: 0,
          duration,
          delay,
          stagger,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start },
          // Holding a compositor layer for the life of the page costs memory
          // for no benefit once the line has landed.
          onComplete: () => {
            inners.forEach((inner) => {
              inner.style.willChange = "auto";
            });
          },
        });
        markAnimReady();
      };
      build();

      const onResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const nextWidth = el.clientWidth;
          if (Math.abs(nextWidth - measuredWidth) > 1) {
            measuredWidth = nextWidth;
            build();
          }
        }, 175);
      };
      const observer = new ResizeObserver(onResize);
      observer.observe(el);
      void document.fonts?.ready.then(onResize);

      dispose = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        observer.disconnect();
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
 * Cinematic image reveal: a scrubbed clip-path uncover plus a slow inner
 * scale drift, tied to scroll position. Attach to the image wrapper.
 */
export function useClipReveal<T extends HTMLElement = HTMLDivElement>(
  options: {
    from?: "bottom" | "top";
    inner?: string;
    scale?: number;
  } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { from = "bottom", inner = "img", scale = 1.14 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const media = Array.from(el.querySelectorAll<HTMLElement>(inner));
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 45%", scrub: 1.2 },
      });
      tl.fromTo(
        el,
        {
          clipPath: from === "bottom" ? "inset(18% 0% 0% 0%)" : "inset(0% 0% 18% 0%)",
          opacity: 0.35,
        },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, ease: "none" },
        0,
      );
      if (media.length) {
        tl.fromTo(media, { scale }, { scale: 1, ease: "none" }, 0);
      }
      markAnimReady();

      dispose = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(el, { clearProps: "clipPath,opacity" });
        if (media.length) gsap.set(media, { clearProps: "transform" });
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
