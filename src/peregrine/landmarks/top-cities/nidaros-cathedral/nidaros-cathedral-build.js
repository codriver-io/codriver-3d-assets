// Nidarosdomen, authored in the nave frame (nidaros-cathedral-plan.js). West screen at FACE,
// towers a step behind it, clasping buttresses out to the mapped west corners. Statues are
// relief bands, not portraits. geometry.js rotates the finished mesh by THETA.
import {
  SPIRE, SPIRE_APEX, CROSS_TIP, NAVE_V, NAVE, N_AISLE, S_AISLE, N_TOWER, S_TOWER,
  CROSSING, N_TRANS, S_TRANS, CHOIR, N_CHOIR, S_CHOIR, OCT, CHAPTER, JOHANNES, LECTORIUM,
} from './nidaros-cathedral-plan.js';

const FACE = -47.28; // screen wall. The outline of this wall is u ≈ -47.41.
const PROUD = -47.36; // westmost screen ornament, 5 cm inside the outline
// Aisle outer walls sit inside the outline between the buttress nibs (the nibs reach ~-12.4 / 14.5).
const N_WALL = -10.7;
const S_WALL = 12.82;

const N_PIER = [-36.35, -30.95, -25.75, -20.65, -15.45, -10.15, -4.95];
const S_PIER = [-36.25, -31.05, -26.05, -20.65, -15.15, -9.75, -4.5];

export function buildNidaros(k) {
  mass(k);
  roofs(k);
  westFront(k);
  towers(k);
  crossing(k);
  windows(k);
  buttresses(k);
  eastEnd(k);
  annexes(k);
}

function mass(k) {
  const naveTop = NAVE.eaves - 0.08;
  k.box('stone', NAVE.u0, NAVE.u1, 0, naveTop, NAVE.v0, NAVE.v1);
  k.box('stone', N_AISLE.u0, N_AISLE.u1, 0, N_AISLE.yLow - 0.1, N_WALL, N_AISLE.v1);
  k.box('stone', S_AISLE.u0, S_AISLE.u1, 0, S_AISLE.yLow - 0.1, S_AISLE.v0, S_WALL);
  k.box('stone', N_TOWER.u0, N_TOWER.u1, 0, N_TOWER.shaft - 0.06, N_TOWER.v0 + 0.35, N_TOWER.v1);
  k.box('stone', S_TOWER.u0, S_TOWER.u1, 0, S_TOWER.shaft - 0.06, S_TOWER.v0, S_TOWER.v1 - 0.35);
  // Clasping west buttresses on the mapped west corners. Both LODs (they set the west extreme).
  k.box('stone', -48.32, -47.02, 0, 20, -17.15, -15.65);
  k.box('stone', -48.00, -47.02, 19.85, 30, -16.95, -15.8);
  k.box('stone', -47.88, -47.02, 0, 20, 18.65, 19.6);
  k.box('stone', -47.7, -47.02, 19.85, 30, 18.75, 19.5);
  k.box('stone', CROSSING.u0, CROSSING.u1, 0, CROSSING.h - 0.06, CROSSING.v0, CROSSING.v1);
  k.box('stone', N_TRANS.u0, N_TRANS.u1, 0, N_TRANS.eaves - 0.08, N_TRANS.v0, N_TRANS.v1);
  // Centre face sits behind the door and the triple lancet. Jambs and the two
  // mapped corner nibs carry the south edge out to the outline.
  k.box('stone', S_TRANS.u0, S_TRANS.u1, 0, S_TRANS.eaves - 0.08, S_TRANS.v0, 23.90);
  k.box('stone', S_TRANS.u0, -0.45, 0, S_TRANS.eaves - 0.08, 23.90, 24.26);
  k.box('stone', 6.35, S_TRANS.u1, 0, S_TRANS.eaves - 0.08, 23.90, 24.26);
  k.box('stone', -4.1, -2.55, 0, 12, 24.26, 24.95);
  k.box('stone', 8.45, 9.9, 0, 12, 24.26, 24.90);
  // North and south porches reach the outline tips.
  k.box('stone', 0.55, 4.55, 0, 9.4, -24.55, -22.15);
  k.box('stone', 9.12, CHOIR.u1, 0, CHOIR.eaves - 0.08, CHOIR.v0, CHOIR.v1);
  k.box('stone', N_CHOIR.u0, N_CHOIR.u1, 0, N_CHOIR.yLow - 0.08, N_CHOIR.v0, N_CHOIR.v1);
  k.box('stone', S_CHOIR.u0, S_CHOIR.u1, 0, S_CHOIR.yLow - 0.08, S_CHOIR.v0, 11.5);
  k.drum('stone', OCT.u, OCT.v, 0, OCT.wall - 0.06, OCT.flat);
}

