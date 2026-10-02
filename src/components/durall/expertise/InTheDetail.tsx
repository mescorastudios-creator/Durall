import { useEffect, useRef } from "react";
import { loadGsap, useReveal, useSectionIntro } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";
import { clamp01, ramp, smooth, useSceneProgress } from "@/lib/scene";
import { imageOf, Lines } from "@/content/render";
import type { ExpertisePage } from "@/content/types";
import { SillDrawing } from "./SillDrawing";
import { EYEBROW, HEADING, NUMERAL, PAPER, SHELL } from "./styles";

const LABEL = "font-display text-xs leading-none font-medium tracking-[0.167em] uppercase";

/* The held scene runs where the steps sit beside the drawing and motion is
 * welcome; everywhere else the section is simply its finished self. Keep in
 * step with the `lg:motion-safe:` classes below. */
const SCENE_QUERY = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

/**
 * "Decided on paper, not on site.": four steps on the left; on the right a
 * section through a sliding door's sill, drawn over a photograph of the
 * door it describes.
 *
 * The design is a 1920 × 1060 canvas. Its right-hand 1060px is a square
 * holding everything drawn: the photograph (684 × 760 in the top right
 * corner, faded into the paper on its left and top) and the drawing. That
 * square is kept whole here and scales with the screen, pinned to the right
 * edge from `lg` up and set under the text below it; the drawing's ground
 * line and hatching run on past its left edge, behind the text, as drawn.
 *
 * From `lg` the section holds on screen for a little over a screen of
 * scrolling, and that distance plays it: the four steps appear one after
 * another while the photograph settles out of an
 * overscan under the drawing and registers with it. It is sticky rather
 * than a scripted pin (see lib/scene.ts). Where the section is taller than
 * the window it holds with its foot on the foot of the window, which only
 * ever puts its top padding out of sight.
 */
