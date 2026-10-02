import type { ReactNode } from "react";
import { useCurtainReveal } from "./motion";
import type { Photo } from "./data";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      data-rise
      className={`font-display text-[0.6875rem] font-bold tracking-[0.18em] text-slate uppercase ${className}`}
    >
      {children}
    </p>
  );
}

/**
 * Label / value pairs between hairlines. The hairlines are their own
 * elements so the reveal can draw them from the left, one per row, with the
 * row's text rising behind.
 */
export function FactRows({ rows }: { rows: ReadonlyArray<readonly [string, string]> }) {
  return (
    // The hairlines sit inside the <dd>s (and above the list) because a <dl>
    // and its row <div>s may only contain terms and descriptions.
    <div className="relative">
      <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-navy-14" />
      <dl>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="relative flex items-baseline justify-between gap-6 py-[clamp(0.75rem,1.1vw,0.95rem)]"
          >
            <dt
              data-rise
              className="font-display text-[0.6875rem] font-bold tracking-[0.14em] text-slate uppercase"
            >
              {label}
            </dt>
            <dd className="text-right font-body text-sm text-navy">
              <span data-rise data-with-prev className="block">
                {value}
              </span>
              <span
                data-rule
                data-with-prev
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-navy-14"
              />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** A photograph that is wiped in from its bottom edge and then drifts. */
export function CurtainImage({
  photo,
  sizes,
  className = "",
}: {
  photo: Photo;
  sizes: string;
  className?: string;
}) {
  const ref = useCurtainReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div data-curtain className="absolute inset-0 overflow-hidden">
        <div data-curtain-counter className="absolute inset-0">
          <div data-drift className="absolute inset-x-0 -top-[4%] h-[108%]">
            <img
              draggable={false}
              {...photo.image}
              alt={photo.alt}
              sizes={sizes}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
