import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion } from "motion/react";
import { GalleryHorizontal, LayoutGrid, Rows3 } from "lucide-react";
import { loadGsap, markAnimReady, playAfterIntro, visibleOnLoad } from "@/lib/anim";
import { boxOf, flip, type Box, type Flight } from "@/lib/flip";
import { scrollToY } from "@/lib/scroll-lock";
import { prefersReducedMotion, useReducedMotion } from "@/lib/motion-prefs";
import { GalleryViewer } from "./GalleryViewer";
import { LANDING, useLineReveal } from "./motion";
import { Eyebrow } from "./parts";
import type { ProjectsPage } from "@/content/types";
import type { Plate, ProjectDetail } from "./data";

type Mode = "detail" | "masonry" | "slider";

const MODES = [
  { key: "detail", label: "Detail", Icon: Rows3 },
  { key: "masonry", label: "Masonry", Icon: LayoutGrid },
  { key: "slider", label: "Slider", Icon: GalleryHorizontal },
] as const satisfies ReadonlyArray<{ key: Mode; label: string; Icon: unknown }>;

/**
 * The detail layout: an editorial scatter on a twelve-column grid, placed by
 * hand in the Lovable design. On phones it folds to two columns, full-width
 * plates alternating with pairs.
 */
const DETAIL = [
  { col: "1 / 8", row: "1 / 5", phone: "full" },
  { col: "9 / 13", row: "2 / 6", phone: "half" },
  { col: "1 / 5", row: "7 / 12", phone: "half" },
  { col: "6 / 13", row: "8 / 11", phone: "full" },
  { col: "5 / 11", row: "12 / 16", phone: "half" },
  { col: "1 / 5", row: "14 / 19", phone: "half" },
  { col: "7 / 12", row: "17 / 21", phone: "full" },
  { col: "5 / 13", row: "21 / 24", phone: "full" },
] as const;

const GLIDE_CURVE = [0.17, 0.84, 0.44, 1] as const;

function aspectOf(plate: Plate) {
  return plate.image.width / plate.image.height;
}

function plateStyle(plate: Plate, index: number): CSSProperties {
  const detail = DETAIL[index % DETAIL.length]!;
  return {
    ["--col" as string]: detail.col,
    ["--row" as string]: detail.row,
    ["--phone-span" as string]: detail.phone === "full" ? "1 / -1" : "auto",
    ["--phone-ar" as string]: detail.phone === "full" ? "4 / 3" : "3 / 4",
    ["--ar" as string]: `${plate.image.width} / ${plate.image.height}`,
  };
}

/**
 * Project photography, in three arrangements.
 *
 * The reference's centrepiece. A pill fixed to the bottom of the screen
 * slides up while the gallery is in view and switches between an editorial
 * scatter, a three-column masonry and a horizontal slider. Switching doesn't
 * cut: every photograph flies from where it was to where it now belongs,
 * resizing and re-cropping on the way without ever stretching (see
 * src/lib/flip.ts). Clicking a photograph opens it full screen, and the rest
 * of the set flies into a thumbnail rail beside it.
 *
 * Each photograph arrives once, the first time it comes into view: a white
 * shutter lifts off it from the bottom edge while the image settles out of
 * an overscan.
 */
