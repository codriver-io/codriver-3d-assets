import * as THREE from 'three';
import { makeKit } from './st-pauls-cathedral-kit.js';
import { H, DOME, PLAN as P, WEST_PAIRS as W, domePoint, domeTAtNeck } from './st-pauls-cathedral-plan.js';

// Wren's cathedral as a driver reads it: a lead dome on a colonnaded drum, a lantern and
// gilded cross, two west towers with black-and-gold clocks and pineapple finials, a
// two-storey paired-column portico, and semicircular transept porches. Windows and orders
// are proud skins (≥ 0.16 m on the long walls) so nothing shares a plane with the mass.

const SIDES = (near) => (near ? 28 : 14);

function mass(k) {
  const { wbox } = k;
  const wall = H.wall, n = P.naveHalf, s = P.spineHalf;
  // Central vessel, west portico wall through to the apse springing. Aisles overlap it by
  // 0.3 m so the joint faces are buried, not coplanar.
  wbox('stone', P.westWall, P.eastSpine, 0, wall, -s, s);
  // Fill between the portico wall and each tower so the west block is one mass.
  wbox('stone', P.westWall, -70.6, 0, wall, s - 0.3, 14.6);
  wbox('stone', P.westWall, -70.6, 0, wall, -14.6, -s + 0.3);
  wbox('stone', -71.0, -17.2, 0, wall, s - 0.3, n);
  wbox('stone', -71.0, -17.2, 0, wall, -n, -s + 0.3);
  wbox('stone', 17.2, 58.6, 0, wall, s - 0.3, n);
  wbox('stone', 17.2, 58.6, 0, wall, -n, -s + 0.3);
  // Shoulders beside the west towers (the chapel bays), inside the outline's ±27 m bulge.
  wbox('stone', -71.2, -58.2, 0, wall, 13.5, 25.4);
  wbox('stone', -71.2, -58.2, 0, wall, -25.4, -13.5);
  // Transept arms. They overlap the aisle outer face.
  wbox('stone', -16.4, 16.4, 0, wall, n - 0.35, P.armV);
  wbox('stone', -16.4, 16.4, 0, wall, -P.armV, -n + 0.35);
  // Lead roofs behind the screen: a ridge over the nave and over each transept, stopped
  // at the crossing so the drum can rise clear of them.
  wbox('lead', -68, -18.2, wall - 0.15, 37.6, -6.4, 6.4);
  wbox('lead', 18.2, 57.2, wall - 0.15, 37.2, -6.2, 6.2);
  wbox('lead', -6.2, 6.2, wall - 0.15, 36.6, n - 0.2, P.armV - 1.2);
  wbox('lead', -6.2, 6.2, wall - 0.15, 36.6, -(P.armV - 1.2), -n + 0.2);
}

