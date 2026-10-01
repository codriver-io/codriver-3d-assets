// Geometry helpers for Columbus Tower: a tiny triangle-soup builder whose faces
// are wound toward an intended normal (so nothing can come out inside-out whatever
// the plan's orientation), a wall/face frame for placing boxes and quads in
// wall-local metres, profile sweeps along the plan outline, and a lathe for the
// copper turret, cap ring and dome. Every geometry returned has position, normal
// and an index, ready for assetBuilder().put().
import * as THREE from 'three';

/** Accumulates vertices/faces. Faces are wound so their geometric normal matches `hint`. */
export class Mesh {
  constructor() { this.p = []; this.n = []; this.i = []; }
  get count() { return this.p.length / 3; }
  vertex(pt, nrm) { this.p.push(pt[0], pt[1], pt[2]); this.n.push(nrm[0], nrm[1], nrm[2]); return this.count - 1; }
  /** Flat quad a,b,c,d (in order round the quad), facing `hint` (or as ordered when omitted). */
  quad(a, b, c, d, hint) {
    const e1 = sub(b, a), e2 = sub(c, a);
    let nrm = cross(e1, e2);
    let len = Math.hypot(...nrm);
    if (len < 1e-9) { nrm = cross(sub(c, a), sub(d, a)); len = Math.hypot(...nrm); }
    if (len < 1e-9) return;
    nrm = nrm.map((v) => v / len);
    let order = [a, b, c, d];
    if (hint && dot(nrm, hint) < 0) { order = [a, d, c, b]; nrm = nrm.map((v) => -v); }
    const base = this.count;
    for (const q of order) this.vertex(q, nrm);
    this.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  tri(a, b, c, hint) {
    let nrm = cross(sub(b, a), sub(c, a));
    const len = Math.hypot(...nrm);
    if (len < 1e-9) return;
    nrm = nrm.map((v) => v / len);
    let order = [a, b, c];
    if (hint && dot(nrm, hint) < 0) { order = [a, c, b]; nrm = nrm.map((v) => -v); }
    const base = this.count;
    for (const q of order) this.vertex(q, nrm);
    this.i.push(base, base + 1, base + 2);
  }
  /** Quad with per-vertex normals; the winding follows their average. */
  smoothQuad(a, b, c, d, na, nb, nc, nd) {
    const avg = [na[0] + nb[0] + nc[0] + nd[0], na[1] + nb[1] + nc[1] + nd[1], na[2] + nb[2] + nc[2] + nd[2]];
    let order = [[a, na], [b, nb], [c, nc], [d, nd]];
    if (dot(cross(sub(b, a), sub(c, a)), avg) < 0) order = [[a, na], [d, nd], [c, nc], [b, nb]];
    const base = this.count;
    for (const [q, nn] of order) this.vertex(q, nn);
    this.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setIndex(this.i);
    return g;
  }
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * A vertical wall (or oriel face) frame: `o` is the plan point where s = 0, `t` the unit
 * tangent along the face (plan), `n` the outward unit normal (plan). Local coordinates are
 * (s along, y up, out from the face).
 */
export class Frame {
  constructor(o, t, n) { this.o = o; this.t = t; this.n = n; }
  pt(s, y, out = 0) { return [this.o[0] + this.t[0] * s + this.n[0] * out, y, this.o[1] + this.t[1] * s + this.n[1] * out]; }
  get normal() { return [this.n[0], 0, this.n[1]]; }
  /** A frame shifted by s0 along and `out` outward. */
  at(s0, out = 0) { return new Frame([this.o[0] + this.t[0] * s0 + this.n[0] * out, this.o[1] + this.t[1] * s0 + this.n[1] * out], this.t, this.n); }
  /** A face outward from this one, turned by `deg` (positive turns toward the +t side, as seen from above with +Z south). */
  turned(s, out, deg) {
    const a = deg * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
    const t = [this.t[0] * c - this.t[1] * sn, this.t[0] * sn + this.t[1] * c];
    const n = [this.n[0] * c - this.n[1] * sn, this.n[0] * sn + this.n[1] * c];
    return new Frame([this.o[0] + this.t[0] * s + this.n[0] * out, this.o[1] + this.t[1] * s + this.n[1] * out], t, n);
  }
  /** Flat quad on the face plane (offset `out`), facing outward (or inward with flip). */
  quad(mesh, s0, s1, y0, y1, out = 0, flip = false) {
    const nrm = this.normal.map((v) => (flip ? -v : v));
    mesh.quad(this.pt(s0, y0, out), this.pt(s1, y0, out), this.pt(s1, y1, out), this.pt(s0, y1, out), nrm);
  }
  /**
   * Box s0..s1, y0..y1, out o0..o1. `skip` names faces to leave out: 'front' (+out), 'back' (-out),
   * 'left' (s0), 'right' (s1), 'top', 'bottom'. Hidden faces should be skipped by the caller.
   */
  box(mesh, s0, s1, y0, y1, o0, o1, skip = []) {
    const P = (s, y, o) => this.pt(s, y, o), N = this.normal, T = [this.t[0], 0, this.t[1]];
    const neg = (v) => v.map((x) => -x);
    if (!skip.includes('front')) mesh.quad(P(s0, y0, o1), P(s1, y0, o1), P(s1, y1, o1), P(s0, y1, o1), N);
    if (!skip.includes('back')) mesh.quad(P(s0, y0, o0), P(s1, y0, o0), P(s1, y1, o0), P(s0, y1, o0), neg(N));
    if (!skip.includes('left')) mesh.quad(P(s0, y0, o0), P(s0, y0, o1), P(s0, y1, o1), P(s0, y1, o0), neg(T));
    if (!skip.includes('right')) mesh.quad(P(s1, y0, o0), P(s1, y0, o1), P(s1, y1, o1), P(s1, y1, o0), T);
    if (!skip.includes('top')) mesh.quad(P(s0, y1, o0), P(s1, y1, o0), P(s1, y1, o1), P(s0, y1, o1), [0, 1, 0]);
    if (!skip.includes('bottom')) mesh.quad(P(s0, y0, o0), P(s1, y0, o0), P(s1, y0, o1), P(s0, y0, o1), [0, -1, 0]);
  }
  /** A sloped quad (awning, cap): bottom edge at (y0, o0), top edge at (y1, o1) over s0..s1. */
  slope(mesh, s0, s1, y0, o0, y1, o1) {
    const a = this.pt(s0, y0, o0), b = this.pt(s1, y0, o0), c = this.pt(s1, y1, o1), d = this.pt(s0, y1, o1);
    const dy = y1 - y0, dout = o1 - o0, l = Math.hypot(dy, dout) || 1;
    // outward-and-up normal of the sloped plane
    const hint = [this.n[0] * (dy / l), -dout / l, this.n[1] * (dy / l)];
    mesh.quad(a, b, c, d, hint);
  }
}

/**
 * Sweep a 2D `profile` [[offset, y], ...] (offset outward from the outline) along a plan
 * polyline `points` [[x, z], ...]. Corners are mitred; a turn gentler than `smoothDeg`
 * shares its normals (a round apex reads round), a sharper one keeps each wall's own.
 * `sign` is the shoelace sign of the full outline (+1/-1) so an open run knows which side is outside.
 */
export function sweepBand(points, profile, { closed = true, smoothDeg = 30, sign = 0 } = {}) {
  const n = points.length, edges = closed ? n : n - 1;
  let area = 0;
  for (let i = 0; i < n; i++) { const p = points[i], q = points[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; }
  const sgn = sign || (area >= 0 ? 1 : -1);
  const en = [];
  for (let i = 0; i < edges; i++) {
    const p = points[i], q = points[(i + 1) % n], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1;
    en.push([sgn * dz / l, -sgn * dx / l]);
  }
  const vertex = (i) => {
    const a = en[(i - 1 + edges) % edges], b = en[i % edges];
    const hasPrev = closed || i > 0, hasNext = closed || i < edges;
    const pa = hasPrev ? a : b, pb = hasNext ? b : a;
    let mx = pa[0] + pb[0], mz = pa[1] + pb[1]; const ml = Math.hypot(mx, mz);
    if (ml < 1e-6) { mx = pa[0]; mz = pa[1]; } else { mx /= ml; mz /= ml; }
    const cosHalf = Math.max(0.35, mx * pa[0] + mz * pa[1]);
    const turn = Math.acos(Math.max(-1, Math.min(1, pa[0] * pb[0] + pa[1] * pb[1]))) * 180 / Math.PI;
    return { m: [mx, mz], scale: 1 / cosHalf, smooth: turn < smoothDeg };
  };
  const vs = points.map((_, i) => vertex(i));
  const mesh = new Mesh();
  const segs = profile.slice(1).map((q, k) => {
    const p = profile[k], dOff = q[0] - p[0], dY = q[1] - p[1], l = Math.hypot(dOff, dY);
    return l < 1e-9 ? null : { k, nOff: dY / l, nY: -dOff / l };
  });
  for (let e = 0; e < edges; e++) {
    const i = e, j = (e + 1) % n;
    for (const s of segs) {
      if (!s) continue;
      const corner = (vi, pi) => {
        const v = vs[vi], [o, y] = profile[pi], P = points[vi];
        const hn = v.smooth ? v.m : en[e];
        return [[P[0] + v.m[0] * o * v.scale, y, P[1] + v.m[1] * o * v.scale], [hn[0] * s.nOff, s.nY, hn[1] * s.nOff]];
      };
      const [a, na] = corner(i, s.k), [b, nb] = corner(j, s.k), [c, nc] = corner(j, s.k + 1), [d, nd] = corner(i, s.k + 1);
      mesh.smoothQuad(a, b, c, d, na, nb, nc, nd);
    }
  }
  return mesh.geometry();
}

/**
 * Surface of revolution about the vertical axis through `c` [x, z]. `profile` [[radius, y], ...]
 * runs bottom to top along the OUTSIDE. Radii may be 0 at the axis. Adjacent segments share
 * normals when the bend is gentler than `smoothDeg`.
 */
export function lathe(profile, c, segments = 16, { smoothDeg = 40, from = 0, to = Math.PI * 2 } = {}) {
  const segN = profile.slice(1).map((q, k) => {
    const p = profile[k], dr = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dr, dy) || 1;
    return [dy / l, -dr / l]; // (radial, up) components of the outward normal
  });
  const endNormal = (k, side) => { // side 0 = bottom end of segment k, 1 = top end
    const own = segN[k], nb = segN[side ? k + 1 : k - 1];
    if (!nb) return own;
    const cos = own[0] * nb[0] + own[1] * nb[1];
    if (Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI > smoothDeg) return own;
    const m = [own[0] + nb[0], own[1] + nb[1]], l = Math.hypot(m[0], m[1]) || 1;
    return [m[0] / l, m[1] / l];
  };
  const mesh = new Mesh();
  const step = (to - from) / segments;
  for (let s = 0; s < segments; s++) {
    const a0 = from + step * s, a1 = a0 + step;
    for (let k = 0; k < segN.length; k++) {
      const [r0, y0] = profile[k], [r1, y1] = profile[k + 1];
      const pos = (r, y, a) => [c[0] + Math.cos(a) * r, y, c[1] + Math.sin(a) * r];
      const nor = (q, a) => [Math.cos(a) * q[0], q[1], Math.sin(a) * q[0]];
      const n0 = endNormal(k, 0), n1 = endNormal(k, 1);
      if (r0 < 1e-6 && r1 < 1e-6) continue;
      if (r1 < 1e-6) mesh.smoothQuad(pos(r0, y0, a0), pos(r0, y0, a1), pos(0, y1, a1), pos(0, y1, a0), nor(n0, a0), nor(n0, a1), nor(n1, a1), nor(n1, a0));
      else mesh.smoothQuad(pos(r0, y0, a0), pos(r0, y0, a1), pos(r1, y1, a1), pos(r1, y1, a0), nor(n0, a0), nor(n0, a1), nor(n1, a1), nor(n1, a0));
    }
  }
  return mesh.geometry();
}

/** Flat polygon (any simple outline) at height y facing up; triangulated, so concave outlines are fine. */
export function capPolygon(points, y) {
  const mesh = new Mesh();
  const contour = points.map((p) => new THREE.Vector2(p[0], p[1]));
  for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(contour, [])) {
    const pa = points[a], pb = points[b], pc = points[c];
    mesh.tri([pa[0], y, pa[1]], [pb[0], y, pb[1]], [pc[0], y, pc[1]], [0, 1, 0]);
  }
  return mesh.geometry();
}
