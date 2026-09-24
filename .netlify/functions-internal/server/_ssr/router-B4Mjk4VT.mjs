import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as loadGsap, r as prefersReducedMotion, t as REDUCED_QUERY } from "./anim-BIreCG3R.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SORTS, t as CATEGORIES } from "./data-C7-ErtLf.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B4Mjk4VT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Site-wide Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger
* stays in sync. Disabled entirely for prefers-reduced-motion (native scroll).
*
* Mounted once from the root route: it used to be rendered by each page,
* which tore Lenis down and rebuilt it on every navigation and briefly ran
* two instances at once while the routes swapped.
*/
function SmoothScroll() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const settleRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		(async () => {
			const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import("../_libs/lenis.mjs").then((n) => n.t), loadGsap()]);
			if (cancelled) return;
			const lenis = new Lenis({
				duration: 1.6,
				smoothWheel: true,
				wheelMultiplier: .85,
				easing: (t) => 1 - Math.pow(1 - t, 3.2)
			});
			const update = () => ScrollTrigger.update();
			lenis.on("scroll", update);
			const raf = (time) => lenis.raf(time * 1e3);
			gsap.ticker.add(raf);
			gsap.ticker.lagSmoothing(0);
			let resizeTimer;
			const refreshLayout = () => {
				if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(() => {
					lenis.resize();
					requestAnimationFrame(() => ScrollTrigger.refresh());
				}, 175);
			};
			window.addEventListener("resize", refreshLayout, { passive: true });
			window.visualViewport?.addEventListener("resize", refreshLayout, { passive: true });
			settleRef.current = () => {
				if (cancelled) return;
				lenis.resize();
				ScrollTrigger.refresh();
			};
			settleRef.current();
			document.fonts?.ready.then(() => settleRef.current?.());
			const motionQuery = window.matchMedia(REDUCED_QUERY);
			const onMotionChange = () => {
				if (!motionQuery.matches) return;
				ScrollTrigger.getAll().forEach((trigger) => {
					trigger.animation?.progress(1);
					trigger.kill();
				});
				document.documentElement.classList.remove("anim-pending");
				dispose();
			};
			motionQuery.addEventListener("change", onMotionChange);
			dispose = () => {
				if (resizeTimer) clearTimeout(resizeTimer);
				motionQuery.removeEventListener("change", onMotionChange);
				window.removeEventListener("resize", refreshLayout);
				window.visualViewport?.removeEventListener("resize", refreshLayout);
				gsap.ticker.remove(raf);
				gsap.ticker.lagSmoothing(500, 33);
				lenis.off("scroll", update);
				lenis.destroy();
				settleRef.current = null;
			};
		})();
		return () => {
			cancelled = true;
			dispose();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const id = requestAnimationFrame(() => requestAnimationFrame(() => settleRef.current?.()));
		return () => cancelAnimationFrame(id);
	}, [pathname]);
	return null;
}
var styles_default = "/assets/styles-GrwDmqN_.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var OG_IMAGE = "/og-durall.jpg";
var OG_IMAGE_ALT = "Parikrama House, Murud — a Durall aluminium envelope framed by palms";
var CRITICAL_FONTS = ["https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2", "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2"];
var ANIM_BOOTSTRAP = `(function(){try{
if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var d=document.documentElement;d.classList.add("anim-pending");
setTimeout(function(){d.classList.remove("anim-pending")},2500);
}catch(e){}})();`;
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "author",
				content: "Durall"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:image",
				content: OG_IMAGE
			},
			{
				property: "og:image:alt",
				content: OG_IMAGE_ALT
			},
			{
				name: "twitter:image",
				content: OG_IMAGE
			},
			{
				name: "theme-color",
				content: "#050834"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			...CRITICAL_FONTS.map((href) => ({
				rel: "preload",
				as: "font",
				type: "font/woff2",
				href,
				crossOrigin: "anonymous"
			})),
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Inter:wght@300;400;500;600&family=EB+Garamond:wght@400;500&display=swap"
			}
		],
		scripts: [{ children: ANIM_BOOTSTRAP }]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:inline-flex focus-visible:items-center focus-visible:rounded-md focus-visible:bg-navy focus-visible:px-4 focus-visible:py-3 focus-visible:font-display focus-visible:text-xs focus-visible:font-bold focus-visible:tracking-eyebrow focus-visible:text-white focus-visible:uppercase",
				children: "Skip to Content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmoothScroll, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		]
	});
}
var $$splitComponentImporter$4 = () => import("./routes-Cbp5TzST.mjs");
var TITLE$4 = "Durall — Engineering Spaces Without Boundaries";
var DESCRIPTION$4 = "Premium aluminium systems for windows, doors, façades and architectural applications — designed, engineered, fabricated and installed as one continuous discipline.";
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: TITLE$4 },
		{
			name: "description",
			content: DESCRIPTION$4
		},
		{
			property: "og:title",
			content: TITLE$4
		},
		{
			property: "og:description",
			content: DESCRIPTION$4
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./about-CQi2EP4i.mjs");
var TITLE$3 = "About Durall — Engineering What Architecture Demands";
var DESCRIPTION$3 = "Durall brings architecture, engineering and precision fabrication together — coordinating systems, materials and specialist partners into aluminium envelopes built to endure.";
var Route$3 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: TITLE$3 },
		{
			name: "description",
			content: DESCRIPTION$3
		},
		{
			property: "og:title",
			content: TITLE$3
		},
		{
			property: "og:description",
			content: DESCRIPTION$3
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./contact-5ur9tj9I.mjs");
var TITLE$2 = "Contact Durall — Start a Conversation";
var DESCRIPTION$2 = "Talk to Durall's engineering team about aluminium windows, doors, façades and architectural systems — send an enquiry or reach us directly.";
var Route$2 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: TITLE$2 },
		{
			name: "description",
			content: DESCRIPTION$2
		},
		{
			property: "og:title",
			content: TITLE$2
		},
		{
			property: "og:description",
			content: DESCRIPTION$2
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./partners-DGEJ7Kzj.mjs");
var TITLE$1 = "Partners & International Systems — Durall Systems";
var DESCRIPTION$1 = "Durall Systems partners with specialists across Europe, Asia and the Americas — minimal windows, glass railings, security mesh, insect screens and indoor climate — delivered with local precision in India.";
var Route$1 = createFileRoute("/partners")({
	head: () => ({ meta: [
		{ title: TITLE$1 },
		{
			name: "description",
			content: DESCRIPTION$1
		},
		{
			property: "og:title",
			content: TITLE$1
		},
		{
			property: "og:description",
			content: DESCRIPTION$1
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./projects-BbAUli9z.mjs");
var TITLE = "Projects — Durall Systems Portfolio of Built Work";
var DESCRIPTION = "Residences, resorts and landmarks where Durall’s aluminium systems became the architecture's most exacting details — from Parikrama in Murud to Patina in the Maldives.";
var Route = createFileRoute("/projects")({
	validateSearch: (search) => {
		const category = String(search["category"] ?? "");
		const sort = String(search["sort"] ?? "");
		const validCategory = CATEGORIES.includes(category) && category !== "All";
		const validSort = SORTS.some((s) => s.key === sort) && sort !== "featured";
		return {
			...validCategory ? { category } : {},
			...validSort ? { sort } : {}
		};
	},
	head: () => ({ meta: [
		{ title: TITLE },
		{
			name: "description",
			content: DESCRIPTION
		},
		{
			property: "og:title",
			content: TITLE
		},
		{
			property: "og:description",
			content: DESCRIPTION
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	AboutRoute: Route$3.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$5
	}),
	ContactRoute: Route$2.update({
		id: "/contact",
		path: "/contact",
		getParentRoute: () => Route$5
	}),
	PartnersRoute: Route$1.update({
		id: "/partners",
		path: "/partners",
		getParentRoute: () => Route$5
	}),
	ProjectsRoute: Route.update({
		id: "/projects",
		path: "/projects",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
