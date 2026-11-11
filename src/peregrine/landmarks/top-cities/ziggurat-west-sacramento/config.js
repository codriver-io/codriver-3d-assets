import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  "id": "ziggurat-west-sacramento",
  "name": "The Ziggurat",
  "kind": "building",
  "ready": true,
  "origin": [
    -121.50961964999999,
    38.58288675
  ],
  "height": 48,
  "widthM": 84,
  "depthM": 94,
  "padM": 71,
  "frontageBearing": 278.6975,
  "rotation": 2.9897934279361635,
  "controlPoints": [
    [
      -121.5092265,
      38.5824176
    ],
    [
      -121.5101748,
      38.582531
    ]
  ],
  "terrainPad": {
    "rings": FOOTPRINTS,
    "refs": [
      [
        -121.50961964999999,
        38.58288675
      ]
    ],
    "datum": "median",
    "featherM": 2
  }
};
export const PALETTES = {
  "light": {
    "stone": "#c1b591",
    "trim": "#d0c5a5",
    "roof": "#9c9b83",
    "glass": "#656f6b",
    "dark": "#363b38",
    "metal": "#999c94",
    "accent": "#a99365",
    "joint": "#a89f84"
  },
  "dark": {
    "stone": "#7d765e",
    "trim": "#87806b",
    "roof": "#656555",
    "glass": "#424846",
    "dark": "#232624",
    "metal": "#636560",
    "accent": "#6e6042",
    "joint": "#6d6756"
  }
};
export const MANIFEST = {
  "elevationDatum": "Local y=0 is one rigid exterior foundation plane; no terrain, sea-level height or Mercator stretch baked into geometry.",
  "attribution": "Original procedural geometry for Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  "note": "Only the ten occupied stepped office tiers and roof cap; adjacent parking garage, freestanding seal, plaza, flags and signage excluded. LOC and City planning identify ten storeys, while structural consultant Miyamoto calls it11storey; ten mapped floor tiers plus service cap reconcile these conventions but are not a measured count of interior floors.48m is an OSM/photo estimate, not a published survey. Literal ten OSM building-part outlines preserve stepped entrance recesses and the curved second-floor edge. Terraces and overhang soffits use polygon differences so no hidden full roof planes overlap. Ground model meets y=0; no separate pavement surface. Mapped yaw is baked once from two OSM control points. Cityscape: not tested; Full 3D world: not tested."
};