function corniceAndPlinth(k, near) {
  const { frame } = k;
  const n = P.naveHalf, y0 = H.wall - 0.7, y1 = H.cornice;
  // Stop at u 61: past there the choir outline collapses into the apse (u 64 is only ±8 m).
  const runs = [
    [0, n, Math.PI / 2, [[-66, -18.5], [18.5, 61]]],
    [0, -n, -Math.PI / 2, [[-66, -18.5], [18.5, 61]]],
  ];
  // North frame's s grows west, so a building-u interval [a,b] is s [-b,-a].
  const south = (f, spans) => spans.forEach(([a, b]) => band(f, a, b));
  const north = (f, spans) => spans.forEach(([a, b]) => band(f, -b, -a));
  function band(f, a, b) {
    f.box('stone2', a, b, 0, 2.55, 0.02, 0.18); // plinth, proud of the long wall
    f.box('stone', a, b, 15.35, 17.15, 0.04, 0.28); // storey entablature between the two orders
    f.box('stone', a, b, y0, y1, 0.02, 0.26); // cornice; outer face stays inside the 18.1 m pinch
    f.box('stone2', a, b, y1 - 0.08, y1 + 0.55, 0.06, 0.22); // balustrade rail
    if (!near) return;
    for (let s = a + 3.6; s < b - 1; s += 7.2) f.box('stone', s - 0.28, s + 0.28, y1 + 0.15, y1 + 1.35, 0.04, 0.28);
  }
  const fs = frame(0, n, Math.PI / 2), fn = frame(0, -n, -Math.PI / 2);
  south(fs, runs[0][3]);
  north(fn, runs[1][3]);
  flank(frame(16.35, 0, 0), n, P.armV - 0.4);
  flank(frame(-16.35, 0, Math.PI), n, P.armV - 0.4);
  flank(frame(16.35, 0, 0), -P.armV + 0.4, -n);
  flank(frame(-16.35, 0, Math.PI), -P.armV + 0.4, -n);
  function flank(f, a, b) {
    const s0 = Math.min(a, b), s1 = Math.max(a, b);
    f.box('stone2', s0, s1, 0, 2.55, 0.02, 0.2);
    f.box('stone', s0, s1, 15.35, 17.15, 0.04, 0.32);
    f.box('stone', s0, s1, y0, y1, 0.02, 0.4);
    f.box('stone2', s0, s1, y1 - 0.08, y1 + 0.5, 0.06, 0.24);
  }
  // Chapel outer faces (south and north), with one window each.
  for (const v of [25.4, -25.4]) {
    const f = frame(-64.7, v, v > 0 ? Math.PI / 2 : -Math.PI / 2);
    f.box('stone2', -6.2, 6.2, 0, 2.55, 0.02, 0.18);
    f.box('stone', -6.2, 6.2, 15.35, 17.15, 0.04, 0.28);
    f.box('stone', -6.2, 6.2, y0, y1, 0.02, 0.36);
    f.arch('glass', 0, 4.4, 2.3, 8.6, 0.16);
    f.arch('stone2', 0, 18.4, 2.0, 8.0, 0.1);
  }
}

function windows(k, near) {
  const { frame } = k;
  // Lower storey is a round-headed window; the upper screen is a blind niche. Paired
  // pilasters flank each bay. Far keeps the windows, niches and the storey cornice.
  const bay = (f, centers, sSign = 1) => {
    for (const u of centers) {
      const s = sSign * u;
      f.arch('glass', s, 3.4, 2.4, 10.4, 0.14);
      f.arch('stone2', s, 18.3, 2.05, 9.4, 0.09);
      if (!near) continue;
      f.box('stone2', s - 1.55, s + 1.55, 3.15, 3.45, 0.1, 0.24);
      for (const side of [-1, 1]) {
        const p = s + side * 2.15;
        f.box('stone2', p - 0.32, p + 0.32, 2.6, 15.2, 0.08, 0.24);
        f.box('stone2', p - 0.28, p + 0.28, 17.3, 32.6, 0.06, 0.2);
      }
    }
  };
  const westBays = [-48, -40.5, -33, -25.5];
  const eastBays = [24, 31.5, 39, 46.5, 54];
  const south = frame(0, P.naveHalf, Math.PI / 2);
  const north = frame(0, -P.naveHalf, -Math.PI / 2);
  bay(south, [...westBays, ...eastBays], 1);
  bay(north, [...westBays, ...eastBays], -1);
  // Transept end windows, above the porch pediment.
  for (const sign of [1, -1]) {
    const f = frame(0, P.armV * sign, sign > 0 ? Math.PI / 2 : -Math.PI / 2);
    f.arch('light', 0, 23.4, 4.4, 8.2, 0.18);
    if (near) for (const s of [-5.2, 5.2]) f.arch('glass', s, 5.2, 2.1, 6.2, 0.16);
  }
  // Aisle ends of the transept (east and west faces), two bays each.
  for (const side of [1, -1]) {
    const f = frame(16.35 * side, 0, side > 0 ? 0 : Math.PI);
    for (const v of [22, 28]) {
      const s = side > 0 ? v : -v;
      f.arch('glass', s, 3.6, 2.15, 9.6, 0.16);
      f.arch('stone2', s, 18.5, 1.85, 8.2, 0.1);
      f.arch('glass', -s, 3.6, 2.15, 9.6, 0.16);
      f.arch('stone2', -s, 18.5, 1.85, 8.2, 0.1);
      if (!near) continue;
      for (const sign of [s, -s]) {
        for (const side of [-1, 1]) {
          const p = sign + side * 1.7;
          f.box('stone2', p - 0.22, p + 0.22, 2.7, 15.15, 0.08, 0.22);
        }
      }
    }
  }
}

