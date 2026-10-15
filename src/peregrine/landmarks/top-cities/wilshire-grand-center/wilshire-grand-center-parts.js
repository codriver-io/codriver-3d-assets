// Geometry helpers for the Wilshire Grand Center: indexed mesh accumulation, the tower's tapering plan, and the
// podium outline. Self-contained (three only).
import * as THREE from 'three';
import { SPEC } from './config.js';

const TH = SPEC.planBearingDeg * Math.PI / 180 - Math.PI / 2;
export const U = [Math.cos(TH), Math.sin(TH)]; // plan axis a (along the tower) in (x, z)
export const V = [-Math.sin(TH), Math.cos(TH)]; // plan axis c (across, toward the south-west curved face)
export const SHIFT = SPEC.dossierShift; // dossier metres -> this origin

/** Tower-plan (a, c) -> model (x, z). a, c are measured from the dossier origin (OSM local metres), see the doc. */
export const toXZ = (a, c) => [a * U[0] + c * V[0] + SHIFT[0], a * U[1] + c * V[1] + SHIFT[1]];

// ---- the plan ---------------------------------------------------------------------------------
// Base plan at grade, mapped from the three OSM tower parts (NE strip 1307580961, curved parts 1307580959/60):
// straight NE face along Wilshire (its SE end is square at a = -31, as the OSM strip), a prow 6 m further out on the
// middle strip where the spire stands, the bowed SW face, and the NW end. [a, c, corner]: a runs along bearing 127.4 (NW to SE is +a), c toward the SW face.
export const BASE_RAW = [
  [-82.6, 8.7, 1], [-30.8, 8.4, 1], [-31.1, 21.4, 1], [-24.6, 21.0, 1], [-24.4, 24.7, 1], [-24.4, 28.5, 1], [-30.4, 28.9, 1], [-28.5, 40.6, 1],
  [-37, 42.0, 0], [-45.9, 42.7, 0], [-53, 42.7, 0], [-60.3, 42.7, 0], [-63.8, 42.5, 0], [-72, 41.5, 0],
  [-81.1, 39.7, 1], [-78.3, 28.9, 1], [-82.7, 26.4, 1], // the NW end steps in where the curved parts meet (OSM parts 1307580959/60)
];
export const A0 = -31, C0 = 24.5; // the taper is anchored at the south-east end (the mapped strip's square end): that end stays nearly vertical (photographs), and every floor shrinks toward it, so the plan never leaves its footprint
/** Mast position [x, z]: on the prow strip where OSM maps the spire part (a = -28.2, c = 24.1), carried by the taper at the crown. */
export const mastXZ = () => toXZ(A0 + (-28.5 - A0) * (1 - 0.35 * (262 / SPEC.roofY)), C0);
const A_NW = -83;
/** Plan scale along the tower and across it at height y (a linear taper, estimated from photographs). */
export const scaleA = (y) => 1 - 0.35 * (y / SPEC.roofY);
export const scaleC = (y) => 1 - 0.15 * (y / SPEC.roofY);
/** Sail crown top edge at base-plan station a: highest at the NW end (283 m), falling in a convex arc to 262 m at the prow. */
export const crownTop = (a) => {
  const t = Math.min(1, Math.max(0, (-24 - a) / (-24 - A_NW)));
  return SPEC.roofY - 21 * Math.pow(1 - t, 1.7);
};

const area = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return s / 2; };
// Orient so that quad(p0, p1, p1 + up, p0 + up) faces outward: the shoelace area in (x, z) must be negative.
const A_SIGN = area(BASE_RAW.map(([a, c]) => toXZ(a, c)));
export const BASE = A_SIGN > 0 ? [...BASE_RAW].reverse() : BASE_RAW;

/** Tapered position [x, z] of base-ring vertex i at height y. */
export function ringXZ(i, y) {
  const [a, c] = BASE[i];
  return toXZ(A0 + (a - A0) * scaleA(y), C0 + (c - C0) * scaleC(y));
}
/** Runs of consecutive vertex indices between corners (a smooth run shares its vertex normals). */
export function runs() {
  const n = BASE.length, corners = [];
  BASE.forEach((p, i) => { if (p[2]) corners.push(i); });
  const out = [];
  for (let k = 0; k < corners.length; k++) {
    const i0 = corners[k], i1 = corners[(k + 1) % corners.length], r = [i0];
    for (let i = (i0 + 1) % n; ; i = (i + 1) % n) { r.push(i); if (i === i1) break; }
    out.push(r);
  }
  return out;
}
/** Outward unit normal (x, z) of the edge p -> q: with the ring oriented as above it is t x up = (-tz, tx). */
export const edgeNormal = (p, q) => { const tx = q[0] - p[0], tz = q[1] - p[1], l = Math.hypot(tx, tz) || 1; return [-tz / l, tx / l]; };

