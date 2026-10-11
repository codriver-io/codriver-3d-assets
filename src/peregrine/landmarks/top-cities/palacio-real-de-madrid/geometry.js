import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  world, WALLS, RETURNS, COURT_WALLS, COURT, WINGS, MASSES, H, ROWS, bayCenters, GATE,
} from './palacio-real-de-madrid-plan.js';

// Palacio Real: a hollow square of white limestone on a granite base, corner pavilions,
// a balustrade of king statues, and the Prince's Gate under a royal crown on the south
// front. The south galleries are the lower arcades of the Plaza de la Armería.
// Skins sit proud of the stone (embedded 5 cm, face at least 0.15 m clear of it).
// The stone itself is already 0.95 m inside the mapped ring.

function addBox(b, mat, u, y, v, su, sy, sv) {
  if (su <= 0.02 || sy <= 0.02 || sv <= 0.02) return;
  const g = new THREE.BoxGeometry(su, sy, sv);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const w = world(u + p.getX(i), y + p.getY(i), v + p.getZ(i));
    p.setXYZ(i, w[0], w[1], w[2]);
  }
  // Drop downward faces on the grade. They sit in the same plane as the stone
  // bottoms (granite plinths, the court floor) and the metrics count that as flicker.
  const idx = g.index.array, keep = [];
  const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < idx.length; i += 3) {
    va.fromBufferAttribute(p, idx[i]); vb.fromBufferAttribute(p, idx[i + 1]); vc.fromBufferAttribute(p, idx[i + 2]);
    n.crossVectors(vb.clone().sub(va), vc.clone().sub(va));
    if (n.y < 0 && (va.y + vb.y + vc.y) / 3 < 0.05) continue;
    keep.push(idx[i], idx[i + 1], idx[i + 2]);
  }
  g.setIndex(keep);
  g.computeVertexNormals();
  b.put(g, mat);
}

// A run of wall. `back`/`front` are offsets along the outward normal from the stone plane.
function segBox(b, mat, s, y0, y1, back, front, t0 = s.t0, t1 = s.t1) {
  if (t1 - t0 < 0.08 || y1 - y0 < 0.04) return;
  const depth = Math.abs(front - back);
  const mid = s.out * (front + back) / 2;
  const cy = (y0 + y1) / 2;
  const hy = y1 - y0;
  if (s.axis === 'v') addBox(b, mat, (t0 + t1) / 2, cy, s.face + mid, t1 - t0, hy, depth);
  else addBox(b, mat, s.face + mid, cy, (t0 + t1) / 2, depth, hy, t1 - t0);
}

function column(b, mat, u, v, y0, y1, r, sides) {
  const g = new THREE.CylinderGeometry(r, r * 1.05, y1 - y0, sides);
  const p = g.attributes.position;
  const cy = (y0 + y1) / 2;
  for (let i = 0; i < p.count; i++) {
    const w = world(u + p.getX(i), cy + p.getY(i), v + p.getZ(i));
    p.setXYZ(i, w[0], w[1], w[2]);
  }
  g.computeVertexNormals();
  b.put(g, mat);
}

// Quad in building metres. `pts` is CCW seen from the side that should be visible.
function quad(b, mat, pts) {
  const pos = [];
  for (const [u, y, v] of pts) pos.push(...world(u, y, v));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  g.computeVertexNormals();
  b.put(g, mat);
}

// Same quad, wound so the world-space normal points up. The Y component of
// (p1-p0) × (p2-p0) is az*bx - ax*bz; the rotation about Y does not change it.
function quadUp(b, mat, pts) {
  const w = pts.map(([u, y, v]) => world(u, y, v));
  const ax = w[1][0] - w[0][0], az = w[1][2] - w[0][2];
  const bx = w[2][0] - w[0][0], bz = w[2][2] - w[0][2];
  const ny = az * bx - ax * bz;
  quad(b, mat, ny >= 0 ? pts : [pts[0], pts[3], pts[2], pts[1]]);
}

