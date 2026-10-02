// Facades of the Palliser: every exposed wall stretch gets a stone base (to the level-2 belt) under buff brick,
// a window grid in vertical bays, a heavy projecting cornice one storey under the roof with an attic row above it,
// and a parapet. Windows are flat quads proud of the wall (a stone surround under the glass); nothing is a box.
// All in wall frames (o, t, n) from the site module: u along the wall, y up, d out of the wall.
import { Ht, GROUND, PITCH, U, V } from './fairmont-palliser-site.js';

// Layers in front of a wall, each at least 0.07 m apart so large faces cannot z-fight.
const D_SURR = 0.12, D_GLASS = 0.2, D_MULL = 0.27;
const BELT = Ht(2); // the stone base ends at the level-2 belt (11 m)
const PLINTH = 1.9; // the dark granite band at the foot of the two-storey base (the ground-storey windows start above it)

export const faceOf = (e) => {
  const nv = e.n[0] * V[0] + e.n[1] * V[1], nu = e.n[0] * U[0] + e.n[1] * U[1];
  return nv > 0.9 ? 'S' : nv < -0.9 ? 'N' : nu > 0.9 ? 'E' : nu < -0.9 ? 'W' : '?';
};

// Evenly spaced bay centres along u0..u1 (empty if the stretch is too short for a window).
export function columns(u0, u1, pitch, margin) {
  const len = u1 - u0;
  if (len < 2 * margin + 0.9) return [];
  const n = Math.max(1, Math.round((len - 2 * margin) / pitch)), step = (len - 2 * margin) / n;
  return Array.from({ length: n }, (_, i) => u0 + margin + step * (i + 0.5));
}

// A closed prism along a wall from a cross-section polygon in (d, y); `skip` lists the polygon edges that lie on
// the wall or the roof and need no face. Faces face away from the section's centre, so nothing is inside-out.
export function moulding(kit, m, o, t, n, u0, u1, section, skip = []) {
  const P = (u, [d, y]) => kit.wp(o, t, n, u, y, d);
  const cd = section.reduce((s, q) => s + q[0], 0) / section.length, cy = section.reduce((s, q) => s + q[1], 0) / section.length;
  for (let i = 0; i < section.length; i++) {
    if (skip.includes(i)) continue;
    const a = section[i], b = section[(i + 1) % section.length], dd = b[0] - a[0], dy = b[1] - a[1];
    let nd = dy, ny = -dd; // a normal of the edge in (d, y); flip it to point away from the section's centre
    if (nd * ((a[0] + b[0]) / 2 - cd) + ny * ((a[1] + b[1]) / 2 - cy) < 0) { nd = -nd; ny = -ny; }
    kit.quad(m, P(u0, a), P(u1, a), P(u1, b), P(u0, b), [n[0] * nd, ny, n[1] * nd]);
  }
  kit.fan(m, section.map((q) => P(u0, q)), [-t[0], 0, -t[1]]);
  kit.fan(m, section.map((q) => P(u1, q)), [t[0], 0, t[1]]);
}

// One rectangular window: stone surround, glass (lit or dark), optional mullion for a pair of lights.
function rectWindow(ctx, e, uc, yc, w, h, { pair = false } = {}) {
  const { kit, rand } = ctx, { p: o, t, n } = e;
  kit.panel('stone', o, t, n, uc - w / 2 - 0.2, uc + w / 2 + 0.2, yc - h / 2 - 0.18, yc + h / 2 + 0.24, D_SURR);
  kit.panel(rand() < 0.3 ? 'glow' : 'glass', o, t, n, uc - w / 2, uc + w / 2, yc - h / 2, yc + h / 2, D_GLASS);
  if (pair) kit.panel('stone', o, t, n, uc - 0.06, uc + 0.06, yc - h / 2, yc + h / 2, D_MULL);
}

