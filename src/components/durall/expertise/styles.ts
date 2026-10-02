/* Shared measures for the Expertise page's sections, from its design at
 * 1920px wide: content from 258px to 1663px, section labels in Space
 * Grotesk Medium at 13px, headings in Space Grotesk at 72px. */

/** 258px either side at 1920, the standard gutter on small screens. */
export const SHELL =
  "mx-auto w-full max-w-[120rem] px-[clamp(1.25rem,max(3.75vw,22.5vw-10.5rem),16.125rem)]";

/** 140px above and below each section at 1920. */
export const SECTION_Y = "py-[clamp(4rem,7.3vw,8.75rem)]";

export const EYEBROW =
  "font-display text-[0.8125rem] leading-none font-medium tracking-[0.185em] uppercase";

/** 72px over 76px at 1920; the weight is set where it is used. */
export const HEADING =
  "font-display text-[clamp(2.5rem,3.75vw,4.5rem)] leading-[1.056] tracking-[-0.025em] text-balance";

export const LEDE = "font-display text-[clamp(1rem,0.94vw,1.125rem)] leading-[1.56] text-pretty";

/** The paper white behind the light sections. */
export const PAPER = "bg-[#fdfdfb]";

/* The design's pale grey for large numerals (#9aa3aa), darkened a little so
 * it still reads as text: 3:1 on the paper. */
export const NUMERAL = "text-[#868f97]";
