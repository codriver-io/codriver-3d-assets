// Columbus Tower's plan, derived from its mapped outline (footprint.js, OSM way 288485994)
// so the model and the footprint that hides the provider's extrusion cannot drift apart.
// Real metres, +X east, +Z south, around SPEC.origin. The outline is a wedge: the Kearny
// Street face (west, bearing 350 deg), the Columbus Avenue face (north-east, bearing 131 deg),
// a straight party wall on the south, and a round corner turret (radius ~2.5 m) at the apex.
import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const k = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
/** The mapped ring in local metres [x east, z south]. */
export const RING = FOOTPRINTS[0].map(([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k]);

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, s) => [a[0] * s, a[1] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const unit = (a) => mul(a, 1 / len(a));
const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];

const centroid = (() => { let a = 0, x = 0, z = 0; for (let i = 0; i < RING.length; i++) { const p = RING[i], q = RING[(i + 1) % RING.length], c = cross2(p, q); a += c; x += (p[0] + q[0]) * c; z += (p[1] + q[1]) * c; } return [x / (3 * a), z / (3 * a)]; })();
/** A wall line: point, unit direction, outward normal (away from the ring's centroid). */
function wallLine(point, through) {
  const dir = unit(sub(through, point));
  let n = [dir[1], -dir[0]];
  if (dot(n, sub(point, centroid)) < 0) n = mul(n, -1);
  return { p: point, dir, n };
}
// Mapped nodes: 0-1 the south party wall, 2-3 the Kearny face, 3..16 the turret arc, 16-17 the Columbus face.
export const LINES = {
  kearny: wallLine(RING[2], RING[3]),
  columbus: wallLine(RING[17], RING[16]),
  south: wallLine(RING[1], RING[0]),
};
const shifted = (line, d) => ({ ...line, p: sub(line.p, mul(line.n, d)) });
function intersect(a, b) {
  const t = cross2(sub(b.p, a.p), b.dir) / cross2(a.dir, b.dir);
  return add(a.p, mul(a.dir, t));
}
// The corner turret: a circle fitted (least squares) to the mapped arc nodes. It is NOT tangent
// to the two faces: the circle centre sits ~1.8 m from each face line while its radius is ~2.5 m,
// so the turret stands proud of both faces, as it does on the real building.
const ARC_NODES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const fitCircle = (pts) => {
  let Sx = 0, Sz = 0, Sxx = 0, Szz = 0, Sxz = 0, Sxxx = 0, Szzz = 0, Sxxz = 0, Sxzz = 0; const n = pts.length;
  for (const [x, z] of pts) { Sx += x; Sz += z; Sxx += x * x; Szz += z * z; Sxz += x * z; Sxxx += x ** 3; Szzz += z ** 3; Sxxz += x * x * z; Sxzz += x * z * z; }
  const A = n * Sxx - Sx * Sx, B = n * Sxz - Sx * Sz, C = n * Szz - Sz * Sz;
  const D = 0.5 * (n * Sxxx + n * Sxzz - Sx * (Sxx + Szz)), E = 0.5 * (n * Sxxz + n * Szzz - Sz * (Sxx + Szz));
  const det = A * C - B * B, c = [(D * C - B * E) / det, (A * E - B * D) / det];
  return { c, r: pts.reduce((s2, p) => s2 + Math.hypot(p[0] - c[0], p[1] - c[1]), 0) / n };
};
/** The corner turret as mapped: centre and radius at the footprint. */
export const APEX = fitCircle(ARC_NODES.map((i) => RING[i]));
const angleOf = (v) => Math.atan2(v[1], v[0]);
const apexDir = unit(sub(APEX.c, centroid)); // from the building toward the turret
const MID = angleOf(apexDir);
const wrapNear = (a) => { while (a < MID - Math.PI) a += 2 * Math.PI; while (a > MID + Math.PI) a -= 2 * Math.PI; return a; };
/** Where a face line (shifted d inward) meets the turret circle (radius r - d), coming from the street end. */
function lineCircle(line, d, rOverride) {
  const L = shifted(line, d), r = rOverride ?? APEX.r - d, f = sub(L.p, APEX.c);
  const b = dot(f, L.dir), disc = b * b - (dot(f, f) - r * r);
  const t = -b - Math.sqrt(Math.max(0, disc)); // faces' dir points toward the apex: the first hit from the street end
  return add(L.p, mul(L.dir, t));
}
/** Key points of the plan inset `d` metres from the mapped outline. */
export function corners(d = 0) {
  const K = shifted(LINES.kearny, d), C = shifted(LINES.columbus, d), S = shifted(LINES.south, d);
  return { sw: intersect(K, S), se: intersect(C, S), kt: lineCircle(LINES.kearny, d), ct: lineCircle(LINES.columbus, d), r: APEX.r - d };
}
/**
 * Angles (atan2(z, x)) at which a circle of radius R about the turret centre meets the Kearny and
 * Columbus wall planes (inset d): a ring of radius R stops there, so its ends sink into the wall.
 */
