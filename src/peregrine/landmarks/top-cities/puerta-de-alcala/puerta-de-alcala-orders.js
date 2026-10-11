import * as THREE from 'three';
import {
  ATTIC_FACE, ATTIC_HALF, CAP_TOP, CENTER_CROWN, CENTER_HALF, CORNER_U, CORNICE_TOP, DOOR_H,
  DOOR_HALF, DOOR_OUT, DOOR_U, EAST, ENTABLATURE, HALF_W, P, PAIR_OUT, PAIR_U, PED_BASE, PED_HALF,
  SA, SIDE_ATTIC, SIDE_CROWN, SIDE_HALF, SIDE_OUT, SIDE_U, SINGLE_OUT, SINGLE_U, SPRING, WEST, slab,
} from './puerta-de-alcala-frame.js';

// Roman capitals as centreline strokes. The tablet is the landmark; the words are the east face.
const FONT = {
  A: [[0.14, 0, 0.5, 1], [0.86, 0, 0.5, 1], [0.28, 0.36, 0.72, 0.36]],
  C: [[0.82, 0.14, 0.28, 0.14], [0.28, 0.14, 0.14, 0.32], [0.14, 0.32, 0.14, 0.68], [0.14, 0.68, 0.28, 0.86], [0.28, 0.86, 0.82, 0.86]],
  D: [[0.16, 0, 0.16, 1], [0.16, 1, 0.55, 1], [0.55, 1, 0.84, 0.72], [0.84, 0.72, 0.84, 0.28], [0.84, 0.28, 0.55, 0], [0.55, 0, 0.16, 0]],
  E: [[0.16, 0, 0.16, 1], [0.16, 0, 0.86, 0], [0.16, 0.48, 0.7, 0.48], [0.16, 1, 0.86, 1]],
  G: [[0.8, 0.86, 0.26, 0.86], [0.26, 0.86, 0.14, 0.68], [0.14, 0.68, 0.14, 0.32], [0.14, 0.32, 0.26, 0.14], [0.26, 0.14, 0.8, 0.14], [0.8, 0.14, 0.8, 0.42], [0.52, 0.42, 0.8, 0.42]],
  I: [[0.5, 0, 0.5, 1], [0.24, 0, 0.76, 0], [0.24, 1, 0.76, 1]],
  L: [[0.18, 0, 0.18, 1], [0.18, 0, 0.82, 0]],
  M: [[0.08, 0, 0.08, 1], [0.08, 1, 0.5, 0.32], [0.92, 1, 0.5, 0.32], [0.92, 0, 0.92, 1]],
  N: [[0.14, 0, 0.14, 1], [0.14, 1, 0.86, 0], [0.86, 0, 0.86, 1]],
  O: [[0.16, 0.22, 0.16, 0.78], [0.16, 0.78, 0.32, 1], [0.32, 1, 0.68, 1], [0.68, 1, 0.84, 0.78], [0.84, 0.78, 0.84, 0.22], [0.84, 0.22, 0.68, 0], [0.68, 0, 0.32, 0], [0.32, 0, 0.16, 0.22]],
  R: [[0.16, 0, 0.16, 1], [0.16, 1, 0.58, 1], [0.58, 1, 0.82, 0.8], [0.82, 0.8, 0.82, 0.62], [0.82, 0.62, 0.58, 0.44], [0.58, 0.44, 0.16, 0.44], [0.48, 0.44, 0.86, 0]],
  V: [[0.1, 1, 0.5, 0], [0.9, 1, 0.5, 0]],
  X: [[0.12, 0, 0.88, 1], [0.12, 1, 0.88, 0]],
};

const PIERS = [
  [CENTER_HALF + 0.15, PAIR_OUT - 0.15],
  [SIDE_OUT + 0.15, SINGLE_OUT - 0.15],
  [DOOR_OUT + 0.15, HALF_W - 0.25],
];

