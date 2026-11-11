import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "san-bernardino-county-courthouse",
  "name": "San Bernardino County Courthouse",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.28903585,
    34.10550375
  ],
  "height": 18.3,
  "widthM": 90,
  "depthM": 24.6,
  "padM": 56,
  "frontageBearing": 269.6564432372,
  "rotation": -1.5648001301166883,
  "controlPoints": [
    [
      -117.2891732,
      34.1055191
    ],
    [
      -117.2891709,
      34.1052015
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.28903585,
        34.10550375
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#bbb8a9",
    "trim": "#d1cebe",
    "roof": "#7b7e77",
    "glass": "#59615d",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365"
  },
  "dark": {
    "stone": "#7a786e",
    "trim": "#88867c",
    "roof": "#50524d",
    "glass": "#3a3f3c",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "NPS nomination describes an approximately 296 ft long, 60 ft high building, 25 ft columns, three visible facade floors, and a fourth floor set 30 ft back. OSM maps 91.4 by 27.3 m; modeled body fits at 90 by 24.6 m. The centre has nine bays, each flank six and each end three. Column placement, parapets and detail are simplified photo estimates. The radio tower removed in 1959 and adjoining structures are excluded; no lettering or flags. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