function mass(b) {
  const top = H.wallTop;
  for (const [u0, u1, v0, v1] of MASSES) {
    addBox(b, 'stone', (u0 + u1) / 2, top / 2, (v0 + v1) / 2, u1 - u0, top, v1 - v0);
  }
  const g = GATE;
  // Lintel and the wall above the arch, from the portal back to the stone face.
  addBox(b, 'stone', 0, (g.crown + top) / 2, (g.back + g.face) / 2, g.uR - g.uL, top - g.crown, g.face - g.back);
  // Door wall at the back of the portal. The arch soffit lands on its top.
  addBox(b, 'granite', 0, g.crown / 2, g.back + 0.22, g.uR - g.uL - 0.4, g.crown, 0.4);
}

// Bands that must not cross the arch. Below the crown, only the jambs are drawn.
// The granite base is rustication(), not a smooth skin. One solid parapet replaces
// the two thin rails so the hip eaves stay hidden behind it.
const SKIN = [
  ['trim', H.string0, H.string1, -0.04, 0.40],
  ['trim', H.cornice0, H.cornice1, -0.08, 0.68],
  ['trim', 31.70, 33.15, 0.06, 0.74],
];

function skinRun(b, s, mat, y0, y1, back, front) {
  if (!s.gate || y0 >= GATE.crown) {
    segBox(b, mat, s, y0, y1, back, front);
    return;
  }
  const yCut = Math.min(y1, GATE.crown);
  if (yCut > y0) {
    segBox(b, mat, s, y0, yCut, back, front, s.t0, GATE.uL);
    segBox(b, mat, s, y0, yCut, back, front, GATE.uR, s.t1);
  }
  if (y1 > GATE.crown) segBox(b, mat, s, GATE.crown, y1, back, front);
}

// A cheek shorter than 8 m is the return between a pavilion and a recess. A 0.68 m
// cornice on that cheek lands on the pavilion's stone face. Hold the projection
// to 0.30 m so the trim stays at least 5 cm clear of that face.
function skinFront(s, front) {
  return s.t1 - s.t0 < 8 ? Math.min(front, 0.30) : front;
}

// The mapped ring bites in at two places. A full-width band only has vertices at
// its ends, which clear; a pier, window or statue landing in a bite does not.
function localCap(s, t) {
  if (s.id === 'n-re') return 0.52;
  if (s.gate && Math.abs(t) < 9) return 0.60;
  if (s.id === 'w-w' && ((t > -7.2 && t < -3.8) || (t > 4.4 && t < 7.6))) return 0.52;
  return 0.92;
}

function skins(b, near) {
  const outer = new Set(WALLS);
  const runs = [...WALLS, ...RETURNS, ...COURT_WALLS];
  for (const s of runs) {
    // Outer fronts take channelled rustication. Court and cheeks keep one granite band.
    if (!outer.has(s)) skinRun(b, s, 'granite', 0, H.baseTop, -0.06, skinFront(s, 0.28));
    for (const [mat, y0, y1, back, front] of SKIN) skinRun(b, s, mat, y0, y1, back, skinFront(s, front));
    if (near) skinRun(b, s, 'trim', 19.35, 19.62, 0.10, 0.28);
  }
}

// Pier lines between window bays. The gate's own columns are the giant order there.
function piersOf(s) {
  if (s.gate) return GATE_COLUMNS.filter((t) => Math.abs(t) > 6.5);
  const bays = bayCenters(s.t0, s.t1);
  if (!bays.length) return [];
  const step = bays.length > 1 ? bays[1] - bays[0] : (s.t1 - s.t0);
  const ts = [];
  for (let t = bays[0] - step / 2; t <= bays[bays.length - 1] + step / 2 + 0.01; t += step) {
    if (t > s.t0 + 0.45 && t < s.t1 - 0.45) ts.push(Math.round(t * 100) / 100);
  }
  return ts;
}

const ORDER_IDS = new Set(['s-sw', 's-wl', 's-wr', 's-se', 'e-ne', 'e-w', 'e-se', 'w-nw', 'w-w', 'w-sw']);

