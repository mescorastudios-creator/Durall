import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IMAGES } from "@/assets/images";
import { useReveal, useSplitLines } from "@/lib/anim";
import { useReducedMotion } from "@/lib/motion-prefs";
import { CURVE, transition } from "@/lib/motion-tokens";

/**
 * The contact section is a photograph of a frosted glass pane with the
 * invitation and the enquiry form set on the glass, as in the design.
 *
 * On the plate (1024px up) everything is sized in container query units of
 * the photograph, so the words stay on the glass at every width. Below
 * 1920px the photograph is drawn wider than the screen, zooming in on the
 * pane, so the text on it stays readable: at 1024px the plate is 1433px
 * wide and the smallest text on it is 11.5px (the eyebrow), the inputs 14px.
 * Below 1024px there is no room for a form on glass, so the photograph sits
 * above a stacked form instead.
 *
 * The photograph used to carry a blurred copy of the form, painted into the
 * glass, which only the real text on top of it could hide — any size other
 * than the one it was painted at left a second, ghost form showing through.
 * contact-glass.webp is the same photograph with that lettering taken out.
 */
type Skin = {
  eyebrow: string;
  heading: string;
  rule: string;
  lede: string;
  formGap: string;
  field: string;
  fieldTop: string;
  input: string;
  icon: string;
  button: string;
  buttonArrow: string;
  sentHeading: string;
  sentBody: string;
  sentBtn: string;
};

/* Proportions measured from the design at a 1342px plate, in cqw. */
const OVERLAY: Skin = {
  eyebrow: "font-display text-[0.8cqw] font-bold tracking-eyebrow text-navy uppercase",
  heading: "mt-[2.3cqw] font-serif text-[2.6cqw] leading-[1.1] text-navy",
  rule: "mt-[2.3cqw] block h-px w-[3.3cqw] bg-navy/60",
  lede: "mt-[2.1cqw] max-w-[14.5cqw] font-body text-[1.1cqw] leading-[1.66] text-navy/75",
  formGap: "flex flex-col",
  field: "min-h-[4.27cqw] items-end gap-[1.35cqw] pb-[1.05cqw] pl-[0.45cqw]",
  fieldTop: "min-h-[5.6cqw] items-start gap-[1.35cqw] pt-[1.1cqw] pl-[0.45cqw]",
  input: "font-body text-[0.97cqw] leading-[1.4]",
  icon: "h-[1.05cqw] w-[1.05cqw] text-navy",
  button:
    "mt-[1.56cqw] min-h-[3.87cqw] justify-start gap-[1.5cqw] pl-[2.75cqw] font-display text-[0.87cqw] font-bold tracking-button",
  buttonArrow: "h-[0.8cqw] w-[1.4cqw]",
  sentHeading: "font-serif text-[2cqw] leading-[1.2] text-navy",
  sentBody: "mt-[1.4cqw] font-body text-[1.1cqw] leading-[1.7] text-navy/75",
  sentBtn: "mt-[1.8cqw] font-display text-[0.87cqw] font-bold tracking-button",
};

const RESPONSIVE: Skin = {
  eyebrow: "font-display text-xs font-bold tracking-eyebrow text-navy uppercase",
  heading: "mt-5 font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.12] text-balance text-navy",
  rule: "mt-6 block h-px w-8 bg-navy/60",
  lede: "mt-5 max-w-[34rem] font-body text-[clamp(0.9375rem,1.5vw,1rem)] leading-relaxed text-pretty text-navy/75",
  formGap: "flex flex-col gap-5",
  field: "items-center gap-3 pb-2",
  fieldTop: "items-start gap-3 pb-2",
  input: "min-h-11 font-body text-base sm:text-sm",
  icon: "h-4 w-4 text-navy",
  button:
    "mt-2 min-h-12 justify-center gap-4 py-4 font-display text-xs font-bold tracking-button",
  buttonArrow: "h-4 w-6",
  sentHeading: "font-serif text-[clamp(1.75rem,4vw,2.5rem)] text-balance text-navy",
  sentBody: "mt-4 font-body text-sm leading-relaxed text-navy/75",
  sentBtn: "mt-6 inline-flex min-h-11 items-center font-display text-xs font-bold tracking-button",
};

/** Every field shares the hairline underline and its focus states. */
const FIELD =
  "flex min-w-0 border-b border-navy/20 transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy";

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
      className={`${FIELD} ${s.field}`}
    >
      <span aria-hidden="true" className="flex shrink-0">
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
            transition={transition("medium", reduced)}
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
            transition={transition("short", reduced)}
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

            <div className={`${FIELD} ${s.field}`}>
              <span aria-hidden="true" className="flex shrink-0">
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

            <div className={`${FIELD} ${s.fieldTop}`}>
              <span aria-hidden="true" className="flex shrink-0 pt-[0.2em]">
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

            <button
              type="submit"
              className={`hover-lift flex w-full items-center bg-navy text-white uppercase hover:bg-[#0b1152] ${s.button}`}
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
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const reduced = useReducedMotion();
  const wrapRef = useReveal<HTMLDivElement>({ y: 32, duration: 0.9 });

  return (
    <section id="contact" className="scroll-mt-24 overflow-hidden bg-white">
      <div ref={wrapRef} className="mx-auto w-full max-w-[120rem]">
        {/* Below 1024px: the photograph, then the form. */}
        <div className="lg:hidden">
          <div className="aspect-[16/9] w-full overflow-hidden sm:aspect-[1920/826]">
            <img
              {...IMAGES.contactGlass}
              alt="A frosted glass pane in front of a contemporary house"
              sizes="100vw"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[47%_50%]"
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

        {/* 1024px up: the words on the glass. The plate is the photograph's
         * own 1920 × 826 box; every position below is a share of it. Between
         * 1024 and 1920 it is drawn wider than the screen (1433px at 1024,
         * 1659px at 1440) and shifted left by 40% of the overhang, which
         * keeps the pane centred. */}
        <div className="hidden lg:block">
          <div className="@container relative aspect-[1920/826] w-[clamp(100%,calc(54.35vw+54.75rem),120rem)] ml-[calc((100%-clamp(100%,calc(54.35vw+54.75rem),120rem))*0.4)]">
            <img
              {...IMAGES.contactGlass}
              alt=""
              aria-hidden="true"
              sizes="(min-width: 120rem) 120rem, calc(54.35vw + 54.75rem)"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute top-[16.4%] left-[19.7%] w-[20%]">
              <Invitation s={OVERLAY} />
            </div>
            <div className="absolute top-[15.2%] left-[47.6%] w-[26.8%]">
              <Enquiry
                s={OVERLAY}
                sent={sent}
                setSent={setSent}
                reduced={reduced}
                idPrefix="plate"
              />
            </div>
            {/* Wall caption to the right of the glass, as in the design.
             * Shown from 1680px, where the zoomed plate still has room for
             * it on screen. */}
            <span
              aria-hidden="true"
              className="absolute top-[35.8%] left-[84.4%] hidden h-[51.6%] w-px bg-navy/70 min-[105rem]:block"
            />
            <div className="absolute top-[54%] left-[85.7%] hidden w-[12%] min-[105rem]:block">
              <p className="font-display text-[0.81cqw] leading-[1.84] font-medium tracking-eyebrow text-navy uppercase">
                Architecture
                <br />
                starts with
                <br />a conversation.
              </p>
              <span aria-hidden="true" className="mt-[1.9cqw] block h-px w-[3.3cqw] bg-navy/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
