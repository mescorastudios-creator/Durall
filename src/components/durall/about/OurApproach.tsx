import { useEffect, useRef } from "react";
import { BarChart3, Network, Share2, Users } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { EASE, loadGsap, useSectionIntro } from "@/lib/anim";

const CAPABILITIES = [
  { icon: Network, title: "Architectural Intent", body: "Design vision and performance goals" },
  { icon: Share2, title: "System Partners", body: "Carefully selected international partners" },
  { icon: BarChart3, title: "Materials & Finishes", body: "Quality, durability and aesthetic fit" },
  {
    icon: Users,
    title: "Specialist Expertise",
    body: "Engineering, detailing and project coordination",
  },
];

const SCENE_QUERY = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

/** The whole sequence, start to finish, in seconds. */
const SEQUENCE = 3.4;

/**
 * Our Approach — one sequence, played once as the section comes into view.
 *
 * The four capabilities arrive one at a time; each draws a line, and the four lines
 * converge and run into the Durall mark; the mark assembles as the line
 * reaches it; a single line carries on to the drawing; the drawing is
 * uncovered from left to right, the way it would come off a plotter.
 *
 * The connectors are measured from the live layout, not drawn to fixed
 * coordinates. The previous SVG was a fixed 120x240 drawing positioned 6.5rem
 * left of the mark, and at 1440px it ran straight through the capability
 * text. Every path here is rebuilt from the columns' real boxes on resize, so
 * it lands where the elements actually are at any width.
 *
 * It used to be driven by scroll: the section was 360svh tall and pinned
 * the screen while the reader scrolled through it, which left three and a
 * half screens of scrolling for one row of content. Now the section is its
 * own height and the timeline plays by itself when most of it is on screen.
 * Under reduced motion, on smaller screens, and before any script has run,
 * the section is simply the finished composition.
 */
