import { Fragment, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { linkTo, Lines } from "@/content/render";
import { useSite } from "@/content/site";

const LINK_CLASS =
  "hover-lift -mx-2 flex min-h-11 items-center px-2 font-body text-xs tracking-wide text-white/80 hover:text-white";
const LINK_STYLE = { "--lift-x": "0.125rem", "--lift-y": "0" } as CSSProperties;

/* Columns, links and the bottom line come from the admin panel
 * (Navigation & footer). Site paths render as router Links, so a footer
 * link never forces a full reload; anything else (a profile URL, mailto:)
 * is a plain anchor. A legal entry with no address yet is plain text. */
export function DurallFooter() {
  const { settings } = useSite();
  const { company, footer } = settings;
  return (
    <footer className="bg-navy pt-[clamp(2.5rem,5vw,4.5rem)] pb-[max(2.5rem,env(safe-area-inset-bottom))] text-white">
      <div className="shell">
        <div className="border-t border-white/18 pt-[clamp(2rem,3.5vw,2.5rem)]">
          <div className="grid grid-cols-2 gap-[clamp(1.75rem,3vw,2.5rem)] md:grid-cols-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
            <div className="col-span-2 min-w-0 md:col-span-3 lg:col-span-1">
              <p
                translate="no"
                className="font-display text-xl font-bold tracking-[0.125rem] text-white uppercase"
              >
                <Lines text={company.name.replace(" ", "\n")} />
              </p>
              <p className="mt-4 font-body text-xs text-white/80">{company.tagline}</p>
            </div>

            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title} className="min-w-0">
                <p className="font-display text-xs font-bold tracking-eyebrow text-white uppercase">
                  {column.title}
                </p>
                <ul className="mt-2 space-y-0.5">
                  {column.links.map((link) => {
                    const target = linkTo(link.href);
                    return (
                      <li key={link.label + link.href}>
                        {/* min-h-11 gives a 44px tap target; -mx-2 px-2 keeps
                            the label flush with the column heading above it. */}
                        {"to" in target ? (
                          <Link {...target} className={LINK_CLASS} style={LINK_STYLE}>
                            {link.label}
                          </Link>
                        ) : (
                          <a href={target.href} className={LINK_CLASS} style={LINK_STYLE}>
                            {link.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-col gap-2 font-body text-[0.6875rem] tracking-wider text-white/60 md:flex-row md:items-center md:justify-between">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                © {new Date().getFullYear()} {company.legalName}
              </span>
              {footer.legal.map((item) => (
                <Fragment key={item.label}>
                  <span aria-hidden="true" className="text-white/30">
                    ·
                  </span>
                  {item.href ? (
                    <a href={item.href} className="hover:text-white">
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </Fragment>
              ))}
            </p>
            <p>{footer.signOff}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
