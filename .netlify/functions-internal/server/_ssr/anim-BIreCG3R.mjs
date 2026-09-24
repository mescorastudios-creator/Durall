import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/anim-BIreCG3R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function prefersReducedMotion() {
	if (typeof window === "undefined") return true;
	return window.matchMedia(REDUCED_QUERY).matches;
}
/** Reactive version for render-time decisions (false during SSR/first paint). */
function useReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia(REDUCED_QUERY);
		setReduced(mq.matches);
		const onChange = () => setReduced(mq.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}
var loader = null;
/** Loads GSAP + ScrollTrigger once, on the client only. */
function loadGsap() {
	if (!loader) loader = (async () => {
		const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("../_libs/gsap.mjs").then((n) => n.t), import("../_libs/gsap.mjs").then((n) => n.n)]);
		gsap.registerPlugin(ScrollTrigger);
		return {
			gsap,
			ScrollTrigger
		};
	})();
	return loader;
}
/**
* Drops the `anim-pending` class that __root.tsx's inline script put on
* <html> to hide entrance-animated content before first paint.
*
* Called once a hook has actually created its tween — GSAP's `from` tweens
* write their start state as inline styles, which outrank the class rule, so
* by the next frame the element is held by the tween rather than by the CSS
* and the class is safe to remove. Deferring a frame avoids a one-frame flash
* between the two.
*/
function markAnimReady() {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	if (!root.classList.contains("anim-pending")) return;
	requestAnimationFrame(() => root.classList.remove("anim-pending"));
}
/**
* Scroll-triggered fade + upward translate. Falls back to the final state
* immediately when the user prefers reduced motion.
*/
function useReveal(options = {}) {
	const ref = (0, import_react.useRef)(null);
	const { selector, y = 32, stagger = .1, start = "top 85%", duration = .9, delay = 0, scrub, end } = options;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		loadGsap().then(({ gsap }) => {
			if (cancelled || !ref.current) return;
			const targets = selector ? Array.from(el.querySelectorAll(selector)) : [el];
			if (!targets.length) return;
			const tween = gsap.from(targets, {
				opacity: 0,
				y,
				duration,
				delay,
				ease: scrub ? "none" : "power3.out",
				stagger,
				scrollTrigger: {
					trigger: el,
					start,
					...scrub ? {
						scrub,
						end: end ?? "top 30%"
					} : {}
				}
			});
			markAnimReady();
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
	return ref;
}
/**
* The shared hero entrance: a line-by-line masked reveal of the heading, the
* supporting `[data-hero-fade]` block behind it, and a slow settle plus
* scroll parallax on the backdrop image.
*
* Hero.tsx and AboutHero.tsx each carried their own byte-identical copy of
* this timeline. One implementation keeps them in step.
*/
function useHeroIntro() {
	const sectionRef = (0, import_react.useRef)(null);
	const headingRef = (0, import_react.useRef)(null);
	const imageRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const section = sectionRef.current;
		const heading = headingRef.current;
		if (!section || !heading || prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		(async () => {
			const [{ gsap }, { default: SplitType }] = await Promise.all([loadGsap(), import("../_libs/split-type.mjs").then((n) => n.t)]);
			if (cancelled || !sectionRef.current) return;
			const supporting = section.querySelectorAll("[data-hero-fade]");
			const split = new SplitType(heading, {
				types: "lines",
				lineClass: "hero-line"
			});
			(split.lines ?? []).forEach((line) => {
				line.style.display = "block";
				line.style.overflow = "hidden";
				const inner = document.createElement("span");
				inner.className = "hero-line-inner block will-change-transform";
				while (line.firstChild) inner.appendChild(line.firstChild);
				line.appendChild(inner);
			});
			const inners = Array.from(heading.querySelectorAll(".hero-line-inner"));
			const tl = gsap.timeline({
				defaults: { ease: "power4.out" },
				onComplete: () => {
					inners.forEach((inner) => {
						inner.style.willChange = "auto";
					});
				}
			});
			gsap.set(heading, { opacity: 1 });
			tl.from(inners, {
				yPercent: 110,
				duration: 1.15,
				stagger: .12
			}).from(supporting, {
				opacity: 0,
				y: 26,
				duration: .85,
				stagger: .12
			}, "-=0.6");
			let parallax;
			const image = imageRef.current;
			if (image) {
				tl.from(image, {
					scale: 1.08,
					duration: 2.2,
					ease: "power2.out"
				}, 0);
				parallax = gsap.fromTo(image, { yPercent: 0 }, {
					yPercent: 12,
					ease: "none",
					immediateRender: false,
					scrollTrigger: {
						trigger: section,
						start: "top top",
						end: "bottom top",
						scrub: 1.1
					}
				});
			}
			markAnimReady();
			dispose = () => {
				parallax?.scrollTrigger?.kill();
				parallax?.kill();
				tl.kill();
				split.revert();
			};
		})();
		return () => {
			cancelled = true;
			dispose();
		};
	}, []);
	return {
		sectionRef,
		headingRef,
		imageRef
	};
}
/** Subtle scrubbed parallax on a layered image. */
function useParallax(strength = 10) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		loadGsap().then(({ gsap }) => {
			if (cancelled || !ref.current) return;
			const tween = gsap.fromTo(el, { yPercent: -strength / 2 }, {
				yPercent: strength / 2,
				ease: "none",
				scrollTrigger: {
					trigger: el.parentElement ?? el,
					start: "top bottom",
					end: "bottom top",
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
	}, [strength]);
	return ref;
}
/**
* Line-by-line masked heading reveal (split-type + GSAP).
* Reduced motion leaves the heading untouched.
*/
function useSplitLines(options = {}) {
	const ref = (0, import_react.useRef)(null);
	const { start = "top 88%", stagger = .12, duration = 1.1, delay = 0 } = options;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		(async () => {
			const [{ gsap }, { default: SplitType }] = await Promise.all([loadGsap(), import("../_libs/split-type.mjs").then((n) => n.t)]);
			if (cancelled || !ref.current) return;
			let split;
			let tween;
			let resizeTimer;
			let measuredWidth = el.clientWidth;
			const build = () => {
				tween?.scrollTrigger?.kill();
				tween?.kill();
				split?.revert();
				split = new SplitType(el, {
					types: "lines",
					lineClass: "split-line"
				});
				const lines = split.lines ?? [];
				lines.forEach((line) => {
					line.style.overflow = "hidden";
					line.style.display = "block";
				});
				const inners = lines.map((line) => {
					const inner = document.createElement("span");
					inner.style.display = "block";
					inner.style.willChange = "transform, opacity";
					while (line.firstChild) inner.appendChild(line.firstChild);
					line.appendChild(inner);
					return inner;
				});
				tween = gsap.from(inners, {
					yPercent: 115,
					opacity: 0,
					duration,
					delay,
					stagger,
					ease: "expo.out",
					scrollTrigger: {
						trigger: el,
						start
					},
					onComplete: () => {
						inners.forEach((inner) => {
							inner.style.willChange = "auto";
						});
					}
				});
				markAnimReady();
			};
			build();
			const onResize = () => {
				if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(() => {
					const nextWidth = el.clientWidth;
					if (Math.abs(nextWidth - measuredWidth) > 1) {
						measuredWidth = nextWidth;
						build();
					}
				}, 175);
			};
			const observer = new ResizeObserver(onResize);
			observer.observe(el);
			document.fonts?.ready.then(onResize);
			dispose = () => {
				if (resizeTimer) clearTimeout(resizeTimer);
				observer.disconnect();
				tween?.scrollTrigger?.kill();
				tween?.kill();
				split?.revert();
			};
		})();
		return () => {
			cancelled = true;
			dispose();
		};
	}, []);
	return ref;
}
/**
* Cinematic image reveal: a scrubbed clip-path uncover plus a slow inner
* scale drift, tied to scroll position. Attach to the image wrapper.
*/
function useClipReveal(options = {}) {
	const ref = (0, import_react.useRef)(null);
	const { from = "bottom", inner = "img", scale = 1.14 } = options;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		let dispose = () => {};
		let cancelled = false;
		loadGsap().then(({ gsap }) => {
			if (cancelled || !ref.current) return;
			const media = Array.from(el.querySelectorAll(inner));
			const tl = gsap.timeline({ scrollTrigger: {
				trigger: el,
				start: "top 92%",
				end: "top 45%",
				scrub: 1.2
			} });
			tl.fromTo(el, {
				clipPath: from === "bottom" ? "inset(18% 0% 0% 0%)" : "inset(0% 0% 18% 0%)",
				opacity: .35
			}, {
				clipPath: "inset(0% 0% 0% 0%)",
				opacity: 1,
				ease: "none"
			}, 0);
			if (media.length) tl.fromTo(media, { scale }, {
				scale: 1,
				ease: "none"
			}, 0);
			markAnimReady();
			dispose = () => {
				tl.scrollTrigger?.kill();
				tl.kill();
				gsap.set(el, { clearProps: "clipPath,opacity" });
				if (media.length) gsap.set(media, { clearProps: "transform" });
			};
		});
		return () => {
			cancelled = true;
			dispose();
		};
	}, []);
	return ref;
}
//#endregion
export { useHeroIntro as a, useReveal as c, useClipReveal as i, useSplitLines as l, loadGsap as n, useParallax as o, prefersReducedMotion as r, useReducedMotion as s, REDUCED_QUERY as t };
