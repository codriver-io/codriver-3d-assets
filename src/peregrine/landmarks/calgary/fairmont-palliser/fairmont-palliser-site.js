// The mapped site in model metres (+X east, +Z south) around SPEC.origin, the hotel's own axes, the storey
// levels, and which stretches of each part's walls are really exposed (not buried against a neighbouring part).
// Authoring only: never imported by the runtime bundle.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { RING_SET } from './footprint.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const toLocal = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k];
const local = (ring) => ring.slice(0, -1).map(toLocal); // OSM closes rings; the model does not
export const RINGS = Object.fromEntries(Object.entries(RING_SET).map(([name, ring]) => [name, local(ring)]));

// Storeys. Level 1 is the tall ground storey (7.2 m); levels 2..15 share the rest of OSM's 60 m (3.77 m each),
// so that building:levels=12 / 13 / 14 / 15 land on 48.7 / 52.5 / 56.2 / 60 m.
export const GROUND = 7.2;
export const PITCH = (60 - GROUND) / 14;
export const Ht = (n) => (n <= 0 ? 0 : GROUND + (n - 1) * PITCH);
// The penthouse: brick walls to 58 m, the slate roof from there to 60 m.
export const PENT_WALL = 58;

// The 9 Avenue axis, measured along the whole north wall (OSM is exact to a few centimetres).
const [a0, a1] = [RINGS.OUTLINE[0], RINGS.OUTLINE[5]];
const len = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
export const U = [(a1[0] - a0[0]) / len, (a1[1] - a0[1]) / len]; // along 9 Avenue, west to east (x, z)
export const V = [-U[1], U[0]]; // across the hotel, pointing south to 9 Avenue
export const AXIS_DEG = Math.atan2(U[1], U[0]) * 180 / Math.PI; // 2.7 deg clockwise of east
export const along = (p) => p[0] * U[0] + p[1] * U[1];
export const across = (p) => p[0] * V[0] + p[1] * V[1];
export const at = (u, v) => [u * U[0] + v * V[0], u * U[1] + v * V[1]];

export const signedArea = (ring) => { let a = 0; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]; return a / 2; };
export const centroid = (ring) => {
  let a = 0, x = 0, z = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]; a += f; x += (ring[j][0] + ring[i][0]) * f; z += (ring[j][1] + ring[i][1]) * f;
  }
  a /= 2; return [x / (6 * a), z / (6 * a)];
};
export const inside = (ring, x, z) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) hit = !hit;
  }
  return hit;
};
// Outward normal of each edge of a ring, whichever way it winds; `convexEnd` says whether the corner at q is convex.
export function edgesOf(ring) {
  const s = Math.sign(signedArea(ring)) || 1, out = [];
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz);
    if (L < 1e-6) continue;
    out.push({ i, p, q, L, t: [dx / L, dz / L], n: s > 0 ? [dz / L, -dx / L] : [-dz / L, dx / L] });
  }
  for (let i = 0; i < out.length; i++) {
    const a = out[i], b = out[(i + 1) % out.length];
    a.convexEnd = (a.t[0] * b.t[1] - a.t[1] * b.t[0]) * s > 0;
    b.convexStart = a.convexEnd;
  }
  return out;
}

// The parts, each a mapped ring with its roof height. `n` is OSM's building:levels.
const PART_LIST = [
  ['WEST_ARM', 12], ['EAST_ARM', 12], ['NORTH_STEM', 12], ['STEM_13', 13], ['STEM_14', 14], ['PENTHOUSE', 15],
  ['WEST_COURT', 2], ['EAST_COURT', 2], ['FRONT_WEST', 1], ['FRONT_ENTRY', 1], ['FRONT_EAST', 1],
];
export const PARTS = PART_LIST.map(([key, n]) => ({ key, n, ring: RINGS[key], top: key === 'PENTHOUSE' ? PENT_WALL : Ht(n), edges: edgesOf(RINGS[key]) }));

// Every wall stretch of every part that is not hidden against another part: { part, e, u0, u1, c, H }, where the
// wall of edge `e` is exposed from the height c (the neighbour's roof, or 0) up to the part's roof H.
export function exposedWalls(parts = PARTS) {
  const out = [];
  for (const P of parts) {
    for (const e of P.edges) {
      const cuts = [];
      for (const Q of parts) {
        if (Q === P) continue;
        for (const f of Q.edges) {
          if (e.n[0] * f.n[0] + e.n[1] * f.n[1] > -0.95) continue; // the neighbour's wall faces the other way
          const dp = (f.p[0] - e.p[0]) * e.n[0] + (f.p[1] - e.p[1]) * e.n[1], dq = (f.q[0] - e.p[0]) * e.n[0] + (f.q[1] - e.p[1]) * e.n[1];
          if (Math.abs(dp) > 0.6 || Math.abs(dq) > 0.6) continue; // not on the same line
          const a = (f.p[0] - e.p[0]) * e.t[0] + (f.p[1] - e.p[1]) * e.t[1], b = (f.q[0] - e.p[0]) * e.t[0] + (f.q[1] - e.p[1]) * e.t[1];
          const lo = Math.max(0, Math.min(a, b)), hi = Math.min(e.L, Math.max(a, b));
          if (hi - lo > 0.05) cuts.push([lo, hi, Q.top]);
        }
      }
      const xs = [...new Set([0, e.L, ...cuts.flatMap(([a, b]) => [a, b])])].sort((x, y) => x - y);
      const segs = [];
      for (let i = 0; i + 1 < xs.length; i++) {
        const lo = xs[i], hi = xs[i + 1];
        if (hi - lo < 0.05) continue;
        const mid = (lo + hi) / 2;
        const c = cuts.reduce((m, [a, b, h]) => (a <= mid && mid <= b ? Math.max(m, h) : m), 0);
        const last = segs[segs.length - 1];
        if (last && Math.abs(last.c - c) < 0.01 && Math.abs(last.u1 - lo) < 0.06) last.u1 = hi; else segs.push({ u0: lo, u1: hi, c });
      }
      for (const s of segs) if (s.c < P.top - 0.3) out.push({ part: P, e, u0: s.u0, u1: s.u1, c: s.c, H: P.top });
    }
  }
  return out;
}

// A convex ring pulled in by d metres on every side (corners follow the bisectors).
export function insetRing(ring, d) {
  const E = edgesOf(ring);
  return E.map((e, i) => {
    const f = E[(i + E.length - 1) % E.length], m = [-(e.n[0] + f.n[0]), -(e.n[1] + f.n[1])], q = 1 + e.n[0] * f.n[0] + e.n[1] * f.n[1];
    return [e.p[0] + m[0] * d / q, e.p[1] + m[1] * d / q];
  });
}
