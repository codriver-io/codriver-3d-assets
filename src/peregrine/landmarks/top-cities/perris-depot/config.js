import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "perris-depot",
  "name": "Perris Depot",
  "kind": "building",
  "ready": true,
  "origin": [
    -117.22935905,
    33.7826326
  ],
  "height": 14.8,
  "widthM": 39.06,
  "depthM": 12.33,
  "padM": 29,
  "frontageBearing": 273.0540831491,
  "rotation": -1.6241001333771725,
  "controlPoints": [
    [
      -117.2293101,
      33.7826251
    ],
    [
      -117.229321,
      33.7824553
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -117.22935905,
        33.7826326
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#9d7761",
    "trim": "#ded9c9",
    "roof": "#786a55",
    "glass": "#4e5550",
    "dark": "#363b38",
    "metal": "#b9bcb6",
    "accent": "#a99365"
  },
  "dark": {
    "stone": "#664d3f",
    "trim": "#908d83",
    "roof": "#4e4537",
    "glass": "#333734",
    "dark": "#232624",
    "metal": "#787a76",
    "accent": "#6e6042"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "The OSM outline measures about 39 by 12 m; 4.3 m eave, 10.8 m cross-roof crown and 14.8 m turret tip are photographic estimates. Library of Congress and OSM locate the restored depot at 120 W Fourth Street; Wikipedia latitude is incorrect. Model depicts the restored 2009 exterior, omits the flag and all lettering. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
