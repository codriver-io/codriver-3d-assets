import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  world, VX, VZ, H, U0, U1, V_FRONT, V_BACK, RECESS, PORT, WING_W, WING_E, COL_U, COL_V, ANTAE_U,
} from './royal-palace-oslo-plan.js';

// Det kongelige slott: a warm-beige U, grey stone base, hexastyle Ionic portico
// on the Karl Johan front, low hips behind a parapet. Skins sit proud of the
// stucco (0.16 m or more on the long fronts) so nothing shares a plane.
// Ground-floor openings are short rectangles. Arches are only the five loggia
// bays under the portico. The flag is the Norwegian cross, blue on the near LOD.

const WINGS = [WING_W, WING_E];

function addBox(b, mat, u, y, v, su, sy, sv, dropBottom = false) {
  if (su < 0.03 || sy < 0.03 || sv < 0.03) return;
  const g = new THREE.BoxGeometry(su, sy, sv);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const w = world(u + p.getX(i), y + p.getY(i), v + p.getZ(i));
    p.setXYZ(i, w[0], w[1], w[2]);
  }
  if (dropBottom) {
    const idx = g.index.array;
    const keep = [];
    const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), n = new THREE.Vector3();
    for (let i = 0; i < idx.length; i += 3) {
      va.fromBufferAttribute(p, idx[i]); vb.fromBufferAttribute(p, idx[i + 1]); vc.fromBufferAttribute(p, idx[i + 2]);
      n.crossVectors(vb.clone().sub(va), vc.clone().sub(va));
      if (n.y < -1e-4 && (va.y + vb.y + vc.y) / 3 < 0.12) continue;
      keep.push(idx[i], idx[i + 1], idx[i + 2]);
    }
    g.setIndex(keep);
  }
  g.computeVertexNormals();
  b.put(g, mat);
}

function onFace(b, mat, face, t, y, w, h, thick, dCenter) {
  if (w < 0.03 || h < 0.03 || thick < 0.03) return;
  const off = face.out * dCenter;
  if (face.axis === 'v') addBox(b, mat, t, y, face.v + off, w, h, thick);
  else addBox(b, mat, face.u + off, y, t, thick, h, w);
}

function place(face, t, y, d) {
  const off = face.out * d;
  return face.axis === 'v' ? world(t, y, face.v + off) : world(face.u + off, y, t);
}

// Upper half-disk extruded through the wall. ExtrudeGeometry is wound outward in
// shape space; a south-facing wall keeps that, the other three flip.
function archSolid(b, mat, face, t, ySpring, radius, thick, dCenter, segs) {
  const shape = new THREE.Shape();
  shape.moveTo(radius, 0);
  shape.absarc(0, 0, radius, 0, Math.PI, false);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false, curveSegments: segs });
  const p = g.attributes.position;
  const z0 = dCenter - thick / 2;
  for (let i = 0; i < p.count; i++) {
    const w = place(face, t + p.getX(i), ySpring + p.getY(i), z0 + p.getZ(i));
    p.setXYZ(i, w[0], w[1], w[2]);
  }
  if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
  const flip = face.axis === 'u' ? face.out > 0 : face.out < 0;
  if (flip) {
    const idx = g.index.array;
    for (let i = 0; i < idx.length; i += 3) {
      const s = idx[i]; idx[i] = idx[i + 1]; idx[i + 1] = s;
    }
  }
  g.computeVertexNormals();
  b.put(g, mat);
}

function quad(b, mat, pts, want) {
  const w = pts.map(([u, y, v]) => world(u, y, v));
  const ax = w[1][0] - w[0][0], ay = w[1][1] - w[0][1], az = w[1][2] - w[0][2];
  const bx = w[2][0] - w[0][0], by = w[2][1] - w[0][1], bz = w[2][2] - w[0][2];
  const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
  const order = nx * want[0] + ny * want[1] + nz * want[2] >= 0 ? [0, 1, 2, 0, 2, 3] : [0, 3, 2, 0, 2, 1];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(w.flat(), 3));
  g.setIndex(order);
  g.computeVertexNormals();
  b.put(g, mat);
}

