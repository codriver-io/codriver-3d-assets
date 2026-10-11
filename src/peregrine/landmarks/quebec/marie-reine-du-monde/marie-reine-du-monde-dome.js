import * as THREE from 'three';
import { LEVELS as L, SMALL_DOMES } from './marie-reine-du-monde-plan.js';

// The great dome over the crossing, a one-third replica of St Peter's: a plain ashlar ring, a drum with sixteen coupled-column bays and arched windows,
// an entablature, the ribbed copper dome with two rows of oculi, a small colonnaded lantern with a copper spire, a ball and a cross; and the two small
// domes on drums over the front corner blocks. Heights are metres above the pavement. Dome part 63 m and lantern part 62 to 77 m in OSM; the crown is
// kept at 61 m because the photographs show the lantern base there (the lantern, ball and cross measured from a frontal photograph).
export const DOME = {
  ringR: 14.4, ringBase: 24.9, ringTop: 33.0, corniceR: 15.0, corniceTop: 33.7, // OSM ring part: radius 14.5 m, 33 m
  drumR: 12.7, drumTop: 44.4, // corner radius of the 16-sided drum
  entabR: 13.5, entabTop: 47.0, rimR: 13.9,
  spring: 47.0, radius: 12.4, // dome base radius (OSM dome part 12.4 m; Wikipedia gives a 23 m cupola diameter at the springing, 75 ft)
  rise: 14.7, // semi-axis: the profile stops at the lantern ring
  crownR: 3.3,
  lantern: { base: 61.2, top: 63.6, corniceTop: 64.3, bandTop: 65.8, spireTop: 70.6, ballY: 71.3, crossBase: 71.9, tip: 77.0 },
};
const SIDES = 16;

/** point and outward unit normal on the dome surface at elevation parameter t (radians up from the springing) */
export function domeSurface(t) {
  const r = DOME.radius * Math.cos(t), y = DOME.spring + DOME.rise * Math.sin(t);
  const nr = Math.cos(t) / DOME.radius, ny = Math.sin(t) / DOME.rise, nl = Math.hypot(nr, ny);
  return { r, y, nr: nr / nl, ny: ny / nl };
}
export const tMax = Math.acos(DOME.crownR / DOME.radius);
export const crownY = DOME.spring + DOME.rise * Math.sin(tMax);