// A round-headed opening: stone surround, glass, optional mullion. y0 is the sill, ys the springing line.
export function archWindow(ctx, e, uc, w, y0, ys, { frame = 0.2, mull = false, steps = 4, glass } = {}) {
  const { kit, rand } = ctx, { p: o, t, n } = e;
  const inner = kit.archProfile(uc - w / 2, uc + w / 2, y0, ys, steps), outer = kit.archProfile(uc - w / 2 - frame, uc + w / 2 + frame, y0 - frame * 0.6, ys, steps);
  kit.fan('stone', outer.map(([u, y]) => kit.wp(o, t, n, u, y, D_SURR)), kit.hint(n));
  kit.fan(glass || (rand() < 0.3 ? 'glow' : 'glass'), inner.map(([u, y]) => kit.wp(o, t, n, u, y, D_GLASS)), kit.hint(n));
  if (mull) kit.panel('stone', o, t, n, uc - 0.06, uc + 0.06, y0, ys + w / 2, D_MULL);
}

// Cornice and parapet profiles in (d, y); the polygon edges listed in `skip` lie on the wall or the roof.
const corniceSection = (y) => [[0, y - 1.0], [0.45, y - 1.0], [0.45, y - 0.35], [0.85, y - 0.35], [0.85, y + 0.05], [1.3, y + 0.05], [1.3, y + 0.65], [0, y + 0.65]];
const smallCorniceSection = (y) => [[0, y - 0.9], [0.5, y - 0.9], [0.5, y - 0.45], [0.8, y - 0.45], [0.8, y], [0, y]];
const parapetSection = (y, h) => [[0, y], [0.3, y], [0.3, y + h], [-0.35, y + h], [-0.35, y]];
// The roofline cornice of the tall parts: a stepped shelf standing 1.0 m out of the wall under the parapet. Edge 0 lies on the wall
// and edge 9 on the roof; every other edge is a face (the section is star-shaped from its first point, so the end fans are valid).
const roofCorniceSection = (y) => [[0, y], [0, y - 0.9], [0.45, y - 0.9], [0.45, y - 0.45], [1.0, y - 0.45], [1.0, y + 0.05], [0.3, y + 0.05], [0.3, y + 0.75], [-0.35, y + 0.75], [-0.35, y]];
// Cornice (tall parts) or plain coping (courts, podium) along the top of one wall stretch; `ext(d)` extends it round convex corners.
function roofline(kit, s, ext) {
  const { part, e, u0, u1, H } = s, { p: o, t, n } = e;
  if (part.n >= 4) {
    const [x0, x1] = ext(1.0);
    moulding(kit, 'stone', o, t, n, u0 - x0, u1 + x1, roofCorniceSection(H), [0, 9]);
  } else {
    const [p0, p1] = ext(0.3);
    moulding(kit, 'stone', o, t, n, u0 - p0, u1 + p1, parapetSection(H, part.n <= 2 ? 1.0 : 0.75), [4]);
  }
}

