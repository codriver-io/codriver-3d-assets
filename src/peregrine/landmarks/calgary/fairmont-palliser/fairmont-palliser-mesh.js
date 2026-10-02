// A tiny flat-shaded mesh kit for the Palliser: quads and fans with an outward-normal hint (the winding is
// fixed from the hint, so nothing here can come out inside-out), merged per material, welded and handed to
// assetBuilder.put. Points are [x, y, z]; wall frames are (o, t, n): a plan point on the wall, its unit tangent
// and its unit outward normal, all in the (x, z) plane.
import * as THREE from 'three';
import { edgesOf } from './fairmont-palliser-site.js';

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
  // The point at wall coordinate u (along t), height y, and offset d out of the wall.
  const wp = (o, t, n, u, y, d = 0) => [o[0] + t[0] * u + n[0] * d, y, o[1] + t[1] * u + n[1] * d];
  const hint = (n) => [n[0], 0, n[1]];

  // A protruding block on a wall: u0..u1 along, y0..y1 up, depth d out. Five faces (the back is the wall).
  function slab(m, o, t, n, u0, u1, y0, y1, d, { bottom = true, top = true, sides = true } = {}) {
    const A = wp(o, t, n, u0, y0), B = wp(o, t, n, u1, y0), C = wp(o, t, n, u1, y1), D = wp(o, t, n, u0, y1);
    const A2 = wp(o, t, n, u0, y0, d), B2 = wp(o, t, n, u1, y0, d), C2 = wp(o, t, n, u1, y1, d), D2 = wp(o, t, n, u0, y1, d);
    quad(m, A2, B2, C2, D2, hint(n));
    if (top) quad(m, D, C, C2, D2, [0, 1, 0]);
    if (bottom) quad(m, A, B, B2, A2, [0, -1, 0]);
    if (sides) { quad(m, A, A2, D2, D, [-t[0], 0, -t[1]]); quad(m, B, B2, C2, C, [t[0], 0, t[1]]); }
  }
  // A closed band across a wall plane, from d0 (behind it, may be negative) to d1 (in front): front, back, top and
  // ends; the underside only where it overhangs the wall. Used for parapets that stand on a roof.
  function band(m, o, t, n, u0, u1, y0, y1, d0, d1) {
    const P = (u, y, d) => wp(o, t, n, u, y, d);
    quad(m, P(u0, y0, d1), P(u1, y0, d1), P(u1, y1, d1), P(u0, y1, d1), hint(n));
    quad(m, P(u0, y0, d0), P(u1, y0, d0), P(u1, y1, d0), P(u0, y1, d0), [-n[0], 0, -n[1]]);
    quad(m, P(u0, y1, d0), P(u1, y1, d0), P(u1, y1, d1), P(u0, y1, d1), [0, 1, 0]);
    quad(m, P(u0, y0, d0), P(u0, y0, d1), P(u0, y1, d1), P(u0, y1, d0), [-t[0], 0, -t[1]]);
    quad(m, P(u1, y0, d0), P(u1, y0, d1), P(u1, y1, d1), P(u1, y1, d0), [t[0], 0, t[1]]);
    if (d1 > 0) quad(m, P(u0, y0, 0), P(u1, y0, 0), P(u1, y0, d1), P(u0, y0, d1), [0, -1, 0]);
  }
  // A flat panel on a wall: u0..u1 along, y0..y1 up, offset d out of the wall. One quad, no sides (a window or
  // mullion read from outside; the gap behind it is the wall).
  const panel = (m, o, t, n, u0, u1, y0, y1, d) => quad(m, wp(o, t, n, u0, y0, d), wp(o, t, n, u1, y0, d), wp(o, t, n, u1, y1, d), wp(o, t, n, u0, y1, d), hint(n));
  // Arch-headed opening profile in (u, y), round: a rectangle up to the springing line ys, a half circle above.
  function archProfile(u0, u1, y0, ys, steps = 5) {
    const w = u1 - u0, pts = [[u0, y0], [u1, y0], [u1, ys]], r = w / 2, um = (u0 + u1) / 2;
    for (let k = 1; k < steps * 2; k++) { const a = (k / (steps * 2)) * Math.PI; pts.push([um + r * Math.cos(a), ys + r * Math.sin(a)]); }
    pts.push([u0, ys]);
    return pts;
  }
  // Axis-aligned-in-plan block rotated by `yaw` about the vertical, centred at (cx, cz).
  function block(m, cx, y0, y1, cz, hw, hd, yaw, { top = true } = {}) {
    const c = Math.cos(yaw), s = Math.sin(yaw), P = (x, z) => [cx + x * c - z * s, cz + x * s + z * c];
    const ring = [P(-hw, -hd), P(hw, -hd), P(hw, hd), P(-hw, hd)];
    for (const e of edgesOf(ring)) quad(m, [e.p[0], y0, e.p[1]], [e.q[0], y0, e.q[1]], [e.q[0], y1, e.q[1]], [e.p[0], y1, e.p[1]], hint(e.n));
    if (top) cap(m, ring, y1, true);
    return ring;
  }

  // Weld vertices that share a position and a (flat) normal: a quad costs 4 vertices instead of 6 and a
  // fan n + 1 instead of 3 per triangle. Smooth/sharp normals are untouched: only identical pairs merge.
  function weld({ p, n, i }) {
    const map = new Map(), P = [], N = [], I = [];
    for (const k of i) {
      const x = p[k * 3], y = p[k * 3 + 1], z = p[k * 3 + 2], a = n[k * 3], b = n[k * 3 + 1], c = n[k * 3 + 2];
      const key = `${Math.round(x * 1e4)},${Math.round(y * 1e4)},${Math.round(z * 1e4)},${Math.round(a * 1e3)},${Math.round(b * 1e3)},${Math.round(c * 1e3)}`;
      let j = map.get(key);
      if (j === undefined) { j = P.length / 3; map.set(key, j); P.push(x, y, z); N.push(a, b, c); }
      I.push(j);
    }
    return { p: P, n: N, i: I };
  }

  function flush(b) {
    for (const [m, raw] of acc) {
      const s = weld(raw), g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(s.p, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(s.n, 3));
      g.setIndex(s.i);
      b.put(g, m);
    }
  }
  return { tri, quad, fan, cap, wp, hint, slab, band, panel, archProfile, block, flush, stats };
}
