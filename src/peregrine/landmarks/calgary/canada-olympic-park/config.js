// Canada Olympic Park ski jumps, 88 Canada Olympic Road SW, Calgary (1986, for the 1988 Winter Olympics; closed 2018).
// The 90 m (K114) tower and inrun and the 70 m (K89) tower and inrun side by side on the Paskapoo Slopes, facing the
// Trans-Canada Highway to the north-north-east, plus the K63 and K38 training hills east of them. Sourced: the 58 m tower (Heritage Calgary), the inrun profiles (length,
// angles, take-off length and height, skisprungschanzen.com), cast-in-place concrete towers and steel inrun structures
// (CANA). Estimated from photographs: the tower massing, windows, supports. See docs/3d-calgary-canada-olympic-park.md.
//
// Origin: centre of the 90 m tower head, on the K114 axis (aerial imagery; the OSM inrun ways are coarse, see footprint.js).
// y = 0 is the ground at the K89 take-off edge, the complex's lowest footing; the plan explains the frame.
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { JUMPS, TOWER90, inrunProfile, jumpPoint } from './canada-olympic-park-plan.js';

const ORIGIN = [-114.2128861, 51.0767341];
// Local (x east, z south) → [lng, lat], rounded to 1e-7 deg.
const lngLat = ([x, z]) => {
  const s = mercStretch(ORIGIN[1]), r7 = (v) => Math.round(v * 1e7) / 1e7;
  return [r7(mercXToLng(lngToMercX(ORIGIN[0]) + x * s)), r7(mercYToLat(latToMercY(ORIGIN[1]) - z * s))];
};
// Full 3D world (ADR-0045). The default disc would take the LOWEST DEM sample under it and flatten a pit round the tower.
// The complex is instead hung from ONE point: the group's y = 0 is the DEM at the K89 take-off edge (median of four
// samples 2 m round it), and the only ring held at that datum is the K89 take-off table's own footprint, with a 4 m
// feather. Everything else keeps the DEM: the hill rises round the uphill supports and hides them below their real
// ground, so no pit, no mound and no terrace is needed (measured: docs/3d-calgary-canada-olympic-park.md, Placement).
const k89 = JUMPS.k89, p89 = inrunProfile(k89), at89 = (u, v) => lngLat(jumpPoint(k89, p89, u, v));
const TERRAIN_PAD = {
  rings: [[at89(p89.uT - 8, -2.4), at89(p89.uT, -2.4), at89(p89.uT, 2.4), at89(p89.uT - 8, 2.4)]],
  refs: [at89(p89.uT - 2, 0), at89(p89.uT, -2), at89(p89.uT + 2, 0), at89(p89.uT, 2)],
  datum: 'median', featherM: 4,
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
    concrete: '#bdbbb2', clad: '#bcbbb5', track: '#a9b0b4', steel: '#64686b', glass: '#4d727b', // clad -15 %: mid-grey cladding, not white; steel -25 %: the dark soffit
    ringBlue: '#0a81c4', ringYellow: '#f2ac2c', ringBlack: '#2a2a2a', ringGreen: '#14a050', ringRed: '#e23a4f',
  },
  dark: {
    concrete: '#6e7178', clad: '#73767b', track: '#596066', steel: '#393d41', glass: '#22303a',
    ringBlue: '#0b5c8c', ringYellow: '#a87a22', ringBlack: '#1b1b1c', ringGreen: '#11703b', ringRed: '#9c2b3a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the ground at the K89 (70 m) take-off edge, the lowest footing of the complex. Every part stands at its height above that point on the Paskapoo Slopes (public DEM: 90 m tower base +25.5 m, 70 m tower base +18.1 m, K114 take-off ground +4.2 m, K63 tower +29.3 m, K38 take-off +11.1 m), and every support and tower shaft continues straight down to y=0, so on the flat Cityscape map the complex stands on y=0 and the shafts below each real ground stand in for the hill. No terrain, sea level or latitude stretch is baked in. Full 3D world: an explicit terrain pad (terrainPad) hangs the group from the DEM at the K89 take-off; only the take-off table footprint is held at that datum and the hill hides the supports below their ground.',
  attribution: 'Original procedural mesh. Mapped inrun and start-house outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the 58 m tower (Heritage Calgary), the K114 and K89 inrun lengths, angles, take-off lengths and heights (skisprungschanzen.com), cast-in-place concrete towers with steel inrun structures (CANA). Estimated: the tower plans, storey, window and ring heights, the head taper, the transition radii (FIS rule), the pier and trestle positions, the 70 m and K63 towers, the whole K63 and K38 profiles, and the plan positions and bearings (aerial imagery; the OSM ways are coarse). Ground heights between parts come from a public 12 m DEM and are good to a few metres. The landing hills (terrain), the K20/K10 hills, the judges towers, floodlights and the zipline are not modelled.',
};
