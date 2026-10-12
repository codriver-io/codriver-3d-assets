// Canada Olympic Park ski jumps, 88 Canada Olympic Road SW, Calgary (1986, for the 1988 Winter Olympics; closed 2018).
// The 90 m (K114) tower and inrun and the 70 m (K89) tower and inrun side by side on the Paskapoo Slopes, facing the
// Trans-Canada Highway to the north-north-east, plus the K63 and K38 training hills east of them. Sourced: the 58 m tower (Heritage Calgary), the inrun profiles (length,
// angles, take-off length and height, skisprungschanzen.com), cast-in-place concrete towers and steel inrun structures
// (CANA). Estimated from photographs: the tower massing, windows, supports. See docs/3d-calgary-canada-olympic-park.md.
//
// Origin: centre of the 90 m tower head, on the K114 axis (aerial imagery; the OSM inrun ways are coarse, see footprint.js).
// y = 0 is the ground at the K89 take-off edge, the complex's lowest footing; the plan explains the frame.
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { hillHeight, JUMPS, TOWER90, inrunProfile, jumpPoint } from './canada-olympic-park-plan.js';

const ORIGIN = [-114.2128861, 51.0767341];
// Local (x east, z south) → [lng, lat], rounded to 1e-7 deg.
const lngLat = ([x, z]) => {
  const s = mercStretch(ORIGIN[1]), r7 = (v) => Math.round(v * 1e7) / 1e7;
  return [r7(mercXToLng(lngToMercX(ORIGIN[0]) + x * s)), r7(mercYToLat(latToMercY(ORIGIN[1]) - z * s))];
};
// Rigid authored landscape: local zero is the lower K89 outrun. Four small
// take-off terraces meet the model's relative hill heights; the wider authored
// slope feathers to grade instead of an exposed retaining pad.
const k89 = JUMPS.k89, p89 = inrunProfile(k89), at89 = (u, v) => lngLat(jumpPoint(k89, p89, u, v));
const terraces = [];
// Only lower terrain immediately beneath the authored landform. Small local
// tables sample the LOWEST corner of each patch, so their ground is always
// hidden under the curved grass skin; no all-site trench or plateau cut.
for (let x=-70;x<150;x+=25) for(let z=-270;z<120;z+=25) {
  const ring=[[x,z],[x+25,z],[x+25,z+25],[x,z+25]];
  const floor=Math.min(...ring.map(([x,z])=>hillHeight(x,z)));
  if(floor<3)continue;
  terraces.push({ring:ring.map(lngLat),offsetM:floor-2,featherM:18});
}
const TERRAIN_PAD = {
  rings: [[at89(p89.uT+112,-8),at89(p89.uT+128,-8),at89(p89.uT+128,8),at89(p89.uT+112,8)]],
  refs: [at89(p89.uT+120,-3),at89(p89.uT+120,3)],
  datum:'median',featherM:8,terraces,
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
  elevationDatum: 'Local y=0 is the lower K89 landing outrun. K89 take-off is +35 m, K114 +39.2 m, and K114 tower ground +60.5 m. The added 35 m landing relief is photo-estimated; tower/inrun relative dimensions are preserved. Every support reaches local grade and is embedded in the authored hill. Full 3D world samples the lower K89 outrun with median datum and small local terraces beneath the authored hill, each held below its lowest mesh corner; no sea-level or scene stretch is baked in.',
  attribution: 'Original procedural mesh. Mapped inrun and start-house outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the 58 m tower (Heritage Calgary), the K114 and K89 inrun lengths, angles, take-off lengths and heights (skisprungschanzen.com), cast-in-place concrete towers with steel inrun structures (CANA). Estimated: the tower plans, storey, window and ring heights, the head taper, the transition radii (FIS rule), the pier and trestle positions, the 70 m and K63 towers, the whole K63 and K38 profiles, and the plan positions and bearings (aerial imagery; the OSM ways are coarse). Ground heights between parts come from a public 12 m DEM and are good to a few metres. Authored rounded landing hills and 35 m outrun relief are photo estimates; the K20/K10 hills, the judges towers, floodlights and the zipline are not modelled.',
};
