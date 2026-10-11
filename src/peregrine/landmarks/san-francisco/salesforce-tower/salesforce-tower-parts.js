// Geometry helpers for the Salesforce Tower: the tapering rounded-square plan, indexed mesh
// accumulation with welded vertices, and the sweeps (rings, ribbons, strips) the facade is built from.
import * as THREE from 'three';
import { SPEC } from './config.js';

const RAD = Math.PI / 180;
export const BETA = SPEC.planBearingDeg * RAD;
const SB = Math.sin(BETA), CB = Math.cos(BETA);

// ---- the plan ---------------------------------------------------------------------------------
// The outer envelope (glass plus fins) of one floor is a rounded square, authored in a plan frame (u, v)
// and rotated into the model frame (+X east, +Z south) so that u runs along bearing planBearingDeg.
export const ROOF_Y = SPEC.roofY, TOP_Y = SPEC.height, LOBBY_Y = SPEC.lobbyY, PITCH = SPEC.floorPitch;
export const FIN_OUT = SPEC.sunshadeOut; // how far the sunshades stand proud of the glass (m)
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** Envelope half-side S and corner radius R at height y (outer edge of the sunshades): one smooth law, no kink at the roof. */
export function envelope(y) {
  const { baseHalf, baseRadius, taperStartY, taperPower, topWidth, topRho, rhoPower } = SPEC.plan;
  const s = 1 - (1 - topWidth) * Math.pow(clamp01((y - taperStartY) / (TOP_Y - taperStartY)), taperPower);
  const rho0 = baseRadius / baseHalf, rho = rho0 + (topRho - rho0) * Math.pow(clamp01(y / TOP_Y), rhoPower);
  const S = baseHalf * s;
  return { S, R: S * rho };
}

/**
 * A point on the rounded square, parameter p in [0, 8): even integer spans are the four straight sides,
 * odd spans the four corner arcs. `off` pushes the point outward along its plan normal, from the GLASS
 * surface (which sits FIN_OUT inside the envelope). Returns model-frame [x, z, nx, nz].
 */
export function ringPoint(y, p, off = 0) {
  const { S, R } = envelope(y);
  const G = S - FIN_OUT, Rg = Math.max(0.3, R - FIN_OUT), f = G - Rg; // f: half length of a straight side
  p = ((p % 8) + 8) % 8; // the ring is closed: p = 8 is p = 0, and a small negative step wraps
  const k = Math.floor(p), t = p - k;
  let u, v, nu, nv;
  switch (k) {
    case 0: u = G; v = -f + 2 * f * t; nu = 1; nv = 0; break;
    case 2: u = f - 2 * f * t; v = G; nu = 0; nv = 1; break;
    case 4: u = -G; v = f - 2 * f * t; nu = -1; nv = 0; break;
    case 6: u = -f + 2 * f * t; v = -G; nu = 0; nv = -1; break;
    default: {
      // corner c is centred on (cu, cv) and sweeps 90 degrees from the end of one side to the start of the next
      const c = (k - 1) / 2, cu = [f, -f, -f, f][c], cv = [f, f, -f, -f][c], a = (c * 90 + t * 90) * RAD;
      nu = Math.cos(a); nv = Math.sin(a); u = cu + Rg * nu; v = cv + Rg * nv;
    }
  }
  u += nu * off; v += nv * off;
  return [u * SB + v * CB, -u * CB + v * SB, nu * SB + nv * CB, -nu * CB + nv * SB];
}

/** The p values of the ring vertices: both ends of each straight side, and `n` segments per corner. */
export function ringParams(nArc) {
  const list = [];
  for (let k = 0; k < 8; k++) {
    if (k % 2 === 0) list.push(k); else for (let j = 0; j < nArc; j++) list.push(k + j / nArc);
  }
  return list;
}

// ---- indexed mesh accumulation -----------------------------------------------------------------
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
    if (g.dot(n) < 0) { this.idx.push(a, c, b); } else this.idx.push(a, b, c);
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

// Outward 3D normal of the glass loft at (y, p): the numeric normal of the (y, p) surface, oriented
// away from the axis, so the slight inward lean of the taper shows in the shading.
export function glassNormal(y, p, off = 0) {
  const h = 0.5, e = 0.01;
  const a = ringPoint(y + h, p, off), b = ringPoint(Math.max(0, y - h), p, off);
  const c = ringPoint(y, p + e, off), d = ringPoint(y, p - e, off);
  const ty = new THREE.Vector3(a[0] - b[0], y + h - Math.max(0, y - h), a[1] - b[1]);
  const tp = new THREE.Vector3(c[0] - d[0], 0, c[1] - d[1]);
  const n = new THREE.Vector3().crossVectors(tp, ty).normalize();
  const o = ringPoint(y, p, off);
  if (n.x * o[2] + n.z * o[3] < 0) n.negate();
  return n.toArray();
}

/** A closed loft of the glass between consecutive rings (heights), at a given offset from the glass plane. */
export function loft(mesh, ys, params, off = 0) {
  let prev = null;
  for (const y of ys) {
    const row = params.map((p) => {
      const o = ringPoint(y, p, off);
      return mesh.vertex([o[0], y, o[1]], glassNormal(y, p, off));
    });
    if (prev) for (let i = 0; i < row.length; i++) { const j = (i + 1) % row.length; mesh.quad(prev[i], prev[j], row[j], row[i]); }
    prev = row;
  }
}

