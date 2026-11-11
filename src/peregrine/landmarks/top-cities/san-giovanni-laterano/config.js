// Original procedural current exterior of the Lateran basilica: Galilei’s five-bay monumental white facade, fifteen seven-metre rooftop human figures, long gabled nave, northern two-storey loggia with twin bell spires, chapel dome and the mapped cloister complex.
export const SPEC = {
  "id": "san-giovanni-laterano",
  "name": "Archbasilica of Saint John Lateran",
  "kind": "building",
  "ready": true,
  "origin": [
    12.505592,
    41.8858502
  ],
  "height": 48.8,
  "padM": 110,
  "frontageBearing": 102.5,
  "rotation": 0.2181661564992912,
  "terrainPad": {
    "rings": [
      [
        [
          12.5062998,
          41.8862682
        ],
        [
          12.5063617,
          41.8862766
        ],
        [
          12.5063853,
          41.8862048
        ],
        [
          12.5064485,
          41.8859916
        ],
        [
          12.5065319,
          41.8857071
        ],
        [
          12.5064463,
          41.8856933
        ],
        [
          12.5063642,
          41.8856799
        ],
        [
          12.5064166,
          41.8855013
        ],
        [
          12.5061787,
          41.8854627
        ],
        [
          12.5061716,
          41.8854868
        ],
        [
          12.5060509,
          41.8854671
        ],
        [
          12.5061062,
          41.8852789
        ],
        [
          12.5057224,
          41.8852163
        ],
        [
          12.5052715,
          41.8851403
        ],
        [
          12.5051724,
          41.8854663
        ],
        [
          12.5048186,
          41.8854067
        ],
        [
          12.5047683,
          41.8855627
        ],
        [
          12.5046398,
          41.8860023
        ],
        [
          12.5047276,
          41.8860166
        ],
        [
          12.5050156,
          41.8860642
        ],
        [
          12.5049907,
          41.8861478
        ],
        [
          12.5051827,
          41.8861794
        ],
        [
          12.5053706,
          41.8862104
        ],
        [
          12.505402,
          41.886105
        ],
        [
          12.5057398,
          41.8861608
        ],
        [
          12.5057064,
          41.8862729
        ],
        [
          12.5059265,
          41.8863092
        ],
        [
          12.5059131,
          41.8863543
        ],
        [
          12.5060882,
          41.8863831
        ],
        [
          12.5061342,
          41.8862403
        ],
        [
          12.5062998,
          41.8862682
        ]
      ]
    ],
    "refs": [
      [
        12.505592,
        41.8858502
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#d5cebd",
    "masonry": "#b9a58a",
    "roof": "#846f5d",
    "glass": "#4c5b5b",
    "shadow": "#45483f",
    "metal": "#777971"
  },
  "dark": {
    "stone": "#848075",
    "masonry": "#736656",
    "roof": "#52453a",
    "glass": "#2f3838",
    "shadow": "#2b2d27",
    "metal": "#4a4b46"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "The ownership envelope is the basilica relation only; adjoining Lateran Palace, detached baptistery, obelisk and Scala Santa are excluded. Open arcaded east and north facades have real cutouts in both LODs. Fifteen statues use planted legs, robed bodies, heads and articulated arms. Nave, lower aisles, cloister courts and chapel roof masses are simplified to map-scale architecture; individual reliefs, mosaic/inscription detail, interior artwork and lettering are omitted. Saint heights are sourced at 7 m; other vertical stage heights and dome/spire dimensions are explicit photo estimates. Rigid local y=0 has no baked hill. Relation member geometry recovered from the OSM full API after the serialized Overpass dossier attempts timed out. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
