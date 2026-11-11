import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "surrey-city-hall",
  "name": "Surrey City Hall",
  "kind": "building",
  "ready": true,
  "origin": [
    -122.84928235000001,
    49.1912404
  ],
  "height": 28.8,
  "widthM": 124,
  "depthM": 63,
  "padM": 74,
  "frontageBearing": 180,
  "rotation": -0.0017470923685659694,
  "controlPoints": [
    [
      -122.8500288,
      49.1915028
    ],
    [
      -122.8490654,
      49.1915017
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -122.84928235000001,
        49.1912404
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c4bba8",
    "trim": "#e0dbce",
    "roof": "#8a9b9f",
    "glass": "#718e98",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365",
    "mullion": "#9caeaa",
    "frit": "#bdc7ca",
    "core": "#67777f",
    "soffit": "#a98753",
    "glow": "#95a7aa",
    "atrium": "#466a7b"
  },
  "dark": {
    "stone": "#7f7a6d",
    "trim": "#928e86",
    "roof": "#667b83",
    "glass": "#3b5868",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042",
    "mullion": "#65716f",
    "frit": "#8d9b9f",
    "core": "#40535e",
    "soffit": "#967640",
    "glow": "#ae9868",
    "atrium": "#2b4d64"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Primary OSM footprint and six mapped building parts including five-storey north facade projections owned, excluding the adjacent library and civic square. Six storeys and the cantilevered roof/glass atrium are documented by the engineer and architect; all metre heights, roof fold, seven-metre wing projection, 9.2 m core and low-lobby heights are estimates from exterior photographs. Roof top is a two-plane fold peaking at 28.8 m, with a continuous cedar soffit and clerestory reaching its underside. Right wing is supported by a grounded service core; the open west overhang survives in far. Frit is simplified to original opaque/clear face partitions, not photo textures. No logos, lettering, heraldry, neighbouring library, broad plaza or terrain. Atrium foundation top is 0.18 m above local grade. Roof outline extends about 4.3 m beyond the north facade projections and 3–4 m beyond end walls, a photograph-based eave estimate beyond the mapped roof-part polygon; building foundations retain exact mapped outlines. Atrium glass is separately muted blue; no civic lettering or logos are included. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
