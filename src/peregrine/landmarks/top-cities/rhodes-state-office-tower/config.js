import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "rhodes-state-office-tower",
  name: "Rhodes State Office Tower",
  kind: "building",
  ready: true,
  origin: [
    -82.99944685,
    39.962785
  ],
  height: 201.72,
  padM: 44,
  frontageBearing: 351.5207452490131,
  rotation: 0.14799091352009375
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-82.9997218,39.9625076],[-82.9998195,39.9630099]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#a88f7b",
    "joint": "#9b8270",
    "glass": "#43575b",
    "metal": "#515b5c",
    "roof": "#64665f"
  },
  "dark": {
    "stone": "#737b7b",
    "joint": "#667477",
    "glass": "#294958",
    "metal": "#53666c",
    "roof": "#344957"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "James A. Rhodes State Office Tower: broad granite cores, deeply recessed horizontal glazing, stepped open mechanical crown and opposite higher corner shafts with rooftop communications cage. The broad window zone occupies 36% of each east/west face, recessed behind continuous granite shafts. The mapped 58 × 57 m podium encloses a narrower 45 × 48 m tower. Ohio DAS publishes 629 ft (191.72 m); CTBUH gives 190.2 m, so the main core height is an adopted published estimate. Antenna tip 201.72 m is estimated from the contractor exterior photo and excluded from the published architectural height. Current renovation preserved the granite/window composition; no logos or inscriptions. Cityscape: not tested. Full 3D world: not tested."
};
