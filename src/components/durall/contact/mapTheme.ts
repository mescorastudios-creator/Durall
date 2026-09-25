import type { LayerSpecification, StyleSpecification } from "maplibre-gl";

/**
 * The office map's look.
 *
 * The base is OpenFreeMap's Positron — free OpenStreetMap vector tiles, no
 * key, no usage limits for a site like this — restyled into the site's own
 * palette: paper land, a blue-grey sea drawn from `accent-blue`, white roads
 * on pale casings and navy place names. Past zoom 14 the buildings stand up
 * in pale 3D so the tilted close-up reads as a place, and a soft ring on the
 * ground marks the office under its pin.
 */
export const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

const INK = {
  land: "#f3f4f3",
  residential: "#eceeed",
  park: "#e1e8de",
  wood: "#dbe3d8",
  water: "#cdd8e6",
  waterway: "#c0cde0",
  building: "#e4e6ea",
  buildingEdge: "#d6d9df",
  extrusion: "#e7e9ee",
  casing: "#dbdfe6",
  road: "#ffffff",
  minor: "#fbfbfb",
  rail: "#d2d6dd",
  boundary: "#b7bdc7",
  waterLabel: "#5f76a0",
  roadLabel: "#7a8591",
  place: "#050834",
  placeMinor: "#5c6972",
  halo: "#f3f4f3",
  accent: "#1e539c",
};

/** Paint overrides, keyed by the Positron layer they apply to. */
const PAINT: Record<string, Record<string, unknown>> = {
  background: { "background-color": INK.land },
  park: { "fill-color": INK.park },
  water: { "fill-color": INK.water },
  landuse_residential: { "fill-color": INK.residential },
  landcover_wood: { "fill-color": INK.wood },
  waterway: { "line-color": INK.waterway },
  building: { "fill-color": INK.building, "fill-outline-color": INK.buildingEdge },
  tunnel_motorway_casing: { "line-color": INK.casing },
  tunnel_motorway_inner: { "line-color": INK.minor },
  highway_path: { "line-color": INK.minor },
  highway_minor: { "line-color": INK.road },
  highway_major_casing: { "line-color": INK.casing },
  highway_major_inner: { "line-color": INK.road },
  highway_major_subtle: { "line-color": INK.casing },
  highway_motorway_casing: { "line-color": INK.casing },
  highway_motorway_inner: { "line-color": INK.road },
  highway_motorway_subtle: { "line-color": INK.casing },
  highway_motorway_bridge_casing: { "line-color": INK.casing },
  highway_motorway_bridge_inner: { "line-color": INK.road },
  railway_transit: { "line-color": INK.rail },
  railway_service: { "line-color": INK.rail },
  railway: { "line-color": INK.rail },
  boundary_3: { "line-color": INK.boundary },
  boundary_2: { "line-color": INK.boundary },
  boundary_disputed: { "line-color": INK.boundary },
  waterway_line_label: { "text-color": INK.waterLabel, "text-halo-color": INK.halo },
  water_name_point_label: { "text-color": INK.waterLabel, "text-halo-color": INK.halo },
  water_name_line_label: { "text-color": INK.waterLabel, "text-halo-color": INK.halo },
  "highway-name-path": { "text-color": INK.roadLabel, "text-halo-color": INK.halo },
  "highway-name-minor": { "text-color": INK.roadLabel, "text-halo-color": INK.halo },
  "highway-name-major": { "text-color": INK.roadLabel, "text-halo-color": INK.halo },
  airport: { "text-color": INK.placeMinor, "text-halo-color": INK.halo },
  label_other: { "text-color": INK.placeMinor, "text-halo-color": INK.halo },
  label_village: { "text-color": INK.place, "text-halo-color": INK.halo },
  label_town: { "text-color": INK.place, "text-halo-color": INK.halo },
  label_state: { "text-color": INK.placeMinor, "text-halo-color": INK.halo },
  label_city: { "text-color": INK.place, "text-halo-color": INK.halo },
  label_city_capital: { "text-color": INK.place, "text-halo-color": INK.halo },
};

/** US road shields have nothing to show in Mumbai. */
const DROP = new Set(["highway-shield-us-interstate", "road_shield_us"]);

export function durallMapStyle(
  base: StyleSpecification,
  office: [number, number],
): StyleSpecification {
  const layers: LayerSpecification[] = [];

  for (const layer of base.layers) {
    if (DROP.has(layer.id)) continue;
    const paint = PAINT[layer.id];
    layers.push(
      paint && "paint" in layer
        ? ({ ...layer, paint: { ...(layer.paint ?? {}), ...paint } } as LayerSpecification)
        : layer,
    );
  }

  // Everything added sits under the first label, so names stay readable.
  const firstLabel = layers.findIndex((layer) => layer.type === "symbol");
  const added: LayerSpecification[] = [
    {
      id: "office-halo",
      type: "circle",
      source: "office",
      paint: {
        "circle-pitch-alignment": "map",
        "circle-radius": ["interpolate", ["exponential", 2], ["zoom"], 11, 6, 16, 70, 18, 280],
        "circle-color": INK.accent,
        "circle-opacity": 0.09,
        "circle-stroke-color": INK.accent,
        "circle-stroke-opacity": 0.35,
        "circle-stroke-width": 1,
      },
    },
    {
      id: "building-3d",
      type: "fill-extrusion",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": INK.extrusion,
        // Buildings rise out of the ground as the camera comes in, rather
        // than popping up at a zoom level.
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          15.4,
          ["coalesce", ["get", "render_height"], 8],
        ],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.88,
      },
    },
  ];
  layers.splice(firstLabel < 0 ? layers.length : firstLabel, 0, ...added);

  return {
    ...base,
    // Softer than the default light, so the sides of the 3D buildings shade
    // to a pale grey instead of a heavy one.
    light: { anchor: "viewport", color: "#ffffff", intensity: 0.22, position: [1.2, 200, 35] },
    sources: {
      ...base.sources,
      office: {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: office } },
      },
    },
    layers,
  };
}