export function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  // Plays through once on arrival rather than following the scroll, like
  // the sequence beside it.
  const copyRef = useSectionIntro<HTMLDivElement>({ scrub: false });

  /* ---- Connector geometry ----------------------------------------------- */
  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!stage || !svg) return;

    const measure = () => {
      // Measure the finished composition: at progress 1 every transform in
      // the scene is identity, so rects are pure layout. Setting and
      // restoring progress is synchronous; nothing paints in between.
      const tl = timeline.current;
      const was = tl?.progress();
      tl?.progress(1);

      const origin = stage.getBoundingClientRect();
      const box = (el: Element | null) => {
        const r = el?.getBoundingClientRect();
        return r
          ? {
              left: r.left - origin.left,
              right: r.right - origin.left,
              top: r.top - origin.top,
              midY: r.top - origin.top + r.height / 2,
            }
          : null;
      };

      const list = box(stage.querySelector("[data-caps]"));
      const ring = box(stage.querySelector("[data-ring]"));
      const drawing = box(stage.querySelector("[data-drawing]"));
      const rows = Array.from(stage.querySelectorAll("[data-cap-anchor]")).map(box);

      if (list && ring && drawing && rows.every(Boolean)) {
        svg.setAttribute("viewBox", `0 0 ${origin.width} ${origin.height}`);
        const startX = list.right + 12;
        const endX = ring.left;
        const mergeX = startX + (endX - startX) * 0.62;
        const y = ring.midY;

        rows.forEach((row, i) => {
          const path = svg.querySelector<SVGPathElement>(`[data-branch="${i}"]`);
          const dot = svg.querySelector<SVGCircleElement>(`[data-branch-dot="${i}"]`);
          if (!row || !path) return;
          const bend = startX + (mergeX - startX) * 0.55;
          path.setAttribute(
            "d",
            `M ${startX} ${row.midY} C ${bend} ${row.midY}, ${bend} ${y}, ${mergeX} ${y}`,
          );
          dot?.setAttribute("cx", String(startX));
          dot?.setAttribute("cy", String(row.midY));
        });

        svg.querySelector("[data-trunk]")?.setAttribute("d", `M ${mergeX} ${y} L ${endX} ${y}`);
        const outFrom = ring.right;
        const outTo = drawing.left;
        const mid = outFrom + (outTo - outFrom) / 2;
        svg
          .querySelector("[data-outline]")
          ?.setAttribute(
            "d",
            `M ${outFrom} ${y} C ${mid} ${y}, ${mid} ${drawing.midY}, ${outTo} ${drawing.midY}`,
          );
        const setDot = (sel: string, x: number, cy: number) => {
          const d = svg.querySelector(sel);
          d?.setAttribute("cx", String(x));
          d?.setAttribute("cy", String(cy));
        };
        setDot("[data-dot-ring-in]", endX, y);
        setDot("[data-dot-ring-out]", outFrom, y);
        setDot("[data-dot-drawing]", outTo, drawing.midY);
      }

      if (tl && was !== undefined) tl.progress(was);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  /* ---- Choreography ----------------------------------------------------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add(SCENE_QUERY, () => {
        const q = (sel: string) => Array.from(stage.querySelectorAll<Element>(sel));
        const caps = q("[data-cap]");
        const branches = q("[data-branch]");
        const branchDots = q("[data-branch-dot]");

        // Laid out in units of the whole sequence (0 → 1), then played at
        // SEQUENCE seconds.
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.micro } });

        // 1 — the capabilities, one at a time.
        caps.forEach((cap, i) => {
          const at = 0.02 + i * 0.075;
          tl.from(cap, { opacity: 0, x: -24, duration: 0.1 }, at).from(
            cap.querySelector("[data-cap-icon]"),
            { scale: 0.55, opacity: 0, duration: 0.09, ease: "back.out(1.6)" },
            at,
          );
          // 2 — and each one's line sets off as it lands.
          tl.from(branchDots[i] ?? [], { opacity: 0, scale: 0, duration: 0.03 }, at + 0.06).from(
            branches[i] ?? [],
            { strokeDashoffset: 1, duration: 0.16, ease: "power1.inOut" },
            at + 0.07,
          );
        });

        // The four converge, and one line runs on into the mark.
        tl.from("[data-trunk]", { strokeDashoffset: 1, duration: 0.06, ease: "none" }, 0.46);

        // 3 — the mark assembles as the line reaches it.
        tl.from("[data-dot-ring-in]", { opacity: 0, scale: 0, duration: 0.02 }, 0.515)
          .from("[data-ring]", { opacity: 0, scale: 0.82, duration: 0.1 }, 0.515)
          .from("[data-ring-inner]", { opacity: 0, scale: 0.7, duration: 0.1 }, 0.55)
          .from("[data-mark]", { opacity: 0, y: 10, duration: 0.08 }, 0.6)
          .fromTo(
            "[data-ring-pulse]",
            { opacity: 0.55, scale: 1 },
            { opacity: 0, scale: 1.22, duration: 0.12, ease: "power2.out" },
            0.6,
          );

        // 4 — a single line carries on to the drawing.
        tl.from("[data-dot-ring-out]", { opacity: 0, scale: 0, duration: 0.02 }, 0.69).from(
          "[data-outline]",
          { strokeDashoffset: 1, duration: 0.11, ease: "power1.inOut" },
          0.7,
        );

        // 5 — the drawing comes off the plotter, left to right. The mask
        // slides in from the left while the drawing inside slides the other
        // way by the same amount, so the drawing itself stays put: a wipe
        // made of two transforms, with no clip-path to repaint.
        tl.from("[data-dot-drawing]", { opacity: 0, scale: 0, duration: 0.02 }, 0.8)
          .from("[data-wipe]", { xPercent: -101, duration: 0.12, ease: "power2.inOut" }, 0.81)
          .from("[data-wipe-inner]", { xPercent: 101, duration: 0.12, ease: "power2.inOut" }, 0.81)
          .from("[data-outcome-text]", { opacity: 0, y: 14, duration: 0.07, stagger: 0.02 }, 0.9);

        timeline.current = tl;
        tl.timeScale(1 / SEQUENCE);

        // Plays once, when most of the stage is on screen — including
        // straight away, if the page opens with it in view.
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            observer.disconnect();
            tl.play();
          },
          { threshold: 0.45 },
        );
        observer.observe(stage);

        return () => {
          observer.disconnect();
          timeline.current = null;
          tl.progress(1).kill();
        };
      });
      dispose = () => mm.revert();
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      aria-labelledby="approach-heading"
      className="relative bg-white pb-[clamp(3rem,6vw,5.5rem)]"
    >
      <div>
        <div
          ref={stageRef}
          className="shell-about relative grid grid-cols-1 items-center gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(0,1.2fr)] lg:gap-[clamp(1.5rem,4vw,4.5rem)]"
        >
          {/* Connectors — absolutely over the stage, geometry set in JS. */}
          <svg
            ref={svgRef}
            aria-hidden="true"
            fill="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
          >
            {CAPABILITIES.map((_, i) => (
              <g key={i}>
                <path
                  data-branch={i}
                  pathLength={1}
                  strokeDasharray="1"
                  stroke="var(--color-navy)"
                  strokeOpacity="0.28"
                  strokeWidth="1"
                />
                <circle data-branch-dot={i} r="2.5" fill="var(--color-navy)" fillOpacity="0.45" />
              </g>
            ))}
            <path
              data-trunk
              pathLength={1}
              strokeDasharray="1"
              stroke="var(--color-navy)"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
            <path
              data-outline
              pathLength={1}
              strokeDasharray="1"
              stroke="var(--color-accent-blue)"
              strokeOpacity="0.7"
              strokeWidth="1"
            />
            <circle data-dot-ring-in r="3" fill="var(--color-navy)" />
            <circle data-dot-ring-out r="3" fill="var(--color-accent-blue)" />
            <circle data-dot-drawing r="3" fill="var(--color-accent-blue)" />
          </svg>

          {/* Copy — reveals as the section arrives, so the frame is never
              empty while it scrolls into place. */}
          <div ref={copyRef} className="relative min-w-0 lg:self-start">
            <p
              data-anim
              className="font-display text-[clamp(0.875rem,1vw,1.0625rem)] font-bold tracking-eyebrow text-accent-blue uppercase"
            >
              Our Approach
            </p>
            <h2
              id="approach-heading"
              data-anim="lines"
              className="mt-3 font-display text-[clamp(1.375rem,1.6vw,1.75rem)] leading-tight font-medium tracking-tight text-balance text-navy"
            >
              Intelligence that brings it all together.
            </h2>
            <span data-anim aria-hidden="true" className="mt-6 flex items-center">
              <span className="block h-px w-20 bg-accent-blue" />
              <span className="block h-1 w-1 bg-accent-blue" />
            </span>
            <p
              data-anim
              className="mt-6 max-w-[19rem] font-body text-[clamp(0.75rem,0.85vw,0.875rem)] leading-relaxed text-slate"
            >
              We don&rsquo;t manufacture every component. We ensure the right systems, materials and
              expertise come together in perfect balance.
            </p>
          </div>

          <ul data-caps className="relative min-w-0 space-y-[clamp(1rem,1.7vw,1.5rem)]">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <li key={title} data-cap className="flex min-w-0 items-start gap-3">
                <span
                  data-cap-anchor
                  data-cap-icon
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-navy-14 bg-paper"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-navy" strokeWidth={1.4} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[0.6875rem] font-bold tracking-eyebrow text-navy uppercase">
                    {title}
                  </span>
                  <span className="mt-1 block font-body text-[0.8125rem] leading-snug text-slate">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="relative flex min-w-0 items-center justify-center">
            <div
              data-ring
              className="relative flex aspect-square w-[min(100%,14rem)] items-center justify-center rounded-[30%] border border-navy/45"
            >
              <span
                data-ring-pulse
                aria-hidden="true"
                className="absolute inset-0 rounded-[30%] border border-accent-blue opacity-0"
              />
              <div
                data-ring-inner
                className="flex aspect-square w-[78%] items-center justify-center rounded-[30%] border border-navy/45"
              >
                <img
                  data-mark
                  {...IMAGES.aboutDurallMark}
                  alt="Durall Systems"
                  loading="lazy"
                  decoding="async"
                  className="w-[70%] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div data-drawing className="overflow-hidden">
              <div data-wipe className="overflow-hidden">
                <div data-wipe-inner>
                  <img
                    {...IMAGES.aboutLineHouse}
                    alt="Line drawing of a completed Durall-glazed pavilion"
                    loading="lazy"
                    decoding="async"
                    className="block w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <p
              data-outcome-text
              className="mt-6 font-display text-[clamp(0.75rem,0.85vw,0.8125rem)] font-bold tracking-eyebrow text-navy uppercase"
            >
              Architecture Realized
            </p>
            <p
              data-outcome-text
              className="mt-2 max-w-[14rem] font-body text-[clamp(0.75rem,0.9vw,0.875rem)] leading-relaxed text-slate"
            >
              Seamless integration that performs beautifully and stands the test of time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
