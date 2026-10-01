import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SPEC } from './config.js';

// Authoring kit for the Conservatory. Everything is authored in the building frame, points as
// [p, y, q]: p along the long axis (east-ish), q across it (south-ish, toward the entrance), y up,
// origin on the dome axis. build() rotates the whole soup by the building's 5.9 deg axis once.
// Faces are flat and oriented by a reference point: a quad/triangle faces away from `ref`.
export const THETA = (SPEC.axisDeg * Math.PI) / 180;

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export function createKit() {
  const soup = new Map();
  let map = null;
  const P = (p) => (map ? map(p) : p);
  const list = (m) => { if (!soup.has(m)) soup.set(m, []); return soup.get(m); };

  function tri(m, a, b, c) {
    const n = cross(sub(b, a), sub(c, a));
    if (len(n) < 1e-7) return;
    list(m).push(...a, ...b, ...c);
  }
  // triangle facing away from ref
  function tri3(m, a, b, c, ref) {
    a = P(a); b = P(b); c = P(c);
    if (ref) {
      const n = cross(sub(b, a), sub(c, a)), ctr = mul(add(add(a, b), c), 1 / 3);
      if (dot(n, sub(ctr, P(ref))) < 0) { tri(m, a, c, b); return; }
    }
    tri(m, a, b, c);
  }
  // quad a-b-c-d facing away from ref
  function quad(m, a, b, c, d, ref) {
    a = P(a); b = P(b); c = P(c); d = P(d);
    if (ref) {
      const n = cross(sub(c, a), sub(d, b)), ctr = mul(add(add(a, b), add(c, d)), 0.25);
      if (dot(n, sub(ctr, P(ref))) < 0) { tri(m, a, c, b); tri(m, a, d, c); return; }
    }
    tri(m, a, b, c); tri(m, a, c, d);
  }
  // box from a centre and three half-extent vectors. `skip` omits faces that are never seen
  // (bit 1 +ex, 2 -ex, 4 +ey, 8 -ey, 16 +ez, 32 -ez): posts drop their top, bottom and inner face.
  function bx(m, c, ex, ey, ez, skip = 0) {
    const k = (sx, sy, sz) => [c[0] + sx * ex[0] + sy * ey[0] + sz * ez[0], c[1] + sx * ex[1] + sy * ey[1] + sz * ez[1], c[2] + sx * ex[2] + sy * ey[2] + sz * ez[2]];
    if (!(skip & 1)) quad(m, k(1, -1, -1), k(1, 1, -1), k(1, 1, 1), k(1, -1, 1), c);
    if (!(skip & 2)) quad(m, k(-1, -1, -1), k(-1, 1, -1), k(-1, 1, 1), k(-1, -1, 1), c);
    if (!(skip & 4)) quad(m, k(-1, 1, -1), k(1, 1, -1), k(1, 1, 1), k(-1, 1, 1), c);
    if (!(skip & 8)) quad(m, k(-1, -1, -1), k(1, -1, -1), k(1, -1, 1), k(-1, -1, 1), c);
    if (!(skip & 16)) quad(m, k(-1, -1, 1), k(1, -1, 1), k(1, 1, 1), k(-1, 1, 1), c);
    if (!(skip & 32)) quad(m, k(-1, -1, -1), k(1, -1, -1), k(1, 1, -1), k(-1, 1, -1), c);
  }
  
  // A bar swept along a polyline. `side` is the (constant) width direction, w its width, t the
  // radial thickness; `off` lifts the bar's centre line off the surface along the outward normal.
  function sweep(m, pts, side, w, t, off, hint = [0, 1, 0], { closed = false, caps = false, inner = false } = {}) {
    const n = pts.length;
    if (n < 2) return;
    const T = pts.map((_, i) => {
      const a = pts[closed ? (i + n - 1) % n : Math.max(0, i - 1)], b = pts[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
      return norm(sub(b, a));
    });
    const mid = Math.floor(n / 2), sign = dot(cross(side, T[mid]), hint) >= 0 ? 1 : -1;
    const secs = pts.map((p, i) => {
      const N = mul(norm(cross(side, T[i])), sign), C = add(p, mul(N, off));
      const s = mul(side, w / 2), r = mul(N, t / 2);
      return { C, c: [add(add(C, s), r), add(sub(C, s), r), sub(sub(C, s), r), sub(add(C, s), r)] };
    });
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const A = secs[i], B = secs[(i + 1) % n];
      for (let k = 0; k < 4; k++) if (inner || k !== 2) quad(m, A.c[k], A.c[(k + 1) % 4], B.c[(k + 1) % 4], B.c[k], A.C); // k = 2 is the face against the glass
    }
    if (caps && !closed) {
      const A = secs[0], B = secs[n - 1];
      quad(m, A.c[0], A.c[1], A.c[2], A.c[3], B.C);
      quad(m, B.c[0], B.c[1], B.c[2], B.c[3], A.C);
    }
  }

  // extrude a polygon [[p, q], ...]: top cap (earcut) and side walls, no bottom
  function prism(m, poly, y0, y1) {
    const v2 = poly.map((q) => new THREE.Vector2(q[0], q[1]));
    const cx = poly.reduce((s, q) => s + q[0], 0) / poly.length, cz = poly.reduce((s, q) => s + q[1], 0) / poly.length;
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(v2, [])) tri3(m, [poly[i][0], y1, poly[i][1]], [poly[j][0], y1, poly[j][1]], [poly[k][0], y1, poly[k][1]], [cx, y0 - 5, cz]);
    // clockwise polygons (shoelace > 0 with q down) have the outward normal (dq, -dp)
    let area = 0;
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; area += a[0] * b[1] - b[0] * a[1]; }
    const sgn = area > 0 ? 1 : -1;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = (sgn * (b[1] - a[1])) / l, nz = (-sgn * (b[0] - a[0])) / l, mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      quad(m, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [mx - nx, (y0 + y1) / 2, mz - nz]);
    }
  }

  // surface of revolution about the vertical axis through c; prof = [[r, y], ...]
  function lathe(m, prof, c, n) {
    const ref = [c[0], prof[0][1] - 0.6, c[2]];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI;
      const at = (r, y, a) => [c[0] + r * Math.cos(a), y, c[2] + r * Math.sin(a)];
      for (let j = 0; j < prof.length - 1; j++) {
        const [r0, y0] = prof[j], [r1, y1] = prof[j + 1];
        quad(m, at(r0, y0, a0), at(r0, y0, a1), at(r1, y1, a1), at(r1, y1, a0), ref);
      }
    }
  }

  // Run fn with every point passed through f (a reflection or shift), restoring afterwards.
  function mapped(f, fn) { const old = map; map = old ? (p) => f(old(p)) : f; fn(); map = old; }

  // Weld, rotate onto the mapped axis and hand each material to the builder as one geometry.
  function flush(b) {
    for (const [m, pos] of soup) {
      const count = pos.length / 3, normals = new Float32Array(pos.length);
      for (let i = 0; i < count; i += 3) {
        const a = pos.slice(i * 3, i * 3 + 3), bb = pos.slice(i * 3 + 3, i * 3 + 6), c = pos.slice(i * 3 + 6, i * 3 + 9);
        const n = norm(cross(sub(bb, a), sub(c, a)));
        for (let k = 0; k < 3; k++) normals.set(n, (i + k) * 3);
      }
      let g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      g.rotateY(THETA);
      g = mergeVertices(g, 1e-4);
      b.put(g, m, 0, 0);
    }
    soup.clear();
  }

  return { tri3, quad, bx, sweep, prism, lathe, mapped, flush };
}

export { sub, add, mul, dot, cross, norm, len };
