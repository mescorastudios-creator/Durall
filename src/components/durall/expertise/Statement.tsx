import { useSectionIntro } from "@/lib/anim";
import type { ExpertisePage } from "@/content/types";
import { EYEBROW, PAPER, SECTION_Y, SHELL } from "./styles";

/** "We don't supply windows…": the page's opening statement, its second
 * clause in grey as in the design. */
export function Statement({ content }: { content: ExpertisePage["statement"] }) {
  const ref = useSectionIntro<HTMLDivElement>();
  return (
    <section className={`${PAPER} ${SECTION_Y}`}>
      <div ref={ref} className={SHELL}>
        <p data-anim className={`${EYEBROW} text-slate`}>
          {content.eyebrow}
        </p>
        {/* The grey is darkened a little from the design's #9aa3aa so the
            clause still reads as text: 3:1 on the paper at this size. */}
        <h2
          data-anim
          className="mt-[clamp(1.5rem,1.6vw,2rem)] max-w-[20.6em] font-display text-[clamp(1.75rem,3.33vw,4rem)] leading-[1.156] font-light tracking-[-0.025em] text-pretty text-navy"
        >
          {content.text.text} <span className="text-[#868f97]">{content.text.muted}</span>
        </h2>
      </div>
    </section>
  );
}
