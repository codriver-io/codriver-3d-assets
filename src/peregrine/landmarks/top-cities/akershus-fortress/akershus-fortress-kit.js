// Flat-shaded mesh helpers for Akershus. Points are [x, y, z]; plan rings are [[x, z]].
// Winding is chosen from an outward hint, then welded per material for assetBuilder.put.
import * as THREE from 'three';

export function signedArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return a / 2;
}

export function ringEdges(ring) {
  const s = Math.sign(signedArea(ring)) || 1, out = [];
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz);
    if (L < 1e-4) continue;
    out.push({ i, p, q, L, t: [dx / L, dz / L], n: s > 0 ? [dz / L, -dx / L] : [-dz / L, dx / L] });
  }
  return out;
}

export function inside(ring, x, z) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i];
    if ((az > z) !== (bz > z) && x < ((bx - ax) * (z - az)) / (bz - az) + ax) hit = !hit;
  }
  return hit;
}

export function distToRing(ring, x, z) {
  if (inside(ring, x, z)) return 0;
  let d = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i], dx = bx - ax, dz = bz - az, len = dx * dx + dz * dz;
    const t = len ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / len)) : 0;
    d = Math.min(d, Math.hypot(x - ax - dx * t, z - az - dz * t));
  }
  return d;
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export function meshKit() {
  const acc = new Map();
  const bucket = (m) => { let a = acc.get(m); if (!a) acc.set(m, a = { p: [], n: [], i: [] }); return a; };
  const stats = { tris: 0 };

  function tri(m, a, b, c, hint) {
    let g = cross(sub(b, a), sub(c, a));
    if (Math.hypot(...g) < 1e-7) return;
    if (hint && dot(g, hint) < 0) { [b, c] = [c, b]; g = [-g[0], -g[1], -g[2]]; }
    const n = norm(g), s = bucket(m), o = s.p.length / 3;
    s.p.push(...a, ...b, ...c); s.n.push(...n, ...n, ...n); s.i.push(o, o + 1, o + 2); stats.tris++;
  }
  const quad = (m, a, b, c, d, hint) => { tri(m, a, b, c, hint); tri(m, a, c, d, hint); };
  const hint = (n) => [n[0], 0, n[1]];
  const wp = (o, t, n, u, y, d = 0) => [o[0] + t[0] * u + n[0] * d, y, o[1] + t[1] * u + n[1] * d];

  function wall(m, p, q, y0, y1, n) {
    if (y1 - y0 < 1e-3) return;
    quad(m, [p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]], [p[0], y1, p[1]], hint(n));
  }
  function cap(m, ring, y, up = true) {
    const ccw = signedArea(ring) < 0 ? [...ring].reverse() : ring;
    const idx = THREE.ShapeUtils.triangulateShape(ccw.map(([x, z]) => new THREE.Vector2(x, z)), []);
    for (const [i, j, k] of idx) tri(m, [ccw[i][0], y, ccw[i][1]], [ccw[j][0], y, ccw[j][1]], [ccw[k][0], y, ccw[k][1]], [0, up ? 1 : -1, 0]);
  }
  function panel(m, o, t, n, u0, u1, y0, y1, d) {
    quad(m, wp(o, t, n, u0, y0, d), wp(o, t, n, u1, y0, d), wp(o, t, n, u1, y1, d), wp(o, t, n, u0, y1, d), hint(n));
  }
  // A round-headed dark opening painted on a wall. steps is the half-arch tessellation.
  function arch(m, o, t, n, u0, u1, y0, ys, d, steps) {
    const r = (u1 - u0) / 2, um = (u0 + u1) / 2, pts = [[u0, y0], [u1, y0], [u1, ys]];
    for (let k = 1; k < steps; k++) { const a = (k / steps) * Math.PI; pts.push([um + r * Math.cos(a), ys + r * Math.sin(a)]); }
    pts.push([u0, ys]);
    for (let i = 1; i < pts.length - 1; i++) tri(m, wp(o, t, n, pts[0][0], pts[0][1], d), wp(o, t, n, pts[i][0], pts[i][1], d), wp(o, t, n, pts[i + 1][0], pts[i + 1][1], d), hint(n));
  }
  function prism(m, ring, y0, y1, { blockers = [], self = null } = {}) {
    for (const e of ringEdges(ring)) {
      if (buried(e, blockers, self)) continue;
      wall(m, e.p, e.q, y0, y1, e.n);
    }
  }

  function weld({ p, n, i }) {
    const map = new Map(), P = [], N = [], I = [];
    for (const k of i) {
      const x = p[k * 3], y = p[k * 3 + 1], z = p[k * 3 + 2], a = n[k * 3], b = n[k * 3 + 1], c = n[k * 3 + 2];
      const key = `${Math.round(x * 200)},${Math.round(y * 200)},${Math.round(z * 200)},${Math.round(a * 200)},${Math.round(b * 200)},${Math.round(c * 200)}`;
      let j = map.get(key);
      if (j === undefined) { j = P.length / 3; map.set(key, j); P.push(x, y, z); N.push(a, b, c); }
      I.push(j);
    }
    return { p: P, n: N, i: I };
  }
  function flush(b) {
    for (const [m, raw] of acc) {
      if (!raw.i.length) continue;
      const s = weld(raw), g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(s.p, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(s.n, 3));
      g.setIndex(s.i);
      b.put(g, m);
    }
  }
  return { tri, quad, wall, cap, panel, arch, prism, wp, hint, flush, stats };
}

// A wall face is buried when a step just outside it lands in another part.
export function buried(e, blockers, self) {
  const mx = (e.p[0] + e.q[0]) / 2, mz = (e.p[1] + e.q[1]) / 2;
  const ox = mx + e.n[0] * 0.45, oz = mz + e.n[1] * 0.45;
  for (const r of blockers) {
    if (r === self) continue;
    if (inside(r, mx, mz) || inside(r, ox, oz)) return true;
    if (distToRing(r, mx, mz) < 0.55) return true;
  }
  return false;
}
