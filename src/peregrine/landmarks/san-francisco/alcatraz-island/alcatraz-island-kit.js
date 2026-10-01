import * as THREE from 'three';
import { SPEC } from './config.js';

const B = (SPEC.bearingDeg * Math.PI) / 180;
export const UX = Math.sin(B), UZ = -Math.cos(B), WX = -UZ, WZ = UX;
export const ROT = Math.atan2(-UZ, UX);
export const toWorld = (u, y, w) => [u * UX + w * WX, y, u * UZ + w * WZ];
const rotN = (nu, ny, nw) => [nu * UX + nw * WX, ny, nu * UZ + nw * WZ];

// Far model has at most eight materials: minor ones merge into their neighbours.
const FAR = { trim: 'stone', base: 'stone', wall: 'ruin' };

// Authoring kit over assetBuilder: boxes and flat faces in the (u, y, w) frame, rotated onto the mapped grid.
export function makeKit(b, near) {
  const M = (m) => (near ? m : FAR[m] ?? m);
  const soup = new Map();
  const box = (m, u0, u1, y0, y1, w0, w1) => b.box(M(m), toWorld((u0 + u1) / 2, (y0 + y1) / 2, (w0 + w1) / 2), [u1 - u0, y1 - y0, w1 - w0], ROT, 0, 0);
  // A convex flat polygon, listed in any order; `out` is the outward direction in (u, y, w). Triangle-fanned.
  function face(m, pts, out) {
    const P = pts.map((p) => new THREE.Vector3(...toWorld(...p)));
    const n = new THREE.Vector3().crossVectors(P[1].clone().sub(P[0]), P[2].clone().sub(P[0]));
    const o = new THREE.Vector3(...rotN(...out));
    if (n.dot(o) < 0) P.reverse();
    const nn = n.dot(o) < 0 ? n.negate().normalize() : n.normalize();
    const key = M(m);
    if (!soup.has(key)) soup.set(key, { pos: [], nor: [] });
    const s = soup.get(key);
    for (let i = 1; i < P.length - 1; i++) for (const v of [P[0], P[i], P[i + 1]]) { s.pos.push(v.x, v.y, v.z); s.nor.push(nn.x, nn.y, nn.z); }
  }
  // a vertical wall of a polyline strip: mitred, thickness t, from y0 to y1 (open ends capped)
  function strip(m, pts, t, y0, y1) {
    const n = pts.length, L = [], R = [], nl = (d) => [-d[1], d[0]];
    for (let i = 0; i < n; i++) {
      const p = pts[i], d0 = i > 0 ? norm([p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]]) : null, d1 = i < n - 1 ? norm([pts[i + 1][0] - p[0], pts[i + 1][1] - p[1]]) : null;
      const n0 = nl(d0 || d1), n1 = nl(d1 || d0), mn = norm([n0[0] + n1[0], n0[1] + n1[1]]), k = (t / 2) / Math.max(0.4, mn[0] * n0[0] + mn[1] * n0[1]);
      L.push([p[0] + mn[0] * k, p[1] + mn[1] * k]); R.push([p[0] - mn[0] * k, p[1] - mn[1] * k]);
    }
    for (let i = 0; i < n - 1; i++) {
      const d = norm([pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]]), nrm = nl(d);
      face(m, [[L[i][0], y1, L[i][1]], [L[i + 1][0], y1, L[i + 1][1]], [R[i + 1][0], y1, R[i + 1][1]], [R[i][0], y1, R[i][1]]], [0, 1, 0]);
      face(m, [[L[i][0], y0, L[i][1]], [L[i + 1][0], y0, L[i + 1][1]], [L[i + 1][0], y1, L[i + 1][1]], [L[i][0], y1, L[i][1]]], [nrm[0], 0, nrm[1]]);
      face(m, [[R[i][0], y0, R[i][1]], [R[i + 1][0], y0, R[i + 1][1]], [R[i + 1][0], y1, R[i + 1][1]], [R[i][0], y1, R[i][1]]], [-nrm[0], 0, -nrm[1]]);
    }
    for (const [i, s] of [[0, -1], [n - 1, 1]]) {
      const d = norm(i === 0 ? [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]] : [pts[n - 1][0] - pts[n - 2][0], pts[n - 1][1] - pts[n - 2][1]]);
      face(m, [[L[i][0], y0, L[i][1]], [R[i][0], y0, R[i][1]], [R[i][0], y1, R[i][1]], [L[i][0], y1, L[i][1]]], [d[0] * s, 0, d[1] * s]);
    }
  }
  // a mesh built in local (u, y, w): translated to (cu, cw), rotated onto the grid
  function mesh(m, g, cu = 0, cw = 0, yaw = 0) {
    g.rotateY(ROT + yaw); const [x, , z] = toWorld(cu, 0, cw); g.translate(x, 0, z); b.put(g, M(m), 0, 0);
  }
  function flush() {
    for (const [m, s] of soup) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(s.pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(s.nor, 3));
      b.put(g, m, 0, 0);
    }
    soup.clear();
  }
  return { box, face, strip, mesh, flush, bar: (m, a, c, r, seg) => rodBar(b, M(m), a, c, r, seg) };
}
const norm = ([x, z]) => { const l = Math.hypot(x, z) || 1; return [x / l, z / l]; };
// round rod between two (u, y, w) points
function rodBar(b, m, a, c, r, seg) {
  const A = new THREE.Vector3(...toWorld(...a)), C = new THREE.Vector3(...toWorld(...c)), d = C.clone().sub(A), len = d.length();
  const g = new THREE.CylinderGeometry(r, r, len, seg, 1, true);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
  const mid = A.add(C).multiplyScalar(0.5); g.translate(mid.x, mid.y, mid.z); b.put(g, m, 0, 0);
}
