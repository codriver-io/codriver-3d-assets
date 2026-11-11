import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "tour-lu-nantes",
  "name": "Tour LU",
  "kind": "building",
  "ready": true,
  "origin": [
    -1.54620367,
    47.21545928
  ],
  "height": 38,
  "padM": 8,
  "frontageBearing": 342.31913865388185,
  "rotation": 0.30858924507835866,
  "terrainPad": { "rings": FOOTPRINTS, "refs": [[-1.5462289, 47.2154914], [-1.5461574, 47.2154799], [-1.5461862, 47.2154205]], "datum": "median", "featherM": 1 }
};
export const PALETTES = {
  "light": {
    "plaster": "#cdc8b5",
    "blue": "#7b9eaa",
    "pink": "#b9a5aa",
    "glass": "#425b63",
    "gold": "#ad985d",
    "roof": "#697e82"
  },
  "dark": {
    "plaster": "#9a9f98",
    "blue": "#4b6d7f",
    "pink": "#776c79",
    "glass": "#2c4858",
    "gold": "#a08d5b",
    "roof": "#3a5866"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 at street foundation; rigid real metres east/up/south; no terrain, absolute altitude or Mercator stretch baked in.",
  "attribution": "Original procedural geometry © 2026 Codriver; mapped outline © OpenStreetMap contributors, ODbL 1.0.",
  "note": "38 m overall is an adopted unsurveyed OSM finial-height estimate. The mapped drum is about 8.5 m diameter; 20.5 m shaft, dome/lantern stage splits, relief silhouettes and balcony are photo estimates. Tower only, not the factory. OSM parent 32428111 is partially owned only inside the tower ring; all tower parts are listed, and the authored balcony envelope extends the mapped drum conservatively. Geographic yaw baked once from mapped controls [[-1.5461632, 47.215512], [-1.5461281, 47.2155196]]. Cityscape: not tested; Full 3D world: not tested."
};
