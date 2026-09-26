import type { ReactNode } from "react";
import { IMAGES } from "@/assets/images";

/**
 * The login and set-password screens: the site's own hero photograph under
 * a navy wash on one side, the form on white on the other.
 */
export function AuthFrame({
  title,
  intro,
  children,
}: {
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  const hero = IMAGES.heroParikrama;
  return (
    <div className="admin-root grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <img
          src={hero.src}
          srcSet={"srcSet" in hero ? hero.srcSet : undefined}
          sizes="55vw"
          width={hero.width}
          height={hero.height}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-navy via-navy/70 to-navy/30"
        />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
              <path
                d="M4 4h7a8 8 0 0 1 0 16H4V4Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M14 12h7" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span
              translate="no"
              className="font-display text-sm font-bold tracking-[0.16em] uppercase"
            >
              Durall Systems
            </span>
          </div>
          <div>
            <p className="max-w-[22ch] font-display text-[clamp(2rem,3vw,3rem)] leading-[1.06] font-medium tracking-tight text-balance">
              Engineering spaces without boundaries.
            </p>
            <p className="mt-4 text-sm text-white/70">The Durall website’s editing room.</p>
          </div>
        </div>
      </div>
      <main className="flex min-h-dvh items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="font-display text-[0.6875rem] font-bold tracking-[0.16em] text-accent-blue uppercase">
            Durall Admin
          </p>
          <h1 className="mt-3 font-display text-[1.875rem] leading-tight font-medium tracking-tight text-navy">
            {title}
          </h1>
          <div className="mt-2 text-sm leading-relaxed text-pretty text-slate">{intro}</div>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
