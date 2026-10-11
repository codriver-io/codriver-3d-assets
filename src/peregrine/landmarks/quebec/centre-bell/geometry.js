import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PLAN, H, UP_RING, BODY_RING, surfaces, wordRects } from './centre-bell-parts.js';

// Centre Bell (Bell Centre): the Canadiens' arena as a driver reads it: a 146 m x 107 m box turned 41 degrees from
// north (OSM way 19911284), its lower 28 m in orange brick (windows in a grid on the south-west face, silver
// panels on the Rue Saint-Antoine end, tan cladding round the north corner), a 10 m band of dark glass on top, a
// glazed entrance front on the Place des Canadiens side with two LED screens, and at the north corner the tall tan
// sign tower with the blue "Centre Bell" lettering. Authored on the building's own grid (u south-east, v
// north-east, see centre-bell-parts.js) and rotated into +X east / +Z south as each vertex is written.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // far folds the minor materials into their neighbours (eight draws at most)
  const S = surfaces(near ? {} : { metal: 'conc', frame: 'dark', lamp: 'dark' });
  const { U0, U1, V0, V1, NOTCH_U, NOTCH_V, FRONT: F, TOWER: T, ARCADE: A, SETBACK } = PLAN;
  const swPlane = { axis: 'v', at: V0, out: -1 }, nePlane = { axis: 'v', at: V1, out: 1 };
  const nwPlane = { axis: 'u', at: U0, out: -1 }, sePlane = { axis: 'u', at: U1, out: 1 }, towerNwPlane = { axis: 'u', at: T.u0, out: -1 };

  // ---- lower volume: brick, tan cladding and silver panels, y 0 - 28 m ---------------------------------------
  // north-west end (Avenue des Canadiens-de-Montréal): brick under a tan band, a tan pier under the sign tower
  S.wall('conc', [U0, NOTCH_V], [U0, T.v0], 0, H.BASE, [-1, 0]);
  S.wall('brick', [U0, NOTCH_V], [U0, T.v0], H.BASE, H.BRICK, [-1, 0]);
  S.wall('clad', [U0, NOTCH_V], [U0, T.v0], H.BRICK, H.LOW, [-1, 0]);
  S.wall('clad', [U0, T.v0], [U0, V1], 0, H.LOW, [-1, 0]);
  // north-east face, west of the glazed front: a tan corner pier, a pale glazed bay (the glazing continues round the north-west
  // side of the sign tower), then the tan foot of the tower; the tower's base projects in line with the front (below)
  const BAY = U0 + 4;
  S.wall('clad', [U0, V1], [BAY, V1], 0, H.LOW, [0, 1]);
  S.wall('clad', [BAY, V1], [T.u0, V1], 0, H.BASE, [0, 1]);
  S.wall('glow', [BAY, V1], [T.u0, V1], H.BASE, H.LOW - 0.6, [0, 1]);
  S.wall('clad', [BAY, V1], [T.u0, V1], H.LOW - 0.6, H.LOW, [0, 1]);
  S.wall('clad', [T.u0, V1], [F.u0, V1], 0, H.LOW, [0, 1]);
  // north-east face, east of the front
  S.wall('conc', [F.u1, V1], [U1, V1], 0, H.BASE, [0, 1]);
  S.wall('brick', [F.u1, V1], [U1, V1], H.BASE, H.BRICK, [0, 1]);
  S.wall('clad', [F.u1, V1], [U1, V1], H.BRICK, H.LOW, [0, 1]);
  // south-east end (Rue Saint-Antoine Ouest): silver panels
  S.wall('conc', [U1, V0], [U1, V1], 0, H.BASE, [1, 0]);
  S.wall('metal', [U1, V0], [U1, V1], H.BASE, H.LOW, [1, 0]);
  // south-west face (Rue de la Montagne): brick on a glazed arcade
  S.wall('brick', [NOTCH_U, V0], [U1, V0], H.BASE, H.LOW, [0, -1]);
  S.wall('conc', [NOTCH_U, V0], [A.u0, V0], 0, H.BASE, [0, -1]);
  S.wall('conc', [A.u1, V0], [U1, V0], 0, H.BASE, [0, -1]);
  S.quad('conc', [A.u0, H.BASE, V0], [A.u1, H.BASE, V0], [A.u1, H.BASE, V0 + A.depth], [A.u0, H.BASE, V0 + A.depth], [0, -1, 0]);
  S.wall('dark', [A.u0, V0 + A.depth], [A.u1, V0 + A.depth], 0, H.BASE, [0, -1]);
  S.wall('conc', [A.u0, V0], [A.u0, V0 + A.depth], 0, H.BASE, [1, 0]);
  S.wall('conc', [A.u1, V0], [A.u1, V0 + A.depth], 0, H.BASE, [-1, 0]);
  const columns = near ? 6 : 3;
  for (let k = 1; k < columns; k++) {
    const u = A.u0 + (A.u1 - A.u0) * k / columns;
    S.box('conc', u - 0.5, u + 0.5, V0 + 0.3, V0 + 1.3, 0, H.BASE, ['top', 'bot']);
  }
  // the 6 m set-back of the south-west end
  S.wall('conc', [NOTCH_U, V0], [NOTCH_U, NOTCH_V], 0, H.BASE, [-1, 0]);
  S.wall('brick', [NOTCH_U, V0], [NOTCH_U, NOTCH_V], H.BASE, H.LOW, [-1, 0]);
  S.wall('clad', [U0, NOTCH_V], [NOTCH_U, NOTCH_V], 0, H.LOW, [0, -1]);

  // ---- the glazed entrance front on the north-east side (Place des Canadiens) --------------------------------
  // the tower's tan base fills the front's first bay (to the tower's south-east side); the curtain wall runs on from there
  const FRONT_BASE = 5.0; // solid grey base under the curtain wall
  const G0 = T.u1; // the glazing starts here
  S.wall('clad', [F.u0, F.v], [G0, F.v], 0, H.LOW, [0, 1]);
  S.wall('conc', [G0, F.v], [F.u1, F.v], 0, FRONT_BASE, [0, 1]);
  S.wall('glow', [G0, F.v], [F.u1, F.v], FRONT_BASE, H.LOW - 0.6, [0, 1]);
  S.wall('clad', [G0, F.v], [F.u1, F.v], H.LOW - 0.6, H.LOW, [0, 1]);
  S.wall('clad', [F.u0, V1], [F.u0, F.v], 0, H.LOW, [-1, 0]);
  S.wall('clad', [F.u1, V1], [F.u1, F.v], 0, H.LOW, [1, 0]);
  const piers = near ? [-30.4, -16, -1.6, 12.8, 27.2] : [];
  for (const u of piers) S.box('clad', u - 0.6, u + 0.6, F.v, F.v + 0.5, 0, H.LOW, ['bot']);
  if (near) {
    const nePl = { axis: 'v', at: F.v, out: 1 };
    for (let k = 1; k < 24; k++) {
      const u = F.u0 + 3.6 * k;
      if (u < G0 + 0.3 || piers.some((p) => Math.abs(p - u) < 1.0)) continue;
      S.onWall('frame', nePl, u - 0.1, u + 0.1, FRONT_BASE, H.LOW - 0.6, 0.12);
    }
    for (const y of [9.5, 14, 18.5, 23]) S.onWall('frame', nePl, G0 + 0.2, F.u1 - 0.2, y - 0.1, y + 0.1, 0.1);
  }
  // four dark entrance doors in the grey base, and two LED screens in the bays between the piers (unshaded `lamp`:
  // dark by day, lit at night)
  for (const [u0, u1] of [[-40, -33], [-12, -5], [3, 10], [17, 24]]) S.onWall('dark', { axis: 'v', at: F.v, out: 1 }, u0, u1, 0, 3.6, 0.12);
  for (const [u0, u1] of [[-29.6, -16.8], [-0.8, 12.0]]) S.onWall('lamp', { axis: 'v', at: F.v, out: 1 }, u0, u1, 8.5, 17.5, 0.3);

  // ---- ledge round the dark band and the front's flat roof (one polygon, y = 28) ------------------------------
  S.cap('conc', BODY_RING, [UP_RING], H.LOW, true);

  // ---- dark-glass band, y 28 - 38.4, with a pale coping ---------------------------------------------------------
  const inTower = (u, v) => u >= T.u0 - 0.3 && u <= T.u1 + 0.3 && v >= T.v0 - 0.3;
  UP_RING.forEach((p, i) => {
    const q = UP_RING[(i + 1) % UP_RING.length], du = q[0] - p[0], dv = q[1] - p[1], len = Math.hypot(du, dv);
    const nrm = [-dv / len, du / len];
    S.wall('band', p, q, H.LOW, H.BAND, nrm);
    S.wall('clad', p, q, H.BAND, H.ROOF, nrm);
    if (!near) return;
    // mullions every 3.6 m and two transoms, drawn as thin raised bars (skipped where the sign tower hides them)
    const count = Math.max(1, Math.round(len / 3.6)), alongU = Math.abs(du) > Math.abs(dv);
    const plane = alongU ? { axis: 'v', at: p[1], out: Math.sign(nrm[1]) } : { axis: 'u', at: p[0], out: Math.sign(nrm[0]) };
    for (let k = 1; k < count; k++) {
      const t = k / count, u = p[0] + du * t, v = p[1] + dv * t;
      if (inTower(u, v) && (alongU ? nrm[1] > 0 : nrm[0] < 0)) continue;
      const a = alongU ? u : v;
      S.onWall('frame', plane, a - 0.14, a + 0.14, H.LOW, H.BAND, 0.15, ['bot']);
    }
    for (const y of [31.3, 34.5]) {
      const from = alongU ? Math.min(p[0], q[0]) : Math.min(p[1], q[1]), to = alongU ? Math.max(p[0], q[0]) : Math.max(p[1], q[1]);
      // north-east face: two runs, one on each side of the tower
      for (const [a0, a1] of alongU && nrm[1] > 0 ? [[from, T.u0 - 0.3], [T.u1 + 0.3, to]] : [[from, to]]) {
        if (a1 - a0 > 0.5) S.onWall('frame', plane, a0, a1, y - 0.12, y + 0.12, 0.1);
      }
    }
  });
  S.cap('conc', UP_RING, [], H.ROOF, true);

  // ---- the sign tower at the north corner, y 28 - 45 m ---------------------------------------------------------
  S.wall('clad', [T.u0, T.v1], [T.u1, T.v1], H.LOW, H.TOWER, [0, 1]);
  S.wall('clad', [T.u0, T.v0], [T.u0, T.v1], H.LOW, H.TOWER, [-1, 0]);
  S.wall('clad', [T.u1, T.v0], [T.u1, T.v1], H.LOW, H.TOWER, [1, 0]);
  S.wall('clad', [T.u0, T.v0], [T.u1, T.v0], H.ROOF, H.TOWER, [0, -1]); // below the roof this face is inside the building
  S.cap('conc', [[T.u0, T.v0], [T.u1, T.v0], [T.u1, T.v1], [T.u0, T.v1]], [], H.TOWER, true);
  // "Centre" over "Bell" in blue block letters, on the north-east face (read toward -u) and the north-west
  // face (read toward -v): the real sign faces both streets. Far keeps each word as one plain block.
  const bell = wordRects('Bell', 3.0), centre = wordRects('Centre', 1.8);
  const lines = [[bell, H.ROOF + 1.9], [centre, H.ROOF + 5.6]];
  for (const [word, base] of lines) {
    const rects = near ? word.rects : [{ s0: 0, s1: word.length, y0: 0, y1: word === bell ? 3.0 : 1.3 }];
    for (const r of rects) {
      S.onWall('sign', nePlane, T.u1 - 3.2 - r.s1, T.u1 - 3.2 - r.s0, base + r.y0, base + r.y1, 0.25);
      S.onWall('sign', towerNwPlane, T.v1 - 3.6 - r.s1, T.v1 - 3.6 - r.s0, base + r.y0, base + r.y1, 0.25);
    }
  }

  // ---- windows, slots and panels -----------------------------------------------------------------------------
  const vents = [[-0.5, 10.1], [13.5, 24.1]];
  const inVent = (c) => vents.some(([a, z]) => c + 0.85 > a && c - 0.85 < z);
  // south-west face: a grid of small windows in seven rows (ribbons in the far model)
  for (let k = 0; k < 7; k++) {
    const y0 = 7.0 + 2.9 * k;
    if (near) {
      for (let i = 0; i < 39; i++) {
        const c = -43.2 + 2.9 * i;
        if (i % 3 === 2 || (k >= 5 && inVent(c))) continue; // pairs of windows between blank brick bays
        S.onWall('glass', swPlane, c - 0.85, c + 0.85, y0, y0 + 1.3, 0.15);
      }
    } else {
      // far: one box per pair of windows
      for (let g = 0; g < 13; g++) {
        const c0 = -43.2 + 8.7 * g, a = c0 - 0.85, z = c0 + 2.9 + 0.85;
        if (k >= 5 && (inVent(c0) || inVent(c0 + 2.9))) continue;
        S.onWall('glass', swPlane, a, z, y0, y0 + 1.3, 0.15);
      }
    }
  }
  // two louvre grids high on the brick (the dark vertical slots above the windows)
  for (const u0 of [0, 14]) {
    if (near) for (let j = 0; j < 9; j++) S.onWall('dark', swPlane, u0 + 1.2 * j - 0.25, u0 + 1.2 * j + 0.25, 20.5, 26.5, 0.15);
    else S.onWall('dark', swPlane, u0 - 0.25, u0 + 9.85, 20.5, 26.5, 0.15);
  }
  // north-east face east of the front: five rows of windows
  for (let k = 0; k < 5; k++) {
    const y0 = 7.0 + 2.9 * k;
    if (near) for (let i = 0; i < 9; i++) { if (i % 3 !== 2) { const c = 44.5 + 2.9 * i; S.onWall('glass', nePlane, c - 0.85, c + 0.85, y0, y0 + 1.3, 0.15); } }
    else for (let g = 0; g < 3; g++) S.onWall('glass', nePlane, 44.5 + 8.7 * g - 0.85, 44.5 + 8.7 * g + 3.75, y0, y0 + 1.3, 0.15);
  }
  // south-west set-back: three ribbon windows in the pale wall
  for (const y0 of [9.5, 15, 20.5]) S.onWall('glass', { axis: 'v', at: NOTCH_V, out: -1 }, -70.5, -46.5, y0, y0 + 1.4, 0.15);
  if (near) {
    // north-west brick: tall narrow slits
    for (let i = 0; i < 14; i++) { const c = -40 + 5 * i; S.onWall('glass', nwPlane, c - 0.35, c + 0.35, 7.5, 19.5, 0.15); }
    // south-east end: tall glazed strips between the silver panels
    for (let i = 0; i < 16; i++) { const c = -46 + 5.8 * i; S.onWall('glass', sePlane, c - 0.65, c + 0.65, 8, 25, 0.15); }
  }

  // ---- roof plant (set well inside the parapet, clear of the sign tower) ----------------------------------------
  const plant = [
    [-40, -22, -40, -30, 3.0], [25, 45, -46, -36, 3.2], [-12, 10, -44, -37, 2.4], [48, 63, -40, -30, 2.6],
    [-30, -10, 30, 41, 2.6], [8, 28, 36, 45, 3.0], [52, 65, 20, 32, 2.4], [-45, -36, 5, 16, 2.0],
    [28, 37, 2, 14, 2.2], [-20, 5, -15, 5, 1.6],
  ];
  for (const [u0, u1, v0, v1, h] of near ? plant : plant.slice(0, 5)) S.box('metal', u0, u1, v0, v1, H.ROOF, H.ROOF + h, ['bot']);
  // four exhaust stacks, each standing on the plant box under it
  if (near) for (const [u, v, base] of [[-35, -33, 3.0], [30, -41, 3.2], [58, 25, 2.4], [15, 40, 3.0]]) S.box('metal', u - 0.6, u + 0.6, v - 0.6, v + 0.6, H.ROOF + base, H.ROOF + base + 2.2, ['bot']);

  S.flush(b);
  return b.finish();
}