function westFront(k, near) {
  const { frame, wbox } = k;
  const wall = P.westWall;
  const f = frame(wall, 0, Math.PI); // outward is -u; s grows south
  // Steps between the towers, and the podium the columns stand on.
  wbox('stone2', -86.0, -84.55, 0, 0.45, -13.0, 13.0);
  wbox('stone2', -85.15, -83.7, 0.4, 0.95, -12.4, 12.4);
  wbox('stone', -84.4, -82.5, 0.85, 1.85, -13.2, 13.2);
  const pair = (s, d, y0, y1, r) => {
    f.col('stone', s - W.gap, d, y0, y1, r);
    f.col('stone', s + W.gap, d, y0, y1, r);
  };
  for (const s of W.lower) pair(s, 2.85, 1.85, 14.7, near ? 0.46 : 0.55);
  f.box('stone', -13.3, 13.3, 14.45, 16.55, 0.35, 3.45); // lower entablature
  for (const s of W.upper) pair(s, 1.9, 16.5, 25.8, near ? 0.4 : 0.5);
  f.box('stone', -8.8, 8.8, 25.45, 27.45, 0.35, 2.55);
  f.pediment('stone', -9.6, 9.6, 27.15, 7.6, 0.5, 2.45);
  // Great west door and the aisle doors behind the lower colonnade; the upper window is lit.
  f.arch('glass', 0, 1.9, 4.5, 10.6, 0.18);
  for (const s of [-4.4, 4.4, -8.8, 8.8]) f.arch('glass', s, 3.3, 2.35, 7.2, 0.18);
  f.arch('light', 0, 17.3, 4.2, 7.6, 0.2);
  if (near) for (const s of [-4.6, 4.6]) f.arch('glass', s, 18.0, 1.8, 5.4, 0.18);
  // Urns along the pediment rake.
  if (near) {
    f.col('stone', 0, 1.15, 34.0, 36.3, 0.38, 6);
    for (const s of [-4.6, 4.6, -8.4, 8.4]) f.col('stone', s, 1.05, 27.4 + (1 - Math.abs(s) / 9.2) * 6.6, 29.2 + (1 - Math.abs(s) / 9.2) * 6.6, 0.28, 5);
  }
}

