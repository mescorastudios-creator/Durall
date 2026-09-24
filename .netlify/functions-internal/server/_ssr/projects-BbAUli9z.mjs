import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as useReveal, i as useClipReveal, l as useSplitLines, s as useReducedMotion } from "./anim-BIreCG3R.mjs";
import { _ as useNavigate, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as DurallFooter, n as ArrowRight, o as SiteHeader } from "./DurallFooter-CgBY-amo.mjs";
import { a as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as SORTS, i as PROJECTS, n as FEATURED, r as FEATURED_GALLERY, t as CATEGORIES } from "./data-C7-ErtLf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-BbAUli9z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectsIntro() {
	const ref = useReveal({
		selector: "[data-reveal]",
		y: 26,
		delay: .1
	});
	const headingRef = useSplitLines({
		start: "top 95%",
		delay: .15
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative bg-white pt-[max(calc(var(--header-h)+2rem),clamp(5.5rem,9vw,9.5rem))] pb-[clamp(2rem,3.5vw,3.5rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				ref: headingRef,
				className: "max-w-[60rem] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.06] font-medium tracking-section text-balance text-navy",
				children: "What we’ve built together."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-reveal": true,
					className: "mt-[clamp(1.5rem,2.4vw,2.75rem)] max-w-[27.5rem] font-body text-[clamp(0.9375rem,1.1vw,1rem)] leading-relaxed text-slate",
					children: "A collection of spaces shaped through architecture, engineering and collaboration."
				})
			})]
		})
	});
}
var INTERVAL = 5e3;
function AwardIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 20 24",
		fill: "none",
		"aria-hidden": "true",
		className: "h-5 w-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M10 1.5v9.5l8 4.5M10 11l-8 4.5M10 11v11.5",
			stroke: "currentColor",
			strokeWidth: "1.1"
		})
	});
}
function FeaturedProject() {
	const reduced = useReducedMotion();
	const panelRef = useReveal({
		selector: "[data-reveal]",
		y: 28,
		stagger: .09
	});
	const mediaRef = useClipReveal();
	const [active, setActive] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const total = FEATURED_GALLERY.length;
	const advance = (0, import_react.useCallback)(() => setActive((i) => (i + 1) % total), [total]);
	const timer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (reduced || paused) return;
		timer.current = setInterval(advance, INTERVAL);
		return () => {
			if (timer.current) clearInterval(timer.current);
		};
	}, [
		advance,
		paused,
		reduced
	]);
	const current = FEATURED_GALLERY[active] ?? FEATURED_GALLERY[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative bg-white pb-[clamp(3.5rem,6vw,7.5rem)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			"aria-hidden": "true",
			viewBox: "0 0 1915 187",
			fill: "none",
			preserveAspectRatio: "none",
			className: "pointer-events-none absolute -top-10 left-0 hidden h-[7.5rem] w-full xl:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 186H900L980 1H1915",
				stroke: "var(--color-navy)",
				strokeOpacity: "0.14"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell grid grid-cols-1 items-stretch gap-[clamp(2rem,4vw,3.5rem)] xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: panelRef,
				className: "min-w-0 xl:py-[clamp(2rem,4vw,5rem)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "font-display text-[clamp(0.875rem,1.15vw,1.25rem)] font-bold tracking-[0.125rem] text-accent-blue uppercase",
						children: FEATURED.eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-reveal": true,
						className: "mt-3 h-0.5 w-8 bg-accent-blue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-[clamp(2rem,3.4vw,4.3125rem)] font-display text-[0.75rem] font-bold tracking-[0.09375rem] text-slate uppercase",
						children: FEATURED.location
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						"data-reveal": true,
						className: "mt-3 font-display text-[clamp(1.75rem,2.6vw,2.75rem)] leading-[1.1] font-medium tracking-[-0.0625rem] text-navy",
						children: [
							FEATURED.title[0],
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							FEATURED.title[1]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-5 font-body text-sm font-medium text-slate",
						children: FEATURED.architect
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-reveal": true,
						className: "mt-4 h-px w-8 bg-navy-14"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-[clamp(1.25rem,1.8vw,1.5rem)] max-w-[34rem] font-body text-sm leading-relaxed text-slate",
						children: FEATURED.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						"data-reveal": true,
						className: "mt-[clamp(1.75rem,2.6vw,2.5rem)] grid grid-cols-1 gap-x-[clamp(1.5rem,2.6vw,2.6875rem)] gap-y-6 sm:grid-cols-3 sm:divide-x sm:divide-navy-14",
						children: FEATURED.specs.map((spec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `min-w-0 ${i > 0 ? "sm:pl-[clamp(1rem,1.8vw,1.75rem)]" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase",
								children: spec.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2 font-display text-[clamp(1rem,1.15vw,1.25rem)] leading-tight font-medium whitespace-pre-line text-navy",
								children: spec.value
							})]
						}, spec.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-reveal": true,
						className: "mt-[clamp(1.75rem,2.6vw,2.5rem)] border-t border-navy-14 pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4 text-navy",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 text-navy/70",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AwardIcon, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-body text-xs font-bold text-navy",
								children: FEATURED.award.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-body text-xs text-slate",
								children: FEATURED.award.year
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.a, {
						"data-reveal": true,
						href: "#portfolio",
						className: "relative mt-[clamp(1.75rem,2.6vw,2.5rem)] inline-flex items-center gap-3 border-b border-accent-blue pb-1.5 font-display text-[clamp(0.75rem,0.9vw,1rem)] font-bold tracking-button text-accent-blue uppercase after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']",
						whileHover: reduced ? { opacity: .75 } : { x: 3 },
						transition: {
							type: "spring",
							stiffness: 300,
							damping: 22
						},
						children: ["Explore Project", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: mediaRef,
				className: "relative min-w-0 overflow-hidden bg-mist",
				onMouseEnter: () => setPaused(true),
				onMouseLeave: () => setPaused(false),
				onFocus: () => setPaused(true),
				onBlur: () => setPaused(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-[1153/721] w-full xl:h-full xl:aspect-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						initial: false,
						mode: "sync",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
							...current.image,
							alt: current.alt,
							sizes: "(min-width: 80rem) 55vw, 100vw",
							className: "absolute inset-0 h-full w-full object-cover",
							initial: reduced ? { opacity: 1 } : {
								opacity: 0,
								scale: 1.04
							},
							animate: {
								opacity: 1,
								scale: 1
							},
							exit: reduced ? { opacity: 1 } : { opacity: 0 },
							transition: {
								duration: reduced ? 0 : 1.1,
								ease: [
									.16,
									1,
									.3,
									1
								]
							}
						}, current.image.src)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-[clamp(1rem,2vw,2.25rem)] left-[clamp(1rem,2.5vw,3rem)] flex items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-xs font-bold tracking-[0.0625rem] tabular-nums text-white",
							children: [
								String(active + 1).padStart(2, "0"),
								" / ",
								String(total).padStart(2, "0")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-0.5 w-20 overflow-hidden bg-white/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								className: "h-0.5 bg-white",
								animate: { width: `${(active + 1) / total * 100}%` },
								transition: {
									duration: reduced ? 0 : .6,
									ease: "easeOut"
								}
							})
						}),
						reduced ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPaused((p) => !p),
							"aria-pressed": paused,
							"aria-label": paused ? "Resume the project gallery" : "Pause the project gallery",
							className: "flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20",
							children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 16 16",
								fill: "none",
								"aria-hidden": "true",
								className: "h-3.5 w-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M4 2.5l9 5.5-9 5.5V2.5Z",
									fill: "currentColor"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 16 16",
								fill: "none",
								"aria-hidden": "true",
								className: "h-3.5 w-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M4.5 2.5h2.5v11H4.5zM9 2.5h2.5v11H9z",
									fill: "currentColor"
								})
							})
						})
					]
				})]
			})]
		})]
	});
}
function ArrowUpRight() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 10 10",
		fill: "none",
		"aria-hidden": "true",
		className: "h-2.5 w-2.5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M1.5 8.5L8.5 1.5M3.5 1.5h5v5",
			stroke: "currentColor",
			strokeWidth: "1.2"
		})
	});
}
function ProjectGrid() {
	const reduced = useReducedMotion();
	const barRef = useReveal({
		selector: "[data-reveal]",
		y: 18,
		stagger: .05
	});
	const gridRef = useReveal({
		selector: "[data-card]",
		y: 70,
		stagger: .22,
		start: "top 92%",
		end: "bottom 55%",
		scrub: 1.2
	});
	const { category = "All", sort = "featured" } = useSearch({ from: "/projects" });
	const navigate = useNavigate({ from: "/projects" });
	const [sortOpen, setSortOpen] = (0, import_react.useState)(false);
	const apply = (next) => void navigate({
		search: (prev) => {
			const merged = {
				category,
				sort,
				...prev,
				...next
			};
			return {
				...merged.category === "All" ? {} : { category: merged.category },
				...merged.sort === "featured" ? {} : { sort: merged.sort }
			};
		},
		replace: true,
		resetScroll: false
	});
	const setCategory = (next) => apply({ category: next });
	const setSort = (next) => apply({ sort: next });
	const visible = (0, import_react.useMemo)(() => {
		const sorted = [...category === "All" ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(category))];
		if (sort === "newest") sorted.sort((a, b) => b.year - a.year);
		if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
		return sorted;
	}, [category, sort]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "portfolio",
		className: "bg-white pb-[clamp(3.5rem,6vw,7.5rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: barRef,
					className: "flex flex-col gap-4 border-b border-navy-14 pb-3 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-reveal": true,
						className: "flex min-w-0 flex-wrap gap-x-[clamp(1rem,2vw,2rem)] gap-y-2",
						children: CATEGORIES.map((item) => {
							const active = item === category;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": active,
								onClick: () => setCategory(item),
								className: `relative pb-1 font-display text-xs font-bold tracking-[0.0625rem] uppercase transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] ${active ? "text-navy" : "text-slate hover:text-navy"}`,
								children: [item, active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: "project-tab",
									className: "absolute -bottom-[13px] left-0 h-px w-full bg-navy",
									transition: {
										type: "spring",
										stiffness: 320,
										damping: 30
									}
								}) : null]
							}, item);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative shrink-0",
						"data-reveal": true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSortOpen((o) => !o),
							"aria-expanded": sortOpen,
							className: "relative flex items-center gap-2 pb-1 font-display text-xs font-bold tracking-[0.0625rem] text-slate uppercase transition-colors hover:text-navy after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']",
							children: ["Sort", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								animate: { rotate: reduced || !sortOpen ? 0 : 180 },
								transition: { duration: .25 },
								className: "inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 12 12",
									fill: "none",
									"aria-hidden": "true",
									className: "h-3 w-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M2.5 4.5L6 8l3.5-3.5",
										stroke: "currentColor",
										strokeWidth: "1.2"
									})
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: sortOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ul, {
							initial: reduced ? { opacity: 1 } : {
								opacity: 0,
								y: -6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: reduced ? { opacity: 0 } : {
								opacity: 0,
								y: -6
							},
							transition: {
								duration: .2,
								ease: "easeOut"
							},
							className: "absolute right-0 z-10 mt-2 w-40 border border-navy-14 bg-white py-2 shadow-sm",
							children: SORTS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setSort(option.key);
									setSortOpen(false);
								},
								className: `flex min-h-11 w-full items-center px-4 text-left font-body text-xs transition-colors ${sort === option.key ? "text-navy" : "text-slate hover:text-navy"}`,
								children: option.label
							}) }, option.key))
						}) : null })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					ref: gridRef,
					className: "mt-[clamp(2rem,3.4vw,3rem)] grid grid-cols-1 gap-x-[clamp(1.25rem,2.1vw,2.5rem)] gap-y-[clamp(2.25rem,3.6vw,4.25rem)] sm:grid-cols-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						initial: false,
						mode: "popLayout",
						children: visible.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
							"data-card": true,
							layout: !reduced,
							initial: reduced ? { opacity: 1 } : {
								opacity: 0,
								y: 18
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: reduced ? { opacity: 0 } : {
								opacity: 0,
								y: -12
							},
							transition: {
								duration: reduced ? 0 : .5,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							className: "group min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
								whileHover: reduced ? { opacity: .9 } : { y: -6 },
								transition: {
									type: "spring",
									stiffness: 260,
									damping: 24
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "aspect-[848/565] w-full overflow-hidden rounded-sm bg-mist",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											...project.image,
											alt: `${project.name} — ${project.location}, ${project.architect}`,
											sizes: "(min-width: 40rem) 50vw, 100vw",
											loading: "lazy",
											className: "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-[clamp(1.25rem,1.6vw,1.5rem)] flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-body text-xs font-bold text-navy",
											children: project.index
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-4 bg-navy-14" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-start justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "min-w-0 font-display text-[clamp(1.125rem,1.4vw,1.5rem)] font-medium tracking-tight text-navy",
											children: project.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.a, {
											href: "#portfolio",
											className: "relative mt-1.5 inline-flex shrink-0 items-center gap-2 border-b border-navy pb-0.5 font-display text-xs font-bold tracking-[0.0625rem] text-navy uppercase after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']",
											whileHover: reduced ? { opacity: .75 } : { x: 3 },
											transition: {
												type: "spring",
												stiffness: 300,
												damping: 22
											},
											children: ["View Project", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 font-body text-sm text-slate",
										children: [
											project.location,
											" · ",
											project.architect
										]
									})
								]
							})
						}, project.name))
					})
				}),
				visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-12 font-body text-sm text-slate",
					children: "No projects in this category yet."
				}) : null
			]
		})
	});
}
function ProjectsCta() {
	const reduced = useReducedMotion();
	const ref = useReveal({
		selector: "[data-reveal]",
		y: 26,
		stagger: .12
	});
	const headingRef = useSplitLines();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "bg-navy py-[clamp(3.5rem,6vw,6.5rem)] text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref,
			className: "shell flex flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-reveal": true,
					className: "font-display text-xs font-bold tracking-[0.1875rem] text-accent-blue uppercase",
					children: "Start a project"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					ref: headingRef,
					className: "mt-6 max-w-[50rem] font-display text-[clamp(2rem,4.4vw,4.25rem)] leading-[1.12] font-medium tracking-section text-balance text-white",
					children: "Have a project in mind?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-reveal": true,
					className: "mt-6 max-w-[50rem] font-body text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.56] text-white/70",
					children: "Let’s build what comes next, together. Reach out to our engineering office to discuss system details, custom fabrications, and performance targets."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.a, {
					"data-reveal": true,
					href: "/contact",
					className: "mt-[clamp(2rem,3.4vw,3rem)] inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-display text-sm font-bold tracking-button text-navy uppercase",
					whileHover: reduced ? { opacity: .85 } : {
						y: -2,
						scale: 1.02
					},
					whileTap: reduced ? {} : { scale: .99 },
					transition: {
						type: "spring",
						stiffness: 300,
						damping: 22
					},
					children: ["Talk to our team", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 12 12",
						fill: "none",
						"aria-hidden": "true",
						className: "h-3 w-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M2 10L10 2M4 2h6v6",
							stroke: "currentColor",
							strokeWidth: "1.3"
						})
					})]
				})
			]
		})
	});
}
function ProjectsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative bg-white font-body text-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { variant: "light" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				tabIndex: -1,
				className: "scroll-mt-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsIntro, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturedProject, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectGrid, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsCta, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurallFooter, {})
		]
	});
}
//#endregion
export { ProjectsPage as component };
