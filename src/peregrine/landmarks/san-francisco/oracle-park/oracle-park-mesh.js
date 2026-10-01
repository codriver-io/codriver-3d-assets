import * as THREE from 'three';

// Flat-shaded triangle accumulator for one material, plus the 2D helpers the Oracle Park
// modules share. Points are [x, y, z] (x east, y up, z south); 2D points are [x, z].
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export class Buf {
  constructor() { this.pos = []; this.nor = []; this.idx = []; }
  // One triangle. `hint` (a vector the face should point toward) fixes the winding.
  tri(a, b, c, hint) {
    let n = cross(sub(b, a), sub(c, a));
    const len = Math.hypot(...n);
    if (len < 1e-7) return;
    if (hint && dot(n, hint) < 0) { [b, c] = [c, b]; n = n.map((v) => -v); }
    n = n.map((v) => v / len);
    const base = this.pos.length / 3;
    this.pos.push(...a, ...b, ...c); this.nor.push(...n, ...n, ...n); this.idx.push(base, base + 1, base + 2);
  }
  quad(a, b, c, d, hint) { this.tri(a, b, c, hint); this.tri(a, c, d, hint); }
  // Triangulated planar polygon at height y (2D ring [x, z]); faces up unless `down`.
  cap(ring, y, down = false, holes = []) {
    const pts = ring.map((p) => new THREE.Vector2(p[0], p[1]));
    const hs = holes.map((h) => h.map((p) => new THREE.Vector2(p[0], p[1])));
    const faces = THREE.ShapeUtils.triangulateShape(pts, hs);
    const all = [...ring, ...holes.flat()];
    for (const [i, j, k] of faces) this.tri([all[i][0], y, all[i][1]], [all[j][0], y, all[j][1]], [all[k][0], y, all[k][1]], [0, down ? -1 : 1, 0]);
  }
  // Same polygon, but in an arbitrary plane: points are 3D.
  poly3(points, hint) {
    const n = [0, 0, 0];
    for (let i = 0; i < points.length; i++) { const c = cross(points[i], points[(i + 1) % points.length]); n[0] += c[0]; n[1] += c[1]; n[2] += c[2]; }
    const ax = [Math.abs(n[0]), Math.abs(n[1]), Math.abs(n[2])], drop = ax.indexOf(Math.max(...ax));
    const keep = [0, 1, 2].filter((i) => i !== drop);
    const pts = points.map((p) => new THREE.Vector2(p[keep[0]], p[keep[1]]));
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(pts, [])) this.tri(points[i], points[j], points[k], hint || n);
  }
  // Axis-aligned or rotated box (centre, [sx, sy, sz], yaw about +y), 5 faces (no bottom) unless `bottom`.
  box(c, s, yaw = 0, bottom = false) {
    const co = Math.cos(yaw), si = Math.sin(yaw), hx = s[0] / 2, hz = s[2] / 2, y0 = c[1] - s[1] / 2, y1 = c[1] + s[1] / 2;
    const p = (u, v, y) => [c[0] + u * co + v * si, y, c[2] - u * si + v * co];
    const A = p(-hx, -hz, y0), B = p(hx, -hz, y0), C = p(hx, hz, y0), D = p(-hx, hz, y0);
    const E = p(-hx, -hz, y1), F = p(hx, -hz, y1), G = p(hx, hz, y1), H = p(-hx, hz, y1), ctr = [c[0], c[1], c[2]];
    const out = (a, b, c2, d) => { const m = [(a[0] + c2[0]) / 2 - ctr[0], (a[1] + c2[1]) / 2 - ctr[1], (a[2] + c2[2]) / 2 - ctr[2]]; this.quad(a, b, c2, d, m); };
    out(E, F, G, H); out(A, B, F, E); out(B, C, G, F); out(C, D, H, G); out(D, A, E, H);
    if (bottom) out(A, D, C, B);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setIndex(this.idx);
    return g;
  }
  get triangles() { return this.idx.length / 3; }
}

export const pointInRing = (p, ring) => {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j];
    if ((zi > p[1]) !== (zj > p[1]) && p[0] < (xj - xi) * (p[1] - zi) / (zj - zi) + xi) c = !c;
  }
  return c;
};

// Nearest hit of the ray o + t d (t > eps) with the segments of `ring` (closed) or `line` (open).
export function rayHit(o, d, pts, closed = true, skipEdge = -1) {
  let best = null;
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    if (i === skipEdge) continue;
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const ex = b[0] - a[0], ez = b[1] - a[1], den = d[0] * ez - d[1] * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((a[0] - o[0]) * ez - (a[1] - o[1]) * ex) / den, u = ((a[0] - o[0]) * d[1] - (a[1] - o[1]) * d[0]) / den;
    if (t > 0.05 && u >= -1e-9 && u <= 1 + 1e-9 && (!best || t < best.t)) best = { t, u, edge: i, point: [o[0] + d[0] * t, o[1] + d[1] * t] };
  }
  return best;
}

export const norm2 = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
export const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const centroid = (ring) => ring.reduce((s, p) => [s[0] + p[0] / ring.length, s[1] + p[1] / ring.length], [0, 0]);
