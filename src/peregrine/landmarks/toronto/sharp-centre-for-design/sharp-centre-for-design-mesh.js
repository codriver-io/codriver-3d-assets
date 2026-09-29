// Flat-shaded quad/prism accumulator over assetBuilder: every primitive is emitted with
// its OUTWARD normal given, and the winding is flipped to agree with it, so no face can
// come out inside-out. Geometry is gathered per material and handed to `put` once, so a
// thousand pixels are one draw.
import * as THREE from 'three';
import { pt } from './sharp-centre-for-design-site.js';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const vec = { sub, cross, dot, len, norm, add, mul };

export function meshKit(builder) {
  const acc = new Map();
  const bucket = (m) => { if (!acc.has(m)) acc.set(m, { p: [], n: [], i: [] }); return acc.get(m); };
  /** Quad p0..p3 (a loop) whose front side faces `n`. */
  function quad(mat, p0, p1, p2, p3, n) {
    const g = bucket(mat), base = g.p.length / 3, geo = cross(sub(p1, p0), sub(p2, p0));
    const flip = dot(geo, n) < 0;
    for (const p of [p0, p1, p2, p3]) { g.p.push(...p); g.n.push(...n); }
    if (flip) g.i.push(base, base + 2, base + 1, base, base + 3, base + 2); else g.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  function tri(mat, p0, p1, p2, n) {
    const g = bucket(mat), base = g.p.length / 3, flip = dot(cross(sub(p1, p0), sub(p2, p0)), n) < 0;
    for (const p of [p0, p1, p2]) { g.p.push(...p); g.n.push(...n); }
    g.i.push(...(flip ? [base, base + 2, base + 1] : [base, base + 1, base + 2]));
  }
  /** Box in the (u, y, v) frame; `skip` names faces to leave out: '+u' '-u' '+v' '-v' 'top' 'bottom'. */
  function ubox(mat, u0, u1, y0, y1, v0, v1, skip = []) {
    const P = (u, y, v) => pt(u, y, v);
    const nu = pt(1, 0, 0), nv = pt(0, 0, 1);
    const faces = {
      '+u': [[u1, y0, v0], [u1, y0, v1], [u1, y1, v1], [u1, y1, v0], nu],
      '-u': [[u0, y0, v0], [u0, y0, v1], [u0, y1, v1], [u0, y1, v0], mul(nu, -1)],
      '+v': [[u0, y0, v1], [u1, y0, v1], [u1, y1, v1], [u0, y1, v1], nv],
      '-v': [[u0, y0, v0], [u1, y0, v0], [u1, y1, v0], [u0, y1, v0], mul(nv, -1)],
      top: [[u0, y1, v0], [u1, y1, v0], [u1, y1, v1], [u0, y1, v1], [0, 1, 0]],
      bottom: [[u0, y0, v0], [u1, y0, v0], [u1, y0, v1], [u0, y0, v1], [0, -1, 0]],
    };
    for (const [name, f] of Object.entries(faces)) if (!skip.includes(name)) quad(mat, P(...f[0]), P(...f[1]), P(...f[2]), P(...f[3]), f[4]);
  }
  /** Box along a to b with a width x depth cross-section, `hint` fixing which way its width lies. */
  function orientedBox(mat, a, b, width, depth, hint = [0, 1, 0]) {
    const d = norm(sub(b, a)), w = norm(cross(hint, d)), h = norm(cross(d, w));
    const c = (p, sw, sh) => add(add(p, mul(w, sw * width / 2)), mul(h, sh * depth / 2));
    const A = (sw, sh) => c(a, sw, sh), B = (sw, sh) => c(b, sw, sh);
    quad(mat, A(-1, 1), A(1, 1), B(1, 1), B(-1, 1), h);
    quad(mat, A(-1, -1), A(1, -1), B(1, -1), B(-1, -1), mul(h, -1));
    quad(mat, A(1, -1), A(1, 1), B(1, 1), B(1, -1), w);
    quad(mat, A(-1, -1), A(-1, 1), B(-1, 1), B(-1, -1), mul(w, -1));
    quad(mat, A(-1, -1), A(1, -1), A(1, 1), A(-1, 1), mul(d, -1));
    quad(mat, B(-1, -1), B(1, -1), B(1, 1), B(-1, 1), d);
  }
  /**
   * A tapered spindle from a to b. `profile` is [[t, radius], ...] along the axis (t in 0..1),
   * `sides` the facets round it; normals are radial so it shades round, not faceted.
   */
  function spindle(mat, a, b, profile, sides, caps = true) {
    const d = norm(sub(b, a)), l = len(sub(b, a));
    const seed = Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const e1 = norm(cross(d, seed)), e2 = cross(d, e1);
    const g = bucket(mat), base = g.p.length / 3;
    for (const [t, r] of profile) for (let s = 0; s < sides; s++) {
      const ang = s / sides * Math.PI * 2, dir = add(mul(e1, Math.cos(ang)), mul(e2, Math.sin(ang)));
      g.p.push(...add(add(a, mul(d, t * l)), mul(dir, r))); g.n.push(...dir);
    }
    for (let k = 0; k < profile.length - 1; k++) for (let s = 0; s < sides; s++) {
      const p = base + k * sides + s, q = base + k * sides + (s + 1) % sides, p2 = p + sides, q2 = q + sides;
      g.i.push(p, q, p2, q, q2, p2); // e1 x e2 = axis, so this winds outward
    }
    if (caps) for (const [end, dir] of [[0, mul(d, -1)], [profile.length - 1, d]]) {
      const centre = g.p.length / 3; g.p.push(...add(a, mul(d, profile[end][0] * l))); g.n.push(...dir);
      const ring = g.p.length / 3;
      for (let s = 0; s < sides; s++) {
        const ang = s / sides * Math.PI * 2, rd = add(mul(e1, Math.cos(ang)), mul(e2, Math.sin(ang)));
        g.p.push(...add(add(a, mul(d, profile[end][0] * l)), mul(rd, profile[end][1]))); g.n.push(...dir);
      }
      for (let s = 0; s < sides; s++) g.i.push(...(end ? [centre, ring + s, ring + (s + 1) % sides] : [centre, ring + (s + 1) % sides, ring + s]));
    }
  }
  /** Hand every material's geometry to the assetBuilder (one draw each). */
  function flush() {
    for (const [mat, g] of acc) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(g.p, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(g.n, 3));
      geo.setIndex(g.i);
      builder.put(geo, mat, 0, 0);
    }
    acc.clear();
  }
  return { quad, tri, ubox, orientedBox, spindle, flush, bucket };
}
