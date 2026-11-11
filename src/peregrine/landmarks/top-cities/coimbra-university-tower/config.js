// Original Baroque University of Coimbra clock tower: narrow limestone shaft, open arched belfry with visible bells, four round clock faces and the flat balustraded astronomical observation terrace.
export const SPEC = {
  "id": "coimbra-university-tower",
  "name": "University of Coimbra Tower",
  "kind": "building",
  "ready": true,
  "origin": [
    -8.4264793,
    40.20779535
  ],
  "height": 34,
  "padM": 14,
  "frontageBearing": 180,
  "rotation": 0.1838393495456313,
  "terrainPad": {
    "rings": [
      [
        [
          -8.4264396,
          40.2077743
        ],
        [
          -8.4264988,
          40.2077659
        ],
        [
          -8.4265065,
          40.2077648
        ],
        [
          -8.426519,
          40.2078164
        ],
        [
          -8.4264521,
          40.2078259
        ],
        [
          -8.4264396,
          40.2077743
        ]
      ]
    ],
    "refs": [
      [
        -8.4264793,
        40.20779535
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c5c0ad",
    "trim": "#d6d2c4",
    "shadow": "#424b45",
    "clock": "#e6e3d8",
    "metal": "#4e5751",
    "bell": "#6f7764"
  },
  "dark": {
    "stone": "#7a776b",
    "trim": "#85827a",
    "shadow": "#292f2b",
    "clock": "#8f8d86",
    "metal": "#303632",
    "bell": "#454a3e"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Only the free-standing tower is authored, not the attached university wings. Belfry archways remain real voids and the bells remain visible in both LODs. The clock terrace is flat and roofless, not a spire. Limestone moldings, four dial hands without lettering, corner pilasters and small finial supports provide the recognizable silhouette. Detailed rococo carving and tiny weather instruments are omitted. The33.5m OSM height and34m tourism height are documented alternatives; this is not a surveyed model. Tower pad is bounded to its mapped footprint. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
