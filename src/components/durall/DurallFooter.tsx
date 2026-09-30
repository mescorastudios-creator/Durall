import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { IMAGES } from "@/assets/images";
import { linkTo } from "@/content/render";
import type { Cta } from "@/content/types";
import { useSite } from "@/content/site";
import { scrollToY } from "@/lib/scroll-lock";
import { prefersReducedMotion } from "@/lib/motion-prefs";

/* Everything here comes from the admin panel: the words and links under
 * Navigation & Footer, the address under the office, and the email and
 * phone under Company & Contact. Site paths render as router Links, so a
 * footer link never forces a full reload; anything else (a profile URL,
 * mailto:) is a plain anchor, and an entry with no address yet is plain text.
 *
 * Measured from the design at 1920px wide, where the content runs from 232px
 * to 1686px: 12.1vw either side. */

const HEADING =
  "font-display text-xs leading-none font-medium tracking-[0.16em] text-silver uppercase";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function FooterLink({
  item,
  className,
  style,
}: {
  item: Cta;
  className: string;
  style?: CSSProperties;
}) {
  if (!item.href) return <span className={className}>{item.label}</span>;
  const target = linkTo(item.href);
  return "to" in target ? (
    <Link {...target} className={`${className} ${FOCUS}`} style={style}>
      {item.label}
    </Link>
  ) : (
    <a href={target.href} className={`${className} ${FOCUS}`} style={style}>
      {item.label}
    </a>
  );
}

export function DurallFooter() {
  const { settings } = useSite();
  const { company, footer, office, contact } = settings;
  const email = contact.details.find((detail) => detail.icon === "mail");
  const phone = contact.details.find((detail) => detail.icon === "phone");

  return (
    <footer className="bg-navy pb-[max(0.5rem,env(safe-area-inset-bottom))] text-white">
      <div className="mx-auto w-full max-w-[120rem] px-[clamp(1.25rem,12.1vw,14.5rem)]">
        {/* The design's columns sit at 617 / 247 / 247 / 343px of 1454; a
            second column of links added in the admin gets another 247. */}
        <div
          className="grid grid-cols-1 gap-x-6 gap-y-10 pt-[clamp(2.5rem,2.34vw,2.8rem)] pb-[clamp(2.5rem,1.8vw,2.2rem)] sm:grid-cols-2 lg:grid-cols-[minmax(0,617fr)_repeat(var(--columns),minmax(0,247fr))_minmax(0,247fr)_minmax(0,343fr)]"
          style={{ "--columns": Math.max(1, footer.columns.length) } as CSSProperties}
        >
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className={`inline-flex min-h-11 items-center ${FOCUS}`}
              aria-label={company.name}
            >
              <img
                {...IMAGES.logoDurallWhite}
                alt=""
                className="h-auto w-[clamp(11rem,13.55vw,16.25rem)]"
              />
            </Link>
            <p className="mt-[clamp(0.75rem,1vw,1.2rem)] font-display text-[clamp(1.125rem,1.04vw,1.25rem)] font-light">
              {company.tagline}
            </p>
            <p className="mt-[clamp(1rem,1.2vw,1.4rem)] max-w-[21.5rem] font-display text-sm leading-[1.6] text-pretty text-silver">
              {footer.blurb}
            </p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="min-w-0">
              <p className={HEADING}>{column.title}</p>
              <ul className="mt-[clamp(0.75rem,0.9vw,1rem)]">
                {column.links.map((link) => (
                  <li key={link.label + link.href}>
                    {/* The design's 35px rhythm on wide screens; a full 44px
                        tap target on phones. */}
                    <FooterLink
                      item={link}
                      className="hover-lift -mx-2 flex min-h-11 items-center px-2 lg:min-h-[2.1875rem] font-display text-[0.9375rem] hover:text-white/75"
                      style={{ "--lift-x": "0.125rem", "--lift-y": "0" } as CSSProperties}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="min-w-0">
            <p className={HEADING}>{footer.officeHeading}</p>
            <address className="mt-[clamp(1rem,1.3vw,1.6rem)] font-display text-[0.9375rem] leading-[1.6] not-italic">
              {office.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="min-w-0">
            <p className={HEADING}>{footer.contactHeading}</p>
            <div className="mt-[clamp(0.75rem,1vw,1.1rem)] flex flex-col items-start font-display text-lg">
              {email ? (
                <a
                  href={email.href}
                  className={`flex min-h-10 items-center break-all hover:text-white/75 ${FOCUS}`}
                >
                  {email.value}
                </a>
              ) : null}
              {phone ? (
                <a
                  href={phone.href}
                  className={`flex min-h-10 items-center whitespace-nowrap hover:text-white/75 ${FOCUS}`}
                >
                  {phone.value}
                </a>
              ) : null}
            </div>
            {footer.hours ? (
              <p className="mt-2 max-w-[21.5rem] font-display text-sm leading-snug text-pretty text-silver">
                {footer.hours}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate py-5 font-display text-[0.8125rem] text-silver md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}
          </p>
          <ul className="flex flex-wrap items-center gap-x-[clamp(1rem,1.45vw,1.75rem)] gap-y-1">
            {[...footer.social, ...footer.legal].map((item) => (
              <li key={item.label}>
                <FooterLink item={item} className="flex min-h-11 items-center hover:text-white" />
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => scrollToY(0, { immediate: prefersReducedMotion() })}
                className={`flex min-h-11 cursor-pointer items-center gap-1 text-white hover:text-white/75 ${FOCUS}`}
              >
                {footer.backToTop}
                <span aria-hidden="true">↑</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