function tri(b, mat, pts, want) {
  const w = pts.map(([u, y, v]) => world(u, y, v));
  const ax = w[1][0] - w[0][0], ay = w[1][1] - w[0][1], az = w[1][2] - w[0][2];
  const bx = w[2][0] - w[0][0], by = w[2][1] - w[0][1], bz = w[2][2] - w[0][2];
  const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
  const order = nx * want[0] + ny * want[1] + nz * want[2] >= 0 ? [0, 1, 2] : [0, 2, 1];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(w.flat(), 3));
  g.setIndex(order);
  g.computeVertexNormals();
  b.put(g, mat);
}

function faces() {
  const wingFace = (w, which) => {
    if (which === 'out') return { axis: 'u', u: w.u0 < 0 ? w.u0 : w.u1, out: w.u0 < 0 ? -1 : 1, t0: w.v0, t1: V_BACK };
    if (which === 'in') return { axis: 'u', u: w.u0 < 0 ? w.u1 : w.u0, out: w.u0 < 0 ? 1 : -1, t0: w.v0, t1: V_BACK };
    return { axis: 'v', v: w.v0, out: -1, t0: Math.min(w.u0, w.u1), t1: Math.max(w.u0, w.u1) };
  };
  return [
    { axis: 'v', v: V_FRONT, out: 1, t0: U0, t1: PORT.u0, rank: 'street', body: 'main' },
    { axis: 'v', v: V_FRONT, out: 1, t0: PORT.u1, t1: U1, rank: 'street', body: 'main' },
    { axis: 'u', u: U0, out: -1, t0: V_BACK, t1: V_FRONT, rank: 'street', body: 'main' },
    { axis: 'u', u: U1, out: 1, t0: V_BACK, t1: V_FRONT, rank: 'street', body: 'main' },
    { axis: 'v', v: V_BACK, out: -1, t0: WING_W.u1, t1: RECESS.u0, rank: 'court', body: 'main' },
    { axis: 'v', v: V_BACK, out: -1, t0: RECESS.u1, t1: WING_E.u0, rank: 'court', body: 'main' },
    { axis: 'v', v: RECESS.v, out: -1, t0: RECESS.u0, t1: RECESS.u1, rank: 'court', body: 'main' },
    { axis: 'u', u: RECESS.u0, out: -1, t0: RECESS.v, t1: V_BACK, rank: 'court', body: 'main', windows: false },
    { axis: 'u', u: RECESS.u1, out: 1, t0: RECESS.v, t1: V_BACK, rank: 'court', body: 'main', windows: false },
    { ...wingFace(WING_W, 'out'), rank: 'street', body: 'wing' },
    { ...wingFace(WING_W, 'in'), rank: 'court', body: 'wing' },
    { ...wingFace(WING_W, 'end'), rank: 'end', body: 'wing' },
    { ...wingFace(WING_E, 'out'), rank: 'street', body: 'wing' },
    { ...wingFace(WING_E, 'in'), rank: 'court', body: 'wing' },
    { ...wingFace(WING_E, 'end'), rank: 'end', body: 'wing' },
  ];
}

function baysOf(face, target) {
  const len = face.t1 - face.t0;
  const n = Math.max(face.body === 'wing' && len < 18 ? 3 : 2, Math.round(len / target));
  const margin = Math.min(1.05, len * 0.06);
  const pitch = (len - 2 * margin) / n;
  const centers = [];
  for (let i = 0; i < n; i++) centers.push(face.t0 + margin + pitch * (i + 0.5));
  return { centers, pitch, n };
}

const MAIN_ROWS = [
  // Short rectangles in the stone base. The loggia behind the columns is the portico's own arches.
  { y0: 2.45, y1: 5.15, mat: 'glass', wf: 0.42, surface: 0.24, skipLoggia: true },
  { y0: 8.7, y1: 13.15, mat: 'glow', wf: 0.44, surface: 0 },
  { y0: 15.35, y1: 18.7, mat: 'glass', wf: 0.38, surface: 0 },
];
const WING_ROWS = [
  { y0: 1.55, y1: 3.85, mat: 'glass', wf: 0.44, surface: 0.2 },
  { y0: 5.45, y1: 9.15, mat: 'glow', wf: 0.44, surface: 0 },
  { y0: 10.35, y1: 13.15, mat: 'glass', wf: 0.36, surface: 0 },
];