function columnT(s, sign) {
  // The mapped outline bulges only under the four central pedestals (|s-SA| < ~6).
  // Both columns of each Ionic pair share that depth. Side columns are engaged:
  // the echinus (r 0.70) stays inside the straight wall plus the 0.8 m ownsPoint slack.
  const deep = Math.abs(s - SA) < 5.70;
  return sign * (deep ? 4.95 : 3.40);
}

function shaft(b, mat, s, t, y0, y1, r0, r1, n, flute) {
  const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, n, 1, true);
  if (flute > 0) {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const ix = i % (n + 1);
      if (ix % 2 === 1 && ix !== n) {
        p.setX(i, p.getX(i) * (1 - flute));
        p.setZ(i, p.getZ(i) * (1 - flute));
      }
    }
    g.computeVertexNormals();
  }
  g.translate(...P(s, (y0 + y1) / 2, t));
  b.put(g, mat);
}

function column(b, s, t, near, fluted) {
  const n = near ? 14 : 8;
  const deep = Math.abs(t) > 4.2;
  const ped = deep ? 1.42 : 1.18;
  slab(b, 'granite', s, 1.28, t, ped, 1.80, ped); // pedestal 0.38–2.18; deep bases read in the far LOD
  shaft(b, 'granite', s, t, 2.10, 2.42, 0.64, 0.64, n, 0);
  shaft(b, 'granite', s, t, 2.38, 12.92, 0.56, 0.47, n, fluted && near ? 0.11 : 0);
  shaft(b, 'granite', s, t, 12.86, 13.52, 0.50, 0.70, n, 0); // echinus
  slab(b, 'granite', s, CAP_TOP - 0.16, t, 1.16, 0.32, 1.16); // abacus, top at CAP_TOP, under the architrave
  if (!near) return;
  slab(b, 'granite', s - 0.52, 13.22, t, 0.28, 0.36, 0.55);
  slab(b, 'granite', s + 0.52, 13.22, t, 0.28, 0.36, 0.55);
}

function archivolt(b, s0, half, spring, crown, face, out) {
  const t = face + out * 0.22;
  const thick = 0.26;
  const jamb = (s) => b.bar('granite', P(s, 0.25, t), P(s, spring, t), thick, 0.20);
  jamb(s0 - half - 0.12);
  jamb(s0 + half + 0.12);
  const segs = 10;
  const r = half + 0.12;
  const rise = crown - spring + 0.12;
  for (let i = 0; i < segs; i++) {
    const a0 = Math.PI * i / segs, a1 = Math.PI * (i + 1) / segs;
    b.bar('granite',
      P(s0 + r * Math.cos(a0), spring + rise * Math.sin(a0), t),
      P(s0 + r * Math.cos(a1), spring + rise * Math.sin(a1), t),
      thick, 0.20);
  }
}

function doorFrame(b, s0, half, face, out) {
  const t = face + out * 0.22;
  const sL = s0 - half - 0.12, sR = s0 + half + 0.12;
  b.bar('granite', P(sL, 0.25, t), P(sL, DOOR_H, t), 0.26, 0.20);
  b.bar('granite', P(sR, 0.25, t), P(sR, DOOR_H, t), 0.26, 0.20);
  b.bar('granite', P(sL, DOOR_H + 0.1, t), P(sR, DOOR_H + 0.1, t), 0.24, 0.20);
}

function lineOfText(b, text, sCenter, y, t, em) {
  // Looking from +t (the east), +s is the viewer's left. Local x grows toward the viewer's right,
  // so it runs toward −s. Same-colour strokes vanished; the cut letters are the dark granite.
  const gap = em * 0.1;
  const advance = em + gap;
  const thick = Math.max(0.055, em * 0.28);
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    width += ch === ' ' ? em * 0.38 : (i === text.length - 1 ? em : advance);
  }
  let sLeft = sCenter + width / 2;
  for (const ch of text) {
    const segs = FONT[ch];
    const step = ch === ' ' ? em * 0.38 : advance;
    if (segs) {
      for (const [x0, y0, x1, y1] of segs) {
        b.bar('graniteDark', P(sLeft - x0 * em, y + y0 * em, t), P(sLeft - x1 * em, y + y1 * em, t), thick, thick * 0.85);
      }
    }
    sLeft -= step;
  }
}