function roofs(k) {
  k.gable('roof', -46.35, -5.05, NAVE.v0 - 0.45, NAVE.v1 + 0.45, NAVE.eaves - 0.02, NAVE.ridge);
  crest(k, -44, -6, NAVE_V, NAVE.ridge);
  k.gable('roof', 9.35, 35.05, CHOIR.v0 - 0.4, CHOIR.v1 + 0.4, CHOIR.eaves - 0.02, CHOIR.ridge);
  crest(k, 12, 33.5, (CHOIR.v0 + CHOIR.v1) / 2, CHOIR.ridge);
  // North gable stops short of the transept lancet arches so the two planes do not share a face.
  k.gableAcross('roof', N_TRANS.u0 - 0.35, N_TRANS.u1 + 0.25, -21.75, -6.55, N_TRANS.eaves - 0.02, N_TRANS.ridge);
  k.gableAcross('roof', S_TRANS.u0 - 0.3, S_TRANS.u1 + 0.2, 7.85, 23.9, S_TRANS.eaves - 0.02, S_TRANS.ridge);
  k.shed('roof', N_AISLE.u0, N_AISLE.u1, N_WALL - 0.06, N_AISLE.yLow, -5.02, N_AISLE.yHigh);
  k.shed('roof', S_AISLE.u0, S_AISLE.u1, S_WALL + 0.06, S_AISLE.yLow, 7.28, S_AISLE.yHigh);
  k.shed('roof', N_CHOIR.u0, N_CHOIR.u1, N_CHOIR.v0 - 0.25, N_CHOIR.yLow, -6.15, N_CHOIR.yHigh);
  k.shed('roof', S_CHOIR.u0, S_CHOIR.u1, 11.58, S_CHOIR.yLow, 7.9, S_CHOIR.yHigh);
  k.gable('roof', 0.65, 4.4, -24.45, -22.05, 9.35, 13.2);
  // Octagon pyramid. Vertex radius so the base meets the drum's corners.
  const r = OCT.flat / Math.cos(Math.PI / 8);
  k.cone('roof', OCT.u, OCT.v, OCT.wall - 0.15, OCT.peak, r + 0.25);
}

function crest(k, u0, u1, v, y) {
  k.box('roof', u0, u1, y - 0.05, y + 0.28, v - 0.16, v + 0.16);
}

