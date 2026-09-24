import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { IMAGES } from "@/assets/images";
import { loadGsap, useReveal, useSplitLines } from "@/lib/anim";
import { prefersReducedMotion, useReducedMotion } from "@/lib/motion-prefs";

import { ArrowLeft, ArrowRight, UnderlineLink } from "./ui";

/* Two columns side by side is the width half of the freeze-frame's
 * requirement; the height half is measured at runtime (see `canPin` below),
 * because it depends on text size, zoom and the reader's font settings
 * rather than on any number that can be written into a media query. */
const PIN_WIDTH_QUERY = "(min-width: 64rem)";

const STAGES = [
  {
    num: "01",
    title: "Discover",
    body: "Site visit, brief, and intent — we read the architect's drawings before we read the BoQ.",
    caption: "Understanding the vision and the intent.",
    image: IMAGES.stageDiscover,
    alt: "Glass-walled terrace overlooking a lake at sunset",
  },
  {
    num: "02",
    title: "Design",
    body: "System selection, material strategy, and elevation studies. We draw alternates, not just options.",
    caption: "Drawing alternates, not just options.",
    image: IMAGES.philosophyPavilion,
    alt: "Dining pavilion framed by full-height sliding systems",
  },
  {
    num: "03",
    title: "Engineer",
    body: "Structural, thermal, acoustic, and weather performance — every detail load-tested before the workshop sees it.",
    caption: "Every detail load-tested before fabrication.",
    image: IMAGES.stageEngineer,
    alt: "Interior with slatted ceiling and precise square light cutouts",
  },
  {
    num: "04",
    title: "Fabricate",
    body: "In-house workshop discipline. Custom extrusions, jigged assemblies, and a single QC chain.",
    caption: "Custom extrusions under a single QC chain.",
    image: IMAGES.stageFabricate,
    alt: "Interior with wooden slat ceiling overlooking a pool at dusk",
  },
  {
    num: "05",
    title: "Install",
    body: "Site supervision, sequencing, and handover — backed by a maintenance schedule we publish in writing.",
    caption: "Sequenced installation and written handover.",
    image: IMAGES.stageInstall,
    alt: "White modern balcony with glass railings",
  },
];

