import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

/* Every destination is a router Link with an explicit route.
 *
 * These used to be bare `href="#contact"` anchors, which resolve against
 * whatever page you happen to be on — and /partners has no #contact section
 * at all, so Careers, LinkedIn, Instagram and YouTube were dead links there.
 *
 * Nine of them also pointed at sections of the home page for content that
 * now has its own route; those go straight to the page. Careers in
 * particular pointed at /contact because there was nowhere else for it.
 *
 * The three social entries still point at the contact page because the site
 * has no real profile URLs to link to yet; swap them for the accounts when
 * they exist. */
const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Durall", to: "/about" },
      { label: "Our Legacy", to: "/about", hash: "philosophy" },
      { label: "Leadership", to: "/about", hash: "approach" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Window Systems", to: "/expertise", hash: "systems" },
      { label: "Door Systems", to: "/expertise", hash: "systems" },
      { label: "Facade Systems", to: "/expertise", hash: "systems" },
      { label: "Technical Performance", to: "/expertise", hash: "process" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Technical Library", to: "/insights" },
      { label: "Case Studies", to: "/projects" },
      { label: "International Systems", to: "/partners", hash: "international-systems" },
      { label: "Care & Maintenance", to: "/insights" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "LinkedIn", to: "/contact" },
      { label: "Instagram", to: "/contact" },
      { label: "YouTube", to: "/contact" },
    ],
  },
] as const;

export function DurallFooter() {
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
                Durall
                <br />
                Systems
              </p>
              <p className="mt-4 font-body text-xs text-white/80">
                Engineering architectural possibilities.
              </p>
            </div>

            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title} className="min-w-0">
                <p className="font-display text-xs font-bold tracking-eyebrow text-white uppercase">
                  {column.title}
                </p>
                <ul className="mt-2 space-y-0.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        {...("hash" in link ? { hash: link.hash } : {})}
                        // min-h-11 gives a 44px tap target; -mx-2 px-2 keeps
                        // the label flush with the column heading above it.
                        className="hover-lift -mx-2 flex min-h-11 items-center px-2 font-body text-xs tracking-wide text-white/80 hover:text-white"
                        style={{ "--lift-x": "0.125rem", "--lift-y": "0" } as CSSProperties}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-col gap-2 font-body text-[0.6875rem] tracking-wider text-white/60 md:flex-row md:items-center md:justify-between">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>© {new Date().getFullYear()} Durall Systems Pvt. Ltd.</span>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span>Privacy Policy</span>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span>Terms of Use</span>
            </p>
            <p>Built for architectural precision.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
