import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "collegiate-saint-gertrude-nivelles",
  name: "Collegiate Church of Saint Gertrude",
  kind: "building",
  ready: true,
  origin: [
    4.32372,
    50.59747
  ],
  height: 50,
  padM: 62,
  frontageBearing: 249.0880880397321,
  rotation: 1.935778043388753
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[4.3234324,50.5975192],[4.3238616,50.5976233]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#ada99b",
    "trim": "#c4beac",
    "roof": "#505861",
    "glass": "#3e4c52",
    "brick": "#8d6054",
    "gold": "#ac9a60"
  },
  "dark": {
    "stone": "#717c80",
    "trim": "#8a9798",
    "roof": "#303f4b",
    "glass": "#2c424d",
    "brick": "#644f4b",
    "gold": "#958750"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current restored Romanesque Sainte-Gertrude, after the 1984 westwork reconstruction and 2024 exterior work: broad arcaded westwork, projecting western apse, octagonal belfry with pyramidal slate cap, paired round stair turrets, long double-choir nave and tall eastern transept gables. Regional tourism publishes 102 m and 50 m; a local 2023 report says 60 m. Adopted overall 50 m is an estimate within conflicting published heights, not a survey. Mapped envelope approximately 102 × 47 m includes transept chapels and buttresses; published main transept width is 44 m. Cloister and town hall are excluded. Geographic yaw baked once. Cityscape: not tested. Full 3D world: not tested."
};
