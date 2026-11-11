import { FOOTPRINTS } from './footprint.js';
// Geographic yaw from two mapped controls is baked into vertices; local y=0 is rigid foundation grade.
export const SPEC = {
  id: "hillsboro-inlet-lighthouse",
  name: "Hillsboro Inlet Lighthouse",
  kind: "building",
  ready: true,
  origin: [
    -80.0807464,
    26.2591689
  ],
  height: 44.8056,
  padM: 12,
  frontageBearing: 354.62186557001667,
  rotation: 0.09386615341807765,
  footprintless: true
};
SPEC.terrainPad = { rings: FOOTPRINTS, refs: [[-80.0807374,26.2590997],[-80.0807528,26.2592464]], datum: 'median', featherM: 2 };
export const PALETTES = {
  "light": {
    "white": "#caccc2",
    "black": "#343b3a",
    "stone": "#ada798",
    "glass": "#718b7e",
    "metal": "#b2b6a3",
    "jointwhite": "#caccc2",
    "jointblack": "#343b3a"
  },
  "dark": {
    "white": "#91a3a7",
    "black": "#293e4b",
    "stone": "#6f8288",
    "glass": "#668f96",
    "metal": "#758d92",
    "jointwhite": "#91a3a7",
    "jointblack": "#293e4b"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Hillsboro Inlet Lighthouse, current octagonal skeletal cast-iron structure: eight tapered legs, X bracing, central stair cylinder, black watch room and gallery, prominent 0.16 m black diagonal diamond frames outside muted green lantern glazing and conical finial. OSM lighthouse node and mapped circular pedestrian base ring define position/ownership; no provider building polygon exists. Current preservation society states 147 ft overall (44.8056 m) and 136 ft to lens room; historical sources give 132–144 ft, including 137 ft, so heights are adopted estimates rather than a survey. Eight footings on a 40 ft diameter circle, photo-based 22 m paint division; no keeper buildings or scenery are authored. Cityscape: not tested. Full 3D world: not tested."
};
