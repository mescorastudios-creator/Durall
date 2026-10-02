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

// The first frame of the home page's opening film (public/video/hero-*).
import heroFilm960 from "./hero-film-960w.webp";
import heroFilm1440 from "./hero-film-1440w.webp";
import heroFilm1920 from "./hero-film.webp";
import heroParikrama960 from "./hero-parikrama-960w.webp";
import heroParikrama1440 from "./hero-parikrama-1440w.webp";
import heroParikrama1920 from "./hero-parikrama.webp";
import heroAbout960 from "./hero-about-960w.webp";
import heroAbout1440 from "./hero-about-1440w.webp";
import heroAbout1920 from "./hero-about.webp";
import heroPartners960 from "./hero-partners-960w.webp";
import heroPartners1440 from "./hero-partners-1440w.webp";
import heroPartners1920 from "./hero-partners.webp";
import heroProjects960 from "./hero-projects-960w.webp";
import heroProjects1440 from "./hero-projects-1440w.webp";
import heroProjects1920 from "./hero-projects.webp";
import heroCareers960 from "./hero-careers-960w.webp";
import heroCareers1440 from "./hero-careers-1440w.webp";
import heroCareers1920 from "./hero-careers.webp";
import logoDurallWhite from "./logo-durall-white.webp";
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

import cardParikrama480 from "./card-parikrama-480w.webp";
import cardParikrama from "./card-parikrama.webp";
import cardPatina480 from "./card-patina-480w.webp";
import cardPatina from "./card-patina.webp";
import cardChiltron480 from "./card-chiltron-480w.webp";
import cardChiltron from "./card-chiltron.webp";
import cardJuhu480 from "./card-juhu-480w.webp";
import cardJuhu from "./card-juhu.webp";
import cardRitz480 from "./card-ritz-480w.webp";
import cardRitz from "./card-ritz.webp";

import homeParikrama480 from "./home-parikrama-480w.webp";
import homeParikrama from "./home-parikrama.webp";
import homeParikrama1040 from "./home-parikrama-1040w.webp";
import homePatina480 from "./home-patina-480w.webp";
import homePatina from "./home-patina.webp";
import homePatina1040 from "./home-patina-1040w.webp";
import homeChiltern480 from "./home-chiltern-480w.webp";
import homeChiltern from "./home-chiltern.webp";
import homeChiltern1040 from "./home-chiltern-1040w.webp";
import homeJuhu480 from "./home-juhu-480w.webp";
import homeJuhu from "./home-juhu.webp";
import homeRitz480 from "./home-ritz-480w.webp";
import homeRitz from "./home-ritz.webp";

import stageDiscover from "./stage-discover.webp";
import stageParikrama from "./stage-parikrama.webp";
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
// A dotted map drawn from Natural Earth's public-domain land outline: vector,
// so it stays sharp at any size.
import partnersWorldMap from "./partners-world-map.svg";

import parikramaPalms960 from "./parikrama/palms-960w.webp";
import parikramaPalms1440 from "./parikrama/palms-1440w.webp";
import parikramaPalms from "./parikrama/palms-1674w.webp";
import parikramaPavilion800 from "./parikrama/pavilion-800w.webp";
import parikramaPavilion from "./parikrama/pavilion-1674w.webp";
import parikramaVeranda560 from "./parikrama/veranda-560w.webp";
import parikramaVeranda from "./parikrama/veranda-789w.webp";
import parikramaGarden640 from "./parikrama/garden-640w.webp";
import parikramaGarden from "./parikrama/garden-1010w.webp";
import parikramaGrove800 from "./parikrama/grove-800w.webp";
import parikramaGrove from "./parikrama/grove-1232w.webp";
import parikramaBedroom800 from "./parikrama/bedroom-800w.webp";
import parikramaBedroom from "./parikrama/bedroom-1336w.webp";
import parikramaSteps560 from "./parikrama/steps-560w.webp";
import parikramaSteps from "./parikrama/steps-886w.webp";
import parikramaDining640 from "./parikrama/dining-640w.webp";
import parikramaDining from "./parikrama/dining-1010w.webp";
import parikramaVerandaOpen640 from "./parikrama/veranda-open-640w.webp";
import parikramaVerandaOpen from "./parikrama/veranda-open-992w.webp";
import parikramaPavilionOpen640 from "./parikrama/pavilion-open-640w.webp";
import parikramaPavilionOpen from "./parikrama/pavilion-open-1136w.webp";
import parikramaBedroomEvening640 from "./parikrama/bedroom-evening-640w.webp";
import parikramaBedroomEvening from "./parikrama/bedroom-evening-1208w.webp";
import sentosaLibrary480 from "./parikrama/sentosa-library-480w.webp";
import sentosaLibrary from "./parikrama/sentosa-library-768w.webp";
import projectRitz from "./project-ritz.webp";

