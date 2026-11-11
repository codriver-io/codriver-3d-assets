import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "mission-san-juan-capistrano",
  "name": "Mission San Juan Capistrano",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.662117,
    33.502253249999995
  ],
  "height": 13.62,
  "widthM": 56.93,
  "depthM": 26.94,
  "padM": 40,
  "frontageBearing": 186.0130820892,
  "rotation": -1.6757444074434278,
  "controlPoints": [
    [
      -117.6620451,
      33.5023164
    ],
    [
      -117.6620678,
      33.5021367
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.662117,
        33.502253249999995
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#b7ad96",
    "trim": "#e0dbce",
    "roof": "#79796b",
    "glass": "#46585a",
    "dark": "#3d3d35",
    "metal": "#999c94",
    "accent": "#a99365",
    "brick": "#b49b80",
    "bronze": "#746750",
    "timber": "#494237"
  },
  "dark": {
    "stone": "#777062",
    "trim": "#928e86",
    "roof": "#4f4f46",
    "glass": "#2e393b",
    "dark": "#282822",
    "metal": "#636560",
    "accent": "#6e6042",
    "brick": "#756553",
    "bronze": "#4b4334",
    "timber": "#2f2b24"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current ruin only: no reconstruction of the seven lost domes or collapsed original bell tower. OSM maps the church and exact bell-wall alignment (barrier way 1126056162); wall 6.9 m span, 6.4 m height and arch/bell proportions are estimates from current exterior photographs. The separate two damaged original bells and the rest of the mission compound are excluded. Reusable geometry has a rigid y=0 base; the stone nave surface is at y=0.18 m. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
