import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { finePointer, inFirstScreen, loadGsap } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";

/**
 * The scroll-linked layer of the site: effects a component asks for in its
 * markup with `data-fx`, built here once per page rather than through a hook
 * in every component, so a card in a list can carry one as easily as a
 * section can. Rendered by the footer, which every page carries.
 *
 *   parallax  a wrapper inside a clipped frame; the picture drifts against
 *             the scroll (`data-fx-by`: percent of its height, default 6)
 *   zoom      a wrapper inside a clipped frame; the picture settles out of
 *             an overscan as the frame arrives (`data-fx-by`: scale, 1.18)
 *   drift     a block that travels at its own rate, for the columns of a
 *             grid (`data-fx-by`: pixels either way, default 32)
 *   words     text that appears word by word as it is read down the page
 *   rule      a hairline that draws from the left
 *   rise      a block that climbs out from behind the section above it (the
 *             footer); its parent has to clip it
 *
 * Everything is a scrubbed transform or opacity: the scroll bar is the
 * transport, and scrolling back plays it backwards. The effects that follow
 * the scroll position frame by frame (parallax, drift, rise) are kept to
 * pointer devices (see `finePointer`); the rest also run on touch. Nothing
 * runs under reduced motion, and nothing is hidden until this has run, so
 * the page reads the same without it.
 *
 * What fades, fades from nothing rather than from a ghost of itself: text
 * held at a fifth of its strength is still text on the page, and fails
 * contrast for as long as it waits.
 *
 * Content in the first screen is left alone: there is no scroll to bring it
 * in with, and a picture already on screen would visibly jump into its
 * overscan when this ran.
 *
 * A wrapper, not the picture itself, carries `parallax` and `zoom`: the
 * pictures have a hover zoom of their own on the `scale` property, which a
 * tween on the same element would switch off.
 */
export function ScrollFx() {
  // Rebuilt after every navigation, a change of filter included: the cards
  // of a filtered list are new elements.
  const href = useRouterState({ select: (s) => s.resolvedLocation?.href ?? s.location.href });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let dispose = () => {};

    const build = async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-fx]"));
      if (!targets.length) return;
      const SplitType = targets.some((el) => el.dataset["fx"] === "words")
        ? (await import("split-type")).default
        : null;
      if (cancelled) return;

      const fine = finePointer();
      const wide = window.matchMedia("(min-width: 64rem)").matches;
      const splits: { revert: () => void }[] = [];

      const context = gsap.context(() => {
        for (const el of targets) {
          const by = Number(el.dataset["fxBy"]) || undefined;
          const frame = el.parentElement ?? el;
          const scrub = (start: string, end: string, smooth: number | boolean = true) => ({
            ease: "none",
            scrollTrigger: { trigger: frame, start, end, scrub: smooth },
          });

          switch (el.dataset["fx"]) {
            case "parallax": {
              if (!fine || inFirstScreen(frame)) break;
              const shift = by ?? 6;
              // Overscan by the distance travelled, so no edge ever shows.
              gsap.set(el, { scale: 1 + (shift * 2) / 100 + 0.02 });
              gsap.fromTo(
                el,
                { yPercent: -shift },
                { yPercent: shift, ...scrub("top bottom", "bottom top") },
              );
              break;
            }
            case "zoom": {
              if (inFirstScreen(frame)) break;
              gsap.fromTo(
                el,
                { scale: by ?? 1.18 },
                { scale: 1, ...scrub("top bottom", "top 30%", 0.6) },
              );
              break;
            }
            case "drift": {
              if (!fine || !wide || inFirstScreen(frame)) break;
              const distance = by ?? 32;
              gsap.fromTo(
                el,
                { y: distance },
                { y: -distance, ...scrub("top bottom", "bottom top") },
              );
              break;
            }
            case "rise": {
              if (!fine) break;
              gsap.fromTo(
                el,
                { yPercent: -(by ?? 22), opacity: 0 },
                { yPercent: 0, opacity: 1, ...scrub("top bottom", "bottom bottom") },
              );
              break;
            }
            case "words": {
              if (!SplitType || inFirstScreen(el)) break;
              const split = new SplitType(el, { types: "words", tagName: "span" });
              splits.push(split);
              if (!split.words?.length) break;
              gsap.fromTo(
                split.words,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.08,
                  scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 62%", scrub: 0.5 },
                },
              );
              break;
            }
            case "rule": {
              if (inFirstScreen(el)) break;
              gsap.fromTo(
                el,
                { scaleX: 0, transformOrigin: "0% 50%" },
                {
                  scaleX: 1,
                  ease: "none",
                  scrollTrigger: { trigger: el, start: "top 94%", end: "top 64%", scrub: 0.6 },
                },
              );
              break;
            }
          }
        }
      });

      dispose = () => {
        context.revert();
        splits.forEach((split) => split.revert());
      };
    };

    // Two frames: one for the incoming route to commit, one for its own
    // entrances to take hold of what they animate.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => void build()));
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      dispose();
    };
  }, [href]);

  return null;
}
