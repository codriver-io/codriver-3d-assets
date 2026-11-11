import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "ucr-bell-tower",
  "name": "UC Riverside Bell Tower",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.3281749,
    33.97334275
  ],
  "height": 49.07,
  "widthM": 7.88,
  "depthM": 7.89,
  "padM": 14,
  "frontageBearing": 180,
  "rotation": 0,
  "controlPoints": [
    [
      -117.3281884,
      33.9733085
    ],
    [
      -117.328161,
      33.9733085
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.3281749,
        33.97334275
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c5b99c",
    "trim": "#ded4ba",
    "roof": "#8e866f",
    "glass": "#46585a",
    "dark": "#454739",
    "metal": "#ad9e77",
    "accent": "#a99365"
  },
  "dark": {
    "stone": "#807865",
    "trim": "#908a79",
    "roof": "#5c5748",
    "glass": "#2e393b",
    "dark": "#2d2e25",
    "metal": "#70674d",
    "accent": "#6e6042"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Official UCR height is 161 ft, modeled as 49.07 m; mapped plan is approximately 7.9 m square. Clock stage at 32 m, grille pitch, piers, bell-chamber height and crown overhang are photo estimates. Grille slots and upper chamber remain physically open in both LODs. No surrounding campus buildings, landscape, UCR letters or logos. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
