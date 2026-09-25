import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/**
 * Every destination is a real route.
 *
 * Three of these used to be hashes into the middle of the home page —
 * Expertise at `/#process`, Insights at `/#insights`, and Careers pointing
 * at the contact page from the footer — which no active state can describe
 * and nobody can link to. They are pages now.
 *
 * `fullLabel` is the accessible name where it differs from what is drawn.
 * "Partners / International Systems" measures 251px at this type size,
 * nearly four times the next-widest item and a third of the whole bar, so
 * the bar shows "Partners" and the full name is carried by the accessible
 * name and by the mobile menu, where there is room for it. WCAG 2.5.3 is
 * satisfied because the accessible name contains the visible label.
 */
const ITEMS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Expertise", to: "/expertise" },
  { label: "Partners", fullLabel: "Partners / International Systems", to: "/partners" },
  { label: "Insights", to: "/insights" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
] as const;

/* Eight items need 998px beside the wordmark before they start to crowd, so
 * the inline bar starts at 72rem/1152px and everything below it gets the
 * menu. At 1024 they fit with about 18px to spare, which is the definition
 * of cramped. Written out literally at each call site because Tailwind scans
 * source text and never sees a class name assembled at runtime. */

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  // `/insights/thermal-…` should still light up Insights.
  return pathname === to || pathname.startsWith(`${to}/`);
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

export function SiteHeader({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  /* `solid` and `hidden` are the only two things scroll drives, and each
   * flips a handful of times across a whole page, so they are state rather
   * than direct DOM writes — the guard in the handler means a re-render only
   * happens when the value actually changes, not on every scroll event. */
  const [solid, setSolid] = useState(false);
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
   * Deliberately synchronous rather than deferred to a rAF. The work is two
   * comparisons against `scrollY`, which is not a layout read, and running
   * it inline means the bar's colour can never be a frame behind the ground
   * it is sitting on — on a page whose bar is transparent over the hero,
   * that frame is white type on a white section. */
  useEffect(() => {
    let last = window.scrollY;
    const SOLID_AT = 24;
    const HIDE_AFTER = 400;
    // Ignore sub-pixel and rubber-band noise, so a hand resting on a
    // trackpad cannot flicker the bar.
    const THRESHOLD = 6;

    const read = () => {
      const y = window.scrollY;
      const delta = y - last;
      setSolid(y > SOLID_AT);
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

  // Over a dark hero the bar is transparent with white type; once it has a
  // background, or on a page that opens on white, the type is navy.
  const onDark = variant === "dark" && !solid && !open;
  const tone = onDark ? "text-white" : "text-navy";
  const idle = onDark ? "text-white/70 hover:text-white" : "text-navy/65 hover:text-navy";

  return (
    <>
      <header
        ref={headerRef}
        data-site-header
        data-hidden={hidden && !open ? "true" : "false"}
        data-hero-bar
        className={`fixed inset-x-0 top-0 z-50 ${
          solid || open
            ? "border-b border-navy/10 bg-white/92 backdrop-blur-sm"
            : variant === "light"
              ? "border-b border-navy/10 bg-white/95 backdrop-blur-sm"
              : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between gap-4 py-2">
          <Link
            to="/"
            className={`hover-lift flex min-h-11 shrink-0 items-center gap-2.5 font-display text-[clamp(1rem,1.3vw,1.125rem)] font-bold tracking-[0.1875rem] uppercase ${tone}`}
          >
            <DurallMark className="h-5 w-5" />
            <span translate="no">Durall Systems</span>
          </Link>

          <nav aria-label="Primary" className="hidden min-w-0 min-[72rem]:block">
            <ul className="flex items-center justify-end gap-x-[clamp(1rem,1.7vw,1.75rem)]">
              {ITEMS.map((item) => {
                const active = isActive(pathname, item.to);
                const full = "fullLabel" in item ? item.fullLabel : undefined;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      {...(full ? { "aria-label": full } : {})}
                      // min-h-11 gives every link a 44px tap target without
                      // moving the label or its rule; the underline stays
                      // tight to the text via the inner span.
                      className={`hover-lift flex min-h-11 items-center font-display text-[clamp(0.6875rem,0.85vw,0.75rem)] font-bold tracking-eyebrow uppercase ${
                        active ? tone : idle
                      }`}
                    >
                      <span
                        className={`border-b pb-1 ${active ? "border-current" : "border-transparent"}`}
                      >
                        {item.label}
                      </span>
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
            className={`hover-lift -mr-2 flex min-h-11 min-w-11 items-center justify-center gap-2.5 px-2 font-display text-[0.6875rem] font-bold tracking-eyebrow uppercase min-[72rem]:hidden ${tone}`}
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
        className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-navy pt-[calc(var(--header-h)+clamp(1.5rem,5vh,3rem))] pb-[max(2rem,env(safe-area-inset-bottom))] text-white min-[72rem]:hidden"
      >
        <nav aria-label="Primary" className="shell flex-1">
          <ul>
            {ITEMS.map((item, index) => {
              const active = isActive(pathname, item.to);
              const full = "fullLabel" in item ? item.fullLabel : undefined;
              return (
                <li
                  key={item.to}
                  data-menu-item
                  style={{ "--menu-index": index } as React.CSSProperties}
                  className="border-b border-white/12"
                >
                  <Link
                    to={item.to}
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
            Architecture
            <br />
            starts with
            <br />a conversation.
          </p>
          <span aria-hidden="true" className="mt-4 block h-px w-8 bg-accent-blue" />
        </nav>
      </div>
    </>
  );
}
