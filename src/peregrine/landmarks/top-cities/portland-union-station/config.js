import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "portland-union-station",
  "name": "Portland Union Station",
  "kind": "building",
  "ready": true,
  "origin": [
    -122.67676675,
    45.52901325
  ],
  "height": 45.72,
  "widthM": 158,
  "depthM": 79,
  "padM": 95,
  "frontageBearing": 229.1966,
  "rotation": 2.2829497817542785,
  "controlPoints": [
    [
      -122.6760422,
      45.5286398
    ],
    [
      -122.6763658,
      45.5289024
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -122.67676675,
        45.52901325
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#95917d",
    "trim": "#b8b5a1",
    "roof": "#854f43",
    "glass": "#4e5e57",
    "dark": "#333c35",
    "metal": "#59685c",
    "accent": "#a99365",
    "brick": "#875b48",
    "base": "#918d7e"
  },
  "dark": {
    "stone": "#615e51",
    "trim": "#787669",
    "roof": "#56332c",
    "glass": "#333d39",
    "dark": "#212722",
    "metal": "#3a443c",
    "accent": "#6e6042",
    "brick": "#583b2f",
    "base": "#5e5c52"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Only mapped main depot, clock tower421660583 and entrance canopy443258323; separate interlocking tower421660586/587, tracks, platforms, vehicles and road excluded. Primary150ft tower height adopted45.72m; roof/wing/storey levels and chimney heights are photo estimates. One rigid foundation plane y=0; canopy supports included in foundation ownership, no surrounding pavement. Windows remain individual masonry/grey infill mosaics in far, four clock faces retain hands and hour marks, and canopy remains physically open. No lettering, neon words, logos, flags or trademark signs; an open roof support frame retains the architectural silhouette. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
