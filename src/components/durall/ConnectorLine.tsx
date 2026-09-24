import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";

/**
 * Figma "Vector 27": the hairline that runs from the philosophy image down to
 * the projects View More control. Draws itself in on scroll.
 */
export function ConnectorLine() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    // Guard before the import, not after it: the reduced-motion branch used
    // to sit inside the `.then`, so a reader who asked for less motion still
    // paid for the whole GSAP download to be told the line should just be
    // drawn. The SVG renders complete without any of it.
    if (!path || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !pathRef.current) return;
      const length = path.getTotalLength();
      const tween = gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: path.closest("svg"),
            start: "top 90%",
            end: "bottom 60%",
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
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 266 1118"
      fill="none"
      preserveAspectRatio="none"
      className="pointer-events-none absolute top-0 right-[6.8%] hidden h-[min(69.8rem,75vw)] w-[min(16.5rem,18%)] -translate-y-[5%] lg:block"
    >
      <path
        ref={pathRef}
        d="M265 0V701.5L122 858.5V1117H0"
        stroke="var(--color-navy)"
        strokeOpacity="0.35"
      />
    </svg>
  );
}