// Royal arms on the pediment face. Narrows upward; the finial is the surveyed tip, 23.79 m.
// Both fronts and both LODs, so the skyline does not change with distance.
function coatOfArms(b, face) {
  const t = face * 4.74;
  slab(b, 'limestone', SA, 20.55, t, 1.70, 0.70, 0.48); // base of the group
  slab(b, 'limestone', SA, 21.70, t, 1.28, 1.85, 0.46); // shield
  slab(b, 'limestone', SA, 22.85, t, 0.92, 0.50, 0.38); // crown
  slab(b, 'limestone', SA, 23.48, t, 0.28, 0.62, 0.22); // finial, top 23.79
  for (const sign of [1, -1]) {
    const s = SA + sign * 1.05;
    slab(b, 'limestone', s, 21.35, t, 0.58, 1.55, 0.40); // supporter
    slab(b, 'limestone', s, 22.25, t, 0.32, 0.38, 0.28); // head
    const u = SA + sign * 2.15;
    b.bar('limestone', P(u, 20.85, t), P(u + sign * 0.85, 22.15, t), 0.22, 0.14); // slope trophy
    slab(b, 'limestone', SA + sign * 2.55, 20.85, t, 0.42, 0.85, 0.30);
  }
}

// Framed shallow panel in the wall stone. The field is darker and set back from the border.
function relief(b, s, y, t, w, h) {
  // Field shares the frame's centre and stays 5 cm clear of both its faces, so the two materials
  // do not sit on one plane.
  slab(b, 'granite', s, y, t, w, h, 0.14);
  slab(b, 'graniteDark', s, y, t, w - 0.26, h - 0.24, 0.04);
}

// Trophy pile on the side attic, then a taller flame on the end pier.
function atticTrophy(b, s, t, h) {
  const y0 = SIDE_ATTIC + 0.12;
  slab(b, 'limestone', s, y0 + h * 0.28, t, h * 0.55, h * 0.56, h * 0.32);
  slab(b, 'limestone', s, y0 + h * 0.62, t, h * 0.32, h * 0.22, h * 0.26);
  b.bar('limestone', P(s, y0 + h * 0.25, t), P(s - h * 0.48, y0 + h * 0.88, t), 0.26, 0.14);
  b.bar('limestone', P(s, y0 + h * 0.25, t), P(s + h * 0.48, y0 + h * 0.88, t), 0.26, 0.14);
}

function endFlame(b, s, t) {
  const y0 = SIDE_ATTIC + 0.12;
  slab(b, 'limestone', s, y0 + 0.48, t, 0.90, 0.96, 0.55);
  slab(b, 'limestone', s, y0 + 1.28, t, 0.50, 0.72, 0.38);
  slab(b, 'limestone', s, y0 + 1.88, t, 0.28, 0.52, 0.24);
  slab(b, 'limestone', s, y0 + 2.28, t, 0.14, 0.32, 0.12);
}

