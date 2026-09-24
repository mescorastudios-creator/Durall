import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { loadGsap } from "@/lib/anim";
import { prefersReducedMotion, REDUCED_QUERY } from "@/lib/motion-prefs";

/**
 * Site-wide Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger
 * stays in sync. Disabled entirely for prefers-reduced-motion (native scroll).
 *
 * Mounted once from the root route: it used to be rendered by each page,
 * which tore Lenis down and rebuilt it on every navigation and briefly ran
 * two instances at once while the routes swapped.
 */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const settleRef = useRef<(() => void) | null>(null);

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

      const lenis = new Lenis({
        duration: 1.6,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
      });
      const update = () => ScrollTrigger.update();
      lenis.on("scroll", update);

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
        motionQuery.removeEventListener("change", onMotionChange);
        window.removeEventListener("resize", refreshLayout);
        window.visualViewport?.removeEventListener("resize", refreshLayout);
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.off("scroll", update);
        lenis.destroy();
        settleRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  useEffect(() => {
    // Two frames: one for the incoming route to commit, one for its own
    // effects to create their triggers before we re-measure them.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => settleRef.current?.()));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
