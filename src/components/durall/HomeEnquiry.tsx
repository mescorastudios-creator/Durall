import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useReveal, useSectionIntro } from "@/lib/anim";
import { imageOf } from "@/content/render";
import { useSite } from "@/content/site";
import { sendEnquiry } from "@/content/enquiry";
import type { ProjectSlide } from "@/content/select";
import type { HomePage } from "@/content/types";
import { useReducedMotion } from "@/lib/motion-prefs";
import { transition } from "@/lib/motion-tokens";
import { Honeypot } from "./contact/Honeypot";
import { RULES } from "./contact/submit";

/**
 * "Let's frame the view." — the navy band at the foot of the home page: the
 * enquiry form, and beside it a framed slideshow of the projects, with
 * lines running from the photograph's edges out to the section's, so the
 * frame reads as a window at the end of a room. It runs straight into the
 * navy footer, whose top rule closes the design.
 *
 * Sizes were measured from the design at 1920px wide. Inside the frame they
 * are container query units of the photograph (802px there, so 1cqw is
 * 8.02px); everything else is vw, clamped for small and large screens.
 */
type Copy = HomePage["enquiry"];

export function HomeEnquiry({ copy, slides }: { copy: Copy; slides: readonly ProjectSlide[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const introRef = useSectionIntro<HTMLDivElement>();
  const frameRef = useReveal<HTMLDivElement>({ y: 32, duration: 0.9 });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-navy pt-[clamp(4rem,6.2vw,7.45rem)] pb-[clamp(3rem,5.1vw,6.125rem)] text-white"
    >
      <PerspectiveLines sectionRef={sectionRef} photoRef={photoRef} />

      <div className="relative mx-auto grid w-full max-w-[120rem] grid-cols-1 gap-x-[clamp(2.5rem,4.95vw,5.95rem)] gap-y-[clamp(3rem,8vw,4.5rem)] px-[clamp(1.25rem,5.5vw,6.625rem)] lg:pr-[4.85vw] min-[120rem]:pr-[5.8rem] lg:grid-cols-[minmax(0,801fr)_minmax(0,824fr)] lg:items-start">
        <div className="min-w-0 lg:pt-[0.55vw]">
          <div ref={introRef}>
            <h2
              data-anim="lines"
              className="font-display text-[clamp(2.125rem,3.25vw,3.9rem)] leading-[1.1] font-normal tracking-[-0.01em] text-balance"
            >
              {copy.heading}
            </h2>
            <p
              data-anim
              className="mt-[clamp(1rem,1.4vw,1.7rem)] max-w-[36em] font-display text-[clamp(1rem,1.11vw,1.33rem)] leading-[1.4] text-pretty text-white/85"
            >
              {copy.lede}
            </p>
          </div>
          <EnquiryForm copy={copy} />
        </div>

        <div ref={frameRef} className="min-w-0">
          <div className="border border-white/35 p-[clamp(0.375rem,0.57vw,0.6875rem)]">
            <div
              ref={photoRef}
              className="@container relative aspect-[4/5] overflow-hidden bg-white/5 sm:aspect-[802/599]"
            >
              <Slideshow slides={slides} viewProject={copy.viewProject} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── The lines ─────────────────────────────────────────────────────────── */

/* Each line runs from a point on the photograph's edge (as a share of its
 * width and height) to a point on the section's edge (as a share of the
 * section's). The corners go to the section's corners; the fainter ones
 * leave the top and bottom edges at a quarter, a half and three quarters. */
const LINES: readonly { from: [number, number]; to: [number, number]; faint?: true }[] = [
  { from: [0, 0], to: [0, 0] },
  { from: [1, 0], to: [1, 0.005] },
  { from: [0, 1], to: [0, 1] },
  { from: [1, 1], to: [1, 1] },
  { from: [0.25, 0], to: [0.483, 0], faint: true },
  { from: [0.5, 0], to: [0.723, 0], faint: true },
  { from: [0.75, 0], to: [0.962, 0], faint: true },
  { from: [0.25, 1], to: [0.389, 1], faint: true },
  { from: [0.5, 1], to: [0.702, 1], faint: true },
  { from: [0.75, 1], to: [1, 0.923], faint: true },
];

type Geometry = { width: number; height: number; x: number; y: number; w: number; h: number };

/** The element's offset from an ancestor, ignoring transforms (the reveal
 * slides the frame in; the lines should meet it where it comes to rest). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function PerspectiveLines({
  sectionRef,
  photoRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  photoRef: RefObject<HTMLDivElement | null>;
}) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (!section || !photo) return;
    const measure = () => {
      const { x, y } = offsetWithin(photo, section);
      setGeometry({
        width: section.offsetWidth,
        height: section.offsetHeight,
        x,
        y,
        w: photo.offsetWidth,
        h: photo.offsetHeight,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(photo);
    return () => observer.disconnect();
  }, [sectionRef, photoRef]);

  if (!geometry) return null;
  const { width, height, x, y, w, h } = geometry;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
    >
      {LINES.map(({ from, to, faint }, index) => (
        <line
          key={index}
          x1={x + from[0] * w}
          y1={y + from[1] * h}
          x2={to[0] * width}
          y2={to[1] * height}
          stroke="white"
          strokeOpacity={faint ? 0.11 : 0.3}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/* ── The slideshow ─────────────────────────────────────────────────────── */

/** How long each project stays up. */
const SLIDE_MS = 6000;

/** The translucent navy the caption and button sit on, as drawn. */
const GLASS = "bg-navy/40 backdrop-blur-md";

/** The browser's own focus ring can vanish on navy; this one cannot. */
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function Slideshow({
  slides,
  viewProject,
}: {
  slides: readonly ProjectSlide[];
  viewProject: string;
}) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  // Photographs load as they come up, plus the next one ahead of time.
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set([0, 1]));

  const count = slides.length;
  const running = playing && inView && count > 1;

  // It never starts on its own for someone who has asked for less motion.
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(Boolean(entry?.isIntersecting)),
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const show = (next: number) => {
    setIndex(next);
    setLoaded((prev) => new Set([...prev, next, (next + 1) % count]));
  };

  const slide = slides[index];
  if (!slide) return null;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      className="absolute inset-0"
    >
      {slides.map((item, i) =>
        loaded.has(i) ? (
          <img
            key={item.slug}
            {...imageOf(item.hero.image)}
            alt={i === index ? item.hero.alt : ""}
            aria-hidden={i === index ? undefined : true}
            sizes="(min-width: 64rem) 42vw, 100vw"
            loading="lazy"
            decoding="async"
            className={
              "absolute inset-0 h-full w-full object-cover transition-opacity ease-[var(--ease-entrance)] " +
              (reduced ? "duration-200 " : "duration-700 ") +
              (i === index ? "opacity-100" : "opacity-0")
            }
          />
        ) : null,
      )}

      {/* Keeps the bars and the pause button readable on a pale sky. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[max(4.5rem,16cqw)] bg-linear-to-b from-navy/45 to-transparent"
      />

      <div className="absolute inset-x-[3.37cqw] top-[max(0.25rem,1.9cqw)] flex items-center gap-[max(0.75rem,3.5cqw)]">
        <ol className="flex min-w-0 flex-1 gap-[max(0.25rem,1.06cqw)]">
          {slides.map((item, i) => (
            <li key={item.slug} className="min-w-0 flex-1">
              <button
                type="button"
                // Choosing a project stops the show on it.
                onClick={() => {
                  show(i);
                  setPlaying(false);
                }}
                aria-label={`${i + 1}: ${item.name}`}
                aria-current={i === index ? "true" : undefined}
                className={`group flex h-11 w-full cursor-pointer items-center ${FOCUS}`}
              >
                <span className="relative h-[max(2px,0.3cqw)] w-full overflow-hidden bg-white/35 transition-colors duration-[var(--dur-short)] group-hover:bg-white/60">
                  <span
                    // Restarted per slide by the key; it fills in time with
                    // the slide and moves the show on when it is full.
                    key={i === index ? `active-${index}` : "idle"}
                    onAnimationEnd={i === index ? () => show((index + 1) % count) : undefined}
                    className="absolute inset-0 origin-left bg-white"
                    style={
                      i === index
                        ? {
                            animation: `slide-progress ${SLIDE_MS}ms linear forwards`,
                            animationPlayState: running ? "running" : "paused",
                          }
                        : { transform: `scaleX(${i < index ? 1 : 0})` }
                    }
                  />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className={`-mr-[0.9rem] flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-white/90 transition-colors duration-[var(--dur-short)] hover:text-white ${FOCUS}`}
        >
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="h-[max(0.625rem,1.25cqw)] w-[max(0.625rem,1.25cqw)]"
          >
            {playing ? (
              <path d="M1.5 0h3v12h-3zM7.5 0h3v12h-3z" fill="currentColor" />
            ) : (
              <path d="M2 0l9 6-9 6z" fill="currentColor" />
            )}
          </svg>
        </button>
      </div>

      {/* Announced only while the show is still, so a screen reader is not
          read a new caption every six seconds. */}
      <div
        aria-live={running ? "off" : "polite"}
        className="absolute inset-x-[3.5cqw] bottom-[3.4cqw] flex items-end justify-between gap-[3cqw]"
      >
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
          className={`min-w-0 flex-1 px-[max(0.875rem,3.1cqw)] py-[max(0.75rem,3.1cqw)] @xl:max-w-[63cqw] ${GLASS}`}
        >
          <p className="font-display text-[clamp(0.6875rem,1.87cqw,0.9375rem)] leading-none font-medium tracking-[0.12em] text-white/75 tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </p>
          <p className="mt-[max(0.5rem,1.9cqw)] font-display text-[clamp(1.125rem,4.3cqw,2.16rem)] leading-[1.15] font-normal text-balance text-white">
            {slide.name}
          </p>
          <p className="mt-[max(0.375rem,1.6cqw)] font-display text-[clamp(0.8125rem,2.15cqw,1.075rem)] leading-snug text-pretty text-white/90">
            {[slide.architect, slide.location].filter(Boolean).join(" · ")}
          </p>
          {/* Below 36rem of photograph the button moves into the caption. */}
          <ProjectLink
            slide={slide}
            label={viewProject}
            className="mt-[max(0.25rem,1cqw)] flex min-h-11 w-fit hover:text-white/80 @xl:hidden"
          />
        </div>
        <ProjectLink
          slide={slide}
          label={viewProject}
          className={`hidden h-[7.1cqw] min-h-11 shrink-0 px-[2.75cqw] @xl:inline-flex ${GLASS} hover:bg-navy/60`}
        />
      </div>
    </div>
  );
}