function tower(k, near, vSign) {
  const { wbox, frame, cyl, lathe, col } = k;
  const u = P.towerU, v = P.towerV * vSign, h = P.towerHalf;
  // Square shaft overlapping the chapel/portico fill on its inner face. Clock stage is the
  // top of the same shaft (a smaller cap would put two skins in one plane).
  wbox('stone', u - h, u + h, 0, 44.6, v - h, v + h);
  wbox('stone', u - h - 0.16, u + h + 0.16, 43.8, 45.7, v - h - 0.16, v + h + 0.16);
  // Clocks: west face, and the outer face. Black dial, gold ring, twelve ticks on near.
  // Pilasters and a curved hood and apron sit outside the dial so the centre ray still hits clock.
  const clock = (fu, fv, phi) => {
    const f = frame(fu, fv, phi);
    const cy = 39.6;
    f.disc('lamp', 0, cy, 2.35, 0.07);
    f.disc('clock', 0, cy, 2.02, 0.15);
    // stone2, not the shaft's stone: a same-colour strip vanishes head-on. The dial centre stays clear.
    f.box('stone2', -3.72, -2.82, 35.85, 43.45, 0.05, 0.2);
    f.box('stone2', 2.82, 3.72, 35.85, 43.45, 0.05, 0.2);
    f.box('stone2', -5.48, -4.72, 36.05, 43.35, 0.04, 0.12);
    f.box('stone2', 4.72, 5.48, 36.05, 43.35, 0.04, 0.12);
    f.band('stone2', 0, cy, 2.42, 3.22, 0.02 * Math.PI, 0.98 * Math.PI, 0.06, 0.18);
    f.band('stone2', 0, cy, 2.42, 3.05, 1.16 * Math.PI, 1.84 * Math.PI, 0.06, 0.18);
    f.box('stone2', -3.7, 3.7, 42.95, 43.4, 0.05, 0.16);
    if (!near) return;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      f.box('lamp', Math.sin(a) * 1.62 - 0.08, Math.sin(a) * 1.62 + 0.08, cy + Math.cos(a) * 1.62 - 0.12, cy + Math.cos(a) * 1.62 + 0.12, 0.08, 0.2);
    }
  };
  clock(u - h, v, Math.PI);
  clock(u, v + h * vSign, vSign > 0 ? Math.PI / 2 : -Math.PI / 2);
  // Cupola stages above the clock cornice. The shaft is 11.6 m wide and the tip is 67.36 m,
  // 32.5 m above the screen cornice (about 2.8× the shaft). The stages themselves are a slim
  // open drum (7.2 m across, 11 m tall) and a concave lead cap, not a squat bell on a fat cylinder.
  const cr = 3.6;
  const nC = near ? 12 : 8;
  cyl('clock', u, v, 2.05, 46.5, 57.2, near ? 10 : 8, 2.05, true);
  for (let i = 0; i < nC; i++) {
    const a = (i / nC) * Math.PI * 2 + 0.22;
    col('stone', u + Math.sin(a) * cr, v + Math.cos(a) * cr, 46.0, 57.2, near ? 0.34 : 0.44, near ? 6 : 5);
  }
  cyl('stone', u, v, 4.15, 56.8, 58.35, near ? 12 : 8);
  cyl('stone2', u, v, 4.28, 58.15, 58.85, near ? 12 : 8);
  const seg = near ? 12 : 8;
  lathe('lead', u, v, [
    [3.05, 58.7], [3.4, 59.15], [2.95, 59.7], [2.15, 60.45], [1.45, 61.15], [1.05, 61.7],
    [1.12, 62.05], [0.95, 62.7], [0.62, 63.35], [0.32, 63.95], [0.12, 64.4],
  ], seg);
  lathe('lamp', u, v, [
    [0.08, 64.55], [0.14, 64.9], [0.28, 65.4], [0.4, 66.0], [0.44, 66.55], [0.36, 67.0], [0.2, 67.22], [0.06, H.tower],
  ], near ? 8 : 6);
}

function porch(k, near, vSign) {
  const { frame, wbox, col } = k;
  const cv = P.porchV * vSign, R = P.porchR;
  const n = near ? 9 : 6;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + ((i + 0.5) * Math.PI) / n;
    const u = Math.sin(a) * (R - 0.3);
    const v = cv + vSign * Math.cos(a) * (R - 0.3);
    col('stone', u, v, 1.7, 13.6, near ? 0.4 : 0.5, near ? 6 : 5);
  }
  // Curved entablature as overlapping boxes along the arc, then the pediment on the outer face.
  const slabs = near ? 8 : 5;
  for (let i = 0; i < slabs; i++) {
    const a = -Math.PI / 2 + ((i + 0.5) * Math.PI) / slabs;
    const phi = vSign > 0 ? Math.PI / 2 - a : -Math.PI / 2 + a;
    const u = Math.sin(a) * R;
    const v = cv + vSign * Math.cos(a) * R;
    const f = frame(u, v, phi);
    const chord = 2 * R * Math.sin(Math.PI / slabs / 2) + 0.45;
    f.box('stone', -chord / 2, chord / 2, 13.35, 15.7, -0.7, 0.45);
  }
  const face = cv + vSign * (R + 0.15);
  const ped = frame(0, face, vSign > 0 ? Math.PI / 2 : -Math.PI / 2);
  ped.pediment('stone', -5.2, 5.2, 15.05, 5.1, -0.15, 1.2);
  // Back wall and door, on the transept end.
  const back = frame(0, P.armV * vSign, vSign > 0 ? Math.PI / 2 : -Math.PI / 2);
  back.arch('glass', 0, 1.8, 3.6, 8.4, 0.16);
  // The porch steps narrow toward the tip: at |u|=4 the outline is already inside |v|=42.
  const thick = 1.2;
  const treads = [[1.15, 1.7, R - 0.55, 4.8], [0.55, 1.2, R + 0.45, 3.0], [0, 0.6, R + 1.4, 1.7]];
  for (const [y0, y1, extra, half] of treads) {
    const inner = cv + vSign * extra;
    const outer = cv + vSign * (extra + thick);
    wbox('stone2', -half, half, y0, y1, Math.min(inner, outer), Math.max(inner, outer));
  }
}

