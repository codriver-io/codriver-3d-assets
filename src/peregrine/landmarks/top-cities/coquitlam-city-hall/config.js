import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "coquitlam-city-hall",
  "name": "Coquitlam City Hall",
  "kind": "building",
  "ready": true,
  "origin": [
    -122.7934242,
    49.28429785
  ],
  "height": 20,
  "widthM": 91.82,
  "depthM": 60.1,
  "padM": 63,
  "frontageBearing": 20,
  "rotation": -1.9159960652890335,
  "controlPoints": [
    [
      -122.7930963,
      49.2842947
    ],
    [
      -122.7933065,
      49.2839134
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -122.7934242,
        49.28429785
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c5c2a9",
    "trim": "#adb4a5",
    "roof": "#858a7c",
    "glass": "#3e6760",
    "dark": "#363b38",
    "metal": "#727f76",
    "accent": "#a99365",
    "brick": "#875b54",
    "stone2": "#bfbda5",
    "base": "#a2a794"
  },
  "dark": {
    "stone": "#807e6e",
    "trim": "#70756b",
    "roof": "#565a51",
    "glass": "#28433e",
    "dark": "#232624",
    "metal": "#4a534d",
    "accent": "#6e6042",
    "brick": "#583b37",
    "stone2": "#7c7b6b",
    "base": "#696d60"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Exact OSM ownership includes the tapered south office wing, rounded northern head and entrance returns. City tender cover plan confirms a four-storey building; current council facility remains at this address. All exterior heights, screen curve and fenestration proportions are estimates from two checked exterior photographs. The mapped rounded arc controls the pale council head rather than a guessed full cylinder; its upper stone wall is intentionally mostly opaque. No city-name sign column, sculpture, coats of arms, lettering, nearby residential towers, public plaza or terrain. The architect website is expired as of this research and is not relied on for current dimensions. City tender key plan copyright Chernoff Thompson Architects; all rights reserved, viewed only for factual storey/footprint comparison, not copied or committed. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
