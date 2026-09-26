import { useReveal, useSplitLines } from "@/lib/anim";
import { destination } from "@/content/render";
import type { PartnersPage } from "@/content/types";
import { CtaButton } from "../ui";

export function PartnersClosing({ content }: { content: PartnersPage["closing"] }) {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const ref = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 32 });

  return (
    <section id="demands" className="bg-white pb-[clamp(3.5rem,8vw,7.5rem)]">
      <div
        ref={ref}
        className="shell-about grid grid-cols-1 items-center gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-2"
      >
        <div className="min-w-0">
          <p
            data-reveal
            className="font-display text-[clamp(0.5625rem,0.72vw,0.6875rem)] font-bold tracking-eyebrow text-slate uppercase"
          >
            {content.eyebrow}
          </p>
          <h2
            ref={headingRef}
            className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[16ch] font-display text-[clamp(1.75rem,3.2vw,3.5rem)] leading-[1.12] font-medium tracking-section text-balance text-navy"
          >
            {content.heading}
          </h2>
          <p
            data-reveal
            className="mt-[clamp(1.25rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.9375rem)] leading-relaxed text-slate"
          >
            {content.body}
          </p>
          <div data-reveal className="mt-[clamp(1.5rem,3vw,2.25rem)]">
            <CtaButton {...destination(content.cta.href)} variant="solid">
              {content.cta.label}
            </CtaButton>
          </div>
        </div>

        <div
          data-reveal
          aria-hidden="true"
          className="min-w-0 rounded-[0.75rem] bg-glass aspect-[16/11] w-full"
        />
      </div>
    </section>
  );
}
