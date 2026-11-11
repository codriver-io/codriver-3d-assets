// Original procedural exterior of Cristo Rei in Almada: four tapering concrete pylons with enormous rounded arch voids, the elevated platform, and a full robed Christ figure with outstretched 28 m arms, articulated hands, joined head/neck and broad draped sleeves.
export const SPEC = {
  "id": "cristo-rei-almada",
  "name": "Cristo Rei",
  "kind": "building",
  "ready": true,
  "origin": [
    -9.171337325,
    38.6786030375
  ],
  "height": 110,
  "padM": 21,
  "frontageBearing": 180,
  "rotation": 3.1542122897182368,
  "terrainPad": {
    "rings": [
      [
        [
          -9.1714813,
          38.6787119
        ],
        [
          -9.1713392,
          38.6787133
        ],
        [
          -9.1711973,
          38.6787145
        ],
        [
          -9.1711957,
          38.6786052
        ],
        [
          -9.171194,
          38.678493
        ],
        [
          -9.1713336,
          38.6784918
        ],
        [
          -9.1714779,
          38.6784904
        ],
        [
          -9.1714796,
          38.6786042
        ],
        [
          -9.1714813,
          38.6787119
        ]
      ]
    ],
    "refs": [
      [
        -9.171337325,
        38.6786030375
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "concrete": "#ccc9be",
    "statue": "#d8d4c8",
    "bronze": "#796955",
    "shadow": "#555951"
  },
  "dark": {
    "concrete": "#7e7d76",
    "statue": "#86837c",
    "bronze": "#4b4135",
    "shadow": "#353732"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current monument exterior, with open arches in both LODs. Primary sanctuary dimensions override the stale OSM height=103; overall 110 m follows the operator, with the discrepancy documented. Four pylons taper uniformly to the upper platform; the statue remains rigid and retains feet, a flowing robe, wide sleeves, wrists/hands and a contacting neck/head. Minor facial detail, sculptural panel reliefs, small evangelist sculptures at grade, interior chapel, grounds, inscriptions, branding and the hill are omitted. Statue front follows the north-facing principal pedestal axis toward Lisbon; mapped near east-west controls fix the square base yaw, with 180 degrees selecting that face. The base ring is mapped; a narrow supplemental arm-overhang ring is authored from the published 28 m fingertip span and claims no additional OSM way. No terrain or river elevation is baked. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
