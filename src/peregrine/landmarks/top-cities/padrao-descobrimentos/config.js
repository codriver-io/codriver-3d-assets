// Original procedural exterior of the Padrão dos Descobrimentos: a 52 m central sail/mast with two curved flanking sail fins, a rising pointed caravel hull, two processions of sixteen robed human figures, and a larger leading Henry holding a miniature caravel.
export const SPEC = {
  "id": "padrao-descobrimentos",
  "name": "Padrão dos Descobrimentos",
  "kind": "building",
  "ready": true,
  "origin": [
    -9.2057,
    38.6936
  ],
  "height": 52,
  "padM": 32,
  "frontageBearing": 166,
  "rotation": 0.24187725539866378,
  "terrainPad": {
    "rings": [
      [
        [
          -9.205856,
          38.6937457
        ],
        [
          -9.205771,
          38.6937606
        ],
        [
          -9.2057766,
          38.6937803
        ],
        [
          -9.2057492,
          38.6937851
        ],
        [
          -9.2057192,
          38.6937904
        ],
        [
          -9.2057137,
          38.6937713
        ],
        [
          -9.2056307,
          38.6937858
        ],
        [
          -9.2055844,
          38.6936252
        ],
        [
          -9.2055873,
          38.6934929
        ],
        [
          -9.2056104,
          38.6933983
        ],
        [
          -9.2056543,
          38.6933898
        ],
        [
          -9.2057374,
          38.6934716
        ],
        [
          -9.2058099,
          38.6935856
        ],
        [
          -9.205856,
          38.6937457
        ]
      ]
    ],
    "refs": [
      [
        -9.2057,
        38.6936
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#d0c9b8",
    "carving": "#c3baa5",
    "boat": "#b4aa93",
    "shadow": "#8e887a"
  },
  "dark": {
    "stone": "#817d72",
    "carving": "#797366",
    "boat": "#70695b",
    "shadow": "#58544c"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Permanent 1960 monument, not the temporary 1940 exhibition construction. The upper 52 m mast footprint and river-facing bearing are mapped. Two lower curved fins and rising hull profile are original map-scale approximations from exterior photos. Both sixteen-person flanks, distinct robed bodies, neck/head contacts and the leading Henry with a small caravel remain in both LODs. Fine facial likeness, heraldic shield/inscriptions, pavement wind rose/map mosaic, river surface and interiors are omitted. Official 52 m is adopted; the 56 m in one photograph’s filename is not treated as a measurement. No imported sculpture mesh, photo tracing, image texture or lettering. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
