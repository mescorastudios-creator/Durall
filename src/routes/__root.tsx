import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { DurallFooter } from "@/components/durall/DurallFooter";
import { SiteHeader } from "@/components/durall/SiteHeader";
import { CtaButton } from "@/components/durall/ui";
import { SiteIntro } from "@/components/SiteIntro";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { fetchSite } from "@/content/api";
import { absoluteUrl } from "@/content/head";
import { destination } from "@/content/render";
import type { SiteSettings } from "@/content/types";
import { setRevealEnabled } from "@/lib/page-transition";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

/* `twitter:card: summary_large_image` was already declared with no image to
 * go with it, so every shared link rendered as a bare text card.
 *
 * A dedicated 1200x630 crop in public/, not the hero asset: social cards want
 * 1.91:1, and JPEG rather than WebP because crawler support for WebP cards is
 * still uneven. It is served from the site's own origin — the Lovable asset
 * CDN the images used to come from sends `x-robots-tag: noindex, nofollow`,
 * which is not what you want on a card image. */
const OG_IMAGE = "/og-durall.jpg";
const OG_IMAGE_ALT = "Parikrama House, Murud — a Durall aluminium envelope framed by palms";

/* Space Grotesk and Inter are the two faces used above the fold; both are
 * variable fonts, so one file each covers every weight the site asks for.
 * EB Garamond is deliberately left out — it only appears further down the
 * page and does not belong on the critical path. */
const CRITICAL_FONTS = [
  "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2",
  "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2",
];

/* Runs synchronously in <head>, before first paint.
 *
 * On every full page load (a refresh or an opened link, never a client-side
 * navigation, since this script only runs with the document) it also adds
 * `intro-pending`, which shows the SiteIntro curtain from the very first
 * paint, and notes that moment in `__introAt`: SiteIntro times the curtain
 * from it, not from navigation start, which on the live site can be a
 * couple of seconds of server response earlier. Its own timeout is the
 * safety net for a bundle that never arrives: at 4.5s the curtain fades
 * out (`intro-bailout`) regardless. SiteIntro clears that timer when it
 * mounts and takes over.
 *
 * Marks the document as
 * "entrance animations are about to run" so the CSS in styles.css can hide
 * the elements GSAP is going to animate in — but only when JavaScript is
 * actually running and the reader has not asked for reduced motion. While
 * the curtain is closed (`intro-covered`) nothing needs hiding, so the hero
 * is painted underneath it straight away rather than after the doors part:
 * that first paint is what the browser reports as the page's LCP. It waits
 * (`fonts-pending`, 1.2s at most) for the two faces used above the fold,
 * which this script can ask for because it sits after the stylesheet that
 * declares them: text first drawn in a fallback wraps differently, and the
 * swap moved the hero and everything under it. The
 * timeout is the safety net: if the GSAP import is blocked, slow or fails,
 * the page reveals itself rather than staying blank. `lib/anim.ts` clears
 * the class as soon as the real tweens have taken over. */
const animBootstrap = (loadingScreen: boolean) => `(function(){try{
if(location.pathname.indexOf("/admin")===0)return;
if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var d=document.documentElement;d.classList.add("anim-pending");
${loadingScreen ? `d.classList.add("intro-pending","intro-covered","fonts-pending");var f=function(){d.classList.remove("fonts-pending")};setTimeout(f,1200);try{Promise.all([document.fonts.load('500 1em "Space Grotesk"'),document.fonts.load("1em Inter")]).then(f,f)}catch(e){f()}window.__introAt=performance.now();window.__introSafety=setTimeout(function(){d.classList.remove("intro-covered");d.classList.add("intro-bailout");setTimeout(function(){d.classList.remove("intro-pending","intro-bailout")},400)},4500);` : ""}
setTimeout(function(){d.classList.remove("anim-pending")},5000);
}catch(e){}})();`;

/* The root loader's settings, where a component outside the normal render
 * (the 404 page) needs them and they may not have loaded. */
function useSettings() {
  return useRouterState({
    select: (s) =>
      (
        s.matches.find((m) => m.routeId === "__root__")?.loaderData as
          { settings?: SiteSettings } | undefined
      )?.settings,
  });
}

