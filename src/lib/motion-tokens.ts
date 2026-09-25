/**
 * The motion system, for the components that animate through motion/react
 * rather than GSAP.
 *
 * Same two curves and same durations as `EASE`/`DUR` in lib/anim.ts and
 * `--ease-*`/`--dur-*` in styles.css, expressed as the cubic-bezier arrays
 * motion takes. Kept dependency-free so a component can pull a transition
 * in without dragging the GSAP loader's module along with it.
 *
 * What this replaced: four hand-written cubic-beziers, motion's own
 * "easeOut", and five springs at three different stiffnesses — on pages that
 * also ran three GSAP eases and three CSS ones.
 */
export const CURVE = {
  /** quint-out — matches gsap `power4.out` and `--ease-entrance`. */
  entrance: [0.22, 1, 0.36, 1] as const,
  /** cubic-out — matches gsap `power3.out` and `--ease-micro`. */
  micro: [0.33, 1, 0.68, 1] as const,
};

export const SECONDS = {
  micro: 0.18,
  short: 0.32,
  medium: 0.56,
  long: 0.9,
  /** Backdrops and full-bleed stage imagery only. */
  cinematic: 2.2,
} as const;

type Step = keyof typeof SECONDS;
type Curve = (typeof CURVE)[keyof typeof CURVE];

/**
 * A transition on the scale. Under reduced motion the duration collapses to
 * something short rather than to zero, so a cross-fade still reads as a
 * change of state instead of a cut.
 */
export function transition(step: Step, reduced: boolean, curve: Curve = CURVE.entrance) {
  return { duration: reduced ? Math.min(SECONDS[step], 0.2) : SECONDS[step], ease: curve };
}
