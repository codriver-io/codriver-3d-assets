import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "strat-tower-las-vegas",
  "name": "The STRAT Tower",
  "kind": "building",
  "ready": true,
  "origin": [
    -115.15552055,
    36.1474087
  ],
  "height": 350.2,
  "widthM": 56,
  "depthM": 56,
  "padM": 45,
  "frontageBearing": 255.35635454939484,
  "rotation": -1.3152164991871484,
  "controlPoints": [
    [
      -115.1558053,
      36.1473783
    ],
    [
      -115.1557876,
      36.1473236
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -115.15552055,
        36.1474087
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c4bba8",
    "trim": "#d2d0bc",
    "roof": "#8a8d76",
    "glass": "#52615d",
    "dark": "#363b38",
    "metal": "#a7a994",
    "accent": "#a99365",
    "concrete": "#bdb9a4",
    "bronze": "#867b5f",
    "ride": "#886d58",
    "base": "#a5a18e"
  },
  "dark": {
    "stone": "#7f7a6d",
    "trim": "#89877a",
    "roof": "#5a5c4d",
    "glass": "#353f3c",
    "dark": "#232624",
    "metal": "#6d6e60",
    "accent": "#6e6042",
    "concrete": "#7b786b",
    "bronze": "#57503e",
    "ride": "#584739",
    "base": "#6b695c"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Observation tower135457469 only; casino/hotel135456188 and attached entertainment facilities are excluded.350.2m adopted from CTBUH and operator1149ft; all intermediate profile elevations, cross sections and ride-mast dimensions are photo estimates. September2026 Yelderberry photos establish current three-legged exterior;2012 pod detail used only for unchanged glazing/fan structure. Current operator lists Big Shot and X-Scream; removed Insanity/High Roller are excluded, and fine X-Scream/SkyJump hardware is omitted at road scale. Big Shot lattice and antenna retain the tall architectural outline without logos, signs, moving riders or lettering. Main legs and compact lift core stand on y=0, with actual lower openings retained in far; no terrain/plaza baked. Tripod angular phase is a photo estimate from the mapped southerly2026 camera positions; the circular OSM perimeter establishes centre/envelope while its two control points provide the baked geographic frame. Above110m the tapered concrete web joins the legs; their upper outer edges meet the241m fan ring. Wide explicit QA bounds prevent automatic street framing from clipping this350m asset; separate full-height and pod-detail presets supplement the contact sheet. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
