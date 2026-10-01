// Transamerica Pyramid parts, drawn into a surface accumulator in the building frame.
// Layers, from the inside out: the dark glass core of the pyramid, the precast grid in front of it
// (plain wall bands and window pockets whose sills slope back to the glass), the base arcade, the
// two wings and the aluminium spire. `ctx.near` keeps the pocket detail; far keeps the bands, the
// core, the arcade, the wings and the spire (the same silhouette and the same open arcade).
import { SHAPE, half, faceFrame } from './transamerica-pyramid-mesh.js';

const D = SHAPE.pocket, DF = 0.4; // recess depth near / far
// A face edge is a function (y, dn) -> u: either the arris (the corner, which slopes with the face) or a constant.
const ARRIS_L = (y, dn = 0) => -(half(y) + dn), ARRIS_R = (y, dn = 0) => half(y) + dn;
const fixed = (c) => () => c;
const hash = (a, b, c) => { let h = (Math.imul(a + 1, 374761393) + Math.imul(b + 1, 668265263) + Math.imul(c + 1, 2246822519)) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const UP = [0, 1, 0], DOWN = [0, -1, 0];
const isWingFace = (f) => f === 0 || f === 2;
/** The wing hides the middle of the E and W faces from its start height up. */
const wingRow = (f, y0) => isWingFace(f) && y0 >= SHAPE.wingY0 - 1e-6;
// beside the wing the wall runs 4 cm into the wing's solid so it crosses the wing's side face instead of touching it
const WING_EDGE = SHAPE.wingHalfW - 0.04;
const segments = (f, y0) => wingRow(f, y0)
  ? [[ARRIS_L, fixed(-WING_EDGE)], [fixed(WING_EDGE), ARRIS_R]]
  : [[ARRIS_L, ARRIS_R]];

/** A horizontal band y0..y1 across a segment: the front and, if asked, the soffit that heads the pockets below it. */
function band(S, F, mat, [ea, eb], y0, y1, { soffit = false, dn = -D } = {}) {
  S.quad(mat, F.pt(ea(y0), y0), F.pt(eb(y0), y0), F.pt(eb(y1), y1), F.pt(ea(y1), y1), F.hint);
  if (soffit) S.quad('shade', F.pt(ea(y0, dn), y0, dn), F.pt(eb(y0, dn), y0, dn), F.pt(eb(y0), y0), F.pt(ea(y0), y0), DOWN);
}
/** The up-facing ledge at the top of a band across a segment (closes the recess under the pockets above). */
function ledge(S, F, mat, [ea, eb], y, dn) {
  S.quad(mat, F.pt(ea(y, dn), y, dn), F.pt(eb(y, dn), y, dn), F.pt(eb(y), y), F.pt(ea(y), y), UP);
}

/**
 * A row of window pockets between two bands. Each pocket is a rectangular opening 0.5 m deep with a jamb
 * on each side, over a sill that slopes back from the wall plane to the glass; the wall between two
 * pockets is a narrow pier standing proud of the glass. The piers and jambs run SHAPE.tuck (3 cm) behind
 * and past the bands, the glass and the sill they meet, so two surfaces that should seal overlap instead
 * of touching at an edge (a T-junction would leave hairline cracks). Returns the number of windows.
 */
function pocketRow(ctx, F, f, [ea, eb], zb, zt, { pitch, pier, endMin, sill, lit = null }) {
  const { S } = ctx, E = SHAPE.tuck;
  const a = ea(zt), L = eb(zt) - a;
  const n = Math.floor((L - 2 * endMin + pier) / pitch);
  const ys = zb + sill, hint = F.hint, fp = (u, y, dn = 0) => F.pt(u, y, dn);
  // a pier front: tucked behind the band plane, running past the bands above and below
  const wall = (uL, uR, edgeL = null, edgeR = null) => S.quad('quartz', fp(edgeL ? edgeL(zb - E, -E) : uL, zb - E, -E), fp(edgeR ? edgeR(zb - E, -E) : uR, zb - E, -E), fp(edgeR ? edgeR(zt + E, -E) : uR, zt + E, -E), fp(edgeL ? edgeL(zt + E, -E) : uL, zt + E, -E), hint);
  // the jamb is a trapezoid (it also closes the triangle beside the sloping sill) and runs behind the glass
  const ysx = ys + (E * sill) / D;
  const jamb = (u, side) => S.quad('shade', fp(u, zb - E, -E), fp(u, zt + E, -E), fp(u, zt + E, -D - E), fp(u, ysx, -D - E), F.tHint(side));
  if (n < 1) { wall(0, 0, ea, eb); return 0; }
  const e = (L - n * pitch + pier) / 2, ww = pitch - pier;
  const wl = (j) => a + e + j * pitch, wr = (j) => wl(j) + ww;
  wall(0, wl(0), ea);
  for (let j = 1; j < n; j++) wall(wr(j - 1), wl(j));
  wall(wr(n - 1), 0, null, eb);
  // the sloped sill (flat when the pocket has no sill height): one strip along the whole row, running behind the glass
  S.quad('quartz', fp(ea(zb), zb), fp(eb(zb), zb), fp(eb(ysx, -D - E), ysx, -D - E), fp(ea(ysx, -D - E), ysx, -D - E), sill > 0 ? [F.o[0] * sill, D, F.o[2] * sill] : UP);
  for (let j = 0; j < n; j++) {
    jamb(wl(j), +1); jamb(wr(j), -1);
    if (lit && lit(j)) S.quad('light', fp(wl(j), ys + 0.12, -D + 0.15), fp(wr(j), ys + 0.12, -D + 0.15), fp(wr(j), zt - 0.05, -D + 0.15), fp(wl(j), zt - 0.05, -D + 0.15), hint);
  }
  return n;
}

/**
 * A window row above the recessed pockets: one flat wall quad per segment with a dark (or lit) pane for each
 * window standing 0.15 m proud of it. One quad a window instead of six, and nothing to see through.
 */
function paneRow(ctx, F, f, [ea, eb], zb, zt, { pitch, pier, endMin, lit = null }) {
  const { S } = ctx;
  const a = ea(zt), L = eb(zt) - a, n = Math.floor((L - 2 * endMin + pier) / pitch), hint = F.hint;
  S.quad('quartz', F.pt(ea(zb), zb), F.pt(eb(zb), zb), F.pt(eb(zt), zt), F.pt(ea(zt), zt), hint);
  if (n < 1) return 0;
  const e = (L - n * pitch + pier) / 2, ww = pitch - pier, g = 0.15, y0 = zt - 1.75, y1 = zt - 0.1;
  for (let j = 0; j < n; j++) {
    const u0 = a + e + j * pitch, u1 = u0 + ww;
    S.quad(lit && lit(j) ? 'light' : 'glass', F.pt(u0, y0, g), F.pt(u1, y0, g), F.pt(u1, y1, g), F.pt(u0, y1, g), hint);
  }
  return n;
}

/** The dark glass core behind the pocket grid, from the first strip up to the top of the pocket rows (far: the top band). */
function core(ctx, F, d) {
  const y0 = SHAPE.fasciaTop, y1 = ctx.near ? SHAPE.windowRow(SHAPE.pocketRows - 1).zt : SHAPE.topBand[0];
  ctx.S.quad('glass', F.pt(ARRIS_L(y0, -d), y0, -d), F.pt(ARRIS_R(y0, -d), y0, -d), F.pt(ARRIS_R(y1, -d), y1, -d), F.pt(ARRIS_L(y1, -d), y1, -d), F.hint);
}

/** Window rows, wall bands and the closing band of one face. */
export function facade(ctx, f) {
  const { S, near } = ctx, F = faceFrame(f);
  const { rows, bandH, pocketRows } = SHAPE, sillH = near ? SHAPE.sillH : SHAPE.farSillH;
  core(ctx, F, near ? D : DF);
  const wingBase = SHAPE.wingY0;
  // near: the thick band over the strip, then a plain wall band over each pocket row (the last is the closing band)
  // far: the same bands, grown down by the sloped sill so only the dark opening is left open
  const bands = [[SHAPE.stripTop, SHAPE.bandTop + (near ? 0 : sillH)]];
  for (let i = 0; i < rows; i++) {
    const { zt } = SHAPE.windowRow(i);
    bands.push([zt, i === rows - 1 ? zt + bandH : zt + bandH + (near ? 0 : sillH)]);
  }
  bands.forEach(([y0, y1], i) => {
    const wingStart = isWingFace(f) && Math.abs(y0 - wingBase) < 1e-6;
    // a soffit heads each recessed pocket row; rows above the pockets are flat and need none
    const pocketBelow = near && (i === 0 || i - 1 < pocketRows);
    const soffit = (pocketBelow && !wingStart) || (!near && (i === 0 || i === bands.length - 1));
    for (const seg of segments(f, y0)) band(S, F, 'quartz', seg, y0, y1, { soffit, dn: near ? -D : -DF });
    // the first wing band also closes the head of the pockets under the wing: soffit across the whole face
    if (pocketBelow && wingStart) S.quad('shade', F.pt(ARRIS_L(y0, -D), y0, -D), F.pt(ARRIS_R(y0, -D), y0, -D), F.pt(ARRIS_R(y0), y0), F.pt(ARRIS_L(y0), y0), DOWN);
  });
  if (!near) { cornerWall(ctx, F); farPiers(ctx, F, f); litStrips(ctx, F, f); return; }
  // the strip between the fascia and the thick band: wide pockets with a flat sill
  for (const seg of segments(f, SHAPE.fasciaTop)) pocketRow(ctx, F, f, seg, SHAPE.fasciaTop, SHAPE.stripTop, { pitch: 11.15, pier: 1.6, endMin: 0.8, sill: 0 });
  for (let i = 0; i < rows; i++) {
    const { zb, zt } = SHAPE.windowRow(i);
    const rowLit = hash(f, i, 7) < 0.45;
    segments(f, zb).forEach((seg, s) => {
      const opts = { pitch: ctx.pitch, pier: ctx.pier, endMin: 0.5, lit: rowLit ? (j) => hash(f, i, j + 31 * s) < 0.62 : null };
      ctx.windows += i < pocketRows ? pocketRow(ctx, F, f, seg, zb, zt, { ...opts, sill: sillH }) : paneRow(ctx, F, f, seg, zb, zt, opts);
    });
  }
}

/**
 * Far: close the 0.4 m notch behind the openings at the +u corner of a face with a thin diagonal partition
 * (visible from both sides), so a grazing view along one face cannot see through the corner into the next.
 */
function cornerWall(ctx, F) {
  const y0 = SHAPE.fasciaTop, y1 = SHAPE.topBand[0];
  const a = (y) => F.pt(half(y), y, 0), c = (y) => F.pt(half(y) - DF, y, -DF);
  const perp = [F.t[0] - F.o[0], 0, F.t[2] - F.o[2]];
  ctx.S.quad('shade', a(y0), c(y0), c(y1), a(y1), perp);
  ctx.S.quad('shade', a(y0), c(y0), c(y1), a(y1), perp.map((v) => -v));
}

/** Far: a pier every four windows across each opening, so the dark strips read as a window grid, not stripes. */
function farPiers(ctx, F, f) {
  const pitch = 4 * ctx.pitch, pw = 0.6;
  for (let i = 0; i < SHAPE.rows; i++) {
    const { zb, zt } = SHAPE.windowRow(i), g0 = zb + SHAPE.farSillH;
    for (const [ea, eb] of segments(f, zb)) {
      const a = ea(zt), L = eb(zt) - a, n = Math.floor((L - 1.2) / pitch);
      for (let k = 1; k <= n; k++) {
        const u = a + (L * k) / (n + 1);
        ctx.S.quad('quartz', F.pt(u - pw / 2, g0), F.pt(u + pw / 2, g0), F.pt(u + pw / 2, zt), F.pt(u - pw / 2, zt), F.hint);
      }
    }
  }
}

/** Far: a few lit floors as thin strips just in front of the core (the openings read as dark with lit runs). */
function litStrips(ctx, F, f) {
  for (let i = 0; i < SHAPE.rows; i++) {
    if (hash(f, i, 7) >= 0.45) continue;
    const { zb, zt } = SHAPE.windowRow(i);
    segments(f, zb).forEach(([ea, eb], s) => {
      const a = ea(zt) + 0.9, b = eb(zt) - 0.9, len = b - a, parts = Math.max(1, Math.round(len / 7));
      for (let k = 0; k < parts; k++) {
        if (hash(f, i, k + 17 * s) >= 0.7) continue;
        const u0 = a + (k / parts) * len + 0.4, u1 = a + ((k + 1) / parts) * len - 0.4;
        if (u1 - u0 < 1) continue;
        ctx.S.quad('light', F.pt(u0, zb + SHAPE.farSillH + 0.1, -DF + 0.15), F.pt(u1, zb + SHAPE.farSillH + 0.1, -DF + 0.15), F.pt(u1, zt - 0.1, -DF + 0.15), F.pt(u0, zt - 0.1, -DF + 0.15), F.hint);
      }
    });
  }
}

/** The four-storey base of one face: corner piers, the A-frame arcade over the glazed lobby, the fascia. */
export function base(ctx, f) {
  const { S, near } = ctx, F = faceFrame(f);
  const { arcadeTop: T, fasciaTop } = SHAPE;
  const uIn = SHAPE.halfBase - 4.3;           // corner pier inner face and lobby wall line, 22.35 m
  // glazed lobby: a vertical wall set back 4.3 m, under the first fascia
  S.quad('glass', F.ptN(-uIn, 0, uIn), F.ptN(uIn, 0, uIn), F.ptN(uIn, T, uIn), F.ptN(-uIn, T, uIn), F.o);
  // The piers and A-frames stand 3 cm behind the fascia plane and run 5 cm up behind the fascia, so no seam opens under it.
  const E = SHAPE.tuck, TT = T + 0.05;
  // corner piers at both ends of the face: outer face in the face plane, inner face a vertical plane
  for (const s of [-1, 1]) {
    S.quad('concrete', F.pt(s * uIn, 0, -E), F.pt(s * (half(0) - E), 0, -E), F.pt(s * (half(TT) - E), TT, -E), F.pt(s * uIn, TT, -E), F.hint);
    S.quad('concrete', F.ptN(s * uIn, 0, uIn), F.ptN(s * uIn, 0, half(0) - E), F.ptN(s * uIn, TT, half(TT) - E), F.ptN(s * uIn, TT, uIn), F.tHint(-s));
  }
  // A-frames: four bays, one zig-zag polygon so no two fronts overlap
  const wh = 3.0, t = 2.6, bays = 4;
  const f0 = -uIn + wh / 2, f4 = uIn - wh / 2, pitch = (f4 - f0) / bays;
  const foot = (k) => f0 + k * pitch, apex = (k) => foot(k) + pitch / 2;
  const yN = T * (1 - wh / 2 / (pitch / 2)), yV = (T * wh) / pitch;
  const pts = [];
  for (let k = 0; k < bays; k++) pts.push([foot(k) - wh / 2, 0], [foot(k) + wh / 2, 0], [apex(k), yN]);
  pts.push([foot(bays) - wh / 2, 0], [foot(bays) + wh / 2, 0]);
  for (let k = bays - 1; k >= 0; k--) { pts.push([apex(k) + wh / 2, TT], [apex(k) - wh / 2, TT]); if (k > 0) pts.push([foot(k), yV]); }
  S.poly('concrete', pts.map(([u, y]) => F.pt(u, y, -E)), pts, F.hint);
  // the sides: every edge that is neither on the ground nor under the fascia
  for (let i = 0; i < pts.length; i++) {
    const [u0, y0] = pts[i], [u1, y1] = pts[(i + 1) % pts.length];
    if ((y0 === 0 && y1 === 0) || (y0 === TT && y1 === TT)) continue;
    const len = Math.hypot(u1 - u0, y1 - y0), nu = (y1 - y0) / len, ny = -(u1 - u0) / len; // outward normal of a counter-clockwise polygon
    S.quad('concrete', F.pt(u0, y0, -E), F.pt(u1, y1, -E), F.pt(u1, y1, -E - t), F.pt(u0, y0, -E - t), [F.t[0] * nu, ny, F.t[2] * nu]);
  }
  // first fascia band over the arcade, its soffit above the lobby, the ledge under the strip's pockets
  for (const seg of segments(f, 0)) { band(S, F, 'quartz', seg, T, fasciaTop); if (!near) ledge(S, F, 'quartz', seg, fasciaTop, -DF); }
  S.quad('quartz', F.ptN(-uIn, T, uIn), F.ptN(uIn, T, uIn), F.ptN(uIn, T, half(T)), F.ptN(-uIn, T, half(T)), DOWN);
}

/** The two wings: vertical faces rising from the 29th floor with a pitched top. */
export function wings(ctx, f) {
  const { S } = ctx, F = faceFrame(f);
  const { wingHalfW: w, wingY0: y0, wingEaveY: yE, wingTopY: yT, wingFaceN: X } = SHAPE;
  const topN = half(yT), up = [F.o[0], 0.6, F.o[2]];
  const d = ctx.near ? D : DF;
  // outer face and the pitched top
  S.quad('quartz', F.ptN(-w, y0, X), F.ptN(w, y0, X), F.ptN(w, yE, X), F.ptN(-w, yE, X), F.o);
  S.quad('quartz', F.ptN(-w, yE, X), F.ptN(w, yE, X), F.ptN(w, yT, topN), F.ptN(-w, yT, topN), up);
  // panel joints: a thin raised rib across the outer face at every floor
  if (ctx.near) {
    const t = 0.12, h = 0.16;
    for (let y = y0 + SHAPE.floor; y < yE - 1; y += SHAPE.floor) {
      const xs = X + t, y1 = y + h;
      S.quad('quartz', F.ptN(-w, y, xs), F.ptN(w, y, xs), F.ptN(w, y1, xs), F.ptN(-w, y1, xs), F.o);
      S.quad('quartz', F.ptN(-w, y1, X), F.ptN(w, y1, X), F.ptN(w, y1, xs), F.ptN(-w, y1, xs), UP);
      S.quad('quartz', F.ptN(-w, y, X), F.ptN(w, y, X), F.ptN(w, y, xs), F.ptN(-w, y, xs), DOWN);
      for (const sd of [-1, 1]) S.quad('quartz', F.ptN(sd * w, y, X), F.ptN(sd * w, y1, X), F.ptN(sd * w, y1, xs), F.ptN(sd * w, y, xs), F.tHint(sd));
    }
  }
  // each side face, from the wing's lower tip back to the core so the grid beside it is closed too
  const s0 = SHAPE.topBand[0];
  // near: the grid beside the wing is a flat wall, so its side face is just the wedge outside the sloping face
  const outline = ctx.near
    ? [[X, y0], [X, yE], [topN, yT]]
    : [[X - d, y0], [X, y0], [X, yE], [topN, yT], [half(s0 + SHAPE.bandH), s0 + SHAPE.bandH], [half(s0 + SHAPE.bandH) - d, s0 + SHAPE.bandH]];
  for (const s of [-1, 1]) S.poly('quartz', outline.map(([n, y]) => F.ptN(s * w, y, n)), outline, F.tHint(s));
}

/** Aluminium spire, its louvres, and the glass crown. */
export function spire(ctx, f) {
  const { S } = ctx, F = faceFrame(f);
  const y0 = SHAPE.topBand[1], y1 = SHAPE.spireTop, y2 = SHAPE.crownTop;
  S.quad('aluminium', F.pt(-half(y0), y0), F.pt(half(y0), y0), F.pt(half(y1), y1), F.pt(-half(y1), y1), F.hint);
  // two louvre slots per face just above the wings, lit from inside at night
  for (const u of [-2.1, 2.1]) {
    const a = 216.8, b = 219.8, g = 0.15;
    S.quad('light', F.pt(u - 0.7, a, g), F.pt(u + 0.7, a, g), F.pt(u + 0.7, b, g), F.pt(u - 0.7, b, g), F.hint);
  }
  // crown: a glass pyramid frustum with a small flat
  const top = 0.2, cb = half(y1);
  S.quad('glow', F.ptN(-cb, y1, cb), F.ptN(cb, y1, cb), F.ptN(top, y2, top), F.ptN(-top, y2, top), [F.o[0], 0.4, F.o[2]]);
  if (f === 0) S.quad('glow', [-top, y2, -top], [top, y2, -top], [top, y2, top], [-top, y2, top], UP);
}
