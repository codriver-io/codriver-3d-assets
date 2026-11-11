// Original procedural exterior of the Santa Justa Lift: slender six-tier Neo-Gothic iron shaft, pointed lancet openings and bracing, projecting lower balcony, machinery house, open upper observation crown, and the mapped covered pedestrian bridge to its masonry terminal support.
export const SPEC = {
  "id": "santa-justa-lift",
  "name": "Santa Justa Lift",
  "kind": "building",
  "ready": true,
  "origin": [
    -9.139375,
    38.712118
  ],
  "height": 45,
  "padM": 35,
  "frontageBearing": 74,
  "rotation": 0.28536270232434113,
  "terrainPad": {
    "rings": [
      [
        [
          -9.1394721,
          38.7121346
        ],
        [
          -9.1393061,
          38.7121726
        ],
        [
          -9.1392785,
          38.7120993
        ],
        [
          -9.1394445,
          38.7120613
        ],
        [
          -9.1394579,
          38.7120968
        ],
        [
          -9.1394721,
          38.7121346
        ]
      ]
    ],
    "refs": [
      [
        -9.139375,
        38.712118
      ]
    ],
    "datum": "median",
    "featherM": 1.5
  }
};
export const PALETTES = {
  "light": {
    "iron": "#626b64",
    "column": "#56625a",
    "deck": "#66716a",
    "roof": "#565e59",
    "stone": "#c5c2b6",
    "glass": "#3c4b49"
  },
  "dark": {
    "iron": "#3d423e",
    "column": "#353d38",
    "deck": "#3f4642",
    "roof": "#353a37",
    "stone": "#7a7871",
    "glass": "#252f2d"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current iron exterior and complete covered bridge only. Neighbouring Carmo buildings, extended hilltop paths/stairs, flags, lettering, passengers, moving cabins and lift machinery are omitted. The masonry terminal follows the mapped bridge endpoint, with a conservative rigid buried foundation extended to local y=0 as prescribed for sloping sites; the real hillside should hide its lower wall in world mode, which is not tested. Only the tower base receives a flatten pad; no corridor or hillside flattening is requested. Main tower ring is OSM; narrow bridge projection and bounded terminal support footprints are authored from mapped alignment, not claims of additional building ways. Road layer is null: this is an elevator with a pedestrian connection, not a road bridge. Gothic opening sizes, deck/room levels, tracery and terminal details are photo estimates. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
