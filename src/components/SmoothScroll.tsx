import { useEffect, useRef } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { loadGsap } from "@/lib/anim";
import { prefersReducedMotion, REDUCED_QUERY } from "@/lib/motion-prefs";
import { registerScroller } from "@/lib/scroll-lock";

/**
 * Site-wide Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger
 * stays in sync. Disabled entirely for prefers-reduced-motion (native scroll).
 *
 * Mounted once from the root route: it used to be rendered by each page,
 * which tore Lenis down and rebuilt it on every navigation and briefly ran
 * two instances at once while the routes swapped.
 */
export function SmoothScroll() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const settleRef = useRef<(() => void) | null>(null);
  const lenisRef = useRef<{ stop: () => void; start: () => void; resize: () => void } | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);
      if (cancelled) return;

      /* Continuous lerp smoothing rather than a fixed-duration ease.
       *
       * The previous `duration: 1.6` restarted a 1.6s curve on every wheel
       * event, so each notch dragged a long tail behind it: one notch took
       * 839ms to cover 90% of its travel. Calibrated against the reference
       * site the brief pointed at, measured the same way in a real browser
       * (575ms), this lands within a frame or two of it while keeping the
       * weight that makes the pinned scenes feel deliberate. */
      const lenis = new Lenis({
        lerp: 0.075,
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
      const update = () => ScrollTrigger.update();
      lenis.on("scroll", update);
      lenisRef.current = lenis;
      // Lets the mobile navigation pause the page behind it.
      registerScroller(lenis);

      /* Same-page hash links used to be native jumps on a site that smooth
       * scrolls everything else — the hero's own "Discover Durall" button
       * among them. Delegated here rather than in each component so any
       * anchor added later inherits it, and so the landing accounts for the
       * fixed header's height.
       *
       * In the capture phase, so it also takes the router's own links to a
       * section of the page they are on ("View open roles"): the router sees
       * the click as handled and does not jump there first. A link to a
       * different page, or to the same page under a different filter, is
       * left to the router. */
      const onAnchorClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = (event.target as Element | null)?.closest?.("a[href*='#']");
        if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") return;
        const url = new URL(anchor.href, window.location.href);
        if (
          url.origin !== window.location.origin ||
          url.pathname !== window.location.pathname ||
          url.search !== window.location.search
        )
          return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        const headerH = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
        );
        // An absolute position, measured here: given the element, Lenis adds
        // its `scroll-margin-top` to the offset and lands a header too low.
        lenis.scrollTo(
          target.getBoundingClientRect().top +
            window.scrollY -
            (Number.isFinite(headerH) ? headerH : 0) -
            16,
        );
        // Scrolling is not navigating: move focus too, or a keyboard reader
        // is left where they were.
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      };
      document.addEventListener("click", onAnchorClick, true);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      let resizeTimer: ReturnType<typeof setTimeout> | undefined;
      const refreshLayout = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          lenis.resize();
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }, 175);
      };
      window.addEventListener("resize", refreshLayout, { passive: true });
      window.visualViewport?.addEventListener("resize", refreshLayout, { passive: true });

      // A client-side route change swaps the whole page under GSAP without
      // firing `load` or `resize`, so every trigger the incoming route mounts
      // measures a document whose images and fonts have not settled. The
      // effect below calls this once the new route has painted.
      settleRef.current = () => {
        if (cancelled) return;
        lenis.resize();
        ScrollTrigger.refresh();
      };
      settleRef.current();
      void document.fonts?.ready.then(() => settleRef.current?.());

      // Honour the setting being turned on mid-session: stop smooth scroll
      // and let every in-flight reveal jump to its finished state rather
      // than leaving half-animated content stranded on screen.
      const motionQuery = window.matchMedia(REDUCED_QUERY);
      const onMotionChange = () => {
        if (!motionQuery.matches) return;
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.animation?.progress(1);
          trigger.kill();
        });
        document.documentElement.classList.remove("anim-pending");
        dispose();
      };
      motionQuery.addEventListener("change", onMotionChange);

      dispose = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        document.removeEventListener("click", onAnchorClick, true);
        registerScroller(null);
        motionQuery.removeEventListener("change", onMotionChange);
        window.removeEventListener("resize", refreshLayout);
        window.visualViewport?.removeEventListener("resize", refreshLayout);
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.off("scroll", update);
        lenis.destroy();
        lenisRef.current = null;
        settleRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  /* A route change has to land at the top of the new page (or wherever the
   * router restores it to on back/forward) — and Lenis was overriding that.
   *
   * While Lenis is still gliding out a previous wheel gesture it writes its
   * own position to the window on every frame, so the router's reset to 0
   * was overwritten the next frame: clicking a nav link 5,000px down the
   * home page opened /about 4,984px down. It went unnoticed while the header
   * only existed at the top of each page; the fixed header made nav links
   * reachable from anywhere.
   *
   * `stop()` also cancels the glide and syncs Lenis to the real position, so
   * nothing is written while the router places the new page; Lenis resumes a
   * frame after the router has rendered and restored scroll. Search-only
   * changes (the projects filter) are left alone — they keep their place. */
  useEffect(() => {
    const offBefore = router.subscribe("onBeforeNavigate", (event) => {
      if (event.pathChanged) lenisRef.current?.stop();
    });
    const offRendered = router.subscribe("onRendered", (event) => {
      if (!event.pathChanged) return;
      requestAnimationFrame(() => {
        const lenis = lenisRef.current;
        if (!lenis) return;
        lenis.resize();
        lenis.start();
      });
    });
    return () => {
      offBefore();
      offRendered();
    };
  }, [router]);

  useEffect(() => {
    // Two frames: one for the incoming route to commit, one for its own
    // effects to create their triggers before we re-measure them.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => settleRef.current?.()));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
