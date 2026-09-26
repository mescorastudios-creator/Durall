import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { SiteIntro } from "@/components/SiteIntro";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { fetchSite } from "@/content/api";
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
 * which is not what you want on a card image.
 *
 * Still relative to the deployed origin: make it absolute once the production
 * domain is fixed, since a few crawlers refuse to resolve a relative one. */
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
 * paint. Its own timeout is the safety net for a bundle that never arrives:
 * the curtain is dropped at 4.5s regardless. SiteIntro clears that timer
 * when it mounts and takes over.
 *
 * Marks the document as
 * "entrance animations are about to run" so the CSS in styles.css can hide
 * the elements GSAP is going to animate in — but only when JavaScript is
 * actually running and the reader has not asked for reduced motion. The
 * timeout is the safety net: if the GSAP import is blocked, slow or fails,
 * the page reveals itself rather than staying blank. `lib/anim.ts` clears
 * the class as soon as the real tweens have taken over. */
const animBootstrap = (loadingScreen: boolean) => `(function(){try{
if(location.pathname.indexOf("/admin")===0)return;
if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var d=document.documentElement;d.classList.add("anim-pending");
${loadingScreen ? `d.classList.add("intro-pending");window.__introSafety=setTimeout(function(){d.classList.remove("intro-pending")},4500);` : ""}
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
  const copy = useSettings()?.notFound;
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {copy?.heading ?? "Page not found"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {copy?.body ?? "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copy?.action ?? "Go home"}
          </Link>
        </div>
      </div>
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
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Durall" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: loaderData?.settings.seo.shareImage || OG_IMAGE },
      {
        property: "og:image:alt",
        content: loaderData?.settings.seo.shareImageAlt || OG_IMAGE_ALT,
      },
      { name: "twitter:image", content: loaderData?.settings.seo.shareImage || OG_IMAGE },
      // Matches the navy hero so mobile browser chrome doesn't flash white.
      { name: "theme-color", content: "#050834" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // The Durall mark: the .ico for browsers without SVG icons, the SVG
      // for crisp tabs everywhere else, and a full-bleed tile for iOS.
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // The two faces used above the fold, fetched in parallel with the
      // Google Fonts stylesheet instead of waiting for it to parse.
      ...CRITICAL_FONTS.map((href) => ({
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href,
        crossOrigin: "anonymous" as const,
      })),
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Inter:wght@300;400;500;600&family=EB+Garamond:wght@400;500&family=Newsreader:opsz,wght@6..72,350&display=swap",
      },
    ],
    scripts: [{ children: animBootstrap(loaderData?.settings.behaviour.loadingScreen !== false) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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
