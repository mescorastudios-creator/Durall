import { useReveal, useSectionIntro } from "@/lib/anim";
import { ArrowRight } from "../ui";
import { APPLY_EMAIL, ROLES } from "./data";

const EMAIL_LINK =
  "text-navy underline decoration-navy-14 underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-navy";

export function Openings() {
  const headRef = useSectionIntro<HTMLDivElement>();
  const listRef = useReveal<HTMLUListElement>({ selector: "li", y: 24, stagger: 0.1 });

  return (
    <section
      id="openings"
      aria-labelledby="openings-heading"
      className="scroll-mt-24 bg-paper py-[clamp(4.5rem,8vw,8rem)]"
    >
      <div className="shell-about grid grid-cols-1 items-start gap-x-[clamp(2.5rem,6vw,7rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)]">
        <div className="min-w-0">
          <div ref={headRef}>
            <h2
              id="openings-heading"
              data-anim="lines"
              className="font-display text-[clamp(2rem,3vw,3.5rem)] leading-[1.11] font-medium tracking-tight text-navy"
            >
              Open roles
            </h2>
          </div>

          {ROLES.length === 0 ? (
            /* Reachable state, not a fallback nobody wrote: set ROLES to []
               and this is what the page shows. */
            <p className="mt-[clamp(1.75rem,3vw,2.5rem)] max-w-[34rem] border-t border-navy-14 pt-[clamp(1.25rem,2vw,1.75rem)] font-body text-[clamp(0.9375rem,1.1vw,1rem)] leading-relaxed text-pretty text-slate">
              Nothing is open right now. We still read everything that comes in, so send your work
              to{" "}
              <a href={`mailto:${APPLY_EMAIL}`} className={EMAIL_LINK}>
                {APPLY_EMAIL}
              </a>{" "}
              and we will come back to you when a seat opens.
            </p>
          ) : (
            <ul ref={listRef} className="mt-[clamp(1.75rem,3vw,2.5rem)] border-b border-navy-14">
              {ROLES.map((role) => (
                <li key={role.title} className="min-w-0">
                  <a
                    href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(role.title)}`}
                    className="group relative grid min-w-0 gap-x-8 gap-y-4 border-t border-navy-14 py-[clamp(1.5rem,2.4vw,2.25rem)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-blue md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    {/* A navy rule draws over the hairline on hover: the
                        row's only movement, so the list stays still. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-navy transition-transform duration-[var(--dur-medium)] ease-[var(--ease-micro)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                    />
                    <span className="min-w-0">
                      <span className="block font-display text-[clamp(1.25rem,1.8vw,1.75rem)] leading-[1.2] font-medium tracking-tight text-pretty text-navy">
                        {role.title}
                      </span>
                      <span className="mt-2 block max-w-[38rem] font-body text-[0.9375rem] leading-relaxed text-pretty text-slate">
                        {role.summary}
                      </span>
                      <span className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[0.6875rem] font-bold tracking-eyebrow text-slate uppercase">
                        <span>{role.team}</span>
                        <span aria-hidden="true">/</span>
                        <span>{role.location}</span>
                        <span aria-hidden="true">/</span>
                        <span>{role.type}</span>
                      </span>
                    </span>
                    <span className="inline-flex min-h-11 items-center gap-2.5 font-display text-xs font-bold tracking-button text-navy uppercase">
                      Apply
                      <ArrowRight className="hover-arrow h-3.5 w-3.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside
          aria-labelledby="apply-heading"
          className="min-w-0 border-t border-navy pt-[clamp(1.25rem,2vw,1.75rem)] lg:mt-[clamp(4.5rem,6.2vw,6.25rem)]"
        >
          <h3
            id="apply-heading"
            className="font-display text-[clamp(1.125rem,1.4vw,1.25rem)] leading-[1.25] font-medium text-navy"
          >
            How to apply
          </h3>
          <p className="mt-3 font-body text-[0.9375rem] leading-[1.7] text-pretty text-slate">
            Send the work, not a cover letter. A drawing set, a detail you are proud of or a problem
            you solved on site tells us more than a page of adjectives.
          </p>
          <p className="mt-4 font-body text-[0.9375rem] leading-relaxed">
            <a href={`mailto:${APPLY_EMAIL}`} className={EMAIL_LINK}>
              {APPLY_EMAIL}
            </a>
          </p>
        </aside>
      </div>
    </section>
  );
}
