import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function area(r) { return r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2; }
export function edges(r) {
  const sign = Math.sign(area(r));
  return r.map((p, i) => {
    const q = r[(i + 1) % r.length], dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz);
    return { p, q, L, t: [dx / L, dz / L], n: [sign * dz / L, -sign * dx / L] };
  }).filter(e => e.L > 0.01);
}
export function frame(r) {
  const e = edges(r).reduce((a, b) => a.L > b.L ? a : b), t = e.t, n = [-t[1], t[0]];
  const us = r.map(p => p[0] * t[0] + p[1] * t[1]), vs = r.map(p => p[0] * n[0] + p[1] * n[1]);
  const u0 = Math.min(...us), u1 = Math.max(...us), v0 = Math.min(...vs), v1 = Math.max(...vs);
  return { t, n, u0, u1, v0, v1, at: (u, v, y) => [t[0] * u + n[0] * v, y, t[1] * u + n[1] * v] };
}
export function contains(r, x, z) {
  let yes = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j];
    if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) yes = !yes;
  }
  return yes;
}
export function distance(r, x, z) {
  if (contains(r, x, z)) return 0;
  return Math.min(...edges(r).map(e => {
    const u = Math.max(0, Math.min(e.L, (x - e.p[0]) * e.t[0] + (z - e.p[1]) * e.t[1]));
    return Math.hypot(x - e.p[0] - u * e.t[0], z - e.p[1] - u * e.t[1]);
  }));
}

export function masonry() {
  const batches = new Map();
  function tri(mat, a, b, c, outward) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), C = new THREE.Vector3(...c);
    const N = B.clone().sub(A).cross(C.clone().sub(A));
    if (N.lengthSq() < 1e-12) return;
    if (outward && N.dot(new THREE.Vector3(...outward)) < 0) { [b, c] = [c, b]; N.negate(); }
    N.normalize();
    let batch = batches.get(mat); if (!batch) batches.set(mat, batch = { p: [], n: [] });
    batch.p.push(...a, ...b, ...c); batch.n.push(...N.toArray(), ...N.toArray(), ...N.toArray());
  }
  const quad = (m, a, b, c, d, n) => { tri(m, a, b, c, n); tri(m, a, c, d, n); };
  const at = (e, u, y, depth = 0) => [e.p[0] + u * e.t[0] + depth * e.n[0], y, e.p[1] + u * e.t[1] + depth * e.n[1]];
  const panel = (m, e, u0, u1, y0, y1, d = 0) => {
    if (u1 - u0 < 0.001 || y1 - y0 < 0.001) return;
    quad(m, at(e, u0, y0, d), at(e, u1, y0, d), at(e, u1, y1, d), at(e, u0, y1, d), [e.n[0], 0, e.n[1]]);
  };
  function cap(mat, ring, y) {
    for (const indices of THREE.ShapeUtils.triangulateShape(ring.map(p => new THREE.Vector2(...p)), []))
      tri(mat, ...indices.map(i => [ring[i][0], y, ring[i][1]]), [0, 1, 0]);
  }
  function solid(mat, ring, y0, y1, top = true) {
    for (const e of edges(ring)) panel(mat, e, 0, e.L, y0, y1);
    if (top) cap(mat, ring, y1);
  }
  // True round-headed holes and recessed glass; no dark veneer over solid walls.
  function opening(mat, e, cell0, cell1, band0, band1, u, bottom, width, straightH, near, round = true) {
    const r = width / 2, border = near ? 0.20 : 0, a = u - r - border, b = u + r + border;
    const spring = bottom + straightH;
    panel(mat, e, cell0, a, band0, band1); panel(mat, e, b, cell1, band0, band1);
    panel(mat, e, a, b, band0, bottom - border);
    const shape = (rad, yb) => {
      const pts = [[u - rad, yb], [u + rad, yb], [u + rad, spring]];
      const steps = round ? (near ? 8 : 2) : 1;
      for (let i = 1; i <= steps; i++) { const ang = i * Math.PI / steps; pts.push([u + rad * Math.cos(ang), spring + (round ? rad * Math.sin(ang) : 0)]); }
      return pts;
    };
    const out = shape(r + border, bottom - border), inn = shape(r, bottom), D = near ? -0.32 : 0;
    for (let i = 2; i < out.length - 1; i++) {
      const p = out[i], q = out[i + 1];
      quad(mat, at(e, p[0], p[1]), at(e, q[0], q[1]), at(e, q[0], band1), at(e, p[0], band1), [e.n[0], 0, e.n[1]]);
    }
    if (near) for (let i = 0; i < out.length; i++) {
      const j = (i + 1) % out.length, p = out[i], q = out[j], s = inn[i], t = inn[j];
      quad('trim', at(e, p[0], p[1]), at(e, q[0], q[1]), at(e, t[0], t[1], D), at(e, s[0], s[1], D), [e.n[0], 0, e.n[1]]);
    }
    for (let i = 1; i < inn.length - 1; i++) tri('glass', at(e, ...inn[0], D), at(e, ...inn[i], D), at(e, ...inn[i + 1], D), [e.n[0], 0, e.n[1]]);
  }
  function flush(b) {
    for (const [mat, data] of batches) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(data.p, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(data.n, 3));
      const merged = mergeVertices(g, 0.0001); g.dispose(); b.put(merged, mat);
    }
  }
  return { tri, quad, at, panel, cap, solid, opening, flush };
}
