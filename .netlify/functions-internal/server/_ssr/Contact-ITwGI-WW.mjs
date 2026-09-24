import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as useReveal, l as useSplitLines, s as useReducedMotion } from "./anim-BIreCG3R.mjs";
import { t as IMAGES } from "./images-DAzp0ysB.mjs";
import { a as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Contact-ITwGI-WW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OVERLAY = {
	eyebrow: "font-display text-[0.6cqw] font-bold tracking-eyebrow text-navy uppercase",
	heading: "mt-[1.7cqw] font-serif text-[1.75cqw] leading-[1.32] text-navy",
	rule: "mt-[1.6cqw] block h-px w-[1.8cqw] bg-navy/60",
	lede: "mt-[1.5cqw] font-body text-[0.78cqw] leading-[1.9] text-navy/75",
	formGap: "flex flex-col gap-[1.35cqw]",
	fieldGap: "gap-[0.95cqw] pb-[0.7cqw]",
	input: "font-body text-[0.74cqw]",
	icon: "h-[0.85cqw] w-[0.85cqw] text-navy",
	button: "mt-[1.1cqw] gap-[1.2cqw] py-[1.25cqw] font-display text-[0.7cqw] font-bold tracking-button",
	buttonArrow: "h-[0.75cqw] w-[1.6cqw]",
	sentHeading: "font-serif text-[1.5cqw] text-navy",
	sentBody: "mt-[1.2cqw] font-body text-[0.78cqw] leading-[1.8] text-navy/75",
	sentBtn: "mt-[1.6cqw] font-display text-[0.66cqw] font-bold tracking-button"
};
var RESPONSIVE = {
	eyebrow: "font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
	heading: "mt-5 font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.12] text-balance text-navy",
	rule: "mt-6 block h-px w-8 bg-navy/60",
	lede: "mt-5 max-w-[34rem] font-body text-[clamp(0.9375rem,1.5vw,1rem)] leading-relaxed text-pretty text-navy/75",
	formGap: "flex flex-col gap-5",
	fieldGap: "gap-3 pb-2",
	input: "min-h-11 font-body text-base sm:text-sm",
	icon: "h-4 w-4 text-navy",
	button: "mt-2 min-h-12 gap-4 py-4 font-display text-xs font-bold tracking-button",
	buttonArrow: "h-4 w-6",
	sentHeading: "font-serif text-[clamp(1.75rem,4vw,2.5rem)] text-balance text-navy",
	sentBody: "mt-4 font-body text-sm leading-relaxed text-navy/75",
	sentBtn: "mt-6 inline-flex min-h-11 items-center font-display text-xs font-bold tracking-button"
};
function Field({ id, label, type = "text", icon, s, autoComplete, inputMode, required, spellCheck }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex min-w-0 items-center border-b border-navy/20 transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy ${s.fieldGap}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "shrink-0",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: "sr-only",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				name: id,
				type,
				autoComplete,
				inputMode,
				spellCheck,
				required,
				placeholder: `${label}…`,
				className: `w-full min-w-0 bg-transparent text-navy outline-hidden placeholder:text-navy/60 ${s.input}`
			})
		]
	});
}
function Invitation({ s }) {
	const headingRef = useSplitLines();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: s.eyebrow,
				children: "Start a Conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				ref: headingRef,
				className: s.heading,
				children: [
					"We’re here to",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"help you build",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"what’s next."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: s.rule
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: s.lede,
				children: "From concept to completion, our team is with you at every step."
			})
		]
	});
}
function Enquiry({ s, sent, setSent, reduced, idPrefix }) {
	const id = (name) => `${idPrefix}-${name}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-w-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			mode: "wait",
			children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				role: "status",
				"aria-live": "polite",
				initial: {
					opacity: 0,
					y: reduced ? 0 : 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: { opacity: 0 },
				transition: { duration: .4 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: s.sentHeading,
						children: "Thank you — your enquiry is with us."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: s.sentBody,
						children: "A member of the Durall engineering team will respond within two working days."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSent(false),
						className: `${s.sentBtn} text-navy uppercase underline`,
						children: "Send Another Enquiry"
					})
				]
			}, "sent") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 },
				className: s.formGap,
				onSubmit: (event) => {
					event.preventDefault();
					setSent(true);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: id("name"),
						label: "Your name",
						s,
						required: true,
						autoComplete: "name",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 16 16",
							fill: "none",
							className: s.icon,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "8",
								cy: "5",
								r: "2.6",
								stroke: "currentColor",
								strokeWidth: "1.2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M2.8 14c0-2.7 2.3-4.4 5.2-4.4S13.2 11.3 13.2 14",
								stroke: "currentColor",
								strokeWidth: "1.2"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: id("email"),
						label: "Your email",
						type: "email",
						s,
						required: true,
						autoComplete: "email",
						inputMode: "email",
						spellCheck: false,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 16 16",
							fill: "none",
							className: s.icon,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "1.6",
								y: "3.4",
								width: "12.8",
								height: "9.2",
								stroke: "currentColor",
								strokeWidth: "1.2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M1.6 4.2 8 8.8l6.4-4.6",
								stroke: "currentColor",
								strokeWidth: "1.2"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: id("studio"),
						label: "Studio / Company",
						s,
						autoComplete: "organization",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 16 16",
							fill: "none",
							className: s.icon,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M2.5 14V2.6h6.2V14M8.7 6h4.8V14",
								stroke: "currentColor",
								strokeWidth: "1.2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M4.6 5h2M4.6 8h2M4.6 11h2M10.4 9h1.4",
								stroke: "currentColor",
								strokeWidth: "1.2"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex min-w-0 items-center border-b border-navy/20 transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy ${s.fieldGap}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 16 16",
									fill: "none",
									className: s.icon,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M8 2 14.5 5.4 8 8.8 1.5 5.4 8 2Z",
										stroke: "currentColor",
										strokeWidth: "1.2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M1.5 9.2 8 12.6l6.5-3.4",
										stroke: "currentColor",
										strokeWidth: "1.2"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: id("projectType"),
								className: "sr-only",
								children: "Project type"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: id("projectType"),
								name: "projectType",
								defaultValue: "",
								style: {
									backgroundColor: "transparent",
									color: "inherit"
								},
								className: `w-full min-w-0 appearance-none bg-transparent text-navy/60 outline-hidden ${s.input}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										disabled: true,
										children: "Project type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Private residence" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Hospitality" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Commercial façade" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Institutional" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 16 16",
								fill: "none",
								className: s.icon,
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M3.5 6l4.5 4.5L12.5 6",
									stroke: "currentColor",
									strokeWidth: "1.2"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex min-w-0 items-start border-b border-navy/20 transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy ${s.fieldGap}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "shrink-0 pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 16 16",
									fill: "none",
									className: s.icon,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M11.2 2.4l2.4 2.4L5.6 12.8H3.2v-2.4l8-8Z",
										stroke: "currentColor",
										strokeWidth: "1.2"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: id("message"),
								className: "sr-only",
								children: "Tell us about your project"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: id("message"),
								name: "message",
								rows: 2,
								autoComplete: "off",
								placeholder: "Tell us about your project…",
								className: `w-full min-w-0 resize-none bg-transparent text-navy outline-hidden placeholder:text-navy/60 ${s.input}`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						type: "submit",
						className: `flex w-full items-center justify-center bg-navy text-white uppercase ${s.button}`,
						whileHover: reduced ? { opacity: .9 } : {
							y: -2,
							backgroundColor: "#0b1152"
						},
						whileTap: reduced ? {} : { scale: .995 },
						transition: {
							type: "spring",
							stiffness: 300,
							damping: 22
						},
						children: ["Send Enquiry", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 24 16",
							fill: "none",
							"aria-hidden": "true",
							className: `shrink-0 ${s.buttonArrow}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M0 8h22M17 3l5 5-5 5",
								stroke: "currentColor",
								strokeWidth: "1.1"
							})
						})]
					})
				]
			}, "form")
		})
	});
}
function Contact() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const reduced = useReducedMotion();
	const wrapRef = useReveal({
		y: 40,
		duration: 1.1
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "scroll-mt-24 bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: wrapRef,
			className: "mx-auto w-full max-w-[120rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-[100rem]:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[1920/826] w-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						...IMAGES.contactFrame,
						alt: "Durall glazing systems framing a contemporary architectural interior",
						loading: "lazy",
						decoding: "async",
						className: "h-full w-full object-cover object-center"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shell grid grid-cols-1 gap-[clamp(3rem,7vw,5rem)] py-[clamp(4rem,9vw,7rem)] md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Invitation, { s: RESPONSIVE }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Enquiry, {
						s: RESPONSIVE,
						sent,
						setSent,
						reduced,
						idPrefix: "responsive"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "@container relative hidden aspect-[1920/826] w-full min-[100rem]:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						...IMAGES.contactFrame,
						alt: "",
						"aria-hidden": "true",
						loading: "lazy",
						decoding: "async",
						className: "block w-full"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-[14.8%] left-[19.1%] w-[17.5%]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Invitation, { s: OVERLAY })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-[15.3%] left-[47.1%] w-[27.6%]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Enquiry, {
							s: OVERLAY,
							sent,
							setSent,
							reduced,
							idPrefix: "plate"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-[38%] left-[85%] w-[12%]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "absolute -left-[2.6cqw] -top-[7cqw] block h-[17cqw] w-px bg-navy/40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-[0.62cqw] leading-[2.1] font-medium tracking-eyebrow text-navy uppercase",
								children: [
									"Architecture",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"starts with",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"a conversation."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "mt-[1.2cqw] block h-px w-[1.8cqw] bg-navy/50"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { Contact as t };
