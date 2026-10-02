// Geometry helpers for The Bow: the crescent plan (two mapped circles and two wing ends), a welded mesh
// accumulator, and the bars the diagrid exoskeleton is made of. Plan frame = model frame: +X east, +Z south.
import * as THREE from 'three';
import { SPEC } from './config.js';

const RAD = Math.PI / 180;
export const ROOF_Y = SPEC.roofY;
export const BANDS = SPEC.bands;
export const BAND = ROOF_Y / BANDS; // 25.96 m between ring members
export const INSET = 1.5; // glass stands this far inside the mapped outline; the diagrid fills the gap
export const DIP = 5; // the concave rim sits up to this far below the roof (estimated)

// The mapped outline (OSM way 127741499) fits two circles, in metres from the origin (x east, z south).
// Angles are degrees counter-clockwise from east as seen on the map (north is up, so z = cz - r sin(a)).
//   OUT: the convex face, residual 1.6 m over 188 degrees. Diagrid from a0 clockwise to a1 in n half-bays.
//   IN: the concave face, residual 0.25 m over 85 degrees. Diagrid from a0 to a1 (counter-clockwise) in n half-bays.
export const OUT = { c: [-1.5, 9.6], r: 46.0, a0: 143, a1: 10, n: 11 };
export const IN = { c: [-17.7, 41.0], r: 39.3, a0: 27, a1: 112, n: 6 };
// Three sky gardens, three storeys (12.5 m) tall, in the concave face between the wings. Wikipedia: spaced about every 18 floors
// (about 72.5 m), the top one at the sky-high clubs on floors 54 and 55; the exact heights are estimated. `centres` in metres.
export const GARDEN = { depth: 2.5, height: 12.5, from: 41.2, to: 97.8, centres: [73.2, 145.7, 218.2] };

const cosd = (a) => Math.cos(a * RAD), sind = (a) => Math.sin(a * RAD);
const onCircle = (C, r, deg) => [C.c[0] + r * cosd(deg), C.c[1] - r * sind(deg)];

/** Half-bay column j of a zone: its angle in degrees. */
export const columnAngle = (zone, j) => (zone === 'out' ? OUT.a0 - j * (OUT.a0 - OUT.a1) / OUT.n : IN.a0 + j * (IN.a1 - IN.a0) / IN.n);
/** Roof edge height on the concave face (dips smoothly, level with the roof at both wings). */
export const rimIn = (a) => ROOF_Y - DIP * Math.sin(Math.PI * (a - IN.a0) / (IN.a1 - IN.a0));
export const rimAt = (zone, a) => (zone === 'in' ? rimIn(a) : ROOF_Y);
/** A point on the glass surface of a diagrid zone with its outward normal. */
export function surf(zone, a) {
  const c = cosd(a), s = sind(a);
  if (zone === 'out') { const r = OUT.r - INSET; return { x: OUT.c[0] + r * c, z: OUT.c[1] - r * s, nx: c, nz: -s }; }
  const r = IN.r + INSET; return { x: IN.c[0] + r * c, z: IN.c[1] - r * s, nx: -c, nz: s };
}

// ---- the outline ---------------------------------------------------------------------------------------------
const WEST_CAP = [[-37.5, 2.3], [-41.2, 1.0], [-43.8, -1.1], [-45.3, -3.7]]; // the west wing's rounded end
const EAST_CAP = [[45.7, 15.7], [44.6, 24.3], [42.0, 31.0], [39.4, 33.4], [37.0, 35.4], [34.6, 36.8], [31.7, 37.4], [28.8, 36.8], [26.4, 35.4], [24.4, 33.3], [22.4, 31.0], [20.4, 28.0]]; // the south-east wing's end, inside the mapped ring

/**
 * The closed outline, clockwise on the map, with the glass line inset by INSET. Each vertex carries its zone
 * ('out' and 'in' are the diagrid faces, 'W' and 'E' the wing columns; an edge takes its start vertex's zone),
 * its roof height and smoothed normals. `m` samples per half-bay.
 */
