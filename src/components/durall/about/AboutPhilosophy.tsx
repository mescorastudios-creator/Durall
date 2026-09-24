import { Crosshair, Layers, ShieldCheck } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { useClipReveal, useParallax, useReveal, useSplitLines } from "@/lib/anim";
import { UnderlineLink } from "../ui";

const FEATURES = [
  {
    icon: Crosshair,
    title: "Precision",
    body: "Engineered tolerances ensure seamless performance.",
  },
  {
    icon: Layers,
    title: "Materiality",
    body: "Curated aluminium systems for strength, longevity and beauty.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    body: "Every connection is designed to last in real conditions.",
  },
];

export function AboutPhilosophy() {
  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 28 });
  const listRef = useReveal<HTMLUListElement>({ selector: "li", y: 24 });
  const frameRef = useReveal<HTMLDivElement>({ y: 48, duration: 1.1 });
  const headingRef = useSplitLines<HTMLHeadingElement>();
  const clipRef = useClipReveal<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(8);

  return (
    <section id="philosophy" className="bg-white pt-[clamp(4rem,8vw,9rem)]">
      <div className="shell grid grid-cols-1 gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,1.15fr)_1px_minmax(0,0.75fr)_minmax(0,1.2fr)]">
        <div ref={copyRef} className="min-w-0">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(2rem,3.3vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-balance text-navy"
          >
            Luxury is never applied. It is engineered.
          </h2>
          <p
            data-reveal
            className="mt-[clamp(1.5rem,2.4vw,2rem)] max-w-[30rem] font-body text-[clamp(0.8125rem,0.95vw,0.875rem)] leading-[1.75] text-slate"
          >
            Durall works alongside architects and developers long before a building becomes visible.
            Design intent, engineering tolerance and material performance are resolved together,
            before the first extrusion is cut.
          </p>
          <p
            data-reveal
            className="mt-5 max-w-[30rem] font-body text-[clamp(0.8125rem,0.95vw,0.875rem)] leading-[1.75] font-bold text-navy"
          >
            The visible result is only the final expression of decisions made long before.
          </p>
          <div data-reveal className="mt-[clamp(2rem,3vw,2.5rem)]">
            <UnderlineLink href="#approach">Our Approach</UnderlineLink>
          </div>
        </div>

        <div aria-hidden="true" className="hidden w-px bg-navy-14 lg:block" />

        <ul ref={listRef} className="min-w-0 space-y-[clamp(1.75rem,2.6vw,2.25rem)] lg:pt-6">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex min-w-0 items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-navy-14 bg-paper">
                <Icon aria-hidden="true" className="h-3.5 w-3.5 text-navy" strokeWidth={1.5} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[0.6875rem] font-bold tracking-eyebrow text-navy uppercase">
                  {title}
                </span>
                <span className="mt-1 block font-body text-[0.75rem] leading-snug text-slate">
                  {body}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div ref={frameRef} className="min-w-0">
          <div
            ref={clipRef}
            className="relative aspect-[1023/840] w-full overflow-hidden rounded-3xl"
          >
            <img
              ref={imageRef}
              {...IMAGES.aboutVilla}
              alt="A contemporary villa wrapped in full-height Durall glazing"
              sizes="(min-width: 64rem) 34vw, 100vw"
              loading="lazy"
              decoding="async"
              className="h-[110%] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
