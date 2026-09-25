import adl from "@/assets/partners/adl.webp";
import afw from "@/assets/partners/afw.webp";
import agor from "@/assets/partners/agor.webp";
import bedmar from "@/assets/partners/bedmar.webp";
import brombal from "@/assets/partners/brombal.webp";
import ecoid from "@/assets/partners/ecoid.svg";
import glasmarte from "@/assets/partners/glasmarte.svg";
import meshtec from "@/assets/partners/meshtec.webp";
import nomadic from "@/assets/partners/nomadic.webp";
import palagina from "@/assets/partners/palagina.webp";
import renson from "@/assets/partners/renson.svg";
import resplendent from "@/assets/partners/resplendent.svg";
import som from "@/assets/partners/som.webp";

/**
 * A company's own logo, as published on its website. `rem` is the
 * displayed height in rem, set per logo so that marks of very different
 * shapes — Brombal's long wordmark, Agor's stacked one — carry about the same
 * visual weight in the grid.
 *
 * Sources (September 2026): adldesign.it, afw.sg, agor.co.il, ebasg.com,
 * discoverbrombal.com, ecoid.com, glasmarte.at, meshtec.com,
 * nomadicresorts.com, palagina.eu, renson.net, resplendentceylon.com, som.com.
 * Raster files were trimmed to the mark and re-encoded; nothing was redrawn.
 *
 * Jofebar, WOW and Studio MK27 have no `logo` yet and keep their typographic
 * placeholder: jofebar.com serves files only past a bot check, WOW's mark
 * exists only inside a background image, and Studio MK27's site sets its name
 * as live text. Drop their official files into src/assets/partners/ and add
 * a `logo` entry here.
 */
export type Logo = { src: string; width: number; height: number; rem: number };

export type PartnerMark =
  "jofebar" | "glasmarte" | "meshtec" | "agor" | "adl" | "palagina" | "brombal" | "renson";

export type Partner = {
  mark: PartnerMark;
  logo?: Logo;
  name: string;
  country: string;
  description: string;
};

export const PARTNERS: Partner[] = [
  {
    mark: "jofebar",
    name: "Jofebar",
    country: "Switzerland / Portugal",
    description: "PanoramAH! minimal window systems",
  },
  {
    mark: "glasmarte",
    logo: { src: glasmarte, width: 185, height: 35, rem: 1.5 },
    name: "Glas Marte",
    country: "Austria",
    description: "Seamless glass railing systems",
  },
  {
    mark: "meshtec",
    logo: { src: meshtec, width: 352, height: 77, rem: 1.9 },
    name: "Meshtec",
    country: "Thailand",
    description: "Stainless steel high transparency security mesh",
  },
  {
    mark: "agor",
    logo: { src: agor, width: 148, height: 95, rem: 2.9 },
    name: "Agor",
    country: "Israel",
    description: "Movable and retractable swimming pool floors",
  },
  {
    mark: "adl",
    logo: { src: adl, width: 92, height: 40, rem: 1.6 },
    name: "ADL",
    country: "Italy",
    description: "Connecting internal spaces",
  },
  {
    mark: "palagina",
    logo: { src: palagina, width: 600, height: 152, rem: 2 },
    name: "Palagina",
    country: "Italy",
    description: "Italian vertical and horizontal sliding insect screens",
  },
  {
    mark: "brombal",
    logo: { src: brombal, width: 600, height: 56, rem: 0.95 },
    name: "Brombal",
    country: "Italy",
    description: "Italian luxury fenestration with special metals",
  },
  {
    mark: "renson",
    logo: { src: renson, width: 172, height: 30, rem: 2.2 },
    name: "Renson",
    country: "Belgium",
    description: "Pioneers in indoor climate",
  },
];

export type PracticeMark = "plain" | "wow" | "italic" | "ecoid" | "diamond" | "solid";

export type Practice = {
  mark: PracticeMark;
  logo?: Logo;
  name: string;
  country: string;
  description: string;
};

export const PRACTICES: Practice[] = [
  {
    mark: "plain",
    name: "Ernesto Bedmar Architects",
    logo: { src: bedmar, width: 499, height: 39, rem: 0.95 },
    country: "Singapore",
    description: "Tropical modernist residential architecture",
  },
  {
    mark: "wow",
    name: "WOW",
    country: "Singapore",
    description: "Award-winning interior & architectural design",
  },
  {
    mark: "italic",
    logo: { src: afw, width: 600, height: 380, rem: 2.6 },
    // Formerly Andy Fisher Workshop.
    name: "AFW",
    country: "Singapore",
    description: "Bespoke interior design & space planning",
  },
  {
    mark: "ecoid",
    name: "eco.id",
    logo: { src: ecoid, width: 114, height: 23, rem: 1.35 },
    country: "Singapore",
    description: "Sustainable architecture & green design",
  },
  {
    mark: "diamond",
    name: "Nomadic Resorts",
    logo: { src: nomadic, width: 249, height: 249, rem: 2.5 },
    country: "Netherlands",
    description: "Eco-luxury resorts & sustainable hospitality",
  },
  {
    mark: "solid",
    name: "SOM",
    logo: { src: som, width: 600, height: 208, rem: 2.1 },
    country: "USA",
    description: "Global architecture, engineering & urban planning",
  },
  {
    mark: "solid",
    name: "Studio MK27",
    country: "Brazil",
    description: "Contemporary Brazilian residential architecture",
  },
  {
    mark: "solid",
    name: "Resplendent Ceylon",
    logo: { src: resplendent, width: 701, height: 193, rem: 2.2 },
    country: "Ceylon",
    description: "Heritage luxury hospitality & resort design",
  },
];
