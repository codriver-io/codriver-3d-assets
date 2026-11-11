// The actual Medellín Bancolombia Dirección General: two exceptionally long twelve-floor limestone-and-glass blocks, staggered vertical slot facades, glazed end walls and two stacked high glass links across the open central gap.
export const SPEC = {
  "id": "bancolombia-medellin",
  "name": "Bancolombia headquarters",
  "kind": "building",
  "ready": true,
  "origin": [
    -75.57516455,
    6.2285003
  ],
  "height": 49.8,
  "padM": 450,
  "frontageBearing": 180,
  "rotation": 1.4442655510601783,
  "terrainPad": {
    "rings": [
      [
        [
          -75.57549296979964,
          6.226752464092167
        ],
        [
          -75.57527733133934,
          6.228437590480082
        ],
        [
          -75.57497523738361,
          6.228399387837119
        ],
        [
          -75.5751908758439,
          6.226714261449204
        ],
        [
          -75.57549296979964,
          6.226752464092167
        ]
      ],
      [
        [
          -75.57520460007278,
          6.2288422294812005
        ],
        [
          -75.57502123325936,
          6.230275166145276
        ],
        [
          -75.57479443868726,
          6.230246485822814
        ],
        [
          -75.57497780550067,
          6.228813549158739
        ],
        [
          -75.57520460007278,
          6.2288422294812005
        ]
      ]
    ],
    "refs": [
      [
        -75.57523376302626,
        6.2276035021858664
      ],
      [
        -75.57501221986625,
        6.229477141914088
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#bdb8a9",
    "trim": "#8d9692",
    "glass": "#496366",
    "metal": "#45545a",
    "roof": "#7a817a",
    "shadow": "#414b49"
  },
  "dark": {
    "stone": "#757269",
    "trim": "#575d5b",
    "glass": "#2d3d3f",
    "metal": "#2b3438",
    "roof": "#4c504c",
    "shadow": "#282f2d"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "The initial dossier photos1/2 show unrelated bank buildings and are rejected;3 is a remote fireworks view,9/10 show the Metro station rather than useful facade detail. References11/12 from the project supervisor plus4/5 modern Commons streets establish this actual complex. The single OSM outline includes two grounded blocks connected only at upper floors; the model and terrain pad preserve the central ground-level void. Pad rings cover only the two actual grounded blocks. Glazed links are stacked above the central gap, not road-carrying bridges, and no road layer is written. Their deck and roof member contacts are tested against actual building floor geometry excluding the member. Main heights49.8m and deck elevations are explicit photo estimates based on12storeys; the long mapped blocks have varying depth, simplified within about2m. Repeated pale stone strips, inset green-grey glass, lower ventilation bands and transparent-looking glazed end bays supply recognition without any bank logo, lettering or copied textures. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
