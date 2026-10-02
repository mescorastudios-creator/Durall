import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSectionIntro } from "@/lib/anim";
import { destination, imageOf, TwoToneText } from "@/content/render";
import { useSite } from "@/content/site";
import { useReducedMotion } from "@/lib/motion-prefs";
import { ramp, sceneScrollY, smooth, useSceneProgress } from "@/lib/scene";
import { scrollToY } from "@/lib/scroll-lock";

import { ArrowLeft, ArrowRight, CtaButton } from "./ui";

/* Scene pacing, as fractions of the section's scroll.
 *
 * A short hold on arrival, so the frame settles before anything moves, and a
 * longer one at the end, so the last stage is read rather than scrolled
 * straight past. Between them each stage gets an equal share. */
const LEAD_IN = 0.05;
const LEAD_OUT = 0.1;

/** Scroll progress (0–1) → continuous stage position (0 to the last stage). */
const stageAt = (progress: number, last: number) => ramp(progress, LEAD_IN, 1 - LEAD_OUT) * last;
/** Stage position → the scroll progress at which it sits exactly. */
const progressAt = (stage: number, last: number) =>
  LEAD_IN + (stage / Math.max(1, last)) * (1 - LEAD_IN - LEAD_OUT);

/** How open a stage's row is (0–1) at a stage position. Adjacent rows
 * always add up to one open row, so the list never changes height. */
const openness = (position: number, index: number) =>
  1 - smooth(ramp(Math.abs(position - index), 0.05, 0.95));

/** An inactive title is the active one at 26/32 of its size, half as dark. */
const TITLE_REST = 0.8125;

/* How the scene moves.
 *
 * The scroll does not drive the pictures directly. It chooses a stage, and
 * the scene travels to that stage on a spring of its own. Tied straight to
 * the scroll, a change is exactly as smooth as the hand on the wheel: one
 * notch threw a photograph a third of the way up the frame in a frame or
 * two, and stopping part-way left two half photographs on screen. On the
 * spring every change takes the same unhurried second whatever the wheel
 * did, always finishes, and can be turned round mid-flight without a jolt.
 *
 * SPRING is the stiffness of a critically damped spring (no overshoot):
 * half-way in a third of a second, settled in a little over one.
 * HYSTERESIS is how far past the half-way point between two stages the
 * scroll must go before the scene changes its mind, so resting near the
 * boundary cannot make it flicker between the two.
 * FOLLOW is a faster, looser follow of the raw scroll, used only for a slow
 * drift of the photograph on show, so the picture is never quite still
 * while the page is moving. */
const SPRING = 4.8;
const HYSTERESIS = 0.56;
const FOLLOW = 9;

/** One step of a critically damped spring (implicit, so it is stable at any
 * frame rate). Returns the new position and velocity. */
function spring(x: number, v: number, target: number, omega: number, dt: number) {
  const f = 1 + 2 * dt * omega;
  const oo = omega * omega;
  const hoo = dt * oo;
  const hhoo = dt * hoo;
  const inv = 1 / (f + hhoo);
  return [(f * x + dt * v + hhoo * target) * inv, (v + hoo * (target - x)) * inv] as const;
}

/**
 * 04 — How we work.
 *
 * A sticky scene: the section is several viewports tall and its frame sticks
 * for the duration. Scrolling moves from stage to stage. On the left the
 * stages are a list in which one row is open at a time: its title grows, its
 * sentence rises out from under it, the rows beneath move down to make room,
 * and a heavy bar on the rail glides to it. On the right, filling that half
 * of the screen, each photograph pushes the last one up and out of the frame.
 *
 * The open row is done without changing any heights. Every row is the same
 * height and the list keeps room for one open sentence at its foot; rows
 * below the open one are moved down by transform. One row's worth is always
 * open in total (see `openness`), so the list never changes size and the
 * column fits one viewport at every stage.
 *
 * Under reduced motion the scene still freezes and still follows the scroll,
 * but every change is an instant switch: nothing moves.
 */
