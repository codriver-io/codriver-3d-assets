// Original procedural exterior of the Palazzo della Civiltà Italiana: a travertine cube with exactly six tiers of nine open round arches on each face, deep shaded galleries, recessed glazing and simplified human allegory statues at the ground arcade.
export const SPEC = {
  "id": "palazzo-civilta-italiana",
  "name": "Palazzo della Civiltà Italiana",
  "kind": "building",
  "ready": true,
  "origin": [
    12.465321475,
    41.8367058
  ],
  "height": 54,
  "padM": 43,
  "frontageBearing": 180,
  "rotation": -0.36400580684708395,
  "terrainPad": {
    "rings": [
      [
        [
          12.4649216,
          41.8365763
        ],
        [
          12.4651386,
          41.8370007
        ],
        [
          12.4657213,
          41.8368353
        ],
        [
          12.4655044,
          41.8364109
        ],
        [
          12.4649216,
          41.8365763
        ]
      ]
    ],
    "refs": [
      [
        12.465321475,
        41.8367058
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#d4d0c3",
    "glass": "#465453",
    "roof": "#999a92",
    "shadow": "#444b45"
  },
  "dark": {
    "stone": "#838179",
    "glass": "#2b3433",
    "roof": "#5f5f5b",
    "shadow": "#2a2f2b"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "The six-by-nine open arcades are real geometric holes in both LODs. Inner glazing is recessed well behind the galleries; floor slabs meet the wall piers. Sculptures inside the ground arcade are grouped human figures. Lettering, branding, terrace Dioscuri, broad downhill stair terraces, landscape and interiors are omitted. Published cube height about 60 m and OSM height=68 disagree; different sloping-site and plinth datums may explain this (inference, not surveyed); 54 m above the upper entrance datum is a photo-calibrated cube-height estimate, not a survey; the published 60 m and mapped 68 m are retained as conflicting whole-building/site figures. Mapped inner way 110401782 defines the approximately 9.7 × 16.3 m open lightwell, including its stone attic linings. OSM relation fetched with the OSM single-object full API to recover missing member rings. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
