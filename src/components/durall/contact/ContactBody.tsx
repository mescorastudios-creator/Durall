import { useReveal } from "@/lib/anim";
import { EnquiryForm } from "./EnquiryForm";
import { DETAILS } from "./data";

/**
 * Form and direct lines, side by side.
 *
 * The three-track grid with a hairline between the columns is the same one
 * AboutPhilosophy uses, down to the `1px` track and the `bg-navy-14` rule, so
 * the page sits on the site's existing rhythm rather than a new one.
 */
export function ContactBody() {
  const formRef = useReveal<HTMLDivElement>({ y: 40, duration: 1.1 });
  const detailsRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 24 });

  return (
    <section className="bg-white pt-[clamp(2rem,4vw,3.5rem)] pb-[clamp(4rem,8vw,9rem)]">
      <div className="shell grid grid-cols-1 gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,1.15fr)_1px_minmax(0,0.75fr)]">
        <div ref={formRef} className="min-w-0">
          <h2 className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
            Send an Enquiry
          </h2>
          <div className="mt-[clamp(1.5rem,2.4vw,2rem)]">
            <EnquiryForm />
          </div>
        </div>

        <div aria-hidden="true" className="hidden w-px bg-navy-14 lg:block" />

        <div ref={detailsRef} className="min-w-0">
          <h2
            data-reveal
            className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase"
          >
            Direct Lines
          </h2>

          <dl className="mt-[clamp(1.5rem,2.4vw,2rem)] space-y-[clamp(1.75rem,2.6vw,2.25rem)]">
            {DETAILS.map(({ icon: Icon, label, value, href, note }) => (
              <div key={label} data-reveal className="flex min-w-0 items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-14 bg-paper">
                  <Icon aria-hidden="true" className="h-5 w-5 text-navy" strokeWidth={1.4} />
                </span>
                <div className="min-w-0">
                  <dt className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1.5 min-w-0">
                    {Array.isArray(value) ? (
                      <address className="font-body text-sm leading-relaxed break-words text-navy not-italic">
                        {value.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    ) : href ? (
                      <a
                        href={href}
                        // Wraps rather than overflows: an email address is the
                        // one string here long enough to break a narrow column.
                        className="inline-flex min-h-11 items-center font-body text-sm leading-relaxed break-all text-navy underline decoration-navy-14 underline-offset-4 transition-colors hover:decoration-navy"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="font-body text-sm leading-relaxed text-navy">{value}</span>
                    )}
                    <span className="mt-1 block font-body text-xs leading-relaxed text-pretty text-slate">
                      {note}
                    </span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <p
            data-reveal
            className="mt-[clamp(2rem,3vw,2.5rem)] border-t border-navy-14 pt-[clamp(1.25rem,2vw,1.75rem)] font-display text-[0.6875rem] leading-[2.1] font-medium tracking-eyebrow text-navy uppercase"
          >
            Architecture
            <br />
            starts with
            <br />a conversation.
          </p>
          <span aria-hidden="true" className="mt-4 block h-px w-8 bg-accent-blue" />
        </div>
      </div>
    </section>
  );
}