function apse(k, near) {
  const { frame, cyl } = k;
  const cu = P.apseU, R = P.apseR, n = near ? 9 : 6;
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + (i * Math.PI) / n;
    const am = a0 + Math.PI / n / 2;
    const f = frame(cu + Math.cos(am) * R, Math.sin(am) * R, am);
    const chord = 2 * R * Math.sin(Math.PI / n / 2) + 0.12;
    f.box('stone', -chord / 2, chord / 2, 0, H.wall - 0.4, -0.85, 0.06);
    f.box('stone2', -chord / 2, chord / 2, 0, 2.55, 0.01, 0.12);
    f.box('stone', -chord / 2, chord / 2, H.wall - 1.0, H.cornice - 0.3, 0.02, 0.14);
  }
  // East window on the axis, two more on the quarters.
  for (const a of [0, -0.7, 0.7]) {
    const f = frame(cu + Math.cos(a) * R, Math.sin(a) * R, a);
    f.arch(a === 0 ? 'light' : 'glass', 0, 6.5, a === 0 ? 3.4 : 2.2, a === 0 ? 12.5 : 8.5, 0.16);
  }
  cyl('lead', cu + 0.4, 0, R - 0.3, H.wall - 1.2, H.wall + 3.4, n, 0.5, false);
}