function pane(b, near, face, t, row, w) {
  // Court and wing-end reveals stay shallow so they remain inside the ring.
  // Court and wing-end reveals stay shallow: the north wall has ~0.4 m of ring clearance.
  const tight = face.rank !== 'street';
  const surface = tight ? 0 : row.surface;
  // East wing inner corner has ~0.14 m of ring, so court glass stays under 0.09 m proud.
  const trimD = tight ? 0.03 : surface + 0.2;
  const glassD = tight ? 0.07 : surface + 0.26;
  const skin = tight ? 0.04 : 0.06;
  const y0 = row.y0;
  const y1 = row.y1;
  const arch = near && row.arch && w > 1.1;
  const radius = arch ? Math.min(w / 2, y1 - y0 - 0.8) : 0;
  const spring = y1 - radius;
  const rectTop = arch ? spring + 0.05 : y1;
  const rectH = rectTop - y0;
  const cy = y0 + rectH / 2;
  if (near) {
    onFace(b, 'trim', face, t, (y0 + y1) / 2, w + (tight ? 0.12 : 0.3), (y1 - y0) + (tight ? 0.12 : 0.28), skin, trimD);
    onFace(b, row.mat, face, t, cy, w, rectH, skin, glassD);
    if (arch) {
      archSolid(b, 'trim', face, t, spring, radius + (tight ? 0.08 : 0.14), skin, trimD, tight ? 5 : 7);
      archSolid(b, row.mat, face, t, spring, radius, skin, glassD, tight ? 5 : 7);
    }
    if (row.mat === 'glow' && face.rank === 'street') {
      onFace(b, 'trim', face, t, y0 + (y1 - y0) * 0.58, w * 0.78, 0.045, 0.03, glassD + 0.06);
    }
  } else {
    onFace(b, row.mat, face, t, (y0 + y1) / 2, w, y1 - y0, skin, tight ? glassD : surface + 0.28);
  }
}

function windows(b, near) {
  for (const face of faces()) {
    if (face.windows === false) continue;
    const rows = face.body === 'main' ? MAIN_ROWS : WING_ROWS;
    const { centers, pitch } = baysOf(face, face.body === 'main' ? 3.3 : 3.9);
    for (const t of centers) {
      for (const row of rows) pane(b, near, face, t, row, Math.min(pitch * row.wf, 1.85));
    }
  }
  // Openings on the wall behind the colonnade, between the columns.
  const back = { axis: 'v', v: V_FRONT, out: 1, rank: 'street', body: 'main' };
  for (let i = 0; i < COL_U.length - 1; i++) {
    const t = (COL_U[i] + COL_U[i + 1]) / 2;
    const gap = COL_U[i + 1] - COL_U[i];
    for (const row of MAIN_ROWS) {
      if (row.skipLoggia) continue;
      pane(b, near, back, t, row, Math.min(gap * 0.46, 1.7));
    }
  }
}

function band(b, face, y0, y1, inner, outer, mat) {
  onFace(b, mat, face, (face.t0 + face.t1) / 2, (y0 + y1) / 2, face.t1 - face.t0, y1 - y0, outer - inner, (inner + outer) / 2);
}

