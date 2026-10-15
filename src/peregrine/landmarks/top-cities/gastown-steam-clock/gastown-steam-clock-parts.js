import * as THREE from 'three';
import { SPEC } from './config.js';

// Gastown Steam Clock parts. Everything is authored in clock-local metres (+x, +z the clock's own square
// axes, face 0 looking +z) and turned once about the axis by SPEC.turnDeg so the faces sit along and across
// Water Street. Stage heights are read off photographs of a 5 m clock (estimated; see the doc).
const TURN = SPEC.turnDeg * Math.PI / 180;
const emit = (b, mat, g, k = 0) => { if (k) g.rotateY(k * Math.PI / 2); g.rotateY(TURN); b.put(g, mat); };
const box = (b, mat, c, s, k = 0) => { const g = new THREE.BoxGeometry(...s); g.translate(...c); emit(b, mat, g, k); };
// A vertical cylinder from y0 to y1 (radius r0 at the bottom, r1 at the top) at plan position [x, z].
const cyl = (b, mat, [x, z], y0, y1, r0, r1, segs, k = 0, rotY = 0) => {
  const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, segs); if (rotY) g.rotateY(rotY); g.translate(x, (y0 + y1) / 2, z); emit(b, mat, g, k);
};
// A four-sided frustum with axis-aligned faces, bottom width wb, top width wt.
const frustum = (b, mat, y0, y1, wb, wt) => cyl(b, mat, [0, 0], y0, y1, wb / Math.SQRT2, wt / Math.SQRT2, 4, 0, Math.PI / 4);
const corners = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const rot = (x, z) => [x * Math.cos(TURN) + z * Math.sin(TURN), -x * Math.sin(TURN) + z * Math.cos(TURN)];

export function plinth(b, { near }) {
  const h = SPEC.plinthHalf;
  box(b, 'granite', [0, 0.31, 0], [h * 2, 0.62, h * 2]);
  box(b, 'granite', [0, 0.86, 0], [0.8, 0.48, 0.8]);
  if (!near) return;
  // The ventilation grille on the plinth's street face and the bronze plaque on the step above it.
  for (let i = 0; i < 6; i++) box(b, 'bronze', [0, 0.14 + i * 0.05, h + 0.015], [0.40, 0.028, 0.05]);
  box(b, 'brass', [0, 0.88, 0.4 + 0.015], [0.46, 0.26, 0.05]);
}

// The shaft: a hollow-faced bronze column, one arched window per side onto the works (a brass weight and the
// bell), brass strips on the corners.
export function shaft(b, { near }) {
  const y0 = 1.10, H = 1.75, hw = SPEC.shaftHalf, depth = 0.14, wr = 0.14;
  const s = new THREE.Shape(); s.moveTo(-hw, 0); s.lineTo(hw, 0); s.lineTo(hw, H); s.lineTo(-hw, H); s.closePath();
  const hole = new THREE.Path(); hole.moveTo(-wr, 0.2); hole.lineTo(wr, 0.2); hole.lineTo(wr, 1.47); hole.absarc(0, 1.47, wr, 0, Math.PI, false); hole.lineTo(-wr, 0.2); s.holes.push(hole);
  for (let k = 0; k < 4; k++) {
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: near ? 8 : 4 });
    g.translate(0, y0, hw - depth); emit(b, 'bronze', g, k);
    if (near) {
      box(b, 'brass', [0, y0 + 0.62, 0.15 + 0.04], [0.08, 0.5, 0.08], k);
      const bell = new THREE.CylinderGeometry(0.02, 0.07, 0.12, 8); bell.translate(0, y0 + 1.3, 0.15 + 0.07); emit(b, 'brass', bell, k);
    }
  }
  box(b, 'glass', [0, y0 + H / 2, 0], [0.30, H, 0.30]);
  for (const [sx, sz] of corners) box(b, 'brass', [sx * (hw - 0.01), y0 + H / 2, sz * (hw - 0.01)], [0.06, H, 0.06]);
}

