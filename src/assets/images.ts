/**
 * The site's photography, vendored and encoded to WebP.
 *
 * These used to be `*.asset.json` sidecars pointing at Lovable's asset CDN.
 * That CDN serves the untouched original — no WebP or AVIF on `Accept`, no
 * automatic resizing — so the 27 images the site uses shipped as 34.8 MB of
 * PNG, 4.06 MB of it the hero backdrop alone. Re-encoded here they come to
 * 3.22 MB including every responsive variant.
 *
 * Each entry carries `width`/`height` so `<img>` can reserve its box, and the
 * ones whose displayed width really varies carry a `srcSet` as well. Spread an
 * entry onto an `<img>` and add `alt`, `sizes` and `className`:
 *
 *   <img {...IMAGES.heroParikrama} alt="…" sizes="100vw" className="…" />
 *
 * The `.asset.json` files are left in place, unimported. If Lovable re-uploads
 * an image, it lands there rather than here, so re-run the encode step in that
 * case instead of expecting the two to stay in sync on their own.
 */

import heroParikrama960 from "./hero-parikrama-960w.webp";
import heroParikrama1440 from "./hero-parikrama-1440w.webp";
import heroParikrama1920 from "./hero-parikrama.webp";
import philosophyPavilion880 from "./philosophy-pavilion-880w.webp";
import philosophyPavilion1440 from "./philosophy-pavilion.webp";

import projectPatina640 from "./project-patina-640w.webp";
import projectPatina from "./project-patina.webp";
import projectSentosa640 from "./project-sentosa-640w.webp";
import projectSentosa from "./project-sentosa.webp";
import projectChiltron640 from "./project-chiltron-640w.webp";
import projectChiltron from "./project-chiltron.webp";
import projectJuhu640 from "./project-juhu-640w.webp";
import projectJuhu from "./project-juhu.webp";
import projectBangalore640 from "./project-bangalore-640w.webp";
import projectBangalore from "./project-bangalore.webp";
import projectBanyan640 from "./project-banyan-640w.webp";
import projectBanyan from "./project-banyan.webp";
import projectFeatured640 from "./project-featured-640w.webp";
import projectFeatured from "./project-featured.webp";

import thumbParikrama480 from "./thumb-parikrama-480w.webp";
import thumbParikrama from "./thumb-parikrama.webp";
import thumbPatina480 from "./thumb-patina-480w.webp";
import thumbPatina from "./thumb-patina.webp";
import thumbChiltron480 from "./thumb-chiltron-480w.webp";
import thumbChiltron from "./thumb-chiltron.webp";
import thumbJuhu480 from "./thumb-juhu-480w.webp";
import thumbJuhu from "./thumb-juhu.webp";
import thumbRitz480 from "./thumb-ritz-480w.webp";
import thumbRitz from "./thumb-ritz.webp";

import stageDiscover from "./stage-discover.webp";
import stageEngineer from "./stage-engineer.webp";
import stageFabricate from "./stage-fabricate.webp";
import stageInstall from "./stage-install.webp";

import aboutVilla from "./about-villa.webp";
import aboutLake from "./about-lake.webp";
import aboutPlateLeft from "./about-plate-left.webp";
import aboutPlateRight from "./about-plate-right.webp";
import aboutProfile from "./about-profile.webp";
import aboutSectionDrawing from "./about-section-drawing.webp";
import aboutLineHouse from "./about-line-house.webp";
import aboutDurallMark from "./about-durall-mark.webp";

import partnersVilla from "./partners-villa.webp";
import partnersWorldMap from "./partners-world-map.webp";
import contactFrame from "./contact-frame-2.webp";

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  srcSet?: string;
};

const one = (src: string, width: number, height: number): ImageAsset => ({
  src,
  width,
  height,
});

/** Builds a srcSet from [url, width] pairs; the last pair is the default src. */
const set = (variants: ReadonlyArray<readonly [string, number]>, height: number): ImageAsset => {
  const largest = variants[variants.length - 1]!;
  return {
    src: largest[0],
    width: largest[1],
    height,
    srcSet: variants.map(([url, w]) => `${url} ${w}w`).join(", "),
  };
};

export const IMAGES = {
  heroParikrama: set(
    [
      [heroParikrama960, 960],
      [heroParikrama1440, 1440],
      [heroParikrama1920, 1920],
    ],
    1287,
  ),
  philosophyPavilion: set(
    [
      [philosophyPavilion880, 880],
      [philosophyPavilion1440, 1440],
    ],
    1309,
  ),

  projectPatina: set(
    [
      [projectPatina640, 640],
      [projectPatina, 1360],
    ],
    907,
  ),
  projectSentosa: set(
    [
      [projectSentosa640, 640],
      [projectSentosa, 1360],
    ],
    907,
  ),
  projectChiltron: set(
    [
      [projectChiltron640, 640],
      [projectChiltron, 1360],
    ],
    907,
  ),
  projectJuhu: set(
    [
      [projectJuhu640, 640],
      [projectJuhu, 1360],
    ],
    907,
  ),
  projectBangalore: set(
    [
      [projectBangalore640, 640],
      [projectBangalore, 1360],
    ],
    907,
  ),
  projectBanyan: set(
    [
      [projectBanyan640, 640],
      [projectBanyan, 1360],
    ],
    907,
  ),
  projectFeatured: set(
    [
      [projectFeatured640, 640],
      [projectFeatured, 1153],
    ],
    721,
  ),

  thumbParikrama: set(
    [
      [thumbParikrama480, 480],
      [thumbParikrama, 910],
    ],
    910,
  ),
  thumbPatina: set(
    [
      [thumbPatina480, 480],
      [thumbPatina, 910],
    ],
    910,
  ),
  thumbChiltron: set(
    [
      [thumbChiltron480, 480],
      [thumbChiltron, 934],
    ],
    910,
  ),
  thumbJuhu: set(
    [
      [thumbJuhu480, 480],
      [thumbJuhu, 910],
    ],
    910,
  ),
  thumbRitz: set(
    [
      [thumbRitz480, 480],
      [thumbRitz, 922],
    ],
    910,
  ),

  stageDiscover: one(stageDiscover, 760, 967),
  stageEngineer: one(stageEngineer, 1382, 996),
  stageFabricate: one(stageFabricate, 782, 782),
  stageInstall: one(stageInstall, 1382, 736),

  aboutVilla: one(aboutVilla, 1023, 840),
  aboutLake: one(aboutLake, 1400, 820),
  aboutPlateLeft: one(aboutPlateLeft, 462, 523),
  aboutPlateRight: one(aboutPlateRight, 438, 523),
  aboutProfile: one(aboutProfile, 570, 432),
  aboutSectionDrawing: one(aboutSectionDrawing, 772, 434),
  aboutLineHouse: one(aboutLineHouse, 578, 404),
  aboutDurallMark: one(aboutDurallMark, 394, 122),

  partnersVilla: one(partnersVilla, 1365, 648),
  partnersWorldMap: one(partnersWorldMap, 1400, 474),
  contactFrame: one(contactFrame, 1920, 826),
} as const satisfies Record<string, ImageAsset>;