function skins(b, near) {
  for (const face of faces()) {
    const street = face.rank === 'street';
    // Court proud stays under 0.1 m: the east wing's inner corner has only ~0.14 m of ring.
    const proud = (s, e, c) => (street ? s : face.rank === 'end' ? e : c);
    const proj = proud(0.46, 0.26, 0.12);
    const baseTop = face.body === 'main' ? H.baseTop : 4.5;
    band(b, face, 0.02, baseTop, -0.03, proud(0.2, 0.14, 0.07), 'granite');
    if (face.body === 'main') {
      band(b, face, H.string0, H.string1, 0.02, proud(0.42, 0.22, 0.12), 'trim');
      band(b, face, H.mid0, H.mid1, 0.02, proud(0.3, 0.16, 0.1), 'trim');
      band(b, face, H.cornice0, H.cornice1, 0.04, proj, 'trim');
      band(b, face, H.parapet0, H.parapet1, 0.02, proud(0.32, 0.14, 0.08), 'stucco');
      if (near && street && face.axis === 'v' && face.out > 0) {
        const step = 1.55;
        for (let t = face.t0 + 0.7; t < face.t1 - 0.4; t += step) {
          onFace(b, 'trim', face, t, H.cornice0 - 0.16, 0.3, 0.32, 0.2, 0.34);
        }
        for (let t = face.t0 + 1.3; t < face.t1 - 0.8; t += 3.1) {
          onFace(b, 'trim', face, t, H.parapet1 - 0.08, 0.28, 0.55, 0.22, 0.4);
        }
      }
    } else {
      band(b, face, 4.42, 5.12, 0.02, proud(0.34, 0.18, 0.08), 'trim');
      band(b, face, H.wingCorn0, H.wingCorn1, 0.03, proud(0.4, 0.24, 0.08), 'trim');
      band(b, face, H.wingPar0, H.wingPar1, 0.02, proud(0.24, 0.12, 0.06), 'stucco');
    }
  }
}

function masses(b) {
  const midU = (U0 + U1) / 2;
  const midV = (V_BACK + V_FRONT) / 2;
  addBox(b, 'stucco', midU, H.wallTop / 2, midV, U1 - U0, H.wallTop, V_FRONT - V_BACK, true);
  const rv1 = V_BACK + 0.45;
  addBox(b, 'stucco', (RECESS.u0 + RECESS.u1) / 2, H.wallTop / 2, (RECESS.v + rv1) / 2, RECESS.u1 - RECESS.u0, H.wallTop, rv1 - RECESS.v, true);
  for (const w of WINGS) {
    addBox(b, 'stucco', (w.u0 + w.u1) / 2, H.wingWall / 2, (w.v0 + w.v1) / 2, Math.abs(w.u1 - w.u0), H.wingWall, w.v1 - w.v0, true);
  }
}

function column(b, near, u, v) {
  const sides = near ? 14 : 8;
  const putCyl = (y0, y1, r0, r1) => {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, sides);
    const p = g.attributes.position;
    const cy = (y0 + y1) / 2;
    for (let i = 0; i < p.count; i++) {
      const w = world(u + p.getX(i), cy + p.getY(i), v + p.getZ(i));
      p.setXYZ(i, w[0], w[1], w[2]);
    }
    g.computeVertexNormals();
    b.put(g, 'trim');
  };
  // Base and abacus stay inside the portico nose (mapped v ≈ 29.24).
  putCyl(H.col0, H.col0 + 0.32, 0.62, 0.56);
  putCyl(H.colShaft0, H.colShaft1, 0.58, 0.52);
  putCyl(H.capital0, H.capital0 + 0.55, 0.54, 0.6);
  addBox(b, 'trim', u, H.capital1 - 0.2, v, 1.2, 0.4, 1.08);
}