export function ProjectGallery({
  project,
  labels,
}: {
  project: ProjectDetail;
  labels: ProjectsPage["detail"];
}) {
  const { plates } = project;
  const reduced = useReducedMotion();
  const headRef = useLineReveal<HTMLDivElement>();
  const listRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const [mode, setMode] = useState<Mode>("detail");
  const [viewing, setViewing] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  const pending = useRef<Box[] | null>(null);
  const flight = useRef<Flight | null>(null);

  const frames = useCallback(
    () => Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-plate-frame]") ?? []),
    [],
  );

  // The pill is only offered while the gallery is what the reader is looking at.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      rootMargin: "-38% 0px -38% 0px",
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // First arrival of each photograph.
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;
    let cancelled = false;
    let dispose = () => {};

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !listRef.current) return;
      const tweens = frames().map((frame) => {
        const cover = frame.querySelector<HTMLElement>("[data-plate-cover]");
        const img = frame.querySelector<HTMLElement>("[data-plate-img]");
        const onScreen = visibleOnLoad(frame);
        const tl = gsap.timeline({
          paused: onScreen,
          defaults: { ease: LANDING },
          ...(onScreen
            ? {}
            : {
                // Plays on entry and never reverses — not `once`, which can
                // crash a refresh (see useLineReveal).
                scrollTrigger: {
                  trigger: frame,
                  start: "clamp(top 92%)",
                  toggleActions: "play none none none",
                },
              }),
        });
        if (cover) tl.fromTo(cover, { scaleY: 1 }, { scaleY: 0, duration: 1.35 }, 0);
        if (img) tl.fromTo(img, { scale: 1.24 }, { scale: 1, duration: 2 }, 0);
        if (onScreen) playAfterIntro(tl, () => cancelled);
        return tl;
      });
      markAnimReady();

      dispose = () =>
        tweens.forEach((tl) => {
          tl.scrollTrigger?.kill();
          tl.progress(1).kill();
        });
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [frames]);

  const refreshTriggers = () => {
    void loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  };

  const changeMode = (next: Mode) => {
    if (next === mode) return;
    flight.current?.cancel();
    pending.current = reduced ? null : frames().map(boxOf);
    setMode(next);
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    const from = pending.current;
    pending.current = null;
    if (!list || !from) return;

    list.scrollLeft = 0;
    // Keep the reader inside the gallery: a shorter arrangement would
    // otherwise leave them staring at whatever follows it.
    const top = list.getBoundingClientRect().top;
    const clearance = Math.min(140, window.innerHeight * 0.16);
    if (top < clearance) scrollToY(window.scrollY + top - clearance, { immediate: true });

    list.setAttribute("data-flipping", "");
    const plateFrames = frames();
    flight.current = flip(
      plateFrames.map((el, index) => ({
        el,
        from: from[index],
        media: el.querySelector<HTMLElement>("[data-plate-media]"),
        aspect: aspectOf(plates[index]!),
        delay: index * 0.03,
      })),
      { duration: 1 },
    );
    void flight.current.finished.then(() => {
      list.removeAttribute("data-flipping");
      refreshTriggers();
    });
  }, [mode, frames, plates]);

  /* ── Slider: drag with the mouse, and a progress hairline ─────────────
   * Touch and trackpads scroll the strip natively. Only a mouse needs help,
   * and only it gets it; a drag long enough to count swallows the click
   * that ends it, so dragging never opens a photograph by accident. */
  const drag = useRef({ active: false, moved: false, x: 0, left: 0, v: 0, t: 0, raf: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    if (mode !== "slider" || event.pointerType !== "mouse" || event.button !== 0) return;
    const list = listRef.current;
    if (!list) return;
    cancelAnimationFrame(drag.current.raf);
    drag.current = {
      active: true,
      moved: false,
      x: event.clientX,
      left: list.scrollLeft,
      v: 0,
      t: performance.now(),
      raf: 0,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const state = drag.current;
    const list = listRef.current;
    if (!state.active || !list) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) < 6) return;
    if (!state.moved) {
      state.moved = true;
      list.setPointerCapture(event.pointerId);
      list.setAttribute("data-dragging", "");
    }
    const now = performance.now();
    const next = state.left - dx;
    state.v = (list.scrollLeft - next) / Math.max(1, now - state.t);
    state.t = now;
    list.scrollLeft = next;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLUListElement>) => {
    const state = drag.current;
    const list = listRef.current;
    if (!state.active || !list) return;
    state.active = false;
    if (list.hasPointerCapture(event.pointerId)) list.releasePointerCapture(event.pointerId);
    list.removeAttribute("data-dragging");
    if (!state.moved || reduced) return;
    // Let the strip coast to a stop, as a flicked touch list would.
    let velocity = -state.v * 16;
    const coast = () => {
      velocity *= 0.92;
      if (Math.abs(velocity) < 0.4) return;
      list.scrollLeft += velocity;
      state.raf = requestAnimationFrame(coast);
    };
    state.raf = requestAnimationFrame(coast);
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const onListScroll = () => {
    const list = listRef.current;
    const bar = progressRef.current;
    if (!list || !bar) return;
    const range = list.scrollWidth - list.clientWidth;
    bar.style.transform = `scaleX(${range > 0 ? 0.08 + (list.scrollLeft / range) * 0.92 : 1})`;
  };

  useEffect(() => {
    if (mode === "slider") onListScroll();
  }, [mode]);

  const setPlatesHidden = useCallback((hidden: boolean) => {
    const list = listRef.current;
    if (!list) return;
    if (hidden) list.setAttribute("data-viewing", "");
    else list.removeAttribute("data-viewing");
  }, []);

  const onViewerClosed = useCallback(
    (index: number) => {
      setViewing(null);
      frames()[index]?.focus({ preventScroll: true });
    },
    [frames],
  );

  const showPill = inView && viewing === null;
  const count = String(plates.length).padStart(2, "0");

  return (
    <section
      data-gallery
      aria-labelledby="gallery-heading"
      className="shell pb-[clamp(6rem,10vw,9rem)]"
    >
      <div ref={headRef}>
        <span data-rule aria-hidden="true" className="block h-px w-full bg-navy-14" />
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <h2
            id="gallery-heading"
            data-rise
            className="font-display text-[0.6875rem] font-bold tracking-[0.18em] text-slate uppercase"
          >
            {labels.gallery}
          </h2>
          <Eyebrow>
            {count} {labels.plates}
          </Eyebrow>
        </div>
      </div>

      <div
        data-show={showPill}
        inert={!showPill}
        className="gallery-pill pointer-events-none fixed inset-x-0 bottom-[clamp(1rem,3vh,1.75rem)] z-40 hidden justify-center md:flex"
      >
        <div
          role="group"
          aria-label="Gallery layout"
          className="pointer-events-auto flex gap-1 rounded-full bg-glass/90 p-1 shadow-[0_8px_24px_rgb(5_8_52/0.12)] backdrop-blur-md"
        >
          {MODES.map(({ key, label, Icon }) => {
            const active = key === mode;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => changeMode(key)}
                className={`relative flex min-h-11 items-center gap-2 rounded-full px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue font-display text-[0.6875rem] font-bold tracking-[0.14em] uppercase transition-colors duration-[var(--dur-short)] ${
                  active ? "text-navy" : "text-slate hover:text-navy"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="gallery-mode"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={reduced ? { duration: 0 } : { duration: 0.6, ease: GLIDE_CURVE }}
                  />
                ) : null}
                <Icon aria-hidden="true" className="relative h-3.5 w-3.5" strokeWidth={1.6} />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul
        ref={listRef}
        data-gallery-list
        data-mode={mode}
        data-lenis-prevent-horizontal
        tabIndex={mode === "slider" ? 0 : undefined}
        aria-label={mode === "slider" ? "Project photographs — scroll sideways" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onScroll={mode === "slider" ? onListScroll : undefined}
        className="mt-[clamp(3rem,6vw,5rem)] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent-blue"
      >
        {plates.map((plate, index) => (
          <li key={index} data-plate style={plateStyle(plate, index)} className="min-w-0">
            <button
              type="button"
              data-plate-frame
              aria-haspopup="dialog"
              aria-label={`Open photograph ${index + 1} of ${plates.length}: ${plate.alt}`}
              onClick={() => setViewing(index)}
              className="group relative block h-full w-full cursor-zoom-in overflow-hidden bg-mist focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
            >
              <span data-plate-media className="absolute inset-0 block">
                <img
                  data-plate-img
                  {...plate.image}
                  alt=""
                  sizes="(min-width: 64rem) 50vw, (min-width: 48rem) 60vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="media-zoom h-full w-full object-cover"
                />
              </span>
              <span
                data-plate-cover
                aria-hidden="true"
                className="absolute inset-0 bg-white"
                style={{ transform: "scaleY(0)", transformOrigin: "50% 0%" }}
              />
            </button>
          </li>
        ))}
      </ul>

      {mode === "slider" ? (
        <div className="mt-6 h-px w-full bg-navy-14" aria-hidden="true">
          <span
            ref={progressRef}
            className="block h-px w-full origin-left bg-navy"
            style={{ transform: "scaleX(0.08)" }}
          />
        </div>
      ) : null}

      {viewing !== null ? (
        <GalleryViewer
          title={project.name}
          plates={plates}
          startIndex={viewing}
          frames={frames}
          setPlatesHidden={setPlatesHidden}
          onClosed={onViewerClosed}
        />
      ) : null}
    </section>
  );
}