import expStageDiscover from "./expertise/stage-discover.webp";
import expStageDesign from "./expertise/stage-design.svg";
import expStageEngineer from "./expertise/stage-engineer.webp";
import expStageFabricate from "./expertise/stage-fabricate.webp";
import expStageInstall from "./expertise/stage-install.webp";
import expDetailDoor from "./expertise/detail-door.webp";
import secretGardens240 from "./expertise/secret-gardens-240w.webp";
import secretGardens from "./expertise/secret-gardens.webp";
import patinaPool240 from "./expertise/patina-pool-240w.webp";
import patinaPool from "./expertise/patina-pool.webp";
import patinaAerial from "./expertise/patina-aerial.webp";
import ritzVillas from "./expertise/ritz-villas.webp";
import juhuFacade240 from "./expertise/juhu-facade-240w.webp";
import juhuFacade from "./expertise/juhu-facade.webp";
import mandalaHouse from "./expertise/mandala-house.webp";
import mandalaCourt from "./expertise/mandala-court.webp";

import logoAdl from "./partners/adl.webp";
import logoAfw from "./partners/afw.webp";
import logoAgor from "./partners/agor.webp";
import logoBedmar from "./partners/bedmar.webp";
import logoBrombal from "./partners/brombal.webp";
import logoEcoid from "./partners/ecoid.svg";
import logoGlasmarte from "./partners/glasmarte.svg";
import logoMeshtec from "./partners/meshtec.webp";
import logoNomadic from "./partners/nomadic.webp";
import logoPalagina from "./partners/palagina.webp";
import logoRenson from "./partners/renson.svg";
import logoResplendent from "./partners/resplendent.svg";
import logoSom from "./partners/som.webp";

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
  heroFilm: set(
    [
      [heroFilm960, 960],
      [heroFilm1440, 1440],
      [heroFilm1920, 1920],
    ],
    1080,
  ),
  heroParikrama: set(
    [
      [heroParikrama960, 960],
      [heroParikrama1440, 1440],
      [heroParikrama1920, 1920],
    ],
    1287,
  ),
  heroAbout: set(
    [
      [heroAbout960, 960],
      [heroAbout1440, 1440],
      [heroAbout1920, 1920],
    ],
    964,
  ),
  heroPartners: set(
    [
      [heroPartners960, 960],
      [heroPartners1440, 1440],
      [heroPartners1920, 1920],
    ],
    964,
  ),
  heroProjects: set(
    [
      [heroProjects960, 960],
      [heroProjects1440, 1440],
      [heroProjects1920, 1920],
    ],
    955,
  ),
  /* House of Secret Gardens at night. Cut taller than the Careers hero
   * shows at desktop (it is focused low, see routes/careers.tsx) so a phone,
   * where the hero is taller than wide, still has picture to fill it. */
  heroCareers: set(
    [
      [heroCareers960, 960],
      [heroCareers1440, 1440],
      [heroCareers1920, 1920],
    ],
    1140,
  ),
  /** The white wordmark from the design, for the header and footer. */
  logoDurallWhite: one(logoDurallWhite, 1200, 180),
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

  /* The project and article photographs, cut from the thumb-*.webp exports
   * to the photograph alone: the exports carry a drop shadow baked into
   * their edges. */
  cardParikrama: set(
    [
      [cardParikrama480, 480],
      [cardParikrama, 780],
    ],
    780,
  ),
  cardPatina: set(
    [
      [cardPatina480, 480],
      [cardPatina, 780],
    ],
    780,
  ),
  cardChiltron: set(
    [
      [cardChiltron480, 480],
      [cardChiltron, 804],
    ],
    780,
  ),
  cardJuhu: set(
    [
      [cardJuhu480, 480],
      [cardJuhu, 780],
    ],
    780,
  ),
  cardRitz: set(
    [
      [cardRitz480, 480],
      [cardRitz, 792],
    ],
    780,
  ),

  /* The home page's five project cards, from the design's "Selected work"
   * frame, cut square to the framing drawn there. */
  homeParikrama: set(
    [
      [homeParikrama480, 480],
      [homeParikrama, 780],
      [homeParikrama1040, 1040],
    ],
    1040,
  ),
  homePatina: set(
    [
      [homePatina480, 480],
      [homePatina, 780],
      [homePatina1040, 1040],
    ],
    1040,
  ),
  homeChiltern: set(
    [
      [homeChiltern480, 480],
      [homeChiltern, 780],
      [homeChiltern1040, 1040],
    ],
    1040,
  ),
  homeJuhu: set(
    [
      [homeJuhu480, 480],
      [homeJuhu, 780],
    ],
    780,
  ),
  homeRitz: set(
    [
      [homeRitz480, 480],
      [homeRitz, 780],
    ],
    780,
  ),

  stageDiscover: one(stageDiscover, 760, 967),
  stageParikrama: one(stageParikrama, 1100, 882),
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

  /* Parikrama — Murud House, the first project detail page. Brought over from
   * its own Lovable project: the originals were 1px-feathered PNG exports (one
   * with a 183px transparent band across the top), so each was cropped to its
   * opaque area before encoding. */
  parikramaPalms: set(
    [
      [parikramaPalms960, 960],
      [parikramaPalms1440, 1440],
      [parikramaPalms, 1674],
    ],
    942,
  ),
  parikramaPavilion: set(
    [
      [parikramaPavilion800, 800],
      [parikramaPavilion, 1674],
    ],
    1116,
  ),
  parikramaVeranda: set(
    [
      [parikramaVeranda560, 560],
      [parikramaVeranda, 789],
    ],
    986,
  ),
  parikramaGarden: set(
    [
      [parikramaGarden640, 640],
      [parikramaGarden, 1010],
    ],
    1263,
  ),
  parikramaGrove: set(
    [
      [parikramaGrove800, 800],
      [parikramaGrove, 1232],
    ],
    821,
  ),
  parikramaBedroom: set(
    [
      [parikramaBedroom800, 800],
      [parikramaBedroom, 1336],
    ],
    836,
  ),
  parikramaSteps: set(
    [
      [parikramaSteps560, 560],
      [parikramaSteps, 886],
    ],
    886,
  ),
  parikramaDining: set(
    [
      [parikramaDining640, 640],
      [parikramaDining, 1010],
    ],
    1010,
  ),
  parikramaVerandaOpen: set(
    [
      [parikramaVerandaOpen640, 640],
      [parikramaVerandaOpen, 992],
    ],
    1057,
  ),
  parikramaPavilionOpen: set(
    [
      [parikramaPavilionOpen640, 640],
      [parikramaPavilionOpen, 1136],
    ],
    852,
  ),
  parikramaBedroomEvening: set(
    [
      [parikramaBedroomEvening640, 640],
      [parikramaBedroomEvening, 1208],
    ],
    824,
  ),
  /* Cut from inside thumb-ritz's feathered border (the thumbnail is a
   * rounded, faded export); the only photograph of the project on file. */
  projectRitz: one(projectRitz, 794, 782),
  sentosaLibrary: set(
    [
      [sentosaLibrary480, 480],
      [sentosaLibrary, 768],
    ],
    473,
  ),

  /* The Expertise page. The five stages are the design's own crops of
   * larger photographs (the second is a drawing), so each fills its tall
   * frame the way it was composed. */
  expStageDiscover: one(expStageDiscover, 331, 505),
  expStageDesign: one(expStageDesign, 249, 380),
  expStageEngineer: one(expStageEngineer, 589, 898),
  expStageFabricate: one(expStageFabricate, 400, 610),
  expStageInstall: one(expStageInstall, 404, 617),
  /** The glass door at Chiltern House, behind the sill drawing. */
  expDetailDoor: one(expDetailDoor, 465, 516),
  /* "What we're trusted with": the projects' photographs, the small files
   * for the thumbnails in the list. */
  secretGardens: set(
    [
      [secretGardens240, 240],
      [secretGardens, 900],
    ],
    898,
  ),
  patinaPool: set(
    [
      [patinaPool240, 240],
      [patinaPool, 900],
    ],
    675,
  ),
  patinaAerial: one(patinaAerial, 900, 652),
  ritzVillas: one(ritzVillas, 480, 138),
  juhuFacade: set(
    [
      [juhuFacade240, 240],
      [juhuFacade, 900],
    ],
    1045,
  ),
  mandalaHouse: one(mandalaHouse, 480, 329),
  /** The left of the same photograph, as the design crops it for the slideshow. */
  mandalaCourt: one(mandalaCourt, 544, 617),

  /* Partner and practice logos (partners page), each at its own file's
   * dimensions. How tall each is drawn is set per partner in the content. */
  logoGlasmarte: one(logoGlasmarte, 185, 35),
  logoMeshtec: one(logoMeshtec, 352, 77),
  logoAgor: one(logoAgor, 148, 95),
  logoAdl: one(logoAdl, 92, 40),
  logoPalagina: one(logoPalagina, 600, 152),
  logoBrombal: one(logoBrombal, 600, 56),
  logoRenson: one(logoRenson, 172, 30),
  logoBedmar: one(logoBedmar, 499, 39),
  logoAfw: one(logoAfw, 600, 380),
  logoEcoid: one(logoEcoid, 114, 23),
  logoNomadic: one(logoNomadic, 249, 249),
  logoSom: one(logoSom, 600, 208),
  logoResplendent: one(logoResplendent, 701, 193),
} as const satisfies Record<string, ImageAsset>;
