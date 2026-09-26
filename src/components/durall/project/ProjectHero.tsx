import { useEffect, useRef } from "react";
import { isIntroPending } from "@/lib/intro";
import { loadGsap, markAnimReady, playAfterIntro, splitToLines } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";
import { LANDING } from "./motion";
import type { ProjectsPage } from "@/content/types";
import type { ProjectDetail } from "./data";

/** How many full turns each odometer column makes before it lands. */
const TURNS = [1, 2, 3, 3, 4];

/**
 * One column of the rolling figure: the digits it passes through, stacked,
 * ending on the digit it shows. Server-rendered already resting on that last
 * digit, so the figure reads correctly with JavaScript off or motion reduced.
 */
function OdometerColumn({ digit, turns }: { digit: number; turns: number }) {
  const sequence: number[] = [];
  for (let turn = 0; turn < turns; turn += 1) for (let d = 0; d < 10; d += 1) sequence.push(d);
  for (let d = 0; d <= digit; d += 1) sequence.push(d);
  const rest = ((sequence.length - 1) / sequence.length) * -100;

  return (
    <span className="relative block h-[1em] overflow-hidden">
      <span
        data-odometer-strip
        className="block"
        style={{ transform: `translate3d(0, ${rest}%, 0)` }}
      >
        {sequence.map((d, index) => (
          <span key={index} className="block h-[1em] leading-none">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

function Odometer({ value, unit }: { value: number; unit?: string | undefined }) {
  const digits = String(value).split("").map(Number);
  return (
    <p className="flex items-start font-display leading-none font-light tracking-[-0.04em] text-white">
      <span className="sr-only">
        {value}
        {unit ? ` ${unit === "m²" ? "square metres" : unit}` : null}
      </span>
      <span aria-hidden="true" className="flex text-[clamp(3.5rem,9vw,8.5rem)]">
        {digits.map((digit, index) => (
          <OdometerColumn key={index} digit={digit} turns={TURNS[index % TURNS.length]!} />
        ))}
      </span>
      {unit ? (
        <span
          aria-hidden="true"
          data-hero-rise
          className="mt-[0.35em] ml-2 text-[clamp(1rem,1.8vw,1.75rem)] leading-none"
        >
          {unit}
        </span>
      ) : null}
    </p>
  );
}

/**
 * The arrival.
 *
 *   1. When the page is reached by navigation, or reloaded, the photograph is
 *      uncovered from the bottom edge up. On a first visit the site's own
 *      opening has just parted over it, so that step is skipped rather than
 *      doubled.
 *   2. The photograph settles out of a 110% overscan across two and a half
 *      seconds — the reference's slow, heavy landing.
 *   3. The title rises line by line out of its masks, then the eyebrow and
 *      architect behind it.
 *   4. The built area rolls into place column by column, each column making a
 *      different number of turns, so the figure lands left to right.
 *
 * Scrolling away moves the photograph at a fifth of the page's speed, as the
 * reference does.
 */
export function ProjectHero({
  project,
  labels,
}: {
  project: ProjectDetail;
  labels: ProjectsPage["detail"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title || prefersReducedMotion()) return;
    let cancelled = false;
    let dispose = () => {};
    const withCurtain = !isIntroPending();

    void (async () => {
      const { gsap } = await loadGsap();
      if (cancelled || !sectionRef.current) return;
      const split = await splitToLines(title, "project-hero-line");
      if (cancelled) {
        split.revert();
        return;
      }

      const q = <E extends Element = HTMLElement>(selector: string) =>
        Array.from(section.querySelectorAll<E & HTMLElement>(selector));
      const [curtain] = q("[data-hero-curtain]");
      const [counter] = q("[data-hero-counter]");
      const [photo] = q("[data-hero-photo]");
      const [drift] = q("[data-hero-drift]");
      const strips = q("[data-odometer-strip]");
      const rise = q("[data-hero-rise]");

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: LANDING },
        onComplete: () => split.revert(),
      });
      // Everything the pre-paint class held back is now held by the timeline.
      gsap.set([title, curtain, ...q("[data-hero-hold]")].filter(Boolean), { opacity: 1 });

      const lead = withCurtain ? 0.45 : 0.1;
      if (withCurtain && curtain && counter) {
        tl.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 1.4 }, 0).fromTo(
          counter,
          { yPercent: -100 },
          { yPercent: 0, duration: 1.4 },
          0,
        );
      }
      if (photo) tl.fromTo(photo, { scale: 1.1 }, { scale: 1, duration: 2.6 }, 0);
      tl.fromTo(
        split.inners,
        { yPercent: 125 },
        { yPercent: 0, duration: 1.3, stagger: 0.1 },
        lead + 0.1,
      ).fromTo(
        rise,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08 },
        lead + 0.35,
      );
      strips.forEach((strip, index) => {
        const count = strip.childElementCount;
        // `y: 0` clears the resting offset GSAP reads back out of the inline
        // transform, which would otherwise stack on top of the tween.
        tl.fromTo(
          strip,
          // Starts a digit below the mask, so the figure rolls up into view
          // rather than sitting at zero first.
          { y: 0, yPercent: (1 / count) * 100 },
          { yPercent: ((count - 1) / count) * -100, duration: 2.4, ease: "expo.inOut" },
          lead + 0.25 + index * 0.12,
        );
      });

      const parallax = drift
        ? gsap.fromTo(
            drift,
            { y: 0 },
            {
              y: () => section.offsetHeight * 0.2,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )
        : undefined;

      markAnimReady();
      playAfterIntro(tl, () => cancelled);

      dispose = () => {
        tl.kill();
        parallax?.scrollTrigger?.kill();
        parallax?.kill();
        split.revert();
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[34rem] items-end overflow-hidden bg-navy text-white"
    >
      <div data-hero-curtain data-anim-hide className="absolute inset-0 overflow-hidden">
        <div data-hero-counter className="absolute inset-0">
          <div data-hero-drift className="absolute inset-0">
            <img
              data-hero-photo
              {...project.hero.image}
              alt={project.hero.alt}
              sizes="100vw"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-navy/75 via-navy/15 to-navy/35"
      />

      <div className="shell relative flex w-full flex-col gap-8 pb-[clamp(2rem,5vh,3.5rem)] md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p
            data-hero-rise
            data-anim-hide
            className="font-display text-[0.6875rem] font-bold tracking-[0.2em] text-white/70 uppercase"
          >
            {labels.heroPrefix} · {project.location}
          </p>
          <h1
            ref={titleRef}
            data-anim-hide
            className="mt-4 font-display text-[clamp(2.75rem,7.4vw,7.5rem)] leading-[0.94] font-light tracking-[-0.035em]"
          >
            {project.title.map((line, index) => (
              <span key={line}>
                {line}
                {index < project.title.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p data-hero-rise data-anim-hide className="mt-5 font-body text-sm text-white/75">
            {project.architect}
          </p>
        </div>

        {project.figure ? (
          <div data-hero-hold data-anim-hide className="shrink-0 md:text-right">
            <p
              data-hero-rise
              className="mb-2 font-display text-[0.6875rem] font-bold tracking-[0.2em] text-white/70 uppercase"
            >
              {project.figure.label}
            </p>
            <Odometer value={project.figure.value} unit={project.figure.unit} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
