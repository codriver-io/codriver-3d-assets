// The mapped site in model metres (+X east, +Z south) around SPEC.origin, and the hotel's own axes.
// Authoring only: never imported by the runtime bundle.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const toLocal = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k];
const local = (ring) => ring.slice(0, -1).map(toLocal); // OSM closes rings; the model does not

const [BASE, SHOULDERS, TOWER, STEP, CROWN, STACK] = FOOTPRINTS.map(local);
export const RINGS = { BASE, SHOULDERS, TOWER, STEP, CROWN, STACK };

// Slab levels (metres above local grade). Heights are the OSM building:part heights.
export const LEVELS = { podium: 25, shoulders: 67, tower: 87, step: 94, crownWalls: 100.4, roofTop: 110.6, stack: 119, mast: 124 };

// The Front Street axis, measured on the crown's long edge (OSM is exact to a few centimetres).
const [c0, c1] = [CROWN[0], CROWN[1]];
const len = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]);
export const U = [(c1[0] - c0[0]) / len, (c1[1] - c0[1]) / len]; // along Front St, west to east (x, z)
export const V = [-U[1], U[0]]; // across the hotel, pointing south-east to Front Street
export const AXIS_DEG = Math.atan2(-U[1], U[0]) * 180 / Math.PI; // 16.6 deg north of east
export const along = (p) => p[0] * U[0] + p[1] * U[1];
export const across = (p) => p[0] * V[0] + p[1] * V[1];
export const at = (u, v) => [u * U[0] + v * V[0], u * U[1] + v * V[1]];

export const centroid = (ring) => {
  let a = 0, x = 0, z = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]; a += f; x += (ring[j][0] + ring[i][0]) * f; z += (ring[j][1] + ring[i][1]) * f;
  }
  a /= 2; return [x / (6 * a), z / (6 * a)];
};
export const signedArea = (ring) => { let a = 0; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]; return a / 2; };
export const inside = (ring, x, z) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) hit = !hit;
  }
  return hit;
};