/**
 * Sweep a cross-section around the ring at height y. `section` is a list of [off, dy] corners (a polyline);
 * every segment becomes a band of quads with a flat normal in the (outward, up) plane. `closedSection`
 * joins last to first.
 */
export function sweep(mesh, y, params, section, closedSection = false) {
  const n = section.length, segs = closedSection ? n : n - 1;
  for (let s = 0; s < segs; s++) {
    const [o0, d0] = section[s], [o1, d1] = section[(s + 1) % n];
    const dOff = o1 - o0, dY = d1 - d0, len = Math.hypot(dOff, dY);
    if (len < 1e-9) continue;
    // the section runs "forward"; its outward-left normal in (out, up) is (dY, -dOff) / len for a CCW profile
    const out = dY / len, up = -dOff / len;
    const row = (o, d) => params.map((p) => {
      const q = ringPoint(y, p, o);
      return mesh.vertex([q[0], y + d, q[1]], [q[2] * out, up, q[3] * out]);
    });
    const a = row(o0, d0), b = row(o1, d1);
    for (let i = 0; i < a.length; i++) { const j = (i + 1) % a.length; mesh.quad(a[i], a[j], b[j], b[i]); }
  }
}

/**
 * A vertical fin: a thin box standing on the glass at ring parameter p, rising through `ys`.
 * inner/outer are offsets from the glass plane; `width` is across the fin. `faces` picks which sides get
 * drawn: 'o' outer, 's' both sides, 'i' inner.
 */
export function fin(mesh, ys, p, { inner = -0.02, outer = 0.5, width = 0.2, faces = 'os' } = {}) {
  const half = width / 2, wantO = faces.includes('o'), wantS = faces.includes('s'), wantI = faces.includes('i');
  const vert = (y, off, side, nrm) => {
    const q = ringPoint(y, p, off); // the tangent is the plan normal turned 90 degrees
    return mesh.vertex([q[0] - q[3] * side * half, y, q[1] + q[2] * side * half], nrm(q));
  };
  const nOut = (q) => [q[2], 0, q[3]], nIn = (q) => [-q[2], 0, -q[3]];
  const nSide = (sgn) => (q) => [-q[3] * sgn, 0, q[2] * sgn];
  let prev = null;
  for (const y of ys) {
    const cur = {};
    if (wantO) { cur.ol = vert(y, outer, -1, nOut); cur.or = vert(y, outer, 1, nOut); }
    if (wantS) { cur.l0 = vert(y, inner, -1, nSide(-1)); cur.l1 = vert(y, outer, -1, nSide(-1)); cur.r0 = vert(y, inner, 1, nSide(1)); cur.r1 = vert(y, outer, 1, nSide(1)); }
    if (wantI) { cur.il = vert(y, inner, -1, nIn); cur.ir = vert(y, inner, 1, nIn); }
    if (prev) {
      if (wantO) mesh.quad(prev.ol, prev.or, cur.or, cur.ol);
      if (wantS) { mesh.quad(prev.l0, prev.l1, cur.l1, cur.l0); mesh.quad(prev.r0, prev.r1, cur.r1, cur.r0); }
      if (wantI) mesh.quad(prev.il, prev.ir, cur.ir, cur.il);
    }
    prev = cur;
  }
}

/** A convex cap (fan from the centre) closing the ring at height y; normal up. */
export function cap(mesh, y, params, off = 0, up = 1) {
  const c = mesh.vertex([0, y, 0], [0, up, 0]);
  const row = params.map((p) => { const q = ringPoint(y, p, off); return mesh.vertex([q[0], y, q[1]], [0, up, 0]); });
  for (let i = 0; i < row.length; i++) mesh.tri(c, row[i], row[(i + 1) % row.length]);
}

/** An axis-aligned (in the plan frame) box, rotated into the model frame. u0..u1, v0..v1 in plan metres. */
export function box(mesh, u0, u1, v0, v1, y0, y1, { bottom = false } = {}) {
  const P = (u, v) => [u * SB + v * CB, -u * CB + v * SB];
  const corners = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  const nrm = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  for (let i = 0; i < 4; i++) {
    const [ua, va] = corners[i], [ub, vb] = corners[(i + 1) % 4], [nu, nv] = nrm[i];
    const [ax, az] = P(ua, va), [bx, bz] = P(ub, vb), [nx, nz] = P(nu, nv);
    const n = [nx, 0, nz];
    mesh.quad(mesh.vertex([ax, y0, az], n), mesh.vertex([bx, y0, bz], n), mesh.vertex([bx, y1, bz], n), mesh.vertex([ax, y1, az], n));
  }
  const top = corners.map(([u, v]) => { const [x, z] = P(u, v); return mesh.vertex([x, y1, z], [0, 1, 0]); });
  mesh.quad(top[0], top[1], top[2], top[3]);
  if (bottom) { const bot = corners.map(([u, v]) => { const [x, z] = P(u, v); return mesh.vertex([x, y0, z], [0, -1, 0]); }); mesh.quad(bot[0], bot[1], bot[2], bot[3]); }
}

// Deterministic hash in [0, 1) for the lit windows.
export const hash01 = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