// Giant order on the upper two storeys: a pilaster 0.86 m proud of the stone, with a
// capital held under the cornice so the two faces do not share a plane.
function pilasters(b, near) {
  for (const s of WALLS) {
    if (!ORDER_IDS.has(s.id)) continue;
    for (const t of piersOf(s)) {
      const cap = localCap(s, t);
      // 0.80–0.82 m proud: the ring only clears about 0.87 m on the east and west pavilions.
      segBox(b, 'stone', s, 10.55, near ? 28.4 : 29.2, 0.08, Math.min(0.80, cap), t - 0.48, t + 0.48);
      if (near) segBox(b, 'trim', s, 28.15, 29.5, 0.02, Math.min(0.82, cap), t - 0.68, t + 0.68);
    }
  }
}

// Channelled granite base. Courses stop short of each other so the joint is the
// stone wall behind them. Near adds a deeper block on every pier.
function rustication(b, near) {
  const courses = near ? [[0.2, 3.65], [4.15, 7.4], [7.9, 10.32]] : [[0.2, 5.05], [5.55, 10.32]];
  const field = 0.34;
  for (const s of WALLS) {
    for (const [y0, y1] of courses) {
      if (s.gate && y1 > GATE.crown) {
        const cut = Math.min(y1, GATE.crown);
        if (cut > y0) {
          segBox(b, 'granite', s, y0, cut, 0.02, field, s.t0, GATE.uL - 0.15);
          segBox(b, 'granite', s, y0, cut, 0.02, field, GATE.uR + 0.15, s.t1);
        }
        if (y1 > GATE.crown) segBox(b, 'granite', s, Math.max(y0, GATE.crown), y1, 0.02, field);
      } else if (s.gate) {
        segBox(b, 'granite', s, y0, y1, 0.02, field, s.t0, GATE.uL - 0.15);
        segBox(b, 'granite', s, y0, y1, 0.02, field, GATE.uR + 0.15, s.t1);
      } else {
        segBox(b, 'granite', s, y0, y1, 0.02, field);
      }
    }
    if (!near) continue;
    for (const t of piersOf(s)) {
      const front = Math.min(0.78, localCap(s, t));
      if (front < 0.5) continue;
      for (const [y0, y1] of courses) {
        segBox(b, 'granite', s, y0, y1, 0.08, front, t - 0.62, t + 0.62);
      }
    }
  }
}

// Bays along a wall. The Prince's Gate wall keeps a window in every intercolumniation;
// the centre bay skips the rows the arch already occupies.
const GATE_COLUMNS = [-11.3, -8.7, -3.5, 3.5, 8.7, 11.3];

function windowBays(s) {
  if (!s.gate) return bayCenters(s.t0, s.t1).map((t) => ({ t, rows: ROWS }));
  const edges = [s.t0, ...GATE_COLUMNS, s.t1];
  const bays = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const a = edges[i], c = edges[i + 1], mid = (a + c) / 2;
    const clear = (c - a) - 1.15;
    if (clear < 1.05) continue;
    const centre = Math.abs(mid) < 1;
    const rows = ROWS.filter((row) => !(centre && row.y1 <= GATE.crown + 0.5))
      .map((row) => ({ ...row, w: Math.min(row.w, clear * 0.92) }));
    bays.push({ t: mid, rows });
  }
  return bays;
}

// One glazed face, wound so its normal points out of the wall. Far uses these
// instead of a box, so a row cannot collapse into one dark ribbon.
function pane(b, mat, s, y0, y1, front, t0, t1) {
  const f = s.face + s.out * front;
  const pts = s.axis === 'v'
    ? [[t0, y0, f], [t1, y0, f], [t1, y1, f], [t0, y1, f]]
    : [[f, y0, t0], [f, y0, t1], [f, y1, t1], [f, y1, t0]];
  const w = pts.map(([u, y, v]) => world(u, y, v));
  const ax = w[1][0] - w[0][0], ay = w[1][1] - w[0][1], az = w[1][2] - w[0][2];
  const bx = w[2][0] - w[0][0], by = w[2][1] - w[0][1], bz = w[2][2] - w[0][2];
  const nx = ay * bz - az * by, nz = ax * by - ay * bx;
  const [ox, , oz] = world(s.axis === 'u' ? s.out : 0, 0, s.axis === 'v' ? s.out : 0);
  quad(b, mat, nx * ox + nz * oz >= 0 ? pts : [pts[0], pts[3], pts[2], pts[1]]);
}