function westFront(k) {
  const v0 = -9.55, v1 = 12.40;
  k.box('stone', FACE, -46.05, 0, 26.7, v0, v1);
  k.box('trim', PROUD + 0.02, FACE - 0.02, 0, 1.15, v0 - 0.1, v1 + 0.1); // plinth
  k.box('trim', PROUD + 0.04, FACE - 0.02, 7.15, 7.55, v0, v1);
  k.box('trim', PROUD + 0.04, FACE - 0.02, 16.55, 17.0, v0, v1);
  // Gallery, the strong horizontal under the gable, carried across the tower fronts.
  k.box('trim', PROUD + 0.02, -46.9, 24.15, 26.55, -17.1, 19.7);
  if (k.near) {
    for (let v = -8.6; v <= 11.2; v += 0.85) {
      k.box('trim', PROUD, PROUD + 0.16, 24.35, 26.25, v, v + 0.28);
    }
  }
  arcade(k, 0.35, 6.5, 1.7, [-7.55, -5.15, -2.75, 5.05, 7.45, 9.85]);
  // Great portal.
  k.arch('trim', 4.15, 9.6, 0.42, 'W', NAVE_V, 0.15, FACE, 0.08);
  // Recess sits 6 cm proud of the stone face. A panel on the face z-fights the wall.
  k.lancetPanel('recess', 3.15, 8.7, 'W', NAVE_V, 0.4, FACE - 0.06);
  k.box('recess', FACE - 0.08, FACE - 0.04, 0.35, 6.7, NAVE_V - 1.15, NAVE_V - 0.08);
  k.box('recess', FACE - 0.08, FACE - 0.04, 0.35, 6.7, NAVE_V + 0.08, NAVE_V + 1.15);
  k.box('trim', PROUD, FACE + 0.02, 0.3, 7.3, NAVE_V - 0.1, NAVE_V + 0.1);
  if (k.near) arcade(k, 10.15, 3.15, 1.35, [-7.7, -5.7, -3.7, -1.7, 3.95, 5.95, 7.95, 9.95]);
  statueRow(k, 7.7, 2.35, -8.5, 10.7, 1.28, 2.05);
  statueRow(k, 13.55, 2.7, -8.3, 10.6, 1.22, 0);
  // Rose. Ring and spokes west of the glow disc; the hub leaves the centre open.
  const ry = 20.35, rv = NAVE_V;
  // West to east: hub, spokes, stone ring, then the glow disc, all in front of the wall.
  k.ring('trim', 0.42, 0.78, 'W', rv, ry, -47.37, k.near ? 16 : 8);
  k.ring('trim', 2.55, 3.22, 'W', rv, ry, -47.345, k.near ? 36 : 16);
  const spokes = k.near ? 16 : 8;
  for (let i = 0; i < spokes; i++) {
    k.spoke('trim', 'W', rv, ry, -47.355, 0.7, 2.65, (i / spokes) * Math.PI * 2, k.near ? 0.1 : 0.16);
  }
  k.disc('glow', 2.72, 'W', rv, ry, FACE - 0.05, k.near ? 32 : 14);
  // Steep screen gable, niche, and a figure. Apex stays under the tower pinnacles.
  k.screenGable('stone', FACE, NAVE_V, 7.15, 26.45, 8.3, 0.7);
  k.lancetPanel('recess', 1.7, 3.4, 'W', NAVE_V, 28.3, FACE - 0.06);
  k.box('trim', PROUD, FACE + 0.02, 28.7, 31.5, NAVE_V - 0.32, NAVE_V + 0.32);
  k.box('trim', PROUD + 0.02, FACE, 31.35, 31.85, NAVE_V - 0.22, NAVE_V + 0.22);
  k.cone('trim', FACE + 0.2, NAVE_V, 34.5, 37.2, 0.28, 4);
  if (k.near) {
    k.cone('trim', FACE + 0.25, NAVE_V - 6.4, 26.4, 31.5, 0.42, 4);
    k.cone('trim', FACE + 0.25, NAVE_V + 6.4, 26.4, 31.5, 0.42, 4);
    for (const v of [-4.2, -2.2, 4.5, 6.5]) k.arch('trim', 1.05, 3.1, 0.14, 'W', v, 27.3, FACE, 0.05);
  }
}

function arcade(k, y, h, w, centres) {
  for (const v of centres) {
    k.arch('trim', w, h, 0.2, 'W', v, y, FACE, 0.08);
    k.lancetPanel('recess', w * 0.62, h * 0.72, 'W', v, y + 0.15, FACE - 0.06);
    if (k.near) k.box('trim', PROUD, FACE - 0.02, y + 0.2, y + h * 0.62, v - 0.16, v + 0.16);
  }
}

function statueRow(k, y, h, v0, v1, step, skip) {
  for (let v = v0; v <= v1 + 0.01; v += step) {
    if (skip && Math.abs(v - NAVE_V) < skip) continue;
    k.box('trim', PROUD, -47.2, y, y + h * 0.7, v - 0.2, v + 0.2);
    k.box('trim', PROUD + 0.04, -47.22, y + h * 0.62, y + h * 0.62 + 0.32, v - 0.13, v + 0.13);
    if (k.near) k.pediment('trim', 0.7, 0.36, 'W', v, y + h * 0.66, FACE, 0.06);
  }
}

