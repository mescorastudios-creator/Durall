import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { Lines } from "@/content/render";
import { useSite } from "@/content/site";

/* The items come from the admin panel (Navigation). `fullLabel` is the
 * accessible name where it differs from what is drawn: "Partners /
 * International Systems" measures 251px at this type size, nearly four times
 * the next-widest item, so the bar shows "Partners" and the full name is
 * carried by the accessible name and by the mobile menu, where there is room
 * for it. WCAG 2.5.3 is satisfied because the accessible name contains the
 * visible label. */

/* Eight items need 998px beside the wordmark before they start to crowd, so
 * the inline bar starts at 72rem/1152px and everything below it gets the
 * menu. At 1024 they fit with about 18px to spare, which is the definition
 * of cramped. Written out literally at each call site because Tailwind scans
 * source text and never sees a class name assembled at runtime. */

function isActive(pathname: string, href: string) {
  const [to = "/"] = href.split("#");
  if (to === "/") return pathname === "/";
  // `/insights/thermal-…` should still light up Insights.
  return pathname === to || pathname.startsWith(`${to}/`);
}

/** A nav destination: a route, with a section hash when there is one. */
function linkTarget(href: string) {
  const [to = "/", hash] = href.split("#");
  return hash ? { to, hash } : { to };
}

function DurallMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 4h7a8 8 0 0 1 0 16H4V4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M14 12h7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * A floating pill: the logo on the left and the pages on the right, on a
 * white bar that sits just inside the top of the page rather than across
 * its full width. It is the same white on every page, so it reads the same
 * over a dark photographic hero as over a white page, and it needs no
 * light/dark variant.
 */
export function SiteHeader() {
  const { settings } = useSite();
  const items = settings.header.items.filter((item) => item.visible);
  // The page this header belongs to, not the one being navigated to: the
  // outgoing page's header is photographed for the page transition after the
  // location has already changed, and would otherwise show the destination
  // as active outside the reveal.
  const pathname = useRouterState({
    select: (s) => s.resolvedLocation?.pathname ?? s.location.pathname,
  });
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  /* `hidden` is the one thing scroll drives, and it flips a handful of times
   * across a whole page, so it is state rather than a direct DOM write — the
   * guard in the handler means a re-render only happens when the value
   * actually changes, not on every scroll event. */
  const [hidden, setHidden] = useState(false);

  /* The header overlays the heroes, so the pages underneath reserve its
   * height themselves. Publishing the measured value means they stay clear
   * of it however the bar resolves. styles.css carries a close static
   * default so the server-rendered layout does not jump when this runs. */
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

  /* Direction-aware hide.
   *
   * The header used to be `position: absolute`: it scrolled away at the top
   * of the hero and never came back, so on a 7,900px landing page there was
   * no navigation at all below the fold.
   *
   * The work is a comparison against `scrollY`, which is not a layout read,
   * so it runs inline in the handler. */
  useEffect(() => {
    let last = window.scrollY;
    const HIDE_AFTER = 400;
    // Ignore sub-pixel and rubber-band noise, so a hand resting on a
    // trackpad cannot flicker the bar.
    const THRESHOLD = 6;

    const read = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) > THRESHOLD) {
        setHidden(delta > 0 && y > HIDE_AFTER);
        last = y;
      }
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // The menu closes itself on navigation: the route changes under it
  // otherwise and it stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      // Focus stays inside the panel while it covers the page.
      const items = focusables();
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
    };
  }, [open, close]);

  return (
    <>
      {/* The header box spans the page so it can be fixed and slide away as
          one; only the pill inside it takes the pointer, so the strip of
          page around the pill stays clickable. */}
      <header
        ref={headerRef}
        data-site-header
        data-hidden={hidden && !open ? "true" : "false"}
        data-hero-bar
        className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[clamp(0.625rem,1.2vw,1.125rem)]"
      >
        <div className="shell">
          <div className="pointer-events-auto flex min-h-[3.25rem] items-center justify-between gap-4 rounded-full border border-navy/10 bg-white/95 py-1.5 pr-1.5 pl-[clamp(1rem,1.6vw,1.5rem)] shadow-[0_10px_30px_-14px_rgb(5_8_52/0.35)] backdrop-blur-md">
            <Link
              to="/"
              className="hover-lift flex min-h-10 shrink-0 items-center gap-2 font-display text-[clamp(0.875rem,1.05vw,1rem)] font-bold tracking-[0.16em] text-navy uppercase"
            >
              <DurallMark className="h-[1.125rem] w-[1.125rem]" />
              <span translate="no">{settings.company.name}</span>
            </Link>

            <nav aria-label="Primary" className="hidden min-w-0 min-[72rem]:block">
              <ul className="flex items-center justify-end gap-x-0.5">
                {items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const full = item.fullLabel || undefined;
                  return (
                    <li key={item.href + item.label}>
                      <Link
                        {...linkTarget(item.href)}
                        aria-current={active ? "page" : undefined}
                        {...(full ? { "aria-label": full } : {})}
                        className={`flex min-h-10 items-center rounded-full px-[clamp(0.625rem,0.95vw,0.9375rem)] font-body text-[clamp(0.8125rem,0.9vw,0.875rem)] font-medium transition-colors duration-[var(--dur-short)] ease-[var(--ease-micro)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${
                          active
                            ? "bg-navy text-white"
                            : "text-navy/70 hover:bg-mist hover:text-navy"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex min-h-10 min-w-11 items-center justify-center gap-2.5 rounded-full px-4 font-display text-[0.6875rem] font-bold tracking-eyebrow text-navy uppercase transition-colors duration-[var(--dur-short)] hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue min-[72rem]:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-px w-4 bg-current transition-[translate,rotate] duration-[var(--dur-short)] ease-[var(--ease-micro)] ${
                    open ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-4 bg-current transition-[translate,rotate,opacity] duration-[var(--dur-short)] ease-[var(--ease-micro)] ${
                    open ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu rather than a squeezed copy of the bar: eight
          entries, the long Partners label in full, and the contact line the
          bar has no room for. */}
      <div
        id="site-menu"
        ref={panelRef}
        data-site-menu
        data-open={open ? "true" : "false"}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-navy pt-[calc(var(--header-h)+clamp(1.5rem,5vh,3rem))] pb-[max(2rem,env(safe-area-inset-bottom))] text-white min-[72rem]:hidden"
      >
        <nav aria-label="Primary" className="shell flex-1">
          <ul>
            {items.map((item, index) => {
              const active = isActive(pathname, item.href);
              const full = item.fullLabel || undefined;
              return (
                <li
                  key={item.href + item.label}
                  data-menu-item
                  style={{ "--menu-index": index } as React.CSSProperties}
                  className="border-b border-white/12"
                >
                  <Link
                    {...linkTarget(item.href)}
                    aria-current={active ? "page" : undefined}
                    onClick={close}
                    className={`hover-lift flex min-h-14 items-center justify-between gap-4 py-[clamp(0.5rem,1.4vh,1rem)] font-display text-[clamp(1.375rem,6vw,2rem)] leading-tight font-medium tracking-tight ${
                      active ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                    style={{ "--lift-x": "0.375rem", "--lift-y": "0" } as React.CSSProperties}
                  >
                    <span>{full ?? item.label}</span>
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-[clamp(2rem,5vh,3rem)] font-display text-[0.6875rem] leading-[2.1] font-medium tracking-eyebrow text-white/60 uppercase">
            <Lines text={settings.header.menuTagline} />
          </p>
          <span aria-hidden="true" className="mt-4 block h-px w-8 bg-accent-blue" />
        </nav>
      </div>
    </>
  );
}
