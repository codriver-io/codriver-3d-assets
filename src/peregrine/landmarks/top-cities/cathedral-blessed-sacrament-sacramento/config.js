import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "cathedral-blessed-sacrament-sacramento",
  "name": "Cathedral of the Blessed Sacrament",
  "kind": "building",
  "ready": true,
  "origin": [
    -121.49199924999999,
    38.579004749999996
  ],
  "height": 65.53,
  "widthM": 39,
  "depthM": 70,
  "padM": 45,
  "frontageBearing": 288.4448901119935,
  "rotation": 4.390464917761857,
  "controlPoints": [
    [
      -121.4917031,
      38.5788283
    ],
    [
      -121.4916147,
      38.5790355
    ]
  ],
  "terrainPad": {
    "rings": [
      [
        [
          -121.4919872,
          38.579096
        ],
        [
          -121.4920615,
          38.5791142
        ],
        [
          -121.4920446,
          38.5791565
        ],
        [
          -121.4921937,
          38.5791929
        ],
        [
          -121.4921854,
          38.5792136
        ],
        [
          -121.4922538,
          38.5792304
        ],
        [
          -121.4922697,
          38.5791924
        ],
        [
          -121.4922975,
          38.5791871
        ],
        [
          -121.492307,
          38.579177
        ],
        [
          -121.4923208,
          38.5791449
        ],
        [
          -121.4923351,
          38.5791114
        ],
        [
          -121.4923459,
          38.5790863
        ],
        [
          -121.4923623,
          38.579048
        ],
        [
          -121.4923769,
          38.579014
        ],
        [
          -121.492383,
          38.5789997
        ],
        [
          -121.4923793,
          38.5789832
        ],
        [
          -121.492366,
          38.5789735
        ],
        [
          -121.4923838,
          38.5789305
        ],
        [
          -121.4923135,
          38.5789128
        ],
        [
          -121.4923063,
          38.5789303
        ],
        [
          -121.4920853,
          38.5788746
        ],
        [
          -121.492097,
          38.5788462
        ],
        [
          -121.4918562,
          38.5787855
        ],
        [
          -121.4918462,
          38.5788098
        ],
        [
          -121.4917242,
          38.5787791
        ],
        [
          -121.4917031,
          38.5788283
        ],
        [
          -121.4916147,
          38.5790355
        ],
        [
          -121.4917062,
          38.5790579
        ],
        [
          -121.4916983,
          38.5790772
        ],
        [
          -121.4917373,
          38.579087
        ],
        [
          -121.4917319,
          38.5791
        ],
        [
          -121.4918042,
          38.5791181
        ],
        [
          -121.4918016,
          38.5791246
        ],
        [
          -121.4918944,
          38.5791475
        ],
        [
          -121.4918971,
          38.5791409
        ],
        [
          -121.4919628,
          38.579157
        ],
        [
          -121.4919872,
          38.579096
        ]
      ],
      [
        [
          -121.49228990565753,
          38.579217842629745
        ],
        [
          -121.49239534032769,
          38.578970715212805
        ],
        [
          -121.49244112339338,
          38.57898265240231
        ],
        [
          -121.49233568872322,
          38.57922977981925
        ],
        [
          -121.49228990565753,
          38.579217842629745
        ]
      ]
    ],
    "refs": [
      [
        -121.49199924999999,
        38.579004749999996
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#bbb9a6",
    "trim": "#d4d0bd",
    "roof": "#696d60",
    "glass": "#4c5b58",
    "dark": "#383e39",
    "metal": "#999c94",
    "accent": "#a99365",
    "base": "#a19f92",
    "gold": "#ad9b57"
  },
  "dark": {
    "stone": "#7a786c",
    "trim": "#8a877b",
    "roof": "#44473e",
    "glass": "#313b39",
    "dark": "#242825",
    "metal": "#636560",
    "accent": "#6e6042",
    "base": "#69675f",
    "gold": "#706539"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Mapped cathedral only; rectory437894391 excluded. Exterior sources correct the initial shorthand: one tall central bell tower and two smaller corner towers, with a grey restored dome (not twin equal towers/red roof). Published tallest-spire215ft vs restoration supplier217ft/OSM66m are inconsistent, so65.53m is adopted as an approximate estimate; intermediate facade/tower levels and dome175ft estimate are photo fitted. Both LODs retain the open belfry, clocks, rose, arched portals, lesser towers, dome ribs and open lantern. Highest central cross65.53m, dome cross53.34m. Stair first tread0.2m; terrain and surrounding square excluded. No letters, logos, interior artwork or scans. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
