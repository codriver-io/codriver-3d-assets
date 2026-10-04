// The mapped site in model metres (+X east, +Z south) around SPEC.origin, and the hotel's own axes.
// Authoring only: never imported by the runtime bundle.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const toLocal = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k];
const local = (ring) => ring.slice(0, -1).map(toLocal); // OSM closes rings; the model does not

const [OUTER, NORTH_WING, SLAB_NORTH, TOWER, SW_PAVILION, EAST_WING, ROUND_TOWER, SQUARE_TOWER, HEX_TOWER, TERRACE_TURRET, GALLERY, COURT_WING, COURT_LINK] = FOOTPRINTS.map(local);
export const RINGS = { OUTER, NORTH_WING, SLAB_NORTH, TOWER, SW_PAVILION, EAST_WING, ROUND_TOWER, SQUARE_TOWER, HEX_TOWER, TERRACE_TURRET, GALLERY, COURT_WING, COURT_LINK };

// The hotel grid: u runs along the terrace facade (west-south-west to east-north-east), v across it toward the river (south-south-east).
// Measured on the tower block's long edge (+ the north wing's long edge) so the model lies exactly in the mapped rings.
const edgeAngle = (ring, i) => { const [a, b] = [ring[i], ring[(i + 1) % ring.length]]; return Math.atan2(b[1] - a[1], b[0] - a[0]); };
export const THETA = (() => { // longest edges of the north wing and the tower block, folded into one angle
  const long = (ring) => { let best = 0, ang = 0; for (let i = 0; i < ring.length; i++) { const [a, b] = [ring[i], ring[(i + 1) % ring.length]], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l > best) { best = l; ang = Math.atan2(b[1] - a[1], b[0] - a[0]); } } return ang; };
  const fold = (a) => ((a % Math.PI) + Math.PI) % Math.PI;
  const nw = fold(long(NORTH_WING)), tw = fold(long(TOWER) + Math.PI / 2);
  return (nw + tw) / 2 - Math.PI; // pointing east-north-east
})();
export const U = [Math.cos(THETA), Math.sin(THETA)]; // (x, z) of a step along u
export const V = [-Math.sin(THETA), Math.cos(THETA)]; // (x, z) of a step along v (toward the river)
export const BEARING_DEG = (Math.atan2(U[0], -U[1]) * 180 / Math.PI + 360) % 360;
export const at = (u, v) => [u * U[0] + v * V[0], u * U[1] + v * V[1]];
export const uv = ([x, z]) => [x * U[0] + z * U[1], x * V[0] + z * V[1]];
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
