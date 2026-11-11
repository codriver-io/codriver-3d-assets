import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "ellicott-city-station",
  name: "Ellicott City Station",
  kind: "building",
  ready: true,
  origin: [
    -76.7949525,
    39.267535
  ],
  height: 12.4,
  padM: 22,
  frontageBearing: 359.17085306659925,
  rotation: 0.014471343970657068
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-76.7950086,39.2676608],[-76.7949015,39.267662]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#939793",
    "trim": "#c3bfad",
    "roof": "#4d5355",
    "glass": "#435863",
    "wood": "#877a5e",
    "bracket": "#685e4b"
  },
  "dark": {
    "stone": "#626f73",
    "trim": "#88938e",
    "roof": "#303e47",
    "glass": "#304956",
    "wood": "#5b5b50",
    "bracket": "#485452"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current Ellicott City station museum: two-storey grey granite body, long gable, wooden roof ventilator, separate sash bays and upper trackside platform/cantilever brackets. Only the main station is owned; freight house, caboose, viaduct and track are excluded. Heritage description gives approximately 90 × 25 ft (27.4 × 7.6 m) for the masonry; mapped roof/canopy envelope is about 28.2 × 9.5 m. Overall 12.4 m, floor splits and cupola dimensions are photo estimates. Sources use 1830 or 1831 for completion; the restored current exterior is modeled. Local y=0 is the lower Maryland Avenue foundation, with the upper platform at a relative 3.6 m; no terrain is baked. Cityscape: not tested. Full 3D world: not tested."
};
