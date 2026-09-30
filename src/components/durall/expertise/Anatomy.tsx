import { useId, useState, type ReactNode } from "react";
import { useSectionIntro } from "@/lib/anim";
import { linkTo, Lines } from "@/content/render";
import type { ExpertisePage } from "@/content/types";
import { EYEBROW, HEADING, LEDE, SECTION_Y, SHELL } from "./styles";

/**
 * "Every millimetre has a job.": the navy section with a sill section through
 * the flush sliding system, and the six parts it is made of. The list on the
 * left and the numbers on the drawing select the same part; the open part's
 * number is lit on the drawing, as the design shows for the thermal break.
 */
type Content = ExpertisePage["anatomy"];

/* Where each part's callout sits on the drawing (843 × 904, the design's own
 * units): the point on the part, and the numbered circle its leader runs to. */
const CALLOUTS = [
  { at: [452, 250], circle: [720, 250] },
  { at: [458, 398], circle: [720, 360] },
  { at: [442, 560], circle: [720, 520] },
  { at: [344, 622], circle: [120, 560] },
  { at: [250, 715], circle: [120, 660] },
  { at: [690, 664], circle: [760, 620] },
] as const;

const W = 843;
const H = 904;
const pct = (x: number, total: number) => `${(x / total) * 100}%`;
const nn = (index: number) => String(index + 1).padStart(2, "0");
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function Anatomy({ content }: { content: Content }) {
  // The thermal break is open to begin with, as in the design.
  const [open, setOpen] = useState<number | null>(2);
  const introRef = useSectionIntro<HTMLDivElement>();
  const id = useId();

  return (
    <section id="anatomy" className={`bg-navy text-white ${SECTION_Y}`}>
      <div
        className={`${SHELL} grid grid-cols-1 gap-x-[clamp(2rem,3.2vw,3.9rem)] gap-y-[clamp(3rem,6vw,4rem)] lg:grid-cols-[minmax(0,500fr)_minmax(0,843fr)] lg:items-start`}
      >
        <div className="min-w-0">
          <div ref={introRef}>
            <p data-anim className={`${EYEBROW} text-silver`}>
              {content.eyebrow}
            </p>
            <h2
              data-anim="lines"
              className={`mt-[clamp(1rem,1.25vw,1.5rem)] ${HEADING} text-white lg:whitespace-nowrap`}
            >
              <Lines text={content.heading} />
            </h2>
            <p
              data-anim
              className={`mt-[clamp(1rem,1.15vw,1.4rem)] max-w-[27.5rem] ${LEDE} text-silver`}
            >
              {content.body}
            </p>
          </div>

          <ul className="mt-[clamp(2rem,3.1vw,3.7rem)] border-b border-white/16">
            {content.parts.map((part, index) => {
              const active = open === index;
              const panel = `${id}-part-${index}`;
              return (
                <li
                  key={index}
                  className={`border-t transition-colors duration-[var(--dur-short)] ${
                    active ? "border-white/60" : "border-white/16"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={active}
                      aria-controls={panel}
                      onClick={() => setOpen(active ? null : index)}
                      className={`group flex min-h-[4.6875rem] w-full cursor-pointer items-center gap-[clamp(1rem,1.3vw,1.6rem)] text-left ${FOCUS}`}
                    >
                      <span
                        className={`w-[1.75rem] shrink-0 font-display text-[0.8125rem] font-medium tracking-[0.12em] tabular-nums transition-colors duration-[var(--dur-short)] ${
                          active ? "text-white" : "text-white/50 group-hover:text-white/80"
                        }`}
                      >
                        {nn(index)}
                      </span>
                      <span
                        className={`min-w-0 flex-1 font-display leading-tight transition-colors duration-[var(--dur-short)] ${
                          active
                            ? "text-[clamp(1.25rem,1.35vw,1.625rem)] text-white"
                            : "text-[clamp(1.125rem,1.15vw,1.375rem)] text-white/50 group-hover:text-white/80"
                        }`}
                      >
                        {part.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`w-4 shrink-0 text-center font-display text-lg ${
                          active ? "text-white" : "text-white/50"
                        }`}
                      >
                        {active ? "−" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panel}
                    hidden={!active}
                    className="pb-[clamp(1.5rem,2vw,2.4rem)] pl-[calc(1.75rem+clamp(1rem,1.3vw,1.6rem))]"
                  >
                    <p className="max-w-[25rem] font-display text-base leading-[1.56] text-pretty text-silver">
                      {part.body}
                    </p>
                    {part.appliesTo ? (
                      <p className="mt-[clamp(1rem,1.2vw,1.4rem)] font-display text-xs font-medium tracking-[0.15em] uppercase">
                        {content.appliesToLabel} · {part.appliesTo}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <Drawing content={content} open={open} onSelect={setOpen} />
      </div>
    </section>
  );
}

function Drawing({
  content,
  open,
  onSelect,
}: {
  content: Content;
  open: number | null;
  onSelect: (index: number) => void;
}) {
  const label =
    "pointer-events-none absolute font-display text-[max(0.5rem,1.3cqw)] leading-none font-medium tracking-[0.18em] text-white/70 uppercase";
  const download = content.download.href ? linkTo(content.download.href) : null;

  return (
    <figure className="min-w-0 border border-white/22">
      <div className="@container relative aspect-[843/904]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          fill="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <g>
            <path d="M125 76V188" stroke="white" strokeOpacity="0.8" />
            <path d="M628 640V688" stroke="white" strokeOpacity="0.6" />
            <path d="M628 664H700" stroke="white" strokeOpacity="0.9" />
            <path d="M352 676V748" stroke="white" strokeOpacity="0.55" />
            <path
              d="M0 766L14 752M0 780L28 752M0 794L42 752M0 808L56 752M0 822L70 752M0 836L84 752M0 850L98 752M4 860L112 752M18 860L126 752M32 860L140 752M46 860L150 756M60 860L150 770M74 860L150 784M88 860L150 798M102 860L150 812M116 860L150 826M130 860L150 840M144 860L150 854"
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="0.8"
            />
            <path d="M0 752H150" stroke="white" strokeOpacity="0.3" />
            <path
              d="M640 686L650 676M640 696L660 676M640 706L670 676M640 716L680 676M640 726L690 676M640 736L700 676M640 746L710 676M640 756L720 676M646 760L730 676M656 760L740 676M666 760L750 676M676 760L760 676M686 760L770 676M696 760L780 676M706 760L790 676M716 760L800 676M726 760L810 676M736 760L820 676M746 760L830 676M756 760L840 676M766 760L843 683M776 760L843 693M786 760L843 703M796 760L843 713M806 760L843 723M816 760L843 733M826 760L843 743M836 760L843 753"
              stroke="white"
              strokeOpacity="0.18"
              strokeWidth="0.8"
            />
            <path d="M150 860H843" stroke="white" strokeOpacity="0.2" />
            <path
              d="M150 760H843M384 104L392 90M440 104L448 90M384 150L392 136M440 150L448 136M384 196L392 182M440 196L448 182M384 242L392 228M440 242L448 228M384 288L392 274M440 288L448 274M384 334L392 320M440 334L448 320M384 380L392 366M440 380L448 366M384 426L392 412M440 426L448 412M384 472L392 458M440 472L448 458"
              stroke="white"
              strokeOpacity="0.35"
            />
            <path
              d="M150 774L164 760M150 788L178 760M150 802L192 760M150 816L206 760M150 830L220 760M150 844L234 760M150 858L248 760M162 860L262 760M176 860L276 760M190 860L290 760M204 860L304 760M218 860L318 760M232 860L332 760M246 860L346 760M260 860L360 760M274 860L374 760M288 860L388 760M302 860L402 760M316 860L416 760M330 860L430 760M344 860L444 760M358 860L458 760M372 860L472 760M386 860L486 760M400 860L500 760M414 860L514 760M428 860L528 760M442 860L542 760M456 860L556 760M470 860L570 760M484 860L584 760M498 860L598 760M512 860L612 760M526 860L626 760M540 860L640 760M554 860L654 760M568 860L668 760M582 860L682 760M596 860L696 760M610 860L710 760M624 860L724 760M638 860L738 760M652 860L752 760M666 860L766 760M680 860L780 760M694 860L794 760M708 860L808 760M722 860L822 760M736 860L836 760M750 860L843 767M764 860L843 781M778 860L843 795M792 860L843 809M806 860L843 823M820 860L843 837M834 860L843 851"
              stroke="white"
              strokeOpacity="0.12"
              strokeWidth="0.8"
            />
            <path
              d="M0 904V0H843M32 0V904M64 0V904M96 0V904M128 0V904M160 0V904M192 0V904M224 0V904M256 0V904M288 0V904M320 0V904M352 0V904M384 0V904M416 0V904M448 0V904M480 0V904M512 0V904M544 0V904M576 0V904M608 0V904M640 0V904M672 0V904M704 0V904M736 0V904M768 0V904M800 0V904M832 0V904M0 32H843M0 64H843M0 96H843M0 128H843M0 160H843M0 192H843M0 224H843M0 256H843M0 288H843M0 320H843M0 352H843M0 384H843M0 416H843M0 448H843M0 480H843M0 512H843M0 544H843M0 576H843M0 608H843M0 640H843M0 672H843M0 704H843M0 736H843M0 768H843M0 800H843M0 832H843M0 864H843M0 896H843"
              stroke="white"
              strokeOpacity="0.04"
            />
            <path
              d="M843 664H640V676H843V664Z"
              fill="white"
              fillOpacity="0.08"
              stroke="white"
              strokeOpacity="0.8"
              strokeWidth="1.2"
            />
            <path
              d="M190 740H0V752H190V740Z"
              fill="white"
              fillOpacity="0.06"
              stroke="white"
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            <path
              d="M190 724L300 664H404V760H300V740H190V724Z"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M392 676H312V748H392V676Z"
              stroke="white"
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
            <path
              d="M640 664H428V760H640V664Z"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M520 676H440V748H520V676Z"
              stroke="white"
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
            <path
              d="M628 676H532V748H628V676Z"
              stroke="white"
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
            <path
              d="M428 676H404V692H428V676Z"
              fill="white"
              fillOpacity="0.9"
              stroke="white"
              strokeWidth="1.4"
            />
            <path
              d="M428 732H404V748H428V732Z"
              fill="white"
              fillOpacity="0.9"
              stroke="white"
              strokeWidth="1.4"
            />
            <path
              d="M332 664H316V676H332V664Z"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M324 648V704L206 730"
              stroke="white"
              strokeOpacity="0.8"
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
            <path
              d="M206 730L218 722L219 734L206 730Z"
              fill="white"
              stroke="white"
              strokeWidth="1.2"
            />
            <path
              d="M368 642H360V664H368V642Z"
              fill="white"
              fillOpacity="0.3"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M364 642C375.046 642 384 633.046 384 622C384 610.954 375.046 602 364 602C352.954 602 344 610.954 344 622C344 633.046 352.954 642 364 642Z"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M364 628C367.314 628 370 625.314 370 622C370 618.686 367.314 616 364 616C360.686 616 358 618.686 358 622C358 625.314 360.686 628 364 628Z"
              fill="white"
              fillOpacity="0.6"
            />
            <path
              d="M346 400H380V520H404V600H346V400Z"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M372 420H356V510H372V420Z"
              stroke="white"
              strokeOpacity="0.5"
              strokeWidth="1.2"
            />
            <path
              d="M394 540H356V588H394V540Z"
              stroke="white"
              strokeOpacity="0.5"
              strokeWidth="1.2"
            />
            <path
              d="M452 400H486V600H428V520H452V400Z"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M478 420H462V510H478V420Z"
              stroke="white"
              strokeOpacity="0.5"
              strokeWidth="1.2"
            />
            <path
              d="M476 540H438V588H476V540Z"
              stroke="white"
              strokeOpacity="0.5"
              strokeWidth="1.2"
            />
            <path
              d="M428 530H404V546H428V530Z"
              fill="white"
              fillOpacity="0.9"
              stroke="white"
              strokeWidth="1.4"
            />
            <path
              d="M428 574H404V590H428V574Z"
              fill="white"
              fillOpacity="0.9"
              stroke="white"
              strokeWidth="1.4"
            />
            <path
              d="M396 60H380V520H396V60Z"
              fill="white"
              fillOpacity="0.1"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M452 60H436V520H452V60Z"
              fill="white"
              fillOpacity="0.1"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M436 490H396V512H436V490Z"
              fill="white"
              fillOpacity="0.15"
              stroke="white"
              strokeOpacity="0.8"
              strokeWidth="1.2"
            />
            <path
              d="M362 60H400L408 48L424 72L432 60H470"
              stroke="white"
              strokeOpacity="0.9"
              strokeWidth="1.2"
            />
            <path
              d="M376 388H375C372.791 388 371 389.791 371 392V406C371 408.209 372.791 410 375 410H376C378.209 410 380 408.209 380 406V392C380 389.791 378.209 388 376 388Z"
              fill="white"
              fillOpacity="0.85"
            />
            <path
              d="M457 388H456C453.791 388 452 389.791 452 392V406C452 408.209 453.791 410 456 410H457C459.209 410 461 408.209 461 406V392C461 389.791 459.209 388 457 388Z"
              fill="white"
              fillOpacity="0.85"
            />
            <path
              d="M436 516H396C392.686 516 390 518.686 390 522V754C390 757.314 392.686 760 396 760H436C439.314 760 442 757.314 442 754V522C442 518.686 439.314 516 436 516Z"
              stroke="white"
              strokeOpacity="0.95"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <path d="M210 76H40V188H210V76Z" stroke="white" strokeOpacity="0.8" strokeWidth="1.2" />
            <path
              d="M121 84H48V180H121V84Z"
              stroke="white"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <path
              d="M202 84H129V180H202V84Z"
              stroke="white"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <path d="M86 64V200" stroke="white" strokeWidth="1.2" strokeDasharray="6 3 1 3" />
            <path d="M80 64H92L86 56L80 64Z" fill="white" stroke="white" strokeWidth="1.2" />
            <path d="M80 200H92L86 208L80 200Z" fill="white" stroke="white" strokeWidth="1.2" />
          </g>
          {CALLOUTS.map(({ at, circle }, index) => {
            const active = open === index;
            const edge = circle[0] + (at[0] < circle[0] ? -16 : 16);
            return (
              <g key={index}>
                <path
                  d={`M${at[0]} ${at[1]}L${edge} ${circle[1]}`}
                  stroke="white"
                  strokeOpacity={active ? 1 : 0.75}
                />
                <circle cx={at[0]} cy={at[1]} r="3" fill="white" />
                {active ? (
                  <circle
                    cx={circle[0]}
                    cy={circle[1]}
                    r="26"
                    stroke="white"
                    strokeOpacity="0.35"
                  />
                ) : null}
                <circle
                  cx={circle[0]}
                  cy={circle[1]}
                  r="16"
                  fill={active ? "white" : "#050834"}
                  stroke="white"
                  strokeOpacity={active ? 1 : 0.85}
                  strokeWidth="1.2"
                />
              </g>
            );
          })}
        </svg>

        <span className={label} style={{ left: pct(260, W), top: pct(24, H) }}>
          {content.outside}
        </span>
        <span className={label} style={{ left: pct(752, W), top: pct(24, H) }}>
          {content.inside} <span aria-hidden="true">→</span>
        </span>
        <span
          className={`${label} text-[max(0.4375rem,1.19cqw)] text-white/55`}
          style={{ left: pct(40, W), top: pct(218, H) }}
        >
          {content.elevation}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute font-display text-[max(0.5rem,1.42cqw)] leading-none tracking-[0.08em] text-white/90"
          style={{ left: pct(636, W), top: pct(642, H) }}
        >
          ±0
        </span>

        {CALLOUTS.map(({ circle }, index) => {
          const active = open === index;
          const part = content.parts[index];
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`${nn(index)}: ${part?.title ?? ""}`}
              aria-pressed={active}
              className={`absolute flex size-[max(1.75rem,5.2cqw)] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full font-display text-[max(0.5625rem,1.42cqw)] font-medium tabular-nums ${
                active ? "text-navy" : "text-white hover:bg-white/10"
              } ${FOCUS}`}
              style={{ left: pct(circle[0], W), top: pct(circle[1], H) }}
            >
              {nn(index)}
            </button>
          );
        })}
      </div>

      <figcaption className="grid grid-cols-2 border-t border-white/22 sm:grid-cols-[170fr_371fr_130fr_170fr]">
        <Cell label={content.detail.label}>
          <span className="font-display text-[clamp(1.5rem,1.56vw,1.875rem)] leading-none font-light">
            {content.detail.value}
          </span>
        </Cell>
        <Cell
          label={content.drawing.label}
          className="order-first col-span-2 sm:order-none sm:col-span-1"
        >
          <span className="block font-display text-[clamp(1rem,0.94vw,1.125rem)] leading-[1.33]">
            {content.drawing.title}
          </span>
          <span className="mt-1 block font-display text-[0.8125rem] text-white/55">
            {content.drawing.hint}
          </span>
        </Cell>
        <Cell label={content.scale.label}>
          <span className="font-display text-[clamp(1.5rem,1.56vw,1.875rem)] leading-none font-light">
            {content.scale.value}
          </span>
        </Cell>
        {download ? (
          <Cell label={content.download.heading} last>
            <a
              href={"to" in download ? download.to : download.href}
              className={`font-display text-[0.8125rem] font-medium tracking-[0.12em] uppercase underline underline-offset-4 hover:text-white/75 ${FOCUS}`}
            >
              {content.download.label} <span aria-hidden="true">↓</span>
            </a>
          </Cell>
        ) : null}
      </figcaption>
    </figure>
  );
}

function Cell({
  label,
  children,
  className = "",
  last = false,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`min-w-0 border-white/22 px-[clamp(1rem,1.25vw,1.5rem)] py-[clamp(1rem,1.15vw,1.4rem)] ${
        last ? "" : "sm:border-r"
      } ${className}`}
    >
      <p className="font-display text-[0.6875rem] tracking-[0.16em] text-white/55 uppercase">
        {label}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}
