// Geometry helpers for Brookfield Place: the rounded-rectangle plan, indexed mesh accumulation with welded vertices,
// and the sweeps (rings, ribs, strips) the curtain wall is built from. Written for this landmark; the tower is a straight
// prism, so unlike a tapering tower the ring does not depend on height.
import * as THREE from 'three';
import { SPEC } from './config.js';

const RAD = Math.PI / 180;
const { halfU: GU, halfV: GV, radius: R, rotationDeg } = SPEC.plan;
const CR = Math.cos(rotationDeg * RAD), SR = Math.sin(rotationDeg * RAD);
const FU = GU - R, FV = GV - R; // half lengths of the straight parts of the long (north, south) and short (east, west) sides

/** Plan frame (u east, v south, turned clockwise onto the mapped outline) to model metres (x east, z south). */
export const planXZ = (u, v) => [u * CR - v * SR, u * SR + v * CR];

/**
 * A point on the glass plane's rounded rectangle, parameter p in [0, 8): even integer spans are the four straight sides
 * (0 east, 2 south, 4 west, 6 north, running clockwise seen from above), odd spans the four corner arcs (0..1 south-east...).
 * `off` pushes the point outward along its plan normal. Returns model-frame [x, z, nx, nz].
 */
export function ringPoint(p, off = 0) {
  p = ((p % 8) + 8) % 8;
  const k = Math.floor(p), t = p - k;
  let u, v, nu, nv;
  switch (k) {
    case 0: u = GU; v = -FV + 2 * FV * t; nu = 1; nv = 0; break;
    case 2: u = FU - 2 * FU * t; v = GV; nu = 0; nv = 1; break;
    case 4: u = -GU; v = FV - 2 * FV * t; nu = -1; nv = 0; break;
    case 6: u = -FU + 2 * FU * t; v = -GV; nu = 0; nv = -1; break;
    default: {
      const c = (k - 1) / 2, cu = [FU, -FU, -FU, FU][c], cv = [FV, FV, -FV, -FV][c], a = (c * 90 + t * 90) * RAD;
      nu = Math.cos(a); nv = Math.sin(a); u = cu + R * nu; v = cv + R * nv;
    }
  }
  u += nu * off; v += nv * off;
  const [x, z] = planXZ(u, v), [nx, nz] = planXZ(nu, nv);
  return [x, z, nx, nz];
}

/** The p values of the ring vertices: both ends of each straight side, and `n` segments per corner. */
export function ringParams(nArc) {
  const list = [];
  for (let k = 0; k < 8; k++) {
    if (k % 2 === 0) list.push(k); else for (let j = 0; j < nArc; j++) list.push(k + j / nArc);
  }
  return list;
}

/** Bay edges around the ring: nEW bays on each short side, nNS on each long side, nA on each corner arc. */
export function bayEdges(nEW, nNS, nA) {
  const edges = [];
  for (let k = 0; k < 8; k++) {
    const n = k % 2 === 1 ? nA : (k % 4 === 0 ? nEW : nNS);
    for (let i = 0; i < n; i++) edges.push(k + i / n);
  }
  return edges;
}

// ---- indexed mesh accumulation ----------------------------------------------------------------------
export class Mesh {
  constructor() { this.pos = []; this.nor = []; this.idx = []; this.welded = new Map(); }
  /** Add (or reuse) a vertex; the key welds identical position+normal so quads share vertices. */
  vertex(p, n) {
    const l = Math.hypot(n[0], n[1], n[2]) || 1, nn = [n[0] / l, n[1] / l, n[2] / l];
    const key = `${p[0].toFixed(3)},${p[1].toFixed(3)},${p[2].toFixed(3)},${nn[0].toFixed(2)},${nn[1].toFixed(2)},${nn[2].toFixed(2)}`;
    let i = this.welded.get(key);
    if (i === undefined) { i = this.pos.length / 3; this.pos.push(p[0], p[1], p[2]); this.nor.push(nn[0], nn[1], nn[2]); this.welded.set(key, i); }
    return i;
  }
  /** Triangle by vertex indices; wound so the geometric normal agrees with the vertex normals. */
  tri(a, b, c) {
    if (a === b || b === c || a === c) return;
    const P = (i) => new THREE.Vector3(this.pos[3 * i], this.pos[3 * i + 1], this.pos[3 * i + 2]);
    const N = (i) => new THREE.Vector3(this.nor[3 * i], this.nor[3 * i + 1], this.nor[3 * i + 2]);
    const pa = P(a), pb = P(b), pc = P(c);
    const g = new THREE.Vector3().crossVectors(pb.clone().sub(pa), pc.clone().sub(pa));
    if (g.lengthSq() < 1e-14) return; // sliver
    const n = N(a).add(N(b)).add(N(c));
    if (g.dot(n) < 0) this.idx.push(a, c, b); else this.idx.push(a, b, c);
  }
  quad(a, b, c, d) { this.tri(a, b, c); this.tri(a, c, d); }
  get triangles() { return this.idx.length / 3; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setIndex(this.idx);
    return g;
  }
}

/** A closed loft of the glass between consecutive heights at offset `off` from the glass plane; `inward` flips it to face the axis. */
export function loft(mesh, ys, params, off = 0, inward = false) {
  const s = inward ? -1 : 1;
  let prev = null;
  for (const y of ys) {
    const row = params.map((p) => { const q = ringPoint(p, off); return mesh.vertex([q[0], y, q[1]], [q[2] * s, 0, q[3] * s]); });
    if (prev) for (let i = 0; i < row.length; i++) { const j = (i + 1) % row.length; mesh.quad(prev[i], prev[j], row[j], row[i]); }
    prev = row;
  }
}

