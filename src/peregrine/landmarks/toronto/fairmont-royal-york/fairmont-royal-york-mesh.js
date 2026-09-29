// A tiny flat-shaded mesh kit for the Royal York: quads and fans with an outward-normal hint
// (the winding is fixed from the hint, so nothing here can come out inside-out), merged per material
// and handed to assetBuilder.put. Points are [x, y, z]; wall frames are (o, t, n): a plan point on the
// wall, its unit tangent and its unit outward normal, all in the (x, z) plane.
import * as THREE from 'three';
import { signedArea } from './fairmont-royal-york-site.js';

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
    if (Math.hypot(...g) < 1e-9) return; // sliver
    if (hint && dot(g, hint) < 0) { [b, c] = [c, b]; g = [-g[0], -g[1], -g[2]]; }
    const n = norm(g), s = bucket(m), o = s.p.length / 3;
    s.p.push(...a, ...b, ...c); s.n.push(...n, ...n, ...n); s.i.push(o, o + 1, o + 2); stats.tris++;
  }
  const quad = (m, a, b, c, d, hint) => { tri(m, a, b, c, hint); tri(m, a, c, d, hint); };
  // Convex polygon as a fan from its first point.
  function fan(m, pts, hint) { for (let i = 1; i < pts.length - 1; i++) tri(m, pts[0], pts[i], pts[i + 1], hint); }
  // Any simple polygon ring [[x, z]] at height y (ear clipping), facing up (or down).
  function cap(m, ring, y, up = true) {
    const idx = THREE.ShapeUtils.triangulateShape(ring.map(([x, z]) => new THREE.Vector2(x, z)), []);
    for (const [i, j, k] of idx) tri(m, [ring[i][0], y, ring[i][1]], [ring[j][0], y, ring[j][1]], [ring[k][0], y, ring[k][1]], [0, up ? 1 : -1, 0]);
  }
  // Outward normal of each edge of a ring, whichever way it winds.
  function edges(ring) {
    const s = Math.sign(signedArea(ring)) || 1, out = [];
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz);
      if (L < 1e-6) continue;
      out.push({ i, p, q, L, t: [dx / L, dz / L], n: s > 0 ? [dz / L, -dx / L] : [-dz / L, dx / L] });
    }
    return out;
  }
  // The point at wall coordinate u (along t), height y, and offset d out of the wall.
  const wp = (o, t, n, u, y, d = 0) => [o[0] + t[0] * u + n[0] * d, y, o[1] + t[1] * u + n[1] * d];
  const hint = (n) => [n[0], 0, n[1]];

  // Plain wall from ring points, y0..y1.
  function wall(m, p, q, y0, y1, n) { quad(m, [p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]], [p[0], y1, p[1]], hint(n)); }
  function walls(m, ring, y0, y1) { for (const e of edges(ring)) wall(m, e.p, e.q, y0, y1, e.n); }

  // A protruding block on a wall: u0..u1 along, y0..y1 up, depth d out. Five faces (the back is the wall).
  function slab(m, o, t, n, u0, u1, y0, y1, d, { bottom = true, top = true, sides = true } = {}) {
    const A = wp(o, t, n, u0, y0), B = wp(o, t, n, u1, y0), C = wp(o, t, n, u1, y1), D = wp(o, t, n, u0, y1);
    const A2 = wp(o, t, n, u0, y0, d), B2 = wp(o, t, n, u1, y0, d), C2 = wp(o, t, n, u1, y1, d), D2 = wp(o, t, n, u0, y1, d);
    quad(m, A2, B2, C2, D2, hint(n));
    if (top) quad(m, D, C, C2, D2, [0, 1, 0]);
    if (bottom) quad(m, A, B, B2, A2, [0, -1, 0]);
    if (sides) { quad(m, A, A2, D2, D, [-t[0], 0, -t[1]]); quad(m, B, B2, C2, C, [t[0], 0, t[1]]); }
  }
  // Arch-headed opening profile in (u, y): pointed (equilateral) or round.
  function archProfile(u0, u1, y0, ys, { pointed = true, steps = 6 } = {}) {
    const w = u1 - u0, pts = [[u0, y0], [u1, y0], [u1, ys]];
    if (pointed) {
      for (let k = 1; k <= steps; k++) { const a = (k / steps) * (Math.PI / 3); pts.push([u0 + w * Math.cos(a), ys + w * Math.sin(a)]); } // right arc, centre at u0, up to the apex
      for (let k = steps - 1; k >= 1; k--) { const a = Math.PI - (k / steps) * (Math.PI / 3); pts.push([u1 + w * Math.cos(a), ys + w * Math.sin(a)]); }
    } else {
      const r = w / 2, um = (u0 + u1) / 2;
      for (let k = 1; k < steps * 2; k++) { const a = (k / (steps * 2)) * Math.PI; pts.push([um + r * Math.cos(a), ys + r * Math.sin(a)]); }
    }
    pts.push([u0, ys]);
    return pts;
  }
  // A convex (u, y) profile as a protruding solid on a wall: front face plus a side band.
  function profileSlab(m, o, t, n, prof, d, { sillDown = true } = {}) {
    const front = prof.map(([u, y]) => wp(o, t, n, u, y, d)), back = prof.map(([u, y]) => wp(o, t, n, u, y, 0));
    fan(m, front, hint(n));
    const cu = prof.reduce((s, q) => s + q[0], 0) / prof.length, cy = prof.reduce((s, q) => s + q[1], 0) / prof.length;
    for (let i = 0; i < prof.length; i++) {
      const j = (i + 1) % prof.length;
      if (!sillDown && i === 0) continue;
      const mid = [(prof[i][0] + prof[j][0]) / 2 - cu, (prof[i][1] + prof[j][1]) / 2 - cy];
      quad(m, back[i], back[j], front[j], front[i], [t[0] * mid[0], mid[1], t[1] * mid[0]]);
    }
  }
  // Axis-aligned-in-plan block rotated by `yaw` about the vertical, centred at (cx, cz).
  function block(m, cx, y0, y1, cz, hw, hd, yaw, { top = true, bottom = false } = {}) {
    const c = Math.cos(yaw), s = Math.sin(yaw), P = (x, z) => [cx + x * c - z * s, cz + x * s + z * c];
    const ring = [P(-hw, -hd), P(hw, -hd), P(hw, hd), P(-hw, hd)];
    for (const e of edges(ring)) wall(m, e.p, e.q, y0, y1, e.n);
    if (top) cap(m, ring, y1, true);
    if (bottom) cap(m, ring, y0, false);
    return ring;
  }
  // Pyramid / hip on a plan ring (convex), apex or ridge points given.
  function cone(m, ring, y0, apex) { for (const e of edges(ring)) tri(m, [e.p[0], y0, e.p[1]], [e.q[0], y0, e.q[1]], apex, [e.n[0], 0.6, e.n[1]]); }

  function flush(b) {
    for (const [m, s] of acc) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(s.p, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(s.n, 3));
      g.setIndex(s.i);
      b.put(g, m);
    }
  }
  return { tri, quad, fan, cap, edges, wp, hint, wall, walls, slab, archProfile, profileSlab, block, cone, flush, stats };
}
