import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Layers, Mail, Pencil, User } from "lucide-react";
import { useReveal, useSplitLines } from "@/lib/anim";
import { imageOf, Lines } from "@/content/render";
import { useSite } from "@/content/site";
import type { SharedContent } from "@/content/types";
import { useReducedMotion } from "@/lib/motion-prefs";
import { transition } from "@/lib/motion-tokens";
import { sendEnquiry } from "@/content/enquiry";
import { Honeypot } from "./contact/Honeypot";

/**
 * The contact section is a photograph of a frosted glass pane with the
 * invitation and the enquiry form set on the glass, as in the design.
 *
 * On the plate (1024px up) everything is sized in container query units of
 * the photograph, so the words stay on the glass at every width. Below
 * 1920px the photograph is drawn wider than the screen, zooming in on the
 * pane, so the text on it stays readable. Below 1024px there is no room for
 * a form on glass, so the photograph sits above a stacked form instead.
 *
 * Every size, position and colour on the plate was measured from the design
 * at 1920 × 826, where 1cqw is 19.2px: the serif is Newsreader at 350, the
 * labels Space Grotesk at 500, the placeholders a neutral grey rather than
 * a navy tint, and the button the design's own #00163a.
 *
 * contact-glass.webp is the design's photograph with the lettering taken
 * out. The supplied file had lost the pane's right-hand edge and the floor
 * line beside it; both were restored from the design.
 */
type Copy = SharedContent["enquiry"];

type Skin = {
  eyebrow: string;
  heading: string;
  rule: string;
  lede: string;
  formGap: string;
  field: string;
  fieldTop: string;
  input: string;
  textarea: string;
  icon: string;
  /** Nudges the glyphs onto the placeholder's centre line, as drawn. */
  iconBox: string;
  chevron: string;
  line: string;
  button: string;
  buttonArrow: string;
  sentHeading: string;
  sentBody: string;
  sentBtn: string;
};

/* The design's label navy, sampled from it: softer than the brand navy. */
const INK = "text-[#1a2038]";

const OVERLAY: Skin = {
  eyebrow: `font-display text-[0.82cqw] leading-none font-medium tracking-[0.085em] uppercase ${INK}`,
  heading: "mt-[2.43cqw] font-editorial text-[2.35cqw] leading-[1.22] font-[350] text-navy",
  rule: "mt-[1.98cqw] block h-[max(1px,0.08cqw)] w-[3.2cqw] bg-[#1a2038]",
  lede: "mt-[1.84cqw] font-body text-[1.04cqw] leading-[1.75] text-[#2b3238]",
  formGap: "flex flex-col",
  field: "min-h-[4.3cqw] items-end gap-[1.2cqw] pb-[1.05cqw] pl-[0.1cqw]",
  fieldTop: "items-start gap-[1.2cqw] pt-[1.83cqw] pb-[0.35cqw] pl-[0.1cqw]",
  input: "font-body text-[0.91cqw] leading-[1.4]",
  textarea: "h-[4.02cqw] max-h-[9cqw] min-h-[2.5cqw]",
  icon: "h-[1.56cqw] w-[1.56cqw] text-[#3c3f47]",
  iconBox: "translate-y-[0.26cqw]",
  chevron: "h-[1.5cqw] w-[1.5cqw] text-[#3c3f47]",
  line: "border-[rgb(33_36_44/0.38)]",
  button:
    "mt-[1.6cqw] min-h-[3.8cqw] justify-start gap-[1.7cqw] rounded-[0.16cqw] bg-[#00163a] pl-[2.8cqw] font-display text-[0.81cqw] font-medium tracking-[0.19em] text-white/85 hover:bg-[#0a2150]",
  buttonArrow: "h-[0.85cqw] w-[1.25cqw]",
  sentHeading: "font-editorial text-[2cqw] leading-[1.2] font-[350] text-navy",
  sentBody: "mt-[1.4cqw] font-body text-[1.04cqw] leading-[1.7] text-[#2b3238]",
  sentBtn: "mt-[1.8cqw] font-display text-[0.82cqw] font-medium tracking-[0.2em]",
};

const RESPONSIVE: Skin = {
  eyebrow: `font-display text-xs font-medium tracking-[0.085em] uppercase ${INK}`,
  heading:
    "mt-5 font-editorial text-[clamp(2rem,5vw,3.25rem)] leading-[1.18] font-[350] text-balance text-navy",
  rule: "mt-6 block h-px w-8 bg-[#1a2038]",
  lede: "mt-5 max-w-[34rem] font-body text-[clamp(0.9375rem,1.5vw,1rem)] leading-[1.75] text-pretty text-[#2b3238]",
  formGap: "flex flex-col gap-5",
  field: "items-center gap-3 pb-2",
  fieldTop: "items-start gap-3 pt-2 pb-1",
  input: "min-h-11 font-body text-base sm:text-sm",
  textarea: "h-24 max-h-60 min-h-16",
  icon: "h-5 w-5 text-[#3c3f47]",
  iconBox: "",
  chevron: "h-5 w-5 text-[#3c3f47]",
  line: "border-[rgb(33_36_44/0.3)]",
  button:
    "mt-2 min-h-12 justify-center gap-4 rounded-[3px] bg-[#00163a] py-4 font-display text-xs font-medium tracking-[0.19em] text-white/90 hover:bg-[#0a2150]",
  buttonArrow: "h-4 w-6",
  sentHeading: "font-editorial text-[clamp(1.75rem,4vw,2.5rem)] font-[350] text-balance text-navy",
  sentBody: "mt-4 font-body text-sm leading-relaxed text-[#2b3238]",
  sentBtn:
    "mt-6 inline-flex min-h-11 items-center font-display text-xs font-medium tracking-[0.2em]",
};

