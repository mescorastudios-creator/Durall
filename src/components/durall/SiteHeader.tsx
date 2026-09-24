import { useLayoutEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

/* Every entry is a router Link now. The in-page ones used to be plain
 * <a href="/#philosophy">, which forced a full document reload whenever they
 * were followed from /about, /projects or /partners. */
const ITEMS = [
  { label: "Projects", to: "/projects" },
  { label: "Systems", to: "/", hash: "philosophy" },
  { label: "Expertise", to: "/", hash: "process" },
  { label: "About", to: "/about" },
  { label: "Partners", to: "/partners" },
  { label: "Insights", to: "/", hash: "insights" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const light = variant === "light";
  const headerRef = useRef<HTMLElement>(null);

  /* The header is absolutely positioned, so the heroes underneath it have to
   * reserve its height themselves. Publishing the measured value means they
   * stay clear of it however the nav wraps — which it does, to two rows below
   * the large breakpoint. styles.css carries a close static default so the
   * server-rendered layout does not jump when this runs. */
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(el.getBoundingClientRect().height)}px`,
      );
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    void document.fonts?.ready.then(publish);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      data-hero-bar
      className={`absolute inset-x-0 top-0 z-50 ${
        light ? "border-b border-navy/10 bg-white/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-2 lg:flex lg:gap-y-0 lg:py-0">
        <Link
          to="/"
          className={`flex min-h-11 shrink-0 items-center gap-2.5 font-display text-[clamp(1rem,1.3vw,1.125rem)] font-bold tracking-[0.1875rem] uppercase transition-opacity hover:opacity-80 ${
            light ? "text-navy" : "text-white"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={`h-5 w-5 ${light ? "text-navy" : "text-white"}`}
          >
            <path
              d="M4 4h7a8 8 0 0 1 0 16H4V4Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M14 12h7" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span translate="no">Durall Systems</span>
        </Link>
        <nav aria-label="Primary" className="col-span-2 min-w-0 lg:col-span-1 lg:ml-auto">
          <ul className="flex flex-wrap items-center justify-start gap-x-[clamp(0.75rem,1.6vw,1.75rem)] lg:justify-end">
            {ITEMS.map((item) => {
              const hash = "hash" in item ? item.hash : undefined;
              const active = !hash && pathname === item.to;
              const activeClass = light ? "text-navy" : "text-white";
              const idleClass = light
                ? "text-navy/65 hover:text-navy"
                : "text-white/65 hover:text-white";

              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    // Spread rather than `hash={hash}`: the project runs with
                    // exactOptionalPropertyTypes, so an explicit undefined is
                    // not the same as omitting the prop.
                    {...(hash ? { hash } : {})}
                    // min-h-11 gives every link a 44px tap target without
                    // changing where the label or its rule sit; the border
                    // stays tight to the text via the inner span.
                    className={`group flex min-h-11 items-center font-display text-[clamp(0.6875rem,0.85vw,0.75rem)] font-bold tracking-eyebrow uppercase transition-colors motion-safe:transition-[color,transform] ${
                      active ? activeClass : idleClass
                    } motion-safe:hover:-translate-y-0.5`}
                  >
                    <span
                      className={`border-b pb-1 ${
                        active ? "border-current" : "border-transparent"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
