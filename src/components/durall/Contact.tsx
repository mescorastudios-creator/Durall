import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IMAGES } from "@/assets/images";
import { useReveal, useSplitLines } from "@/lib/anim";
import { useReducedMotion } from "@/lib/motion-prefs";

/**
 * The contact frame is a single photographic plate whose glazing bars sit at
 * fixed proportions, so the overlay that sits on it is sized in container
 * query units and scales with the plate.
 *
 * That plate was shown from 1024px up, where `0.78cqw` body copy resolves to
 * under 10px — the lede measured 9.98px and the form inputs 9.47px at a
 * 1280px viewport. It only reaches a readable size near the 1920px width it
 * was drawn for, so it now starts at 1600px (`min-[100rem]`), and everything
 * below gets the responsive two-column layout, whose sizes are set in
 * clamp()s with real floors.
 *
 * The breakpoint is written out literally at both call sites rather than
 * shared through a constant — Tailwind scans source text for whole class
 * names, and a name assembled in a template literal is never generated.
 */
type Skin = {
  eyebrow: string;
  heading: string;
  rule: string;
  lede: string;
  fieldGap: string;
  input: string;
  icon: string;
  button: string;
  buttonArrow: string;
  sentHeading: string;
  sentBody: string;
  sentBtn: string;
  formGap: string;
};

const OVERLAY: Skin = {
  eyebrow: "font-display text-[0.6cqw] font-bold tracking-eyebrow text-navy uppercase",
  heading: "mt-[1.7cqw] font-serif text-[1.75cqw] leading-[1.32] text-navy",
  rule: "mt-[1.6cqw] block h-px w-[1.8cqw] bg-navy/60",
  lede: "mt-[1.5cqw] font-body text-[0.78cqw] leading-[1.9] text-navy/75",
  formGap: "flex flex-col gap-[1.35cqw]",
  fieldGap: "gap-[0.95cqw] pb-[0.7cqw]",
  input: "font-body text-[0.74cqw]",
  icon: "h-[0.85cqw] w-[0.85cqw] text-navy",
  button:
    "mt-[1.1cqw] gap-[1.2cqw] py-[1.25cqw] font-display text-[0.7cqw] font-bold tracking-button",
  buttonArrow: "h-[0.75cqw] w-[1.6cqw]",
  sentHeading: "font-serif text-[1.5cqw] text-navy",
  sentBody: "mt-[1.2cqw] font-body text-[0.78cqw] leading-[1.8] text-navy/75",
  sentBtn: "mt-[1.6cqw] font-display text-[0.66cqw] font-bold tracking-button",
};

const RESPONSIVE: Skin = {
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
  sentBtn: "mt-6 inline-flex min-h-11 items-center font-display text-xs font-bold tracking-button",
};

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  icon: React.ReactNode;
  s: Skin;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel" | "url";
  required?: boolean;
  spellCheck?: boolean;
};

function Field({
  id,
  label,
  type = "text",
  icon,
  s,
  autoComplete,
  inputMode,
  required,
  spellCheck,
}: FieldProps) {
  return (
    <div
      // focus-within is the visible focus affordance for the field, since the
      // input itself suppresses its own ring to keep the hairline underline.
      className={`flex min-w-0 items-center border-b border-navy/20 transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy ${s.fieldGap}`}
    >
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        spellCheck={spellCheck}
        required={required}
        placeholder={`${label}…`}
        className={`w-full min-w-0 bg-transparent text-navy outline-hidden placeholder:text-navy/60 ${s.input}`}
      />
    </div>
  );
}

function Invitation({ s }: { s: Skin }) {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  return (
    <div className="min-w-0">
      <p className={s.eyebrow}>Start a Conversation</p>
      <h2 ref={headingRef} className={s.heading}>
        We&rsquo;re here to
        <br />
        help you build
        <br />
        what&rsquo;s next.
      </h2>
      <span aria-hidden="true" className={s.rule} />
      <p className={s.lede}>From concept to completion, our team is with you at every step.</p>
    </div>
  );
}

