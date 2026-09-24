import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/motion-prefs";
import { ArrowRight } from "../ui";
import { RESPONSE_NOTE } from "./data";
import { submitEnquiry, type EnquiryValues } from "./submit";

type FieldName = keyof EnquiryValues;

const EMPTY: EnquiryValues = { name: "", email: "", subject: "", message: "" };

/* Hand-rolled rather than schema-driven: react-hook-form and zod were both
 * removed from the project as unused, and four fields do not justify adding
 * them back. Each rule returns the message the reader sees, or null. */
const RULES: Record<FieldName, (value: string) => string | null> = {
  name: (v) =>
    v.trim().length === 0
      ? "Enter your name so we know who we’re replying to."
      : v.trim().length < 2
        ? "That looks too short — enter your full name."
        : null,
  email: (v) =>
    v.trim().length === 0
      ? "Enter an email address so we can reply."
      : // Deliberately permissive: the only thing worth rejecting client-side
        // is an address that cannot be delivered to at all. Anything stricter
        // turns into false rejections of valid addresses.
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? null
        : "That doesn’t look like a complete email address — check for a missing @ or domain.",
  subject: (v) => (v.trim().length === 0 ? "Add a subject so we can route your enquiry." : null),
  message: (v) =>
    v.trim().length === 0
      ? "Tell us a little about the project."
      : v.trim().length < 20
        ? "A sentence or two more will help us point you at the right engineer."
        : null,
};

const FIELD_ORDER: FieldName[] = ["name", "email", "subject", "message"];

type Status = "idle" | "submitting" | "error";

/** Label, underline and error treatment shared by the inputs and the textarea. */
function fieldShell(invalid: boolean) {
  return [
    "mt-2 flex min-w-0 items-center border-b transition-colors",
    invalid
      ? "border-destructive"
      : "border-navy/20 focus-within:border-navy has-[:focus-visible]:border-b-2 has-[:focus-visible]:border-navy",
  ].join(" ");
}

const LABEL_CLASS = "block font-display text-xs font-bold tracking-eyebrow text-navy uppercase";
const CONTROL_CLASS =
  "w-full min-w-0 bg-transparent font-body text-base text-navy outline-hidden placeholder:text-navy/45 sm:text-sm";