function windows(b, near) {
  const fronts = [...WALLS, ...COURT_WALLS];
  const pedimentWalls = new Set(['s-wl', 's-wr', 's-sw', 's-se', 's-ct', 'e-w', 'e-ne', 'e-se']);
  for (const s of fronts) {
    const bays = windowBays(s);
    for (const bay of bays) {
      for (const row of bay.rows) {
        if (s.id?.startsWith('c-') && row.y0 > 26) continue;
        // Base windows sit in the rustication: proud of the courses, behind the pier blocks.
        const back = row.base ? 0.42 : 0.08;
        const front = Math.min(row.base ? 0.68 : back + 0.12, localCap(s, bay.t));
        const t0 = bay.t - row.w / 2, t1 = bay.t + row.w / 2;
        if (near) segBox(b, row.mat, s, row.y0, row.y1, back, front, t0, t1);
        else pane(b, row.mat, s, row.y0, row.y1, front, t0, t1);
      }
    }
    if (!near || !pedimentWalls.has(s.id)) continue;
    bays.forEach((bay, i) => {
      if (!s.gate && i % 2) return;
      if (bay.rows.every((row) => row.y0 < 12) || bay.rows[0].w < 2.2) return;
      pediment(b, s, bay.t, 17.82, Math.min(3.15, bay.rows[0].w + 0.4));
    });
  }
}

function pediment(b, s, t, y, w) {
  const h = 0.55;
  const back = 0.18, front = 0.36;
  const mid = s.out * (front + back) / 2;
  const depth = front - back;
  const y0 = y, y1 = y + h;
  if (s.axis === 'v') {
    const v0 = s.face + mid - depth / 2, v1 = s.face + mid + depth / 2;
    const tri = (v) => [[t - w / 2, y0, v], [t + w / 2, y0, v], [t, y1, v]];
    quad(b, 'trim', [tri(v0)[0], tri(v0)[1], tri(v1)[1], tri(v1)[0]]);
    quad(b, 'trim', [tri(v0)[1], tri(v0)[2], tri(v1)[2], tri(v1)[1]]);
    quad(b, 'trim', [tri(v0)[2], tri(v0)[0], tri(v1)[0], tri(v1)[2]]);
  } else {
    const u0 = s.face + mid - depth / 2, u1 = s.face + mid + depth / 2;
    const tri = (u) => [[u, y0, t - w / 2], [u, y0, t + w / 2], [u, y1, t]];
    quad(b, 'trim', [tri(u0)[0], tri(u1)[0], tri(u1)[1], tri(u0)[1]]);
    quad(b, 'trim', [tri(u0)[1], tri(u1)[1], tri(u1)[2], tri(u0)[2]]);
    quad(b, 'trim', [tri(u0)[2], tri(u1)[2], tri(u1)[0], tri(u0)[0]]);
  }
}

function statues(b, near) {
  const gap = near ? 7.8 : 14.5;
  for (const s of WALLS) {
    if (s.gate) continue;
    for (let t = s.t0 + gap * 0.55; t < s.t1 - 1.1; t += gap) statue(b, s, t, near);
  }
  const gate = WALLS.find((s) => s.gate);
  statue(b, gate, -7.4, near);
  statue(b, gate, 7.4, near);
}