/**
 * Sweep a cross-section around the ring at height y. `section` is a polyline of [off, dy] corners; every segment becomes
 * a band of quads with a flat normal in the (outward, up) plane. `closedSection` joins last to first.
 */
export function sweep(mesh, y, params, section, closedSection = false) {
  const n = section.length, segs = closedSection ? n : n - 1;
  for (let s = 0; s < segs; s++) {
    const [o0, d0] = section[s], [o1, d1] = section[(s + 1) % n];
    const dOff = o1 - o0, dY = d1 - d0, len = Math.hypot(dOff, dY);
    if (len < 1e-9) continue;
    const out = dY / len, up = -dOff / len;
    const row = (o, d) => params.map((p) => { const q = ringPoint(p, o); return mesh.vertex([q[0], y + d, q[1]], [q[2] * out, up, q[3] * out]); });
    const a = row(o0, d0), b = row(o1, d1);
    for (let i = 0; i < a.length; i++) { const j = (i + 1) % a.length; mesh.quad(a[i], a[j], b[j], b[i]); }
  }
}

/**
 * A vertical mullion: a thin box standing on the glass at ring parameter p, rising through `ys`. inner/outer are offsets
 * from the glass plane; `width` is across the fin. `faces` picks which sides are drawn: 'o' outer, 's' both sides.
 */
export function fin(mesh, ys, p, { inner = -0.02, outer = 0.22, width = 0.14, faces = 'os' } = {}) {
  const half = width / 2, wantO = faces.includes('o'), wantS = faces.includes('s');
  const vert = (y, off, side, nrm) => {
    const q = ringPoint(p, off);
    return mesh.vertex([q[0] - q[3] * side * half, y, q[1] + q[2] * side * half], nrm(q));
  };
  const nOut = (q) => [q[2], 0, q[3]], nSide = (sgn) => (q) => [-q[3] * sgn, 0, q[2] * sgn];
  let prev = null;
  for (const y of ys) {
    const cur = {};
    if (wantO) { cur.ol = vert(y, outer, -1, nOut); cur.or = vert(y, outer, 1, nOut); }
    if (wantS) { cur.l0 = vert(y, inner, -1, nSide(-1)); cur.l1 = vert(y, outer, -1, nSide(-1)); cur.r0 = vert(y, inner, 1, nSide(1)); cur.r1 = vert(y, outer, 1, nSide(1)); }
    if (prev) {
      if (wantO) mesh.quad(prev.ol, prev.or, cur.or, cur.ol);
      if (wantS) { mesh.quad(prev.l0, prev.l1, cur.l1, cur.l0); mesh.quad(prev.r0, prev.r1, cur.r1, cur.r0); }
    }
    prev = cur;
  }
}

/**
 * A crown rib: a thin plate standing radially at ring parameter p whose outer edge follows `path`, a polyline of [off, y]
 * (it may lean at the top); the plate reaches back to `inner` behind the path. Outer end face plus both plate faces.
 */
export function rib(mesh, p, path, { inner = -0.2, width = 0.3 } = {}) {
  const half = width / 2, q = ringPoint(p, 0);
  const tx = -q[3], tz = q[2]; // plan tangent
  const v = (off, y, side, n) => { const r = ringPoint(p, off); return mesh.vertex([r[0] + tx * side * half, y, r[1] + tz * side * half], n); };
  for (let i = 0; i + 1 < path.length; i++) {
    const [o0, y0] = path[i], [o1, y1] = path[i + 1], dOff = o1 - o0, dY = y1 - y0, len = Math.hypot(dOff, dY);
    const out = dY / len, up = -dOff / len, nO = [q[2] * out, up, q[3] * out];
    mesh.quad(v(o0, y0, -1, nO), v(o0, y0, 1, nO), v(o1, y1, 1, nO), v(o1, y1, -1, nO));
    for (const side of [-1, 1]) {
      const nS = [tx * side, 0, tz * side];
      mesh.quad(v(inner, y0, side, nS), v(o0, y0, side, nS), v(o1, y1, side, nS), v(inner, y1, side, nS));
    }
  }
}

/** A convex cap (fan from the centre) closing the ring at height y, offset `off` from the glass plane; normal up. */
export function cap(mesh, y, params, off = 0) {
  const c = mesh.vertex([0, y, 0], [0, 1, 0]);
  const row = params.map((p) => { const q = ringPoint(p, off); return mesh.vertex([q[0], y, q[1]], [0, 1, 0]); });
  for (let i = 0; i < row.length; i++) mesh.tri(c, row[i], row[(i + 1) % row.length]);
}

/** A box aligned to the tower plan: u0..u1, v0..v1 in plan metres, rotated into the model frame. */
export function box(mesh, u0, u1, v0, v1, y0, y1) {
  const corners = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  const nrm = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  for (let i = 0; i < 4; i++) {
    const [ua, va] = corners[i], [ub, vb] = corners[(i + 1) % 4], [nu, nv] = nrm[i];
    const [ax, az] = planXZ(ua, va), [bx, bz] = planXZ(ub, vb), [nx, nz] = planXZ(nu, nv), n = [nx, 0, nz];
    mesh.quad(mesh.vertex([ax, y0, az], n), mesh.vertex([bx, y0, bz], n), mesh.vertex([bx, y1, bz], n), mesh.vertex([ax, y1, az], n));
  }
  const top = corners.map(([u, v]) => { const [x, z] = planXZ(u, v); return mesh.vertex([x, y1, z], [0, 1, 0]); });
  mesh.quad(top[0], top[1], top[2], top[3]);
}

// Deterministic hash in [0, 1) for the lit windows.
export const hash01 = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
