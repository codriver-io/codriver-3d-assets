// Everything that is not a wall: the roofs, the stair and machine boxes on them, the 15th-level penthouse with its
// slate roof and the lit "PALLISER" sign, and the entrance on 9 Avenue (arched doorway, steps, the canopy).
import { PARTS, RINGS, PENT_WALL, U, at, along, across, centroid, inside, insetRing, edgesOf } from './fairmont-palliser-site.js';
import { faceOf, archWindow } from './fairmont-palliser-facade.js';
import { word, ribbons } from './fairmont-palliser-sign.js';

export const PENT_TOP = 60;
const MANSARD_INSET = 2.0;

export function roofs({ kit }) {
  for (const part of PARTS) kit.cap('roof', part.ring, part.top, true);
}

// Stair and machine boxes (brick, flat roof): hotel (u, v) centres. Every corner must stand on the roof it is meant for.
const BOXES = [
  ['WEST_ARM', -28, -12, 1.7, 1.3, 2.8], ['WEST_ARM', -25, 13, 1.5, 1.4, 2.4], ['EAST_ARM', 28, -10, 1.7, 1.3, 3.0],
  ['EAST_ARM', 21, 14, 1.5, 1.4, 2.6], ['NORTH_STEM', 0, -15, 2.2, 1.5, 3.0], ['STEM_14', -5, 17, 2.0, 1.3, 2.4],
];
export function roofBoxes({ kit, near }) {
  if (!near) return;
  const yaw = Math.atan2(U[1], U[0]);
  for (const [key, u, v, hw, hd, h] of BOXES) {
    const part = PARTS.find((q) => q.key === key), c = at(u, v);
    const r = kit.block('brick', c[0], part.top, part.top + h, c[1], hw, hd, yaw, { top: false });
    if (!r.every(([x, z]) => inside(part.ring, x, z))) throw new Error(`roof box ${key} (${u}, ${v}) is off its roof`);
    kit.cap('stone', r, part.top + h, true);
  }
}

// The penthouse roof: a slate mansard rising 2 m from the penthouse walls (58 m) to a flat top at 60 m, with the
// sign standing off its south slope. Returns the slope frame for the test.
export function penthouse({ kit, near }) {
  const base = RINGS.PENTHOUSE.slice(0, 4), top = insetRing(base, MANSARD_INSET), E = edgesOf(base);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, e = E[i];
    kit.quad('slate', [base[i][0], PENT_WALL, base[i][1]], [base[j][0], PENT_WALL, base[j][1]], [top[j][0], PENT_TOP, top[j][1]], [top[i][0], PENT_TOP, top[i][1]], [e.n[0], 1, e.n[1]]);
  }
  kit.cap('slate', top, PENT_TOP, true);
  // the sign: on the south slope, centred on the slope
  const s = E.find((e) => faceOf(e) === 'S'), rise = PENT_TOP - PENT_WALL;
  const slope = [-s.n[0] * MANSARD_INSET, rise, -s.n[1] * MANSARD_INSET], sl = Math.hypot(...slope), sd = slope.map((x) => x / sl);
  const nrm = [s.n[0] * rise, MANSARD_INSET, s.n[1] * rise], nl = Math.hypot(...nrm), nd = nrm.map((x) => x / nl);
  const h = 1.7, w = word('PALLISER', h), a0 = (s.L - w.width) / 2, b0 = (sl - h) / 2;
  const P = ([a, b], off = 0) => [s.p[0] + s.t[0] * (a0 + a) + sd[0] * (b0 + b) + nd[0] * off, PENT_WALL + sd[1] * (b0 + b) + nd[1] * off, s.p[1] + s.t[1] * (a0 + a) + sd[2] * (b0 + b) + nd[2] * off];
  if (near) {
    // each stroke segment is a raised bar standing on the slate (0.2 m proud): a front face and its two long sides (the 0.28 m ends
    // are sub-pixel and mostly buried in the next bar), so nothing floats and a bar costs 6 triangles
    for (const q of ribbons(w.strokes, 0.28)) {
      const f = q.map((pt) => P(pt, 0.2)), g = q.map((pt) => P(pt, 0)), c = [0, 1, 2].map((i) => (f[0][i] + f[1][i] + f[2][i] + f[3][i]) / 4);
      kit.quad('sign', f[0], f[1], f[2], f[3], nd);
      for (const i of [0, 2]) { const j = (i + 1) % 4, m = [0, 1, 2].map((k) => (f[i][k] + f[j][k]) / 2 - c[k]); kit.quad('sign', g[i], g[j], f[j], f[i], m); }
    }
  } else { const bw = 0.9, bb = (sl - bw) / 2; kit.quad('sign', P([-0.3, bb - b0], 0.2), P([w.width + 0.3, bb - b0], 0.2), P([w.width + 0.3, bb - b0 + bw], 0.2), P([-0.3, bb - b0 + bw], 0.2), nd); }
  return { slope: sd, normal: nd, signWidth: w.width };
}

