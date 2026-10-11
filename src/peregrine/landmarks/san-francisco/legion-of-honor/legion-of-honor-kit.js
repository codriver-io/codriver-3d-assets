import * as THREE from 'three';
import { SPEC } from './config.js';

// Small kit for the Legion of Honor. Parts are written in the mapped outline's plan metres (u along the
// long axis toward the entrance arch, v to its right, y up). `kit` centres them on SPEC.planCentre and
// turns them onto the true grid with one rotation, so nothing else knows the 48.91 deg bearing.
const TH = (SPEC.bearingU * Math.PI) / 180, ROT = Math.PI / 2 - TH;
const [UC, VC] = SPEC.planCentre;

/** Plan (u, y, v) to model metres (east, up, south); used by views and tests. */
export function plan(u, y, v) {
  const a = u - UC, c = v - VC;
  return [a * Math.sin(TH) + c * Math.cos(TH), y, -a * Math.cos(TH) + c * Math.sin(TH)];
}
/** Model metres (east, south) back to plan (u, v). */
export function unplan(x, z) {
  return [x * Math.sin(TH) - z * Math.cos(TH) + UC, x * Math.cos(TH) + z * Math.sin(TH) + VC];
}

const FACE = { px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5 };

export function kit(b, detail) {
  const near = detail === 'near';
  const place = (g, mat) => { g.rotateY(ROT); b.put(g, mat); };
  const cull = (g, faces) => { // drop box faces nobody can see (3 x 2 indices per face)
    const idx = Array.from(g.index.array), keep = [];
    for (let f = 0; f < 6; f++) if (!faces.some((n) => FACE[n] === f)) keep.push(...idx.slice(f * 6, f * 6 + 6));
    g.setIndex(keep); return g;
  };

  /** Axis-aligned box in plan bounds. `skip` lists hidden faces: px/nx (+-u), py/ny (up/down), pz/nz (+-v). */
  function box(mat, u0, u1, y0, y1, v0, v1, skip = []) {
    const g = new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0);
    g.translate((u0 + u1) / 2 - UC, (y0 + y1) / 2, (v0 + v1) / 2 - VC);
    place(skip.length ? cull(g, skip) : g, mat);
  }
  /** Vertical prism over a plan polygon from y0 to y1 (top and bottom caps included). */
  function prism(mat, pts, y0, y1) {
    const shape = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(u - UC, -(v - VC))));
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); place(g, mat);
  }
  /** Shape in (w, y) extruded along +u from u0 by `depth`, centred on plan v = vc (w points to -v, so keep shapes symmetric). */
  function extrudeU(mat, shape, u0, depth, vc) {
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1, curveSegments: near ? 10 : 5 });
    g.rotateY(Math.PI / 2); g.translate(u0 - UC, 0, vc - VC); place(g, mat);
  }
  /** Planar faces (3 or 4 points, plan x/z = u/v) oriented away from `inside`; flat shaded. */
  function faces(mat, list, inside) {
    const out = [], ix = [inside[0] - UC, inside[1], inside[2] - VC];
    for (const f of list) {
      const p = f.map(([u, y, v]) => [u - UC, y, v - VC]);
      for (let i = 1; i < p.length - 1; i++) {
        let [a, c, d] = [p[0], p[i], p[i + 1]];
        const n = [(c[1] - a[1]) * (d[2] - a[2]) - (c[2] - a[2]) * (d[1] - a[1]), (c[2] - a[2]) * (d[0] - a[0]) - (c[0] - a[0]) * (d[2] - a[2]), (c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0])];
        const m = [(a[0] + c[0] + d[0]) / 3 - ix[0], (a[1] + c[1] + d[1]) / 3 - ix[1], (a[2] + c[2] + d[2]) / 3 - ix[2]];
        if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) [c, d] = [d, c];
        out.push(...a, ...c, ...d);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); g.computeVertexNormals(); place(g, mat);
  }
  /** Low hipped roof over a plan rectangle: sloped skirt in `mat`, flat top (the skylight) in `topMat`. */
  function hip(mat, topMat, u0, u1, v0, v1, y0, y1, run) {
    const r = Math.min(run, (u1 - u0) / 2 - 0.4, (v1 - v0) / 2 - 0.4);
    const E = [[u0, y0, v0], [u1, y0, v0], [u1, y0, v1], [u0, y0, v1]];
    const T = [[u0 + r, y1, v0 + r], [u1 - r, y1, v0 + r], [u1 - r, y1, v1 - r], [u0 + r, y1, v1 - r]];
    const inside = [(u0 + u1) / 2, y0 - 6, (v0 + v1) / 2], skirt = [];
    for (let i = 0; i < 4; i++) skirt.push([E[i], E[(i + 1) % 4], T[(i + 1) % 4], T[i]]);
    faces(mat, skirt, inside); faces(topMat, [T], inside);
  }
  /** One round shaft (tapered), open at both ends: bases and capitals hide the ends. */
  function shaft(mat, u, v, y0, y1, r0, r1, sides) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, sides, 1, true);
    g.translate(u - UC, (y0 + y1) / 2, v - VC); place(g, mat);
  }
  /** A classical column: square base, tapered shaft, square capital. Heights are absolute y. */
  function column(u, v, c) {
    const { y0, yb, yc, y1, r0, r1, bw, cw } = c;
    // far: one 4-sided shaft from the ground (a capital block only on the portico); near: 8 sides, a square base and a capital
    shaft('stone', u, v, near ? yb : y0, yc, r0, r1, near ? 8 : 4);
    if (near || cw > 1) box('stone', u - cw / 2, u + cw / 2, yc, y1, v - cw / 2, v + cw / 2, ['py']);
    else shaft('stone', u, v, yc, y1, r1, r1, 4); // far colonnade: shaft runs on up to the entablature, no capital block
    if (near) box('stone', u - bw / 2, u + bw / 2, y0, yb, v - bw / 2, v + bw / 2, ['ny']);
  }
  /** Evenly spaced positions from a to b inclusive, at about `pitch`. */
  const spread = (a, b, pitch) => { const n = Math.max(1, Math.round(Math.abs(b - a) / pitch)); return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n); };
  /** Spherical-cap dome (base radius r0 at y0, `rise` high) ending in a flat ring of radius rTop; open below and on top. */
  function dome(mat, u, v, y0, r0, rise, rTop) {
    const R = (r0 * r0 + rise * rise) / (2 * rise), cy = y0 + rise - R, a0 = Math.asin(r0 / R), a1 = Math.asin(rTop / R), steps = near ? 7 : 4, pts = [];
    for (let i = 0; i <= steps; i++) { const a = a0 + ((a1 - a0) * i) / steps; pts.push(new THREE.Vector2(R * Math.sin(a), cy + R * Math.cos(a))); }
    const g = new THREE.LatheGeometry(pts, near ? 20 : 12);
    g.translate(u - UC, 0, v - VC); place(g, mat);
  }
  /** Geometry built around its own origin (cylinders, extrusions), moved to plan (u, y, v) and turned onto the grid. */
  function placeAt(mat, g, u, v, y = 0) { g.translate(u - UC, y, v - VC); place(g, mat); }
  return { placeAt, box, prism, extrudeU, faces, hip, shaft, column, spread, dome, place, near, cull };
}