export function outline(detail) {
  const near = detail === 'near', m = near ? 3 : 1, V = [];
  const push = (o, zone, extra = {}) => V.push({ o, zone, rim: ROOF_Y, ...extra });
  const base = (OUT.a0 - OUT.a1) / OUT.n / 3, dOut = (OUT.a0 - OUT.a1) / OUT.n / m; // 4.03 degrees; the diagrid step is 4.03 near, 12.09 far
  const inA = (deg) => ({ deg, rim: rimIn(deg) });
  push(onCircle(IN, IN.r, IN.a1), 'W', inA(IN.a1));
  for (const p of WEST_CAP) push(p, 'W');
  const wStep = near ? base : 2 * base, wStart = OUT.a0 + 4 * base; // the wing arcs step 4.03 near, 8.06 far
  for (let i = 0; i < (near ? 4 : 2); i++) push(onCircle(OUT, OUT.r, wStart - i * wStep), 'W');
  for (let i = 0; i < OUT.n * m; i++) push(onCircle(OUT, OUT.r, OUT.a0 - i * dOut), 'out', { deg: OUT.a0 - i * dOut });
  for (let i = 0; i < (near ? 3 : 2); i++) push(onCircle(OUT, OUT.r, OUT.a1 - i * wStep), 'E');
  for (const p of EAST_CAP) push(p, 'E');
  const dIn = (IN.a1 - IN.a0) / IN.n / m;
  for (let i = 0; i < IN.n * m; i++) push(onCircle(IN, IN.r, IN.a0 + i * dIn), 'in', inA(IN.a0 + i * dIn));

  const n = V.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const a = V[i].o, b = V[(i + 1) % n].o; area += a[0] * b[1] - b[0] * a[1]; }
  const sgn = area > 0 ? 1 : -1;
  const edgeN = V.map((v, i) => { const b = V[(i + 1) % n].o, dx = b[0] - v.o[0], dz = b[1] - v.o[1], l = Math.hypot(dx, dz) || 1; return [sgn * dz / l, -sgn * dx / l]; });
  V.forEach((v, i) => {
    const np = edgeN[(i + n - 1) % n], nn = edgeN[i], dot = np[0] * nn[0] + np[1] * nn[1];
    v.nPrev = np; v.nNext = nn;
    v.smooth = dot > Math.cos(40 * RAD);
    const sx = np[0] + nn[0], sz = np[1] + nn[1], l = Math.hypot(sx, sz) || 1;
    v.n = [sx / l, sz / l]; // the smooth normal
    v.miter = [sx / (1 + dot), sz / (1 + dot)]; // offsets the vertex along both edges at once
    v.g = [v.o[0] - INSET * v.miter[0], v.o[1] - INSET * v.miter[1]]; // the glass line
    v.i = i;
  });
  return V;
}

// ---- welded mesh accumulation --------------------------------------------------------------------------------
export class Mesh {
  constructor() { this.pos = []; this.nor = []; this.idx = []; this.map = new Map(); }
  v(p, n) {
    const l = Math.hypot(n[0], n[1], n[2]) || 1, q = [n[0] / l, n[1] / l, n[2] / l];
    const key = `${p[0].toFixed(3)},${p[1].toFixed(3)},${p[2].toFixed(3)}|${q[0].toFixed(2)},${q[1].toFixed(2)},${q[2].toFixed(2)}`;
    let i = this.map.get(key);
    if (i === undefined) { i = this.pos.length / 3; this.pos.push(p[0], p[1], p[2]); this.nor.push(q[0], q[1], q[2]); this.map.set(key, i); }
    return i;
  }
  tri(a, b, c) {
    if (a === b || b === c || a === c) return;
    const P = (i) => new THREE.Vector3(this.pos[3 * i], this.pos[3 * i + 1], this.pos[3 * i + 2]);
    const pa = P(a), pb = P(b), pc = P(c);
    const g = new THREE.Vector3().crossVectors(pb.clone().sub(pa), pc.clone().sub(pa));
    if (g.lengthSq() < 1e-10) return; // sliver
    const n = new THREE.Vector3(0, 0, 0);
    for (const i of [a, b, c]) n.add(new THREE.Vector3(this.nor[3 * i], this.nor[3 * i + 1], this.nor[3 * i + 2]));
    if (g.dot(n) < 0) this.idx.push(a, c, b); else this.idx.push(a, b, c);
  }
  quad(a, b, c, d) { this.tri(a, b, c); this.tri(a, c, d); }
  /** A flat quad with one normal. */
  flat(p0, p1, p2, p3, n) { this.quad(this.v(p0, n), this.v(p1, n), this.v(p2, n), this.v(p3, n)); }
  get triangles() { return this.idx.length / 3; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setIndex(this.idx);
    return g;
  }
}

// ---- bars ------------------------------------------------------------------------------------------------------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

/**
 * A member standing off a vertical surface: from A to B (points on the glass, [x, y, z]), `w` wide across the
 * bar, spanning `oIn`..`oOut` metres outward along the horizontal outward normals nA, nB ([nx, nz]). Three faces
 * (outer and both sides) are drawn; `inner` adds the face toward the glass. The glass-side face stays undrawn:
 * the member covers it.
 */
export function bar(mesh, A, B, nA, nB, w, oIn, oOut, inner = false) {
  const d = norm(sub(B, A)), na = [nA[0], 0, nA[1]], nb = [nB[0], 0, nB[1]], nm = norm(add(na, nb));
  const s = cross(d, nm);
  if (Math.hypot(...s) < 1e-6) return;
  const sn = norm(s), h = w / 2;
  const at = (P, n, o, side) => add(add(P, n, o), sn, side * h);
  const ILa = at(A, na, oIn, -1), IRa = at(A, na, oIn, 1), OLa = at(A, na, oOut, -1), ORa = at(A, na, oOut, 1);
  const ILb = at(B, nb, oIn, -1), IRb = at(B, nb, oIn, 1), OLb = at(B, nb, oOut, -1), ORb = at(B, nb, oOut, 1);
  mesh.flat(OLa, ORa, ORb, OLb, nm);
  mesh.flat(ILa, OLa, OLb, ILb, [-sn[0], -sn[1], -sn[2]]);
  mesh.flat(ORa, IRa, IRb, ORb, sn);
  if (inner) mesh.flat(IRa, ILa, ILb, IRb, [-nm[0], -nm[1], -nm[2]]);
}

/** Deterministic hash in [0, 1) for the lit windows. */
export const hash01 = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
