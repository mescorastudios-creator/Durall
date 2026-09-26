import { Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { IMAGES, type ImageAsset } from "@/assets/images";
import type { ImageRef, Photo, TwoTone } from "./types";

/* Renderers for the text conventions in ./types.ts. Each one produces the
 * same markup the components carried when the copy was written into them,
 * so moving the words out changed nothing on the page. */

const MISSING: ImageAsset = {
  src: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
  width: 1,
  height: 1,
};

export type ImageKey = keyof typeof IMAGES;

export function isImageKey(key: string): key is ImageKey {
  return Object.prototype.hasOwnProperty.call(IMAGES, key);
}

/** The `<img>` attributes for an image reference: spread it and add alt/sizes. */
export function imageOf(ref: ImageRef | null | undefined): ImageAsset {
  if (!ref) return MISSING;
  if (ref.kind === "asset") return isImageKey(ref.key) ? IMAGES[ref.key] : MISSING;
  return {
    src: ref.src,
    width: ref.width,
    height: ref.height,
    ...(ref.srcSet ? { srcSet: ref.srcSet } : {}),
  };
}

export const asset = (key: ImageKey): ImageRef => ({ kind: "asset", key });

export const photo = (key: ImageKey, alt: string): Photo => ({ image: asset(key), alt });

/** A heading or paragraph whose newlines are forced line breaks. */
export function Lines({ text }: { text: string }): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

/** A heading whose second clause is muted: "Luxury is never applied. [It is engineered.]" */
export function TwoToneText({
  value,
  mutedClassName = "text-slate",
}: {
  value: TwoTone;
  mutedClassName?: string;
}): ReactNode {
  if (!value.muted) return value.text;
  return (
    <>
      {`${value.text} `}
      <span className={mutedClassName}>{value.muted}</span>
    </>
  );
}

/**
 * A stored link as props for CtaButton / UnderlineLink / ViewMore and friends:
 * a router destination for site paths, a plain href for everything else.
 */
export function linkTo(href: string): { to: string; hash?: string } | { href: string } {
  if (href.startsWith("/") && !href.startsWith("//")) {
    const [to = "/", hash] = href.split("#");
    return hash ? { to, hash } : { to };
  }
  // Links are typed into the admin panel: anything that is not a page, a
  // section, mail, phone or web address (javascript:, data:…) goes nowhere.
  return { href: /^(#|https?:\/\/|mailto:|tel:)/i.test(href) ? href : "#" };
}

/** Same as linkTo, with every key present, for components typed with `| undefined`. */
export function destination(href: string): {
  to: string | undefined;
  hash: string | undefined;
  href: string | undefined;
} {
  const target = linkTo(href);
  return "to" in target
    ? { to: target.to, hash: target.hash, href: undefined }
    : { to: undefined, hash: undefined, href: target.href };
}

/* Inline formatting inside article paragraphs, deliberately small:
 * **bold**, *italic* and [a link](https://…). Written by the editor as plain
 * text, rendered as elements — never as HTML, so nothing typed into the
 * admin panel can inject markup into the page. */
const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;
const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

const INLINE_LINK =
  "text-navy underline decoration-navy-14 underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-navy";

export function RichText({ text }: { text: string }): ReactNode {
  const parts = text.split(INLINE);
  return parts.map((part, index) => {
    if (index % 2 === 0) return part;
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    const match = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    const [, label = part, url = ""] = match ?? [];
    if (!SAFE_URL.test(url)) return label;
    if (url.startsWith("/")) {
      return (
        <Link key={index} {...(linkTo(url) as { to: string })} className={INLINE_LINK}>
          {label}
        </Link>
      );
    }
    const external = /^https?:/i.test(url);
    return (
      <a
        key={index}
        href={url}
        className={INLINE_LINK}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>
    );
  });
}