function NotFoundComponent() {
  const settings = useSettings();
  const copy = settings?.notFound;
  return (
    <div className="relative bg-navy font-body text-white">
      {/* React lifts these into <head>: the root route has no title of its
          own, and a missing page should not be indexed. */}
      <title>Page not found — Durall Systems</title>
      <meta name="robots" content="noindex" />
      {/* The same header and footer as every other page, so a wrong address
          is not a dead end. They need the root loader's settings. */}
      {settings ? <SiteHeader /> : null}
      <main
        id="main"
        tabIndex={-1}
        className="flex min-h-[100svh] items-center pt-[var(--header-h)]"
      >
        <div className="shell py-[clamp(4rem,10vw,8rem)]">
          <p className="font-display text-xs font-bold tracking-eyebrow text-white/60 uppercase">
            Error 404
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,6.25vw,6rem)] leading-[0.98] font-medium tracking-[-0.02em] text-balance">
            {copy?.heading ?? "Page not found"}
          </h1>
          <p className="mt-6 max-w-[32rem] font-display text-[clamp(1rem,1.04vw,1.25rem)] leading-[1.6] text-pretty text-white/75">
            {copy?.body ?? "The page you're looking for doesn't exist or has been moved."}
          </p>
          <div className="mt-10">
            <CtaButton {...destination("/")} variant="inverted">
              {copy?.action ?? "Go home"}
            </CtaButton>
          </div>
        </div>
      </main>
      {settings ? <DurallFooter /> : null}
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Settings and shared sections (header, footer, process, enquiry form).
  // They change rarely; a page change does not need to ask for them again.
  loader: () => fetchSite(),
  staleTime: 5 * 60_000,
  head: ({ loaderData, matches }) => {
    const shareImage = absoluteUrl(loaderData?.settings.seo.shareImage || OG_IMAGE);
    // The page's own address without its query string: a filtered list
    // (?topic=…, ?team=…) is the same page to a search engine.
    const canonical = absoluteUrl(matches[matches.length - 1]?.pathname ?? "/");
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: "Durall" },
        { property: "og:site_name", content: loaderData?.settings.company.name || "Durall" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: shareImage },
        {
          property: "og:image:alt",
          content: loaderData?.settings.seo.shareImageAlt || OG_IMAGE_ALT,
        },
        { name: "twitter:image", content: shareImage },
        // Matches the navy hero so mobile browser chrome doesn't flash white.
        { name: "theme-color", content: "#050834" },
      ],
      links: [
        { rel: "canonical", href: canonical },
        {
          rel: "stylesheet",
          href: appCss,
        },
        // The Durall mark: the .ico for browsers without SVG icons, the SVG
        // for crisp tabs everywhere else, and a full-bleed tile for iOS.
        { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        // The two faces used above the fold, fetched before the stylesheet
        // that declares them (theme.css) has been parsed.
        ...CRITICAL_FONTS.map((href) => ({
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href,
          crossOrigin: "anonymous" as const,
        })),
      ],
      scripts: [
        { children: animBootstrap(loaderData?.settings.behaviour.loadingScreen !== false) },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/**
 * Photographs on the public site are not for taking: no dragging one out of
 * the page, and no context menu (so no "save image as" or "open image in new
 * tab") on a photograph, a film or an element painted with one. Links,
 * buttons, text selection and form fields are untouched. With the CSS beside
 * `img` in styles.css this covers every image at once, including ones that
 * arrive later from stored content. A deterrent, not a lock: a screenshot
 * still works.
 */
function guardImages() {
  const media = (target: EventTarget | null) =>
    target instanceof Element ? target.closest("img, picture, video") : null;
  const painted = (target: EventTarget | null) =>
    target instanceof Element && getComputedStyle(target).backgroundImage.includes("url(");
  // A link wrapped round a photograph drags the photograph with it.
  const linkedMedia = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest("a")?.querySelector("img, video"));

  const onDragStart = (event: DragEvent) => {
    if (media(event.target) || painted(event.target) || linkedMedia(event.target))
      event.preventDefault();
  };
  const onContextMenu = (event: MouseEvent) => {
    if (media(event.target) || painted(event.target)) event.preventDefault();
  };
  document.addEventListener("dragstart", onDragStart);
  document.addEventListener("contextmenu", onContextMenu);
  return () => {
    document.removeEventListener("dragstart", onDragStart);
    document.removeEventListener("contextmenu", onContextMenu);
  };
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    // The bootstrap script adds `anim-pending` to <html> before React hydrates, so
    // the class is legitimately absent from the server markup and present in
    // the DOM. This is the one attribute that differs, by design.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // The admin panel is an application, not a page: none of the site's
  // opening curtain, smooth scrolling or page transitions belong in it.
  const inAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });
  const { behaviour } = Route.useLoaderData().settings;
  useEffect(() => setRevealEnabled(behaviour.pageTransition), [behaviour.pageTransition]);
  useEffect(() => (inAdmin ? undefined : guardImages()), [inAdmin]);

  if (inAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:inline-flex focus-visible:items-center focus-visible:rounded-md focus-visible:bg-navy focus-visible:px-4 focus-visible:py-3 focus-visible:font-display focus-visible:text-xs focus-visible:font-bold focus-visible:tracking-eyebrow focus-visible:text-white focus-visible:uppercase"
      >
        Skip to Content
      </a>
      <SmoothScroll />
      <PageTransition />
      {behaviour.loadingScreen ? <SiteIntro /> : null}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
