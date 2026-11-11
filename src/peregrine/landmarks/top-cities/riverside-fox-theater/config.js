import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "riverside-fox-theater",
  "name": "Fox Performing Arts Center",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.37527349999999,
    33.98397195
  ],
  "height": 22,
  "widthM": 67.04,
  "depthM": 44.56,
  "padM": 49,
  "frontageBearing": 164.9077151513,
  "rotation": 2.619604552451568,
  "controlPoints": [
    [
      -117.3751494,
      33.9836676
    ],
    [
      -117.3756593,
      33.9839108
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.37527349999999,
        33.98397195
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#dedbd0",
    "trim": "#e9e4d6",
    "roof": "#80614e",
    "glass": "#414c4b",
    "dark": "#38413e",
    "metal": "#817c6c",
    "accent": "#a99365"
  },
  "dark": {
    "stone": "#908e87",
    "trim": "#97948b",
    "roof": "#533f33",
    "glass": "#2a3131",
    "dark": "#242a28",
    "metal": "#545146",
    "accent": "#6e6042"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "OSM supplies the approximately 67 by 44.6 m skewed envelope and bevelled entrance corner. The 9.8 m arcade eave, 14.8 m tower shoulder and 22 m cupola tip are photo estimates, not surveyed heights. Ground arcades and belfry openings remain genuine holes in both LODs. Rear roof/service details simplified; no signs, lettering, logos or neighboring Food Lab buildings. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
