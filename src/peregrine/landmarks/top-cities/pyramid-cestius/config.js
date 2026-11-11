// Original procedural exterior of the restored Pyramid of Cestius: steep four-sided marble pyramid, mapped square base, sharp summit and restrained marble-block coursing partitioned into the faces.
export const SPEC = {
  "id": "pyramid-cestius",
  "name": "Pyramid of Cestius",
  "kind": "building",
  "ready": true,
  "origin": [
    12.480869157142857,
    41.87646435714286
  ],
  "height": 36.4,
  "padM": 24,
  "frontageBearing": 180,
  "rotation": 1.1442795786843314,
  "terrainPad": {
    "rings": [
      [
        [
          12.4809426,
          41.876272
        ],
        [
          12.4810909,
          41.876515
        ],
        [
          12.4809903,
          41.8765489
        ],
        [
          12.4809744,
          41.8765543
        ],
        [
          12.4807653,
          41.8766252
        ],
        [
          12.480617,
          41.8763822
        ],
        [
          12.4807036,
          41.8763529
        ],
        [
          12.4809426,
          41.876272
        ]
      ]
    ],
    "refs": [
      [
        12.480869157142857,
        41.87646435714286
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#cecabe",
    "joint": "#b7b4a9"
  },
  "dark": {
    "stone": "#807d76",
    "joint": "#717069"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Current restored pale-marble exterior. Four smooth slopes meet at a single supported apex. Marble seams are disjoint partitions of the sloping faces, not layered quads. Inscriptions, fenced worksite, adjacent Aurelian wall, Porta San Paolo, landscaping and inaccessible burial chamber are excluded. Published heights vary from about 36 to 37 m; adopted 36.4 m follows the mapped tag and Italian heritage convention and is treated as an estimate. After unmodified dossier Overpass retries timed out, the bounded OSM map API supplied the exact building ring; original API response and provenance remain in ignored scratch. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
