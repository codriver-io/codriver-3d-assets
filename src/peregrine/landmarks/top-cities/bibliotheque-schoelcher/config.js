import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "bibliotheque-schoelcher",
  "name": "Bibliothèque Schœlcher",
  "kind": "building",
  "ready": true,
  "origin": [
    -61.068057275,
    14.60485175
  ],
  "height": 23.65,
  "padM": 20,
  "frontageBearing": 299.42220100754156,
  "rotation": -0.5135142807651931,
  "terrainPad": { "rings": FOOTPRINTS, "refs": [[-61.0681728, 14.6048235], [-61.0680231, 14.6047418]], "datum": "median", "featherM": 2 }
};
export const PALETTES = {
  "light": {
    "plaster": "#b1afa0",
    "pink": "#b38d82",
    "trim": "#d2c9af",
    "roof": "#816f69",
    "glass": "#66808a",
    "wood": "#786b54",
    "brace": "#786b54",
    "gold": "#ae985e"
  },
  "dark": {
    "plaster": "#747f83",
    "pink": "#7a6c6b",
    "trim": "#a7a999",
    "roof": "#46545c",
    "glass": "#365667",
    "wood": "#4e5552",
    "brace": "#4e5552",
    "gold": "#988956"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 at street foundation; rigid real metres east/up/south; no terrain, absolute altitude or Mercator stretch baked in.",
  "attribution": "Original procedural geometry © 2026 Codriver; mapped outline © OpenStreetMap contributors, ODbL 1.0.",
  "note": "Mapped main hall about 18.5 × 17.7 m, versus frequently quoted 17.75 m square for the historic hall. Adopted 23.65 m overall is an unsurveyed published secondary figure, treated as an estimate; no primary height survey found. Roof/clerestory stages, arch sizes, material tones and simplified mosaic borders estimated from the exterior photographs. Fine lettering, writer names, decorative emblems and iron garden fence omitted; no garden/plaza modeled. Geographic yaw baked once from mapped controls [[-61.0681728, 14.6048235], [-61.0680231, 14.6047418]]. Cityscape: not tested; Full 3D world: not tested."
};
