import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { boxOf, flip, type Box, type Flight, type FlipItem } from "@/lib/flip";
import { lockScroll, scrollToY, unlockScroll } from "@/lib/scroll-lock";
import { prefersReducedMotion } from "@/lib/motion-prefs";
import type { Plate } from "./data";

const OPEN_S = 0.9;
const SWITCH_S = 0.85;
const CLOSE_S = 0.8;

function aspectOf(plate: Plate) {
  return plate.image.width / plate.image.height;
}

/** The smallest variant in a srcset — already in cache from the thumbnails. */
function smallest(plate: Plate) {
  const first = plate.image.srcSet?.split(",")[0]?.trim().split(" ")[0];
  return first ?? plate.image.src;
}

/**
 * Keeps an off-screen start or end point just outside the viewport, so a
 * photograph far down the page flies in from the nearest edge instead of
 * streaking across from a thousand pixels away.
 */
function nearEdge(box: Box): Box {
  const vh = window.innerHeight;
  if (box.top + box.height < 0) return { ...box, top: -box.height - 24 };
  if (box.top > vh) return { ...box, top: vh + 24 };
  return box;
}

/**
 * Two layers: the small variant the thumbnail already loaded, instantly, and
 * the full-size one over it once it arrives. A photograph therefore always
 * has something to fly with, and sharpens as it lands.
 */
function Layers({ plate, sizes }: { plate: Plate; sizes: string }) {
  return (
    <>
      <img
        src={smallest(plate)}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        {...plate.image}
        alt={plate.alt}
        sizes={sizes}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </>
  );
}

type Ghost = { index: number; box: Box };

function fadeOpacity(
  el: HTMLElement | null,
  from: number,
  to: number,
  ms: number,
  delay: number,
  reduced: boolean,
) {
  if (!el) return;
  if (reduced) {
    el.style.opacity = String(to);
    return;
  }
  el.animate([{ opacity: from }, { opacity: to }], {
    duration: ms,
    delay,
    easing: "cubic-bezier(0.33, 1, 0.68, 1)",
    fill: "both",
  });
}

/**
 * The full-screen viewer.
 *
 * Opening, the photograph that was clicked grows out of its place in the
 * gallery to fill the stage, and every other photograph flies from wherever
 * it sits on the page into a thumbnail rail — the page empties into the
 * viewer rather than being covered by it. Choosing a thumbnail grows it into
 * the stage while the photograph it replaces shrinks back into its own slot.
 * Closing reverses the whole thing, after quietly scrolling the page behind
 * so the photograph being viewed lands back where it lives.
 *
 * A modal dialog: focus moves in and is held there, Escape closes, the arrow
 * keys step through the set, and focus returns to the photograph's own
 * button afterwards. Under reduced motion every flight is skipped.
 */