// All the stuff on one exposed wall stretch (near LOD).
function nearWall(ctx, s) {
  const { kit } = ctx, { part, e, u0, u1, c, H } = s, { p: o, t, n } = e, len = u1 - u0, face = faceOf(e);
  const grounded = c < 0.5;
  const ext = (d) => [u0 <= 0.01 && e.convexStart ? d : 0, u1 >= e.L - 0.01 && e.convexEnd ? d : 0];

  // ground storey: tall rectangular windows between pilasters on 9 Avenue, round-headed windows elsewhere
  const entry = part.key === 'FRONT_ENTRY' && face === 'S'; // the doorway and canopy are drawn by the entrance
  if (grounded && H >= GROUND && !entry) {
    const [a0, a1] = ext(0.28);
    kit.slab('plinth', o, t, n, u0 - a0, u1 + a1, 0, PLINTH, 0.3, { bottom: false });
    if (len > 2.6) {
      const cols = columns(u0, u1, 3.6, 1.5);
      if (face === 'S') {
        for (const uc of cols) rectWindow(ctx, e, uc, 3.85, 1.55, 3.5, { pair: true });
        const pil = cols.length ? [u0 + 0.5, ...cols.slice(1).map((u, i) => (u + cols[i]) / 2), u1 - 0.5] : [];
        for (const up of pil) kit.slab('stone', o, t, n, up - 0.35, up + 0.35, PLINTH, 6.6, 0.28, { bottom: false });
      } else {
        for (const uc of columns(u0, u1, 3.4, 1.4)) archWindow(ctx, e, uc, 1.5, 2.1, 4.4, { mull: true });
      }
    }
    if (H > GROUND + 0.5) { const [b0, b1] = ext(0.6); kit.slab('stone', o, t, n, u0 - b0, u1 + b1, GROUND - 0.5, GROUND + 0.3, 0.6, {}); } // cornice over the ground storey
  }
  // second storey and the belt under the shaft
  if (c < BELT - 0.5 && H > BELT + 0.5) {
    const [b0, b1] = ext(0.4);
    kit.slab('stone', o, t, n, u0 - b0, u1 + b1, BELT - 0.25, BELT + 0.25, 0.4, {});
  }
  const level2 = c <= GROUND + 0.01 && H >= BELT - 0.01 && part.n >= 2;
  if (level2) {
    const cols = columns(u0, u1, face === 'S' ? 2.4 : 2.75, 0.9);
    if (face === 'S' && len > 3) { // the loggia: a pale panel behind a row of arched lights
      kit.panel('panel', o, t, n, u0 + 0.35, u1 - 0.35, GROUND + 0.7, BELT - 0.6, 0.06);
      for (const uc of cols) archWindow(ctx, e, uc, 1.3, GROUND + 0.9, 9.4, { frame: 0.16, mull: true });
    } else for (const uc of cols) rectWindow(ctx, e, uc, (GROUND + BELT) / 2 - 0.1, 1.1, 2.1);
  }
  // shaft rows, and the attic row under the roof
  const crownY = part.n >= 4 ? Ht(part.n - 1) : null;
  const cols = columns(u0, u1, 2.75, 1.1);
  const pairAt = len > 14 && part.n >= 8 ? cols[Math.round((cols.length - 1) / 2)] : null;
  for (let k = 3; k <= part.n && part.n >= 4; k++) {
    const lo = Ht(k - 1), hi = Ht(k);
    if (lo < c - 0.01 || hi > H + 0.01) continue;
    const attic = k === part.n;
    for (const uc of cols) rectWindow(ctx, e, uc, lo + (attic ? 1.8 : 1.7), 1.05, attic ? 1.5 : 1.8, { pair: uc === pairAt });
    if (pairAt !== undefined && !attic && (k === 4 || k === 9)) kit.slab('stone', o, t, n, pairAt - 1.0, pairAt + 1.0, lo + 0.5, lo + 0.78, 0.55); // iron-railed balconette under the paired lights
  }
  // stone quoins up the convex corners of the brick shaft
  if (crownY !== null && len > 4 && Math.max(c, BELT) < crownY - 4) {
    const q0 = Math.max(c, BELT) + 0.25, q1 = crownY - 1.0;
    if (u0 <= 0.01 && e.convexStart) kit.slab('stone', o, t, n, u0, u0 + 0.75, q0, q1, 0.1);
    if (u1 >= e.L - 0.01 && e.convexEnd) kit.slab('stone', o, t, n, u1 - 0.75, u1, q0, q1, 0.1);
  }
  // the heavy projecting cornice one storey under the roof (taller parts); a small one on the low courts and podium
  if (crownY !== null && c <= crownY - 1.3) {
    const [x0, x1] = ext(1.3);
    moulding(kit, 'stone', o, t, n, u0 - x0, u1 + x1, corniceSection(crownY), [7]);
  } else if (crownY === null && H > 1 && c < H - 1.0) {
    const [x0, x1] = ext(0.8);
    moulding(kit, 'stone', o, t, n, u0 - x0, u1 + x1, smallCorniceSection(H), [5]);
  }
  // the roofline: a 1 m projecting cornice under a parapet on the tall parts, a balustrade-height coping on the podium roofs
  roofline(kit, s, ext);
}

