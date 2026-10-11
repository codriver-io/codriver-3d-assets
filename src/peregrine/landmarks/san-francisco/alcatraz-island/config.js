// Alcatraz Island, San Francisco Bay: the Main Cellhouse (1912) with its Dining Hall and Administration Block, the 1909
// lighthouse, the Warden's House ruins, the recreation-yard wall and the 1940 Water Tower. See docs/3d-san-francisco-alcatraz-island.md.
// Origin: area centroid of the mapped Main Prison outline (OSM way 128245373). The island grid is turned 45.95 deg off north:
// the mapped cellhouse walls give bearing 135.95 deg for the long axis (two edges, 48.1 m and 48.0 m, both 135.95 / 135.93 deg).
// Authoring frame: u runs along that axis (bearing 135.95, toward the Administration Block and the lighthouse), w runs at right angles
// toward the south-west (bearing 225.95, the long front that looks at San Francisco and the Golden Gate). One rotation onto x/z at the end.
// y = 0 is the cellhouse's yard / main grade (about 38 m above the bay, estimated from a public DEM); the rock itself is NOT modelled.
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { FOOTPRINTS } from './footprint.js';
import { TOWER } from './alcatraz-island-plan.js';

const ORIGIN = [-122.4229316, 37.8266302], BEARING = 135.95;
// Authoring (u, w) → [lng, lat], rounded to 1e-7 deg: u along BEARING, w at right angles toward the south-west (see the kit).
const lngLat = (u, w) => {
  const b = BEARING * Math.PI / 180, s = mercStretch(ORIGIN[1]), e = u * Math.sin(b) + w * Math.cos(b), n = u * Math.cos(b) - w * Math.sin(b);
  const r7 = (v) => Math.round(v * 1e7) / 1e7;
  return [r7(mercXToLng(lngToMercX(ORIGIN[0]) + e * s)), r7(mercYToLat(latToMercY(ORIGIN[1]) + n * s))];
};
// Full 3D world (ADR-0045): the default 75 m disc reached the island's slopes and took their lowest DEM sample (about 14.6 m) as the
// datum, sinking the complex about 23 m into a flattened pit. The explicit pad is the cellhouse complex's mapped outlines at the median
// DEM over the cellhouse outline (the yard level, about 37.6 m), with a 30 m feather that stays on the rock. Two site levels the model
// was authored at: the water tower's footings 2.5 m below grade, and the recreation yard at grade (its wall stands on y = 0). The app
// draws terrain on a lattice of about 30 m, so each terrace reaches past its part: a 15 m disc round the tower, and the yard's wall
// line pushed out 12 m (an apron at grade that stops short of the water). Listed first, the tower wins where the two overlap.
const YARD_APRON = [[-32, 28.5], [-43.5, 28.5], [-49.5, 59], [-116, 47], [-151, 40.5], [-140.5, -13.5], [-107, -8.5], [-105.5, -19.5], [-58, -27], [-50, -28]];
const TERRAIN_PAD = {
  rings: FOOTPRINTS.slice(0, 3), refs: FOOTPRINTS[0], datum: 'median', featherM: 30,
  terraces: [
    { ring: Array.from({ length: 12 }, (_, k) => lngLat(TOWER.u + 15 * Math.cos(k * Math.PI / 6), TOWER.w + 15 * Math.sin(k * Math.PI / 6))), offsetM: TOWER.footY, featherM: 25 },
    { ring: YARD_APRON.map(([u, w]) => lngLat(u, w)), offsetM: 0, featherM: 12 },
  ],
};
export const SPEC = {
  id: 'alcatraz-island', name: 'Alcatraz Island', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-01)
  origin: ORIGIN,
  height: 28.8, // lighthouse vane: 25.6 m tower on a base that stands 3.2 m above the cellhouse grade
  padM: 75, frontageBearing: 225.95, // the south-west long front looks toward San Francisco
  bearingDeg: BEARING, // authoring u-axis, compass bearing (clockwise from north)
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
};
export const PALETTES = {
  light: {
    stone: '#a39e93', trim: '#bab5aa', base: '#847f75', roof: '#6d7173', glass: '#3a4650',
    ruin: '#615c55', wall: '#968f85', tower: '#b0aca2', steel: '#85817a', glow: '#f3ecc9',
  },
  dark: {
    stone: '#76726b', trim: '#868279', base: '#4f4c46', roof: '#3b3f44', glass: '#1d252d',
    ruin: '#4a463f', wall: '#69655d', tower: '#7f7c75', steel: '#4a4d50', glow: '#fff3b8',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the cellhouse yard level, about 38 m above the bay; the island rock is not part of the model. The lighthouse base stands 3.2 m above it; the Water Tower footings reach 2.5 m below it (its real ground is about 9 m lower) and its tank top is set at its true height relative to the cellhouse roof (about 5 m above it), so the tower is about 23 m tall instead of 29 m. Full 3D world uses an explicit terrain pad (terrainPad), not a disc: the cellhouse complex outlines are held at y=0, at the median DEM over the cellhouse outline (about 37.6 m); two terraces hold the recreation yard plus a 12 m apron at y=0 and a 15 m disc round the water tower at its footing level, y=-2.5. Nothing else is flattened and no water is raised.',
  attribution: 'Original procedural mesh. Mapped footprints and the recreation-yard wall line © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped outlines, 25.6 m (84 ft) lighthouse, six-legged water tower with a 13 m tank (the published 94 ft / 29 m height is not reproduced: legs are shortened to keep its true height relative to the cellhouse roof), cellhouse three storeys. Estimated from photographs: storey and parapet heights, window rhythm, roof monitors, the ruin walls, the yard-wall height and guard towers. Grade differences between buildings come from a coarse public DEM and are approximate.',
};
