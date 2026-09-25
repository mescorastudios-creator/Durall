import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { IMAGES } from "@/assets/images";
import { useSectionIntro } from "@/lib/anim";
import { useReducedMotion } from "@/lib/motion-prefs";
import { ramp, sceneScrollY, smooth, useSceneProgress } from "@/lib/scene";
import { scrollToY } from "@/lib/scroll-lock";

import { ArrowLeft, ArrowRight, UnderlineLink } from "./ui";

const STAGES = [
  {
    num: "01",
    title: "Discover",
    body: "Site visit, brief, and intent — we read the architect's drawings before we read the BoQ.",
    image: IMAGES.stageDiscover,
    alt: "Glass-walled terrace overlooking a lake at sunset",
  },
  {
    num: "02",
    title: "Design",
    body: "System selection, material strategy, and elevation studies. We draw alternates, not just options.",
    image: IMAGES.philosophyPavilion,
    alt: "Dining pavilion framed by full-height sliding systems",
  },
  {
    num: "03",
    title: "Engineer",
    body: "Structural, thermal, acoustic, and weather performance — every detail load-tested before the workshop sees it.",
    image: IMAGES.stageEngineer,
    alt: "Interior with slatted ceiling and precise square light cutouts",
  },
  {
    num: "04",
    title: "Fabricate",
    body: "In-house workshop discipline. Custom extrusions, jigged assemblies, and a single QC chain.",
    image: IMAGES.stageFabricate,
    alt: "Interior with wooden slat ceiling overlooking a pool at dusk",
  },
  {
    num: "05",
    title: "Install",
    body: "Site supervision, sequencing, and handover — backed by a maintenance schedule we publish in writing.",
    image: IMAGES.stageInstall,
    alt: "White modern balcony with glass railings",
  },
];

const LAST = STAGES.length - 1;

/* Scene pacing, as fractions of the section's scroll.
 *
 * A short hold on arrival, so the frame settles before anything moves, and a
 * longer one at the end, so the last stage is read rather than scrolled
 * straight past. Between them each stage gets an equal share. */
const LEAD_IN = 0.05;
const LEAD_OUT = 0.1;

/** Scroll progress (0–1) → continuous stage position (0–4). */
const stageAt = (progress: number) => ramp(progress, LEAD_IN, 1 - LEAD_OUT) * LAST;
/** Stage position → the scroll progress at which it sits exactly. */
const progressAt = (stage: number) => LEAD_IN + (stage / LAST) * (1 - LEAD_IN - LEAD_OUT);

/**
 * 04 — How we work.
 *
 * A sticky scene: the section is several viewports tall, its frame sticks for
 * the duration, and scroll position drives the stage continuously — the
 * marker glides down the rail, each photograph eases in over the last while
 * it settles from a slight overscan, and the description hands over to the
 * next with a short gap so two paragraphs never share the slot at once.
 *
 * This replaces a GSAP pin that switched stages at thresholds, animated the
 * accordion's `height` inside the frozen frame on every change, snapped the
 * scroll position after release, and had to measure at runtime whether the
 * column fit — falling back to an unpinned layout when it did not. The rail
 * and the description slot are a fixed height now, so the column fits one
 * viewport at every size, and sticky holds wherever the browser can scroll.
 *
 * Under reduced motion the scene still freezes and still follows the scroll,
 * but every change is an instant switch: nothing moves.
 */
