import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useHeroIntro, c as useReveal, i as useClipReveal, l as useSplitLines, o as useParallax } from "./anim-BIreCG3R.mjs";
import { t as IMAGES } from "./images-DAzp0ysB.mjs";
import { a as Interactive, i as DurallFooter, o as SiteHeader, r as CtaButton, s as UnderlineLink } from "./DurallFooter-CgBY-amo.mjs";
import { t as Contact } from "./Contact-ITwGI-WW.mjs";
import { d as Crosshair, f as Cpu, i as Share2, l as Layers, n as Users, o as Network, p as ChartColumn, r as ShieldCheck, t as Wind, u as Droplet } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CQi2EP4i.js
var import_jsx_runtime = require_jsx_runtime();
function AboutHero() {
	const { sectionRef, headingRef, imageRef } = useHeroIntro();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: sectionRef,
		id: "top",
		className: "relative flex min-h-[100svh] items-center overflow-hidden bg-navy pt-[max(calc(var(--header-h)+1.5rem),clamp(6rem,12vw,9rem))] pb-[clamp(6rem,12vw,9rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: imageRef,
				...IMAGES.heroParikrama,
				alt: "A Durall aluminium envelope framed by palms at Parikrama House, Murud",
				sizes: "100vw",
				fetchPriority: "high",
				decoding: "async",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "absolute inset-0 bg-navy/55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "absolute inset-0 bg-linear-to-t from-navy/80 to-navy/20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "absolute inset-x-0 top-0 h-[40%] bg-linear-to-b from-navy/60 to-transparent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shell relative grid w-full grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-hero-fade": true,
							className: "font-display text-[0.6875rem] font-bold tracking-eyebrow text-white/70 uppercase",
							children: "01 — About Durall"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							ref: headingRef,
							"data-anim-hide": true,
							className: "mt-[clamp(1rem,2vw,1.5rem)] max-w-[14ch] font-display text-[clamp(2.5rem,5.2vw,5.5rem)] leading-[1.02] font-medium tracking-hero text-balance text-white",
							children: "Engineering what architecture demands."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-hero-fade": true,
							className: "mt-[clamp(1.5rem,2.6vw,2rem)] max-w-[26rem] font-body text-[clamp(0.875rem,1.05vw,0.9375rem)] leading-relaxed text-pretty text-white/72",
							children: "Durall brings architecture, engineering and precision fabrication together to create aluminium systems shaped around the demands of each project."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-hero-fade": true,
							className: "mt-[clamp(1.75rem,3vw,2.25rem)] flex flex-wrap gap-3.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaButton, {
								href: "/#projects",
								children: "Explore Our Work"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-hero-fade": true,
							className: "mt-[clamp(1.75rem,3vw,2.25rem)] font-display text-[0.625rem] font-bold tracking-eyebrow text-white/45 uppercase",
							children: "03 — Architectural Datum / 01"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-hero-fade": true,
					className: "relative min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid grid-cols-2 overflow-hidden rounded-3xl shadow-2xl shadow-navy/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								...IMAGES.aboutPlateLeft,
								alt: "Balcony detail of a Durall-glazed residence",
								decoding: "async",
								className: "h-full w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								...IMAGES.aboutPlateRight,
								alt: "Aerial view of the same residence within its palm canopy",
								decoding: "async",
								className: "h-full w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "absolute bottom-[6%] left-[4%] flex items-center gap-2 rounded-md bg-navy/75 px-3 py-2 font-display text-[0.625rem] font-bold tracking-eyebrow text-white uppercase backdrop-blur-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 16 16",
									fill: "none",
									"aria-hidden": "true",
									className: "h-3 w-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M8 2 14.5 5.4 8 8.8 1.5 5.4 8 2Z",
										stroke: "currentColor",
										strokeWidth: "1.2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M1.5 9.2 8 12.6l6.5-3.4",
										stroke: "currentColor",
										strokeWidth: "1.2"
									})]
								}), "System Detail / 01"]
							})
						]
					})
				})]
			})
		]
	});
}
var FEATURES = [
	{
		icon: Crosshair,
		title: "Precision",
		body: "Engineered tolerances ensure seamless performance."
	},
	{
		icon: Layers,
		title: "Materiality",
		body: "Curated aluminium systems for strength, longevity and beauty."
	},
	{
		icon: ShieldCheck,
		title: "Integrity",
		body: "Every connection is designed to last in real conditions."
	}
];
function AboutPhilosophy() {
	const copyRef = useReveal({
		selector: "[data-reveal]",
		y: 28
	});
	const listRef = useReveal({
		selector: "li",
		y: 24
	});
	const frameRef = useReveal({
		y: 48,
		duration: 1.1
	});
	const headingRef = useSplitLines();
	const clipRef = useClipReveal();
	const imageRef = useParallax(8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "philosophy",
		className: "bg-white pt-[clamp(4rem,8vw,9rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell grid grid-cols-1 gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,1.15fr)_1px_minmax(0,0.75fr)_minmax(0,1.2fr)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: copyRef,
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							ref: headingRef,
							className: "font-display text-[clamp(2rem,3.3vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-balance text-navy",
							children: "Luxury is never applied. It is engineered."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-reveal": true,
							className: "mt-[clamp(1.5rem,2.4vw,2rem)] max-w-[30rem] font-body text-[clamp(0.8125rem,0.95vw,0.875rem)] leading-[1.75] text-slate",
							children: "Durall works alongside architects and developers long before a building becomes visible. Design intent, engineering tolerance and material performance are resolved together, before the first extrusion is cut."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-reveal": true,
							className: "mt-5 max-w-[30rem] font-body text-[clamp(0.8125rem,0.95vw,0.875rem)] leading-[1.75] font-bold text-navy",
							children: "The visible result is only the final expression of decisions made long before."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-reveal": true,
							className: "mt-[clamp(2rem,3vw,2.5rem)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnderlineLink, {
								href: "#approach",
								children: "Our Approach"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					className: "hidden w-px bg-navy-14 lg:block"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					ref: listRef,
					className: "min-w-0 space-y-[clamp(1.75rem,2.6vw,2.25rem)] lg:pt-6",
					children: FEATURES.map(({ icon: Icon, title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex min-w-0 items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-navy-14 bg-paper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								"aria-hidden": "true",
								className: "h-3.5 w-3.5 text-navy",
								strokeWidth: 1.5
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-[0.6875rem] font-bold tracking-eyebrow text-navy uppercase",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-body text-[0.75rem] leading-snug text-slate",
								children: body
							})]
						})]
					}, title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: frameRef,
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: clipRef,
						className: "relative aspect-[1023/840] w-full overflow-hidden rounded-3xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							ref: imageRef,
							...IMAGES.aboutVilla,
							alt: "A contemporary villa wrapped in full-height Durall glazing",
							sizes: "(min-width: 64rem) 34vw, 100vw",
							loading: "lazy",
							decoding: "async",
							className: "h-[110%] w-full object-cover"
						})
					})
				})
			]
		})
	});
}
var METRICS = [
	{
		icon: Wind,
		label: "Air Tightness",
		value: "Class 4"
	},
	{
		icon: Droplet,
		label: "Water Tightness",
		value: "E1200"
	},
	{
		icon: Cpu,
		label: "Wind Load Resistance",
		value: "Up to 4.0 kPa"
	}
];
function SystemSpec() {
	const wrapRef = useReveal({
		y: 36,
		duration: 1
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white pt-[clamp(2.5rem,5vw,4.5rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: wrapRef,
			className: "shell",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "m-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl border border-navy-14 p-6 md:grid-cols-2 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1.1fr)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								...IMAGES.aboutProfile,
								alt: "Cutaway of a Durall aluminium profile",
								loading: "lazy",
								decoding: "async",
								className: "w-full object-contain"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-baseline gap-1.5 font-display text-[clamp(2.25rem,3.4vw,3rem)] leading-none font-medium text-navy",
									children: ["16", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-sm font-bold text-navy",
										children: "MM"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase",
									children: "Glass thickness"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-[10rem] font-body text-xs leading-snug text-slate",
									children: "Optimised for structural performance and acoustic comfort."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								...IMAGES.aboutSectionDrawing,
								alt: "Technical section drawing of the glazing system",
								loading: "lazy",
								decoding: "async",
								className: "w-full object-contain"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "min-w-0 xl:border-l xl:border-navy-14 xl:pl-8",
							children: METRICS.map(({ icon: Icon, label, value }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-center justify-between gap-4 py-2.5 ${index < METRICS.length - 1 ? "border-b border-navy-14" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "flex min-w-0 items-center gap-2 font-display text-[0.625rem] font-bold tracking-eyebrow text-navy uppercase",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										"aria-hidden": "true",
										className: "h-3.5 w-3.5 shrink-0",
										strokeWidth: 1.5
									}), label]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "shrink-0 font-body text-xs font-bold text-navy",
									children: value
								})]
							}, label))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "mt-3 flex flex-wrap items-center justify-between gap-3 px-4 font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profile / Material / Performance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "D/S — Engineered to Endure" })]
				})]
			})
		})
	});
}
function MeetsEngineering() {
	const copyRef = useReveal({
		selector: "[data-reveal]",
		y: 28
	});
	const frameRef = useReveal({
		y: 48,
		duration: 1.1
	});
	const headingRef = useSplitLines();
	const clipRef = useClipReveal();
	const imageRef = useParallax(8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white py-[clamp(4rem,8vw,9rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell grid grid-cols-1 items-center gap-[clamp(2.5rem,4vw,3rem)] xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: copyRef,
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						ref: headingRef,
						className: "font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.11] font-medium tracking-tight text-balance text-navy",
						children: "Where architecture meets engineering."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						"aria-hidden": "true",
						"data-reveal": true,
						className: "mt-[clamp(1.5rem,2.4vw,2rem)] flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-px w-[7.5rem] bg-accent-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-1.5 w-1.5 bg-accent-blue" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-[clamp(1.5rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.875rem)] leading-relaxed text-slate",
						children: "Durall operates at the intersection of architectural intent and technical execution."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-5 max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.875rem)] leading-[1.57] text-slate",
						children: "We coordinate systems, materials and specialist partners to deliver solutions that perform as designed — beautifully, efficiently and for the long term."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: frameRef,
				className: "min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: clipRef,
					className: "relative aspect-[820/480] w-full overflow-hidden rounded-3xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						ref: imageRef,
						...IMAGES.aboutLake,
						alt: "An infinity terrace framed by Durall sliding systems above the water",
						sizes: "(min-width: 80rem) 58vw, 100vw",
						loading: "lazy",
						decoding: "async",
						className: "h-[110%] w-full object-cover"
					})
				})
			})]
		})
	});
}
var CAPABILITIES = [
	{
		icon: Network,
		title: "Architectural Intent",
		body: "Design vision and performance goals"
	},
	{
		icon: Share2,
		title: "System Partners",
		body: "Carefully selected international partners"
	},
	{
		icon: ChartColumn,
		title: "Materials & Finishes",
		body: "Quality, durability and aesthetic fit"
	},
	{
		icon: Users,
		title: "Specialist Expertise",
		body: "Engineering, detailing and project coordination"
	}
];
function OurApproach() {
	const copyRef = useReveal({
		selector: "[data-reveal]",
		y: 26
	});
	const listRef = useReveal({
		selector: "li",
		y: 22
	});
	const markRef = useReveal({
		y: 34,
		duration: 1
	});
	const outcomeRef = useReveal({
		y: 30,
		duration: 1
	});
	const headingRef = useSplitLines();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "approach",
		className: "bg-white pb-[clamp(4rem,8vw,9rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell grid grid-cols-1 items-center gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-2 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,0.7fr)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: copyRef,
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-reveal": true,
							className: "font-display text-[clamp(0.9375rem,1.3vw,1.25rem)] font-bold tracking-eyebrow text-accent-blue uppercase",
							children: "Our Approach"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							ref: headingRef,
							className: "mt-4 font-display text-[clamp(1.5rem,2.1vw,1.75rem)] leading-tight font-medium tracking-tight text-navy",
							children: "Intelligence that brings it all together."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							"aria-hidden": "true",
							"data-reveal": true,
							className: "mt-8 flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-px w-20 bg-accent-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-1 w-1 bg-accent-blue" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-reveal": true,
							className: "mt-7 max-w-[17.5rem] font-body text-xs leading-normal text-slate",
							children: "We don’t manufacture every component. We ensure the right systems, materials and expertise come together in perfect balance."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					ref: listRef,
					className: "min-w-0 space-y-7",
					children: CAPABILITIES.map(({ icon: Icon, title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Interactive, {
						as: "li",
						lift: -2,
						scale: 1.01,
						className: "flex min-w-0 items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-14 bg-paper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								"aria-hidden": "true",
								className: "h-5 w-5 text-navy",
								strokeWidth: 1.4
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-body text-xs leading-snug text-slate",
								children: body
							})]
						})]
					}, title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: markRef,
					className: "relative flex min-w-0 items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 120 240",
						fill: "none",
						"aria-hidden": "true",
						className: "absolute top-1/2 -left-[6.5rem] hidden h-[15rem] w-[7.5rem] -translate-y-1/2 xl:block",
						children: [
							18,
							86,
							154,
							222
						].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: `M0 ${y} H60 Q78 ${y} 78 120 H120`,
							stroke: "var(--color-navy-14)",
							strokeWidth: "1"
						}, y))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex aspect-square w-full max-w-[17.5rem] items-center justify-center rounded-[30%] border border-navy/45",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-square w-[78%] items-center justify-center rounded-[30%] border border-navy/45",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								...IMAGES.aboutDurallMark,
								alt: "Durall Systems",
								loading: "lazy",
								decoding: "async",
								className: "w-[70%] object-contain"
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: outcomeRef,
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							...IMAGES.aboutLineHouse,
							alt: "Line drawing of a completed Durall-glazed pavilion",
							loading: "lazy",
							decoding: "async",
							className: "w-full object-contain"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
							children: "Architecture Realized"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-[11.25rem] font-body text-xs leading-normal text-slate",
							children: "Seamless integration that performs beautifully and stands the test of time."
						})
					]
				})
			]
		})
	});
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative bg-white font-body text-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				tabIndex: -1,
				className: "scroll-mt-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutHero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutPhilosophy, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemSpec, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeetsEngineering, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OurApproach, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurallFooter, {})
		]
	});
}
//#endregion
export { About as component };