export function InTheDetail({ content }: { content: ExpertisePage["detail"] }) {
  const introRef = useSectionIntro<HTMLDivElement>();
  const stepsRef = useReveal<HTMLOListElement>({ selector: "li", y: 16, stagger: 0.08 });
  const sceneRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);

  // Where the held block sticks: at the top of the window when it fits,
  // otherwise higher, by as much as it overruns the window.
  useEffect(() => {
    const hold = holdRef.current;
    if (!hold) return;
    const place = () =>
      hold.style.setProperty(
        "--hold-top",
        `${Math.min(0, window.innerHeight - hold.offsetHeight)}px`,
      );
    place();
    const observer = new ResizeObserver(place);
    observer.observe(hold);
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  /* The drawing is put together by the scroll: the door leaf comes down from
   * above while the sill and the ground it sits in come in from the right,
   * and the two meet in the drawing's own position. The dimension marks and
   * the drainage arrow follow. Scrolling back takes it apart again.
   *
   * From `lg` this runs through the first part of the section's hold, so it
   * happens with the whole drawing on screen and nothing else moving; below that it
   * runs as the drawing crosses the window. The section clips sideways, so
   * the part arriving from the right never widens the page. */
  const drawingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = drawingRef.current;
    const scene = sceneRef.current;
    if (!root || !scene || prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const part = (name: string) => root.querySelector(`[data-sill="${name}"]`);
      const build = (trigger: Element, start: string, end: string) => {
        gsap
          .timeline({
            defaults: { ease: "power1.out" },
            scrollTrigger: { trigger, start, end, scrub: 0.6 },
          })
          .fromTo(part("upper"), { yPercent: -30 }, { yPercent: 0, duration: 1 }, 0)
          .fromTo(part("lower"), { xPercent: 16 }, { xPercent: 0, duration: 1 }, 0)
          .fromTo(
            [part("upper"), part("lower")],
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: "none" },
            0,
          )
          .fromTo(part("notes"), { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "none" }, 1);
      };
      // matchMedia reverts whichever timeline is not for the current width.
      const media = gsap.matchMedia();
      media.add("(min-width: 64rem)", () => build(scene, "top 8%", "top -62%"));
      media.add("(max-width: 63.999rem)", () => build(root, "center 78%", "center 36%"));
      dispose = () => media.revert();
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  /* What the scene writes to: each step's two cells (the row itself belongs
   * to the reveal above), and the photograph's wrapper. Opacity and
   * transform only. */
  const parts = () => {
    const hold = holdRef.current;
    return {
      steps: Array.from(hold?.querySelectorAll<HTMLElement>("[data-detail-step] > *") ?? []),
      photo: hold?.querySelector<HTMLElement>("[data-detail-photo]") ?? null,
    };
  };

  useSceneProgress(
    sceneRef,
    (progress) => {
      const scene = sceneRef.current;
      const hold = holdRef.current;
      if (!scene || !hold) return;
      // The scene's own distance is what is left once the block has
      // scrolled up to where it holds.
      const lead = Math.max(0, hold.offsetHeight - window.innerHeight);
      const extra = scene.offsetHeight - hold.offsetHeight;
      const range = scene.offsetHeight - window.innerHeight;
      const held = extra > 0 ? clamp01((progress * range - lead) / extra) : 1;

      const { steps, photo } = parts();
      const count = steps.length / 2;
      steps.forEach((cell, at) => {
        const index = Math.floor(at / 2);
        const from = (index / count) * 0.82;
        const lit = index === 0 ? 1 : smooth(ramp(held, from, from + 0.16));
        cell.style.opacity = String(lit);
        cell.style.transform = `translate3d(${(1 - lit) * 10}px, 0, 0)`;
      });
      if (photo) photo.style.transform = `scale(${1.14 - 0.14 * smooth(ramp(held, 0, 0.9))})`;
    },
    {
      query: SCENE_QUERY,
      onLeaveQuery: () => {
        const { steps, photo } = parts();
        [...steps, photo].forEach((el) => {
          if (!el) return;
          el.style.opacity = "";
          el.style.transform = "";
        });
      },
    },
  );

  return (
    // `clip`, not `hidden`: a hidden overflow would make the section a scroll
    // container, and the block inside could no longer stick to the window.
    <section id="detail" className={`relative scroll-mt-24 overflow-clip ${PAPER}`}>
      <div ref={sceneRef}>
        <div
          ref={holdRef}
          className="relative mx-auto max-w-[120rem] lg:min-h-[min(55.21vw,66.25rem)] lg:motion-safe:sticky lg:motion-safe:top-[var(--hold-top,0px)]"
        >
          <div className={`${SHELL} relative z-10`}>
            <div className="pt-[clamp(4rem,7.3vw,8.75rem)] pb-[clamp(2.5rem,4.4vw,5.25rem)] lg:max-w-[42.7%]">
              <div ref={introRef}>
                <p data-anim className={`${EYEBROW} text-slate`}>
                  {content.eyebrow}
                </p>
                <h2
                  data-anim="lines"
                  className={`mt-[clamp(1.25rem,1.67vw,2rem)] ${HEADING} font-medium text-navy`}
                >
                  <Lines text={content.heading} />
                </h2>
                <p
                  data-anim
                  className="mt-[clamp(1.25rem,2.1vw,2.5rem)] max-w-[32.5rem] font-display text-[clamp(1rem,1.04vw,1.25rem)] leading-[1.55] text-pretty text-slate"
                >
                  {content.body}
                </p>
              </div>

              {/* On the paper, so the drawing's lines stop at its edge. */}
              <ol ref={stepsRef} className={`mt-[clamp(2.5rem,4.7vw,5.625rem)] ${PAPER}`}>
                {content.steps.map((step, index) => (
                  <li
                    key={step.title}
                    data-detail-step
                    // As drawn: each rule sits close under the step before it.
                    className={`grid grid-cols-[clamp(3.5rem,6.25vw,7.5rem)_minmax(0,1fr)] ${
                      index > 0
                        ? "border-t border-navy/12 pt-[1.0625rem] pb-[0.4375rem]"
                        : "pb-[1.5625rem]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`font-display text-[1.875rem] leading-none font-light tabular-nums ${NUMERAL}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 pt-[0.4375rem]">
                      <span className="block font-display text-sm leading-[1.3] font-medium tracking-[0.2em] text-navy uppercase">
                        {step.title}
                      </span>
                      <span className="mt-2 block max-w-[27rem] font-display text-[clamp(0.9375rem,0.83vw,1rem)] leading-[1.44] text-slate">
                        {step.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div
            ref={drawingRef}
            className="relative aspect-square w-full lg:absolute lg:top-0 lg:right-0 lg:w-[min(55.21vw,66.25rem)]"
          >
            <div className="absolute top-0 right-0 h-[71.72%] w-[64.53%] overflow-hidden">
              <div data-detail-photo className="h-full w-full">
                <img
                  draggable={false}
                  {...imageOf(content.photo.image)}
                  alt={content.photo.alt}
                  sizes="(min-width: 1024px) 36vw, 65vw"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[38%] bg-linear-to-r from-[#fdfdfb] to-[#fdfdfb]/0"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[21%] bg-linear-to-b from-[#fdfdfb]/85 to-[#fdfdfb]/0"
              />
            </div>
            {/* The whole 1920 × 1060 drawing, its right-hand square over this
              one: 181.13% wide, hanging off to the left. */}
            <SillDrawing
              label="Drawing: section through the sill of a flush sliding door"
              className="absolute top-0 right-0 h-full w-[181.13%] max-w-none"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 bottom-0 h-[15.1%] w-[181.13%] bg-linear-to-b from-[#fdfdfb]/0 to-[#fdfdfb] to-70%"
            />
          </div>

          {/* Under the square below `lg`; from there up, laid over its foot
            where the design sets them (988px down, 900px to 1663px across). */}
          <div
            className={`${SHELL} flex flex-wrap gap-x-6 gap-y-2 pt-4 pb-10 lg:absolute lg:top-[calc(min(55.21vw,66.25rem)*0.932)] lg:right-0 lg:w-[calc(min(55.21vw,66.25rem)*0.72+clamp(1.25rem,max(3.75vw,22.5vw-10.5rem),16.125rem))] lg:max-w-none lg:p-0 lg:pr-[clamp(1.25rem,max(3.75vw,22.5vw-10.5rem),16.125rem)] 2xl:grid 2xl:grid-cols-[336fr_354fr_auto] 2xl:gap-0`}
          >
            <p className={`${LABEL} text-slate`}>{content.drawingLabel}</p>
            <p className="font-display text-xs leading-none tracking-[0.033em] text-slate">
              {content.credit}
            </p>
            <p className={`${LABEL} text-slate`}>{content.scale}</p>
          </div>
        </div>
        {/* The scene's length: how far the page scrolls while the block holds. */}
        <div aria-hidden="true" className="hidden h-[110vh] lg:motion-safe:block" />
      </div>
    </section>
  );
}
