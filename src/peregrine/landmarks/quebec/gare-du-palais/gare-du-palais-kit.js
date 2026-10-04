// A small flat-shaded mesh kit for the Gare du Palais: quads, fans, lofts and caps with an outward-normal hint (the winding is fixed from the hint,
// so nothing here can come out inside-out), welded and merged per material and handed to assetBuilder.put. Points are [x, y, z]; plan rings are [[x, z]].
import * as THREE from 'three';
import { signedArea } from './gare-du-palais-site.js';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// Outward normal of each edge of a ring, whichever way it winds.
export function ringEdges(ring) {
  const s = Math.sign(signedArea(ring)) || 1, out = [];
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz);
    if (L < 1e-6) continue;
    out.push({ i, p, q, L, t: [dx / L, dz / L], n: s > 0 ? [dz / L, -dx / L] : [-dz / L, dx / L] });
  }
  return out;
}

export function meshKit() {
  const acc = new Map();
  const bucket = (m) => { let a = acc.get(m); if (!a) acc.set(m, a = { p: [], n: [], i: [] }); return a; };
  const stats = { tris: 0 };

  function tri(m, a, b, c, hint) {
    let g = cross(sub(b, a), sub(c, a));
    if (Math.hypot(...g) < 1e-7) return; // sliver
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

  function wall(m, p, q, y0, y1, n) { quad(m, [p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]], [p[0], y1, p[1]], hint(n)); }
  // A protruding block on a wall: u0..u1 along, y0..y1 up, depth d out. Back face omitted (it is the wall).
  function slab(m, o, t, n, u0, u1, y0, y1, d, { bottom = true, top = true, sides = true } = {}) {
    const A = wp(o, t, n, u0, y0), B = wp(o, t, n, u1, y0), C = wp(o, t, n, u1, y1), D = wp(o, t, n, u0, y1);
    const A2 = wp(o, t, n, u0, y0, d), B2 = wp(o, t, n, u1, y0, d), C2 = wp(o, t, n, u1, y1, d), D2 = wp(o, t, n, u0, y1, d);
    quad(m, A2, B2, C2, D2, hint(n));
    if (top) quad(m, D, C, C2, D2, [0, 1, 0]);
    if (bottom) quad(m, A, B, B2, A2, [0, -1, 0]);
    if (sides) { quad(m, A, A2, D2, D, [-t[0], 0, -t[1]]); quad(m, B, B2, C2, C, [t[0], 0, t[1]]); }
  }
  // A flat panel on a wall (one quad, no sides): a window or a frame read from outside.
  const panel = (m, o, t, n, u0, u1, y0, y1, d) => quad(m, wp(o, t, n, u0, y0, d), wp(o, t, n, u1, y0, d), wp(o, t, n, u1, y1, d), wp(o, t, n, u0, y1, d), hint(n));
  // Round-arched opening: a convex (u, y) profile as one fan on the wall.
  function arch(m, o, t, n, u0, u1, y0, ys, d, steps = 4) {
    const r = (u1 - u0) / 2, um = (u0 + u1) / 2, pts = [[u0, y0], [u1, y0], [u1, ys]];
    for (let k = 1; k < steps * 2; k++) { const a = (k / (steps * 2)) * Math.PI; pts.push([um + r * Math.cos(a), ys + r * Math.sin(a)]); }
    pts.push([u0, ys]);
    fan(m, pts.map(([u, y]) => wp(o, t, n, u, y, d)), hint(n));
  }
  // A gabled front on a wall: the pentagon (u0..u1 wide, y0..y1 to the eaves, apex yApex), one fan.
  function gable(m, o, t, n, u0, u1, y0, y1, yApex, d) {
    fan(m, [wp(o, t, n, u0, y0, d), wp(o, t, n, u1, y0, d), wp(o, t, n, u1, y1, d), wp(o, t, n, (u0 + u1) / 2, yApex, d), wp(o, t, n, u0, y1, d)], hint(n));
  }
  // Axis-free box on a plan ring (a chimney): walls, optional top.
  function prism(m, ring, y0, y1, { top = true, bottom = false } = {}) {
    for (const e of ringEdges(ring)) wall(m, e.p, e.q, y0, y1, e.n);
    if (top) cap(m, ring, y1, true);
    if (bottom) cap(m, ring, y0, false);
  }
  // A cone / pyramid over a convex plan ring, apex given.
  function cone(m, ring, y0, apex) { for (const e of ringEdges(ring)) tri(m, [e.p[0], y0, e.p[1]], [e.q[0], y0, e.q[1]], apex, [e.n[0], 0.6, e.n[1]]); }
  // A band between two plan rings with the same vertex count (a frustum, a roof slope, a corbel): ring a at height ya, ring b at yb. The outward
  // hint points away from the ring centre and `lean` up.
  function loft(m, a, ya, b, yb, lean = 0.4) {
    const n = a.length; let cx = 0, cz = 0; for (const p of a) { cx += p[0]; cz += p[1]; } cx /= n; cz /= n;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, mx = (a[i][0] + a[j][0]) / 2 - cx, mz = (a[i][1] + a[j][1]) / 2 - cz, L = Math.hypot(mx, mz) || 1;
      quad(m, [a[i][0], ya, a[i][1]], [a[j][0], ya, a[j][1]], [b[j][0], yb, b[j][1]], [b[i][0], yb, b[i][1]], [mx / L, lean, mz / L]);
    }
  }
  // A flat ring between an inner and an outer ring (same vertex count) at height y, facing up or down.
  function annulus(m, inner, outer, y, up = true) {
    const n = inner.length;
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; quad(m, [inner[i][0], y, inner[i][1]], [inner[j][0], y, inner[j][1]], [outer[j][0], y, outer[j][1]], [outer[i][0], y, outer[i][1]], [0, up ? 1 : -1, 0]); }
  }

  // A thin crest bar along a roof line a -> b ([x, y, z]): w wide, h tall, sunk 0.08 m into the roof so it never floats. Top and two sides, no ends.
  function bar(m, a, b, w, h) {
    const d = sub(b, a);
    if (Math.hypot(...d) < 0.05) return;
    let side = cross(d, [0, 1, 0]); if (Math.hypot(...side) < 1e-6) side = [1, 0, 0];
    side = norm(side).map((v) => v * w / 2);
    const P = (pt, k, y) => [pt[0] + side[0] * k, pt[1] + y, pt[2] + side[2] * k], lo = -0.08, hi = h - 0.08;
    quad(m, P(a, -1, hi), P(b, -1, hi), P(b, 1, hi), P(a, 1, hi), [0, 1, 0]);
    for (const k of [-1, 1]) quad(m, P(a, k, lo), P(b, k, lo), P(b, k, hi), P(a, k, hi), [side[0] * k, 0, side[2] * k]);
  }

  // Weld vertices that share a position and a (flat) normal: a quad costs 4 vertices instead of 6.
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
  return { tri, quad, fan, cap, wp, hint, wall, slab, panel, arch, gable, prism, cone, loft, annulus, bar, flush, stats };
}
