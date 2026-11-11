import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "haney-house",
  "name": "Haney House",
  "kind": "building",
  "ready": true,
  "origin": [
    -122.60205625,
    49.213058000000004
  ],
  "height": 10.2,
  "widthM": 13.23,
  "depthM": 23.61,
  "padM": 22,
  "frontageBearing": 184.01100119964303,
  "rotation": -0.07000517723521349,
  "controlPoints": [
    [
      -122.6021096,
      49.2131657
    ],
    [
      -122.6021232,
      49.213039
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -122.60205625,
        49.213058000000004
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#d1d0c4",
    "trim": "#dddcd2",
    "roof": "#696b5b",
    "glass": "#42554b",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365",
    "green": "#355347",
    "brick": "#886b55"
  },
  "dark": {
    "stone": "#88877f",
    "trim": "#908f89",
    "roof": "#44463b",
    "glass": "#2b3731",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042",
    "green": "#22362e",
    "brick": "#584637"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Mapped footprint is the actual Haney House above Port Haney, distinct from the brickworks manager house used as Maple Ridge Museum. Museum and City give 1883, superseding OSM start_date 1878. Gable and veranda arrangement follow checked restoration and current City photos; all heights, roof slopes and rear ell height estimated. Current photograph supplies unwrapped chimneys and restored windows; temporary 2018 wrapping and plywood excluded. No garden, signs, lettering or terrain; main raised deck top 0.60 m. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
