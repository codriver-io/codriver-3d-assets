// Original procedural exterior of the surviving Ostiense gas-holder frame: twenty open steel stanchions, five giant X-braced tiers, circumferential lattice rings, low annular base and a supported internal access gantry. The removed gas-storage cylinder is not reconstructed.
export const SPEC = {
  "id": "gasometro-rome",
  "name": "Gasometro Ostiense",
  "kind": "building",
  "ready": true,
  "origin": [
    12.474697952631582,
    41.8695270631579
  ],
  "height": 93.1,
  "padM": 39,
  "frontageBearing": 180,
  "rotation": -2.355947503089237,
  "terrainPad": {
    "rings": [
      [
        [
          12.47443,
          41.8697265
        ],
        [
          12.4745316,
          41.8697807
        ],
        [
          12.4746514,
          41.8698073
        ],
        [
          12.4747763,
          41.8698035
        ],
        [
          12.4748927,
          41.8697696
        ],
        [
          12.4749879,
          41.8697093
        ],
        [
          12.4750517,
          41.8696293
        ],
        [
          12.4750769,
          41.8695381
        ],
        [
          12.4750611,
          41.8694458
        ],
        [
          12.4750057,
          41.8693623
        ],
        [
          12.4749169,
          41.8692969
        ],
        [
          12.4748049,
          41.8692565
        ],
        [
          12.4746814,
          41.8692454
        ],
        [
          12.4745597,
          41.8692647
        ],
        [
          12.4744529,
          41.8693124
        ],
        [
          12.4743725,
          41.8693831
        ],
        [
          12.4743274,
          41.8694696
        ],
        [
          12.4743223,
          41.8695622
        ],
        [
          12.4743578,
          41.869651
        ],
        [
          12.47443,
          41.8697265
        ]
      ]
    ],
    "refs": [
      [
        12.474697952631582,
        41.8695270631579
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "column": "#66685d",
    "ring": "#6b6b5d",
    "web": "#6b6b5d",
    "brace": "#777365",
    "base": "#797367"
  },
  "dark": {
    "column": "#3f403a",
    "ring": "#42423a",
    "web": "#42423a",
    "brace": "#4a473f",
    "base": "#4b4740"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Open present-day steel frame only, not an intact industrial gas tank. Original triangulated X bracing and lattice ring rhythm are retained in both LODs; far drops fine band web members but keeps all primary bays. Main frame rim follows mapped 89.1 m. The access platform appears above the rim in both exterior references; adopted overall 93.1 m includes an explicitly estimated 4 m projection and is not silently presented as a published height. Column sections, bracing counts and internal access geometry are photo estimates. No industrial plant, nearby smaller gas holders, paving, graffiti, signage or texture is included. Bounded OSM API map recovery follows failed serialized dossier Overpass attempts; geographic coordinates are original OSM data. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
