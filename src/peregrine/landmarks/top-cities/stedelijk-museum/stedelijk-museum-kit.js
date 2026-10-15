import * as THREE from 'three';
import { Earcut } from 'three/src/extras/Earcut.js';
import { ccw, area } from './stedelijk-museum-plan.js';

// One buffer per material, explicit outward normals, welded before assetBuilder merges.
export function meshKit() {
  const buffers = new Map();
  function tri(mat, a, b, c) {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    let n = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    const l = Math.hypot(n[0], n[1], n[2]) || 1;
    n = [n[0] / l, n[1] / l, n[2] / l];
    const s = buffers.get(mat) || { p: [], n: [] };
    buffers.set(mat, s);
    s.p.push(...a, ...b, ...c);
    s.n.push(...n, ...n, ...n);
  }
  function face(mat, pts, outward) {
    const ab = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]];
    const ad = [pts[pts.length - 1][0] - pts[0][0], pts[pts.length - 1][1] - pts[0][1], pts[pts.length - 1][2] - pts[0][2]];
    const n = [
      ab[1] * ad[2] - ab[2] * ad[1],
      ab[2] * ad[0] - ab[0] * ad[2],
      ab[0] * ad[1] - ab[1] * ad[0],
    ];
    if (n[0] * outward[0] + n[1] * outward[1] + n[2] * outward[2] < 0) pts = pts.slice().reverse();
    for (let i = 1; i < pts.length - 1; i++) tri(mat, pts[0], pts[i], pts[i + 1]);
  }
  function quad(mat, a, b, c, d, outward) { face(mat, [a, b, c, d], outward); }
  function cap(mat, ring, y, up) {
    const r = ccw(ring);
    if (Math.abs(area(r)) < 0.05) return;
    const flat = r.flat();
    const ix = Earcut.triangulate(flat, null, 2);
    for (let i = 0; i < ix.length; i += 3) {
      const pts = [ix[i], ix[i + 1], ix[i + 2]].map((k) => [r[k][0], y, r[k][1]]);
      face(mat, pts, [0, up, 0]);
    }
  }
  // Vertical walls of a CCW ring. y1 may be a function (x, z) => height.
  function walls(mat, ring, y0, y1) {
    const r = ccw(ring);
    const top = (p) => (typeof y1 === 'function' ? y1(p[0], p[1]) : y1);
    const bot = (p) => (typeof y0 === 'function' ? y0(p[0], p[1]) : y0);
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length];
      const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
      const ox = dz / l, oz = -dx / l;
      quad(mat,
        [a[0], bot(a), a[1]], [b[0], bot(b), b[1]], [b[0], top(b), b[1]], [a[0], top(a), a[1]],
        [ox, 0, oz]);
    }
  }
  // mode 'sides' skips the two ay caps so a lid can meet the piece under it on an edge.
  function box(mat, center, ax, ay, az, sx, sy, sz, mode = 'all') {
    const c = (x, y, z) => [
      center[0] + ax[0] * x + ay[0] * y + az[0] * z,
      center[1] + ax[1] * x + ay[1] * y + az[1] * z,
      center[2] + ax[2] * x + ay[2] * y + az[2] * z,
    ];
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const v = (i, j, k) => c(i * hx, j * hy, k * hz);
    const q = (pts, dir) => face(mat, pts, dir);
    q([v(1, -1, -1), v(1, -1, 1), v(1, 1, 1), v(1, 1, -1)], ax);
    q([v(-1, -1, 1), v(-1, -1, -1), v(-1, 1, -1), v(-1, 1, 1)], [-ax[0], -ax[1], -ax[2]]);
    if (mode !== 'sides' && mode !== 'noTop') q([v(-1, 1, -1), v(1, 1, -1), v(1, 1, 1), v(-1, 1, 1)], ay);
    if (mode !== 'sides' && mode !== 'noBottom') q([v(-1, -1, 1), v(1, -1, 1), v(1, -1, -1), v(-1, -1, -1)], [-ay[0], -ay[1], -ay[2]]);
    q([v(-1, -1, 1), v(-1, 1, 1), v(1, 1, 1), v(1, -1, 1)], az);
    q([v(1, -1, -1), v(1, 1, -1), v(-1, 1, -1), v(-1, -1, -1)], [-az[0], -az[1], -az[2]]);
  }
  function smooth(mat, positions, normals, indices) {
    const s = buffers.get(mat) || { p: [], n: [] };
    buffers.set(mat, s);
    for (const ix of indices) {
      s.p.push(positions[ix * 3], positions[ix * 3 + 1], positions[ix * 3 + 2]);
      s.n.push(normals[ix * 3], normals[ix * 3 + 1], normals[ix * 3 + 2]);
    }
  }
  function flush(builder) {
    for (const [mat, s] of buffers) {
      const p = [], n = [], ix = [], keys = new Map();
      for (let i = 0; i < s.p.length; i += 3) {
        const key = [...s.p.slice(i, i + 3), ...s.n.slice(i, i + 3)].map((v) => Math.round(v * 1e4)).join(',');
        let k = keys.get(key);
        if (k === undefined) {
          k = p.length / 3;
          keys.set(key, k);
          p.push(...s.p.slice(i, i + 3));
          n.push(...s.n.slice(i, i + 3));
        }
        ix.push(k);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(n, 3));
      g.setIndex(ix);
      builder.put(g, mat);
    }
    buffers.clear();
  }
  return { tri, face, quad, cap, walls, box, smooth, flush };
}
