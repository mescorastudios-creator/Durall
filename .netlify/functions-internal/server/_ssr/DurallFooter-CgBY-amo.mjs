import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DurallFooter-CgBY-amo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		label: "Projects",
		to: "/projects"
	},
	{
		label: "Systems",
		to: "/",
		hash: "philosophy"
	},
	{
		label: "Expertise",
		to: "/",
		hash: "process"
	},
	{
		label: "About",
		to: "/about"
	},
	{
		label: "Partners",
		to: "/partners"
	},
	{
		label: "Insights",
		to: "/",
		hash: "insights"
	},
	{
		label: "Contact",
		to: "/contact"
	}
];
function SiteHeader({ variant = "dark" }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const light = variant === "light";
	const headerRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const el = headerRef.current;
		if (!el) return;
		const publish = () => document.documentElement.style.setProperty("--header-h", `${Math.round(el.getBoundingClientRect().height)}px`);
		publish();
		const ro = new ResizeObserver(publish);
		ro.observe(el);
		document.fonts?.ready.then(publish);
		return () => ro.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		ref: headerRef,
		"data-hero-bar": true,
		className: `absolute inset-x-0 top-0 z-50 ${light ? "border-b border-navy/10 bg-white/95 backdrop-blur-sm" : "bg-transparent"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-2 lg:flex lg:gap-y-0 lg:py-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: `flex min-h-11 shrink-0 items-center gap-2.5 font-display text-[clamp(1rem,1.3vw,1.125rem)] font-bold tracking-[0.1875rem] uppercase transition-opacity hover:opacity-80 ${light ? "text-navy" : "text-white"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					"aria-hidden": "true",
					className: `h-5 w-5 ${light ? "text-navy" : "text-white"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M4 4h7a8 8 0 0 1 0 16H4V4Z",
						stroke: "currentColor",
						strokeWidth: "1.4",
						strokeLinejoin: "round"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M14 12h7",
						stroke: "currentColor",
						strokeWidth: "1.4"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					translate: "no",
					children: "Durall Systems"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Primary",
				className: "col-span-2 min-w-0 lg:col-span-1 lg:ml-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap items-center justify-start gap-x-[clamp(0.75rem,1.6vw,1.75rem)] lg:justify-end",
					children: ITEMS.map((item) => {
						const hash = "hash" in item ? item.hash : void 0;
						const active = !hash && pathname === item.to;
						const activeClass = light ? "text-navy" : "text-white";
						const idleClass = light ? "text-navy/65 hover:text-navy" : "text-white/65 hover:text-white";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							...hash ? { hash } : {},
							className: `group flex min-h-11 items-center font-display text-[clamp(0.6875rem,0.85vw,0.75rem)] font-bold tracking-eyebrow uppercase transition-colors motion-safe:transition-[color,transform] ${active ? activeClass : idleClass} motion-safe:hover:-translate-y-0.5`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `border-b pb-1 ${active ? "border-current" : "border-transparent"}`,
								children: item.label
							})
						}) }, item.label);
					})
				})
			})]
		})
	});
}
function ArrowRight({ className = "h-3.5 w-3.5" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": "true",
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 8h11M9.5 4l4 4-4 4",
			stroke: "currentColor",
			strokeWidth: "1.2"
		})
	});
}
function ArrowLeft({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": "true",
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M13.5 8h-11M6.5 4l-4 4 4 4",
			stroke: "currentColor",
			strokeWidth: "1.2"
		})
	});
}
/**
* Hover/tap micro-interaction wrapper that respects reduced motion.
*
* This was a `motion.*` element, which meant every card on every page dragged
* motion/react onto the critical path for what is a hover nudge. The movement
* is identical, but it now runs as a compositor-only CSS transition — and it
* takes /partners, whose only other motion usage this was, off that dependency
* entirely. The per-instance distances travel as custom properties because
* Tailwind cannot generate utilities for values computed at runtime.
*/
function Interactive({ children, className, lift = -3, scale = 1.02, as = "div", ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(as, {
		...rest,
		className: "min-w-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `interactive h-full ${className ?? ""}`,
			style: {
				"--lift": `${lift}px`,
				"--scale": scale
			},
			children
		})
	});
}
function CtaButton({ children, variant = "outline", href = "#contact" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href,
		className: "inline-flex min-h-12 items-center gap-2.5 border px-[clamp(1.125rem,2vw,1.625rem)] py-4 font-display text-xs font-bold tracking-button uppercase transition-colors duration-200 motion-safe:transition-[color,background-color,border-color,transform] motion-safe:hover:-translate-y-0.5 " + (variant === "solid" ? "border-navy bg-navy text-white hover:bg-[#0b1152]" : "border-white text-white hover:bg-white/12"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
	});
}
function UnderlineLink({ children, href = "#" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href,
		className: "group inline-flex min-h-11 w-fit items-center gap-3 border-b border-navy-14 pb-1.5 font-display text-xs font-bold tracking-eyebrow text-navy uppercase transition-colors hover:border-navy motion-safe:transition-[color,border-color,transform] motion-safe:hover:translate-x-0.5",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
	});
}
function ViewMore({ href = "#" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href,
		className: "group inline-flex items-stretch gap-1 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex min-h-12 items-center rounded-full bg-mist px-8 py-3 font-body text-sm font-medium text-navy transition-colors group-hover:bg-navy/10",
			children: "View More"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex min-h-12 w-12 items-center justify-center rounded-full bg-navy text-white transition-colors group-hover:bg-[#0b1152]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				className: "h-4 w-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M4 12L12 4M6 4h6v6",
					stroke: "currentColor",
					strokeWidth: "1.2"
				})
			})
		})]
	});
}
var COLUMNS = [
	{
		title: "Company",
		links: [
			{
				label: "About Durall",
				to: "/about"
			},
			{
				label: "Our Legacy",
				to: "/about",
				hash: "philosophy"
			},
			{
				label: "Leadership",
				to: "/about",
				hash: "approach"
			},
			{
				label: "Careers",
				to: "/contact"
			}
		]
	},
	{
		title: "Solutions",
		links: [
			{
				label: "Window Systems",
				to: "/",
				hash: "projects"
			},
			{
				label: "Door Systems",
				to: "/",
				hash: "projects"
			},
			{
				label: "Facade Systems",
				to: "/",
				hash: "projects"
			},
			{
				label: "Technical Performance",
				to: "/",
				hash: "process"
			}
		]
	},
	{
		title: "Resources",
		links: [
			{
				label: "Technical Library",
				to: "/",
				hash: "insights"
			},
			{
				label: "Brochures",
				to: "/",
				hash: "insights"
			},
			{
				label: "Case Studies",
				to: "/",
				hash: "projects"
			},
			{
				label: "Care & Maintenance",
				to: "/",
				hash: "insights"
			}
		]
	},
	{
		title: "Connect",
		links: [
			{
				label: "LinkedIn",
				to: "/contact"
			},
			{
				label: "Instagram",
				to: "/contact"
			},
			{
				label: "YouTube",
				to: "/contact"
			}
		]
	}
];
function DurallFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-navy pt-[clamp(2.5rem,5vw,4.5rem)] pb-[max(2.5rem,env(safe-area-inset-bottom))] text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shell",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-white/18 pt-[clamp(2rem,3.5vw,2.5rem)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-[clamp(1.75rem,3vw,2.5rem)] md:grid-cols-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 min-w-0 md:col-span-3 lg:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							translate: "no",
							className: "font-display text-xl font-bold tracking-[0.125rem] text-white uppercase",
							children: [
								"Durall",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Systems"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-body text-xs text-white/80",
							children: "Engineering architectural possibilities."
						})]
					}), COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": column.title,
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs font-bold tracking-eyebrow text-white uppercase",
							children: column.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-0.5",
							children: column.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: link.to,
								..."hash" in link ? { hash: link.hash } : {},
								className: "-mx-2 flex min-h-11 items-center px-2 font-body text-xs tracking-wide text-white/80 transition-colors hover:text-white motion-safe:transition-[color,transform] motion-safe:hover:translate-x-0.5",
								children: link.label
							}) }, link.label))
						})]
					}, column.title))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-col gap-2 font-body text-[0.6875rem] tracking-wider text-white/60 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex flex-wrap items-center gap-x-2 gap-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" Durall Systems Pvt. Ltd."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "text-white/30",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Privacy Policy" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "text-white/30",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Terms of Use" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Built for architectural precision." })]
				})]
			})
		})
	});
}
//#endregion
export { Interactive as a, ViewMore as c, DurallFooter as i, ArrowRight as n, SiteHeader as o, CtaButton as r, UnderlineLink as s, ArrowLeft as t };