function ribGeometry(angle, steps, width, height) {
  const pos = [], idx = [], tMax = domeTAtNeck();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax;
    const { r, y } = domePoint(t);
    const nr = Math.cos(t) / DOME.radius, ny = Math.sin(t) / DOME.rise, nl = Math.hypot(nr, ny);
    const peakR = r + (nr / nl) * height, peakY = y + (ny / nl) * height;
    const half = Math.min(width / 2, r * 0.85) / Math.max(r, 1e-3);
    for (const [rr, yy, da] of [[r, y, -half], [peakR, peakY, 0], [r, y, half]]) {
      pos.push(rr * Math.sin(angle + da), yy, rr * Math.cos(angle + da));
    }
  }
  for (let i = 0; i < steps; i++) {
    const a = i * 3, c = (i + 1) * 3;
    idx.push(a, a + 1, c, a + 1, c + 1, c, a + 1, a + 2, c + 1, a + 2, c + 2, c + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function dome(k, near) {
  const { cyl, col, lathe, frame, put } = k;
  const seg = SIDES(near);
  const D = DOME;
  // Lower drum: stone, with a string course and shallow pilasters, then the peristyle.
  cyl('stone', 0, 0, 16.5, 35.6, 48.4, seg);
  cyl('stone2', 0, 0, 16.9, 41.4, 42.3, seg);
  cyl('stone', 0, 0, 17.15, 47.6, 49.3, seg);
  if (near) {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + 0.1;
      col('stone2', Math.sin(a) * 16.75, Math.cos(a) * 16.75, 36.2, 47.5, 0.32, 5);
    }
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    frame(Math.sin(a) * 16.5, Math.cos(a) * 16.5, a).disc('glass', 0, 44.2, 1.45, 0.16, near ? 12 : 8);
  }
  // Free-standing peristyle. The core is set well back so the bays are dark depth, not a
  // window band. Far keeps every other shaft, so the rhythm is still light column / dark gap.
  cyl('stone', 0, 0, D.galleryR, 48.5, 50.15, seg);
  cyl('clock', 0, 0, 14.6, 50.25, 58.4, seg, 14.6, true);
  const nCol = near ? D.columnN : 16;
  for (let i = 0; i < nCol; i++) {
    const a = (i / nCol) * Math.PI * 2;
    const cu = Math.sin(a) * D.columnR, cv = Math.cos(a) * D.columnR;
    const shaft = near ? 0.5 : 0.58;
    col('stone', cu, cv, 50.05, 58.15, shaft, near ? 8 : 6);
    col('stone2', cu, cv, 57.85, 58.85, shaft * 1.42, near ? 6 : 5);
  }
  cyl('stone', 0, 0, D.galleryR - 0.1, 58.55, 61.15, seg);
  cyl('stone2', 0, 0, D.galleryR - 0.4, 61.05, 61.85, seg);
  const nBal = near ? 32 : 12;
  for (let i = 0; i < nBal; i++) {
    const a = (i / nBal) * Math.PI * 2;
    col('stone', Math.sin(a) * (D.galleryR - 0.55), Math.cos(a) * (D.galleryR - 0.55), 61.1, near ? 62.7 : 62.45, near ? 0.2 : 0.28, 4);
  }
  // Attic under the lead, with small windows rather than a dark band.
  cyl('stone', 0, 0, 17.15, 62.0, 66.5, seg);
  const nAttic = near ? 16 : 8;
  for (let i = 0; i < nAttic; i++) {
    const a = (i / nAttic) * Math.PI * 2 + 0.12;
    frame(Math.sin(a) * 17.15, Math.cos(a) * 17.15, a).quad('light', -0.62, 0.62, 63.35, 65.05, 0.16);
  }
  cyl('stone2', 0, 0, 17.45, 66.15, 67.35, seg);
  // Lead dome. Vertical lip tucks over the stone curb; the ellipse reaches the lantern neck.
  const steps = near ? 10 : 6, tMax = domeTAtNeck();
  const profile = [[17.2, 66.9], [D.radius, D.spring]];
  for (let i = 1; i <= steps; i++) {
    const { r, y } = domePoint((i / steps) * tMax);
    profile.push([r, y]);
  }
  lathe('lead', 0, 0, profile, seg);
  const ribs = near ? 24 : 12;
  for (let i = 0; i < ribs; i++) put(ribGeometry((i / ribs) * Math.PI * 2, near ? 8 : 5, near ? 0.55 : 0.9, near ? 0.28 : 0.4), 'rib');
  lantern(k, near, domePoint(tMax).y);
}

function lantern(k, near, crownY) {
  const { cyl, col, lathe, frame } = k;
  const y = crownY - 0.4;
  cyl('stone', 0, 0, 5.15, y, y + 3.4, near ? 12 : 8);
  cyl('stone2', 0, 0, 5.7, y + 3.15, y + 4.35, near ? 12 : 8);
  const n = near ? 10 : 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.PI / n;
    col('stone', Math.sin(a) * 4.55, Math.cos(a) * 4.55, y + 4.1, y + 11.2, near ? 0.32 : 0.42, near ? 6 : 4);
    frame(Math.sin(a) * 3.5, Math.cos(a) * 3.5, a).quad('light', -0.55, 0.55, y + 6.2, y + 9.4, 0.08);
  }
  cyl('stone', 0, 0, 3.55, y + 4.2, y + 11.0, near ? 10 : 8, 3.55, true);
  cyl('stone', 0, 0, 5.35, y + 10.9, y + 12.7, near ? 12 : 8);
  lathe('lead', 0, 0, [[4.55, y + 12.3], [4.15, y + 13.2], [3.45, y + 14.5], [2.45, y + 15.8], [1.35, y + 16.9], [0.55, y + 17.6]], near ? 12 : 8);
  // Gilded ball and cross. Arms run both ways so the skyline reads from the west and from the south.
  const ball = y + 18.45;
  lathe('lamp', 0, 0, [[0.16, ball - 1.2], [1.05, ball - 0.75], [1.4, ball], [1.05, ball + 0.75], [0.18, ball + 1.15]], near ? 12 : 8);
  const top = H.cross;
  const arm = 2.35;
  // One flat cross, facing the west front. A second pair of arms reads as a star from the oblique.
  k.wbox('lamp', -0.38, 0.38, ball + 0.55, top, -0.38, 0.38);
  k.wbox('lamp', -0.34, 0.34, top - 2.35, top - 1.25, -arm, arm);
}

export function buildCathedral(b, near) {
  const k = makeKit(b, near);
  mass(k);
  corniceAndPlinth(k, near);
  windows(k, near);
  westFront(k, near);
  tower(k, near, 1);
  tower(k, near, -1);
  porch(k, near, 1);
  porch(k, near, -1);
  apse(k, near);
  dome(k, near);
}
