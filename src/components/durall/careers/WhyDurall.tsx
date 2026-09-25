import { useReveal, useSectionIntro } from "@/lib/anim";
import { REASONS } from "./data";

/* Four short points under one heading. No cards and no icons: each point
 * hangs from a hairline, the way the specification rows on the About page
 * do, so the section reads as a list of facts rather than a feature grid. */
export function WhyDurall() {
  const headRef = useSectionIntro<HTMLDivElement>();
  const listRef = useReveal<HTMLUListElement>({ selector: "li", y: 24, stagger: 0.1 });

  return (
    <section
      aria-labelledby="why-heading"
      className="bg-white pt-[clamp(4.5rem,9vw,9rem)] pb-[clamp(4.5rem,8vw,8rem)]"
    >
      <div className="shell-about">
        <div ref={headRef}>
          <h2
            id="why-heading"
            data-anim="lines"
            className="max-w-[16ch] font-display text-[clamp(2rem,3vw,3.5rem)] leading-[1.11] font-medium tracking-tight text-balance text-navy"
          >
            What working here is like.
          </h2>
        </div>

        <ul
          ref={listRef}
          className="mt-[clamp(2.5rem,4.5vw,4rem)] grid grid-cols-1 gap-x-[clamp(2rem,5vw,6rem)] gap-y-[clamp(2.25rem,3.5vw,3.25rem)] md:grid-cols-2"
        >
          {REASONS.map(({ title, body }) => (
            <li
              key={title}
              className="min-w-0 border-t border-navy-14 pt-[clamp(1.25rem,2vw,1.75rem)]"
            >
              <h3 className="font-display text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2] font-medium tracking-tight text-navy">
                {title}
              </h3>
              <p className="mt-3 max-w-[30rem] font-body text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7] text-pretty text-slate">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