export function EnquiryForm() {
  const reduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<EnquiryValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const validate = (name: FieldName, value: string) => RULES[name](value);

  const handleChange = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Only re-validate a field the reader has already left once. Validating
    // every keystroke from the start means telling someone their email is
    // invalid while they are still on the first character of it.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) ?? undefined }));
    }
  };

  const handleBlur = (name: FieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, values[name]) ?? undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const next: Partial<Record<FieldName, string>> = {};
    for (const name of FIELD_ORDER) {
      const message = validate(name, values[name]);
      if (message) next[name] = message;
    }
    setErrors(next);
    setTouched({ name: true, email: true, subject: true, message: true });

    const firstInvalid = FIELD_ORDER.find((name) => next[name]);
    if (firstInvalid) {
      // Guidelines: move focus to the first error rather than leaving the
      // reader to hunt for which field stopped the submission.
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
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

  const describedBy = (name: FieldName) => (errors[name] ? `${name}-error` : undefined);

  const fieldProps = (name: FieldName) => ({
    id: name,
    name,
    value: values[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, event.target.value),
    onBlur: () => handleBlur(name),
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": describedBy(name),
    className: CONTROL_CLASS,
  });

  return (
    <div className="min-w-0">
      {/* The confirmation replaces the form outright, so it has to announce
          itself — the same treatment the enquiry panel on the home page uses. */}
      <AnimatePresence initial={false} mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.4 }}
            className="border-t border-navy-14 pt-[clamp(1.5rem,2.4vw,2rem)]"
          >
            <p className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] text-balance text-navy">
              Thank you — your enquiry is with us.
            </p>
            <p className="mt-4 max-w-[34rem] font-body text-sm leading-relaxed text-pretty text-slate">
              {RESPONSE_NOTE}
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-navy-14 font-display text-xs font-bold tracking-button text-navy uppercase transition-colors hover:border-navy motion-safe:transition-[color,border-color,transform] motion-safe:hover:translate-x-0.5"
            >
              Send Another Enquiry
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            // Our own messages, not the browser's: they are written for this
            // form and they are the ones wired to aria-describedby.
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-[clamp(1.5rem,2.4vw,2rem)]"
          >
            <div className="grid grid-cols-1 gap-[clamp(1.5rem,2.4vw,2rem)] sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="name" className={LABEL_CLASS}>
                  Your Name
                </label>
                <div className={fieldShell(Boolean(errors.name))}>
                  <input
                    {...fieldProps("name")}
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Mehta…"
                    className={`${CONTROL_CLASS} min-h-11`}
                  />
                </div>
                <FieldError name="name" message={errors.name} />
              </div>

              <div className="min-w-0">
                <label htmlFor="email" className={LABEL_CLASS}>
                  Your Email
                </label>
                <div className={fieldShell(Boolean(errors.email))}>
                  <input
                    {...fieldProps("email")}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    placeholder="jane@studio.com…"
                    className={`${CONTROL_CLASS} min-h-11`}
                  />
                </div>
                <FieldError name="email" message={errors.email} />
              </div>
            </div>

            <div className="min-w-0">
              <label htmlFor="subject" className={LABEL_CLASS}>
                Subject
              </label>
              <div className={fieldShell(Boolean(errors.subject))}>
                <input
                  {...fieldProps("subject")}
                  type="text"
                  autoComplete="off"
                  placeholder="Sliding systems for a coastal residence…"
                  className={`${CONTROL_CLASS} min-h-11`}
                />
              </div>
              <FieldError name="subject" message={errors.subject} />
            </div>

            <div className="min-w-0">
              <label htmlFor="message" className={LABEL_CLASS}>
                Your Message
              </label>
              <div className={`${fieldShell(Boolean(errors.message))} items-start`}>
                <textarea
                  {...fieldProps("message")}
                  rows={5}
                  autoComplete="off"
                  placeholder="Tell us about the project — location, stage, and what you need from the envelope…"
                  className={`${CONTROL_CLASS} resize-y py-2`}
                />
              </div>
              <FieldError name="message" message={errors.message} />
            </div>

            {/* Submission failure, as opposed to a field being wrong. Kept
                above the button so it is not pushed off-screen on a phone,
                and it names a way forward rather than only the problem. */}
            {status === "error" && failure ? (
              <p
                role="alert"
                className="border-l-2 border-destructive bg-paper py-3 pr-4 pl-4 font-body text-sm leading-relaxed text-pretty text-navy"
              >
                {failure}
              </p>
            ) : null}

            <button
              type="submit"
              // Left enabled until the request is actually in flight, so a
              // reader is never presented with a dead button.
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-4 bg-navy py-4 font-display text-xs font-bold tracking-button text-white uppercase transition-colors hover:bg-[#0b1152] disabled:cursor-progress disabled:bg-navy/70 motion-safe:transition-[background-color,transform] motion-safe:not-disabled:hover:-translate-y-0.5 sm:w-auto sm:px-[clamp(1.5rem,3vw,2.5rem)]"
            >
              {status === "submitting" ? "Sending…" : "Send Enquiry"}
              {status === "submitting" ? (
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 motion-safe:animate-spin"
                >
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.35" />
                  <path
                    d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-6 shrink-0"
                >
                  <path d="M0 8h22M17 3l5 5-5 5" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              )}
            </button>

            <p className="font-body text-xs leading-relaxed text-slate">{RESPONSE_NOTE}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// `message: string | undefined` rather than an optional prop: the project
// runs with exactOptionalPropertyTypes, where passing an explicit undefined
// is not the same as omitting the prop.
function FieldError({ name, message }: { name: string; message: string | undefined }) {
  if (!message) return null;
  return (
    <p
      id={`${name}-error`}
      role="alert"
      className="mt-2 font-body text-xs leading-relaxed text-pretty text-destructive"
    >
      {message}
    </p>
  );
}
