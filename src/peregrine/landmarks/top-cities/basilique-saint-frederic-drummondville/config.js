import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "basilique-saint-frederic-drummondville",
  name: "Basilique Saint-Frédéric",
  kind: "building",
  ready: true,
  origin: [
    -72.48899,
    45.88409
  ],
  height: 45.72,
  padM: 43,
  frontageBearing: 38.164279709894174,
  rotation: 2.4755003160000735
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-72.4893644,45.8839627],[-72.4891071,45.8841906]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#9c896f",
    "trim": "#c4bfa9",
    "base": "#7f8580",
    "copper": "#526f65",
    "iron": "#3d484c",
    "glass": "#42525b",
    "door": "#665449"
  },
  "dark": {
    "stone": "#6b6860",
    "trim": "#8c9691",
    "base": "#58696e",
    "copper": "#425f58",
    "iron": "#2b3c45",
    "glass": "#2b414c",
    "door": "#454744"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Present Saint-Frédéric basilica after the 2025 tower restoration: asymmetric Gothic facade, 7.32 m square main tower with black louvred belfry and green needle, 4.3 m minor tower carrying a statue, large traceried centre window, three portals and broad stairs. Published main tip 45.72 m and minor tower 21.34 m; church length is reported as 57.3 or 58 m, so horizontal fit follows the mapped envelope and both lengths are approximate. The large attached presbytery/connection in the mapped way is clipped out of replacement ownership. Front is architectural +Z toward the square (bearing about 38°), with yaw baked once; y=0 is the bottom stair/pavement datum. Cityscape: not tested. Full 3D world: not tested."
};

// Ground stairs are a separate authored pad; they do not expand the provider building mask.
SPEC.stairFootprint = [[-72.48868976411873,45.88422509057329],[-72.48887848367517,45.88432833600253],[-72.48884579009257,45.88435729390177],[-72.48865707053614,45.88425404847253],[-72.48868976411873,45.88422509057329]];
SPEC.terrainPad.rings = [...FOOTPRINTS, SPEC.stairFootprint];
