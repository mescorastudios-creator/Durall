import type { ReactNode } from "react";
import { useSectionIntro } from "@/lib/anim";

/**
 * The opening band every non-hero page uses: a quiet white plate with an
 * eyebrow, the page's h1 and a short lede.
 *
 * ProjectsIntro and ContactIntro each carried their own copy of this markup.
 * It is one component now, so a page added later cannot drift from it — and
 * the top padding, which has to clear the measured header height, is only
 * written once.
 */
export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
}) {
  const ref = useSectionIntro<HTMLDivElement>();

  return (
    <section className="relative bg-white pt-[max(calc(var(--header-h)+2rem),clamp(5.5rem,9vw,9.5rem))] pb-[clamp(2rem,3.5vw,3.5rem)]">
      <div ref={ref} className="shell">
        <p
          data-anim
          className="font-display text-[0.6875rem] font-bold tracking-eyebrow text-accent-blue uppercase"
        >
          {eyebrow}
        </p>
        <h1
          data-anim="lines"
          className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[60rem] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.06] font-medium tracking-section text-balance text-navy"
        >
          {title}
        </h1>
        <p
          data-anim
          className="mt-[clamp(1.5rem,2.4vw,2.75rem)] max-w-[34rem] font-body text-[clamp(0.9375rem,1.1vw,1rem)] leading-relaxed text-pretty text-slate"
        >
          {lede}
        </p>
      </div>
    </section>
  );
}