// A triangular-section rib along one meridian, standing proud of the copper shell.
function ribGeometry(angle, steps, width, height) {
  const pos = [], idx = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax * 0.985, { r, y, nr, ny } = domeSurface(t);
    const peak = { r: r + nr * height, y: y + ny * height }, half = Math.min(width / 2, r * 0.9) / Math.max(r, 1e-3);
    for (const [rr, yy, da] of [[r, y, -half], [peak.r, peak.y, 0], [r, y, half]]) pos.push(rr * Math.sin(angle + da), yy, rr * Math.cos(angle + da));
  }
  for (let i = 0; i < steps; i++) { const a = i * 3, c = (i + 1) * 3; idx.push(a, a + 1, c, a + 1, c + 1, c, a + 1, a + 2, c + 1, a + 2, c + 2, c + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function ring(k, mat, cx, cz, r, sides, y0, y1, phase = 0) { k.prism(mat, cx, cz, r, sides, y0, y1, phase, r, 't'); }

/** Builds the great dome about the vertical axis through the origin (the dome axis). */
export function buildDome(k) {
  const { near } = k, D = DOME, SEG = near ? 32 : 16, at = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
  // Ring and cornice, drum with coupled columns and windows, entablature with its copper-lined rim.
  ring(k, 'stone', 0, 0, D.ringR, near ? 16 : 12, D.ringBase, D.ringTop, Math.PI / 16);
  k.prism('bronze', 0, 0, D.corniceR, near ? 16 : 12, D.ringTop, D.corniceTop, Math.PI / 16, D.corniceR, 'tb');
  ring(k, 'stone', 0, 0, D.drumR, SIDES, D.corniceTop - 0.2, D.drumTop + 0.2, Math.PI / SIDES);
  k.prism('stone', 0, 0, D.entabR, SIDES, D.drumTop, D.entabTop - 0.7, Math.PI / SIDES, D.entabR, 'tb');
  k.prism('bronze', 0, 0, D.rimR, SIDES, D.entabTop - 0.7, D.entabTop, Math.PI / SIDES, D.rimR, 'tb');
  const apothem = D.drumR * Math.cos(Math.PI / SIDES), yw0 = D.corniceTop + 3.0, yw1 = D.drumTop - 1.2;
  for (let i = 0; i < SIDES; i++) {
    const a = (i * 2 * Math.PI) / SIDES; // outward direction of facet i (facets face 0, 22.5, ... from +x toward +z)
    const corner = a + Math.PI / SIDES;
    const [cx, cz] = at(D.drumR + 0.45, corner);
    const [fx, fz] = at(apothem, a), W = k.frame(fx, fz, a);
    W.arch('glow', 0, yw0, 2.0, yw1 - yw0, 0.15);
    if (near) {
      W.box('stone', -1.35, 1.35, yw1 + 0.35, yw1 + 0.8, -0.05, 0.3, 'Z'); // lintel
      const C = k.frame(cx, cz, corner);
      for (const s of [-0.62, 0.62]) C.col('stone', s, 0, D.corniceTop, D.drumTop, 0.4, 0.4, 8);
      C.box('stone', -1.35, 1.35, D.drumTop - 0.5, D.drumTop, -0.4, 0.4, 'Y'); // capital block
    } else {
      const C = k.frame(cx, cz, corner);
      C.box('stone', -1.3, 1.3, D.corniceTop, D.drumTop, -0.3, 0.5, 'Y');
    }
  }

  // Copper dome: a lathe (32 segments near, 16 far) with sixteen ribs and two rows of oculi (near).
  const steps = near ? 10 : 6, profile = [[D.radius, D.spring - 0.3], [D.radius, D.spring]];
  for (let i = 1; i <= steps; i++) { const { r, y } = domeSurface((i / steps) * tMax); profile.push([r, y]); }
  k.lathe('copper', 0, 0, profile, SEG);
  const ribs = near ? 16 : 8;
  for (let i = 0; i < ribs; i++) k.put(ribGeometry((i * 2 * Math.PI) / ribs, near ? 10 : 5, near ? 0.55 : 1.0, near ? 0.2 : 0.45), 'copper');
  if (near) {
    for (const [frac, offset] of [[0.3, 0.5], [0.66, 0.5]]) {
      for (let i = 0; i < 16; i++) {
        const a = ((i + offset) * 2 * Math.PI) / 16, { r, y, nr, ny } = domeSurface(frac * tMax);
        const n = new THREE.Vector3(nr * Math.sin(a), ny, nr * Math.cos(a)), g = new THREE.CircleGeometry(frac < 0.5 ? 0.62 : 0.5, 6);
        g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n));
        g.translate(r * Math.sin(a) + n.x * 0.12, y + n.y * 0.12, r * Math.cos(a) + n.z * 0.12);
        k.put(g, 'glass');
      }
    }
  }

  // Lantern: colonnaded drum around a lit core, cornice, ornamented band, copper spire, ball, cross.
  const T = D.lantern;
  k.prism('stone', 0, 0, 3.6, 8, T.base - 0.4, T.base + 0.3, Math.PI / 8, 3.6, 't');
  k.prism('glow', 0, 0, 2.35, 8, T.base + 0.3, T.top, Math.PI / 8, 2.35, '');
  for (let i = 0; i < 8; i++) { const [px, pz] = at(2.95, (i * Math.PI) / 4); k.bar('stone', [px, T.base + 0.3, pz], [px, T.top, pz], near ? 0.5 : 0.7, near ? 0.5 : 0.7); }
  k.prism('stone', 0, 0, 3.55, 8, T.top, T.corniceTop, Math.PI / 8, 3.55, 'tb');
  k.prism('copper', 0, 0, 2.8, 8, T.corniceTop, T.bandTop, Math.PI / 8, 2.4, 't');
  k.lathe('copper', 0, 0, [[2.0, T.bandTop - 0.1], [1.45, T.bandTop + 1.0], [0.95, T.bandTop + 2.5], [0.55, T.spireTop - 0.3], [0.5, T.spireTop]], near ? 12 : 8);
  k.lathe('copper', 0, 0, [[0.01, T.ballY - 0.75], [0.55, T.ballY - 0.5], [0.75, T.ballY], [0.55, T.ballY + 0.5], [0.01, T.ballY + 0.75]], near ? 10 : 6);
  // lattice cross, 5.1 m tall and 3 m across
  k.bar('stone', [0, T.crossBase, 0], [0, T.tip, 0], 0.3, 0.3);
  k.bar('stone', [-1.5, T.crossBase + 3.7, 0], [1.5, T.crossBase + 3.7, 0], 0.3, 0.3);

  // Small domes over the front corner blocks.
  for (const [sx, sz] of SMALL_DOMES) {
    const base = 25.0, top = 32.4, Rr = 4.9;
    k.prism('stone', sx, sz, Rr, 8, base - 0.1, top, Math.PI / 8, Rr, 't');
    k.prism('bronze', sx, sz, Rr + 0.35, 8, top, top + 0.6, Math.PI / 8, Rr + 0.35, 'tb');
    if (near) {
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4, [fx, fz] = at(Rr * Math.cos(Math.PI / 8), a), W = k.frame(sx + fx, sz + fz, a);
        W.arch('glow', 0, base + 2.2, 1.6, 3.8, 0.15);
        const c = at(Rr + 0.3, a + Math.PI / 8);
        k.bar('stone', [sx + c[0], base + 0.5, sz + c[1]], [sx + c[0], top - 0.1, sz + c[1]], 0.6, 0.6);
      }
    }
    const dome = [[4.7, top + 0.55]], R2 = 4.7, rise = 4.5, n2 = near ? 6 : 4;
    for (let i = 1; i <= n2; i++) { const t = (i / n2) * Math.acos(1.0 / R2); dome.push([R2 * Math.cos(t), top + 0.55 + rise * Math.sin(t)]); }
    k.lathe('copper', sx, sz, dome, near ? 16 : 10);
    const c0 = dome[dome.length - 1][1];
    k.prism('stone', sx, sz, 1.05, 8, c0 - 0.2, c0 + 1.7, Math.PI / 8, 1.05, 't');
    k.lathe('copper', sx, sz, [[1.25, c0 + 1.7], [0.7, c0 + 2.6], [0.2, c0 + 3.4]], 8);
    k.bar('stone', [sx, c0 + 3.3, sz], [sx, c0 + 5.2, sz], 0.2, 0.2);
    k.bar('stone', [sx - 0.5, c0 + 4.6, sz], [sx + 0.5, c0 + 4.6, sz], 0.2, 0.2);
  }
  void L;
}
