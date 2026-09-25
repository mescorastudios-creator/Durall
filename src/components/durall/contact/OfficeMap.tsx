import { useEffect, useRef, useState } from "react";
import type { Map as MapInstance } from "maplibre-gl";
import { ArrowUpRight, LocateFixed, Minus, Plus } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion-prefs";
import { OFFICE } from "./data";

/** Mumbai at a glance: where the camera starts before it flies in. */
const WIDE = { zoom: 11.2, pitch: 0, bearing: 0 };
/** Tilted close-up over Vakola, buildings standing, pin centred. */
const CLOSE = { zoom: 16.3, pitch: 54, bearing: -20 };

/** Slow out of the wide view, slow into the close-up. */
const cinematic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const PIN = `
  <span class="office-pin__inner">
    <span class="office-pin__chip">
      <span class="office-pin__mark">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4h7a8 8 0 0 1 0 16H4V4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M14 12h7" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      </span>
      Durall Systems
    </span>
    <span class="office-pin__stem"></span>
    <span class="office-pin__dot"><span class="office-pin__pulse"></span></span>
  </span>`;

/**
 * The head office on a live map.
 *
 * Nothing loads until the frame is within a screen of view: MapLibre and its
 * stylesheet are fetched then, not with the page. Until the map is ready —
 * and if the tiles can never be fetched — the frame shows a quiet drafting
 * grid with the address card over it, so the address and directions are
 * always there whether or not the map is.
 *
 * Once loaded and properly in view, the camera flies from a wide view of
 * Mumbai down to a tilted close-up over the office, the buildings rising as
 * it arrives, and the pin drops in when it lands. Under reduced motion the
 * map simply opens on the close-up.
 *
 * The map never takes the page's scroll: a plain wheel scrolls the page and
 * the map says to hold ⌘/Ctrl to zoom it, and on touch one finger scrolls
 * the page while two move the map.
 */
