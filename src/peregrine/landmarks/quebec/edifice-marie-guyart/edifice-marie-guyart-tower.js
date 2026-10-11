import { hash01, planFrame, wallFrame } from './edifice-marie-guyart-mesh.js';
import { TOWER } from './edifice-marie-guyart-site.js';

// The 132 m tower. Four faces on a 42 m by 47 m rectangle, each built from the same layers, outermost first (r is metres outward from the mapped envelope;
// FR = -PIER is the plane of the window frames, which sit 1 m behind the corner piers and the crown band):
//   r = 0        corner piers (6 m wide, plain and windowless, full height, rising 1.5 m above the roof), the crown band
//   r = FR       the window frames
//   r = FR-0.45  the glass: continuous ribbons and the window rows, behind the frames
//   r = FR-0.6   the concrete field they stand on
//   r = -lobby   the glazed ground storey, set back under the upper storeys
// Each floor: a continuous dark ribbon over a row of square windows in protruding precast frames (RPCQ: "fenetres en bandeaux" and "panneaux rectangulaires
// de beton prefabrique legerement saillants", on all four elevations). The top floor is the glazed belvedere of the Observatoire de la Capitale.
const FIELD = 0.6, GLASS = 0.45, LIT = 0.3, GLOW_R = 0.3, FR = -TOWER.pier;

const front = (wf, s0, s1, y0, y1, r) => [wf.P(s0, y0, r), wf.P(s1, y0, r), wf.P(s1, y1, r), wf.P(s0, y1, r)];
const side = (wf, s, y0, y1, r0, r1) => [wf.P(s, y0, r0), wf.P(s, y0, r1), wf.P(s, y1, r1), wf.P(s, y1, r0)];
const flat = (wf, s0, s1, y, r0, r1) => [wf.P(s0, y, r0), wf.P(s1, y, r0), wf.P(s1, y, r1), wf.P(s0, y, r1)];
const neg = (v) => [-v[0], -v[1], -v[2]];
const UP = [0, 1, 0], DOWN = [0, -1, 0];

export function buildTower(M, near, tag = 1) {
  const { bearing, u0, u1, v0, v1, roof, floors, pitch, ground, corner: cw, capH, lobby } = TOWER;
  const frame = planFrame(bearing), crownY = ground + floors * pitch;
  const concrete = M.get('concrete');
  const corners = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];

  corners.forEach((c, id) => {
    const wf = wallFrame(frame, c, corners[(id + 1) % 4]), { L, N, T } = wf, mT = neg(T), f0 = cw, f1 = L - cw, W = f1 - f0;
    // Corner piers: flush with the envelope from the ground to the cap.
    for (const [a, b] of [[0, cw], [L - cw, L]]) concrete.quad(...front(wf, a, b, 0, roof + capH, 0), N);
    // The crown band across the field and the field itself from the ground storey up; the band's soffit over the belvedere glass.
    concrete.quad(...front(wf, f0, f1, crownY, roof, 0), N);
    concrete.quad(...flat(wf, f0, f1, crownY, FR - GLASS, 0), DOWN);
    concrete.quad(...front(wf, f0, f1, ground, crownY, FR - FIELD), N);
    // Pier sides facing the field: deep beside the set-back ground storey, shallow above it.
    concrete.quad(...side(wf, f0, 0, ground, -lobby, 0), T); concrete.quad(...side(wf, f1, 0, ground, -lobby, 0), mT);
    concrete.quad(...side(wf, f0, ground, roof, FR - FIELD, 0), T); concrete.quad(...side(wf, f1, ground, roof, FR - FIELD, 0), mT);
    // The piers above the roof: inner sides, and the cap once per corner (face id's start-of-face corner).
    concrete.quad(...side(wf, cw, roof, roof + capH, -cw, 0), T); concrete.quad(...side(wf, L - cw, roof, roof + capH, -cw, 0), mT);
    concrete.quad(wf.P(0, roof + capH, 0), wf.P(cw, roof + capH, 0), wf.P(cw, roof + capH, -cw), wf.P(0, roof + capH, -cw), UP);
    lobbyStorey(M, near, wf, f0, f1, W, id, tag);
    floorsOf(M, near, wf, f0, f1, W, id, tag);
  });
  // The roof deck over the whole rectangle (the corner piers and the plant stand on it).
  const [c0, c1, c2, c3] = corners.map(([u, v]) => { const [x, z] = frame.xz(u, v); return [x, roof, z]; });
  M.get('roof').quad(c0, c1, c2, c3, UP);
}

// The ground storey: dark glass set back 2.5 m under the upper floors, a header, the soffit, and columns at about 7 m.
function lobbyStorey(M, near, wf, f0, f1, W, id, tag) {
  const { ground, lobby } = TOWER, { N, T } = wf, mT = neg(T), concrete = M.get('concrete'), glass = M.get('glass'), glow = M.get('glow');
  glass.quad(...front(wf, f0, f1, 0.2, ground - 0.7, -lobby), N);
  concrete.quad(...front(wf, f0, f1, ground - 0.7, ground, -lobby), N);
  concrete.quad(...flat(wf, f0, f1, ground, -lobby, FR - FIELD), DOWN);
  const n = Math.max(2, Math.round(W / 7)), p = W / n;
  for (let i = 0; i < n; i++) if (hash01(tag + 7, id, i) < 0.7) glow.quad(...front(wf, f0 + i * p + 0.5, f0 + (i + 1) * p - 0.5, 0.5, ground - 1.0, -lobby + 0.15), N);
  if (!near) return;
  for (let i = 1; i < n; i++) { // columns against the glass: front and two sides
    const c = f0 + i * p, a = c - 0.35, b = c + 0.35;
    concrete.quad(...front(wf, a, b, 0, ground - 0.7, -lobby + 0.7), N);
    concrete.quad(...side(wf, a, 0, ground - 0.7, -lobby, -lobby + 0.7), mT);
    concrete.quad(...side(wf, b, 0, ground - 0.7, -lobby, -lobby + 0.7), T);
  }
}