function statue(b, s, t, near) {
  const cap = localCap(s, t);
  const stand = (y0, y1, back, front, half) => segBox(b, 'trim', s, y0, y1, back, Math.min(front, cap), t - half, t + half);
  // The foot is buried in the parapet so the two trim faces do not flicker.
  stand(33.02, 34.15, 0.16, 0.80, near ? 0.52 : 0.62);
  stand(34.0, H.statueTop, 0.26, 0.68, near ? 0.30 : 0.40);
}

function crown(b, near) {
  const s = WALLS.find((w) => w.gate);
  // Arms and crown over the Prince's Gate. The finial stays at 40.4; the base is
  // wide enough to read with the balustrade from the plaza.
  segBox(b, 'trim', s, H.bal1, H.bal1 + 1.15, 0.10, 0.70, -5.2, 5.2);
  segBox(b, 'trim', s, H.bal1 + 0.9, H.bal1 + 3.4, 0.16, 0.62, -3.4, 3.4);
  segBox(b, 'trim', s, H.bal1 + 3.1, H.bal1 + 5.6, 0.22, 0.56, -2.0, 2.0);
  segBox(b, 'trim', s, H.crownTop - 0.85, H.crownTop, 0.28, 0.48, -0.35, 0.35);
  if (near) {
    segBox(b, 'trim', s, H.crownTop - 0.55, H.crownTop, 0.34, 0.44, -0.08, 0.08);
    segBox(b, 'trim', s, H.bal1 + 0.15, H.bal1 + 2.6, 0.20, 0.58, -6.3, -4.6);
    segBox(b, 'trim', s, H.bal1 + 0.15, H.bal1 + 2.6, 0.20, 0.58, 4.6, 6.3);
  }
}

function arch(b, near) {
  const vFace = GATE.face;
  const vBack = GATE.back;
  const N = near ? 10 : 6;
  const spring = GATE.spring, r = GATE.radius;
  for (let i = 0; i < N; i++) {
    const a0 = Math.PI * i / N, a1 = Math.PI * (i + 1) / N;
    const x0 = -r * Math.cos(a0), x1 = -r * Math.cos(a1);
    const y0 = spring + r * Math.sin(a0), y1 = spring + r * Math.sin(a1);
    // Front spandrel, up to the lintel. The opening under the curve stays empty.
    quad(b, 'stone', [[x0, y0, vFace + 0.02], [x1, y1, vFace + 0.02], [x1, 9.2, vFace + 0.02], [x0, 9.2, vFace + 0.02]]);
    quad(b, 'granite', [[x0, y0, vBack + 0.45], [x0, 9.2, vBack + 0.45], [x1, 9.2, vBack + 0.45], [x1, y0, vBack + 0.45]]);
    quad(b, 'granite', [[x0, y0, vFace - 0.02], [x0, y0, vBack + 0.42], [x1, y1, vBack + 0.42], [x1, y1, vFace - 0.02]]);
  }
  for (let i = 0; i < N; i++) {
    const a0 = Math.PI * (i + 0.5) / N;
    const x = -r * Math.cos(a0), y = spring + r * Math.sin(a0);
    addBox(b, 'trim', x, y, vFace + 0.22, 0.48, 0.36, 0.22);
  }
  addBox(b, 'glass', 0, 3.35, vBack + 0.55, 3.3, 6.3, 0.1);
  const sides = near ? 8 : 5;
  for (const u of GATE_COLUMNS) {
    // The shaft ends inside the capital. Sharing y = 29.4 put every cap triangle
    // on the capital's top face.
    // About a metre proud of the stone, matching the pilasters. The shaft ends inside the capital.
    column(b, 'granite', u, vFace + 0.46, H.baseTop, 29.05, 0.50, sides);
    if (near) addBox(b, 'trim', u, 29.28, vFace + 0.46, 0.96, 0.50, 0.96);
  }
}

