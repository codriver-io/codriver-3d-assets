// Heredia’s small Fortín: curved-cornice square stone base, cylindrical brick loophole drum and octagonal clover-window crown with the modern open roof guard.
export const SPEC = {
  "id": "fortin-heredia",
  "name": "El Fortín",
  "kind": "building",
  "ready": true,
  "origin": [
    -84.117084,
    9.999245
  ],
  "height": 13.9,
  "padM": 18,
  "frontageBearing": 180,
  "rotation": 3.094309721466101,
  "terrainPad": {
    "rings": [
      [
        [
          -84.11704580652031,
          9.999203650289079
        ],
        [
          -84.1171259874993,
          9.999207386677687
        ],
        [
          -84.1171221934797,
          9.999286349710921
        ],
        [
          -84.1170420125007,
          9.999282613322313
        ],
        [
          -84.11704580652031,
          9.999203650289079
        ]
      ]
    ],
    "refs": [
      [
        -84.117084,
        9.999245
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#8d8673",
    "brick": "#9c7962",
    "trim": "#c4bca5",
    "metal": "#4d686c",
    "rail": "#4d686c",
    "shadow": "#474840"
  },
  "dark": {
    "stone": "#575347",
    "brick": "#614b3d",
    "trim": "#7a7566",
    "metal": "#304043",
    "rail": "#304043",
    "shadow": "#2c2d28"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Mapped alignment is the north–south western boundary of Parque El Fortín, OSMway194486604; this is NOT claimed as the tower footprint. A bounded authored8.8m square is placed at the published tower coordinate and aligned to those two real park control points. A nearby round OSMbuilding463534763 is the amphitheatre, and survey point13853504346 lies near it; neither is misidentified as this tower. Absolute placement is approximate within a few metres and must be checked in the later app pass. The13m heritage masonry height and13.24m municipal figure are both documented, with13m adopted as an estimate. The modern roof guard is modeled separately above that datum. Four alternating loophole rows, flared pale embrasures and octagonal clover openings remain geometric. Historic photos without modern roof guard are excluded from current-state comparison; surface weathering is represented only by muted colours, not texture or excessive bricks. No busts, flags, letters, garden or unrelated park structures are included. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
