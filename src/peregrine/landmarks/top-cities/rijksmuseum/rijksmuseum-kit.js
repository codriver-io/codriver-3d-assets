// Flat-shaded mesh kit for the Rijksmuseum. Points are building-frame [u, y, v].
// Winding is the outward face (right-handed u, y, v). Each triangle drops if it
// is a sliver. Vertices that share a position and a normal are welded so a quad
// is four vertices, then one BufferGeometry per material goes to assetBuilder.
import * as THREE from 'three';
import { toWorld } from './rijksmuseum-plan.js';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export function meshKit() {
  const acc = new Map();
  const bucket = (m) => { let a = acc.get(m); if (!a) acc.set(m, a = { p: [], n: [], i: [] }); return a; };

  function tri(m, a, b, c) {
    const A = toWorld(a[0], a[1], a[2]), B = toWorld(b[0], b[1], b[2]), C = toWorld(c[0], c[1], c[2]);
    const g = cross(sub(B, A), sub(C, A));
    if (g[0] * g[0] + g[1] * g[1] + g[2] * g[2] < 1e-10) return;
    const n = norm(g), s = bucket(m), o = s.p.length / 3;
    s.p.push(...A, ...B, ...C);
    s.n.push(...n, ...n, ...n);
    s.i.push(o, o + 1, o + 2);
  }
  function quad(m, a, b, c, d) { tri(m, a, b, c); tri(m, a, c, d); }

  // Solid box. `open` drops faces that would be buried in a neighbour ('n','s','e','w','t','b').
  function box(m, u0, u1, v0, v1, y0, y1, open = '') {
    if (!open.includes('n')) quad(m, [u0, y0, v0], [u0, y1, v0], [u1, y1, v0], [u1, y0, v0]);
    if (!open.includes('s')) quad(m, [u0, y0, v1], [u1, y0, v1], [u1, y1, v1], [u0, y1, v1]);
    if (!open.includes('w')) quad(m, [u0, y0, v0], [u0, y0, v1], [u0, y1, v1], [u0, y1, v0]);
    if (!open.includes('e')) quad(m, [u1, y0, v1], [u1, y0, v0], [u1, y1, v0], [u1, y1, v1]);
    if (!open.includes('t')) quad(m, [u0, y1, v0], [u0, y1, v1], [u1, y1, v1], [u1, y1, v0]);
    if (!open.includes('b')) quad(m, [u0, y0, v0], [u1, y0, v0], [u1, y0, v1], [u0, y0, v1]);
  }

  // A panel facing north (outward −v) or south (+v). `sign` is −1 for north.
  function panelNS(m, u0, u1, y0, y1, v, sign) {
    if (sign < 0) quad(m, [u0, y0, v], [u0, y1, v], [u1, y1, v], [u1, y0, v]);
    else quad(m, [u0, y0, v], [u1, y0, v], [u1, y1, v], [u0, y1, v]);
  }
  function panelEW(m, v0, v1, y0, y1, u, sign) {
    if (sign < 0) quad(m, [u, y0, v1], [u, y0, v0], [u, y1, v0], [u, y1, v1]);
    else quad(m, [u, y0, v0], [u, y0, v1], [u, y1, v1], [u, y1, v0]);
  }

  // Gable roof, ridge running along u (street facades). Eaves at ye, ridge at yr.
  function gableU(wall, roof, u0, u1, v0, v1, ye, yr, cap0 = true, cap1 = true) {
    const vm = (v0 + v1) / 2;
    quad(roof, [u0, ye, v0], [u0, yr, vm], [u1, yr, vm], [u1, ye, v0]);
    quad(roof, [u0, yr, vm], [u0, ye, v1], [u1, ye, v1], [u1, yr, vm]);
    if (cap0) tri(wall, [u0, ye, v0], [u0, ye, v1], [u0, yr, vm]);
    if (cap1) tri(wall, [u1, ye, v1], [u1, ye, v0], [u1, yr, vm]);
  }
  // Ridge running along v (the passage spine and the east/west ranges).
  // Slopes are wound so the normal points up: the west slope toward −u, the east toward +u.
  function gableV(wall, roof, u0, u1, v0, v1, ye, yr, cap0 = true, cap1 = true) {
    const um = (u0 + u1) / 2;
    quad(roof, [u0, ye, v0], [u0, ye, v1], [um, yr, v1], [um, yr, v0]);
    quad(roof, [um, yr, v0], [um, yr, v1], [u1, ye, v1], [u1, ye, v0]);
    if (cap0) tri(wall, [u0, ye, v0], [um, yr, v0], [u1, ye, v0]);
    if (cap1) tri(wall, [u1, ye, v1], [um, yr, v1], [u0, ye, v1]);
  }

  // Pyramid, or a hip that stops on a smaller top ring (a spire neck).
  function hip(m, u0, u1, v0, v1, yb, ut0, ut1, vt0, vt1, yt) {
    quad(m, [u1, yb, v0], [u0, yb, v0], [ut0, yt, vt0], [ut1, yt, vt0]);
    quad(m, [u0, yb, v1], [u1, yb, v1], [ut1, yt, vt1], [ut0, yt, vt1]);
    quad(m, [u0, yb, v0], [u0, yb, v1], [ut0, yt, vt1], [ut0, yt, vt0]);
    quad(m, [u1, yb, v1], [u1, yb, v0], [ut1, yt, vt0], [ut1, yt, vt1]);
  }
  function pyramid(m, u0, u1, v0, v1, yb, yt) {
    const um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
    hip(m, u0, u1, v0, v1, yb, um, um, vm, vm, yt);
  }

  function weld(raw) {
    const map = new Map(), P = [], N = [], I = [];
    for (const k of raw.i) {
      const x = raw.p[k * 3], y = raw.p[k * 3 + 1], z = raw.p[k * 3 + 2];
      const a = raw.n[k * 3], b = raw.n[k * 3 + 1], c = raw.n[k * 3 + 2];
      const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)},${a.toFixed(2)},${b.toFixed(2)},${c.toFixed(2)}`;
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
  return { tri, quad, box, panelNS, panelEW, gableU, gableV, hip, pyramid, flush };
}