function roofs(b) {
  const eave = H.wallTop + 0.08, ridge = H.roofRidge;
  // Eaves sit behind the parapet (top 33.15) so the grey slope shows only above it.
  const slopeNS = (vEave, vRidge, u0, u1) => {
    const a = [u0, eave, vEave], c = [u1, eave, vEave], d = [u1, ridge, vRidge], e = [u0, ridge, vRidge];
    quadUp(b, 'roof', [a, c, d, e]);
  };
  slopeNS(-59.0, -48, -44, 44); // north outer
  slopeNS(-33.2, -48, -44, 44); // north, toward the court
  slopeNS(57.6, 43, -44, 44); // south outer
  slopeNS(22.4, 44, -44, 44); // south, toward the court
  const slopeEW = (uEave, uRidge, v0, v1) => {
    const a = [uEave, eave, v0], c = [uEave, eave, v1], d = [uRidge, ridge, v1], e = [uRidge, ridge, v0];
    quadUp(b, 'roof', [a, c, d, e]);
  };
  slopeEW(55.2, 42, -28, 18);
  slopeEW(27.2, 42, -28, 18);
  slopeEW(-56.0, -42, -28, 18);
  slopeEW(-28.2, -42, -28, 18);
  // Pavilion caps stay under the parapet and back from the outer stone face.
  const cap = (u0, u1, v0, v1) => addBox(b, 'roof', (u0 + u1) / 2, 31.85, (v0 + v1) / 2, u1 - u0, 1.4, v1 - v0);
  cap(-61.5, -44.5, -62.4, -47.2);
  cap(43.2, 60.2, -62.6, -47.2);
  cap(-61.0, -44.5, 45.2, 58.4);
  cap(43.6, 60.6, 44.6, 57.6);
  cap(-14.2, 13.0, -62.2, -50.5);
  cap(-50.4, -43.6, 50.6, 62.4);
  cap(43.6, 51.4, 50.6, 62.2);
}

// Royal Chapel. OSM has no chapel part; the dome sits on the mapped north-centre
// pavilion, where the photographs put it, 11 m above the 36.6 m ridge.
export const CHAPEL = { u: -0.8, v: -47.2, top: 47.6 };

function quadOut(b, mat, pts, cx, cy, cz) {
  const ax = pts[1][0] - pts[0][0], ay = pts[1][1] - pts[0][1], az = pts[1][2] - pts[0][2];
  const bx = pts[2][0] - pts[0][0], by = pts[2][1] - pts[0][1], bz = pts[2][2] - pts[0][2];
  const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
  const mx = (pts[0][0] + pts[2][0]) / 2 - cx;
  const my = (pts[0][1] + pts[2][1]) / 2 - cy;
  const mz = (pts[0][2] + pts[2][2]) / 2 - cz;
  const ptsOut = nx * mx + ny * my + nz * mz >= 0 ? pts : [pts[0], pts[3], pts[2], pts[1]];
  if (pts.length === 4) quad(b, mat, ptsOut);
}

function ring(b, mat, u, v, y0, y1, r, sides) {
  for (let i = 0; i < sides; i++) {
    const t0 = 2 * Math.PI * i / sides, t1 = 2 * Math.PI * (i + 1) / sides;
    const p = (y, t) => [u + r * Math.cos(t), y, v + r * Math.sin(t)];
    quadOut(b, mat, [p(y0, t0), p(y0, t1), p(y1, t1), p(y1, t0)], u, (y0 + y1) / 2, v);
  }
}