export function OfficeMap() {
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const host = hostRef.current;
    if (!frame || !host) return;
    let cancelled = false;
    let map: MapInstance | undefined;
    let flyObserver: IntersectionObserver | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const reduced = prefersReducedMotion();

    /* The address card covers the top of the frame, so the camera is padded
     * to centre the pin in the part of the map left showing: by the card's
     * full height where it spans the frame (phones), by about half of it
     * where it sits in the corner. */
    const padCamera = () => {
      const card = cardRef.current;
      if (!map || !card) return;
      const spans = card.offsetWidth > frame.clientWidth * 0.6;
      map.setPadding({ top: card.offsetHeight * (spans ? 1 : 0.5), right: 0, bottom: 0, left: 0 });
    };

    // A zoom gesture over the map belongs to the map. Lenis listens on the
    // window, so stopping the event here keeps ⌘-scroll from also scrolling
    // the page; a plain wheel is left alone and scrolls the page as usual.
    const keepZoomOnMap = (event: WheelEvent) => {
      if (event.metaKey || event.ctrlKey) event.stopPropagation();
    };
    frame.addEventListener("wheel", keepZoomOnMap, { passive: true });

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        loadObserver.disconnect();
        void (async () => {
          const [{ default: maplibregl }, { durallMapStyle, STYLE_URL }] = await Promise.all([
            import("maplibre-gl"),
            import("./mapTheme"),
            import("maplibre-gl/dist/maplibre-gl.css"),
          ]);
          if (cancelled) return;

          let style;
          try {
            const response = await fetch(STYLE_URL);
            if (!response.ok) return;
            style = durallMapStyle(await response.json(), OFFICE.lngLat);
          } catch {
            // Offline or blocked: the grid and the address card stay.
            return;
          }
          if (cancelled) return;

          map = new maplibregl.Map({
            container: host,
            style,
            center: OFFICE.lngLat,
            ...(reduced ? CLOSE : WIDE),
            attributionControl: false,
            cooperativeGestures: true,
            dragRotate: false,
            pitchWithRotate: false,
            touchPitch: false,
            maxPitch: 60,
            minZoom: 9,
            maxZoom: 19,
            fadeDuration: reduced ? 0 : 300,
          });
          mapRef.current = map;
          padCamera();
          resizeObserver = new ResizeObserver(padCamera);
          resizeObserver.observe(frame);
          map.touchZoomRotate.disableRotation();
          map.keyboard.disableRotation();
          map.addControl(new maplibregl.AttributionControl(), "bottom-left");
          map
            .getCanvas()
            .setAttribute("aria-label", `Map of ${OFFICE.name}, ${OFFICE.lines.join(", ")}`);

          const pin = document.createElement("div");
          pin.className = "office-pin";
          pin.innerHTML = PIN;
          new maplibregl.Marker({ element: pin, anchor: "bottom" })
            .setLngLat(OFFICE.lngLat)
            .addTo(map);
          const land = () => pin.setAttribute("data-landed", "true");

          map.once("load", () => {
            if (cancelled || !map) return;
            setReady(true);
            // On a narrow map the full credit line would run into the zoom
            // controls, so it starts folded behind its ⓘ; tapping opens it.
            if (frame.clientWidth < 640) {
              const credit = frame.querySelector(".maplibregl-ctrl-attrib");
              credit?.classList.remove("maplibregl-compact-show");
              credit?.removeAttribute("open");
            }
            if (reduced) {
              land();
              return;
            }
            const loaded = map;
            flyObserver = new IntersectionObserver(
              ([seen]) => {
                if (!seen?.isIntersecting) return;
                flyObserver?.disconnect();
                loaded.flyTo({
                  ...CLOSE,
                  center: OFFICE.lngLat,
                  duration: 4200,
                  curve: 1.3,
                  easing: cinematic,
                  essential: true,
                });
                loaded.once("moveend", land);
              },
              { threshold: 0.45 },
            );
            flyObserver.observe(frame);
          });
        })();
      },
      { rootMargin: "100% 0px" },
    );
    loadObserver.observe(frame);

    return () => {
      cancelled = true;
      loadObserver.disconnect();
      flyObserver?.disconnect();
      resizeObserver?.disconnect();
      frame.removeEventListener("wheel", keepZoomOnMap);
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  const duration = () => (prefersReducedMotion() ? 0 : 600);
  const zoomBy = (delta: number) =>
    mapRef.current?.zoomTo(mapRef.current.getZoom() + delta, { duration: duration() });
  const recenter = () =>
    mapRef.current?.flyTo({
      ...CLOSE,
      center: OFFICE.lngLat,
      duration: prefersReducedMotion() ? 0 : 1800,
      essential: true,
    });

  const control =
    "grid h-11 w-11 place-items-center text-navy transition-colors duration-[var(--dur-short)] hover:bg-mist focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-blue";

  return (
    <div
      ref={frameRef}
      data-office-map
      role="region"
      aria-label={`Map — ${OFFICE.name}`}
      className="map-grid relative isolate h-[clamp(28rem,calc(100svh-var(--header-h)-3rem),44rem)] overflow-hidden rounded-[1.25rem] bg-glass lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"
    >
      {/* The map is mounted into the inner element and sized by the outer
       * one: MapLibre's stylesheet sets its container to `position:
       * relative`, which would override `absolute inset-0` on the same
       * element and leave the map at its 300px fallback height. */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      >
        <div ref={hostRef} className="h-full w-full" />
      </div>

      <div
        ref={cardRef}
        className="absolute inset-x-3 top-3 z-10 rounded-2xl bg-white/95 p-[clamp(1.1rem,1.6vw,1.5rem)] shadow-[0_12px_36px_rgb(5_8_52/0.14)] backdrop-blur-md sm:inset-x-auto sm:top-5 sm:left-5 sm:max-w-[23rem]"
      >
        <p className="font-display text-[0.6875rem] font-bold tracking-[0.16em] text-accent-blue uppercase">
          Head office
        </p>
        <p className="mt-2 font-display text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-snug font-medium tracking-tight text-navy">
          {OFFICE.name}
        </p>
        <address className="mt-2 font-body text-sm leading-relaxed text-slate not-italic">
          {OFFICE.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <p className="mt-2 font-body text-xs text-slate">
          <span className="tabular-nums">{OFFICE.plusCode}</span> · {OFFICE.note}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={OFFICE.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-4 font-display text-[0.6875rem] font-bold tracking-[0.12em] text-white uppercase transition-colors duration-[var(--dur-short)] hover:bg-accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          >
            Get directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
            <ArrowUpRight
              aria-hidden="true"
              className="hover-arrow h-3.5 w-3.5"
              strokeWidth={1.8}
            />
          </a>
          <a
            href={OFFICE.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-navy-14 px-4 font-display text-[0.6875rem] font-bold tracking-[0.12em] text-navy uppercase transition-colors duration-[var(--dur-short)] hover:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          >
            Open in Maps
            <span className="sr-only"> (Google Maps, new tab)</span>
            <ArrowUpRight
              aria-hidden="true"
              className="hover-arrow h-3.5 w-3.5"
              strokeWidth={1.8}
            />
          </a>
        </div>
      </div>

      {/* After the card in the DOM, so keyboard order follows the frame
       * top to bottom: address and directions first, then the controls. */}
      {ready ? (
        <div className="absolute right-4 bottom-4 z-10 flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgb(5_8_52/0.12)]">
          <button type="button" onClick={() => zoomBy(1)} aria-label="Zoom in" className={control}>
            <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <span aria-hidden="true" className="mx-2.5 h-px bg-navy-14" />
          <button
            type="button"
            onClick={() => zoomBy(-1)}
            aria-label="Zoom out"
            className={control}
          >
            <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <span aria-hidden="true" className="mx-2.5 h-px bg-navy-14" />
          <button
            type="button"
            onClick={recenter}
            aria-label="Back to the office"
            className={control}
          >
            <LocateFixed aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
