import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "eglise-saint-hubert-longueuil",
  name: "Église Saint-Hubert",
  kind: "building",
  ready: true,
  origin: [
    -73.42084829210754,
    45.50479055215339
  ],
  height: 48.5,
  padM: 44,
  frontageBearing: 204.26571483509196,
  rotation: 2.7180760343674057
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-73.4211309,45.5046079],[-73.420577,45.5044329]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#9e9d91",
    "trim": "#c0beb0",
    "roof": "#505759",
    "silver": "#a4aaa7",
    "glass": "#43535b",
    "door": "#507178"
  },
  "dark": {
    "stone": "#666f70",
    "trim": "#838d8c",
    "roof": "#313e46",
    "silver": "#727f86",
    "glass": "#2e444e",
    "door": "#34545c"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Victor Bourgeau’s present 1858–1862 Saint-Hubert church: three Gothic portals, tall central silver needle with open octagonal belfry, four subsidiary lantern pinnacles and stepped stone facade. Main nave approximately 23 × 38 m from OSM; 48.5 m overall and stage heights are photographic estimates. The mapped outer way includes an attached west presbytery wing, which is clipped out of FOOTPRINTS and is not authored or masked. Rear sacristy is retained inside the church envelope. Geographic yaw baked once. Cityscape: not tested. Full 3D world: not tested."
};