export function Process() {
  const [active, setActive] = useState(0);
  /* One step open at a time. The accordion used to open cumulatively, so by
   * the last stage all five bodies were expanded and the column needed
   * ~890px — more than a 1280x800 laptop has — which is why the freeze-frame
   * used to clip its final step. One body at a time keeps the column around
   * 600px, so the pinned composition fits ordinary laptop viewports. */
  const [openStep, setOpenStep] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 30 });
  const listRef = useReveal<HTMLOListElement>({ selector: "[data-step]", y: 26, stagger: 0.09 });
  const stageRef = useReveal<HTMLDivElement>({ y: 48, duration: 1.1 });
  const headingRef = useSplitLines<HTMLHeadingElement>();

  /* ---- Travelling timeline marker -------------------------------------- */
  const railRef = useRef<HTMLDivElement>(null);
  const dotOffsets = useRef<number[]>([]);
  const fractionRef = useRef(0);
  const scrollDriven = useRef(false);

  const rawY = useMotionValue(0);
  const springY = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.6 });
  const markerY = reduced ? rawY : springY;
  const fillHeight = useTransform(markerY, (v) => v + 5);

  /** Position the marker at a fractional step index (0 → 4). */
  const applyFraction = useCallback(
    (fraction: number) => {
      const offsets = dotOffsets.current;
      if (!offsets.length) return;
      fractionRef.current = fraction;
      const clamped = Math.max(0, Math.min(offsets.length - 1, fraction));
      const lower = Math.floor(clamped);
      const upper = Math.min(offsets.length - 1, lower + 1);
      const t = clamped - lower;
      const a = offsets[lower] ?? 0;
      const b = offsets[upper] ?? a;
      rawY.set(a + (b - a) * t);
    },
    [rawY],
  );

  // Measure dot positions; re-measure when accordions open or the layout shifts.
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const offsetWithin = (el: HTMLElement) => {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node && node !== rail) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return top;
    };
    const measure = () => {
      const steps = Array.from(rail.querySelectorAll<HTMLElement>("[data-dot]"));
      const marker = rail.querySelector<HTMLElement>("[data-marker]");
      // Layout offsets, not rects: reveal tweens translate the steps, and a
      // rect-based read would bake that transient shift into the travel path.
      const markerBase = marker ? offsetWithin(marker) : 0;
      dotOffsets.current = steps.map((el) => offsetWithin(el) - markerBase);
      applyFraction(fractionRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    rail.querySelectorAll("[data-step]").forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);
    let detach = () => {};
    // Only worth loading GSAP here to hear about its refreshes when GSAP is
    // going to be running at all; under reduced motion the ResizeObserver and
    // the resize listener above already cover every case.
    if (!prefersReducedMotion()) {
      void loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.addEventListener("refresh", measure);
        detach = () => ScrollTrigger.removeEventListener("refresh", measure);
      });
    }
    void document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      detach();
    };
  }, [applyFraction]);

  // Manual clicks / short-viewport activation: glide to the active step.
  useEffect(() => {
    if (scrollDriven.current) return;
    applyFraction(active);
  }, [active, applyFraction]);

  /* ---- Can the freeze-frame actually hold its content? ------------------
   * The pin used to be gated on width alone, so a 1024x640 window — a
   * 1280x800 laptop at 125% zoom — still froze the section, and the last
   * step plus the section's only call to action fell outside the frame with
   * no way to reach them: the column's `overflow-y-auto` is unreachable
   * while Lenis owns the wheel.
   *
   * A height media query can't answer this, because the answer moves with
   * text size, browser zoom and the reader's own font settings. So measure
   * the worst case instead: the column as it stands, with whichever body is
   * currently open swapped for the tallest of the five. Pin only when that
   * fits; anything shorter falls through to the plain scrolling layout,
   * which loses the freeze but never hides content.
   */
  const [canPin, setCanPin] = useState(false);

  useEffect(() => {
    const evaluate = () => {
      const content = contentRef.current;
      if (!content) return;
      if (!window.matchMedia(PIN_WIDTH_QUERY).matches) {
        setCanPin(false);
        return;
      }

      // Exactly one body is ever open, so the worst case is the current
      // layout with the tallest body in place of whatever is open now.
      let openHeight = 0;
      let tallest = 0;
      content.querySelectorAll<HTMLElement>("[data-body]").forEach((body) => {
        const inner = body.firstElementChild as HTMLElement | null;
        if (inner) tallest = Math.max(tallest, inner.offsetHeight);
        openHeight = Math.max(openHeight, body.getBoundingClientRect().height);
      });
      const required = content.scrollHeight - openHeight + tallest;

      // The column only carries its vertical padding while pinned, so it
      // cannot be read off the element when measuring from the unpinned
      // state. Mirror the `lg:py-[clamp(1.25rem,3vh,3.5rem)]` class instead.
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      const padding = 2 * Math.min(Math.max(20, viewport * 0.03), 56);
      setCanPin(required + padding <= viewport);
    };

    evaluate();
    const onResize = () => window.requestAnimationFrame(evaluate);
    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize, { passive: true });
    void document.fonts?.ready.then(evaluate);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  /* Freeze-frame: the section pins and the five steps expand one by one,
   * cumulatively, on a slow scrubbed scroll. */
  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !sectionRef.current) return;
      const select = (index: number) => {
        setActive(index);
        setOpenStep(index);
      };

      const mm = gsap.matchMedia();

      // Width is the half a media query can answer; `canPin` carries the
      // measured height half (see the effect above).
      mm.add(PIN_WIDTH_QUERY, () => {
        if (!canPin) return;
        scrollDriven.current = true;
        // The pinned element is exactly one viewport tall, so the pin swap
        // introduces no layout offset — the freeze is invisible.
        const sizeFrame = () => {
          const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
          gsap.set(frame, {
            width: "100%",
            maxWidth: "none",
            height: viewportHeight,
            maxHeight: viewportHeight,
            overflow: "hidden",
          });
        };
        sizeFrame();
        ScrollTrigger.addEventListener("refreshInit", sizeFrame);

        // Short lead-in hold so entering the freeze reads as a settle.
        const LEAD = 0.08;
        const st = ScrollTrigger.create({
          trigger: frame,
          start: "top top",
          end: () =>
            "+=" + (window.visualViewport?.height ?? window.innerHeight) * (STAGES.length - 1),
          invalidateOnRefresh: true,
          pin: frame,
          pinSpacing: true,
          pinReparent: false,
          anticipatePin: 0,
          // Lenis already smooths the wheel over ~1.6s, so a long scrub
          // stacked a second lag on top of it and the snap a third. Tracking
          // the (already eased) Lenis position closely, and snapping only in
          // the direction of travel, removes the tug-of-war — a fast flick
          // used to be able to settle *backwards* onto the previous step.
          scrub: 0.6,
          snap: {
            snapTo: Array.from({ length: STAGES.length }, (_, i) => i / (STAGES.length - 1)),
            duration: { min: 0.25, max: 0.6 },
            delay: 0.12,
            ease: "power2.inOut",
            inertia: false,
            directional: true,
          },
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, (self.progress - LEAD) / (1 - LEAD)));
            const raw = p * (STAGES.length - 1);
            // Marker glides continuously with scroll progress.
            applyFraction(raw);
            // A step opens as the marker arrives on it.
            select(Math.min(STAGES.length - 1, Math.round(raw)));
          },
        });
        return () => {
          scrollDriven.current = false;
          ScrollTrigger.removeEventListener("refreshInit", sizeFrame);
          st.kill();
          gsap.set(frame, { clearProps: "width,maxWidth,height,maxHeight,overflow" });
        };
      });

      // Everything the freeze-frame cannot hold — too narrow for two
      // columns, or not tall enough for the open accordion — reveals each
      // step as it scrolls past instead.
      mm.add(canPin ? "(max-width: 63.999rem)" : "all", () => {
        const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));
        const triggers = steps.map((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 70%",
            onEnter: () => select(i),
            onEnterBack: () => select(i),
          }),
        );
        return () => triggers.forEach((t) => t.kill());
      });

      dispose = () => mm.revert();
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [applyFraction, canPin]);

  const stage = STAGES[active]!;
  const go = (delta: number) => setActive((prev) => (prev + delta + STAGES.length) % STAGES.length);

  return (
    // Every height lock below hangs off `canPin`, not off the `lg` breakpoint.
    // Tying them to width alone meant a wide-but-short window still clamped
    // the frame to one viewport and clipped the column, whether or not the
    // section was pinned. When the freeze-frame cannot run, the section keeps
    // its two columns but takes the height its content needs.
    <section
      ref={sectionRef}
      id="process"
      className={`flex items-center overflow-hidden bg-paper ${
        canPin ? "min-h-svh py-0" : "py-[clamp(2rem,5vw,5rem)]"
      }`}
    >
      <div
        ref={frameRef}
        data-frame
        className={`grid w-full grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.25rem,3.75vw,4.5rem)] lg:grid-cols-2 lg:items-center ${
          canPin ? "lg:h-svh lg:gap-0 lg:px-0" : ""
        }`}
      >
        <div
          ref={colRef}
          className={`min-h-0 min-w-0 ${
            canPin
              ? "lg:flex lg:h-full lg:flex-col lg:justify-center lg:overflow-y-auto lg:overscroll-contain lg:py-[clamp(1.25rem,3vh,3.5rem)] lg:pr-[clamp(2rem,4vw,5rem)] lg:pl-[clamp(3rem,6vw,7.5rem)]"
              : ""
          }`}
        >
          <div ref={contentRef}>
            <div ref={copyRef}>
              <p
                data-reveal
                className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase"
              >
                04 <span className="px-2 text-slate">—</span> How we work
              </p>
              <h2
                ref={headingRef}
                className="mt-[clamp(0.75rem,2.2vh,2.375rem)] font-display text-[clamp(1.75rem,min(3.6vw,6.2vh),4rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy"
              >
                Concept to commissioning, <span className="text-slate">under one roof.</span>
              </h2>
              <p
                data-reveal
                className="mt-[clamp(0.75rem,1.8vh,1.875rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate"
              >
                An integrated process that brings precision, accountability, and performance to
                every project.
              </p>
            </div>

            <div ref={railRef} className="relative mt-[clamp(1rem,3vh,3.25rem)]">
              {/* travelling marker + progress trail */}
              <motion.span
                aria-hidden="true"
                style={{ height: fillHeight }}
                className="pointer-events-none absolute top-2 left-[0.3125rem] w-px bg-navy/70"
              />
              <motion.span
                aria-hidden="true"
                style={{ y: markerY }}
                data-marker
                className="pointer-events-none absolute top-2 left-0 z-10 h-2.5 w-2.5 rounded-full bg-navy"
              />
              <ol ref={listRef}>
                {STAGES.map((item, index) => {
                  const isOpen = openStep === index;
                  return (
                    <li
                      key={item.num}
                      data-step
                      className="relative border-b border-navy/10 pb-[clamp(0.625rem,1.5vh,1.5rem)] pl-[clamp(2rem,4vw,4.25rem)] last:border-b-0"
                    >
                      {/* Timeline rail. `last:hidden` was on this span, which is
                      never its parent's last child, so the rail always drew
                      past the final dot — visible at every width. */}
                      {index < STAGES.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="absolute top-3 left-[0.3125rem] h-full w-px bg-navy/20"
                        />
                      ) : null}
                      <span
                        data-dot
                        aria-hidden="true"
                        className="absolute top-2 left-0 h-2.5 w-2.5 rounded-full border border-navy/35 bg-paper"
                      />
                      <div className="flex items-start gap-[clamp(1rem,2.4vw,2.875rem)]">
                        <span className="shrink-0 font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-none text-navy/55 italic">
                          {item.num}
                        </span>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActive(index);
                              setOpenStep((prev) => (prev === index ? null : index));
                            }}
                            aria-expanded={isOpen}
                            // The tap target is grown with a pseudo-element
                            // rather than padding: 44px to touch, while the row
                            // keeps its 20px layout box, so five of these do not
                            // add 120px to a column that has to fit one viewport.
                            className="relative flex w-full items-center justify-between gap-6 text-left after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']"
                          >
                            <span className="font-display text-sm font-bold tracking-button text-navy uppercase">
                              {item.title}
                            </span>
                            <motion.span
                              aria-hidden="true"
                              className="font-body text-lg leading-none text-slate"
                              animate={reduced ? {} : { rotate: isOpen ? 45 : 0 }}
                            >
                              +
                            </motion.span>
                          </button>
                          <motion.div
                            initial={false}
                            animate={
                              reduced
                                ? { opacity: isOpen ? 1 : 0 }
                                : { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }
                            }
                            transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                            aria-hidden={!isOpen}
                            data-body
                            className="overflow-hidden font-body text-sm leading-[1.75] text-slate"
                          >
                            <p className="pt-[0.625rem] pb-[0.25rem]">{item.body}</p>
                          </motion.div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-[clamp(0.875rem,2.5vh,3.25rem)]">
              <UnderlineLink href="#contact">Explore our approach</UnderlineLink>
            </div>
          </div>
        </div>

        {/* Stage viewer — full-height right half on desktop */}
        <div
          ref={stageRef}
          className={`relative w-full min-w-0 overflow-hidden ${
            canPin
              ? "aspect-[1038/1143] max-h-[min(55svh,26rem)] lg:aspect-auto lg:h-full lg:max-h-none lg:w-full"
              : "aspect-[1038/1143] max-h-[min(55svh,26rem)] lg:max-h-none"
          }`}
        >
          {STAGES.map((s, i) => (
            <motion.img
              key={s.image.src}
              {...s.image}
              alt={i === active ? s.alt : ""}
              sizes="(min-width: 64rem) 50vw, 100vw"
              aria-hidden={i === active ? undefined : true}
              loading="lazy"
              initial={false}
              animate={{
                opacity: i === active ? 1 : 0,
                // Every stage settles at exactly the same size; only the
                // hidden images sit slightly zoomed for the cross-fade.
                scale: reduced || i === active ? 1 : 1.06,
              }}
              transition={{
                opacity: { duration: reduced ? 0.2 : 1.6, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: reduced ? 0 : 2.6, ease: [0.16, 1, 0.3, 1] },
              }}
              style={{ transformOrigin: "center", willChange: "opacity, transform" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ))}

          {/* Current-stage callout */}
          <div className="absolute top-[8%] right-[6%] w-[min(15rem,42%)] bg-white/85 p-[clamp(0.75rem,1.2vw,1.25rem)] text-navy backdrop-blur-sm lg:top-auto lg:right-auto lg:bottom-[16%] lg:left-[6%] lg:w-[min(17rem,44%)]">
            <p className="font-display text-[clamp(0.625rem,0.7vw,0.6875rem)] font-bold tracking-eyebrow uppercase">
              Current stage
            </p>
            <span aria-hidden="true" className="mt-3 block h-px w-6 bg-navy/60" />
            <motion.div
              initial={false}
              animate={{ opacity: [0.3, 1], y: reduced ? 0 : [8, 0] }}
              transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              data-stage={stage.num}
            >
              <p className="mt-4 font-display text-[clamp(0.8125rem,1vw,1rem)] font-bold tracking-[0.0625rem] text-navy uppercase">
                {stage.num} {stage.title}
              </p>
              <p className="mt-2 font-body text-[clamp(0.75rem,0.9vw,0.875rem)] leading-[1.5] text-navy/70">
                {stage.caption}
              </p>
            </motion.div>
          </div>

          {/* Progress + controls */}
          <div className="absolute inset-x-[6%] bottom-[5%] flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-[clamp(0.5rem,1vw,1rem)] font-body text-[clamp(0.75rem,0.9vw,0.875rem)] tabular-nums text-white">
              <span>{stage.num}</span>
              <span className="relative block h-px w-[clamp(3rem,18vw,15rem)] bg-white/40">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-white"
                  animate={{ width: `${((active + 1) / STAGES.length) * 100}%` }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
                />
              </span>
              <span>0{STAGES.length}</span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <motion.button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous stage"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy"
                whileHover={reduced ? { opacity: 0.85 } : { scale: 1.08 }}
                whileTap={reduced ? {} : { scale: 0.95 }}
              >
                <ArrowLeft />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => go(1)}
                aria-label="Next stage"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white"
                whileHover={reduced ? { opacity: 0.85 } : { scale: 1.08 }}
                whileTap={reduced ? {} : { scale: 0.95 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
