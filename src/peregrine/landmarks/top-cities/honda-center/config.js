import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "honda-center",
  "name": "Honda Center",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.87653495,
    33.8078251
  ],
  "height": 33,
  "widthM": 142.22,
  "depthM": 108.81,
  "padM": 98,
  "frontageBearing": 180,
  "rotation": 0.0069165677006762264,
  "controlPoints": [
    [
      -117.8769366,
      33.8073364
    ],
    [
      -117.8761188,
      33.8073411
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.87653495,
        33.8078251
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#98776c",
    "trim": "#e0dbce",
    "roof": "#617a70",
    "glass": "#476969",
    "dark": "#394744",
    "metal": "#839995",
    "accent": "#a99365",
    "course": "#8d6f65"
  },
  "dark": {
    "stone": "#634d46",
    "trim": "#928e86",
    "roof": "#3f4f49",
    "glass": "#2e4444",
    "dark": "#252e2c",
    "metal": "#556361",
    "accent": "#6e6042",
    "course": "#5c4842"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Mapped 142 by 109 m outer envelope; engineer reports a 329 by 444 ft roof span. Overall 33 m, portal radius 24 m, facade courses and roof curvature are photo estimates. Operator describes an ongoing five-storey South Edition; proposed additions are excluded, modeling the extant photographed main arena, not a future completion. No signs, logos, banners, parking or temporary construction. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
