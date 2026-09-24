import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as useReveal, l as useSplitLines, s as useReducedMotion } from "./anim-BIreCG3R.mjs";
import { i as DurallFooter, n as ArrowRight, o as SiteHeader } from "./DurallFooter-CgBY-amo.mjs";
import { a as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as Phone, c as Mail, s as MapPin } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-5ur9tj9I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Page opening, built to the same shape as ProjectsIntro: a quiet white band
* rather than the full-height photographic hero /about and /partners use. A
* contact page should not ask for a viewport of scrolling before the form is
* reachable, and this is the pattern the site already has for that.
*/
function ContactIntro() {
	const headingRef = useSplitLines({
		start: "top 95%",
		delay: .15
	});
	const ref = useReveal({
		selector: "[data-reveal]",
		y: 26,
		delay: .1
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative bg-white pt-[max(calc(var(--header-h)+2rem),clamp(5.5rem,9vw,9.5rem))] pb-[clamp(2rem,3.5vw,3.5rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref,
			className: "shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-reveal": true,
					className: "font-display text-[0.6875rem] font-bold tracking-eyebrow text-accent-blue uppercase",
					children: "07 — Contact"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					ref: headingRef,
					className: "mt-[clamp(1rem,2vw,1.5rem)] max-w-[60rem] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.06] font-medium tracking-section text-balance text-navy",
					children: "Start a conversation."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-reveal": true,
					className: "mt-[clamp(1.5rem,2.4vw,2.75rem)] max-w-[34rem] font-body text-[clamp(0.9375rem,1.1vw,1rem)] leading-relaxed text-pretty text-slate",
					children: "Tell us about the project — its stage, its site, and what the envelope has to do. We’ll put you in front of the engineer who can answer it."
				})
			]
		})
	});
}
/**
* Direct contact details.
*
* TODO — every value below is a deliberate placeholder. The codebase contains
* no real email, phone number or address for Durall, and inventing plausible
* ones would be worse than obviously fake ones: a real-looking number is the
* kind of thing that ships. Replace `value` and `href` on each entry; the
* labels, icons and layout need no changes.
*/
var DETAILS = [
	{
		icon: Mail,
		label: "Email",
		value: "hello@example.com",
		href: "mailto:hello@example.com",
		note: "For project enquiries and technical drawings."
	},
	{
		icon: Phone,
		label: "Phone",
		value: "+00 00000 00000",
		href: "tel:+000000000000",
		note: "Weekdays, 9:30 to 18:00 IST."
	},
	{
		icon: MapPin,
		label: "Studio",
		value: [
			"Address line one",
			"Address line two",
			"City, State 000000"
		],
		href: null,
		note: "Visits by appointment."
	}
];
var RESPONSE_NOTE = "A member of the Durall engineering team will respond within two working days.";
/**
* The single point to swap for a real submission.
*
* There is no backend, so this stands in for one: it takes a realistic amount
* of time, and it can genuinely fail, which is what makes the form's loading
* and error states reachable rather than decorative. Replace the body with a
* `fetch` to whatever endpoint the enquiries should reach — the form only
* cares about the `SubmitResult` shape.
*
* Two ways to reach the failure path deliberately:
*   - go offline; the check below is real, not simulated
*   - append `?simulateError` to the URL, for demoing the error state
*/
async function submitEnquiry(_values) {
	await new Promise((resolve) => setTimeout(resolve, 1200));
	if (typeof navigator !== "undefined" && navigator.onLine === false) return {
		ok: false,
		message: "That didn’t send — you appear to be offline. Check your connection and try again; nothing you typed has been lost."
	};
	if (typeof window !== "undefined" && window.location.search.includes("simulateError")) return {
		ok: false,
		message: "That didn’t send — our enquiry service is not responding. Try again in a moment, or email us directly using the address alongside this form."
	};
	return { ok: true };
}
var EMPTY = {
	name: "",
	email: "",
	subject: "",
	message: ""
};
var RULES = {
	name: (v) => v.trim().length === 0 ? "Enter your name so we know who we’re replying to." : v.trim().length < 2 ? "That looks too short — enter your full name." : null,
	email: (v) => v.trim().length === 0 ? "Enter an email address so we can reply." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "That doesn’t look like a complete email address — check for a missing @ or domain.",
	subject: (v) => v.trim().length === 0 ? "Add a subject so we can route your enquiry." : null,
	message: (v) => v.trim().length === 0 ? "Tell us a little about the project." : v.trim().length < 20 ? "A sentence or two more will help us point you at the right engineer." : null
};
var FIELD_ORDER = [
	"name",
	"email",
	"subject",
	"message"
];
/** Label, underline and error treatment shared by the inputs and the textarea. */
function fieldShell(invalid) {
	return ["mt-2 flex min-w-0 items-center border-b transition-colors", invalid ? "border-destructive" : "border-navy/20 focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy"].join(" ");
}
var LABEL_CLASS = "block font-display text-xs font-bold tracking-eyebrow text-navy uppercase";
var CONTROL_CLASS = "w-full min-w-0 bg-transparent font-body text-base text-navy outline-hidden placeholder:text-navy/45 sm:text-sm";
function EnquiryForm() {
	const reduced = useReducedMotion();
	const formRef = (0, import_react.useRef)(null);
	const [values, setValues] = (0, import_react.useState)(EMPTY);
	const [touched, setTouched] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [failure, setFailure] = (0, import_react.useState)(null);
	const [sent, setSent] = (0, import_react.useState)(false);
	const validate = (name, value) => RULES[name](value);
	const handleChange = (name, value) => {
		setValues((prev) => ({
			...prev,
			[name]: value
		}));
		if (touched[name]) setErrors((prev) => ({
			...prev,
			[name]: validate(name, value) ?? void 0
		}));
	};
	const handleBlur = (name) => {
		setTouched((prev) => ({
			...prev,
			[name]: true
		}));
		setErrors((prev) => ({
			...prev,
			[name]: validate(name, values[name]) ?? void 0
		}));
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (status === "submitting") return;
		const next = {};
		for (const name of FIELD_ORDER) {
			const message = validate(name, values[name]);
			if (message) next[name] = message;
		}
		setErrors(next);
		setTouched({
			name: true,
			email: true,
			subject: true,
			message: true
		});
		const firstInvalid = FIELD_ORDER.find((name) => next[name]);
		if (firstInvalid) {
			formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
			return;
		}
		setFailure(null);
		setStatus("submitting");
		const result = await submitEnquiry(values);
		if (result.ok) {
			setSent(true);
			setStatus("idle");
			setValues(EMPTY);
			setTouched({});
		} else {
			setFailure(result.message);
			setStatus("error");
		}
	};
	const describedBy = (name) => errors[name] ? `${name}-error` : void 0;
	const fieldProps = (name) => ({
		id: name,
		name,
		value: values[name],
		onChange: (event) => handleChange(name, event.target.value),
		onBlur: () => handleBlur(name),
		"aria-invalid": errors[name] ? true : void 0,
		"aria-describedby": describedBy(name),
		className: CONTROL_CLASS
	});
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
				transition: { duration: reduced ? .2 : .4 },
				className: "border-t border-navy-14 pt-[clamp(1.5rem,2.4vw,2rem)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] text-balance text-navy",
						children: "Thank you — your enquiry is with us."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-[34rem] font-body text-sm leading-relaxed text-pretty text-slate",
						children: RESPONSE_NOTE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSent(false),
						className: "mt-6 inline-flex min-h-11 items-center gap-3 border-b border-navy-14 font-display text-xs font-bold tracking-button text-navy uppercase transition-colors hover:border-navy motion-safe:transition-[color,border-color,transform] motion-safe:hover:translate-x-0.5",
						children: ["Send Another Enquiry", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
					})
				]
			}, "sent") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
				ref: formRef,
				noValidate: true,
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: reduced ? .2 : .3 },
				onSubmit: handleSubmit,
				className: "flex flex-col gap-[clamp(1.5rem,2.4vw,2rem)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-[clamp(1.5rem,2.4vw,2rem)] sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "name",
									className: LABEL_CLASS,
									children: "Your Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: fieldShell(Boolean(errors.name)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										...fieldProps("name"),
										type: "text",
										autoComplete: "name",
										placeholder: "Jane Mehta…",
										className: `${CONTROL_CLASS} min-h-11`
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
									name: "name",
									message: errors.name
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "email",
									className: LABEL_CLASS,
									children: "Your Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: fieldShell(Boolean(errors.email)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										...fieldProps("email"),
										type: "email",
										autoComplete: "email",
										inputMode: "email",
										spellCheck: false,
										placeholder: "jane@studio.com…",
										className: `${CONTROL_CLASS} min-h-11`
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
									name: "email",
									message: errors.email
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "subject",
								className: LABEL_CLASS,
								children: "Subject"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: fieldShell(Boolean(errors.subject)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									...fieldProps("subject"),
									type: "text",
									autoComplete: "off",
									placeholder: "Sliding systems for a coastal residence…",
									className: `${CONTROL_CLASS} min-h-11`
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
								name: "subject",
								message: errors.subject
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "message",
								className: LABEL_CLASS,
								children: "Your Message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `${fieldShell(Boolean(errors.message))} items-start`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									...fieldProps("message"),
									rows: 5,
									autoComplete: "off",
									placeholder: "Tell us about the project — location, stage, and what you need from the envelope…",
									className: `${CONTROL_CLASS} resize-y py-2`
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
								name: "message",
								message: errors.message
							})
						]
					}),
					status === "error" && failure ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "border-l-2 border-destructive bg-paper py-3 pr-4 pl-4 font-body text-sm leading-relaxed text-pretty text-navy",
						children: failure
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: status === "submitting",
						"aria-busy": status === "submitting",
						className: "mt-2 flex min-h-12 w-full items-center justify-center gap-4 bg-navy py-4 font-display text-xs font-bold tracking-button text-white uppercase transition-colors hover:bg-[#0b1152] disabled:cursor-progress disabled:bg-navy/70 motion-safe:transition-[background-color,transform] motion-safe:not-disabled:hover:-translate-y-0.5 sm:w-auto sm:px-[clamp(1.5rem,3vw,2.5rem)]",
						children: [status === "submitting" ? "Sending…" : "Send Enquiry", status === "submitting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 16 16",
							fill: "none",
							"aria-hidden": "true",
							className: "h-4 w-4 shrink-0 motion-safe:animate-spin",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "8",
								cy: "8",
								r: "6.5",
								stroke: "currentColor",
								strokeOpacity: "0.35"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M14.5 8A6.5 6.5 0 0 0 8 1.5",
								stroke: "currentColor",
								strokeLinecap: "round"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 24 16",
							fill: "none",
							"aria-hidden": "true",
							className: "h-4 w-6 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M0 8h22M17 3l5 5-5 5",
								stroke: "currentColor",
								strokeWidth: "1.1"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-body text-xs leading-relaxed text-slate",
						children: RESPONSE_NOTE
					})
				]
			}, "form")
		})
	});
}
function FieldError({ name, message }) {
	if (!message) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		id: `${name}-error`,
		role: "alert",
		className: "mt-2 font-body text-xs leading-relaxed text-pretty text-destructive",
		children: message
	});
}
/**
* Form and direct lines, side by side.
*
* The three-track grid with a hairline between the columns is the same one
* AboutPhilosophy uses, down to the `1px` track and the `bg-navy-14` rule, so
* the page sits on the site's existing rhythm rather than a new one.
*/
function ContactBody() {
	const formRef = useReveal({
		y: 40,
		duration: 1.1
	});
	const detailsRef = useReveal({
		selector: "[data-reveal]",
		y: 24
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white pt-[clamp(2rem,4vw,3.5rem)] pb-[clamp(4rem,8vw,9rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell grid grid-cols-1 gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,1.15fr)_1px_minmax(0,0.75fr)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: formRef,
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
						children: "Send an Enquiry"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-[clamp(1.5rem,2.4vw,2rem)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					className: "hidden w-px bg-navy-14 lg:block"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: detailsRef,
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							"data-reveal": true,
							className: "font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
							children: "Direct Lines"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-[clamp(1.5rem,2.4vw,2rem)] space-y-[clamp(1.75rem,2.6vw,2.25rem)]",
							children: DETAILS.map(({ icon: Icon, label, value, href, note }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-reveal": true,
								className: "flex min-w-0 items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-14 bg-paper",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										"aria-hidden": "true",
										className: "h-5 w-5 text-navy",
										strokeWidth: 1.4
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
										children: label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "mt-1.5 min-w-0",
										children: [Array.isArray(value) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("address", {
											className: "font-body text-sm leading-relaxed break-words text-navy not-italic",
											children: value.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block",
												children: line
											}, line))
										}) : href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href,
											className: "inline-flex min-h-11 items-center font-body text-sm leading-relaxed break-all text-navy underline decoration-navy-14 underline-offset-4 transition-colors hover:decoration-navy",
											children: value
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-body text-sm leading-relaxed text-navy",
											children: value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block font-body text-xs leading-relaxed text-pretty text-slate",
											children: note
										})]
									})]
								})]
							}, label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							"data-reveal": true,
							className: "mt-[clamp(2rem,3vw,2.5rem)] border-t border-navy-14 pt-[clamp(1.25rem,2vw,1.75rem)] font-display text-[0.6875rem] leading-[2.1] font-medium tracking-eyebrow text-navy uppercase",
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
							className: "mt-4 block h-px w-8 bg-accent-blue"
						})
					]
				})
			]
		})
	});
}
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative bg-white font-body text-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { variant: "light" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				tabIndex: -1,
				className: "scroll-mt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactIntro, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactBody, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurallFooter, {})
		]
	});
}
//#endregion
export { ContactPage as component };
