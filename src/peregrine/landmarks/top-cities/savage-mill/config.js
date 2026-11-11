import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "savage-mill",
  name: "Savage Mill",
  kind: "building",
  ready: true,
  origin: [
    -76.82575,
    39.13558
  ],
  height: 27.8,
  padM: 65,
  frontageBearing: 359.4451563767263,
  rotation: 0.009683848059821597
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-76.8257668,39.1354603],[-76.8252476,39.1354642]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "brick": "#745f54",
    "stone": "#9c9788",
    "trim": "#c0b8a1",
    "roof": "#485056",
    "glass": "#506169",
    "copper": "#6a8a7c"
  },
  "dark": {
    "brick": "#584f4a",
    "stone": "#687274",
    "trim": "#89938f",
    "roof": "#303e47",
    "glass": "#354c58",
    "copper": "#435f5c"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Savage Mill historic Carding, Spinning and Old Weave blocks: stone lower carding storeys with a brick fourth storey, gable and open belfry, red-brown brick courtyard wings and Romanesque stair tower with corbeled cornice/pyramidal dormered roof. The 1916 New Weave and other later structures remain provider geometry. Mapped plan approximately 90 × 63 m; roof, floor and 27.8 m tower heights are photographic estimates. The heritage authority calls the tower pre-1881 while the owner timeline groups it with 1881 additions; present exterior is modeled without resolving that dating discrepancy. Cityscape: not tested. Full 3D world: not tested."
};
