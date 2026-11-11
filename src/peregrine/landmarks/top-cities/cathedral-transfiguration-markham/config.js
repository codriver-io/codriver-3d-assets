import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "cathedral-transfiguration-markham",
  name: "Cathedral of the Transfiguration",
  kind: "building",
  ready: true,
  origin: [
    -79.37272,
    43.8937
  ],
  height: 64,
  padM: 46,
  frontageBearing: 80.07967387042237,
  rotation: -1.3976539729621413
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-79.3727191,43.8937878],[-79.3724771,43.8938183]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "stone": "#aaa89d",
    "trim": "#d0cbb7",
    "copper": "#344a45",
    "gold": "#b99c50",
    "glass": "#3d4e54",
    "door": "#655442"
  },
  "dark": {
    "stone": "#707b7b",
    "trim": "#929c93",
    "copper": "#263d3c",
    "gold": "#9e874b",
    "glass": "#2c424b",
    "door": "#444641"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current Cathedral of the Transfiguration: published 64 m central and 45 m side towers, dark copper onion bulbs topped by small gilt lantern bulbs and crosses, rear crossing dome, pale stone pilasters and separate arched/oculus window bays. The footprint and all 31 mapped building parts are recorded; the outer footprint contains the nested parts. OSM outer height=0.1 is not an architectural height and is rejected. Stage profiles are estimated from checked photographs and mapped parts; no mosaics, lettering or interior are reproduced. Geographic yaw baked once. Cityscape: not tested. Full 3D world: not tested."
};
