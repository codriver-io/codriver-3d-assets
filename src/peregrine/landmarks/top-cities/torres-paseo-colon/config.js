// Twin Paseo Colón towers with taller north block, repeated rounded western balconies, pale blank end walls, blue glazed lower offices and adjoining low parking podiums.
export const SPEC = {
  "id": "torres-paseo-colon",
  "name": "Torres Paseo Colón",
  "kind": "building",
  "ready": true,
  "origin": [
    -84.0909796625,
    9.935691825
  ],
  "height": 101.4,
  "padM": 120,
  "frontageBearing": 180,
  "rotation": -0.09706564671743219,
  "terrainPad": {
    "rings": [
      [
        [
          -84.09125,
          9.9353278
        ],
        [
          -84.0907862,
          9.9353186
        ],
        [
          -84.0907575,
          9.9355961
        ],
        [
          -84.0912173,
          9.9356402
        ],
        [
          -84.09125,
          9.9353278
        ]
      ],
      [
        [
          -84.0907411,
          9.9357529
        ],
        [
          -84.0907124,
          9.9360276
        ],
        [
          -84.0911719,
          9.9360742
        ],
        [
          -84.0912009,
          9.9357972
        ],
        [
          -84.0907411,
          9.9357529
        ]
      ]
    ],
    "refs": [
      [
        -84.0909796625,
        9.935691825
      ]
    ],
    "datum": "median",
    "featherM": 3
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c4c5be",
    "trim": "#a9ada8",
    "glass": "#49616c",
    "shadow": "#424d50",
    "metal": "#737e81",
    "rail": "#9aa5a6",
    "roof": "#838b88"
  },
  "dark": {
    "stone": "#7a7a76",
    "trim": "#696b68",
    "glass": "#2d3c43",
    "shadow": "#293032",
    "metal": "#474e50",
    "rail": "#5f6667",
    "roof": "#515654"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is the rigid exterior foundation at grade. Real metres; no terrain height, sea level or Mercator stretch baked in.",
  "attribution": "Original procedural geometry for Codriver; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Two independently mapped podiums keep the open gap between the towers. Each high-rise occupies the western part of its larger podium, with inset dark glass behind curved balcony slabs and supported railings. TowerI has nineteen residential balcony levels above nine office/podium levels; TowerII has twenty-one. UCR heights98.2/101.4m are approximate and conflict with rounded97/101m; these are adopted exterior estimates, not surveyed heights. Far retains every balcony level and the stepped crowns, with fewer curved segments and simplified rail posts. Parking facades, rear service rooms and roof details are approximated from available exteriors. No shop signs, branding or copied glazing textures. Geographic rotation is baked once from mapped controls. Cityscape: not tested. Full 3D world: not tested."
};