export function GalleryViewer({
  title,
  plates,
  startIndex,
  frames,
  setPlatesHidden,
  onClosed,
}: {
  title: string;
  plates: readonly Plate[];
  startIndex: number;
  frames: () => HTMLElement[];
  setPlatesHidden: (hidden: boolean) => void;
  onClosed: (index: number) => void;
}) {
  // Read directly rather than through useReducedMotion(), whose first render
  // is always `false`: the viewer only ever mounts after a click, on the
  // client, and does all of its opening work in that first render.
  const [reduced] = useState(prefersReducedMotion);
  const [index, setIndex] = useState(startIndex);
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [closing, setClosing] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageMediaRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostMediaRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railRef = useRef<HTMLUListElement>(null);
  const flight = useRef<Flight | null>(null);
  const locked = useRef(false);
  const pendingSwitch = useRef<{ from: Box; ghostTo: Box } | null>(null);

  const plate = plates[index]!;

  const fade = (el: HTMLElement | null, from: number, to: number, ms: number, delay = 0) =>
    fadeOpacity(el, from, to, ms, delay, reduced);

  /* ── Open ──────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    const plateFrames = frames();
    const origins = plateFrames.map((frame) => nearEdge(boxOf(frame)));
    setPlatesHidden(true);
    lockScroll();
    locked.current = true;
    fade(backdropRef.current, 0, 1, 450);
    fade(dialogRef.current?.querySelector("[data-viewer-chrome]") ?? null, 0, 1, 500, 250);

    if (!reduced && stageRef.current) {
      const thumbs = thumbRefs.current;
      const rail = railRef.current;
      rail?.setAttribute("data-flying", "");
      flight.current = flip(
        [
          {
            el: stageRef.current,
            from: origins[startIndex],
            media: stageMediaRef.current,
            aspect: aspectOf(plates[startIndex]!),
          },
          ...thumbs.flatMap((thumb, i) =>
            thumb
              ? [
                  {
                    el: thumb,
                    from: origins[i],
                    media: thumb.querySelector<HTMLElement>("[data-thumb-media]"),
                    aspect: aspectOf(plates[i]!),
                    delay: 0.04 + Math.abs(i - startIndex) * 0.025,
                  },
                ]
              : [],
          ),
        ],
        { duration: OPEN_S },
      );
      void flight.current.finished.then(() => rail?.removeAttribute("data-flying"));
    }
    closeRef.current?.focus({ preventScroll: true });
    // Mount-only: the open choreography runs exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leaving the page with the viewer open — the back button, say — must not
  // leave the next page unable to scroll.
  useEffect(
    () => () => {
      flight.current?.cancel();
      if (locked.current) unlockScroll();
      locked.current = false;
    },
    [],
  );

  /* ── Switch ────────────────────────────────────────────────────────── */
  const go = useCallback(
    (next: number) => {
      if (closing) return;
      const target = (next + plates.length) % plates.length;
      if (target === index) return;
      flight.current?.cancel();
      const stage = stageRef.current;
      const nextThumb = thumbRefs.current[target];
      const thisThumb = thumbRefs.current[index];
      if (!reduced && stage && nextThumb && thisThumb) {
        pendingSwitch.current = { from: boxOf(nextThumb), ghostTo: boxOf(thisThumb) };
        setGhost({ index, box: boxOf(stage) });
      }
      setIndex(target);
      thumbRefs.current[target]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    },
    [closing, index, plates.length, reduced],
  );

  useLayoutEffect(() => {
    const pending = pendingSwitch.current;
    pendingSwitch.current = null;
    if (!pending || !stageRef.current) return;
    const items: FlipItem[] = [
      {
        el: stageRef.current,
        from: pending.from,
        media: stageMediaRef.current,
        aspect: aspectOf(plates[index]!),
      },
    ];
    if (ghostRef.current && ghost) {
      // The ghost is laid out where the old photograph was and only has
      // somewhere to go, so it takes `to` rather than `from`.
      items.push({
        el: ghostRef.current,
        to: pending.ghostTo,
        fadeOut: true,
        media: ghostMediaRef.current,
        aspect: aspectOf(plates[ghost.index]!),
      });
    }
    const current = flip(items, { duration: SWITCH_S });
    flight.current = current;
    void current.finished.then(() => {
      if (flight.current === current) setGhost(null);
    });
  }, [index, ghost, plates]);

  /* ── Close ─────────────────────────────────────────────────────────── */
  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    flight.current?.cancel();
    setGhost(null);
    unlockScroll();
    locked.current = false;

    const plateFrames = frames();
    const home = plateFrames[index];
    if (home) {
      const box = boxOf(home);
      const vh = window.innerHeight;
      if (box.top < vh * 0.08 || box.top + box.height > vh * 0.95) {
        const offset = box.height < vh * 0.8 ? (vh - box.height) / 2 : vh * 0.1;
        scrollToY(window.scrollY + box.top - offset, { immediate: true });
      }
    }

    fadeOpacity(backdropRef.current, 1, 0, 600, 120, reduced);
    fadeOpacity(
      dialogRef.current?.querySelector<HTMLElement>("[data-viewer-chrome]") ?? null,
      1,
      0,
      200,
      0,
      reduced,
    );

    const finish = () => {
      setPlatesHidden(false);
      onClosed(index);
    };
    if (reduced || !stageRef.current) {
      finish();
      return;
    }

    const targets = plateFrames.map((frame) => nearEdge(boxOf(frame)));
    const thumbs = thumbRefs.current;
    railRef.current?.setAttribute("data-flying", "");
    const items: FlipItem[] = [
      {
        el: stageRef.current,
        to: targets[index],
        media: stageMediaRef.current,
        aspect: aspectOf(plates[index]!),
      },
    ];
    thumbs.forEach((thumb, i) => {
      if (!thumb) return;
      items.push({
        el: thumb,
        to: targets[i],
        media: thumb.querySelector<HTMLElement>("[data-thumb-media]"),
        aspect: aspectOf(plates[i]!),
        delay: Math.abs(i - index) * 0.02,
      });
    });
    flight.current = flip(items, { duration: CLOSE_S });
    // Hold everything at its landing spot until the plates are showing
    // again underneath, so nothing blinks on the way out.
    void flight.current.finished.then(finish);
  }, [closing, frames, index, onClosed, plates, reduced, setPlatesHidden]);

  /* ── Keyboard: Escape, arrows, and a focus trap ────────────────────── */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "Tab") {
      const focusables = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? [],
      );
      if (!focusables.length) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  /* ── Swipe on touch screens ────────────────────────────────────────── */
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index + (dx < 0 ? 1 : -1));
  };

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(plates.length).padStart(2, "0")}`;
  const ghostPlate = ghost ? plates[ghost.index] : undefined;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — photographs`}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[80] text-navy"
    >
      <div ref={backdropRef} aria-hidden="true" className="absolute inset-0 bg-white" />

      <div className="relative flex h-full flex-col-reverse md:flex-row">
        <nav
          aria-label="All photographs"
          className="relative z-10 shrink-0 md:flex md:items-center"
        >
          <ul
            ref={railRef}
            data-viewer-rail
            data-lenis-prevent
            className="flex gap-2.5 overflow-x-auto px-[clamp(1rem,4vw,1.5rem)] pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] [scrollbar-width:none] md:max-h-[80vh] md:flex-col md:overflow-x-visible md:overflow-y-auto md:py-2 md:pr-0 md:pl-[clamp(1rem,2vw,1.875rem)]"
          >
            {plates.map((item, i) => (
              <li key={i} className="shrink-0">
                <button
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  type="button"
                  aria-label={`Photograph ${i + 1} of ${plates.length}: ${item.alt}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => go(i)}
                  style={
                    {
                      ["--ar" as string]: `${item.image.width} / ${item.image.height}`,
                    } as CSSProperties
                  }
                  className="viewer-thumb relative block overflow-hidden bg-mist outline-offset-2 transition-[opacity] duration-[var(--dur-short)] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-accent-blue"
                >
                  <span data-thumb-media className="absolute inset-0 block">
                    <img
                      src={smallest(item)}
                      alt=""
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div
          data-viewer-stage
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          className="relative min-h-0 min-w-0 flex-1 touch-pan-y"
        >
          <div className="pointer-events-none absolute inset-x-[clamp(1rem,4vw,4rem)] inset-y-[clamp(4.25rem,9vh,5.5rem)] grid place-items-center [container-type:size]">
            <figure
              ref={stageRef}
              style={{ ["--ar" as string]: aspectOf(plate) } as CSSProperties}
              className="viewer-frame pointer-events-auto relative overflow-hidden bg-mist"
            >
              <div ref={stageMediaRef} className="absolute inset-0">
                <Layers key={index} plate={plate} sizes="(min-width: 48rem) 80vw, 100vw" />
              </div>
              <figcaption className="sr-only">{plate.caption}</figcaption>
            </figure>
          </div>
        </div>
      </div>

      {ghost && ghostPlate ? (
        <div
          ref={ghostRef}
          aria-hidden="true"
          className="pointer-events-none fixed overflow-hidden"
          style={{
            left: ghost.box.left,
            top: ghost.box.top,
            width: ghost.box.width,
            height: ghost.box.height,
          }}
        >
          <div ref={ghostMediaRef} className="absolute inset-0">
            <Layers plate={ghostPlate} sizes="(min-width: 48rem) 80vw, 100vw" />
          </div>
        </div>
      ) : null}

      <div
        data-viewer-chrome
        className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-6 px-[clamp(1rem,4vw,4rem)] pt-[clamp(0.75rem,2.4vh,1.5rem)]"
      >
        <p className="min-w-0 pt-3 font-display text-[0.6875rem] font-bold tracking-[0.16em] uppercase">
          <span aria-live="polite" className="tabular-nums">
            {counter}
          </span>
          <span className="ml-4 hidden font-body text-xs font-normal tracking-normal text-slate normal-case sm:inline">
            {plate.caption}
          </span>
        </p>
        <div className="pointer-events-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous photograph"
            className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-[var(--dur-short)] hover:bg-mist focus-visible:outline-2 focus-visible:outline-accent-blue"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next photograph"
            className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-[var(--dur-short)] hover:bg-mist focus-visible:outline-2 focus-visible:outline-accent-blue"
          >
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close photographs"
            className="ml-2 flex h-11 items-center gap-2 rounded-full bg-navy px-5 font-display text-[0.6875rem] font-bold tracking-[0.16em] text-white uppercase transition-colors duration-[var(--dur-short)] hover:bg-accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          >
            Close
            <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