/** Every field shares the hairline underline and its focus states. */
const FIELD =
  "flex min-w-0 border-b transition-colors focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy";

/* The design's placeholder grey, for inputs and for a select still showing
 * its prompt. Written out in full so Tailwind can see both classes. */
const PH = "placeholder:text-[#55575e]";
const SELECT_EMPTY = "[&:has(option[value='']:checked)]:text-[#55575e]";

function Icon({ as: Glyph, s }: { as: typeof User; s: Skin }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 ${s.iconBox}`}>
      <Glyph className={s.icon} strokeWidth={1.25} absoluteStrokeWidth />
    </span>
  );
}

/* A tower between two lower wings, as drawn in the design. Lucide has no
 * building with that silhouette; this one is drawn on the same 24px grid
 * and stroke so it sits in the set. */
function Tower({ s }: { s: Skin }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 ${s.iconBox}`}>
      <svg viewBox="0 0 24 24" fill="none" className={s.icon}>
        <g
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          <path d="M9 21V4.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6V21" />
          <path d="M9 8h6M9 11.5h6M9 15h6M12 4v17" />
          <path d="M9 13H6.6a.6.6 0 0 0-.6.6V21M15 13h2.4a.6.6 0 0 1 .6.6V21" />
          <path d="M4.5 21h15" />
        </g>
      </svg>
    </span>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  icon: ReactNode;
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
      className={`${FIELD} ${s.line} ${s.field}`}
    >
      {icon}
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
        placeholder={label}
        className={`w-full min-w-0 bg-transparent text-navy outline-hidden ${PH} ${s.input}`}
      />
    </div>
  );
}

function Choice({
  id,
  name,
  label,
  options,
  icon,
  s,
}: {
  id: string;
  name: string;
  label: string;
  options: string[];
  icon: ReactNode;
  s: Skin;
}) {
  return (
    <div className={`${FIELD} ${s.line} ${s.field}`}>
      {icon}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        // Windows dark mode renders an unstyled select with a dark popup and
        // dark text unless both are set explicitly.
        style={{ backgroundColor: "transparent" }}
        className={`w-full min-w-0 cursor-pointer appearance-none bg-transparent text-navy outline-hidden ${SELECT_EMPTY} ${s.input}`}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className={`pointer-events-none shrink-0 ${s.chevron} ${s.iconBox}`}
        strokeWidth={1.25}
        absoluteStrokeWidth
      />
    </div>
  );
}

function Invitation({ s, copy }: { s: Skin; copy: Copy }) {
  const headingRef = useSplitLines<HTMLHeadingElement>();
  return (
    <div className="min-w-0">
      <p className={s.eyebrow}>{copy.eyebrow}</p>
      <h2 ref={headingRef} className={s.heading}>
        <Lines text={copy.heading} />
      </h2>
      <span aria-hidden="true" className={s.rule} />
      <p className={s.lede}>
        <Lines text={copy.lede} />
      </p>
    </div>
  );
}

