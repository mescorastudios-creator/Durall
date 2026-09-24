import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as useReveal, l as useSplitLines, o as useParallax } from "./anim-BIreCG3R.mjs";
import { t as IMAGES } from "./images-DAzp0ysB.mjs";
import { a as Interactive, i as DurallFooter, o as SiteHeader, r as CtaButton } from "./DurallFooter-CgBY-amo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partners-DGEJ7Kzj.js
var import_jsx_runtime = require_jsx_runtime();
function PartnersHero() {
	const headingRef = useSplitLines({ start: "top 95%" });
	const copyRef = useReveal({
		selector: "[data-hero-fade]",
		y: 26,
		delay: .25
	});
	const imageRef = useParallax(8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "relative flex min-h-[100svh] items-center overflow-hidden bg-navy pt-[max(calc(var(--header-h)+1.5rem),clamp(6rem,12vw,9rem))] pb-[clamp(6rem,12vw,9rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: imageRef,
				...IMAGES.heroParikrama,
				alt: "Palm-framed Durall residence at dusk",
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
				ref: copyRef,
				className: "shell relative grid w-full grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							ref: headingRef,
							className: "max-w-[14ch] font-display text-[clamp(2.25rem,5vw,5rem)] leading-[1.02] font-medium tracking-hero text-white",
							children: "International expertise. Integrated locally."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-hero-fade": true,
							className: "mt-[clamp(1.5rem,2.6vw,2rem)] max-w-[30rem] font-body text-[clamp(0.875rem,1.05vw,0.9375rem)] leading-relaxed text-white/72",
							children: "Durall Systems works with trusted international partners to bring world-class systems and specialist technologies to architectural projects in India. Our partnerships are built around precision, capability and the demands of each project."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-hero-fade": true,
							className: "mt-[clamp(1.5rem,2.6vw,2rem)] font-display text-[0.625rem] font-bold tracking-eyebrow text-white/45 uppercase",
							children: "D/S — Architectural Datum / 01"
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
								alt: "Facade detail of a Durall-glazed residence",
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
var PARTNERS = [
	{
		mark: "jofebar",
		name: "Jofebar",
		country: "Switzerland / Portugal",
		description: "PanoramAH! minimal window systems"
	},
	{
		mark: "glasmarte",
		name: "glasmarte",
		country: "Austria",
		description: "Seamless glass railing systems"
	},
	{
		mark: "meshtec",
		name: "Meshtec",
		country: "Thailand",
		description: "Stainless steel high transparency security mesh"
	},
	{
		mark: "agor",
		name: "Agor",
		country: "Israel",
		description: "Movable and retractable swimming pool floors"
	},
	{
		mark: "adl",
		name: "ADL",
		country: "Italy",
		description: "Connecting internal spaces"
	},
	{
		mark: "palagina",
		name: "Palagina",
		country: "France",
		description: "Italian vertical and horizontal sliding insect screens"
	},
	{
		mark: "brombal",
		name: "Brombal",
		country: "Italy",
		description: "Italian luxury fenestration with special metals"
	},
	{
		mark: "renson",
		name: "Renson",
		country: "USA",
		description: "Pioneers in indoor climate"
	}
];
var PRACTICES = [
	{
		mark: "plain",
		name: "Ernesto Bedmar Architects",
		country: "Singapore",
		description: "Tropical modernist residential architecture"
	},
	{
		mark: "wow",
		name: "WOW",
		country: "Singapore",
		description: "Award-winning interior & architectural design"
	},
	{
		mark: "italic",
		name: "Andy Fisher workshop",
		country: "Singapore",
		description: "Bespoke interior design & space planning"
	},
	{
		mark: "ecoid",
		name: "eco id",
		country: "Singapore",
		description: "Sustainable architecture & green design"
	},
	{
		mark: "diamond",
		name: "Nomadic Resorts",
		country: "Netherlands",
		description: "Eco-luxury resorts & sustainable hospitality"
	},
	{
		mark: "solid",
		name: "SOM",
		country: "USA",
		description: "Global architecture, engineering & urban planning"
	},
	{
		mark: "solid",
		name: "Studio MK27",
		country: "Brazil",
		description: "Contemporary Brazilian residential architecture"
	},
	{
		mark: "solid",
		name: "Resplendent Ceylon",
		country: "Ceylon",
		description: "Heritage luxury hospitality & resort design"
	}
];
function PlusGlyph({ className = "h-2 w-2" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 8 8",
		fill: "none",
		"aria-hidden": "true",
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M4 0.6v6.8M0.6 4h6.8",
			stroke: "currentColor",
			strokeWidth: "1.4"
		})
	});
}
/** Typographic partner wordmarks, drawn with the site's own type and palette. */
function PartnerLogo({ mark, name }) {
	switch (mark) {
		case "jofebar": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-[clamp(1.05rem,1.35vw,1.375rem)] font-bold text-navy",
				children: "Jofebar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex h-4 w-4 items-center justify-center rounded-sm bg-accent-blue text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlusGlyph, {})
			})]
		});
		case "glasmarte": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-end gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-[clamp(1.05rem,1.35vw,1.375rem)] font-medium tracking-[-0.01em] text-accent-blue",
				children: "glasmarte"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "mb-1.5 h-1 w-1 rounded-full bg-accent-blue"
			})]
		});
		case "meshtec": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "inline-flex h-[1.125rem] w-[1.125rem] rotate-45 items-center justify-center rounded-[0.1875rem] bg-accent-blue",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 bg-white" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex flex-col leading-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-[clamp(0.875rem,1vw,1rem)] font-bold text-accent-blue",
					children: "MESHTEC"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 font-display text-[0.375rem] font-bold tracking-eyebrow text-slate uppercase",
					children: "Advanced Mesh Solutions"
				})]
			})]
		});
		case "agor": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex flex-col items-center leading-none text-navy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					"aria-hidden": "true",
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlusGlyph, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlusGlyph, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 border-[1.5px] border-navy" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlusGlyph, {})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1.5 font-display text-[clamp(0.9375rem,1.15vw,1.125rem)] font-bold",
					children: "AGOR"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 font-display text-[0.4375rem] tracking-eyebrow text-slate uppercase",
					children: "Creative Engineering"
				})
			]
		});
		case "adl": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-[clamp(1.25rem,1.7vw,1.75rem)] font-bold text-navy",
				children: "ADL"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "h-0 w-4 border-t-2 border-navy"
			})]
		});
		case "palagina": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2 rounded-sm bg-navy px-3 py-1.5 text-white",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "h-2 w-2 rotate-45 border border-white"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-[clamp(0.75rem,0.95vw,0.875rem)] font-bold tracking-eyebrow uppercase",
				children: "Palagina"
			})]
		});
		case "brombal": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex flex-col items-center leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex h-6 w-6 items-center justify-center rounded-sm bg-navy font-display text-[0.8125rem] font-bold text-white",
				children: "B"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 font-display text-[0.625rem] font-bold tracking-eyebrow text-navy uppercase",
				children: "Brombal"
			})]
		});
		case "renson": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "h-1 w-3 bg-accent-blue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-[clamp(0.9375rem,1.2vw,1.125rem)] font-bold tracking-eyebrow text-accent-blue uppercase",
				children: "Renson"
			})]
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-base font-bold text-navy",
			children: name
		});
	}
}
/** Typographic practice wordmarks. */
function PracticeLogo({ mark, name }) {
	switch (mark) {
		case "wow": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-[clamp(1.125rem,1.5vw,1.5rem)] font-bold tracking-[0.05em] text-navy",
			children: "WOW"
		});
		case "italic": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-serif text-[clamp(0.9375rem,1.15vw,1.125rem)] font-medium italic text-navy",
			children: name
		});
		case "ecoid": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5 font-display text-[clamp(1rem,1.3vw,1.25rem)] font-medium tracking-[0.12em] text-navy",
			children: [
				"eco",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "h-1.5 w-1.5 rotate-45 bg-navy"
				}),
				"id"
			]
		});
		case "diamond": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "h-3 w-3 rotate-45 border border-slate"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-[clamp(0.6875rem,0.9vw,0.8125rem)] font-bold tracking-eyebrow text-navy uppercase",
				children: name
			})]
		});
		case "solid": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex items-center rounded-sm bg-navy px-3 py-1.5 font-display text-[clamp(0.625rem,0.85vw,0.75rem)] font-bold tracking-eyebrow text-white uppercase",
			children: name
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "max-w-[9rem] text-center font-display text-[clamp(0.625rem,0.85vw,0.75rem)] font-bold tracking-eyebrow text-navy uppercase",
			children: name
		});
	}
}
function InternationalNetwork() {
	const headingRef = useSplitLines();
	const introRef = useReveal({
		selector: "[data-reveal]",
		y: 24
	});
	const gridRef = useReveal({
		selector: "[data-cell]",
		y: 28,
		stagger: .06
	});
	const quoteRef = useReveal({ y: 24 });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "international-systems",
		className: "relative overflow-hidden bg-white py-[clamp(3.5rem,8vw,7.5rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: introRef,
				className: "shell-narrow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						"data-reveal": true,
						className: "flex items-center gap-3 font-display text-[clamp(0.625rem,0.72vw,0.6875rem)] font-bold tracking-eyebrow text-accent-blue uppercase",
						children: ["International Systems", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "h-0 w-[clamp(1.5rem,3vw,2.5rem)] border-t border-accent-blue/60"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						ref: headingRef,
						className: "mt-[clamp(1rem,2vw,1.5rem)] max-w-[22ch] font-display text-[clamp(1.875rem,3.6vw,4rem)] leading-[1.1] font-medium tracking-section text-balance text-navy",
						children: "A network built around specialised systems."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-[clamp(1rem,2vw,1.5rem)] max-w-[32rem] font-body text-[clamp(0.8125rem,1vw,0.9375rem)] leading-relaxed text-slate",
						children: "Our international partners expand Durall’s capabilities across windows, glass, mesh, shading, fenestration and other specialised systems."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-[clamp(2.5rem,5vw,4.5rem)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					...IMAGES.partnersWorldMap,
					alt: "",
					"aria-hidden": "true",
					decoding: "async",
					className: "pointer-events-none absolute top-1/2 left-1/2 w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-15 select-none",
					loading: "lazy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					ref: gridRef,
					className: "shell-narrow relative grid grid-cols-1 gap-y-[clamp(2rem,4vw,3rem)] sm:grid-cols-2 lg:grid-cols-4",
					children: PARTNERS.map((partner) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						"data-cell": true,
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Interactive, {
							lift: -4,
							scale: 1.01,
							className: "flex min-w-0 flex-col items-center px-[clamp(0.75rem,1.5vw,2rem)] text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex min-h-[clamp(2.75rem,4vw,3.5rem)] items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerLogo, {
										mark: partner.mark,
										name: partner.name
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-[clamp(1rem,2vw,1.75rem)] font-body text-xs font-medium text-slate",
									children: partner.country
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: "mt-1.5 h-0 w-4 border-t-[1.5px] border-accent-blue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-[clamp(1rem,2vw,1.75rem)] max-w-[11rem] font-body text-xs leading-snug text-navy",
									children: partner.description
								})
							]
						})
					}, partner.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: quoteRef,
				className: "shell-narrow relative mt-[clamp(2.5rem,5vw,4.5rem)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-stretch gap-[clamp(1rem,2vw,1.75rem)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 33 112",
						fill: "none",
						"aria-hidden": "true",
						className: "h-[clamp(3.5rem,6vw,7rem)] w-auto shrink-0 text-navy/40",
						preserveAspectRatio: "none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M0.309 0.393 32.309 25.553V111.393",
							stroke: "currentColor"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-[46rem] self-end font-body text-[clamp(0.875rem,1.1vw,1.0625rem)] leading-relaxed text-navy",
						children: "From minimal window systems to advanced mesh and climate solutions, our partners bring world-class innovation. Durall brings it together — with understanding, precision and local execution."
					})]
				})
			})
		]
	});
}
function LeadingPractices() {
	const headingRef = useSplitLines();
	const introRef = useReveal({
		selector: "[data-reveal]",
		y: 24
	});
	const imageRef = useReveal({
		y: 32,
		start: "top 90%"
	});
	const gridRef = useReveal({
		selector: "[data-cell]",
		y: 28,
		stagger: .06
	});
	const closingRef = useReveal({ y: 20 });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "practices",
		className: "relative overflow-hidden bg-white pb-[clamp(3.5rem,8vw,7.5rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shell-narrow border-t border-navy/10 pt-[clamp(2.5rem,5vw,4.5rem)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 items-center gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: introRef,
					className: "shell-narrow min-w-0 lg:pr-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							"data-reveal": true,
							className: "flex items-center gap-3 font-display text-[clamp(0.625rem,0.72vw,0.6875rem)] font-bold tracking-eyebrow text-accent-blue uppercase",
							children: ["Architects & Design Practices", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "h-0 w-[clamp(1.5rem,3vw,2.5rem)] border-t border-accent-blue/60"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							ref: headingRef,
							className: "mt-[clamp(1rem,2vw,1.5rem)] max-w-[18ch] font-display text-[clamp(1.75rem,3.2vw,3.5rem)] leading-[1.12] font-medium tracking-section text-balance text-navy",
							children: "Trusted alongside leading practices."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "mt-[clamp(1rem,2vw,1.5rem)] block h-0 w-[clamp(2rem,3vw,2.5rem)] border-t-2 border-accent-blue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-reveal": true,
							className: "mt-[clamp(1.25rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.9375rem)] leading-relaxed text-slate",
							children: "Durall’s international experience is shaped through collaboration with visionary architects and designers across the globe."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-reveal": true,
							className: "mt-[clamp(0.75rem,1.5vw,1.25rem)] max-w-[28rem] font-body text-[clamp(0.75rem,0.9vw,0.875rem)] leading-relaxed text-slate/80",
							children: "And also with all leading architects & interior designers on projects in India."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: imageRef,
					className: "relative min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						...IMAGES.partnersVilla,
						alt: "Rendered white residence with layered aluminium framed glazing",
						sizes: "(min-width: 64rem) 50vw, 100vw",
						loading: "lazy",
						decoding: "async",
						className: "w-full object-contain"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				ref: gridRef,
				className: "shell-narrow relative mt-[clamp(2.5rem,5vw,4.5rem)] grid grid-cols-1 gap-y-[clamp(2rem,4vw,3rem)] sm:grid-cols-2 lg:grid-cols-4",
				children: PRACTICES.map((practice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					"data-cell": true,
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Interactive, {
						lift: -4,
						scale: 1.01,
						className: "flex min-w-0 flex-col items-center px-[clamp(0.75rem,1.5vw,2rem)] text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex min-h-[clamp(2.5rem,3.5vw,3rem)] items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PracticeLogo, {
									mark: practice.mark,
									name: practice.name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-[clamp(0.875rem,1.8vw,1.5rem)] font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase",
								children: practice.country
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-[clamp(0.875rem,1.8vw,1.5rem)] max-w-[11rem] font-body text-xs leading-snug text-navy",
								children: practice.description
							})
						]
					})
				}, practice.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: closingRef,
				className: "shell-narrow mt-[clamp(2.5rem,5vw,4.5rem)] text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[clamp(0.5625rem,0.75vw,0.6875rem)] font-bold tracking-eyebrow text-navy uppercase",
					children: "Collaboration beyond borders. Architecture without limits."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "mx-auto mt-2 block h-0 w-[clamp(1.5rem,2.5vw,2rem)] border-t-2 border-accent-blue"
				})]
			})
		]
	});
}
function PartnersClosing() {
	const headingRef = useSplitLines();
	const ref = useReveal({
		selector: "[data-reveal]",
		y: 26
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "demands",
		className: "bg-white pb-[clamp(3.5rem,8vw,7.5rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref,
			className: "shell-narrow grid grid-cols-1 items-center gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "font-display text-[clamp(0.5625rem,0.72vw,0.6875rem)] font-bold tracking-eyebrow text-slate uppercase",
						children: "06 — Built around the demands"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						ref: headingRef,
						className: "mt-[clamp(1rem,2vw,1.5rem)] max-w-[16ch] font-display text-[clamp(1.75rem,3.2vw,3.5rem)] leading-[1.12] font-medium tracking-section text-balance text-navy",
						children: "Built around the demands of architecture."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-reveal": true,
						className: "mt-[clamp(1.25rem,2.4vw,2rem)] max-w-[28rem] font-body text-[clamp(0.8125rem,1vw,0.9375rem)] leading-relaxed text-slate",
						children: "From the first line on paper to the final fix on site, we bring the systems, engineering and execution together."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-reveal": true,
						className: "mt-[clamp(1.5rem,3vw,2.25rem)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaButton, {
							href: "/contact",
							variant: "solid",
							children: "Talk to our team"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-reveal": true,
				"aria-hidden": "true",
				className: "min-w-0 rounded-[0.75rem] bg-glass aspect-[16/11] w-full"
			})]
		})
	});
}
function Partners() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative bg-white font-body text-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				tabIndex: -1,
				className: "scroll-mt-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnersHero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InternationalNetwork, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadingPractices, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnersClosing, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurallFooter, {})
		]
	});
}
//#endregion
export { Partners as component };
