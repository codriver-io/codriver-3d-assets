// The mapped site in model metres (+X east, +Z south) around SPEC.origin, and the two grids the station is built on.
// Authoring only: never imported by the runtime bundle.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const toLocal = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k];
const local = (ring) => ring.slice(0, -1).map(toLocal); // OSM closes rings; the model does not
export const [OUTER, NORTH_WING, WEST_WING, MAIN] = FOOTPRINTS.map(local);
export const RINGS = { OUTER, NORTH_WING, WEST_WING, MAIN };

const bearingOf = (a, b) => (Math.atan2(b[0] - a[0], -(b[1] - a[1])) * 180 / Math.PI + 360) % 360;
// Length-weighted mean of the edge bearings of the rings that lie within 5 deg of `guess` (mod 90 deg): the grid the ring was drawn on.
function gridBearing(rings, guess) {
  let sum = 0, w = 0;
  for (const ring of rings) for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let d = ((bearingOf(a, b) - guess) % 90 + 90) % 90; if (d > 45) d -= 90;
    if (L > 6 && Math.abs(d) < 5) { sum += d * L; w += L; }
  }
  return guess + sum / w;
}
// A grid: u runs along bearing `bearing` (deg east of north), v 90 deg clockwise from it (to the right).
export function frame(bearing) {
  const b = bearing * Math.PI / 180, U = [Math.sin(b), -Math.cos(b)], V = [Math.cos(b), Math.sin(b)];
  return { bearing, U, V, at: (u, v) => [u * U[0] + v * V[0], u * U[1] + v * V[1]], uv: ([x, z]) => [x * U[0] + z * U[1], x * V[0] + z * V[1]] };
}
// The main block: u along the facade (east-north-east), v toward the forecourt (south-south-east). The wings: a grid 29 deg off it (west wing along u, north wing along -v).
export const M = frame(gridBearing([MAIN], 68));
export const A = frame(gridBearing([WEST_WING, NORTH_WING], 97.2));
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
export const distToRing = (ring, x, z) => {
  let best = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i], dx = bx - ax, dz = bz - az, len = dx * dx + dz * dz;
    const t = len ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / len)) : 0;
    best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t));
  }
  return best;
};