function ProjectLink({
  slide,
  label,
  className,
}: {
  slide: ProjectSlide;
  label: string;
  className: string;
}) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: slide.slug }}
      className={`group items-center gap-[max(0.5rem,1.1cqw)] font-display text-[clamp(0.6875rem,1.87cqw,0.9375rem)] font-medium tracking-[0.175em] text-white uppercase transition-colors duration-[var(--dur-short)] ${FOCUS} ${className}`}
    >
      {label}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="hover-arrow h-[1.1em] w-[1.1em]"
      >
        <path d="M4 12L12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="sr-only">: {slide.name}</span>
    </Link>
  );
}

/* ── The form ──────────────────────────────────────────────────────────── */

type FieldKey = keyof Copy["fields"];
type Errors = Partial<Record<"name" | "email", string>>;

const LABEL =
  "block font-display text-[clamp(0.6875rem,0.82vw,0.984rem)] leading-none font-bold tracking-[0.1em] uppercase";
const CONTROL =
  "block w-full min-w-0 bg-transparent py-[clamp(0.375rem,0.55vw,0.625rem)] font-display text-[clamp(1rem,1.18vw,1.42rem)] leading-[1.4] text-white outline-hidden placeholder:text-white/50";

function EnquiryForm({ copy }: { copy: Copy }) {
  const { settings } = useSite();
  const reduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const email = settings.contact.details.find((detail) => detail.icon === "mail");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const entry = form.get(name);
      return typeof entry === "string" ? entry : "";
    };

    const next: Errors = {};
    const nameError = RULES.name(value("name"));
    const emailError = RULES.email(value("email"));
    if (nameError) next.name = nameError;
    if (emailError) next.email = emailError;
    setErrors(next);
    const firstInvalid = (["name", "email"] as const).find((name) => next[name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setFailure(null);
    setSending(true);
    try {
      const result = await sendEnquiry({
        data: {
          source: "home",
          name: value("name"),
          email: value("email"),
          phone: value("phone"),
          location: value("location"),
          message: value("message"),
          website: value("website"),
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

  const field = (key: FieldKey) => ({
    id: `home-enquiry-${key}`,
    name: key,
    placeholder: copy.fields[key].placeholder,
    className: CONTROL,
  });
  const described = (key: "name" | "email") =>
    errors[key]
      ? { "aria-invalid": true as const, "aria-describedby": `home-enquiry-${key}-error` }
      : {};
  const clear = (key: "name" | "email") => () => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="mt-[clamp(2rem,2.15vw,2.6rem)] min-w-0">
      {/* The confirmation replaces the form, so it announces itself. */}
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
            className="border-t border-white/35 pt-[clamp(1.5rem,2.4vw,2rem)]"
          >
            <p className="font-display text-[clamp(1.5rem,2.2vw,2.4rem)] leading-[1.15] text-balance">
              {copy.sentHeading}
            </p>
            <p className="mt-4 max-w-[34rem] font-body text-sm leading-relaxed text-pretty text-white/80">
              {settings.contact.responseNote}
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className={`mt-6 inline-flex min-h-11 cursor-pointer items-center border-b border-white/35 font-display text-xs font-bold tracking-button uppercase transition-colors duration-[var(--dur-short)] hover:border-white ${FOCUS}`}
            >
              {copy.sentAgain}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            // Our own messages, written for this form and tied to each field.
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition("short", reduced)}
            onSubmit={submit}
            aria-busy={sending}
            className="relative grid grid-cols-1 gap-x-[clamp(1.25rem,1.93vw,2.3rem)] gap-y-[clamp(1.25rem,1.46vw,1.75rem)] sm:grid-cols-2"
          >
            <Honeypot />
            <Field id="name" label={copy.fields.name.label} error={errors.name}>
              <input
                {...field("name")}
                {...described("name")}
                type="text"
                autoComplete="name"
                onInput={clear("name")}
              />
            </Field>
            <Field id="email" label={copy.fields.email.label} error={errors.email}>
              <input
                {...field("email")}
                {...described("email")}
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                onInput={clear("email")}
              />
            </Field>
            <Field id="phone" label={copy.fields.phone.label}>
              <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" />
            </Field>
            <Field id="location" label={copy.fields.location.label}>
              <input {...field("location")} type="text" autoComplete="address-level2" />
            </Field>
            <Field id="message" label={copy.fields.message.label} wide>
              <textarea
                {...field("message")}
                rows={2}
                autoComplete="off"
                className={`${CONTROL} resize-none [field-sizing:content] min-h-[calc(2lh+2*clamp(0.375rem,0.55vw,0.625rem))] max-h-60`}
              />
            </Field>

            {failure ? (
              <p
                role="alert"
                className="border-l-2 border-white/60 py-1 pl-4 font-body text-sm leading-relaxed text-pretty text-white sm:col-span-2"
              >
                {failure}
              </p>
            ) : null}

            <div className="mt-[clamp(0.5rem,0.3vw,0.75rem)] flex flex-wrap items-center gap-x-[clamp(1.25rem,1.72vw,2.1rem)] gap-y-4 sm:col-span-2">
              <button
                type="submit"
                disabled={sending}
                className={`hover-lift inline-flex h-[clamp(3rem,3.64vw,4.375rem)] cursor-pointer items-center gap-[clamp(0.75rem,1vw,1.2rem)] bg-white px-[clamp(1.25rem,1.9vw,2.3rem)] font-display text-[clamp(0.75rem,0.885vw,1.0625rem)] font-medium tracking-[0.135em] text-navy uppercase transition-colors duration-[var(--dur-short)] hover:bg-white/85 disabled:cursor-progress disabled:opacity-80 ${FOCUS}`}
              >
                {sending ? copy.sending : copy.submit}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-[1.05em] w-[1.05em] shrink-0"
                >
                  <path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
              {email ? (
                <p className="font-display text-[clamp(0.875rem,0.97vw,1.17rem)] text-white/85">
                  {copy.writeTo}{" "}
                  <a
                    href={email.href}
                    className={`text-white underline decoration-white/50 underline-offset-[0.2em] transition-colors duration-[var(--dur-short)] hover:decoration-white ${FOCUS}`}
                  >
                    {email.value}
                  </a>
                </p>
              ) : null}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// `error: string | undefined` rather than optional: the project runs with
// exactOptionalPropertyTypes.
function Field({
  id,
  label,
  error,
  wide,
  children,
}: {
  id: FieldKey;
  label: string;
  error?: string | undefined;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={`home-enquiry-${id}`} className={LABEL}>
        {label}
      </label>
      <div
        className={
          "mt-[clamp(0.25rem,0.35vw,0.5rem)] border-b transition-colors duration-[var(--dur-short)] focus-within:border-white has-[:focus-visible]:border-b-2 " +
          (error ? "border-[#ff9b9b]" : "border-white/35")
        }
      >
        {children}
      </div>
      {error ? (
        <p
          id={`home-enquiry-${id}-error`}
          className="mt-2 font-body text-xs leading-relaxed text-pretty text-[#ffb4b4]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