function towers(k) {
  const towers = [
    { ...N_TOWER, v0: N_TOWER.v0 + 0.35 },
    { ...S_TOWER, v1: S_TOWER.v1 - 0.35 },
  ];
  for (const t of towers) {
    const uc = (t.u0 + t.u1) / 2, vc = (t.v0 + t.v1) / 2;
    // Parapet and the tall corner pinnacles (tips at the mapped 44 m, both LODs).
    k.box('trim', t.u0 + 0.15, t.u1 - 0.15, t.shaft - 0.4, t.shaft + 0.85, t.v0 + 0.15, t.v1 - 0.15);
    cornerPins(k, t.u0, t.u1, t.v0, t.v1, 30.5, t.pin, 0.72);
    if (k.near) {
      k.cone('trim', uc, t.v0 + 0.7, 32, 40.5, 0.4, 4);
      k.cone('trim', uc, t.v1 - 0.7, 32, 40.5, 0.4, 4);
      k.cone('trim', t.u0 + 0.7, vc, 32, 40.5, 0.4, 4);
      k.cone('trim', t.u1 - 0.7, vc, 32, 40.5, 0.4, 4);
    }
    // Ground arcade, a shorter niche pair under the gallery, then the tall lancets above it.
    const west = t.u0;
    k.arch('trim', 1.55, 6.2, 0.18, 'W', vc - 1.15, 0.4, west, 0.08);
    k.arch('trim', 1.55, 6.2, 0.18, 'W', vc + 1.15, 0.4, west, 0.08);
    k.lancetPanel('recess', 0.95, 4.6, 'W', vc - 1.15, 0.6, west - 0.08);
    k.lancetPanel('recess', 0.95, 4.6, 'W', vc + 1.15, 0.6, west - 0.08);
    twin(k, 'W', vc, 12.6, west, 0.95, 6.2, false);
    twin(k, 'W', vc, 27.25, west, 1.05, 8.0, false);
    twin(k, 'N', uc, 27.25, t.v0, 0.95, 7.4, false);
    twin(k, 'S', uc, 27.25, t.v1, 0.95, 7.4, false);
  }
}

function twin(k, face, across, y, plane, w, h, lit) {
  const sign = face === 'W' || face === 'N' ? -1 : 1;
  const panel = plane + sign * 0.06;
  k.lancetPanel(lit ? 'glow' : 'glass', w * 0.7, h * 0.82, face, across - w * 0.72, y, panel);
  k.lancetPanel(lit ? 'glow' : 'glass', w * 0.7, h * 0.82, face, across + w * 0.72, y, panel);
  if (k.near || face === 'W') {
    k.arch('trim', w, h, 0.16, face, across - w * 0.72, y, plane, 0.09);
    k.arch('trim', w, h, 0.16, face, across + w * 0.72, y, plane, 0.09);
    k.box('trim',
      face === 'E' || face === 'W' ? Math.min(plane, plane + sign * 0.12) : across - 0.1,
      face === 'E' || face === 'W' ? Math.max(plane, plane + sign * 0.12) : across + 0.1,
      y, y + h * 0.7,
      face === 'N' || face === 'S' ? Math.min(plane, plane + sign * 0.12) : across - 0.1,
      face === 'N' || face === 'S' ? Math.max(plane, plane + sign * 0.12) : across + 0.1);
  }
}

function cornerPins(k, u0, u1, v0, v1, y0, y1, r) {
  const inset = r + 0.35;
  for (const u of [u0 + inset, u1 - inset]) {
    for (const v of [v0 + inset, v1 - inset]) pin(k, u, v, y0, y1, r);
  }
}

function pin(k, u, v, y0, y1, r) {
  const shaft = y0 + (y1 - y0) * 0.48;
  k.box('trim', u - r * 0.42, u + r * 0.42, y0, shaft, v - r * 0.42, v + r * 0.42);
  k.cone('stone', u, v, shaft - 0.4, y1, r * 0.62, 4);
  if (k.near) k.box('trim', u - r * 0.7, u + r * 0.7, shaft - 0.25, shaft + 0.15, v - r * 0.7, v + r * 0.7);
}

function crossing(k) {
  const c = CROSSING;
  cornerPins(k, c.u0, c.u1, c.v0, c.v1, 33, c.pin, 0.85);
  // Square belfry openings above the transept roofs, on the north and south.
  twin(k, 'N', SPIRE.u, 27.2, c.v0, 1.35, 8.4, false);
  twin(k, 'S', SPIRE.u, 27.2, c.v1, 1.35, 8.4, false);
  if (k.near) {
    twin(k, 'W', SPIRE.v, 27.4, c.u0, 1.2, 6.5, false);
    twin(k, 'E', SPIRE.v, 27.4, c.u1, 1.2, 6.5, false);
  }
  // Copper spire. Slender octagon between the pinnacles, cross to the surveyed 87 m.
  const base = 4.85;
  k.frustum('spire', SPIRE.u, SPIRE.v, c.h - 0.5, c.h + 2.2, base + 0.7, base);
  k.cone('spire', SPIRE.u, SPIRE.v, c.h + 1.6, SPIRE_APEX, base);
  if (k.near) {
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + (i * Math.PI) / 4;
      const r0 = base + 0.12, r1 = 0.35;
      k.bar('trim',
        [SPIRE.u + Math.sin(a) * r0, c.h + 2.4, SPIRE.v + Math.cos(a) * r0],
        [SPIRE.u + Math.sin(a) * r1, SPIRE_APEX - 2.2, SPIRE.v + Math.cos(a) * r1],
        0.14, 0.22);
    }
  }
  k.box('trim', SPIRE.u - 0.16, SPIRE.u + 0.16, 80.4, CROSS_TIP, SPIRE.v - 0.16, SPIRE.v + 0.16);
  k.box('trim', SPIRE.u - 0.14, SPIRE.u + 0.14, 84.2, 85.15, SPIRE.v - 1.65, SPIRE.v + 1.65);
}