export function faceHits(R, d = 0.5) {
  return [wrapNear(angleOf(sub(lineCircle(LINES.kearny, d, R), APEX.c))), wrapNear(angleOf(sub(lineCircle(LINES.columbus, d, R), APEX.c)))];
}
/** The angle of the turret axis (away from the building), atan2(z, x). */
export const AXIS_ANGLE = MID;
/** Arc angles from the Kearny face, round the apex, to the Columbus face (atan2(z, x), increasing or decreasing). */
export function arcAngles(d = 0) {
  const c = corners(d);
  return [wrapNear(angleOf(sub(c.kt, APEX.c))), wrapNear(angleOf(sub(c.ct, APEX.c)))];
}
/** Points on the turret arc from the Kearny face to the Columbus face (inclusive), `steps` segments, at inset d. */
export function arcPoints(d = 0, steps = 16) {
  const r = APEX.r - d, [a0, a1] = arcAngles(d), pts = [];
  for (let i = 0; i <= steps; i++) { const a = a0 + (a1 - a0) * i / steps; pts.push([APEX.c[0] + Math.cos(a) * r, APEX.c[1] + Math.sin(a) * r]); }
  return pts;
}
/** Bearing (deg clockwise from north) the turret faces. */
export const AXIS_BEARING_DEG = (Math.atan2(Math.cos(MID), -Math.sin(MID)) * 180 / Math.PI + 360) % 360;
/** The outline inset d, as a closed polygon: south-west corner, Kearny face, turret arc, Columbus face, south-east corner. */
export function outline(d = 0, arcSteps = 16) {
  const c = corners(d), arc = arcPoints(d, arcSteps);
  return [c.sw, ...arc, c.se];
}
/** Shoelace sign of the outline (for sweepBand). */
export const OUTLINE_SIGN = (() => { const o = outline(0, 8); let a = 0; for (let i = 0; i < o.length; i++) { const p = o[i], q = o[(i + 1) % o.length]; a += p[0] * q[1] - q[0] * p[1]; } return a >= 0 ? 1 : -1; })();

/**
 * A straight face as a frame at inset d. `o` is where s = 0 (the end nearest the apex for the
 * two street faces), `t` runs away from the apex (south for Kearny, south-east for Columbus,
 * east for the party wall), `n` is the outward normal, `length` the run between the corners.
 */
export function wallFrame(name, d = 0) {
  const c = corners(d);
  const line = LINES[name];
  let a, b;
  if (name === 'kearny') { a = c.kt; b = c.sw; } else if (name === 'columbus') { a = c.ct; b = c.se; } else { a = c.sw; b = c.se; }
  const t = unit(sub(b, a));
  return { name, o: a, t, n: line.n, length: len(sub(b, a)), inset: d };
}

/** Inside-the-ring test with an optional tolerance in metres (used by the tests). */
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
