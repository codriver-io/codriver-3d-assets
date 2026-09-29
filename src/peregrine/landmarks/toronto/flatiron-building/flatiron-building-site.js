// The Flatiron's plan, derived from its mapped outline (footprint.js, OSM way
// 300884214) so the model and the footprint that hides the provider's extrusion
// can never drift apart. Everything is real metres, +X east, +Z south, around
// SPEC.origin.
//
// The outline is a wedge: the north wall (Wellington St E) is straight at
// bearing 72.9 deg, the south wall (Front St E) is straight at ~56 deg (the two
// streets meet at Church St, 17 deg apart), the west end is one straight 15.4 m
// wall, and the east apex is a ~2.1 m radius arc tangent to both long walls.
import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const k = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
/** The mapped ring in local metres [x east, z south]. */
export const RING = FOOTPRINTS[0].map(([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k]);

// Ring node roles (indices into FOOTPRINTS[0]).
const NODE = { nw: 8, northMid: 9, northEast: 10, arc: [10, 11, 12, 13, 0, 1, 2, 3, 4], southEast: 4, southMid: 5, sw: 6, westMid: 7 };

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, s) => [a[0] * s, a[1] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const unit = (a) => mul(a, 1 / len(a));
const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];

// A wall line: a point, a unit direction and the outward normal (away from the ring's centroid).
const centroid = (() => { let a = 0, x = 0, z = 0; for (let i = 0; i < RING.length; i++) { const p = RING[i], q = RING[(i + 1) % RING.length], c = cross2(p, q); a += c; x += (p[0] + q[0]) * c; z += (p[1] + q[1]) * c; } return [x / (3 * a), z / (3 * a)]; })();
function wallLine(point, through) {
  const dir = unit(sub(through, point));
  let n = [dir[1], -dir[0]];
  if (dot(n, sub(point, centroid)) < 0) n = mul(n, -1);
  return { p: point, dir, n };
}
export const LINES = {
  north: wallLine(RING[NODE.nw], RING[NODE.northEast]),
  // The mapped south wall has a 2 deg kink at node 5 that is slightly concave: the
  // line through it, parallel to the chord, stays inside the outline everywhere.
  south: wallLine(RING[NODE.southMid], add(RING[NODE.southMid], sub(RING[NODE.southEast], RING[NODE.sw]))),
  west: wallLine(RING[NODE.westMid], add(RING[NODE.westMid], sub(RING[NODE.nw], RING[NODE.sw]))),
};
const shifted = (line, d) => ({ ...line, p: sub(line.p, mul(line.n, d)) });
function intersect(a, b) {
  const t = cross2(sub(b.p, a.p), b.dir) / cross2(a.dir, b.dir);
  return add(a.p, mul(a.dir, t));
}

// The apex circle: tangent to both long walls, radius chosen to fit the mapped arc nodes.
const V = intersect(LINES.north, LINES.south); // where the two long walls would meet
const inward = unit(add(mul(LINES.north.n, -1), mul(LINES.south.n, -1))); // bisector, into the wedge
const halfAngle = Math.acos(Math.max(-1, Math.min(1, dot(LINES.north.dir, LINES.south.dir)))) / 2;
const centreAt = (r) => sub(V, mul(inward, -r / Math.sin(halfAngle))); // V + inward * r/sin
const apexFit = (r) => NODE.arc.reduce((s, i) => s + (len(sub(RING[i], centreAt(r))) - r) ** 2, 0);
let apexR = 1.5, best = Infinity;
for (let r = 1.5; r <= 3; r += 0.01) { const e = apexFit(r); if (e < best) { best = e; apexR = r; } }
/** The east apex: centre, radius (at the footprint), and the axis angle it faces. */
export const APEX = { c: centreAt(apexR), r: apexR };
const angleOf = (n) => Math.atan2(n[1], n[0]);
const aN = angleOf(LINES.north.n);
let aS = angleOf(LINES.south.n);
while (aS < aN) aS += Math.PI * 2;
/** Arc from the north tangent (aN) through the east tip to the south tangent (aS). */
export const ARC = { from: aN, to: aS, mid: (aN + aS) / 2 };
export const AXIS_BEARING_DEG = (Math.atan2(Math.cos(ARC.mid), -Math.sin(ARC.mid)) * 180 / Math.PI + 360) % 360;

/**
 * The plan outline inset `d` metres from the mapped footprint, clockwise seen from
 * above with north up: north wall, apex arc, south wall, west end. `arcSteps`
 * segments round the apex. Vertices carry no duplicates.
 */
export function outline(d = 0, arcSteps = 16) {
  const N = shifted(LINES.north, d), S = shifted(LINES.south, d), W = shifted(LINES.west, d);
  const wn = intersect(N, W), ws = intersect(S, W);
  const r = APEX.r - d, pts = [wn];
  for (let i = 0; i <= arcSteps; i++) {
    const a = ARC.from + (ARC.to - ARC.from) * i / arcSteps;
    pts.push([APEX.c[0] + Math.cos(a) * r, APEX.c[1] + Math.sin(a) * r]);
  }
  pts.push(ws);
  return pts;
}

/**
 * A straight wall as a frame: `o` is where s = 0, `t` runs along the wall, `n` is
 * the outward normal, `length` the run between its two corners at inset `d`. Chosen
 * so that (t, up, n) is right handed, which lets shapes drawn with X along the wall,
 * Y up and +Z outward be placed with one matrix and keep their winding.
 */
export function wallFrame(name, d = 0) {
  const N = shifted(LINES.north, d), S = shifted(LINES.south, d), W = shifted(LINES.west, d);
  const wn = intersect(N, W), ws = intersect(S, W);
  const tN = add(APEX.c, mul(LINES.north.n, APEX.r - d)), tS = add(APEX.c, mul(LINES.south.n, APEX.r - d)); // tangent points
  const ends = { north: [tN, wn], south: [ws, tS], west: [ws, wn] }[name]; // from -> to
  const line = LINES[name];
  let [a, b] = ends, t = unit(sub(b, a));
  // right-handed: t x up = (-tz, 0, tx) must point outward
  if (dot([-t[1], t[0]], line.n) < 0) { [a, b] = [b, a]; t = unit(sub(b, a)); }
  return { name, o: a, t, n: line.n, length: len(sub(b, a)), inset: d };
}

/** Footprint-relative helpers used by the tests. */
export function insideRing(x, z, tol = 0) {
  let hit = false;
  for (let i = 0, j = RING.length - 1; i < RING.length; j = i++) {
    const [ax, az] = RING[j], [bx, bz] = RING[i];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) hit = !hit;
  }
  if (hit) return true;
  if (!tol) return false;
  for (let i = 0, j = RING.length - 1; i < RING.length; j = i++) {
    const [ax, az] = RING[j], [bx, bz] = RING[i], dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz;
    const t = l2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2)) : 0;
    if (Math.hypot(x - ax - dx * t, z - az - dz * t) <= tol) return true;
  }
  return false;
}
