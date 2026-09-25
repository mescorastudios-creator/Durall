import type { Logo, PartnerMark, PracticeMark } from "./data";

/** A company's own logo file, at its tuned height. */
function OfficialLogo({ logo, name }: { logo: Logo; name: string }) {
  return (
    <img
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={name}
      loading="lazy"
      decoding="async"
      style={{ height: `${logo.rem}rem` }}
      className="w-auto max-w-[11.5rem] object-contain"
    />
  );
}

function PlusGlyph({ className = "h-2 w-2" }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 8" fill="none" aria-hidden="true" className={className}>
      <path d="M4 0.6v6.8M0.6 4h6.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Typographic partner wordmarks, drawn with the site's own type and palette. */
export function PartnerLogo({
  mark,
  name,
  logo,
}: {
  mark: PartnerMark;
  name: string;
  logo?: Logo | undefined;
}) {
  if (logo) return <OfficialLogo logo={logo} name={name} />;
  switch (mark) {
    case "jofebar":
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-display text-[clamp(1.05rem,1.35vw,1.375rem)] font-bold text-navy">
            Jofebar
          </span>
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-accent-blue text-white">
            <PlusGlyph />
          </span>
        </span>
      );
    case "glasmarte":
      return (
        <span className="inline-flex items-end gap-1">
          <span className="font-display text-[clamp(1.05rem,1.35vw,1.375rem)] font-medium tracking-[-0.01em] text-accent-blue">
            glasmarte
          </span>
          <span aria-hidden="true" className="mb-1.5 h-1 w-1 rounded-full bg-accent-blue" />
        </span>
      );
    case "meshtec":
      return (
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-[1.125rem] w-[1.125rem] rotate-45 items-center justify-center rounded-[0.1875rem] bg-accent-blue"
          >
            <span className="h-1.5 w-1.5 bg-white" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[clamp(0.875rem,1vw,1rem)] font-bold text-accent-blue">
              MESHTEC
            </span>
            <span className="mt-1 font-display text-[0.375rem] font-bold tracking-eyebrow text-slate uppercase">
              Advanced Mesh Solutions
            </span>
          </span>
        </span>
      );
    case "agor":
      return (
        <span className="inline-flex flex-col items-center leading-none text-navy">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <PlusGlyph />
            <PlusGlyph />
            <span className="h-1.5 w-1.5 border-[1.5px] border-navy" />
            <PlusGlyph />
          </span>
          <span className="mt-1.5 font-display text-[clamp(0.9375rem,1.15vw,1.125rem)] font-bold">
            AGOR
          </span>
          <span className="mt-1 font-display text-[0.4375rem] tracking-eyebrow text-slate uppercase">
            Creative Engineering
          </span>
        </span>
      );
    case "adl":
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-display text-[clamp(1.25rem,1.7vw,1.75rem)] font-bold text-navy">
            ADL
          </span>
          <span aria-hidden="true" className="h-0 w-4 border-t-2 border-navy" />
        </span>
      );
    case "palagina":
      return (
        <span className="inline-flex items-center gap-2 rounded-sm bg-navy px-3 py-1.5 text-white">
          <span aria-hidden="true" className="h-2 w-2 rotate-45 border border-white" />
          <span className="font-display text-[clamp(0.75rem,0.95vw,0.875rem)] font-bold tracking-eyebrow uppercase">
            Palagina
          </span>
        </span>
      );
    case "brombal":
      return (
        <span className="inline-flex flex-col items-center leading-none">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-navy font-display text-[0.8125rem] font-bold text-white">
            B
          </span>
          <span className="mt-1.5 font-display text-[0.625rem] font-bold tracking-eyebrow text-navy uppercase">
            Brombal
          </span>
        </span>
      );
    case "renson":
      return (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-1 w-3 bg-accent-blue" />
          <span className="font-display text-[clamp(0.9375rem,1.2vw,1.125rem)] font-bold tracking-eyebrow text-accent-blue uppercase">
            Renson
          </span>
        </span>
      );
    default:
      return <span className="font-display text-base font-bold text-navy">{name}</span>;
  }
}

/** Typographic practice wordmarks. */
export function PracticeLogo({
  mark,
  name,
  logo,
}: {
  mark: PracticeMark;
  name: string;
  logo?: Logo | undefined;
}) {
  // Nomadic Resorts publishes its emblem without the name, so the name is set
  // beside it rather than leaving an unlabelled circle in the grid.
  if (logo && mark === "diamond") {
    return (
      <span className="inline-flex items-center gap-2.5">
        <OfficialLogo logo={logo} name="" />
        <span className="font-display text-[0.8125rem] font-bold tracking-[0.06em] text-navy uppercase">
          {name}
        </span>
      </span>
    );
  }
  if (logo) return <OfficialLogo logo={logo} name={name} />;
  switch (mark) {
    case "wow":
      return (
        <span className="font-display text-[clamp(1.125rem,1.5vw,1.5rem)] font-bold tracking-[0.05em] text-navy">
          WOW
        </span>
      );
    case "italic":
      return (
        <span className="font-serif text-[clamp(0.9375rem,1.15vw,1.125rem)] font-medium italic text-navy">
          {name}
        </span>
      );
    case "ecoid":
      return (
        <span className="inline-flex items-center gap-1.5 font-display text-[clamp(1rem,1.3vw,1.25rem)] font-medium tracking-[0.12em] text-navy">
          eco
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-navy" />
          id
        </span>
      );
    case "diamond":
      return (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rotate-45 border border-slate" />
          <span className="font-display text-[clamp(0.6875rem,0.9vw,0.8125rem)] font-bold tracking-eyebrow text-navy uppercase">
            {name}
          </span>
        </span>
      );
    case "solid":
      return (
        <span className="inline-flex items-center rounded-sm bg-navy px-3 py-1.5 font-display text-[clamp(0.625rem,0.85vw,0.75rem)] font-bold tracking-eyebrow text-white uppercase">
          {name}
        </span>
      );
    default:
      return (
        <span className="max-w-[9rem] text-center font-display text-[clamp(0.625rem,0.85vw,0.75rem)] font-bold tracking-eyebrow text-navy uppercase">
          {name}
        </span>
      );
  }
}
