import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "anaheim-packing-house",
  "name": "Anaheim Packing House",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.91194385,
    33.83150785
  ],
  "height": 13.2,
  "widthM": 34.57,
  "depthM": 80.2,
  "padM": 52,
  "frontageBearing": 254.2764505431594,
  "rotation": -1.2963686186728618,
  "controlPoints": [
    [
      -117.9123223,
      33.8315757
    ],
    [
      -117.9118049,
      33.8316967
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.91194385,
        33.83150785
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#d2c9a5",
    "trim": "#dcd3b6",
    "roof": "#77766c",
    "glass": "#53615c",
    "dark": "#484b3f",
    "metal": "#999c94",
    "accent": "#a99365",
    "cap": "#9f785b"
  },
  "dark": {
    "stone": "#89836b",
    "trim": "#8f8976",
    "roof": "#4d4d46",
    "glass": "#363f3c",
    "dark": "#2f3129",
    "metal": "#636560",
    "accent": "#6e6042",
    "cap": "#674e3b"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "NPS nomination supplies seven-bay west facade, twin tapered pilasters, domed caps, north loading dock, sawtooth clerestories and 1926 semi-flat east addition. Roof count, 13.2 m peak, parapet and ornamental proportions are photo estimates. The first floor is published as 4.5 ft (1.37 m) above grade. No orange emblem, Sunkist logo, signage or lettering; basement below y=0 and adjacent rail cars excluded. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
