import type { ImageAsset } from "@/assets/images";
import { imageOf } from "@/content/render";
import type { Photo as StoredPhoto, ProjectDoc } from "@/content/types";

/**
 * A project page's content with every image resolved, in the shape the
 * detail components draw. The stored document (content/types.ts, edited in
 * the admin panel) holds image references; `detailOf` resolves them once, in
 * the route, so the components below it stay simple.
 */

export type Photo = {
  image: ImageAsset;
  /** What the photograph shows, for screen readers. */
  alt: string;
};

export type Plate = Photo & {
  /** The longer caption shown under the photograph in the viewer. */
  caption: string;
};

export type ProjectDetail = {
  slug: string;
  /** True while the page is standing in for a case study not yet written. */
  placeholder?: boolean;
  /** The display title, one entry per line. */
  title: readonly string[];
  name: string;
  architect: string;
  location: string;
  description: string;
  /** The figure that rolls in on the hero, odometer-style. */
  figure?: { label: string; value: number; unit?: string };
  hero: Photo;
  /** The photograph used when another page offers this one as "next". */
  card?: Photo;
  facts: ReadonlyArray<readonly [label: string, value: string]>;
  intro: { heading: string; paragraphs: readonly string[] };
  plates: readonly Plate[];
  scope: Photo & {
    heading: string;
    paragraphs: readonly string[];
    facts: ReadonlyArray<readonly [label: string, value: string]>;
  };
  system: Photo & {
    title: readonly string[];
    body: string;
    points: readonly string[];
  };
  experience: Photo & { heading: string; body: string };
};

const resolve = (photo: StoredPhoto): Photo => ({ image: imageOf(photo.image), alt: photo.alt });

const rows = (facts: ProjectDoc["facts"]) => facts.map((fact) => [fact.label, fact.value] as const);

export function detailOf(doc: ProjectDoc): ProjectDetail {
  return {
    slug: doc.slug,
    placeholder: doc.placeholder,
    title: doc.title,
    name: doc.name,
    architect: doc.architect,
    location: doc.location,
    description: doc.description,
    ...(doc.figure
      ? {
          figure: {
            label: doc.figure.label,
            value: doc.figure.value,
            ...(doc.figure.unit ? { unit: doc.figure.unit } : {}),
          },
        }
      : {}),
    hero: resolve(doc.hero),
    ...(doc.card ? { card: resolve(doc.card) } : {}),
    facts: rows(doc.facts),
    intro: doc.intro,
    plates: doc.plates.map((plate) => ({ ...resolve(plate), caption: plate.caption })),
    scope: {
      ...resolve(doc.scope),
      heading: doc.scope.heading,
      paragraphs: doc.scope.paragraphs,
      facts: rows(doc.scope.facts),
    },
    system: {
      ...resolve(doc.system),
      title: doc.system.title,
      body: doc.system.body,
      points: doc.system.points,
    },
    experience: {
      ...resolve(doc.experience),
      heading: doc.experience.heading,
      body: doc.experience.body,
    },
  };
}