// The cabinet: bronze flare, amber-backed glass faces each carrying a dial in a brass bezel, brass corner posts, cornice.
export function cabinet(b, { near }) {
  const y0 = SPEC.cabinetBottomY, y1 = SPEC.cabinetTopY, mid = (y0 + y1) / 2, core = SPEC.cabinetCoreHalf, dr = SPEC.dialR;
  frustum(b, 'bronze', 2.85, y0, 0.64, 0.84);
  box(b, 'glass', [0, mid, 0], [core * 2, y1 - y0, core * 2]);
  for (const [sx, sz] of corners) box(b, 'brass', [sx * 0.37, mid + 0.025, sz * 0.37], [0.10, y1 - y0 + 0.10, 0.10]);
  box(b, 'bronze', [0, y1 + 0.05, 0], [1.0, 0.10, 1.0]);
  const segs = near ? 24 : 12, dialMid = mid;
  for (let k = 0; k < 4; k++) {
    // Dial drum (recessed 2 cm behind the bezel) and the bezel ring, both resting on the glass.
    const dial = new THREE.CylinderGeometry(dr, dr, 0.08, segs); dial.rotateX(Math.PI / 2); dial.translate(0, dialMid, core + 0.04); emit(b, 'glow', dial, k);
    const ring = new THREE.Shape(); ring.absarc(0, 0, dr + 0.03, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, dr - 0.002, 0, Math.PI * 2, true); ring.holes.push(hole);
    const rg = new THREE.ExtrudeGeometry(ring, { depth: 0.10, bevelEnabled: false, curveSegments: segs }); rg.translate(0, dialMid, core); emit(b, 'brass', rg, k);
    // Numerals as ticks (long at the quarters), two hands on a hub at ten past ten, four blossoms in the corners.
    for (let i = 0; i < 12; i += near ? 1 : 3) {
      const a = i * Math.PI / 6, q = i % 3 === 0, len = q ? 0.07 : 0.05, rr = dr - 0.025 - len / 2;
      const g = new THREE.BoxGeometry(q ? 0.045 : 0.03, len, 0.025); g.rotateZ(-a); g.translate(Math.sin(a) * rr, dialMid + Math.cos(a) * rr, core + 0.08 + 0.0025); emit(b, 'brass', g, k);
    }
    for (const [len, ang, w] of [[0.15, 305 * Math.PI / 180, 0.032], [0.20, 60 * Math.PI / 180, 0.02]]) {
      const g = new THREE.BoxGeometry(w, len + 0.04, 0.03); g.translate(0, (len - 0.04) / 2 + 0.02 - 0.0, 0); g.rotateZ(-ang); g.translate(0, dialMid, core + 0.08 + 0.005 + 0.012); emit(b, 'brass', g, k);
    }
    if (!near) continue;
    const hub = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8); hub.rotateX(Math.PI / 2); hub.translate(0, dialMid, core + 0.08 + 0.005 + 0.012 + 0.015 + 0.01); emit(b, 'brass', hub, k);
    for (const [sx, sz] of corners) { const g = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 6); g.rotateX(Math.PI / 2); g.translate(sx * 0.255, dialMid + sz * 0.255, core + 0.01); emit(b, 'brass', g, k); }
  }
}

// The pagoda roof, the tall central whistle and the four corner whistles with their collars and finials.
export function crown(b, { near }) {
  const sd = near ? 8 : 5;
  frustum(b, 'bronze', 3.93, 4.03, 0.86, 0.60);
  frustum(b, 'bronze', 4.03, 4.38, 0.60, 0.30);
  box(b, 'bronze', [0, 4.415, 0], [0.38, 0.07, 0.38]);
  cyl(b, 'bronze', [0, 0], 4.45, 4.56, 0.13, 0.09, sd);
  cyl(b, 'bronze', [0, 0], 4.56, 4.90, 0.075, 0.075, sd);
  cyl(b, 'bronze', [0, 0], 4.90, 5.0, 0.045, 0.006, sd);
  for (const [sx, sz] of corners) {
    const p = [sx * 0.455, sz * 0.455];
    cyl(b, 'bronze', p, near ? 3.99 : 3.93, 4.38, 0.042, 0.042, sd);
    cyl(b, 'bronze', p, 4.38, 4.45, 0.04, 0.008, sd);
    if (near) cyl(b, 'brass', p, 3.93, 3.99, 0.062, 0.062, sd);
  }
}

// The brick pad (stylised patch of the mapped paving), four bronze bollards and their sagging chains.
export function surround(b, { near }) {
  box(b, 'brick', [0, 0.04, 0], [SPEC.padHalf * 2, 0.08, SPEC.padHalf * 2]);
  const bh = SPEC.bollardHalf, sd = near ? 8 : 5;
  for (const [sx, sz] of corners) {
    const p = [sx * bh, sz * bh];
    cyl(b, 'bronze', p, 0.08, 0.86, 0.075, 0.07, sd);
    cyl(b, 'bronze', p, 0.86, 0.90, 0.09, 0.09, sd);
    cyl(b, 'bronze', p, 0.90, 0.96, 0.06, 0.0, sd);
  }
  if (!near) return;
  for (let i = 0; i < 4; i++) {
    const a = corners[i], c = corners[(i + 1) % 4], n = 4;
    let prev = null;
    for (let j = 0; j <= n; j++) {
      const t = j / n, [x, z] = rot((a[0] + (c[0] - a[0]) * t) * bh, (a[1] + (c[1] - a[1]) * t) * bh), y = 0.74 - 0.14 * 4 * t * (1 - t);
      if (prev) b.bar('bronze', prev, [x, y, z], 0.022, 0.022);
      prev = [x, y, z];
    }
  }
}
