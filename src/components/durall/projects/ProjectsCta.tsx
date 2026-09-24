import { motion } from "motion/react";
import { useReveal, useSplitLines } from "@/lib/anim";
import { useReducedMotion } from "@/lib/motion-prefs";

export function ProjectsCta() {
  const reduced = useReducedMotion();
  const ref = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 26, stagger: 0.12 });
  const headingRef = useSplitLines<HTMLHeadingElement>();

  return (
    <section id="contact" className="bg-navy py-[clamp(3.5rem,6vw,6.5rem)] text-white">
      <div ref={ref} className="shell flex flex-col items-center text-center">
        <p
          data-reveal
          className="font-display text-xs font-bold tracking-[0.1875rem] text-accent-blue uppercase"
        >
          Start a project
        </p>
        <h2
          ref={headingRef}
          className="mt-6 max-w-[50rem] font-display text-[clamp(2rem,4.4vw,4.25rem)] leading-[1.12] font-medium tracking-section text-balance text-white"
        >
          Have a project in mind?
        </h2>
        <p
          data-reveal
          className="mt-6 max-w-[50rem] font-body text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.56] text-white/70"
        >
          Let&rsquo;s build what comes next, together. Reach out to our engineering office to
          discuss system details, custom fabrications, and performance targets.
        </p>
        <motion.a
          data-reveal
          href="/contact"
          className="mt-[clamp(2rem,3.4vw,3rem)] inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-display text-sm font-bold tracking-button text-navy uppercase"
          whileHover={reduced ? { opacity: 0.85 } : { y: -2, scale: 1.02 }}
          whileTap={reduced ? {} : { scale: 0.99 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          Talk to our team
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3 w-3">
            <path d="M2 10L10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
