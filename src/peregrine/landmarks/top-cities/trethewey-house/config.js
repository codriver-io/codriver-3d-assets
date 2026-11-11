import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "trethewey-house",
  "name": "Trethewey House",
  "kind": "building",
  "ready": true,
  "origin": [
    -122.3050329,
    49.043757
  ],
  "height": 11,
  "widthM": 13.4,
  "depthM": 17.3,
  "padM": 19,
  "frontageBearing": 180,
  "rotation": 4.705102295594017,
  "controlPoints": [
    [
      -122.3049173,
      49.0438058
    ],
    [
      -122.3051476,
      49.0438069
    ]
  ],
  "terrainPad": {
    "rings": [
      [
        [
          -122.3051485,
          49.0437082
        ],
        [
          -122.3049184,
          49.0437071
        ],
        [
          -122.3049173,
          49.0438058
        ],
        [
          -122.3051476,
          49.0438069
        ],
        [
          -122.3051484,
          49.0437326
        ],
        [
          -122.3051485,
          49.0437082
        ]
      ],
      [
        [
          -122.30503345921639,
          49.0437066959097
        ],
        [
          -122.30503363896452,
          49.04369052673781
        ],
        [
          -122.30506104739655,
          49.04369065765086
        ],
        [
          -122.30506086764842,
          49.04370682682275
        ],
        [
          -122.30503345921639,
          49.0437066959097
        ]
      ]
    ],
    "refs": [
      [
        -122.3050329,
        49.043757
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#bdb79b",
    "trim": "#d5d3bf",
    "roof": "#72725f",
    "glass": "#4c615d",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365",
    "paint": "#bba773",
    "wood": "#5f6053",
    "base": "#656254",
    "stone2": "#aaa68f"
  },
  "dark": {
    "stone": "#7b7765",
    "trim": "#8a897c",
    "roof": "#4a4a3e",
    "glass": "#313f3c",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042",
    "paint": "#7a6d4b",
    "wood": "#3e3e36",
    "base": "#424037",
    "stone2": "#6f6c5d"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Mapped house at 2313 Ware Street; carriage house, playhouse, station and garden excluded. Operator dates construction to 1919, while the heritage inventory uses 1920 and notes restoration to circa1925; these dates refer to the same retained house, not different buildings. Inventory confirms two cobblestone chimneys (one internal, one external), cross gables/dormers, half-timbered peaks, exposed rafters, thick veranda piers and bay windows. Buff brick is described for the chimney/fireplace construction; visible external cladding is cobblestone. All heights, roof pitches, window sizes, porch and stair dimensions are estimates. Original procedural face mosaics evoke fieldstone without image textures or copied artwork. South stair first tread clears grade by 0.18 m; no terrain, surrounding lawn, lettering, symbols or signs. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