export function Process() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const headRef = useSectionIntro<HTMLDivElement>();

  /* ---- Travelling rail marker ------------------------------------------ */
  const railRef = useRef<HTMLOListElement>(null);
  const dotOffsets = useRef<number[]>([]);
  const fractionRef = useRef(0);
  const rawY = useMotionValue(0);
  const springY = useSpring(rawY, { stiffness: 170, damping: 28, mass: 0.5 });
  const markerY = reduced ? rawY : springY;
  const fillHeight = useTransform(markerY, (v) => Math.max(0, v));

  const applyFraction = useCallback(
    (fraction: number) => {
      const offsets = dotOffsets.current;
      if (!offsets.length) return;
      fractionRef.current = fraction;
      const clamped = Math.max(0, Math.min(offsets.length - 1, fraction));
      const lower = Math.floor(clamped);
      const upper = Math.min(offsets.length - 1, lower + 1);
      const a = offsets[lower] ?? 0;
      const b = offsets[upper] ?? a;
      rawY.set(a + (b - a) * (clamped - lower));
    },
    [rawY],
  );

  // The rail's rows are fixed-height, but they scale with the viewport, so
  // the dot positions are measured rather than assumed.
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => {
      // Row centres relative to the first row's, from rects: the rows are a
      // fraction of the viewport tall, and offsetTop rounds each one to a
      // whole pixel, which left the marker up to 2px off its dot. Nothing
      // on the rail itself is transformed, so rects are safe to read here.
      const rows = Array.from(rail.querySelectorAll<HTMLElement>("li"));
      const centre = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      };
      const first = rows[0] ? centre(rows[0]) : 0;
      dotOffsets.current = rows.map((row) => centre(row) - first);
      applyFraction(fractionRef.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [applyFraction]);

  /* ---- The scene -------------------------------------------------------- */
  const select = (index: number) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActive(index);
  };

  useSceneProgress(
    sectionRef,
    (progress) => {
      const f = stageAt(progress);
      const current = Math.round(f);
      select(current);
      applyFraction(f);

      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        if (reduced) {
          img.style.opacity = i <= current ? "1" : "0";
          img.style.transform = "";
          return;
        }
        // Stacked in stage order: each photograph fades in over the one
        // beneath it across the half-step either side of the midpoint, and
        // keeps settling out of its overscan while its stage is on screen.
        const reveal = i === 0 ? 1 : smooth(ramp(f, i - 0.75, i - 0.25));
        const settle = smooth(ramp(f, i - 0.75, i + 0.6));
        img.style.opacity = reveal.toFixed(3);
        img.style.transform = `scale(${(1.12 - 0.12 * settle).toFixed(4)})`;
      });

      // Text shares a slot, so it must never overlap: fully shown within
      // 0.22 of its stage, gone by 0.44, and a short empty beat between.
      const text = (el: HTMLElement | null, i: number) => {
        if (!el) return;
        const d = f - i;
        const shown = reduced ? (i === current ? 1 : 0) : 1 - smooth(ramp(Math.abs(d), 0.22, 0.44));
        el.style.opacity = shown.toFixed(3);
        el.style.transform = reduced ? "" : `translate3d(0, ${(-d * 22).toFixed(2)}px, 0)`;
      };
      bodyRefs.current.forEach(text);

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${((f + 1) / STAGES.length).toFixed(4)})`;
      }
    },
    {
      // Back below the desktop breakpoint the scene's inline styles belong
      // to a layout that is no longer on screen.
      onLeaveQuery: () => {
        [...imageRefs.current, ...bodyRefs.current].forEach((el) => {
          if (!el) return;
          el.style.opacity = "";
          el.style.transform = "";
        });
      },
    },
  );

  /* ---- Below the desktop breakpoint: follow the step being read -------- */
  const mobileListRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = mobileListRef.current;
    if (!list) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) select(Number((entry.target as HTMLElement).dataset["index"]));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    list.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  /* Choosing a stage scrolls to it rather than setting it: the scroll
   * position is the scene's single source of truth, so a click can never
   * be undone by the next wheel tick. */
  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const target = Math.max(0, Math.min(LAST, index));
    scrollToY(sceneScrollY(section, progressAt(target)));
  };

  const stage = STAGES[active]!;

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      // Five stages: one viewport of frame plus roughly seventy percent of a
      // viewport of scroll per stage change and the two holds.
      className="relative bg-paper py-[clamp(3.5rem,8vw,5rem)] lg:h-[460svh] lg:py-0"
    >
      <div className="lg:sticky lg:top-0 lg:h-svh lg:overflow-clip">
        <div className="grid w-full grid-cols-1 gap-[clamp(2rem,5vw,3rem)] lg:h-full lg:grid-cols-2 lg:gap-0">
          {/* ---- Copy column ---- */}
          <div className="flex min-w-0 flex-col justify-center px-[clamp(1.25rem,3.75vw,4.5rem)] lg:pt-[calc(var(--header-h)+2vh)] lg:pr-[clamp(2rem,4vw,5rem)] lg:pb-[4vh] lg:pl-[clamp(3rem,6vw,7.5rem)]">
            <div ref={headRef}>
              <h2
                id="process-heading"
                data-anim="lines"
                className="font-display text-[clamp(1.75rem,min(3.4vw,5.6vh),3.75rem)] leading-[1.14] font-medium tracking-tight text-balance text-navy"
              >
                Concept to commissioning, <span className="text-slate">under one roof.</span>
              </h2>
              <p
                data-anim
                className="mt-[clamp(0.75rem,1.8vh,1.5rem)] max-w-[32rem] font-body text-[clamp(1rem,1.25vw,1.125rem)] leading-[1.7] text-slate lg:[@media(max-height:45rem)]:hidden"
              >
                An integrated process that brings precision, accountability, and performance to
                every project.
              </p>
            </div>

            {/* Desktop rail: titles only, fixed row height, so the column is
                the same height at every stage. Each row carries its body for
                screen readers; the visible body lives in the slot below. */}
            <ol
              ref={railRef}
              className="relative mt-[clamp(1.25rem,3.5vh,3rem)] hidden [--row:clamp(2.25rem,5.4vh,3rem)] lg:block"
              aria-label="Stages"
            >
              {/* Progress trail from the first dot to the marker. */}
              <motion.span
                aria-hidden="true"
                style={{ height: fillHeight }}
                className="pointer-events-none absolute top-[calc(var(--row)/2)] left-[0.3125rem] z-[1] w-px bg-navy/70"
              />
              <motion.span
                aria-hidden="true"
                style={{ y: markerY }}
                data-marker
                className="pointer-events-none absolute top-[calc(var(--row)/2-0.3125rem)] left-0 z-10 h-2.5 w-2.5 rounded-full bg-navy"
              />
              {STAGES.map((item, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={item.num}
                    className="relative h-[var(--row)] pl-[clamp(2rem,3.4vw,3.5rem)]"
                  >
                    {index < LAST ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 left-[0.3125rem] h-full w-px bg-navy/20"
                      />
                    ) : null}
                    <span
                      data-dot
                      aria-hidden="true"
                      className="absolute top-1/2 left-0 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-navy/35 bg-paper"
                    />
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={isActive ? "step" : undefined}
                      className={`group flex h-full w-full items-center gap-[clamp(1rem,2vw,2rem)] text-left transition-opacity duration-[var(--dur-short)] ease-[var(--ease-micro)] ${
                        isActive ? "opacity-100" : "opacity-45 hover:opacity-80"
                      }`}
                    >
                      <span className="w-10 shrink-0 font-serif text-[clamp(1.375rem,min(2.1vw,3.5vh),1.875rem)] leading-none text-navy/60 italic">
                        {item.num}
                      </span>
                      <span className="font-display text-[clamp(0.875rem,min(1.1vw,2.1vh),1rem)] font-bold tracking-button text-navy uppercase">
                        {item.title}
                      </span>
                    </button>
                    <span className="sr-only">{item.body}</span>
                  </li>
                );
              })}
            </ol>

            {/* The description slot. All five sit in one grid cell, so the
                slot is always as tall as the longest and never reflows. */}
            <div
              aria-hidden="true"
              className="mt-[clamp(1rem,2.6vh,2rem)] hidden max-w-[34rem] border-t border-navy/10 pt-[clamp(0.875rem,2vh,1.5rem)] lg:grid"
            >
              {STAGES.map((item, index) => (
                <div
                  key={item.num}
                  ref={(el) => {
                    bodyRefs.current[index] = el;
                  }}
                  style={{ opacity: index === 0 ? 1 : 0 }}
                  className="col-start-1 row-start-1 font-body text-[clamp(0.9375rem,min(1.2vw,2.3vh),1.0625rem)] leading-[1.7] text-slate"
                >
                  <p className="font-display text-[0.9375rem] font-bold tracking-eyebrow text-navy uppercase">
                    {item.num} — {item.title}
                  </p>
                  <p className="mt-2">{item.body}</p>
                </div>
              ))}
            </div>

            {/* Below the desktop breakpoint: every stage, in full. */}
            <ol ref={mobileListRef} className="mt-8 lg:hidden">
              {STAGES.map((item, index) => (
                <li
                  key={item.num}
                  data-index={index}
                  className="flex gap-5 border-b border-navy/10 py-5 last:border-b-0"
                >
                  <span className="shrink-0 font-serif text-[1.875rem] leading-none text-navy/55 italic">
                    {item.num}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold tracking-button text-navy uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-body text-[1.0625rem] leading-[1.7] text-slate">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-[clamp(1rem,2.6vh,2.5rem)]">
              <UnderlineLink to="/about" hash="approach">
                Explore our approach
              </UnderlineLink>
            </div>
          </div>

          {/* ---- Stage viewer ---- */}
          <div className="relative order-first aspect-[4/3] w-full min-w-0 overflow-hidden bg-navy sm:aspect-[16/10] lg:order-none lg:aspect-auto lg:h-full">
            {STAGES.map((s, i) => (
              <img
                key={s.image.src}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                {...s.image}
                alt={i === active ? s.alt : ""}
                aria-hidden={i === active ? undefined : true}
                sizes="(min-width: 64rem) 50vw, 100vw"
                loading="lazy"
                decoding="async"
                style={{ opacity: i === 0 ? 1 : 0 }}
                // Below the desktop breakpoint there is no scene writing
                // opacity, so the active image is chosen by class instead.
                className={`absolute inset-0 h-full w-full origin-center object-cover transition-opacity duration-[var(--dur-medium)] ease-[var(--ease-entrance)] lg:transition-none ${
                  i === active ? "max-lg:opacity-100!" : "max-lg:opacity-0!"
                }`}
              />
            ))}

            {/* Progress + controls */}
            <div className="absolute inset-x-[6%] bottom-[5%] hidden flex-wrap items-center justify-between gap-4 lg:flex">
              <div className="flex min-w-0 items-center gap-[clamp(0.5rem,1vw,1rem)] font-body text-[clamp(0.75rem,0.9vw,0.875rem)] tabular-nums text-white">
                <span>{stage.num}</span>
                <span className="relative block h-px w-[clamp(3rem,18vw,15rem)] bg-white/40">
                  <span
                    ref={barRef}
                    style={{ transform: `scaleX(${1 / STAGES.length})` }}
                    className="absolute inset-0 origin-left bg-white"
                  />
                </span>
                <span>0{STAGES.length}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous stage"
                  className="hover-lift flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy disabled:cursor-default disabled:opacity-40"
                >
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === LAST}
                  aria-label="Next stage"
                  className="hover-lift flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white disabled:cursor-default disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
