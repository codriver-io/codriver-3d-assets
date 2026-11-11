import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "california-theatre-san-bernardino",
  "name": "California Theatre",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.29546775,
    34.1068016
  ],
  "height": 26,
  "widthM": 34.08,
  "depthM": 51.34,
  "padM": 39,
  "frontageBearing": 179.8354191902,
  "rotation": 6.286057784196726,
  "controlPoints": [
    [
      -117.2956518,
      34.106571
    ],
    [
      -117.2956534,
      34.1070322
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.29546775,
        34.1068016
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#d1cbbd",
    "trim": "#e2dece",
    "roof": "#929184",
    "glass": "#46585a",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#aa9365"
  },
  "dark": {
    "stone": "#88847b",
    "trim": "#939086",
    "roof": "#5f5e56",
    "glass": "#2e393b",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6f6042"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "OSM supplies the 34 by 51 m envelope; the 26 m fly tower, 12 m facade eave and 20 m ornamental crown are photo estimates. Restored 2025 frontage has flush entrance glazing. Ornament is simplified; artwork, signs and lettering omitted. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
