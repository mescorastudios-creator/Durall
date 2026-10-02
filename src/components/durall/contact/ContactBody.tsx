import { useReveal } from "@/lib/anim";
import { iconOf } from "@/content/icons";
import { useSite } from "@/content/site";
import type { ContactPage } from "@/content/types";
import { EnquiryForm } from "./EnquiryForm";
import { OfficeMap } from "./OfficeMap";

/**
 * The office on a map to the left, the enquiry form to the right.
 *
 * The map column stretches to the height of the form column beside it, so
 * the two read as one band rather than a short map next to a long form. The
 * address lives on the map's own card; email and phone sit under the form,
 * where someone who would rather write or call than fill it in will look.
 * On phones the map comes first and the form follows, in reading order.
 */
export function ContactBody({ content }: { content: ContactPage }) {
  const DETAILS = useSite().settings.contact.details;
  const mapRef = useReveal<HTMLDivElement>({ y: 40, duration: 0.9 });
  const formRef = useReveal<HTMLDivElement>({ y: 32, duration: 0.9 });
  const detailsRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 16 });

  return (
    <section className="bg-white pt-[clamp(2rem,4vw,3.5rem)] pb-[clamp(4rem,8vw,9rem)]">
      <div className="shell grid grid-cols-1 gap-[clamp(2.5rem,4.5vw,4.5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div ref={mapRef} className="min-w-0">
          <OfficeMap labels={content.map} />
        </div>

        <div className="min-w-0">
          <div ref={formRef}>
            <h2 className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
              {content.formHeading}
            </h2>
            <div className="mt-[clamp(1.5rem,2.4vw,2rem)]">
              <EnquiryForm copy={content.form} />
            </div>
          </div>

          <div className="mt-[clamp(2.5rem,4vw,3.5rem)] border-t border-navy-14 pt-[clamp(1.5rem,2.4vw,2rem)]">
            <h2 className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
              {content.detailsHeading}
            </h2>
            {/* One small list per line: a <dt>/<dd> pair has to sit directly
                in its <dl>, and here each pair is set beside its icon. */}
            <div
              ref={detailsRef}
              className="mt-[clamp(1.25rem,2vw,1.75rem)] grid gap-[clamp(1.5rem,2.4vw,2rem)] sm:grid-cols-2"
            >
              {DETAILS.map(({ icon, label, value, href, note }) => {
                const Icon = iconOf(icon);
                return (
                  <div key={label} data-reveal className="flex min-w-0 items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-14 bg-paper">
                      <Icon aria-hidden="true" className="h-5 w-5 text-navy" strokeWidth={1.4} />
                    </span>
                    <dl className="min-w-0">
                      <dt className="font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
                        {label}
                      </dt>
                      <dd className="mt-1.5 min-w-0">
                        <a
                          href={href}
                          // Wraps rather than overflows: an email address is the
                          // one string here long enough to break a narrow column.
                          className="inline-flex min-h-11 items-center font-body text-sm leading-relaxed break-all text-navy underline decoration-navy-14 underline-offset-4 transition-colors hover:decoration-navy"
                        >
                          {value}
                        </a>
                        <span className="mt-1 block font-body text-xs leading-relaxed text-pretty text-slate">
                          {note}
                        </span>
                      </dd>
                    </dl>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
