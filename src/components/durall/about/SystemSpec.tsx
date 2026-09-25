import { Cpu, Droplet, Wind } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { useReveal } from "@/lib/anim";

const METRICS = [
  { icon: Wind, label: "Air Tightness", value: "Class 4" },
  { icon: Droplet, label: "Water Tightness", value: "E1200" },
  { icon: Cpu, label: "Wind Load Resistance", value: "Up to 4.0 kPa" },
];

export function SystemSpec() {
  const wrapRef = useReveal<HTMLDivElement>({ y: 32, duration: 0.9 });

  return (
    <section className="bg-white pt-[clamp(2.5rem,5vw,4.5rem)]">
      <div ref={wrapRef} className="shell-about">
        <figure className="m-0">
          {/* The profile photograph runs to the card's edge; the other three
              cells carry their own padding. */}
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-navy-14 md:grid-cols-2 xl:grid-cols-[minmax(0,0.2fr)_minmax(0,0.16fr)_minmax(0,0.265fr)_minmax(0,0.375fr)]">
            <div className="relative min-w-0 bg-paper">
              <img
                {...IMAGES.aboutProfile}
                alt="Cutaway of a Durall aluminium profile"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center p-6 xl:px-[clamp(1rem,1.3vw,1.5rem)]">
              <p className="flex items-baseline gap-1.5 font-display text-[clamp(2.25rem,3vw,3rem)] leading-none font-medium text-navy">
                16
                <span className="font-display text-sm font-bold text-navy">MM</span>
              </p>
              <p className="mt-4 font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase">
                Glass thickness
              </p>
              <p className="mt-2 max-w-[10rem] font-body text-xs leading-snug text-slate">
                Optimised for structural performance and acoustic comfort.
              </p>
            </div>

            <div className="flex min-w-0 items-center border-navy-14 p-4 xl:border-l xl:p-0">
              <img
                {...IMAGES.aboutSectionDrawing}
                alt="Technical section drawing of the glazing system"
                loading="lazy"
                decoding="async"
                className="w-full object-contain"
              />
            </div>

            <dl className="flex min-w-0 flex-col justify-center p-6 xl:my-6 xl:border-l xl:border-navy-14 xl:py-0 xl:pr-[clamp(1.5rem,2.5vw,2.5rem)] xl:pl-[clamp(1.5rem,2vw,2rem)]">
              {METRICS.map(({ icon: Icon, label, value }, index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-4 py-2.5 ${
                    index < METRICS.length - 1 ? "border-b border-navy-14" : ""
                  }`}
                >
                  <dt className="flex min-w-0 items-center gap-2 font-display text-[0.625rem] font-bold tracking-eyebrow text-navy uppercase">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                    {label}
                  </dt>
                  <dd className="shrink-0 font-body text-xs font-bold text-navy">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 px-4 font-display text-[0.625rem] font-bold tracking-eyebrow text-slate uppercase">
            <span>Profile / Material / Performance</span>
            <span>D/S — Engineered to Endure</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
