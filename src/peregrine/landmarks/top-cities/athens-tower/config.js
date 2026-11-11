// Athens Tower’s unequal103m and65m office blocks: six strong pale vertical bays on the tall slab, a bent lower tower, dark recessed curtain walls, three-storey base and the mapped first-floor link.
export const SPEC = {
  "id": "athens-tower",
  "name": "Athens Tower",
  "kind": "building",
  "ready": true,
  "origin": [
    23.76071,
    37.9845
  ],
  "height": 112,
  "padM": 130,
  "frontageBearing": 180,
  "rotation": 0.44248480709221505,
  "terrainPad": {
    "rings": [
      [
        [
          23.7605159,
          37.9848027
        ],
        [
          23.7607261,
          37.9848812
        ],
        [
          23.7607987,
          37.9847603
        ],
        [
          23.760883,
          37.9847918
        ],
        [
          23.7610924,
          37.9844433
        ],
        [
          23.7607978,
          37.9843333
        ],
        [
          23.7607657,
          37.9843869
        ],
        [
          23.7607538,
          37.9844066
        ],
        [
          23.7607505,
          37.9844122
        ],
        [
          23.7605159,
          37.9848027
        ]
      ],
      [
        [
          23.7606268,
          37.9843968
        ],
        [
          23.7606432,
          37.9843653
        ],
        [
          23.760655,
          37.9843456
        ],
        [
          23.760687,
          37.9842853
        ],
        [
          23.7605319,
          37.9842255
        ],
        [
          23.7604158,
          37.984109
        ],
        [
          23.7602913,
          37.9841914
        ],
        [
          23.7604327,
          37.9843244
        ],
        [
          23.7606268,
          37.9843968
        ]
      ]
    ],
    "refs": [
      [
        23.76071,
        37.9845
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c4c0af",
    "glass": "#4a5960",
    "spandrel": "#626361",
    "metal": "#969e9d",
    "roof": "#6b7371",
    "shadow": "#3b4345",
    "antenna": "#9b7d72"
  },
  "dark": {
    "stone": "#7a776d",
    "glass": "#2e373c",
    "spandrel": "#3d3d3c",
    "metal": "#5d6261",
    "roof": "#424746",
    "shadow": "#252a2b",
    "antenna": "#604e47"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Architect Ioannis Vikelas explicitly describes two unequal towers, a zig-zag lower volume, three-storey base and first-floor communication. The source photos confirm six major bays on the main long face, continuous pale perimeter piers and fine vertical metal mullions around blue-grey glazing. Main103m and lower65m architectural heights follow CVU; a Wikipedia claim of under100m without antennas is not adopted, since CVU explicitly excludes technical antennas from architectural height. Visible rooftop radio equipment is separately estimated up to112m. Upper main footprint is inferred from the mapped podium recesses; the lower tower keeps its mapped bent outline rather than becoming a rectangular slab. Floor counts may vary with mezzanine treatment; facade rhythm is calibrated to the exterior and grouped at far. The two ground pads stay separate, with an elevated enclosed first-floor link at the mapped2.43m corridor. No plaza paving, flags, signage, bank marks or rooftop lettering are included. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