function windows(k) {
  const bays = [-33.6, -28.3, -23.2, -18.0, -12.8, -7.5];
  for (const u of bays) {
    opening(k, 'N', u, 16.3, NAVE.v0, 1.35, 5.6, true);
    opening(k, 'S', u, 16.3, NAVE.v1, 1.35, 5.6, true);
    opening(k, 'N', u, 2.2, N_WALL, 1.35, 6.2, false);
    opening(k, 'S', u, 2.2, S_WALL, 1.35, 6.2, false);
  }
  for (const u of [14.5, 20.5, 26.5, 31.5]) {
    opening(k, 'N', u, 15.2, CHOIR.v0, 1.25, 5.4, true);
    opening(k, 'S', u, 15.2, CHOIR.v1, 1.25, 5.4, true);
  }
  // Transept ends: a tall triple lancet above the porch roofs.
  triple(k, 'N', (N_TRANS.u0 + N_TRANS.u1) / 2, 14.6, -22.22);
  triple(k, 'S', (S_TRANS.u0 + S_TRANS.u1) / 2, 14.4, 24.12);
  const sDoor = (S_TRANS.u0 + S_TRANS.u1) / 2;
  k.arch('trim', 2.3, 6.8, 0.26, 'S', sDoor, 0.3, 24.14, 0.10);
  k.lancetPanel('recess', 1.6, 5.4, 'S', sDoor, 0.45, 24.18);
  opening(k, 'N', 2.55, 1.5, -24.55, 1.45, 5.6, false);
}

function opening(k, face, across, y, plane, w, h, lit) {
  const sign = face === 'W' || face === 'N' ? -1 : 1;
  k.lancetPanel(lit ? 'glow' : 'glass', w * 0.62, h * 0.78, face, across, y + h * 0.05, plane + sign * 0.05);
  if (k.near) {
    k.arch('trim', w, h, Math.max(0.16, w * 0.13), face, across, y, plane, 0.08);
    if (lit) k.arch('trim', w * 0.55, h * 0.72, 0.1, face, across, y + h * 0.08, plane, 0.1);
  }
}

function triple(k, face, across, y, plane) {
  opening(k, face, across - 2.15, y, plane, 1.5, 7.2, true);
  opening(k, face, across, y + 0.4, plane, 1.7, 8.4, true);
  opening(k, face, across + 2.15, y, plane, 1.5, 7.2, true);
}

function buttresses(k) {
  flyers(k, -1, N_PIER, N_WALL, NAVE.v0);
  flyers(k, 1, S_PIER, S_WALL, NAVE.v1);
}

function flyers(k, side, piers, outer, wall) {
  // outer is the aisle wall. The pier reaches the mapped nib, which is outside that wall.
  const pierOuter = side < 0 ? -12.15 : 14.32;
  for (const u of piers) {
    const vA = side < 0 ? pierOuter : outer - 0.02;
    const vB = side < 0 ? outer + 0.04 : pierOuter;
    k.box('stone', u - 0.34, u + 0.34, 0, 11.3, Math.min(vA, vB), Math.max(vA, vB));
    const segments = k.near ? 4 : 1;
    for (let i = 0; i < segments; i++) {
      const t0 = i / segments, t1 = (i + 1) / segments;
      const arch = (t) => Math.sin(Math.PI * t) * (k.near ? 1.05 : 0.35);
      const v = (t) => pierOuter - side * 0.35 + (wall - (pierOuter - side * 0.35)) * t;
      k.bar('stone',
        [u, 11.05 + 6.4 * t0 + arch(t0), v(t0)],
        [u, 11.05 + 6.4 * t1 + arch(t1), v(t1)],
        0.34, 0.48);
    }
    pin(k, u, pierOuter - side * 0.28, 11.15, 14.4, 0.28);
  }
}