function Enquiry({
  s,
  sent,
  setSent,
  reduced,
  idPrefix,
}: {
  s: Skin;
  sent: boolean;
  setSent: (value: boolean) => void;
  reduced: boolean;
  idPrefix: string;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="min-w-0">
      {/* The confirmation replaces the form, so announce it rather than
          leaving screen-reader users on a form that silently vanished. */}
      <AnimatePresence initial={false} mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className={s.sentHeading}>Thank you — your enquiry is with us.</p>
            <p className={s.sentBody}>
              A member of the Durall engineering team will respond within two working days.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className={`${s.sentBtn} text-navy uppercase underline`}
            >
              Send Another Enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={s.formGap}
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <Field
              id={id("name")}
              label="Your name"
              s={s}
              required
              autoComplete="name"
              icon={
                <svg viewBox="0 0 16 16" fill="none" className={s.icon}>
                  <circle cx="8" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="M2.8 14c0-2.7 2.3-4.4 5.2-4.4S13.2 11.3 13.2 14"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              }
            />
            <Field
              id={id("email")}
              label="Your email"
              type="email"
              s={s}
              required
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              icon={
                <svg viewBox="0 0 16 16" fill="none" className={s.icon}>
                  <rect
                    x="1.6"
                    y="3.4"
                    width="12.8"
                    height="9.2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="M1.6 4.2 8 8.8l6.4-4.6" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              }
            />
            <Field
              id={id("studio")}
              label="Studio / Company"
              s={s}
              autoComplete="organization"
              icon={
                <svg viewBox="0 0 16 16" fill="none" className={s.icon}>
                  <path
                    d="M2.5 14V2.6h6.2V14M8.7 6h4.8V14"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4.6 5h2M4.6 8h2M4.6 11h2M10.4 9h1.4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              }
            />

            <div
              className={`flex min-w-0 items-center border-b border-navy/20 transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy ${s.fieldGap}`}
            >
              <span aria-hidden="true" className="shrink-0">
                <svg viewBox="0 0 16 16" fill="none" className={s.icon}>
                  <path
                    d="M8 2 14.5 5.4 8 8.8 1.5 5.4 8 2Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="M1.5 9.2 8 12.6l6.5-3.4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
              <label htmlFor={id("projectType")} className="sr-only">
                Project type
              </label>
              <select
                id={id("projectType")}
                name="projectType"
                defaultValue=""
                // Windows dark mode renders an unstyled select with a dark
                // popup and dark text unless both are set explicitly.
                style={{ backgroundColor: "transparent", color: "inherit" }}
                className={`w-full min-w-0 appearance-none bg-transparent text-navy/60 outline-hidden ${s.input}`}
              >
                <option value="" disabled>
                  Project type
                </option>
                <option>Private residence</option>
                <option>Hospitality</option>
                <option>Commercial façade</option>
                <option>Institutional</option>
              </select>
              <svg viewBox="0 0 16 16" fill="none" className={s.icon} aria-hidden="true">
                <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>

            <div
              className={`flex min-w-0 items-start border-b border-navy/20 transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy ${s.fieldGap}`}
            >
              <span aria-hidden="true" className="shrink-0 pt-1">
                <svg viewBox="0 0 16 16" fill="none" className={s.icon}>
                  <path
                    d="M11.2 2.4l2.4 2.4L5.6 12.8H3.2v-2.4l8-8Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </span>
              <label htmlFor={id("message")} className="sr-only">
                Tell us about your project
              </label>
              <textarea
                id={id("message")}
                name="message"
                rows={2}
                autoComplete="off"
                placeholder="Tell us about your project…"
                className={`w-full min-w-0 resize-none bg-transparent text-navy outline-hidden placeholder:text-navy/60 ${s.input}`}
              />
            </div>

            <motion.button
              type="submit"
              className={`flex w-full items-center justify-center bg-navy text-white uppercase ${s.button}`}
              whileHover={reduced ? { opacity: 0.9 } : { y: -2, backgroundColor: "#0b1152" }}
              whileTap={reduced ? {} : { scale: 0.995 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              Send Enquiry
              <svg
                viewBox="0 0 24 16"
                fill="none"
                aria-hidden="true"
                className={`shrink-0 ${s.buttonArrow}`}
              >
                <path d="M0 8h22M17 3l5 5-5 5" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const reduced = useReducedMotion();
  const wrapRef = useReveal<HTMLDivElement>({ y: 40, duration: 1.1 });

  return (
    <section id="contact" className="scroll-mt-24 bg-white">
      <div ref={wrapRef} className="mx-auto w-full max-w-[120rem]">
        <div className="min-[100rem]:hidden">
          <div className="aspect-[1920/826] w-full overflow-hidden">
            <img
              {...IMAGES.contactFrame}
              alt="Durall glazing systems framing a contemporary architectural interior"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="shell grid grid-cols-1 gap-[clamp(3rem,7vw,5rem)] py-[clamp(4rem,9vw,7rem)] md:grid-cols-2">
            <Invitation s={RESPONSIVE} />
            <Enquiry
              s={RESPONSIVE}
              sent={sent}
              setSent={setSent}
              reduced={reduced}
              idPrefix="responsive"
            />
          </div>
        </div>
        {/* Figma glazing-frame plate — proportional via container queries.
            The box matches the photograph's true 1920x826 ratio; it was
            declared as 1920/872, which left the overlay positions (all
            percentages of the box) sitting slightly low on the glazing bars. */}
        <div className="@container relative hidden aspect-[1920/826] w-full min-[100rem]:block">
          <img
            {...IMAGES.contactFrame}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
          <div className="absolute top-[14.8%] left-[19.1%] w-[17.5%]">
            <Invitation s={OVERLAY} />
          </div>
          <div className="absolute top-[15.3%] left-[47.1%] w-[27.6%]">
            <Enquiry s={OVERLAY} sent={sent} setSent={setSent} reduced={reduced} idPrefix="plate" />
          </div>
          {/* Wall caption to the right of the glass, as in the design */}
          <div className="absolute top-[38%] left-[85%] w-[12%]">
            <span
              aria-hidden="true"
              className="absolute -left-[2.6cqw] -top-[7cqw] block h-[17cqw] w-px bg-navy/40"
            />
            <p className="font-display text-[0.62cqw] leading-[2.1] font-medium tracking-eyebrow text-navy uppercase">
              Architecture
              <br />
              starts with
              <br />a conversation.
            </p>
            <span aria-hidden="true" className="mt-[1.2cqw] block h-px w-[1.8cqw] bg-navy/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
