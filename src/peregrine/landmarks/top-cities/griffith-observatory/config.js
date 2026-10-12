import { FOOTPRINTS } from './footprint.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
export const ORIGIN = [-118.3003684, 34.1184];
export function lngLat(x,z) { const k=mercStretch(ORIGIN[1]);return [mercXToLng(lngToMercX(ORIGIN[0])+x*k),mercYToLat(latToMercY(ORIGIN[1])-z*k)]; }
export function local([lng,lat]) { const k=mercStretch(ORIGIN[1]);return [(lngToMercX(lng)-lngToMercX(ORIGIN[0]))/k,(latToMercY(ORIGIN[1])-latToMercY(lat))/k]; }
// North cornice controls [-118.300702,34.1184279] → [-118.3004807,34.1184277]
// and [-118.3002558,34.1184283] → [-118.3000571,34.1184286]: effectively E/W.
// Walls use the mapped ring directly, all other orientation is baked in.
export const SPEC = {
  id:'griffith-observatory', name:'Griffith Observatory', kind:'building', ready: true,
  origin:ORIGIN, height:23.2, padM:58, frontageBearing:0,
  telescopeDiameterM:9.144, planetariumExteriorDiameterM:24.8,
  terrainPad:{
    rings:[FOOTPRINTS[0]], refs:[[-118.30059,34.1184],[-118.3003684,34.1184],[-118.30015,34.1184]], datum:'median', featherM:14,
    terraces:[
      {ring:[[-38,-8],[38,-8],[38,12],[-38,12]].map(p=>lngLat(...p)),offsetM:0,featherM:12},
      {ring:[[-22,22],[32,22],[32,51],[-22,51]].map(p=>lngLat(...p)),offsetM:0,featherM:14},
    ],
  },
};
export const PALETTES = {
  light:{concrete:'#e1ded3',terrace:'#b8b4a8',copper:'#66594c',patina:'#607f70',bronze:'#4d5145',glow:'#535848'},
  dark:{concrete:'#aaa99f',terrace:'#71766f',copper:'#443d36',patina:'#466c5d',bronze:'#39463e',glow:'#e3bd79'},
};
export const MANIFEST = {
  elevationDatum:'Local y=0 is the north entrance and historic-level promenade footing; rigid model, no hill or sea-level datum baked into GLBs. Explicit median north-entrance pad and south promenade apron are proposed for world integration, which is not tested.',
  attribution:'Original procedural geometry by Codriver. Mapped outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs in ignored scratch only; no external mesh or texture.',
  note:'Mapped footprint and 30-foot solar dome diameter; 75-foot planetarium dimension is INTERNAL, exterior dome estimated 24.8 m. Above-entrance height estimated 23.2 m; OSM height=35.9 is not adopted because its datum is unspecified. Astronomers Monument concrete height 35 feet. Wall heights, pilasters, windows, dome seams, bronze grilles and promenade are photo estimates; no underground extension, landscaping or hill. Runtime terrain contacts and replacement require separate QA.',
};