function floorsOf(M, near, wf, f0, f1, W, id, tag) {
  const { floors, pitch, ground } = TOWER, { N, T } = wf, mT = neg(T), concrete = M.get('concrete'), glass = M.get('glass'), glow = M.get('glow');
  const nb = Math.max(1, Math.round(W / 3.05)), bay = W / nb, winW = 1.6, pier = bay - winW;
  for (let k = 0; k < floors; k++) {
    const f = ground + k * pitch, top = k === floors - 1;
    if (top) { belvedere(M, near, wf, f, f0, f1, nb, bay, id, tag); continue; }
    // Ribbon (continuous glass) and the window row's glass, behind the frames.
    glass.quad(...front(wf, f0, f1, f + 0.3, f + 1.5, FR - GLASS), N);
    glass.quad(...(near ? front(wf, f0, f1, f + 2.2, f + 3.55, FR - GLASS) : front(wf, f0, f1, f + 2.55, f + 3.2, FR - GLASS)), N);
    if (near) {
      // The frame band: sill and lintel across the whole field, a pier between neighbouring windows, soffit and roof of the band.
      concrete.quad(...front(wf, f0, f1, f + 1.5, f + 2.2, FR), N);
      concrete.quad(...front(wf, f0, f1, f + 3.55, f + 4.16, FR), N);
      concrete.quad(...flat(wf, f0, f1, f + 1.5, FR - GLASS, FR), DOWN);
      if (k < floors - 2) concrete.quad(...flat(wf, f0, f1, f + pitch, FR - FIELD, FR), UP); // the belvedere's sill runs on from the last lintel
      for (let j = 0; j <= nb; j++) {
        const c = f0 + j * bay, a = Math.max(f0, c - pier / 2), b = Math.min(f1, c + pier / 2);
        concrete.quad(...front(wf, a, b, f + 2.2, f + 3.55, FR), N);
        if (j > 0) concrete.quad(...side(wf, a, f + 2.2, f + 3.55, FR - GLASS, FR), mT); // the pier's left side faces the window on its left
        if (j < nb) concrete.quad(...side(wf, b, f + 2.2, f + 3.55, FR - GLASS, FR), T);
      }
      for (let j = 0; j < nb; j++) {
        const a = f0 + j * bay + pier / 2, b = a + winW;
        concrete.quad(...flat(wf, a, b, f + 2.2, FR - GLASS, FR), UP);
        concrete.quad(...flat(wf, a, b, f + 3.55, FR - GLASS, FR), DOWN);
        if (hash01(tag, id * 64 + k, j) < LIT) glow.quad(...front(wf, a + 0.12, b - 0.12, f + 2.3, f + 3.45, FR - GLOW_R), N);
        if (hash01(tag + 9, id * 64 + k, j) < LIT * 0.8) glow.quad(...front(wf, f0 + j * bay + 0.15, f0 + (j + 1) * bay - 0.15, f + 0.4, f + 1.4, FR - GLOW_R), N);
      }
    } else {
      // Far: the frame band is the field itself; lit windows are whole pairs of bays.
      for (let j = 0; j < nb; j += 2) if (hash01(tag, id * 64 + k, j) < LIT) glow.quad(...front(wf, f0 + j * bay + 0.2, f0 + Math.min(nb, j + 2) * bay - 0.2, f + 2.6, f + 3.15, FR - GLOW_R), N);
    }
  }
}

// The top floor: one continuous band of glass under the crown, divided by slim mullions at the bay lines, mostly lit at night.
function belvedere(M, near, wf, f, f0, f1, nb, bay, id, tag) {
  const { N } = wf, concrete = M.get('concrete'), glass = M.get('glass'), glow = M.get('glow'), y0 = f + 0.3, y1 = TOWER.ground + TOWER.floors * TOWER.pitch;
  glass.quad(...front(wf, f0, f1, y0, y1, FR - GLASS), N);
  concrete.quad(...front(wf, f0, f1, f, y0, FR), N);
  concrete.quad(...flat(wf, f0, f1, y0, FR - GLASS, FR), UP);
  if (near) for (let j = 0; j <= nb; j++) concrete.quad(...front(wf, Math.max(f0, f0 + j * bay - 0.15), Math.min(f1, f0 + j * bay + 0.15), y0, y1, FR - 0.2), N);
  for (let j = 0; j < nb; j++) if (hash01(tag + 21, id, j) < 0.6) glow.quad(...front(wf, f0 + j * bay + 0.25, f0 + (j + 1) * bay - 0.25, y0 + 0.3, y1 - 0.4, FR - GLOW_R), N);
}
