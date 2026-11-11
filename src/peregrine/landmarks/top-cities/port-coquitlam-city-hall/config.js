import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "port-coquitlam-city-hall",
  "name": "Port Coquitlam City Hall",
  "kind": "building",
  "ready": true,
  "origin": [
    -122.78056330000001,
    49.26218285
  ],
  "height": 14.6,
  "widthM": 26.87,
  "depthM": 37.02,
  "padM": 31,
  "frontageBearing": 302.4646385349698,
  "rotation": 2.5749778206847407,
  "controlPoints": [
    [
      -122.7805663,
      49.2619891
    ],
    [
      -122.7808363,
      49.2621012
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -122.78056330000001,
        49.26218285
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c4bba8",
    "trim": "#c4c3b2",
    "roof": "#666d67",
    "glass": "#496d68",
    "dark": "#363b38",
    "metal": "#a3b4ac",
    "accent": "#a99365",
    "brick": "#9b6e5b",
    "plinth": "#929b92"
  },
  "dark": {
    "stone": "#7f7a6d",
    "trim": "#7f7f74",
    "roof": "#424743",
    "glass": "#2f4744",
    "dark": "#232624",
    "metal": "#6a7570",
    "accent": "#6e6042",
    "brick": "#65483b",
    "plinth": "#5f655f"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "City heritage statement identifies 1914 original and 1988 three-storey addition, separated by a glazed atrium. Selection shorthand describing a white tower was corrected after checking the official exterior and heritage statement: the real landmark is this brick complex. Mapped north/east wing is historic; south/west wing and recessed west-entry atrium are separate masses. Heights, roof truncation, masonry rhythms, stair rise and atrium arch are photo estimates. No neighbouring cenotaph, cafe, public square, radio antenna, heraldry, lettering, flags or signs. Original raised entry stair stands on local y=0. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
