// Casa Loma's site frame. Both buildings (and Austin Terrace, and Walmer Road) follow the
// Toronto street grid, mapped edges at bearing 72 / 162 deg, so the model is authored in
// grid-aligned plan coordinates (u, v) and rotated onto east/south once at the end.
//
//   u  along bearing 72 deg (Austin Terrace / the lake-shore direction)
//   v  along bearing 162 deg (v decreases toward the north-north-west, the street front)
//
// (u, v) here are measured from a REFERENCE point at the castle's centre so plan numbers read
// like the mapped outline; `refToModel` shifts them onto the model origin.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';

export const ANGLE = (90 - SPEC.frameBearing) * Math.PI / 180; // rotateY angle: 18 deg
export const REF_LNGLAT = [-79.40939, 43.6781]; // castle centre; plan (0, 0)

const stretch = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
const c = Math.cos(ANGLE), s = Math.sin(ANGLE);

/** [lng, lat] -> metres east / south of the model origin. */
export function toEastSouth([lng, lat]) {
  return [(lngToMercX(lng) - ox) / stretch, (-latToMercY(lat) - oz) / stretch];
}
/** east/south metres -> grid plan (u, v) relative to the model origin (inverse of rotateY(ANGLE)). */
export const toPlan = ([x, z]) => [x * c - z * s, x * s + z * c];
/** plan (u, v) relative to the model origin -> east/south metres (what rotateY(ANGLE) does). */
export const planToEastSouth = ([u, v]) => [u * c + v * s, -u * s + v * c];

/** Plan position of the castle reference point relative to the model origin. */
export const REF_UV = toPlan(toEastSouth(REF_LNGLAT));

/** A mapped ring in castle-reference plan coordinates (the frame the geometry is written in). */
export const ringToRef = (ring) => ring.map((p) => { const [u, v] = toPlan(toEastSouth(p)); return [u - REF_UV[0], v - REF_UV[1]]; });

export const CASTLE_RING = ringToRef(FOOTPRINTS[0]);
export const STABLES_RING = ringToRef(FOOTPRINTS[1]);

/** Point-in-polygon in the reference plan frame. */
export function inside(ring, u, v) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i];
    if ((az > v) !== (bz > v) && u < (bx - ax) * (v - az) / (bz - az) + ax) hit = !hit;
  }
  return hit;
}
