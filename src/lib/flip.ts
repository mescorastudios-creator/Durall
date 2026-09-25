/**
 * FLIP for photographs.
 *
 * Moving an element between two layouts with a transform is the standard
 * trick — measure where it was, measure where it is, and animate the
 * difference away — but a plain FLIP stretches whatever is inside the box
 * whenever the two boxes have different proportions, which for a photograph
 * cropped `object-fit: cover` is almost always.
 *
 * This keeps the photograph undistorted in flight. The box scales freely,
 * and the image inside it is given a counter-scale every frame so that its
 * own scale is uniform and always exactly covers the box at that instant.
 * The first frame is therefore pixel-identical to the cover crop the image
 * started from and the last to the one it lands in, whatever the two
 * proportions, and nothing but `transform` (plus `opacity`, when asked) is
 * written per frame.
 *
 * The one layout write is at the start and end: for the duration of a
 * flight the image is sized to its own proportions, centred on the box,
 * because an `<img>` clips its cover crop to its own box and a counter-scaled
 * box would otherwise open gaps at the edges.
 */

export type Box = { left: number; top: number; width: number; height: number };

export function boxOf(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

/** CSS `cubic-bezier()` as a function, for curves that have to run in JS. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-6) return sampleY(t);
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    // Newton can stall on flat stretches of the curve; bisection cannot.
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (sampleX(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

/**
 * The glide the reference project page uses for every layout change: fast
 * off the mark and a long, soft landing — close to `expo.out`.
 */
export const GLIDE = "cubic-bezier(0.17, 0.84, 0.44, 1)";
export const glide = cubicBezier(0.17, 0.84, 0.44, 1);

export type FlipItem = {
  /** The box that moves. Must be laid out where it will rest (or start). */
  el: HTMLElement;
  /** Where it appears to start. Defaults to its own layout box. */
  from?: Box | undefined;
  /** Where it appears to end. Defaults to its own layout box. */
  to?: Box | undefined;
  /** The photograph inside it, filling it with `object-fit: cover`. */
  media?: HTMLElement | null | undefined;
  /** The photograph's natural width ÷ height. Required with `media`. */
  aspect?: number | undefined;
  /** Seconds before this item starts moving. */
  delay?: number | undefined;
  /** Fade across the last part of the flight — for landing "into" something. */
  fadeOut?: boolean | undefined;
};

export type Flight = { finished: Promise<void>; cancel: () => void };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Prepared = {
  item: FlipItem;
  layout: Box;
  from: Box;
  to: Box;
  /** Cover scale of the layout box, in units of the image's own height. */
  cover: number;
};

const MEDIA_PROPS = [
  "position",
  "inset",
  "left",
  "top",
  "width",
  "height",
  "maxWidth",
  "transform",
  "transformOrigin",
  "willChange",
] as const;

export function flip(
  items: FlipItem[],
  { duration = 0.9, ease = glide }: { duration?: number; ease?: (t: number) => number } = {},
): Flight {
  const prepared: Prepared[] = [];

  for (const item of items) {
    const { el, media, aspect } = item;
    el.style.transform = "";
    el.style.opacity = "";
    const layout = boxOf(el);
    if (layout.width < 1 || layout.height < 1) continue;

    el.style.transformOrigin = "0 0";
    el.style.willChange = "transform";

    let cover = 0;
    if (media && aspect) {
      cover = Math.max(layout.width / aspect, layout.height);
      const width = cover * aspect;
      Object.assign(media.style, {
        position: "absolute",
        inset: "auto",
        left: `${(layout.width - width) / 2}px`,
        top: `${(layout.height - cover) / 2}px`,
        width: `${width}px`,
        height: `${cover}px`,
        maxWidth: "none",
        transformOrigin: "50% 50%",
        willChange: "transform",
      });
    }

    prepared.push({ item, layout, cover, from: item.from ?? layout, to: item.to ?? layout });
  }

  const render = (elapsed: number) => {
    let running = false;
    for (const { item, layout, cover, from, to } of prepared) {
      const local = Math.min(1, Math.max(0, (elapsed - (item.delay ?? 0)) / duration));
      if (local < 1) running = true;
      const e = ease(local);

      const width = lerp(from.width, to.width, e);
      const height = lerp(from.height, to.height, e);
      const sx = width / layout.width;
      const sy = height / layout.height;
      const x = lerp(from.left, to.left, e) - layout.left;
      const y = lerp(from.top, to.top, e) - layout.top;
      item.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${sx}, ${sy})`;

      if (item.media && item.aspect && cover) {
        const target = Math.max(width / item.aspect, height);
        item.media.style.transform = `scale(${target / (sx * cover)}, ${target / (sy * cover)})`;
      }
      if (item.fadeOut) {
        const t = Math.min(1, Math.max(0, (local - 0.6) / 0.4));
        item.el.style.opacity = String(1 - t * t * (3 - 2 * t));
      }
    }
    return running;
  };

  let frame = 0;
  let settle: () => void = () => {};
  const finished = new Promise<void>((resolve) => {
    settle = resolve;
  });

  const cleanup = () => {
    cancelAnimationFrame(frame);
    for (const { item } of prepared) {
      item.el.style.transform = "";
      item.el.style.transformOrigin = "";
      item.el.style.willChange = "";
      // A faded-out element stays faded: it is about to be removed, and
      // resetting it would flash it back for the frame before React does.
      if (item.fadeOut) item.el.style.opacity = "0";
      if (item.media) for (const prop of MEDIA_PROPS) item.media.style[prop] = "";
    }
    settle();
  };

  // The first frame is written synchronously, so a caller running this from
  // a layout effect never paints the element at its destination first.
  render(0);
  const start = performance.now();
  const tick = (now: number) => {
    if (render((now - start) / 1000)) frame = requestAnimationFrame(tick);
    else cleanup();
  };
  frame = requestAnimationFrame(tick);

  return { finished, cancel: cleanup };
}
