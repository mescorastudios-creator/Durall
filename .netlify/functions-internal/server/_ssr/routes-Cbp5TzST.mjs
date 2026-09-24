import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useHeroIntro, c as useReveal, i as useClipReveal, l as useSplitLines, n as loadGsap, o as useParallax, r as prefersReducedMotion, s as useReducedMotion } from "./anim-BIreCG3R.mjs";
import { t as IMAGES } from "./images-DAzp0ysB.mjs";
import { a as Interactive, c as ViewMore, i as DurallFooter, n as ArrowRight, o as SiteHeader, r as CtaButton, s as UnderlineLink, t as ArrowLeft } from "./DurallFooter-CgBY-amo.mjs";
import { n as useTransform, r as useMotionValue, t as useSpring } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as Contact } from "./Contact-ITwGI-WW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cbp5TzST.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Hero() {
	const { sectionRef, headingRef, imageRef } = useHeroIntro();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: sectionRef,
		id: "top",
		className: "relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy pb-[max(clamp(3rem,7vw,4rem),env(safe-area-inset-bottom))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: imageRef,
				...IMAGES.heroParikrama,
				alt: "Parikrama House, Murud — a Durall aluminium envelope framed by palms",
				sizes: "100vw",
				fetchPriority: "high",
				decoding: "async",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "absolute inset-0 bg-linear-to-t from-navy/0 to-navy/70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shell relative pt-[clamp(8rem,15vw,10rem)] lg:pt-[6rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					ref: headingRef,
					"data-anim-hide": true,
					className: "max-w-[20ch] font-display text-[clamp(2.25rem,6.7vw,8rem)] leading-[0.94] font-medium tracking-hero text-balance text-white",
					children: "Engineering spaces without boundaries."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-[clamp(1.5rem,3vw,2rem)] grid grid-cols-1 items-end gap-[clamp(1.5rem,3vw,2rem)] border-t border-white/15 pt-[clamp(1.5rem,3vw,2rem)] md:grid-cols-[minmax(0,1fr)_auto]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-hero-fade": true,
						className: "min-w-0 max-w-[24.5rem] flex-1 font-body text-[clamp(0.875rem,1.1vw,1rem)] leading-relaxed text-pretty text-white/72",
						children: "Premium aluminium systems for windows, doors, façades and architectural applications — engineered with the architects who design tomorrow’s landmarks."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-hero-fade": true,
						className: "flex flex-wrap gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaButton, {
							href: "#projects",
							children: "Explore Projects"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaButton, {
							href: "#philosophy",
							variant: "solid",
							children: "Discover Durall"
						})]
					})]
				})]
			})
		]
	});
}
function Philosophy() {
	const copyRef = useReveal({
		selector: "[data-reveal]",
		y: 28
	});
	const frameRef = useReveal({
		y: 48,
		duration: 1.1
	});
	const imageRef = useParallax(10);
	const headingRef = useSplitLines();
	const clipRef = useClipReveal();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "philosophy",
		className: "relative bg-white py-[clamp(4.5rem,9vw,11.25rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[120rem] grid-cols-1 gap-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.25rem,3.75vw,4.5rem)] lg:grid-cols-[minmax(0,46.8125rem)_minmax(0,1fr)] lg:gap-[clamp(1.5rem,2.4vw,2.875rem)] lg:pr-0 lg:pl-[clamp(3rem,13.6vw,16.3125rem)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: copyRef,
				className: "min-w-0 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						ref: headingRef,
						className: "font-display text-[clamp(2.125rem,3.6vw,4rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy",
						children: ["Luxury is never applied. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate",
							children: "It is engineered."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-[clamp(2rem,2.7vw,3.25rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate",
						children: "Durall works alongside architects and developers long before a building becomes visible — coordinating design intent, engineering tolerance, and material performance into a single, precise envelope."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-[clamp(1.25rem,1.4vw,1.625rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate",
						children: "Every threshold a building presents to the world — its windows, its skylights, its screens — is a system we design, engineer, fabricate and install as one continuous discipline."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-reveal": true,
						className: "mt-[clamp(2.25rem,3.3vw,3.875rem)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnderlineLink, {
							href: "#process",
							children: "How we work"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: frameRef,
				className: "relative min-w-0 lg:-mt-[1.625rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					className: "absolute -top-[1.625rem] -left-[1.375rem] hidden h-full w-full border border-navy lg:block"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: clipRef,
					className: "relative aspect-[871/779] w-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						ref: imageRef,
						...IMAGES.philosophyPavilion,
						alt: "Dining pavilion framed by full-height Durall sliding systems",
						sizes: "(min-width: 64rem) 45vw, 100vw",
						loading: "lazy",
						decoding: "async",
						className: "h-[112%] w-full object-cover"
					})
				})]
			})]
		})
	});
}
/**
* Figma "Vector 27": the hairline that runs from the philosophy image down to
* the projects View More control. Draws itself in on scroll.
*/
function ConnectorLine() {
	const pathRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const path = pathRef.current;
		if (!path || prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		loadGsap().then(({ gsap }) => {
			if (cancelled || !pathRef.current) return;
			const length = path.getTotalLength();
			const tween = gsap.fromTo(path, {
				strokeDasharray: length,
				strokeDashoffset: length
			}, {
				strokeDashoffset: 0,
				ease: "none",
				scrollTrigger: {
					trigger: path.closest("svg"),
					start: "top 90%",
					end: "bottom 60%",
					scrub: true
				}
			});
			dispose = () => {
				tween.scrollTrigger?.kill();
				tween.kill();
			};
		});
		return () => {
			cancelled = true;
			dispose();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		"aria-hidden": "true",
		viewBox: "0 0 266 1118",
		fill: "none",
		preserveAspectRatio: "none",
		className: "pointer-events-none absolute top-0 right-[6.8%] hidden h-[min(69.8rem,75vw)] w-[min(16.5rem,18%)] -translate-y-[5%] lg:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			ref: pathRef,
			d: "M265 0V701.5L122 858.5V1117H0",
			stroke: "var(--color-navy)",
			strokeOpacity: "0.35"
		})
	});
}
var PROJECTS = [
	{
		name: "Parikrama, Murud House",
		place: "Murud — Spasm Architects",
		image: IMAGES.thumbParikrama
	},
	{
		name: "Patina",
		place: "Maldives — Studio MK27",
		image: IMAGES.thumbPatina
	},
	{
		name: "Chiltron House",
		place: "Singapore — WOW Architects",
		image: IMAGES.thumbChiltron
	},
	{
		name: "Juhu house",
		place: "Mumbai — Ernesto Bedmar",
		image: IMAGES.thumbJuhu
	},
	{
		name: "Ritz-Carlton",
		place: "Maldives — Kerry Hill Architects",
		image: IMAGES.thumbRitz
	}
];
function Projects() {
	const headRef = useReveal({
		selector: "[data-reveal]",
		y: 30
	});
	const gridRef = useReveal({
		selector: "[data-card]",
		y: 70,
		stagger: .22,
		start: "top 92%",
		end: "bottom 55%",
		scrub: 1.2
	});
	const headingRef = useSplitLines();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "projects",
		className: "relative overflow-hidden bg-white pb-[clamp(4.5rem,8vw,9.375rem)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell-narrow",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: headRef,
					className: "flex flex-col justify-between gap-[clamp(1.5rem,3vw,2rem)] lg:flex-row lg:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						ref: headingRef,
						className: "min-w-0 max-w-[38rem] font-display text-[clamp(2.125rem,3.7vw,4.25rem)] leading-none font-medium tracking-section text-balance text-navy",
						children: [
							"What we’ve",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"built together."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "min-w-0 max-w-[35rem] font-body text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-slate lg:pb-4",
						children: "Selected residences and landmarks where Durall’s systems became the architecture’s most exacting details."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					ref: gridRef,
					className: "mt-[clamp(2.75rem,5.5vw,6.5625rem)] grid grid-cols-1 gap-x-[clamp(1rem,1.4vw,1.625rem)] gap-y-[clamp(1.75rem,2.2vw,2.1875rem)] sm:grid-cols-2 lg:grid-cols-3",
					children: PROJECTS.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interactive, {
						as: "li",
						"data-card": true,
						lift: -6,
						scale: 1.012,
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "group flex flex-col items-start text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-square w-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									...project.image,
									alt: `${project.name} — ${project.place}`,
									sizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
									loading: "lazy",
									className: "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex w-full flex-col items-start px-0 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-[clamp(1rem,1.2vw,1.375rem)] font-display text-[clamp(1.125rem,1.4vw,1.5rem)] font-medium tracking-tight text-navy",
									children: project.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 font-body text-xs tracking-wide text-slate",
									children: project.place
								})]
							})]
						})
					}, project.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-[clamp(2rem,3vw,3.5rem)] flex justify-center lg:mt-[-3.625rem] lg:justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewMore, { href: "#projects" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectorLine, {})]
	});
}
var PIN_WIDTH_QUERY = "(min-width: 64rem)";
var STAGES = [
	{
		num: "01",
		title: "Discover",
		body: "Site visit, brief, and intent — we read the architect's drawings before we read the BoQ.",
		caption: "Understanding the vision and the intent.",
		image: IMAGES.stageDiscover,
		alt: "Glass-walled terrace overlooking a lake at sunset"
	},
	{
		num: "02",
		title: "Design",
		body: "System selection, material strategy, and elevation studies. We draw alternates, not just options.",
		caption: "Drawing alternates, not just options.",
		image: IMAGES.philosophyPavilion,
		alt: "Dining pavilion framed by full-height sliding systems"
	},
	{
		num: "03",
		title: "Engineer",
		body: "Structural, thermal, acoustic, and weather performance — every detail load-tested before the workshop sees it.",
		caption: "Every detail load-tested before fabrication.",
		image: IMAGES.stageEngineer,
		alt: "Interior with slatted ceiling and precise square light cutouts"
	},
	{
		num: "04",
		title: "Fabricate",
		body: "In-house workshop discipline. Custom extrusions, jigged assemblies, and a single QC chain.",
		caption: "Custom extrusions under a single QC chain.",
		image: IMAGES.stageFabricate,
		alt: "Interior with wooden slat ceiling overlooking a pool at dusk"
	},
	{
		num: "05",
		title: "Install",
		body: "Site supervision, sequencing, and handover — backed by a maintenance schedule we publish in writing.",
		caption: "Sequenced installation and written handover.",
		image: IMAGES.stageInstall,
		alt: "White modern balcony with glass railings"
	}
];
function Process() {
	const [active, setActive] = (0, import_react.useState)(0);
	const [openStep, setOpenStep] = (0, import_react.useState)(0);
	const reduced = useReducedMotion();
	const sectionRef = (0, import_react.useRef)(null);
	const frameRef = (0, import_react.useRef)(null);
	const colRef = (0, import_react.useRef)(null);
	const contentRef = (0, import_react.useRef)(null);
	const copyRef = useReveal({
		selector: "[data-reveal]",
		y: 30
	});
	const listRef = useReveal({
		selector: "[data-step]",
		y: 26,
		stagger: .09
	});
	const stageRef = useReveal({
		y: 48,
		duration: 1.1
	});
	const headingRef = useSplitLines();
	const railRef = (0, import_react.useRef)(null);
	const dotOffsets = (0, import_react.useRef)([]);
	const fractionRef = (0, import_react.useRef)(0);
	const scrollDriven = (0, import_react.useRef)(false);
	const rawY = useMotionValue(0);
	const springY = useSpring(rawY, {
		stiffness: 120,
		damping: 24,
		mass: .6
	});
	const markerY = reduced ? rawY : springY;
	const fillHeight = useTransform(markerY, (v) => v + 5);
	/** Position the marker at a fractional step index (0 → 4). */
	const applyFraction = (0, import_react.useCallback)((fraction) => {
		const offsets = dotOffsets.current;
		if (!offsets.length) return;
		fractionRef.current = fraction;
		const clamped = Math.max(0, Math.min(offsets.length - 1, fraction));
		const lower = Math.floor(clamped);
		const upper = Math.min(offsets.length - 1, lower + 1);
		const t = clamped - lower;
		const a = offsets[lower] ?? 0;
		const b = offsets[upper] ?? a;
		rawY.set(a + (b - a) * t);
	}, [rawY]);
	(0, import_react.useLayoutEffect)(() => {
		const rail = railRef.current;
		if (!rail) return;
		const offsetWithin = (el) => {
			let top = 0;
			let node = el;
			while (node && node !== rail) {
				top += node.offsetTop;
				node = node.offsetParent;
			}
			return top;
		};
		const measure = () => {
			const steps = Array.from(rail.querySelectorAll("[data-dot]"));
			const marker = rail.querySelector("[data-marker]");
			const markerBase = marker ? offsetWithin(marker) : 0;
			dotOffsets.current = steps.map((el) => offsetWithin(el) - markerBase);
			applyFraction(fractionRef.current);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(rail);
		rail.querySelectorAll("[data-step]").forEach((el) => ro.observe(el));
		window.addEventListener("resize", measure);
		let detach = () => {};
		if (!prefersReducedMotion()) loadGsap().then(({ ScrollTrigger }) => {
			ScrollTrigger.addEventListener("refresh", measure);
			detach = () => ScrollTrigger.removeEventListener("refresh", measure);
		});
		document.fonts?.ready.then(measure);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", measure);
			detach();
		};
	}, [applyFraction]);
	(0, import_react.useEffect)(() => {
		if (scrollDriven.current) return;
		applyFraction(active);
	}, [active, applyFraction]);
	const [canPin, setCanPin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const evaluate = () => {
			const content = contentRef.current;
			if (!content) return;
			if (!window.matchMedia(PIN_WIDTH_QUERY).matches) {
				setCanPin(false);
				return;
			}
			let openHeight = 0;
			let tallest = 0;
			content.querySelectorAll("[data-body]").forEach((body) => {
				const inner = body.firstElementChild;
				if (inner) tallest = Math.max(tallest, inner.offsetHeight);
				openHeight = Math.max(openHeight, body.getBoundingClientRect().height);
			});
			const required = content.scrollHeight - openHeight + tallest;
			const viewport = window.visualViewport?.height ?? window.innerHeight;
			const padding = 2 * Math.min(Math.max(20, viewport * .03), 56);
			setCanPin(required + padding <= viewport);
		};
		evaluate();
		const onResize = () => window.requestAnimationFrame(evaluate);
		window.addEventListener("resize", onResize, { passive: true });
		window.visualViewport?.addEventListener("resize", onResize, { passive: true });
		document.fonts?.ready.then(evaluate);
		return () => {
			window.removeEventListener("resize", onResize);
			window.visualViewport?.removeEventListener("resize", onResize);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const section = sectionRef.current;
		const frame = frameRef.current;
		if (!section || !frame || prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		loadGsap().then(({ gsap, ScrollTrigger }) => {
			if (cancelled || !sectionRef.current) return;
			const select = (index) => {
				setActive(index);
				setOpenStep(index);
			};
			const mm = gsap.matchMedia();
			mm.add(PIN_WIDTH_QUERY, () => {
				if (!canPin) return;
				scrollDriven.current = true;
				const sizeFrame = () => {
					const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
					gsap.set(frame, {
						width: "100%",
						maxWidth: "none",
						height: viewportHeight,
						maxHeight: viewportHeight,
						overflow: "hidden"
					});
				};
				sizeFrame();
				ScrollTrigger.addEventListener("refreshInit", sizeFrame);
				const LEAD = .08;
				const st = ScrollTrigger.create({
					trigger: frame,
					start: "top top",
					end: () => "+=" + (window.visualViewport?.height ?? window.innerHeight) * (STAGES.length - 1),
					invalidateOnRefresh: true,
					pin: frame,
					pinSpacing: true,
					pinReparent: false,
					anticipatePin: 0,
					scrub: .6,
					snap: {
						snapTo: Array.from({ length: STAGES.length }, (_, i) => i / (STAGES.length - 1)),
						duration: {
							min: .25,
							max: .6
						},
						delay: .12,
						ease: "power2.inOut",
						inertia: false,
						directional: true
					},
					onUpdate: (self) => {
						const raw = Math.max(0, Math.min(1, (self.progress - LEAD) / .92)) * (STAGES.length - 1);
						applyFraction(raw);
						select(Math.min(STAGES.length - 1, Math.round(raw)));
					}
				});
				return () => {
					scrollDriven.current = false;
					ScrollTrigger.removeEventListener("refreshInit", sizeFrame);
					st.kill();
					gsap.set(frame, { clearProps: "width,maxWidth,height,maxHeight,overflow" });
				};
			});
			mm.add(canPin ? "(max-width: 63.999rem)" : "all", () => {
				const triggers = Array.from(section.querySelectorAll("[data-step]")).map((el, i) => ScrollTrigger.create({
					trigger: el,
					start: "top 70%",
					onEnter: () => select(i),
					onEnterBack: () => select(i)
				}));
				return () => triggers.forEach((t) => t.kill());
			});
			dispose = () => mm.revert();
		});
		return () => {
			cancelled = true;
			dispose();
		};
	}, [applyFraction, canPin]);
	const stage = STAGES[active];
	const go = (delta) => setActive((prev) => (prev + delta + STAGES.length) % STAGES.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		ref: sectionRef,
		id: "process",
		className: `flex items-center overflow-hidden bg-paper ${canPin ? "min-h-svh py-0" : "py-[clamp(2rem,5vw,5rem)]"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: frameRef,
			"data-frame": true,
			className: `grid w-full grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] px-[clamp(1.25rem,3.75vw,4.5rem)] lg:grid-cols-2 lg:items-center ${canPin ? "lg:h-svh lg:gap-0 lg:px-0" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: colRef,
				className: `min-h-0 min-w-0 ${canPin ? "lg:flex lg:h-full lg:flex-col lg:justify-center lg:overflow-y-auto lg:overscroll-contain lg:py-[clamp(1.25rem,3vh,3.5rem)] lg:pr-[clamp(2rem,4vw,5rem)] lg:pl-[clamp(3rem,6vw,7.5rem)]" : ""}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: contentRef,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: copyRef,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									"data-reveal": true,
									className: "font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
									children: [
										"04 ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 text-slate",
											children: "—"
										}),
										" How we work"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									ref: headingRef,
									className: "mt-[clamp(0.75rem,2.2vh,2.375rem)] font-display text-[clamp(1.75rem,min(3.6vw,6.2vh),4rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy",
									children: ["Concept to commissioning, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate",
										children: "under one roof."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									"data-reveal": true,
									className: "mt-[clamp(0.75rem,1.8vh,1.875rem)] max-w-[27rem] font-body text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.75] text-slate",
									children: "An integrated process that brings precision, accountability, and performance to every project."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: railRef,
							className: "relative mt-[clamp(1rem,3vh,3.25rem)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									"aria-hidden": "true",
									style: { height: fillHeight },
									className: "pointer-events-none absolute top-2 left-[0.3125rem] w-px bg-navy/70"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									"aria-hidden": "true",
									style: { y: markerY },
									"data-marker": true,
									className: "pointer-events-none absolute top-2 left-0 z-10 h-2.5 w-2.5 rounded-full bg-navy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									ref: listRef,
									children: STAGES.map((item, index) => {
										const isOpen = openStep === index;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											"data-step": true,
											className: "relative border-b border-navy/10 pb-[clamp(0.625rem,1.5vh,1.5rem)] pl-[clamp(2rem,4vw,4.25rem)] last:border-b-0",
											children: [
												index < STAGES.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"aria-hidden": "true",
													className: "absolute top-3 left-[0.3125rem] h-full w-px bg-navy/20"
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"data-dot": true,
													"aria-hidden": "true",
													className: "absolute top-2 left-0 h-2.5 w-2.5 rounded-full border border-navy/35 bg-paper"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start gap-[clamp(1rem,2.4vw,2.875rem)]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "shrink-0 font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-none text-navy/55 italic",
														children: item.num
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															onClick: () => {
																setActive(index);
																setOpenStep((prev) => prev === index ? null : index);
															},
															"aria-expanded": isOpen,
															className: "relative flex w-full items-center justify-between gap-6 text-left after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-display text-sm font-bold tracking-button text-navy uppercase",
																children: item.title
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
																"aria-hidden": "true",
																className: "font-body text-lg leading-none text-slate",
																animate: reduced ? {} : { rotate: isOpen ? 45 : 0 },
																children: "+"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
															initial: false,
															animate: reduced ? { opacity: isOpen ? 1 : 0 } : {
																height: isOpen ? "auto" : 0,
																opacity: isOpen ? 1 : 0
															},
															transition: {
																duration: reduced ? .2 : .9,
																ease: [
																	.22,
																	1,
																	.36,
																	1
																]
															},
															"aria-hidden": !isOpen,
															"data-body": true,
															className: "overflow-hidden font-body text-sm leading-[1.75] text-slate",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "pt-[0.625rem] pb-[0.25rem]",
																children: item.body
															})
														})]
													})]
												})
											]
										}, item.num);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-[clamp(0.875rem,2.5vh,3.25rem)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnderlineLink, {
								href: "#contact",
								children: "Explore our approach"
							})
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: stageRef,
				className: `relative w-full min-w-0 overflow-hidden ${canPin ? "aspect-[1038/1143] max-h-[min(55svh,26rem)] lg:aspect-auto lg:h-full lg:max-h-none lg:w-full" : "aspect-[1038/1143] max-h-[min(55svh,26rem)] lg:max-h-none"}`,
				children: [
					STAGES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
						...s.image,
						alt: i === active ? s.alt : "",
						sizes: "(min-width: 64rem) 50vw, 100vw",
						"aria-hidden": i === active ? void 0 : true,
						loading: "lazy",
						initial: false,
						animate: {
							opacity: i === active ? 1 : 0,
							scale: reduced || i === active ? 1 : 1.06
						},
						transition: {
							opacity: {
								duration: reduced ? .2 : 1.6,
								ease: [
									.4,
									0,
									.2,
									1
								]
							},
							scale: {
								duration: reduced ? 0 : 2.6,
								ease: [
									.16,
									1,
									.3,
									1
								]
							}
						},
						style: {
							transformOrigin: "center",
							willChange: "opacity, transform"
						},
						className: "absolute inset-0 h-full w-full object-cover object-center"
					}, s.image.src)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-[8%] right-[6%] w-[min(15rem,42%)] bg-white/85 p-[clamp(0.75rem,1.2vw,1.25rem)] text-navy backdrop-blur-sm lg:top-auto lg:right-auto lg:bottom-[16%] lg:left-[6%] lg:w-[min(17rem,44%)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[clamp(0.625rem,0.7vw,0.6875rem)] font-bold tracking-eyebrow uppercase",
								children: "Current stage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "mt-3 block h-px w-6 bg-navy/60"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: false,
								animate: {
									opacity: [.3, 1],
									y: reduced ? 0 : [8, 0]
								},
								transition: {
									duration: reduced ? .2 : .7,
									ease: [
										.22,
										1,
										.36,
										1
									]
								},
								"data-stage": stage.num,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 font-display text-[clamp(0.8125rem,1vw,1rem)] font-bold tracking-[0.0625rem] text-navy uppercase",
									children: [
										stage.num,
										" ",
										stage.title
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-body text-[clamp(0.75rem,0.9vw,0.875rem)] leading-[1.5] text-navy/70",
									children: stage.caption
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-[6%] bottom-[5%] flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-[clamp(0.5rem,1vw,1rem)] font-body text-[clamp(0.75rem,0.9vw,0.875rem)] tabular-nums text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stage.num }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative block h-px w-[clamp(3rem,18vw,15rem)] bg-white/40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
										className: "absolute inset-y-0 left-0 bg-white",
										animate: { width: `${(active + 1) / STAGES.length * 100}%` },
										transition: {
											duration: reduced ? 0 : .5,
											ease: "easeOut"
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", STAGES.length] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
								type: "button",
								onClick: () => go(-1),
								"aria-label": "Previous stage",
								className: "flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy",
								whileHover: reduced ? { opacity: .85 } : { scale: 1.08 },
								whileTap: reduced ? {} : { scale: .95 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
								type: "button",
								onClick: () => go(1),
								"aria-label": "Next stage",
								className: "flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white",
								whileHover: reduced ? { opacity: .85 } : { scale: 1.08 },
								whileTap: reduced ? {} : { scale: .95 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
							})]
						})]
					})
				]
			})]
		})
	});
}
function ReadArticle({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 font-display text-[clamp(0.6875rem,0.78vw,0.75rem)] font-medium tracking-button text-navy uppercase transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 " + className,
		children: ["Read article", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: "→"
		})]
	});
}
function Meta({ category, date, iso }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[clamp(0.6875rem,0.72vw,0.75rem)] font-medium tracking-eyebrow uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-navy",
			children: category
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
			dateTime: iso,
			className: "text-slate",
			children: date
		})]
	});
}
var ROWS = [
	{
		category: "Fabrication",
		date: "12 Aug 2026",
		iso: "2026-08-12",
		title: "Precision in Fabrication: Why Small Details Matter at Scale",
		image: IMAGES.thumbChiltron,
		alt: "Modern white house with large glazed openings"
	},
	{
		category: "Materials",
		date: "04 Aug 2026",
		iso: "2026-08-04",
		title: "Why Aluminium Is Becoming the Material of Choice for Modern Envelopes",
		image: IMAGES.thumbJuhu,
		alt: "Aerial view of a modern residence with a courtyard pool"
	},
	{
		category: "Engineering",
		date: "21 Jul 2026",
		iso: "2026-07-21",
		title: "Thermal Performance Without Compromising Architectural Intent",
		image: IMAGES.thumbRitz,
		alt: "Curved pool deck overlooking clear blue water"
	}
];
function Insights() {
	const headRef = useSplitLines();
	const gridRef = useReveal({
		selector: "[data-card]",
		y: 72,
		stagger: .22,
		start: "top 92%",
		end: "bottom 60%",
		scrub: 1.2
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "insights",
		className: "bg-white py-[clamp(4.5rem,8vw,9.375rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell-narrow",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					ref: headRef,
					className: "max-w-[50rem] font-display text-[clamp(2.125rem,3.6vw,4rem)] leading-[1.17] font-medium tracking-tight text-balance text-navy",
					children: "Engineering insights that build better facades"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: gridRef,
					className: "mt-[clamp(2.5rem,4vw,4.375rem)] grid grid-cols-1 gap-x-[clamp(2rem,4vw,5rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interactive, {
						as: "article",
						"data-card": true,
						lift: -4,
						scale: 1.004,
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group flex h-full min-w-0 flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-[16/11] w-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									...IMAGES.thumbPatina,
									alt: "Slatted-ceiling interior opening to a pool and the ocean at dusk",
									sizes: "(min-width: 64rem) 46vw, 100vw",
									loading: "lazy",
									className: "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-[clamp(1.25rem,1.8vw,1.75rem)] flex min-w-0 flex-col",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
										category: "Architecture / Performance",
										date: "28 Aug 2026 · 6 min read",
										iso: "2026-08-28"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-[clamp(0.75rem,1.2vw,1.125rem)] max-w-[30ch] font-display text-[clamp(1.5rem,2.5vw,2.75rem)] leading-[1.14] font-medium tracking-tight text-balance text-navy",
										children: "Designing Aluminium Systems for Performance, Not Just Appearance"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-[clamp(0.875rem,1.4vw,1.25rem)] max-w-[46ch] font-body text-[clamp(0.875rem,1vw,1rem)] leading-relaxed text-slate",
										children: "From thermal breaking to wind load resistance, the true value of an architectural envelope lies in its invisible engineering."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#insights",
										className: "group mt-[clamp(1.25rem,2vw,1.875rem)] inline-flex min-h-11 w-fit items-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadArticle, {})
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-w-0 flex-col",
						children: ROWS.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interactive, {
							as: "article",
							"data-card": true,
							lift: -3,
							scale: 1.004,
							className: "min-w-0 py-[clamp(1.25rem,2vw,1.75rem)] " + (index > 0 ? "border-t border-navy/15" : "lg:pt-0"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group flex min-w-0 items-start justify-between gap-[clamp(1rem,2vw,2rem)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
											category: row.category,
											date: row.date,
											iso: row.iso
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-[clamp(0.625rem,1vw,0.875rem)] max-w-[30ch] font-display text-[clamp(1.0625rem,1.35vw,1.5rem)] leading-[1.25] font-medium tracking-tight text-pretty text-navy",
											children: row.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "#insights",
											className: "group mt-[clamp(0.875rem,1.4vw,1.25rem)] inline-flex min-h-11 w-fit items-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadArticle, {})
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-[clamp(5.5rem,9vw,8.75rem)] shrink-0 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "aspect-square w-full overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											...row.image,
											alt: row.alt,
											sizes: "clamp(5.5rem, 9vw, 8.75rem)",
											loading: "lazy",
											className: "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
										})
									})
								})]
							})
						}, row.title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-[clamp(2rem,3vw,2.875rem)] flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewMore, { href: "#insights" })
				})
			]
		})
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative bg-white font-body text-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { variant: "light" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				tabIndex: -1,
				className: "scroll-mt-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Philosophy, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projects, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Process, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Insights, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurallFooter, {})
		]
	});
}
//#endregion
export { Index as component };
