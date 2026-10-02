import { useEffect, useRef, useState } from "react";
import { useHeroIntro } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/motion-prefs";
import { destination, imageOf } from "@/content/render";
import type { HomePage } from "@/content/types";
import { CtaButton } from "./ui";

/**
 * The opening film: muted, looping, no controls, filling the frame exactly as
 * the still under it does.
 *
 * The still is the film's own first frame, so the film starting is not a
 * change of picture: it simply begins to move. The file runs forwards and
 * then backwards (eased at both ends, like a door opened and closed), so it
 * also ends on that frame and the loop has no jump in it.
 *
 * It is not set as the `poster` attribute as well: that takes one address,
 * so a phone would fetch the full-size still on top of the one sized for it.
 * And the film's files are only asked for once the page itself has loaded:
 * named in the markup they are fetched alongside the still, and on a slow
 * phone that held the first picture back by seconds. The opening curtain is
 * still up at that point, so nobody sees the difference.
 *
 * It always starts by itself and never shows a play button: if the browser
 * refuses or pauses it (a phone saving power does both), it is started again
 * the moment that is allowed, and the browser's own button is hidden in
 * styles.css. Someone who has asked for less motion keeps the still.
 */
function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [wanted, setWanted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const want = () => setWanted(true);
    if (document.readyState === "complete") want();
    else window.addEventListener("load", want, { once: true });
    return () => window.removeEventListener("load", want);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !wanted) return;
    // Set here as well as in the markup: React does not write `muted` into
    // server HTML, and a film that is not muted is not allowed to autoplay.
    video.muted = true;
    video.defaultMuted = true;

    // The opening is held behind the page for its whole length (it is
    // sticky), so the film rests while the page is over it.
    const covered = () => window.scrollY > window.innerHeight;
    const play = () => {
      if (covered() || document.hidden || !video.paused) return;
      void video.play().catch((error: unknown) => {
        // Refused outright: a browser saving power refuses every film until
        // the page has been touched. Show the still rather than a stopped
        // film with the browser's play button on it; the first touch or
        // click starts it (see `again` below).
        if (error instanceof DOMException && error.name === "NotAllowedError") setPlaying(false);
      });
    };
    // The sources have just been added: have the element pick them up.
    video.load();
    play();

    const show = () => setPlaying(true);
    const onScroll = () => {
      if (covered()) video.pause();
      else play();
    };
    // Every moment a refused or interrupted film may be allowed to run:
    // it can play, the tab or page comes back, or the visitor touches the
    // page (which is what a phone saving power waits for).
    const again = ["pointerup", "touchend", "click", "keydown"] as const;
    /* A watch on the film while it should be running. If it is found
     * paused it is started again, and the still is shown meanwhile; if it
     * is running but has not advanced since the last two looks (a stall),
     * it is loaded afresh. */
    let seen = -1;
    let stalled = 0;
    const watch = window.setInterval(() => {
      if (covered() || document.hidden) return;
      if (video.paused) {
        setPlaying(false);
        play();
        return;
      }
      stalled = video.currentTime === seen ? stalled + 1 : 0;
      seen = video.currentTime;
      if (stalled >= 2) {
        stalled = 0;
        video.load();
        play();
      }
    }, 1500);
    video.addEventListener("playing", show);
    video.addEventListener("canplay", play);
    video.addEventListener("pause", play);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", play);
    document.addEventListener("visibilitychange", play);
    again.forEach((type) => window.addEventListener(type, play, { passive: true }));
    return () => {
      window.clearInterval(watch);
      video.removeEventListener("playing", show);
      video.removeEventListener("canplay", play);
      video.removeEventListener("pause", play);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", play);
      document.removeEventListener("visibilitychange", play);
      again.forEach((type) => window.removeEventListener(type, play));
    };
  }, [wanted]);

  return (
    <video
      ref={ref}
      data-hero-film
      muted
      loop
      playsInline
      autoPlay={wanted}
      preload={wanted ? "auto" : "none"}
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noremoteplayback"
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[var(--dur-short)] ease-linear ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    >
      {wanted ? (
        <>
          {/* H.264 only: every browser plays it and decodes it in
              hardware. A WebM alternative was a sixth smaller, but Safari
              takes it when offered and can stall on it. Phones get the
              lighter file. */}
          <source src="/video/hero-720.mp4" type="video/mp4" media="(max-width: 48rem)" />
          <source src="/video/hero-1080.mp4" type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}

export function Hero({ content }: { content: HomePage["hero"] }) {
  const { sectionRef, headingRef, imageRef } = useHeroIntro<
    HTMLElement,
    HTMLHeadingElement,
    HTMLDivElement
  >();
  const image = imageOf(content.photo.image);

  return (
    <section
      ref={sectionRef}
      id="top"
      data-hero-pin
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy pb-[max(clamp(3rem,7vw,4rem),env(safe-area-inset-bottom))]"
    >
      <div data-hero-media className="absolute inset-0">
        {/* The intro settles this wrapper, so photograph and film move as one. */}
        <div ref={imageRef} className="absolute inset-0">
          <img
            draggable={false}
            {...image}
            alt={content.photo.alt}
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <HeroFilm />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/0 to-navy/70" />
      {/* Deepens as the page slides over the opening (lib/anim heroCover). */}
      <div
        data-hero-dim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-navy opacity-0"
      />

      <div className="shell relative pt-[clamp(8rem,15vw,10rem)] lg:pt-[6rem]">
        <h1
          ref={headingRef}
          data-anim-hide
          className="max-w-[20ch] font-display text-[clamp(2.25rem,6.7vw,8rem)] leading-[0.94] font-medium tracking-hero text-balance text-white"
        >
          {content.heading}
        </h1>

        <div className="mt-[clamp(1.5rem,3vw,2rem)] grid grid-cols-1 items-end gap-[clamp(1.5rem,3vw,2rem)] border-t border-white/15 pt-[clamp(1.5rem,3vw,2rem)] md:grid-cols-[minmax(0,1fr)_auto]">
          <p
            data-hero-fade
            className="min-w-0 max-w-[24.5rem] flex-1 font-body text-[clamp(0.875rem,1.1vw,1rem)] leading-relaxed text-pretty text-white/72"
          >
            {content.body}
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3.5">
            <CtaButton {...destination(content.primary.href)} variant="inverted">
              {content.primary.label}
            </CtaButton>
            <CtaButton {...destination(content.secondary.href)} variant="outlineLight">
              {content.secondary.label}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
