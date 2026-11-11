import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "eglise-saint-lambert",
  name: "Église Saint-Lambert",
  kind: "building",
  ready: true,
  origin: [
    -73.513704,
    45.500037
  ],
  height: 35.8,
  padM: 29,
  frontageBearing: 359.0884234182159,
  rotation: 0.015910012736208234
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-73.5138321,45.5002258],[-73.5136438,45.5002279]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#96968d",
    "trim": "#b7b8ac",
    "roof": "#464d50",
    "copper": "#4e7162",
    "glass": "#434e51",
    "door": "#654a42"
  },
  "dark": {
    "stone": "#686f70",
    "trim": "#808985",
    "roof": "#2e3a42",
    "copper": "#36534e",
    "glass": "#34434a",
    "door": "#443c3a"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Gaston Gagnier’s present 1936–1938 stone church on avenue Lorne: steep front gable with cruciform window, offset octagonal green steeple, long roof and lower transepts. Mapped envelope about 21.5 × 42.5 m; overall 35.8 m, roof and tower stage heights are photographic estimates, not a survey. Presbytery and adjacent school are outside ownership. Geographic yaw is baked once. Cityscape: not tested. Full 3D world: not tested."
};