function Enquiry({
  s,
  copy,
  responseNote,
  sent,
  setSent,
  reduced,
  idPrefix,
  source,
}: {
  s: Skin;
  copy: Copy;
  responseNote: string;
  sent: boolean;
  setSent: (value: boolean) => void;
  reduced: boolean;
  idPrefix: string;
  source: "home" | "about";
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = new FormData(event.currentTarget);
    const field = (name: string) => {
      const value = form.get(`${idPrefix}-${name}`) ?? form.get(name);
      return typeof value === "string" ? value : "";
    };
    setFailure(null);
    setSending(true);
    try {
      const result = await sendEnquiry({
        data: {
          source,
          name: field("name"),
          email: field("email"),
          studio: field("studio"),
          projectType: field("projectType"),
          message: field("message"),
          website: field("website"),
        },
      });
      if (result.ok) setSent(true);
      else setFailure(result.message);
    } catch {
      setFailure(
        "That didn’t send — check your name and email and try again, or email us directly.",
      );
    } finally {
      setSending(false);
    }
  };

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
            <p className={s.sentHeading}>{copy.sentHeading}</p>
            <p className={s.sentBody}>{responseNote}</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className={`${s.sentBtn} text-navy uppercase underline`}
            >
              {copy.sentAgain}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition("short", reduced)}
            className={`relative ${s.formGap}`}
            onSubmit={submit}
            aria-busy={sending}
          >
            <Honeypot />
            <Field
              id={id("name")}
              label={copy.fields.name}
              s={s}
              required
              autoComplete="name"
              icon={<Icon as={User} s={s} />}
            />
            <Field
              id={id("email")}
              label={copy.fields.email}
              type="email"
              s={s}
              required
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              icon={<Icon as={Mail} s={s} />}
            />
            <Choice
              id={id("studio")}
              name="studio"
              label={copy.fields.studio}
              options={copy.fields.studioOptions}
              icon={<Tower s={s} />}
              s={s}
            />
            <Choice
              id={id("projectType")}
              name="projectType"
              label={copy.fields.projectType}
              options={copy.fields.projectTypeOptions}
              icon={<Icon as={Layers} s={s} />}
              s={s}
            />

            <div className={`${FIELD} ${s.line} ${s.fieldTop}`}>
              {/* The pencil is drawn smaller than the other glyphs in the
                  design, so it sits centred in the same box. */}
              <span
                aria-hidden="true"
                className={`flex shrink-0 items-center justify-center ${s.icon}`}
              >
                <Pencil className="h-[68%] w-[68%]" strokeWidth={1.25} absoluteStrokeWidth />
              </span>
              <label htmlFor={id("message")} className="sr-only">
                {copy.fields.message}
              </label>
              {/* Resizable, as drawn: the grip sits just above the hairline.
                  Capped so the form cannot grow off the glass. */}
              <textarea
                id={id("message")}
                name="message"
                autoComplete="off"
                placeholder={copy.fields.message}
                className={`w-full min-w-0 resize-y bg-transparent text-navy outline-hidden ${PH} ${s.input} ${s.textarea}`}
              />
            </div>

            {failure ? (
              <p role="alert" className={`${s.sentBody} text-navy`}>
                {failure}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={sending}
              className={`hover-lift flex w-full cursor-pointer items-center uppercase disabled:cursor-progress disabled:opacity-80 ${s.button}`}
            >
              {sending ? "Sending…" : copy.submit}
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

export function Contact({ source = "home" }: { source?: "home" | "about" }) {
  const { shared, settings } = useSite();
  const copy = shared.enquiry;
  const responseNote = settings.contact.responseNote;
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
              {...imageOf(copy.photo.image)}
              alt={copy.photo.alt}
              sizes="100vw"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[47%_50%]"
            />
          </div>
          <div className="shell grid grid-cols-1 gap-[clamp(3rem,7vw,5rem)] py-[clamp(4rem,9vw,7rem)] md:grid-cols-2">
            <Invitation s={RESPONSIVE} copy={copy} />
            <Enquiry
              s={RESPONSIVE}
              copy={copy}
              responseNote={responseNote}
              sent={sent}
              setSent={setSent}
              reduced={reduced}
              idPrefix="responsive"
              source={source}
            />
          </div>
        </div>

        {/* 1024px up: the words on the glass. The plate is the photograph's
         * own 1920 × 826 box; every position below is a share of it. Between
         * 1024 and 1920 it is drawn wider than the screen (1433px at 1024,
         * 1659px at 1440) and shifted left by 40% of the overhang, which
         * keeps the pane centred.
         *
         * That shift is left: 40% of the container less 40% of the plate's
         * own width, i.e. 0.4 × (container − plate). It used to be a single
         * margin-left: calc((100% − clamp(100%, …)) × 0.4), which Chrome
         * resolves but Safari does not: there the plate stayed at the left
         * edge of its box and the pane sat visibly right of centre. */}
        <div className="hidden lg:block">
          <div className="@container relative left-[40%] aspect-[1920/826] w-[clamp(100%,calc(54.35vw+54.75rem),120rem)] -translate-x-[40%]">
            <img
              {...imageOf(copy.photo.image)}
              alt=""
              aria-hidden="true"
              sizes="(min-width: 120rem) 120rem, calc(54.35vw + 54.75rem)"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute top-[15.41%] left-[19.44%] w-[20%]">
              <Invitation s={OVERLAY} copy={copy} />
            </div>
            <div className="absolute top-[12.1%] left-[47.4%] w-[26.875%]">
              <Enquiry
                s={OVERLAY}
                copy={copy}
                responseNote={responseNote}
                sent={sent}
                setSent={setSent}
                reduced={reduced}
                idPrefix="plate"
                source={source}
              />
            </div>
            {/* Wall caption to the right of the glass, as in the design.
             * Shown from 1680px, where the zoomed plate still has room for
             * it on screen. */}
            <span
              aria-hidden="true"
              className="absolute top-[35.96%] left-[84.35%] hidden h-[51.45%] w-[max(1px,0.07cqw)] bg-[#3d4650] min-[105rem]:block"
            />
            <div className="absolute top-[53.6%] left-[85.65%] hidden w-[12%] min-[105rem]:block">
              <p
                className={`font-display text-[0.89cqw] leading-[1.67] font-medium tracking-[0.03em] uppercase ${INK}`}
              >
                <Lines text={copy.wallCaption} />
              </p>
              <span
                aria-hidden="true"
                className="mt-[2cqw] block h-[max(1px,0.08cqw)] w-[3.3cqw] bg-[#1a2038]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