function eastEnd(k) {
  // Ambulatory shifted east so its west flat meets the choir instead of cutting it.
  // Skirt kept inside the neck of the outline (u ≈ 47 narrows to ±6 m).
  const au = 42.8, av = OCT.v, flat = 6.35;
  k.drum('stone', au, av, 0, 11.0, flat);
  k.frustum('roof', au, av, 10.9, 13.8, flat + 0.15, 5.5);
  // Chapel lobes: north around u 41–43, south around u 43–45, east tip inside u 52.
  // North and south OSM lobes are thin pockets a box will not sit in. The east chapel is the one that reads.
  chapel(k, 49.6, 51.15, -1.4, 1.7, 'E');
  // A lancet on every other drum face. West face is buried in the choir.
  const faces = k.near ? 8 : 4;
  for (let i = 0; i < faces; i++) {
    const a = (i / faces) * Math.PI * 2;
    if (Math.cos(a) < -0.4) continue; // west, into the choir
    const u = OCT.u + Math.sin(a) * OCT.flat;
    const v = OCT.v + Math.cos(a) * OCT.flat;
    const face = Math.abs(Math.sin(a)) > Math.abs(Math.cos(a)) ? (Math.sin(a) > 0 ? 'E' : 'W') : (Math.cos(a) > 0 ? 'S' : 'N');
    const across = face === 'E' || face === 'W' ? v : u;
    const plane = face === 'E' || face === 'W' ? u : v;
    if (k.near) opening(k, face, across, 6.5, plane, 1.5, 7.5, true);
    else k.lancetPanel('glow', 0.9, 5.5, face, across, 7.2, plane + (face === 'W' || face === 'N' ? -0.08 : 0.08));
  }
}

function chapel(k, u0, u1, v0, v1, end) {
  k.box('stone', u0, u1, 0, 8.1, v0, v1);
  if (end === 'E') k.gableAcross('roof', u0, u1 + 0.06, v0 + 0.06, v1 - 0.06, 8.05, 11.3);
  else if (end === 'N') k.gable('roof', u0, u1, v0 - 0.06, v1, 8.05, 11.2);
  else k.gable('roof', u0, u1, v0, v1 + 0.06, 8.05, 11.2);
  const across = end === 'E' ? (v0 + v1) / 2 : (u0 + u1) / 2;
  const plane = end === 'E' ? u1 - 0.4 : end === 'N' ? v0 + 0.4 : v1 - 0.4;
  opening(k, end, across, 1.4, plane, 1.15, 4.6, false);
}

function annexes(k) {
  k.box('stone', CHAPTER.u0, CHAPTER.u1, 0, CHAPTER.eaves - 0.08, CHAPTER.v0, CHAPTER.v1);
  k.gable('roof', CHAPTER.u0 + 0.2, CHAPTER.u1 - 0.3, CHAPTER.v0 - 0.25, CHAPTER.v1 + 0.2, CHAPTER.eaves - 0.02, CHAPTER.ridge);
  const cv = (CHAPTER.v0 + CHAPTER.v1) / 2;
  k.apse('stone', CHAPTER.u1 - 0.15, cv, 0, CHAPTER.eaves - 0.3, 2.05);
  k.cone('roof', CHAPTER.u1 + 0.9, cv, CHAPTER.eaves - 0.5, CHAPTER.ridge - 0.4, 2.15, k.near ? 8 : 6);
  if (k.near) opening(k, 'N', (CHAPTER.u0 + CHAPTER.u1) / 2, 1.6, CHAPTER.v0 + 0.28, 1.35, 4.4, false);
  // St John's chapel and the lectorium, against the transepts' east sides.
  wing(k, { ...JOHANNES, u0: JOHANNES.u0 + 0.2, v0: JOHANNES.v0 + 0.22 }, 'S');
  wing(k, LECTORIUM, 'N');
  // Archbishop's entrance, south of the choir aisle.
  k.box('stone', 22.4, 27.05, 0, 7.6, 11.95, 14.15);
  k.gable('roof', 22.5, 26.95, 12.05, 14.2, 7.55, 10.2);
}

function wing(k, p, face) {
  k.box('stone', p.u0, p.u1, 0, p.eaves - 0.08, p.v0, p.v1);
  k.gable('roof', p.u0 + 0.05, p.u1 - 0.05, p.v0 + 0.05, p.v1 - 0.05, p.eaves - 0.02, p.ridge);
  const plane = face === 'S' ? p.v1 - 0.35 : p.v0 + 0.35;
  opening(k, face, (p.u0 + p.u1) / 2, 1.5, plane, 1.35, 5.6, false);
}
