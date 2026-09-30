import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { Lines } from "@/content/render";
import { IMAGES } from "@/assets/images";
import { useSite } from "@/content/site";

/* The items come from the admin panel (Navigation). `fullLabel` is the
 * accessible name where it differs from what is drawn: "Partners /
 * International Systems" measures 251px at this type size, nearly four times
 * the next-widest item, so the bar shows "Partners" and the full name is
 * carried by the accessible name and by the mobile menu, where there is room
 * for it. WCAG 2.5.3 is satisfied because the accessible name contains the
 * visible label. */

/* Five items and the button need about 800px beside the wordmark, so the
 * inline bar starts at 64rem/1024px and everything below it gets the menu.
 * Written out literally at each call site because Tailwind scans source
 * text and never sees a class name assembled at runtime. */

/* Pages that open on a dark full-width photograph. Over those the bar is
 * clear until the page scrolls, as in the design; everywhere else it is
 * navy from the start, so the white wordmark and links always have
 * something dark behind them. */
const PHOTO_TOP = /^\/(about|partners|projects|expertise)?$|^\/projects\/[^/]+$/;

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

/**
 * The white wordmark on the left and the pages and "Start a project" on the
 * right, in white, across the full width of the page. Clear over a dark
 * opening photograph and navy once the page moves (see PHOTO_TOP).
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
  // Whether the page is still at its top, where a photograph shows through.
  const [atTop, setAtTop] = useState(true);
  const clear = PHOTO_TOP.test(pathname) && atTop && !open;

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
      setAtTop(y < 24);
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
      <header
        ref={headerRef}
        data-site-header
        data-hidden={hidden && !open ? "true" : "false"}
        data-clear={clear ? "true" : "false"}
        data-hero-bar
        className={`fixed inset-x-0 top-0 z-50 ${
          clear
            ? "bg-transparent"
            : "bg-navy/95 shadow-[0_10px_30px_-18px_rgb(5_8_52/0.6)] backdrop-blur-md"
        }`}
      >
        {/* A compact bar, the same height clear or navy; over a photograph
            the row is carried lower by transform (see [data-site-header-row]
            in styles.css), where the designs place the wordmark. */}
        <div
          data-site-header-row
          className="mx-auto flex w-full max-w-[120rem] items-center justify-between gap-4 py-[clamp(0.75rem,0.97vw,1.125rem)] pr-[clamp(1.25rem,4.53vw,5.45rem)] pl-[clamp(1.25rem,7.92vw,9.5rem)]"
        >
          <Link
            to="/"
            className="flex min-h-11 shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img
              {...IMAGES.logoDurallWhite}
              alt={settings.company.name}
              translate="no"
              className="h-auto w-[clamp(8.5rem,12.5vw,15rem)]"
            />
          </Link>

          <nav aria-label="Primary" className="hidden min-w-0 lg:block">
            <ul className="flex items-center justify-end gap-x-[clamp(1.25rem,1.82vw,2.2rem)]">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                const full = item.fullLabel || undefined;
                return (
                  <li key={item.href + item.label}>
                    <Link
                      {...linkTarget(item.href)}
                      aria-current={active ? "page" : undefined}
                      {...(full ? { "aria-label": full } : {})}
                      className={`flex min-h-11 items-center border-b-2 font-display text-[clamp(0.875rem,0.78vw,0.9375rem)] text-white transition-colors duration-[var(--dur-short)] ease-[var(--ease-micro)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        active
                          ? "border-white font-medium"
                          : "border-transparent hover:border-white/45"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {settings.header.cta.label ? (
                <li className="ml-[clamp(0rem,0.1vw,0.1rem)]">
                  <Link
                    {...linkTarget(settings.header.cta.href)}
                    className="hover-lift flex min-h-11 items-center bg-white px-5 font-display text-xs font-medium tracking-[0.1em] text-navy uppercase transition-colors duration-[var(--dur-short)] hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {settings.header.cta.label}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="-mr-3 flex min-h-11 min-w-11 items-center justify-center gap-2.5 px-3 font-display text-[0.6875rem] font-bold tracking-eyebrow text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
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
        className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-navy pt-[calc(var(--header-h)+clamp(1.5rem,5vh,3rem))] pb-[max(2rem,env(safe-area-inset-bottom))] text-white lg:hidden"
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

          {settings.header.cta.label ? (
            <Link
              {...linkTarget(settings.header.cta.href)}
              onClick={close}
              className="mt-[clamp(1.5rem,4vh,2.5rem)] inline-flex min-h-12 items-center bg-white px-6 font-display text-xs font-medium tracking-[0.1em] text-navy uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {settings.header.cta.label}
            </Link>
          ) : null}

          <p className="mt-[clamp(2rem,5vh,3rem)] font-display text-[0.6875rem] leading-[2.1] font-medium tracking-eyebrow text-white/60 uppercase">
            <Lines text={settings.header.menuTagline} />
          </p>
          <span aria-hidden="true" className="mt-4 block h-px w-8 bg-accent-blue" />
        </nav>
      </div>
    </>
  );
}
