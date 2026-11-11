import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "california-state-capitol",
  "name": "California State Capitol",
  "kind": "building",
  "ready": true,
  "origin": [
    -121.49360035000001,
    38.5766409
  ],
  "height": 67.04,
  "widthM": 100,
  "depthM": 60,
  "padM": 63,
  "frontageBearing": 287.45004457315815,
  "rotation": 4.4078282479633115,
  "controlPoints": [
    [
      -121.4935888,
      38.5764531
    ],
    [
      -121.49345,
      38.5767983
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -121.49360035000001,
        38.5766409
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#d1cebd",
    "trim": "#ddd9ca",
    "roof": "#8c8e81",
    "glass": "#485653",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365",
    "base": "#a7a79c",
    "copper": "#575b53",
    "gold": "#b5a268"
  },
  "dark": {
    "stone": "#88867b",
    "trim": "#908d83",
    "roof": "#5b5c54",
    "glass": "#2f3836",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042",
    "base": "#6d6d65",
    "copper": "#393b36",
    "gold": "#766944"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Only historic west building OSM1569845423 and its west portico are owned; separate State Assembly/Senate eastern annex ways1444090116/117 and current construction are excluded. OSM low dome heights conflict with published street-to-ball67.04m; SGH64m/210ft is a dome-only description and secondary247ft estimates are not adopted. Main body23.8m follows NPS78ft; other intermediate levels and ornamental simplifications are photo estimates. The six west columns,24 drum columns and12 lantern columns are retained in both LODs. Original abstract pediment relief evokes Minerva group without scanned sculpture. No flags, lettering, exterior signs, surrounding paving or landscaping. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
