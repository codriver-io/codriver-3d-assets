import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "ohio-stadium",
  name: "Ohio Stadium",
  kind: "building",
  ready: true,
  origin: [
    -83.01974,
    40.00165
  ],
  height: 41.4528,
  padM: 158,
  frontageBearing: 5.782157928302183,
  rotation: -0.1009176937191672
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-83.019944,40.000416],[-83.01962,40.002867]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#aaa79c",
    "seat": "#817c75",
    "red": "#955e59",
    "glass": "#5d7278",
    "steel": "#a2aaa7",
    "field": "#526c4c",
    "roof": "#707d7e"
  },
  "dark": {
    "stone": "#79878a",
    "seat": "#606e78",
    "red": "#725b68",
    "glass": "#365365",
    "steel": "#748a92",
    "field": "#34524b",
    "roof": "#4a6371"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current Ohio Stadium: open horseshoe concrete bowl and arcade, distinct south bleachers separated by two end gaps, north rotunda and twin towers, enclosed two-storey west press box with a broad overhanging roof above the 34 m bowl rim, and sloping seating terraces. Mapped stadium perimeter, not a solid building footprint, supplies the envelope. Official stadium height 136 ft (41.4528 m), rotunda 85 ft high / 70 ft diameter; tier heights and 1922 arcade rhythms are photo-based approximations. Field is unlettered and free of logos; no crowd or event structures. Cityscape: not tested. Full 3D world: not tested."
};