function portico(b, near) {
  const front = { axis: 'v', v: PORT.vFront - 0.55, out: 1 };
  const pierW = 1.16;
  const yLintel = 6.25;
  // Piers under the columns, and the two corner closers.
  const pierU = [PORT.u0 + pierW / 2, ...COL_U, PORT.u1 - pierW / 2];
  for (const u of pierU) {
    onFace(b, 'trim', front, u, yLintel / 2, pierW, yLintel, 1.05, 0.15);
  }
  onFace(b, 'trim', front, 0.14, (yLintel + H.string1) / 2, PORT.u1 - PORT.u0, H.string1 - yLintel + 0.15, 1.12, 0.12);
  // Side walls of the porch, back to the palace wall.
  for (const u of [PORT.u0 + 0.28, PORT.u1 - 0.28]) {
    addBox(b, 'trim', u, H.string1 / 2, (V_FRONT + PORT.vFront) / 2 - 0.3, 0.56, H.string1, PORT.vFront - V_FRONT - 0.8);
  }
  const segs = near ? 8 : 5;
  for (let i = 0; i < COL_U.length - 1; i++) {
    const u0 = COL_U[i] + pierW * 0.48;
    const u1 = COL_U[i + 1] - pierW * 0.48;
    const t = (u0 + u1) / 2;
    const w = u1 - u0;
    if (w < 1.4) continue;
    const radius = Math.min(w / 2 - 0.04, 2.25);
    const crown = 5.7;
    const spring = crown - radius;
    // White pier-wall behind a smaller dark arch, so the lunette stays dark and the rim stays white.
    onFace(b, 'trim', front, t, (0.3 + yLintel) / 2, w + 0.2, yLintel - 0.3, 0.22, 0.0);
    archSolid(b, 'trim', front, t, spring, radius, 0.22, 0.0, segs);
    onFace(b, 'glass', front, t, (0.42 + spring) / 2, Math.max(0.4, w - 0.28), spring - 0.42, 0.08, 0.2);
    archSolid(b, 'glass', front, t, spring, Math.max(0.4, radius - 0.16), 0.08, 0.2, segs);
  }
  for (const u of COL_U) column(b, near, u, COL_V);
  for (const u of ANTAE_U) {
    addBox(b, 'trim', u, (H.col0 + H.capital1) / 2, V_FRONT + 0.32, 0.84, H.capital1 - H.col0, 1.05);
  }
  // Entablature: front beam and the two returns.
  const entU = (PORT.u0 + PORT.u1) / 2;
  addBox(b, 'trim', entU, (H.entab0 + H.entab1) / 2, COL_V - 0.16, PORT.u1 - PORT.u0 - 0.55, H.entab1 - H.entab0, 1.02);
  for (const u of [PORT.u0 + 0.55, PORT.u1 - 0.55]) {
    addBox(b, 'trim', u, (H.entab0 + H.entab1) / 2, (V_FRONT + COL_V) / 2, 0.7, H.entab1 - H.entab0, COL_V - V_FRONT);
  }
  pediment(b);
  balcony(b, near);
}

function pediment(b) {
  const u0 = PORT.u0 + 0.15;
  const u1 = PORT.u1 - 0.15;
  const um = (u0 + u1) / 2;
  const y0 = H.entab1 - 0.06;
  const y1 = H.apex;
  const v0 = COL_V - 0.35;
  const v1 = COL_V + 0.32;
  const up = [0, 1, 0];
  // Tympanum, set back from the raking cornice.
  tri(b, 'stucco', [[u0 + 0.55, y0 + 0.15, v1 - 0.16], [u1 - 0.55, y0 + 0.15, v1 - 0.16], [um, y1 - 0.28, v1 - 0.16]], [VX, 0, VZ]);
  tri(b, 'trim', [[u0, y0, v1], [u1, y0, v1], [um, y1, v1]], [VX, 0, VZ]);
  tri(b, 'trim', [[u1, y0, v0], [u0, y0, v0], [um, y1, v0]], [-VX, 0, -VZ]);
  quad(b, 'trim', [[u0, y0, v0], [u0, y0, v1], [um, y1, v1], [um, y1, v0]], up);
  quad(b, 'trim', [[u1, y0, v1], [u1, y0, v0], [um, y1, v0], [um, y1, v1]], up);
}

function balcony(b, near) {
  const u0 = COL_U[0] + 0.85;
  const u1 = COL_U[COL_U.length - 1] - 0.85;
  const v1 = COL_V - 0.7;
  addBox(b, 'trim', (u0 + u1) / 2, H.balconyY + 0.12, (V_FRONT + v1) / 2, u1 - u0, 0.26, v1 - V_FRONT);
  const railY = (H.balconyY + 0.28 + H.balconyTop) / 2;
  const railH = H.balconyTop - (H.balconyY + 0.28);
  addBox(b, 'iron', (u0 + u1) / 2, H.balconyTop - 0.08, v1 - 0.06, u1 - u0, 0.14, 0.1);
  addBox(b, 'iron', u0, railY, (V_FRONT + 0.4 + v1) / 2, 0.08, railH, v1 - V_FRONT - 0.5);
  addBox(b, 'iron', u1, railY, (V_FRONT + 0.4 + v1) / 2, 0.08, railH, v1 - V_FRONT - 0.5);
  if (near) {
    const step = 0.42;
    for (let u = u0 + 0.3; u < u1 - 0.2; u += step) {
      addBox(b, 'iron', u, railY, v1 - 0.08, 0.045, railH, 0.045);
    }
  }
}

