import { BarChart3, Network, Share2, Users } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { useReveal, useSplitLines } from "@/lib/anim";
import { Interactive } from "../ui";

const CAPABILITIES = [
  { icon: Network, title: "Architectural Intent", body: "Design vision and performance goals" },
  { icon: Share2, title: "System Partners", body: "Carefully selected international partners" },
  { icon: BarChart3, title: "Materials & Finishes", body: "Quality, durability and aesthetic fit" },
  {
    icon: Users,
    title: "Specialist Expertise",
    body: "Engineering, detailing and project coordination",
  },
];

export function OurApproach() {
  const copyRef = useReveal<HTMLDivElement>({ selector: "[data-reveal]", y: 26 });
  const listRef = useReveal<HTMLUListElement>({ selector: "li", y: 22 });
  const markRef = useReveal<HTMLDivElement>({ y: 34, duration: 1 });
  const outcomeRef = useReveal<HTMLDivElement>({ y: 30, duration: 1 });
  const headingRef = useSplitLines<HTMLHeadingElement>();

  return (
    <section id="approach" className="bg-white pb-[clamp(4rem,8vw,9rem)]">
      <div className="shell grid grid-cols-1 items-center gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-2 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,0.7fr)]">
        <div ref={copyRef} className="min-w-0">
          <p
            data-reveal
            className="font-display text-[clamp(0.9375rem,1.3vw,1.25rem)] font-bold tracking-eyebrow text-accent-blue uppercase"
          >
            Our Approach
          </p>
          <h2
            ref={headingRef}
            className="mt-4 font-display text-[clamp(1.5rem,2.1vw,1.75rem)] leading-tight font-medium tracking-tight text-navy"
          >
            Intelligence that brings it all together.
          </h2>
          <span aria-hidden="true" data-reveal className="mt-8 flex items-center">
            <span className="block h-px w-20 bg-accent-blue" />
            <span className="block h-1 w-1 bg-accent-blue" />
          </span>
          <p
            data-reveal
            className="mt-7 max-w-[17.5rem] font-body text-xs leading-normal text-slate"
          >
            We don&rsquo;t manufacture every component. We ensure the right systems, materials and
            expertise come together in perfect balance.
          </p>
        </div>

        <ul ref={listRef} className="min-w-0 space-y-7">
          {CAPABILITIES.map(({ icon: Icon, title, body }) => (
            <Interactive
              as="li"
              key={title}
              lift={-2}
              scale={1.01}
              className="flex min-w-0 items-start gap-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-14 bg-paper">
                <Icon aria-hidden="true" className="h-5 w-5 text-navy" strokeWidth={1.4} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
                  {title}
                </span>
                <span className="mt-1 block font-body text-xs leading-snug text-slate">{body}</span>
              </span>
            </Interactive>
          ))}
        </ul>

        <div ref={markRef} className="relative flex min-w-0 items-center justify-center">
          <svg
            viewBox="0 0 120 240"
            fill="none"
            aria-hidden="true"
            className="absolute top-1/2 -left-[6.5rem] hidden h-[15rem] w-[7.5rem] -translate-y-1/2 xl:block"
          >
            {[18, 86, 154, 222].map((y) => (
              <path
                key={y}
                d={`M0 ${y} H60 Q78 ${y} 78 120 H120`}
                stroke="var(--color-navy-14)"
                strokeWidth="1"
              />
            ))}
          </svg>
          <div className="flex aspect-square w-full max-w-[17.5rem] items-center justify-center rounded-[30%] border border-navy/45">
            <div className="flex aspect-square w-[78%] items-center justify-center rounded-[30%] border border-navy/45">
              <img
                {...IMAGES.aboutDurallMark}
                alt="Durall Systems"
                loading="lazy"
                decoding="async"
                className="w-[70%] object-contain"
              />
            </div>
          </div>
        </div>

        <div ref={outcomeRef} className="min-w-0">
          <img
            {...IMAGES.aboutLineHouse}
            alt="Line drawing of a completed Durall-glazed pavilion"
            loading="lazy"
            decoding="async"
            className="w-full object-contain"
          />
          <p className="mt-6 font-display text-xs font-bold tracking-eyebrow text-navy uppercase">
            Architecture Realized
          </p>
          <p className="mt-2 max-w-[11.25rem] font-body text-xs leading-normal text-slate">
            Seamless integration that performs beautifully and stands the test of time.
          </p>
        </div>
      </div>
    </section>
  );
}