function chapel(b, near) {
  const { u, v } = CHAPEL;
  const sides = near ? 12 : 8;
  ring(b, 'stone', u, v, 34.2, 40.25, 6.35, sides);
  ring(b, 'trim', u, v, 39.95, 40.85, 6.85, sides);
  const rings = near ? 4 : 3;
  const R = 5.4, ySpring = 40.2;
  const limit = 0.92; // small oculus; the lantern covers it
  for (let i = 0; i < rings; i++) {
    const a0 = (Math.PI / 2) * limit * i / rings, a1 = (Math.PI / 2) * limit * (i + 1) / rings;
    const r0 = R * Math.cos(a0), y0 = ySpring + R * Math.sin(a0);
    const r1 = R * Math.cos(a1), y1 = ySpring + R * Math.sin(a1);
    for (let s = 0; s < sides; s++) {
      const t0 = 2 * Math.PI * s / sides, t1 = 2 * Math.PI * (s + 1) / sides;
      const p = (rr, y, t) => [u + rr * Math.cos(t), y, v + rr * Math.sin(t)];
      quadOut(b, 'roof', [p(r0, y0, t0), p(r0, y0, t1), p(r1, y1, t1), p(r1, y1, t0)], u, ySpring, v);
      // Raised rib along the meridian, same lead colour, clear of the shell.
      const w = 0.22, rib = 0.38;
      const q = (rr, y, t) => p(rr + rib, y, t);
      const tm = (t0 + t1) / 2;
      quadOut(b, 'roof', [
        q(r0, y0, tm - w), q(r0, y0, tm + w), q(r1, y1, tm + w), q(r1, y1, tm - w),
      ], u, ySpring, v);
    }
  }
  ring(b, 'stone', u, v, 45.25, 46.55, 1.55, near ? 8 : 6);
  ring(b, 'trim', u, v, 46.4, 47.05, 1.95, near ? 8 : 6);
  addBox(b, 'trim', u, 47.25, v, 0.46, 0.7, 0.46);
}

function wings(b, near) {
  for (const w of WINGS) {
    const cu = (w.u0 + w.u1) / 2, cv = (w.v0 + w.v1) / 2;
    addBox(b, 'stone', cu, H.wingTop / 2, cv, w.u1 - w.u0, H.wingTop, w.v1 - w.v0);
    const ridgeU = cu, eaveY = H.wingTop + 0.06, ridgeY = H.wingRoof;
    quadUp(b, 'roof', [
      [w.u0 + 0.55, eaveY, w.v0 + 0.55],
      [w.u0 + 0.55, eaveY, w.v1 - 0.55],
      [ridgeU, ridgeY, w.v1 - 1.5],
      [ridgeU, ridgeY, w.v0 + 1.5],
    ]);
    quadUp(b, 'roof', [
      [ridgeU, ridgeY, w.v0 + 1.5],
      [ridgeU, ridgeY, w.v1 - 1.5],
      [w.u1 - 0.55, eaveY, w.v1 - 0.55],
      [w.u1 - 0.55, eaveY, w.v0 + 0.55],
    ]);
    if (!w.plaza) continue;
    arcade(b, near, w);
  }
}

// Round-arched openings on the Armería galleries. One shared rhythm so a test can
// aim at the first opening. End piers are wider; the true outer ends get a pavilion cap.
export const ARCADE_STEP = { near: 6.7, far: 12.4 };