function hip(b, u0, u1, v0, v1, yE, yR) {
  const up = [0, 1, 0];
  const du = u1 - u0;
  const dv = v1 - v0;
  if (du >= dv) {
    const run = dv / 2;
    const vc = (v0 + v1) / 2;
    let ru0 = u0 + run;
    let ru1 = u1 - run;
    if (ru1 <= ru0 + 0.2) { ru0 = ru1 = (u0 + u1) / 2; }
    quad(b, 'roof', [[u0, yE, v1], [u1, yE, v1], [ru1, yR, vc], [ru0, yR, vc]], up);
    quad(b, 'roof', [[u1, yE, v0], [u0, yE, v0], [ru0, yR, vc], [ru1, yR, vc]], up);
    tri(b, 'roof', [[u1, yE, v1], [u1, yE, v0], [ru1, yR, vc]], up);
    tri(b, 'roof', [[u0, yE, v0], [u0, yE, v1], [ru0, yR, vc]], up);
  } else {
    const run = du / 2;
    const uc = (u0 + u1) / 2;
    let rv0 = v0 + run;
    let rv1 = v1 - run;
    if (rv1 <= rv0 + 0.2) { rv0 = rv1 = (v0 + v1) / 2; }
    quad(b, 'roof', [[u1, yE, v0], [u1, yE, v1], [uc, yR, rv1], [uc, yR, rv0]], up);
    quad(b, 'roof', [[u0, yE, v1], [u0, yE, v0], [uc, yR, rv0], [uc, yR, rv1]], up);
    tri(b, 'roof', [[u1, yE, v1], [u0, yE, v1], [uc, yR, rv1]], up);
    tri(b, 'roof', [[u0, yE, v0], [u1, yE, v0], [uc, yR, rv0]], up);
  }
}

function roofs(b, near) {
  hip(b, U0 + 1.5, U1 - 1.5, V_BACK + 1.35, V_FRONT - 1.55, H.eave, H.ridge);
  hip(b, RECESS.u0 + 0.7, RECESS.u1 - 0.7, RECESS.v + 0.55, V_BACK + 0.2, H.eave - 0.15, H.eave + 0.35);
  for (const w of WINGS) {
    const u0 = Math.min(w.u0, w.u1) + 0.7;
    const u1 = Math.max(w.u0, w.u1) - 0.7;
    hip(b, u0, u1, w.v0 + 0.7, V_BACK - 0.85, H.wingEave, H.wingRidge);
  }
  flag(b, near);
}

// Norwegian civil flag, 22:16, the cross offset toward the hoist. The pole rises
// clear of the pediment (apex 24.25 m). White reuses trim. Blue is near-only so
// the far LOD stays on eight draws; its bars sit inside the white cross.
function flag(b, near) {
  const pu = (PORT.u0 + PORT.u1) / 2;
  const pv = (V_BACK + V_FRONT) / 2;
  b.bar('iron', world(pu, H.ridge - 0.15, pv), world(pu, H.flag, pv), 0.14, 0.14, 0, true);
  const unit = 0.36;
  const fh = 16 * unit;
  const fw = 22 * unit;
  const top = H.flag - 0.45;
  const cy = top - fh / 2;
  const hoist = pu + 0.4;
  const cu = hoist + fw / 2;
  const crossU = hoist + 8 * unit;
  addBox(b, 'flag', cu, cy, pv, fw, fh, 0.08);
  const bars = (mat, units, thick, d) => {
    const band = units * unit;
    addBox(b, mat, crossU, cy, pv + d, band, fh, thick);
    addBox(b, mat, cu, cy, pv + d, fw, band, thick);
    addBox(b, mat, crossU, cy, pv - d, band, fh, thick);
    addBox(b, mat, cu, cy, pv - d, fw, band, thick);
  };
  bars('trim', 4, 0.05, 0.115);
  if (near) bars('blue', 2, 0.04, 0.21);
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  masses(b);
  skins(b, near);
  windows(b, near);
  portico(b, near);
  roofs(b, near);
  return b.finish();
}
