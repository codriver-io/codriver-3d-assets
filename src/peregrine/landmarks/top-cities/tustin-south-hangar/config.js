import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "tustin-south-hangar",
  "name": "Tustin South Airship Hangar",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.8239401,
    33.70295405
  ],
  "height": 57.6,
  "widthM": 90.96,
  "depthM": 323.73,
  "padM": 177,
  "frontageBearing": 130.02069075113133,
  "rotation": 7.155488811444799,
  "controlPoints": [
    [
      -117.8229174,
      33.7017063
    ],
    [
      -117.8255944,
      33.7035764
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.8239401,
        33.70295405
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#6e7167",
    "trim": "#a3a698",
    "roof": "#797c72",
    "glass": "#92a8a2",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365",
    "seam": "#73796f",
    "door": "#aaaead",
    "door2": "#a1a6a4"
  },
  "dark": {
    "stone": "#484943",
    "trim": "#6a6c63",
    "roof": "#4f514a",
    "glass": "#5f6d69",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042",
    "seam": "#4b4f48",
    "door": "#6f7170",
    "door2": "#696c6b"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "South Hangar No. 2 alone, the surviving Warner Avenue structure; North No. 1 burned in November 2023 and is excluded. Official city/county history reports 1088 by 297 ft and roof 178 ft plus 11 ft indicators, while OSM has 55 m and secondary captions 1072 by 292 by 192 ft. Horizontal envelope follows mapped way, adopted roof 54.25 m and indicator 57.6 m are estimates distinguishing height points. Door leaves 120 by 37 ft and towers 145 ft are published; curved shell, bands, portal beam depth and indicator location estimated from checked photos. No surrounding paving, signage, logos, antennas borrowed from North Hangar, or terrain. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