// The penthouse walls: brick under a stone cornice, no windows (the slate roof carries the sign).
function pentWall(ctx, s) {
  const { kit } = ctx, { e, u0, u1, c, H } = s, { p: o, t, n } = e;
  kit.panel('brick', o, t, n, u0, u1, c, H, 0);
  const x0 = u0 <= 0.01 && e.convexStart ? 0.9 : 0, x1 = u1 >= e.L - 0.01 && e.convexEnd ? 0.9 : 0;
  moulding(kit, 'stone', o, t, n, u0 - x0, u1 + x1, [[0, H - 1.0], [0.5, H - 1.0], [0.5, H - 0.5], [0.9, H - 0.5], [0.9, H], [0, H]], [5]);
}

// Far LOD: the same walls, heavy cornices and parapets; the window grid becomes one dark slot per two bays.
// A slot is 1.0 m wide: the near windows cover about 18 % of a bay row, and far must not read darker or striped against them.
const FAR_SLOT = 0.5;
function farWall(ctx, s) {
  const { kit, rand } = ctx, { part, e, u0, u1, c, H } = s, { p: o, t, n } = e, len = u1 - u0;
  const ext = (d) => [u0 <= 0.01 && e.convexStart ? d : 0, u1 >= e.L - 0.01 && e.convexEnd ? d : 0];
  if (c < BELT) kit.panel('stone', o, t, n, u0, u1, c, Math.min(H, BELT), 0);
  if (H > BELT) kit.panel('brick', o, t, n, u0, u1, Math.max(c, BELT), H, 0);
  const crownY = part.n >= 4 ? Ht(part.n - 1) : null;
  if (crownY !== null && c <= crownY - 1.3) { const [x0, x1] = ext(1.3); moulding(kit, 'stone', o, t, n, u0 - x0, u1 + x1, corniceSection(crownY), [7]); }
  roofline(kit, s, ext);
  if (len < 2.6 || part.n < 4) return;
  const y0 = Math.max(c, BELT) + 0.9, y1 = (crownY !== null && c <= crownY - 1.3 ? crownY - 1.3 : H - 1.6);
  const cols = columns(u0, u1, 2.75, 1.1);
  // one slot per two bays, cut into blocks three storeys tall so the lit ones speckle the wall at night
  const blocks = Math.max(1, Math.round((y1 - y0) / (3 * PITCH))), bh = (y1 - y0) / blocks;
  for (let i = 0; i < cols.length; i += 2) {
    const uc = (i + 1 < cols.length ? (cols[i] + cols[i + 1]) / 2 : cols[i]);
    if (y1 - y0 < 2) continue;
    for (let k = 0; k < blocks; k++) kit.panel(rand() < 0.3 ? 'glow' : 'glass', o, t, n, uc - FAR_SLOT, uc + FAR_SLOT, y0 + k * bh + 0.15, y0 + (k + 1) * bh - 0.15, D_GLASS);
  }
  if (c < 0.5 && !(part.key === 'FRONT_ENTRY')) { // dark ground-storey band
    for (const uc of columns(u0, u1, 7.2, 1.5)) kit.panel('glass', o, t, n, uc - 1.8, uc + 1.8, 2.1, 5.6, D_GLASS);
  }
}

export function drawFacades(ctx, segs) {
  const { kit, near } = ctx;
  for (const s of segs) {
    const { part, e, u0, u1, c, H } = s;
    if (part.key === 'PENTHOUSE') { pentWall(ctx, s); continue; }
    if (near) {
      // brick above the belt, stone below (windows and trims sit on these)
      if (c < BELT) kit.panel('stone', e.p, e.t, e.n, u0, u1, c, Math.min(H, BELT), 0);
      if (H > BELT) kit.panel('brick', e.p, e.t, e.n, u0, u1, Math.max(c, BELT), H, 0);
      nearWall(ctx, s);
    } else farWall(ctx, s);
  }
}
