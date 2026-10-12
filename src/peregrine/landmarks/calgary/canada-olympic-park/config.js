// Canada Olympic Park ski jumps, 88 Canada Olympic Road SW, Calgary (1986, for the 1988 Winter Olympics; closed 2018).
// The 90 m (K114) tower and inrun and the 70 m (K89) tower and inrun side by side on the Paskapoo Slopes, facing the
// Trans-Canada Highway to the north-north-east, plus the K63 and K38 training hills east of them. Sourced: the 58 m tower (Heritage Calgary), the inrun profiles (length,
// angles, take-off length and height, skisprungschanzen.com), cast-in-place concrete towers and steel inrun structures
// (CANA). Estimated from photographs: the tower massing, windows, supports. See docs/3d-calgary-canada-olympic-park.md.
//
// Origin: centre of the 90 m tower head, on the K114 axis (aerial imagery; the OSM inrun ways are coarse, see footprint.js).
// Cityscape local zero is the lower K89 outrun; world uses its measured DEM datum. See the plan and survey table.
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { JUMPS, TOWER90, inrunProfile, jumpPoint } from './canada-olympic-park-plan.js';

import { DEM, GROUND_TRIM } from './canada-olympic-park-dem.js';

const ORIGIN = [-114.2128861, 51.0767341];
// Local (x east, z south) → [lng, lat], rounded to 1e-7 deg.
const lngLat = ([x, z]) => {
  const s = mercStretch(ORIGIN[1]), r7 = (v) => Math.round(v * 1e7) / 1e7;
  return [r7(mercXToLng(lngToMercX(ORIGIN[0]) + x * s)), r7(mercYToLat(latToMercY(ORIGIN[1]) - z * s))];
};
// World datum stays at the lower K89 outrun. Tiny node-centred rings trim
// only 0.15 m from the app's resident TIN at the site, rather than
// carving constant-height patches through a slope. Survey has a full cell halo.
const k89=JUMPS.k89,p89=inrunProfile(k89),at89=(u,v)=>lngLat(jumpPoint(k89,p89,u,v));
const terraces=[];
for(let j=0;j<DEM.heights.length;j++)for(let i=0;i<DEM.heights[0].length;i++) {
  const x=((DEM.i0+i)*DEM.step-DEM.ox)/DEM.s,z=(DEM.oy-(DEM.j0+j)*DEM.step)/DEM.s;
  if(x < -110 || x > 195 || z < -320 || z > 175)continue;
  terraces.push({ring:[[x-1,z-1],[x+1,z-1],[x+1,z+1],[x-1,z+1]].map(lngLat),offsetM:DEM.heights[j][i]-GROUND_TRIM,featherM:1});
}
const TERRAIN_PAD={
  rings:[[at89(p89.uT+119,-1),at89(p89.uT+121,-1),at89(p89.uT+121,1),at89(p89.uT+119,1)]],
  refs:[at89(p89.uT+120,-3),at89(p89.uT+120,3)],
  datum:'median',featherM:1,terraces,
};
export const SPEC = {
  id: 'canada-olympic-park', name: 'Canada Olympic Park ski jumps', kind: 'building',
  ready: true, // exported, checked against photographs and in the app, catalogued
  origin: ORIGIN,
  height: Math.round((TOWER90.roof + TOWER90.mast.top) * 10) / 10, // top of the antenna mast on the 90 m tower
  padM: 140, // unused while terrainPad is set; would cover the complex from the tower to the K89 take-off
  frontageBearing: JUMPS.k114.bearing, // the jumps face the Trans-Canada Highway, downhill to the north-north-east
  rangeM: 4000, // a skyline structure on a hill above the highway: draw it from 4 km
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
};
export const PALETTES = {
  light: {
    grass: '#63794c', concrete: '#bdbbb2', clad: '#bcbbb5', track: '#a9b0b4', steel: '#64686b', glass: '#4d727b', // clad -15 %: mid-grey cladding, not white; steel -25 %: the dark soffit
    ringBlue: '#0a81c4', ringYellow: '#f2ac2c', ringBlack: '#2a2a2a', ringGreen: '#14a050', ringRed: '#e23a4f',
  },
  dark: {
    grass: '#354d37', concrete: '#6e7178', clad: '#73767b', track: '#596066', steel: '#393d41', glass: '#22303a',
    ringBlue: '#0b5c8c', ringYellow: '#a87a22', ringBlack: '#1b1b1c', ringGreen: '#11703b', ringRed: '#9c2b3a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Cityscape preserves the authored flat geometry and photo-estimated 35 m landing relief. Both world LODs use the native DEM hillside and conceal authored grass at least 2.6 m beneath both surveyed TINs, avoiding hillside colour changes at the near/far switch. World uses the surveyed lower K89 outrun datum (1166.2831 m AWS Terrarium, z13 DEM on the app z14 TIN; z15 cross-check). Precomputed relative heights drive rigid take-off assembly levels and individual footing depths through reversible terrainOffsets. World take-offs: K89 +25.9973 m, K114 +30.2293 m. Tower/inrun relative dimensions remain rigid, including the sourced 58 m tower; near supports terminate 1 m beneath surveyed z13 ground, far supports beneath the lower of near and regional TINs. Tiny node-centred terrain terraces trim only 0.15 m; edges follow the DEM. No scene stretch or runtime DEM dependency enters the generator.',
  attribution: 'Original procedural mesh. Mapped inrun and start-house outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright. Terrain Tiles accessed 2026-10-12 from https://registry.opendata.aws/terrain-tiles/. Canada terrain data contains information licensed under the Open Government Licence – Canada.',
  note: 'Sourced: the 58 m tower (Heritage Calgary), the K114 and K89 inrun lengths, angles, take-off lengths and heights (skisprungschanzen.com), cast-in-place concrete towers with steel inrun structures (CANA). Estimated: the tower plans, storey, window and ring heights, the head taper, the transition radii (FIS rule), the pier and trestle positions, the 70 m and K63 towers, the whole K63 and K38 profiles, and the plan positions and bearings (aerial imagery; the OSM ways are coarse). World ground heights come from an offline AWS Terrarium z13 TIN survey with z15 cross-check; Cityscape retains its photo-estimated rounded landform and 35 m relief; the K20/K10 hills, the judges towers, floodlights and the zipline are not modelled.',
};