export function Process() {
  const content = useSite().shared.process;
  // The scene is paced for the five stages it was designed around; the
  // admin panel edits them in place rather than adding or removing any.
  const STAGES = content.stages.map((stage, index) => ({
    num: String(index + 1).padStart(2, "0"),
    title: stage.title,
    body: stage.body,
    caption: stage.caption,
    image: imageOf(stage.photo.image),
    alt: stage.photo.alt,
  }));
  const LAST = STAGES.length - 1;
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const sectionRef = useRef<HTMLElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const headRef = useSectionIntro<HTMLDivElement>();
  const listRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  /* Where the scene is. `stage` is the position on show (it passes through
   * every value between two stages on its way), `target` the stage it is
   * heading for, `raw` the scroll's own position and `drift` a soft follow
   * of that. */
  const flow = useRef({
    stage: 0,
    velocity: 0,
    target: 0,
    raw: 0,
    drift: 0,
    frame: 0,
    last: 0,
    started: false,
    /** A stage chosen by a click, held until the scroll arrives at it. */
    forced: null as { stage: number; until: number } | null,
  });

  /** Everything the scene writes to, found once rather than every frame. */
  const parts = useRef<{
    rows: {
      row: HTMLElement;
      title: HTMLElement | null;
      body: HTMLElement | null;
      text: HTMLElement | null;
    }[];
    frames: {
      frame: HTMLElement;
      img: HTMLElement | null;
      shade: HTMLElement | null;
      edge: HTMLElement | null;
    }[];
  } | null>(null);
  const collect = () => {
    const pick = (root: Element, selector: string) => root.querySelector<HTMLElement>(selector);
    parts.current = {
      rows: Array.from(
        listRef.current?.querySelectorAll<HTMLElement>("[data-stage-row]") ?? [],
        (row) => ({
          row,
          title: pick(row, "[data-stage-title]"),
          body: pick(row, "[data-stage-body]"),
          text: pick(row, "[data-stage-text]"),
        }),
      ),
      frames: Array.from(
        viewerRef.current?.querySelectorAll<HTMLElement>("[data-stage-frame]") ?? [],
        (frame) => ({
          frame,
          img: pick(frame, "img"),
          shade: pick(frame, "[data-stage-shade]"),
          edge: pick(frame, "[data-stage-edge]"),
        }),
      ),
    };
    return parts.current;
  };

  /** Draws the scene at a stage position. Transform and opacity only, and
   * as `translate` / `scale` rather than `transform`: they replace the
   * resting values the classes set with those same properties. */
  const draw = (position: number, drift: number) => {
    const { rows, frames } = parts.current ?? collect();
    const list = listRef.current;
    const current = Math.round(position);

    /* The list. */
    const rowHeight = rows[0]?.row.offsetHeight ?? 0;
    const open = parseFloat(list?.style.getPropertyValue("--open") ?? "") || 0;
    let above = 0;
    rows.forEach(({ row, title, body, text }, index) => {
      const amount = reduced ? (index === current ? 1 : 0) : openness(position, index);
      row.style.translate = `0 ${(above * open).toFixed(2)}px`;
      if (title) {
        title.style.scale = (TITLE_REST + (1 - TITLE_REST) * amount).toFixed(4);
        title.style.opacity = (0.5 + 0.5 * amount).toFixed(3);
      }
      // The sentence rises out from under the title's line in the second
      // half of the row's opening and sinks back as it closes; it is gone
      // before the row beneath has moved up far enough to reach it.
      const shown = smooth(ramp(amount, 0.5, 1));
      if (body) body.style.opacity = shown.toFixed(3);
      if (text) text.style.translate = reduced ? "" : `0 ${((1 - shown) * 105).toFixed(2)}%`;
      above += amount;
    });
    if (markerRef.current) {
      // The bar spans the open row; between two stages it has travelled as
      // far down as the lower of them has opened.
      const floor = Math.min(rows.length - 1, Math.floor(position));
      const lower = Math.min(rows.length - 1, floor + 1);
      const travelled = floor + (reduced ? current - floor : openness(position, lower));
      markerRef.current.style.translate = `0 ${(Math.min(rows.length - 1, travelled) * rowHeight).toFixed(2)}px`;
    }
    // The count's marker slides from one notch to the next.
    if (thumbRef.current) {
      thumbRef.current.style.translate = `calc(${(reduced ? current : position).toFixed(4)} * (100% + 0.5rem)) 0`;
    }

    /* The photographs. Each one pushes the last out through the top of the
     * frame: the two travel together, the new one rising from the foot as
     * the old one leaves, like frames on a strip of film. Inside its frame
     * each picture hangs back a little against that travel (the new one
     * also settles out of a slight overscan), so the pair has some depth
     * rather than sliding as a flat strip. A hairline of light rides the
     * seam between them while they move, and the one leaving dims a
     * little as it goes. */
    const last = frames.length - 1;
    frames.forEach(({ frame, img, shade, edge }, i) => {
      if (reduced) {
        frame.style.translate = i === current ? "0 0" : i < current ? "0 -100%" : "0 100%";
        if (img) {
          img.style.translate = "";
          img.style.scale = "";
        }
        if (shade) shade.style.opacity = "0";
        if (edge) edge.style.opacity = "0";
        return;
      }
      const arrive = i === 0 ? 1 : ramp(position, i - 0.97, i - 0.02);
      const pushed = i === last ? 0 : ramp(position, i + 0.03, i + 0.98);
      frame.style.translate = `0 ${((1 - arrive - pushed) * 100).toFixed(3)}%`;
      if (img) {
        // The photograph on show leans a very little with the scroll.
        const lean = Math.max(-1, Math.min(1, drift - i)) * 1.4;
        img.style.translate = `0 ${(-(1 - arrive) * 30 + pushed * 30 - lean).toFixed(3)}%`;
        img.style.scale = (1.06 + 0.1 * (1 - arrive)).toFixed(4);
      }
      if (shade) shade.style.opacity = (pushed * 0.35).toFixed(3);
      if (edge) edge.style.opacity = (Math.sin(Math.PI * arrive) * 0.85).toFixed(3);
    });
  };

  /** One frame of the spring; keeps itself going until the scene is at rest. */
  const tick = (now: number) => {
    const state = flow.current;
    const dt = Math.min(0.05, Math.max(0.001, (now - state.last) / 1000));
    state.last = now;
    [state.stage, state.velocity] = spring(state.stage, state.velocity, state.target, SPRING, dt);
    state.drift += (state.raw - state.drift) * (1 - Math.exp(-dt * FOLLOW));
    const resting =
      Math.abs(state.target - state.stage) < 0.0004 &&
      Math.abs(state.velocity) < 0.0004 &&
      Math.abs(state.raw - state.drift) < 0.0004;
    if (resting) {
      state.stage = state.target;
      state.velocity = 0;
      state.drift = state.raw;
      state.frame = 0;
    } else {
      state.frame = requestAnimationFrame(tick);
    }
    draw(state.stage, state.drift);
  };
  const wake = () => {
    const state = flow.current;
    if (state.frame) return;
    state.last = performance.now();
    state.frame = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(flow.current.frame), []);

  // The room an open row needs is the tallest sentence plus the gap under
  // it: measured, because the sentences wrap differently at every width.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    collect();
    const measure = () => {
      const tallest = Math.max(
        0,
        ...Array.from(
          list.querySelectorAll<HTMLElement>("[data-stage-body]"),
          (el) => el.offsetHeight,
        ),
      );
      if (!tallest) return;
      list.style.setProperty("--open", `${tallest}px`);
      draw(flow.current.stage, flow.current.drift);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- measured once per size; `draw` reads refs
  }, [reduced]);

  /* The photographs wait off-screen below the frame, where the browser's
   * lazy loading does not see them coming, so each used to be fetched and
   * decoded in the middle of its own entrance. They are fetched and decoded
   * as the section approaches instead, and given their own layers for as
   * long as it is near. */
  const [near, setNear] = useState(false);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => setNear(Boolean(entry?.isIntersecting)), {
      rootMargin: "120% 0px",
    });
    io.observe(section);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!near) return;
    viewerRef.current
      ?.querySelectorAll("img")
      .forEach((img) => void img.decode?.().catch(() => {}));
  }, [near]);

  /* ---- The scene -------------------------------------------------------- */
  const select = (index: number) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActive(index);
  };

  useSceneProgress(
    sectionRef,
    (progress) => {
      const state = flow.current;
      const raw = stageAt(progress, LAST);
      state.raw = raw;

      if (state.forced) {
        // A clicked stage stands until the scroll it started has arrived
        // (or has plainly gone somewhere else).
        const arrived = Math.abs(raw - state.forced.stage) < 0.3;
        if (arrived || performance.now() > state.forced.until) state.forced = null;
      }
      if (state.forced) state.target = state.forced.stage;
      else if (!state.started || Math.abs(raw - state.target) > HYSTERESIS)
        state.target = Math.round(raw);
      select(state.target);

      if (!state.started || reduced) {
        // On arrival, and for anyone who has asked for less motion, the
        // scene is simply where the scroll says: nothing travels.
        state.started = true;
        state.stage = state.target;
        state.velocity = 0;
        state.drift = raw;
        draw(state.stage, state.drift);
        return;
      }
      wake();
    },
    {
      // Back below the desktop breakpoint the scene's inline styles belong
      // to a layout that is no longer on screen.
      onLeaveQuery: () => {
        const state = flow.current;
        cancelAnimationFrame(state.frame);
        state.frame = 0;
        state.started = false;
        const all = parts.current ?? collect();
        [
          ...all.rows.flatMap((r) => [r.row, r.title, r.body, r.text]),
          ...all.frames.flatMap((f) => [f.frame, f.img, f.shade, f.edge]),
          markerRef.current,
          thumbRef.current,
        ].forEach((el) => {
          if (!el) return;
          el.style.translate = "";
          el.style.scale = "";
          el.style.opacity = "";
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

  /* Choosing a stage starts the change at once and scrolls the page to
   * where that stage lives, so the scroll position still agrees with what
   * is on screen and the next wheel tick cannot undo the click. */
  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const target = Math.max(0, Math.min(LAST, index));
    const state = flow.current;
    state.forced = { stage: target, until: performance.now() + 1800 };
    state.target = target;
    select(target);
    if (!reduced) wake();
    scrollToY(sceneScrollY(section, progressAt(target, LAST)));
  };

  const stage = STAGES[active]!;

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      // Five stages: one viewport of frame plus roughly seventy percent of a
      // viewport of scroll per stage change and the two holds.
      className="relative bg-[#fdfdfb] py-[clamp(3.5rem,8vw,5rem)] lg:h-[460svh] lg:py-0"
    >
      <div className="lg:sticky lg:top-0 lg:h-svh lg:overflow-clip">
        <div className="grid w-full grid-cols-1 gap-[clamp(2rem,5vw,3rem)] lg:h-full lg:grid-cols-2 lg:items-start lg:gap-0">
          {/* ---- Copy column: 282px in at 1920, clear of the fixed bar ---- */}
          <div className="flex min-w-0 flex-col px-[clamp(1.25rem,3.75vw,4.5rem)] lg:h-full lg:pt-[max(calc(var(--header-h)+1vh),5.2vh)] lg:pr-[clamp(2rem,4vw,5rem)] lg:pl-[clamp(3rem,calc(22vw-8.75rem),17.625rem)]">
            <div ref={headRef}>
              <h2
                id="process-heading"
                data-anim="lines"
                className="max-w-[7.6em] font-display text-[clamp(2rem,min(3.39vw,6.02vh),4.0625rem)] leading-[1.046] font-light tracking-[-0.023em] text-navy"
              >
                {/* The design's pale grey, darkened to 3:1 on the paper. */}
                <TwoToneText value={content.heading} mutedClassName="text-[#868f97]" />
              </h2>
              {/* Dropped where the window is too short to hold it and the
                  open row together. */}
              <p
                data-anim
                className="mt-[clamp(1rem,3.7vh,2.5rem)] max-w-[32.5rem] font-display text-[clamp(1rem,min(0.94vw,1.67vh),1.125rem)] leading-[1.56] text-pretty text-slate lg:pl-1.5 lg:[@media(max-height:45rem)]:hidden lg:[@media(max-height:50rem)_and_(max-width:80rem)]:hidden"
              >
                {content.lede}
              </p>
            </div>

            {/* Desktop: one row open at a time. Rows are a fixed height and
                the list keeps room for one open sentence at its foot. */}
            <ol
              ref={listRef}
              aria-label="Stages"
              className="relative mt-[clamp(1.25rem,5vh,3.375rem)] ml-[0.3125rem] hidden pb-[var(--open,6rem)] [--row:clamp(2.5rem,5.93vh,4rem)] lg:block [@media(max-height:45rem)]:mt-3"
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-navy/14" />
              <span
                ref={markerRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 h-[calc(var(--row)+var(--open,6rem))] w-[3px] bg-navy"
              />
              {STAGES.map((item, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={item.num}
                    data-stage-row
                    // Until the scene takes over: the first row open, the
                    // rest moved down below its sentence.
                    className={`relative h-[var(--row)] pl-[2.3125rem] ${index > 0 ? "translate-y-[var(--open,6rem)]" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={isActive ? "step" : undefined}
                      className="group flex h-full w-full cursor-pointer items-center text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-blue"
                    >
                      <span
                        className={`w-14 shrink-0 font-display text-[0.8125rem] leading-none font-medium tracking-[0.154em] tabular-nums transition-colors duration-[var(--dur-short)] ${
                          // Slate, not the design's paler grey, which is
                          // 2.5:1 on the paper at this size.
                          isActive ? "text-navy" : "text-slate"
                        }`}
                      >
                        {item.num}
                      </span>
                      <span
                        data-stage-title
                        className={`origin-left font-display text-[clamp(1.5rem,min(1.67vw,2.96vh),2rem)] leading-[1.19] tracking-[-0.016em] whitespace-nowrap text-navy group-hover:opacity-100! ${
                          isActive ? "font-normal" : "font-light"
                        } ${index > 0 ? "scale-[0.8125] opacity-50" : ""}`}
                      >
                        {item.title}
                      </span>
                    </button>
                    <p
                      data-stage-body
                      className={`pointer-events-none absolute top-full right-0 left-[5.8125rem] max-w-[27.5rem] pb-[clamp(1rem,3.15vh,2.125rem)] font-display text-[clamp(0.9375rem,min(0.89vw,1.57vh),1.0625rem)] leading-[1.53] text-pretty text-slate ${
                        index > 0 ? "opacity-0" : ""
                      }`}
                    >
                      {/* The mask the sentence rises out of. */}
                      <span className="block overflow-hidden">
                        <span data-stage-text className="block">
                          {item.body}
                        </span>
                      </span>
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* Below the desktop breakpoint: every stage, in full. */}
            <ol ref={mobileListRef} className="mt-8 border-l border-navy/14 lg:hidden">
              {STAGES.map((item, index) => (
                <li key={item.num} data-index={index} className="flex gap-5 py-4 pl-5">
                  <span className="shrink-0 pt-[0.5625rem] font-display text-[0.8125rem] leading-none font-medium tracking-[0.154em] text-slate tabular-nums">
                    {item.num}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.625rem] leading-[1.2] tracking-[-0.016em] text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-display text-[1.0625rem] leading-[1.53] text-pretty text-slate">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-[clamp(1.5rem,5.3vh,3.5625rem)] lg:[@media(max-height:45rem)]:mt-4">
              <CtaButton {...destination(content.link.href)}>{content.link.label}</CtaButton>
            </div>
          </div>

          {/* ---- Stage viewer: the right-hand half of the screen ---- */}
          <div
            ref={viewerRef}
            className="relative order-first aspect-[4/3] w-full min-w-0 overflow-hidden bg-navy sm:aspect-[16/10] lg:order-none lg:aspect-auto lg:h-full"
          >
            {STAGES.map((s, i) => (
              <div
                key={i}
                data-stage-frame
                // From `lg` the scene moves each frame up into place; below
                // it there is no scene, and the active one is simply shown.
                className={`absolute inset-0 overflow-hidden max-lg:transition-opacity max-lg:duration-[var(--dur-medium)] max-lg:ease-[var(--ease-entrance)] ${
                  i === active ? "max-lg:opacity-100" : "max-lg:opacity-0"
                } ${i > 0 ? "lg:translate-y-full" : ""} ${near ? "lg:will-change-transform" : ""}`}
              >
                <img
                  draggable={false}
                  {...s.image}
                  alt={i === active ? s.alt : ""}
                  aria-hidden={i === active ? undefined : true}
                  sizes="(min-width: 64rem) 50vw, 100vw"
                  loading={near ? "eager" : "lazy"}
                  decoding="async"
                  // A little overscan from `lg`, which the drift moves within.
                  className={`h-full w-full origin-center object-cover lg:scale-[1.06] ${near ? "lg:will-change-transform" : ""}`}
                />
                <div
                  data-stage-shade
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-navy opacity-0"
                />
                {i > 0 ? (
                  <div
                    data-stage-edge
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white opacity-0"
                  />
                ) : null}
              </div>
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-linear-to-b from-navy/0 to-navy/72"
            />

            {/* The labels on the photograph roll over when the stage changes
                (`label-roll` in styles.css; the key restarts it). */}
            <p className="absolute top-[max(clamp(1rem,6%,3.5rem),calc(var(--header-h)+1rem))] left-[clamp(1rem,5.83%,3.5rem)] flex h-[2.125rem] items-center overflow-hidden bg-navy/55 px-3.5 font-display text-xs leading-none font-medium tracking-[0.167em] whitespace-nowrap text-white uppercase max-lg:top-4">
              <span key={active} className="label-roll block">
                Stage {stage.num} — {stage.title}
              </span>
            </p>

            {/* Caption, count and controls along the foot. */}
            <div className="absolute inset-x-[clamp(1rem,5.83%,3.5rem)] bottom-[clamp(1rem,3.76%,2.1875rem)] flex items-center gap-x-[clamp(1rem,2.9vw,1.75rem)]">
              <p className="mr-auto min-w-0 overflow-hidden font-display text-[0.8125rem] text-white/85 lg:shrink-0">
                <span key={active} className="label-roll block truncate">
                  {stage.caption}
                </span>
              </p>
              <p className="hidden shrink-0 overflow-hidden font-display text-[0.8125rem] font-medium tracking-[0.123em] text-white/50 tabular-nums lg:flex">
                <span key={active} className="label-roll block text-white">
                  {stage.num}
                </span>
                &nbsp;/ 0{STAGES.length}
              </p>
              <div
                aria-hidden="true"
                className="relative hidden min-w-12 shrink basis-[13.25rem] gap-2 xl:flex"
              >
                {STAGES.map((item) => (
                  <span key={item.num} className="h-0.5 flex-1 bg-white/35" />
                ))}
                {/* One notch wide; the scene slides it along. */}
                <span
                  ref={thumbRef}
                  style={{ width: `calc((100% - ${LAST} * 0.5rem) / ${STAGES.length})` }}
                  className="absolute top-0 left-0 h-0.5 bg-white"
                />
              </div>
              <div className="hidden shrink-0 items-center gap-2 lg:ml-3 lg:flex">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous stage"
                  className="hover-lift flex size-11 cursor-pointer items-center justify-center border border-white/55 text-white hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-40"
                >
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === LAST}
                  aria-label="Next stage"
                  className="hover-lift flex size-11 cursor-pointer items-center justify-center bg-white text-navy hover:bg-[#f4f4f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-40"
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
