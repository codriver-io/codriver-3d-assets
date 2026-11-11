import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "fort-chambly",
  name: "Fort Chambly",
  kind: "building",
  ready: true,
  origin: [
    -73.27694,
    45.44949
  ],
  height: 17.2,
  padM: 40,
  frontageBearing: 272.9420630137363,
  rotation: 1.5194476404040513
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-73.2772436,45.4493444],[-73.2772213,45.4496488]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#b4aa95",
    "trim": "#c3bbaa",
    "roof": "#656c6b",
    "glass": "#41494a",
    "wood": "#75695a",
    "paving": "#97968b"
  },
  "dark": {
    "stone": "#737b7c",
    "trim": "#939a96",
    "roof": "#39474d",
    "glass": "#283b43",
    "wood": "#4c4c47",
    "paving": "#5c686b"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Present restored stone Fort Chambly, completed in 1711: four tall corner bastions, two-level musket slits, western gate with pediment and projecting sentry boxes, open quadrangle and pitched courtyard barracks roofs. OSM wall envelope approximately 54 × 54 m; 17.2 m maximum, wall/bastion heights and roof construction are photographic estimates. No moat, river, terrain embankment or surrounding park is authored. Geographic yaw baked from the western curtain controls. Cityscape: not tested. Full 3D world: not tested."
};