export function buildOrders(b, near) {
  const nSide = near ? 1 : 0;
  for (const sign of [1, -1]) {
    for (const u of [...PAIR_U, SINGLE_U, CORNER_U]) {
      const s = SA + sign * u;
      column(b, s, columnT(s, 1), near, true);
    }
    for (const u of PAIR_U) {
      const s = SA + sign * u;
      column(b, s, columnT(s, -1), near, false); // west central shafts are smooth
    }
    for (const u of [SINGLE_U, CORNER_U]) {
      const s = SA + sign * u;
      slab(b, 'granite', s, (2.20 + CAP_TOP) / 2, -3.68, 1.05, CAP_TOP - 2.20, 0.36); // west pilaster up to the architrave
    }
    if (nSide) {
      // East rustication: horizontal joints on the piers only.
      for (const [u0, u1] of PIERS) {
        const s = SA + sign * (u0 + u1) / 2;
        const w = u1 - u0;
        for (let y = 0.85; y < ENTABLATURE - 0.4; y += 0.98) slab(b, 'graniteDark', s, y, EAST + 0.10, w, 0.07, 0.08);
      }
    }
  }

  // Impost at the shared spring line, both faces, both LODs.
  for (const sign of [1, -1]) {
    for (const face of [EAST + 0.18, WEST - 0.18]) {
      for (const [u0, u1] of PIERS) {
        slab(b, 'granite', SA + sign * (u0 + u1) / 2, SPRING + 0.08, face, (u1 - u0), 0.28, 0.16);
      }
    }
  }

  if (near) {
    for (const face of [1, -1]) {
      const wall = face > 0 ? EAST : WEST;
      archivolt(b, SA, CENTER_HALF, SPRING, CENTER_CROWN, wall, face);
      for (const sign of [1, -1]) {
        archivolt(b, SA + sign * SIDE_U, SIDE_HALF, SPRING, SIDE_CROWN, wall, face);
        doorFrame(b, SA + sign * DOOR_U, DOOR_HALF, wall, face);
        // Keystone mask: satyr on the east, lion on the west. A head-sized block either way.
        for (const [s0, crown] of [[SA, CENTER_CROWN], [SA + sign * SIDE_U, SIDE_CROWN]]) {
          slab(b, 'limestone', s0, crown + 0.02, wall + face * 0.22, 0.40, 0.36, 0.14);
        }
        // Garlands over the doors and the side arches: stone panels, not white stickers.
        relief(b, SA + sign * DOOR_U, 8.85, wall + face * 0.08, 1.20, 1.35);
        relief(b, SA + sign * SIDE_U, 13.42, wall + face * 0.08, 1.30, 0.72);
      }
    }
    const em = 0.28;
    const tabletT = ATTIC_FACE + 0.20;
    const tabletY = (CORNICE_TOP + PED_BASE) / 2 + 0.12;
    slab(b, 'granite', SA, tabletY, ATTIC_FACE + 0.08, 5.20, 1.95, 0.12); // frame
    slab(b, 'limestone', SA, tabletY, tabletT, 4.65, 1.50, 0.10);
    lineOfText(b, 'REGE CAROLO III', SA, tabletY + 0.36, tabletT + 0.10, em);
    lineOfText(b, 'ANNO', SA, tabletY - 0.06, tabletT + 0.10, em);
    lineOfText(b, 'MDCCLXXVIII', SA, tabletY - 0.46, tabletT + 0.10, em * 0.82);
    // West attic: a darker cartouche, no inscription.
    relief(b, SA, tabletY, -(ATTIC_FACE + 0.08), 2.3, 1.55);
  } else {
    slab(b, 'limestone', SA, (CORNICE_TOP + PED_BASE) / 2 + 0.12, ATTIC_FACE + 0.20, 4.65, 1.50, 0.10);
  }

  // Pilasters flank the tablet on both fronts. Coat of arms, trophies and end flames
  // are on both LODs: this is the skyline, and the finial is the 23.79 m tip.
  for (const face of [1, -1]) {
    const y0 = CORNICE_TOP + 0.25;
    const y1 = PED_BASE - 0.32;
    const t = face * (ATTIC_FACE + 0.14);
    for (const u of [3.35, 5.15]) {
      for (const sign of [1, -1]) {
        const s = SA + sign * u;
        slab(b, 'granite', s, (y0 + y1) / 2, t, 0.36, y1 - y0, 0.20);
        slab(b, 'granite', s, y1 - 0.06, t + face * 0.04, 0.52, 0.16, 0.26);
      }
    }
    coatOfArms(b, face);
    const trophyT = face * 2.85;
    for (const sign of [1, -1]) {
      atticTrophy(b, SA + sign * SIDE_U, trophyT, 1.70);
      atticTrophy(b, SA + sign * 15.15, trophyT, 1.55);
      endFlame(b, SA + sign * (HALF_W - 1.55), trophyT);
    }
  }
}
