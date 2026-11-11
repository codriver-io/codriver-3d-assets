import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "tovrea-castle",
  "name": "Tovrea Castle",
  "kind": "building",
  "ready": true,
  "origin": [
    -111.97172979999999,
    33.4481607
  ],
  "height": 15.84,
  "widthM": 16.1,
  "depthM": 11,
  "padM": 18,
  "frontageBearing": 273.86631706418586,
  "rotation": -1.6382762894909813,
  "controlPoints": [
    [
      -111.9717843,
      33.4482106
    ],
    [
      -111.9717921,
      33.4481143
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -111.97172979999999,
        33.4481607
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c5bd9d",
    "trim": "#d5d0b6",
    "roof": "#a9a68b",
    "glass": "#465a52",
    "dark": "#363b38",
    "metal": "#9b9f92",
    "accent": "#a99365",
    "frame": "#466f61"
  },
  "dark": {
    "stone": "#807b66",
    "trim": "#8a8776",
    "roof": "#6e6c5a",
    "glass": "#2e3b35",
    "dark": "#232624",
    "metal": "#65675f",
    "accent": "#6e6042",
    "frame": "#2e483f"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Castle136668541 only; hill, garden/cacti, perimeter terrace/wall and separately restored outbuildings are excluded. NPS identifies four-storey stepped octagonal tower including the small cupola; three broad main tiers and the fourth-floor cupola are present. All heights and upper-tier setbacks are photo estimates, with only the bare flagpole2.44m length published by SAH; total15.84m is an estimate, not a sourced building-height claim. Rigid y=0 exterior foundation excludes the basement excavated into the knoll. Mapped lower outline is a clipped rectangular octagon, not a circular cylinder. Both LODs keep crenellation openings and alternating dome gores; no flag, lettering, logos, string lights or signs. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
