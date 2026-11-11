import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "denver-union-station",
  "name": "Denver Union Station",
  "kind": "building",
  "ready": true,
  "origin": [
    -105.00027725000001,
    39.75323075
  ],
  "height": 28.2,
  "widthM": 157,
  "depthM": 52,
  "padM": 91,
  "frontageBearing": 134.81870363149943,
  "rotation": 0.7885623819496921,
  "controlPoints": [
    [
      -105.0005668,
      39.7531496
    ],
    [
      -105.0010122,
      39.752805
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -105.00027725000001,
        39.75323075
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#b9b7a0",
    "trim": "#d0cbb5",
    "roof": "#777e70",
    "glass": "#465a55",
    "dark": "#363b38",
    "metal": "#3d5047",
    "accent": "#a99365",
    "pink": "#a89981",
    "mortar": "#9e9f8e"
  },
  "dark": {
    "stone": "#787768",
    "trim": "#878476",
    "roof": "#4d5249",
    "glass": "#2e3b37",
    "dark": "#232624",
    "metal": "#28342e",
    "accent": "#6e6042",
    "pink": "#6d6354",
    "mortar": "#67675c"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current mapped historic headhouse25650822 only; modern white train canopy/platforms, neighbouring hotel/office towers and streetscape excluded. Main total156m length follows current OSM ownership, not historic NPS860ft length that included former1892 outer extensions.1881 rhyolite wings,1914 limestone/terra-cotta central hall and retained grey roof/dormer rhythm are distinct masses. OSM24m central roof and14m wings are unsurveyed estimates; clock/frame crown28.2m is photo fitted, not a published height.65ft Great Hall ceiling is an interior measurement and is not adopted as exterior height. Foundation y=0 is rigid exterior grade, no terrain baked. Roof sign architecture represented only by bare iron frames: all letters/numerals/neon words, logos, flags, urn inscriptions and commercial signs omitted. Rustication and original abstract urn reliefs use procedural geometry. Current2025 front photos and2022 street view establish restored exterior. Horizontal rustication courses are face partitions, not coplanar overlays. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