function arcade(b, near, w) {
  const face = w.plaza > 0 ? w.u1 : w.u0;
  const s = { axis: 'u', face, out: w.plaza, t0: w.v0 + 1.6, t1: w.v1 - 1.6 };
  segBox(b, 'granite', s, 0, 1.2, -0.02, 0.36);
  segBox(b, 'trim', s, 8.85, 9.45, 0.02, 0.48);
  segBox(b, 'trim', s, H.wingTop - 0.55, H.wingTop + 0.15, -0.04, 0.46);
  const step = near ? ARCADE_STEP.near : ARCADE_STEP.far;
  const piers = [];
  for (let t = s.t0 + 0.35; t < s.t1 - 0.2; t += step) piers.push(t);
  if (piers.length && s.t1 - 0.35 - piers[piers.length - 1] > step * 0.55) piers.push(s.t1 - 0.35);
  const N = near ? 4 : 3;
  const outerEnd = (i) => (w.id === 'east' && (i === 0 || i === piers.length - 1))
    || (w.id === 'west-a' && i === 0) || (w.id === 'west-c' && i === piers.length - 1);
  for (let i = 0; i < piers.length; i++) {
    const end = i === 0 || i === piers.length - 1;
    const half = end ? 1.05 : 0.62;
    segBox(b, 'granite', s, 0.15, 8.75, 0.06, 0.58, piers[i] - half, piers[i] + half);
    if (outerEnd(i)) segBox(b, 'trim', s, 9.2, 12.35, 0.10, 0.62, piers[i] - 1.35, piers[i] + 1.35);
  }
  for (let i = 0; i < piers.length - 1; i++) {
    const halfL = i === 0 ? 1.05 : 0.62;
    const halfR = i + 1 === piers.length - 1 ? 1.05 : 0.62;
    const a = piers[i] + halfL, c = piers[i + 1] - halfR;
    if (c - a < 1.5) continue;
    const mid = (a + c) / 2;
    const r = Math.min((c - a) / 2 - 0.08, 2.55);
    const spring = 5.25;
    const at = (t, y, front) => (s.axis === 'u'
      ? [s.face + s.out * front, y, t]
      : [t, y, s.face + s.out * front]);
    quadOut(b, 'glass', [at(mid - r, 1.3, 0.24), at(mid + r, 1.3, 0.24), at(mid + r, spring, 0.24), at(mid - r, spring, 0.24)], face, 3, (a + c) / 2);
    for (let k = 0; k < N; k++) {
      const a0 = Math.PI * k / N, a1 = Math.PI * (k + 1) / N;
      const t0 = mid - r * Math.cos(a0), t1 = mid - r * Math.cos(a1);
      const y0 = spring + r * Math.sin(a0), y1 = spring + r * Math.sin(a1);
      // Glass fan fills the arch. The stone band sits just outside it, proud of the glass.
      const g0 = at(t0, y0, 0.24), g1 = at(t1, y1, 0.24), gs = at(mid, spring, 0.24);
      const ax = g1[0] - gs[0], ay = g1[1] - gs[1], az = g1[2] - gs[2];
      const bx = g0[0] - gs[0], by = g0[1] - gs[1], bz = g0[2] - gs[2];
      const nx = ay * bz - az * by, nz = ax * by - ay * bx;
      const ox = s.axis === 'u' ? s.out : 0, oz = s.axis === 'v' ? s.out : 0;
      const glass = nx * ox + nz * oz >= 0 ? [gs, g1, g0] : [gs, g0, g1];
      const pos = [];
      for (const p of glass) pos.push(...world(p[0], p[1], p[2]));
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex([0, 1, 2]);
      g.computeVertexNormals();
      b.put(g, 'glass');
      const ro = r + 0.48;
      const q0 = mid - ro * Math.cos(a0), q1 = mid - ro * Math.cos(a1);
      const z0 = spring + ro * Math.sin(a0), z1 = spring + ro * Math.sin(a1);
      quadOut(b, 'stone', [
        at(t0, y0, 0.46), at(t1, y1, 0.46), at(q1, z1, 0.46), at(q0, z0, 0.46),
      ], face, spring + r, mid);
    }
  }
}

// First opening of the east gallery, for the ray test. Matches arcade().
export function arcadeSample(detail) {
  const w = WINGS.find((x) => x.id === 'east');
  const step = detail === 'far' ? ARCADE_STEP.far : ARCADE_STEP.near;
  const t0 = w.v0 + 1.6;
  const p0 = t0 + 0.35, p1 = p0 + step;
  const a = p0 + 1.05, c = p1 - 0.62;
  return { v: (a + c) / 2, pierV: p0, u: w.u0 - 6 };
}

function courtFloor(b) {
  addBox(b, 'granite', (COURT.u0 + COURT.u1) / 2, 0.08, (COURT.v0 + COURT.v1) / 2,
    COURT.u1 - COURT.u0 - 0.8, 0.1, COURT.v1 - COURT.v0 - 0.8);
}

export function create({ detail = 'near' } = {}) {
  const near = detail !== 'far';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail === 'far' ? 'far' : 'near');
  mass(b);
  skins(b, near);
  rustication(b, near);
  pilasters(b, near);
  windows(b, near);
  statues(b, near);
  crown(b, near);
  arch(b, near);
  roofs(b);
  chapel(b, near);
  wings(b, near);
  courtFloor(b);
  return b.finish();
}