/** Point on a run of the base ring at base-plan station a (the run is monotonic in a), height y, pushed `proud` along its normal. */
export function runPoint(run, a, y, proud = 0) {
  for (let k = 0; k + 1 < run.length; k++) {
    const a0 = BASE[run[k]][0], a1 = BASE[run[k + 1]][0];
    if ((a - a0) * (a - a1) > 0 && Math.abs(a - a0) > 1e-9 && Math.abs(a - a1) > 1e-9) continue;
    const s = a1 === a0 ? 0 : (a - a0) / (a1 - a0), p = ringXZ(run[k], y), q = ringXZ(run[k + 1], y), n = edgeNormal(p, q);
    return [p[0] + (q[0] - p[0]) * s + n[0] * proud, y, p[1] + (q[1] - p[1]) * s + n[1] * proud, n];
  }
  throw new Error(`station ${a} is outside the run`);
}

// ---- mesh accumulation --------------------------------------------------------------------------
export function hash01(a, b) { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); }

const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const norm = (p) => { const l = Math.hypot(...p) || 1; return [p[0] / l, p[1] / l, p[2] / l]; };

export class Mesh {
  constructor() { this.pos = []; this.nor = []; this.idx = []; }
  get count() { return this.idx.length / 3; }
  vertex(p, n) { this.pos.push(...p); this.nor.push(...n); return this.pos.length / 3 - 1; }
  /** Flat quad p0 p1 p2 p3 (counter-clockwise seen from the front). */
  quad(p0, p1, p2, p3, push = 0) {
    const n = norm(cross(sub(p1, p0), sub(p3, p0)));
    const o = push ? [n[0] * push, n[1] * push, n[2] * push] : [0, 0, 0];
    const at = (p) => this.vertex([p[0] + o[0], p[1] + o[1], p[2] + o[2]], n);
    const i = at(p0); at(p1); at(p2); at(p3);
    this.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  tri(p0, p1, p2) {
    const n = norm(cross(sub(p1, p0), sub(p2, p0)));
    const i = this.vertex(p0, n); this.vertex(p1, n); this.vertex(p2, n);
    this.idx.push(i, i + 1, i + 2);
  }
  /** A grid wall: g[j][i] points, rows going up, columns along the run; `use(j)` picks the quad rows this mesh draws. Normals are smoothed along the run. */
  wall(g, use = () => true) {
    const R = g.length, C = g[0].length, nn = g.map((row) => row.map(() => [0, 0, 0])), used = new Set(), quads = [];
    for (let j = 0; j + 1 < R; j++) {
      if (!use(j)) continue;
      for (let i = 0; i + 1 < C; i++) {
        const n = cross(sub(g[j][i + 1], g[j][i]), sub(g[j + 1][i], g[j][i]));
        for (const [jj, ii] of [[j, i], [j, i + 1], [j + 1, i + 1], [j + 1, i]]) { for (let k = 0; k < 3; k++) nn[jj][ii][k] += n[k]; used.add(jj * C + ii); }
        quads.push([j, i]);
      }
    }
    const map = new Map();
    const id = (j, i) => { const key = j * C + i; if (!map.has(key)) map.set(key, this.vertex(g[j][i], norm(nn[j][i]))); return map.get(key); };
    for (const [j, i] of quads) { const a = id(j, i), b = id(j, i + 1), c = id(j + 1, i + 1), d = id(j + 1, i); this.idx.push(a, b, c, a, c, d); }
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setIndex(this.idx);
    return g;
  }
}

/** Triangulate a plan polygon [[x, z]...] lying at per-vertex heights ys; faces up. */
export function capPolygon(mesh, pts, ys) {
  const tris = THREE.ShapeUtils.triangulateShape(pts.map((p) => new THREE.Vector2(p[0], p[1])), []);
  for (const [i, j, k] of tris) {
    const p = (m) => [pts[m][0], ys[m], pts[m][1]];
    const n = cross(sub(p(j), p(i)), sub(p(k), p(i)));
    if (n[1] >= 0) mesh.tri(p(i), p(j), p(k)); else mesh.tri(p(i), p(k), p(j));
  }
}
