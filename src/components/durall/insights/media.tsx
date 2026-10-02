import { useState } from "react";
import { Play } from "lucide-react";
import { hasImage, imageOf } from "@/content/render";
import type { Photo } from "@/content/types";
import { embedOf } from "@/content/video";

/**
 * The white disc with a play mark: the one thing on a film's picture that
 * says it plays. Decorative inside a labelled button or link.
 */
export function PlayMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const box = {
    sm: "h-10 w-10",
    md: "h-[clamp(3rem,4.4vw,3.75rem)] w-[clamp(3rem,4.4vw,3.75rem)]",
    lg: "h-[clamp(3.75rem,6.5vw,5.75rem)] w-[clamp(3.75rem,6.5vw,5.75rem)]",
  }[size];
  return (
    <span
      aria-hidden="true"
      // The ring on keyboard focus sits on the disc, which is white on every
      // poster, so it shows whatever the photograph behind it.
      className={`${box} flex items-center justify-center rounded-full bg-white text-navy shadow-[0_12px_32px_-12px_rgb(5_8_52/0.55)] transition-[scale] duration-[var(--dur-short)] ease-[var(--ease-micro)] group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-accent-blue group-focus-visible:ring-offset-2 motion-reduce:transition-none`}
    >
      <Play className="ml-[8%] h-[34%] w-[34%] fill-current" strokeWidth={1.5} />
    </span>
  );
}

/**
 * A card's photograph, or a quiet plate with the Durall mark when the
 * article has none yet (a new draft, a film without a poster), so a card
 * never shows a hole.
 */
export function CardImage({
  photo,
  sizes,
  className = "",
  eager = false,
  film = false,
}: {
  photo: Photo | null | undefined;
  sizes: string;
  className?: string;
  eager?: boolean;
  film?: boolean;
}) {
  const present = photo ? hasImage(photo.image) : false;
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      {present && photo ? (
        // The wrapper drifts against the scroll (ScrollFx); the picture
        // inside keeps its own hover zoom.
        <div data-fx="parallax" data-fx-by="5" className="h-full w-full">
          <img
            draggable={false}
            {...imageOf(photo.image)}
            alt={photo.alt}
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            {...(eager ? { fetchPriority: "high" as const } : {})}
            decoding="async"
            className="media-zoom h-full w-full object-cover"
          />
        </div>
      ) : (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <img
            draggable={false}
            src="/favicon.svg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 opacity-80"
          />
        </span>
      )}
      {film ? (
        <span className="pointer-events-none absolute bottom-[clamp(0.75rem,1.4vw,1.25rem)] left-[clamp(0.75rem,1.4vw,1.25rem)]">
          <PlayMark size="sm" />
        </span>
      ) : null}
    </div>
  );
}

/**
 * A film: its poster with a play button until pressed, then the provider's
 * player in its place. Nothing loads from YouTube or Vimeo before the press,
 * and an address that is neither shows the poster alone.
 */
export function VideoPlayer({
  url,
  title,
  poster,
  playLabel,
  sizes = "100vw",
  autoPlay = false,
  eager = false,
  className = "",
}: {
  url: string;
  title: string;
  poster?: Photo | null | undefined;
  playLabel: string;
  sizes?: string;
  /** Start straight away: for a film chosen from a list, which is already a press. */
  autoPlay?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const embed = embedOf(url);
  const [playing, setPlaying] = useState(autoPlay);
  const image = poster && hasImage(poster.image) ? poster : null;

  const picture = image ? (
    <img
      draggable={false}
      {...imageOf(image.image)}
      alt={embed ? "" : image.alt}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      {...(eager ? { fetchPriority: "high" as const } : {})}
      decoding="async"
      className="media-zoom absolute inset-0 h-full w-full object-cover"
    />
  ) : null;

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-navy ${className}`}>
      {embed && playing ? (
        <iframe
          src={embed.src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : embed ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          {picture}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgb(5_8_52/0.45),rgb(5_8_52/0.05)_55%)]"
          />
          <span className="relative">
            <PlayMark size="lg" />
          </span>
          <span className="sr-only">
            {playLabel}: {title}
          </span>
        </button>
      ) : (
        picture
      )}
    </div>
  );
}
