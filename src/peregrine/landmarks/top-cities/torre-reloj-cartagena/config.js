// Cartagena’s Puerta del Reloj: three true barrel-vault gate passages, exposed stone outer portal and ochre inner wall, four-face clock stage, louvered octagonal lantern and long slender pale-edged spire.
export const SPEC = {
  "id": "torre-reloj-cartagena",
  "name": "Torre del Reloj",
  "kind": "building",
  "ready": true,
  "origin": [
    -75.54921895,
    10.4230397
  ],
  "height": 31.5,
  "padM": 85,
  "frontageBearing": 180,
  "rotation": 0.9595076826338546,
  "terrainPad": {
    "rings": [
      [
        [
          -75.5494189,
          10.422881
        ],
        [
          -75.5493118,
          10.4230312
        ],
        [
          -75.5492695,
          10.4230906
        ],
        [
          -75.5492337,
          10.4231409
        ],
        [
          -75.5491355,
          10.4232787
        ],
        [
          -75.549019,
          10.4231984
        ],
        [
          -75.5490824,
          10.4231095
        ],
        [
          -75.5491158,
          10.4230623
        ],
        [
          -75.5491337,
          10.4230375
        ],
        [
          -75.5491565,
          10.4230055
        ],
        [
          -75.549176,
          10.4229781
        ],
        [
          -75.5491857,
          10.4229645
        ],
        [
          -75.5491959,
          10.4229501
        ],
        [
          -75.5492394,
          10.4228891
        ],
        [
          -75.5493024,
          10.4228007
        ],
        [
          -75.5494189,
          10.422881
        ]
      ]
    ],
    "refs": [
      [
        -75.54921895,
        10.4230397
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#b4aa91",
    "yellow": "#c4aa64",
    "trim": "#d6d0b9",
    "shadow": "#4c5045",
    "clock": "#e0dac5",
    "metal": "#626956"
  },
  "dark": {
    "stone": "#70695a",
    "yellow": "#7a693e",
    "trim": "#858173",
    "shadow": "#2f322b",
    "clock": "#8b877a",
    "metal": "#3d4135"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Photo1 faces the exposed-stone outer gateway, whereas photo2 shows the ochre-plastered inner face: these are two sides of the SAME current building, not alternative paint schemes. The OSM gate rectangle fixes length, depth and geographic bearing. Three arches are cut all the way through the15.6m-deep gate, retaining real barrel vaults and solid separating piers. The stone Baroque outer pediment and simpler yellow rear pediment are original simplified geometry. The octagonal clock body, pointed white shutters, lantern crown triangles and thin spire remain in both LODs. All vertical dimensions are estimates; the municipality reports only over30m rather than a survey, so31.5m is adopted with that uncertainty. No neighboring yellow houses, plaza statue, paving, signs, clock numerals or compass letters are included. Clock dials have abstract ticks/hands without lettering. No source photo textures are shipped. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
