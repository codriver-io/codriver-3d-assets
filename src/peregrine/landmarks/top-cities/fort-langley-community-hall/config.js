import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "fort-langley-community-hall",
  "name": "Fort Langley Community Hall",
  "kind": "building",
  "ready": true,
  "origin": [
    -122.57990085,
    49.169121000000004
  ],
  "height": 11.44,
  "widthM": 27.97,
  "depthM": 14.24,
  "padM": 24,
  "frontageBearing": 125.48688917781726,
  "rotation": 0.9514332693516426,
  "controlPoints": [
    [
      -122.5799328,
      49.1689816
    ],
    [
      -122.5797097,
      49.1691862
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -122.57990085,
        49.169121000000004
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c9b67c",
    "trim": "#d9d9cf",
    "roof": "#7a7d6c",
    "glass": "#576965",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365",
    "door": "#765549",
    "plinth": "#949c96",
    "blue": "#577f89"
  },
  "dark": {
    "stone": "#837651",
    "trim": "#8d8d87",
    "roof": "#4f5146",
    "glass": "#394442",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042",
    "door": "#4d372f",
    "plinth": "#606562",
    "blue": "#395359"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Mapped rotated 28 by 14 m hall. Overall heights, column diameter, roof slope and window sizes are photo estimates. Original yellow/white scheme is used, excluding fictional film repaints. The thin blue arrow board in the pediment is a documented architectural feature honoring George Young, not lettering or a logo. Four portico columns stand on the building foundation and meet the entablature. No flagpoles, signs, lettering, road, circular driveway or landscaping. Glover Road east/southeast alignment checked against nearby OSM road nodes. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
