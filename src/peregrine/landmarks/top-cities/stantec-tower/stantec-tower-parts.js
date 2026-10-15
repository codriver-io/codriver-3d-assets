import * as THREE from 'three';

// Small flat-shaded mesh and plan-polygon helpers for the Stantec Tower. Plan coordinates are [x east, z south] in metres.

// Flat-shaded triangle soup. Every face gets its own vertices and normal; `hint` picks the winding (the face normal is made to
// point toward it), so callers never reason about clockwise order.
export class Mesh {
  constructor() { this.p = []; this.n = []; this.i = []; }
  tri(a, b, c, hint) {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9) return;
    n = n.map((q) => q / len);
    if (hint && n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) { [b, c] = [c, b]; n = n.map((q) => -q); }
    const o = this.p.length / 3;
    this.p.push(...a, ...b, ...c); this.n.push(...n, ...n, ...n); this.i.push(o, o + 1, o + 2);
  }
  quad(a, b, c, d, hint) { this.tri(a, b, c, hint); this.tri(a, c, d, hint); }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setIndex(this.i);
    return g;
  }
  get empty() { return this.i.length === 0; }
}

export const signedArea = (pts) => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
  return a / 2;
};

// Edges of a plan polygon: endpoints, length, unit tangent and the outward unit normal (orientation independent).
export function edgesOf(pts) {
  const s = signedArea(pts) > 0 ? 1 : -1;
  return pts.map((a, i) => {
    const b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    return { a, b, len, t: [dx / len, dz / len], n: [s * dz / len, -s * dx / len] };
  });
}

// Cut every corner by `c` metres along both of its edges: the octagon-like plan of the shaft.
export function chamfer(pts, c) {
  const out = [];
  pts.forEach((p, i) => {
    const q = pts[(i + pts.length - 1) % pts.length], r = pts[(i + 1) % pts.length];
    for (const o of [q, r]) { const d = Math.hypot(o[0] - p[0], o[1] - p[1]); out.push([p[0] + (o[0] - p[0]) * c / d, p[1] + (o[1] - p[1]) * c / d]); }
  });
  return out;
}

// Mitre offset (positive = outwards).
export function offsetPoly(pts, d) {
  const e = edgesOf(pts);
  return pts.map((p, i) => {
    const n0 = e[(i + pts.length - 1) % pts.length].n, n1 = e[i].n, k = d / (1 + n0[0] * n1[0] + n0[1] * n1[1]);
    return [p[0] + (n0[0] + n1[0]) * k, p[1] + (n0[1] + n1[1]) * k];
  });
}

// Triangulated horizontal cap of a plan polygon at height y(x, z), facing up.
export function cap(mesh, pts, y) {
  const idx = THREE.ShapeUtils.triangulateShape(pts.map((p) => new THREE.Vector2(p[0], p[1])), []);
  for (const [i, j, k] of idx) mesh.tri([pts[i][0], y(pts[i][0], pts[i][1]), pts[i][1]], [pts[j][0], y(pts[j][0], pts[j][1]), pts[j][1]], [pts[k][0], y(pts[k][0], pts[k][1]), pts[k][1]], [0, 1, 0]);
}

// Interval of t in [0, 1] where the linear function f0 + (f1 - f0) t is >= 0, or null.
export function clipRange(f0, f1) {
  if (f0 >= 0 && f1 >= 0) return [0, 1];
  if (f0 < 0 && f1 < 0) return null;
  const t = f0 / (f0 - f1);
  return f0 >= 0 ? [0, t] : [t, 1];
}
export const intersect = (r, s) => (r && s ? (Math.max(r[0], s[0]) < Math.min(r[1], s[1]) - 1e-6 ? [Math.max(r[0], s[0]), Math.min(r[1], s[1])] : null) : null);

// Deterministic hash in [0, 1).
export const hash01 = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