// The entrance in the recess on 9 Avenue: an arched doorway, two steps and the canopy (dark teal ironwork, a row of
// lamps along its front edge) cantilevered over the pavement.
export function entrance(ctx, e) {
  const { kit, near } = ctx, { p: o, t, n } = e, uc = e.L / 2;
  const T = (u, y, d) => kit.wp(o, t, n, u, y, d);
  const piece = (u0, u1, d0, d1, y0, y1, th, front) => {
    const a = [T(u0, y0, d0), T(u1, y0, d0), T(u1, y1, d1), T(u0, y1, d1)], b = a.map((q) => [q[0], q[1] - th, q[2]]);
    kit.quad('canopy', a[0], a[1], a[2], a[3], [0, 1, 0]);
    kit.quad('canopy', b[0], b[1], b[2], b[3], [0, -1, 0]);
    if (front) kit.quad('canopy', a[3], a[2], b[2], b[3], kit.hint(n));
    kit.quad('canopy', a[0], a[3], b[3], b[0], [-t[0], 0, -t[1]]);
    kit.quad('canopy', a[1], a[2], b[2], b[1], [t[0], 0, t[1]]);
  };
  const yAt = (d) => 6.7 - 1.3 * d / 5.8;
  if (near) archWindow(ctx, e, uc, 3.6, 0.3, 3.9, { frame: 0.35, steps: 5, mull: true, glass: 'glass' });
  else kit.panel('glass', o, t, n, uc - 1.8, uc + 1.8, 0.3, 5.7, 0.2);
  // steps: two low treads in the recess
  kit.slab('stone', o, t, n, 0.3, e.L - 0.3, 0, 0.3, 3.0, { bottom: false });
  if (near) kit.slab('stone', o, t, n, 0.3, e.L - 0.3, 0, 0.15, 3.9, { bottom: false });
  // canopy: an inner piece inside the recess, a wider outer piece beyond the podium front
  piece(0.25, e.L - 0.25, 0.1, 2.8, yAt(0.1), yAt(2.8), 0.32, false);
  piece(-2.0, e.L + 2.0, 2.8, 5.8, yAt(2.8), yAt(5.8), 0.5, true);
  if (near) { // lamps along the front edge of the canopy (self-lit)
    const m = 22, u0 = -1.7, u1 = e.L + 1.7;
    for (let i = 0; i < m; i++) { const u = u0 + ((u1 - u0) * (i + 0.5)) / m, y = yAt(5.8) - 0.25; kit.quad('lamp', T(u - 0.1, y - 0.1, 5.86), T(u + 0.1, y - 0.1, 5.86), T(u + 0.1, y + 0.1, 5.86), T(u - 0.1, y + 0.1, 5.86), kit.hint(n)); }
  }
}

export const entryEdge = () => edgesOf(RINGS.FRONT_ENTRY).find((e) => faceOf(e) === 'S' && e.L > 4);
export { along, across, centroid };
