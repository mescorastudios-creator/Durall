import { useEffect, useLayoutEffect, useRef } from "react";
import { REVEAL_WINDOW, loadGsap } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";

/** Neutral dark grey, as drawn in the design. */
const INK = "#3e3e3e";

/* The line's shape, from Figma "Vector 27", as proportions of the margin it
 * runs in: the space between the right edge of the project grid and the
 * right edge of the philosophy photograph. */
/** The upper run, measured from the grid's edge. */
const UPPER = 0.78;
/** The lower run, measured from the grid's edge. */
const LOWER = 0.36;
/** The diagonal falls 1.09px for every 1px it steps left. */
const SLOPE = 1.09;
/** The lower run's share of the whole drop. */
const TAIL = 0.23;
/** How far up under the photograph the line starts, so it comes out from
 * beneath it with no seam. The photograph is stacked above the line. */
const TUCK = 16;

/** Centres a 1px stroke on a pixel, so the straight runs render crisp. */
const crisp = (value: number) => Math.round(value) + 0.5;

/** An element's box in document coordinates, ignoring transforms. */
function layoutBox(el: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, width: el.offsetWidth, height: el.offsetHeight };
}

/**
 * Figma "Vector 27": the hairline that comes out from under the philosophy
 * photograph, runs down the margin beside the project grid, steps in, and
 * turns into the View More button.
 *
 * Both ends are measured from the page rather than drawn into a fixed box:
 * a fixed box could only ever land on the photograph and the button at the
 * one width it was drawn for, and ended well short of the button at every
 * other. `data-connector-start` marks the photograph and
 * `data-connector-end` the button's wrapper; the path is redrawn whenever
 * either section changes size. Positions come from offsets, not rects, so
 * the entrance transforms on the photograph and the hover lift on the
 * button never move the line.
 *
 * Draws itself in on scroll; under reduced motion it is simply there.
 */
export function ConnectorLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  /** Set once the draw-in exists, so a redraw can re-measure its trigger. */
  const remeasure = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const section = svg?.parentElement;
    const scope = section?.closest("main") ?? document;
    const start = scope.querySelector<HTMLElement>("[data-connector-start]");
    const end = section?.querySelector<HTMLElement>("[data-connector-end]")
      ?.firstElementChild as HTMLElement | null | undefined;
    if (!svg || !path || !section || !start || !end) return;

    const draw = () => {
      // Hidden below the desktop breakpoint, where there is no margin to run in.
      if (!svg.getClientRects().length) return;

      const origin = layoutBox(section);
      const photo = layoutBox(start);
      const button = layoutBox(end);

      const endX = button.x + button.width - origin.x;
      const endY = crisp(button.y + button.height / 2 - origin.y);
      const topY = photo.y + photo.height - origin.y - TUCK;
      const margin = photo.x + photo.width - origin.x - endX;

      const upperX = crisp(endX + margin * UPPER);
      const lowerX = crisp(endX + margin * LOWER);
      const bendEnd = endY - (endY - topY) * TAIL;
      const bendStart = Math.max(topY, bendEnd - (upperX - lowerX) * SLOPE);

      // The box is the path's own bounds, so one unit is one CSS pixel and
      // the scroll trigger below spans exactly the line.
      const left = Math.floor(endX) - 1;
      const top = Math.floor(topY);
      // The section can sit at a fraction of a pixel. The browser paints an
      // SVG at a whole pixel, so a box left at a fraction is nudged when
      // drawn, and every straight run splits across two rows of pixels.
      // Placing the box on a whole pixel keeps each run a sharp 1px line.
      const rect = section.getBoundingClientRect();
      const fx = (rect.left + window.scrollX) % 1;
      const fy = (rect.top + window.scrollY) % 1;
      svg.style.left = `${left - fx}px`;
      svg.style.top = `${top - fy}px`;
      svg.style.width = `${Math.ceil(upperX - left) + 1}px`;
      svg.style.height = `${Math.ceil(endY - top) + 1}px`;
      path.setAttribute(
        "d",
        `M${upperX - left} ${topY - top}V${bendStart - top}L${lowerX - left} ${bendEnd - top}` +
          // Ends half a pixel inside the button, so no hairline gap shows.
          `V${endY - top}H${endX - 0.5 - left}`,
      );
      remeasure.current?.();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(section);
    const upstream = start.closest("section");
    if (upstream) observer.observe(upstream);
    return () => observer.disconnect();
  }, []);

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
      // `pathLength` is 1, so the dash runs 1 → 0 whatever the line's real
      // length, and a redraw at a new size needs no new tween. GSAP rounds
      // pixel values by default, which on a 0–1 range would leave the line
      // either absent or complete; `autoRound: false` keeps the fractions.
      const tween = gsap.fromTo(
        path,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          autoRound: false,
          ease: "none",
          scrollTrigger: {
            trigger: svgRef.current,
            start: REVEAL_WINDOW.start,
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
      remeasure.current = () => tween.scrollTrigger?.refresh();
      dispose = () => {
        remeasure.current = null;
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
      ref={svgRef}
      aria-hidden="true"
      fill="none"
      overflow="visible"
      className="pointer-events-none absolute top-0 left-0 hidden lg:block"
    >
      <path ref={pathRef} pathLength={1} stroke={INK} strokeWidth="1" />
    </svg>
  );
}
