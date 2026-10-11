import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, DESIGN } from './config.js';
import { CORE, CROWN, HALL, STRIPS } from './555-california-street-plan.js';
import { meshBuilder, clockwise, outward, decomposeStrip, stripCell, profileHeights, edgeKey } from './555-california-street-parts.js';

// 555 California Street. The mapped plan (OpenStreetMap building parts) is extruded as it is, so the sawtooth
// bay windows are the real zigzag of the outline, one prism face per facet and not a box per window:
//   * the 52-level shaft ("CORE", 226 m) with its four corner arms, which run unbroken from the ground,
//   * the outer layer of bays ("STRIPS", 48 levels) on each face, cut into 6 m teeth that each stop at their own
//     height, so the top reads as the stepped, Sierra-like cutouts with granite ledges,
//   * the inset crown block (237 m) with its own bays, and the low pavilion beside the tower (the hall).
// Windows are inset panels per floor (near) or per four floors (far); piers and spandrels are the granite wall.

// Heights (m) at which each tooth of the outer layer stops, read west to east (N, S) or north to south (E, W).
// Estimated from photographs (the OSM parts carry only the common 48-level figure, about 208 m): the cutouts
// climb to the east on the south face and to the west on the north face, so the top is turned, not mirrored.
export const PROFILES = {
  N: [[0.30, 207], [0.46, 199], [0.60, 191], [0.80, 183], [1, 174]],
  S: [[0.20, 174], [0.40, 183], [0.54, 191], [0.70, 199], [1, 207]],
  E: [[0.28, 184], [0.72, 200], [1, 190]],
  W: [[0.28, 190], [0.72, 200], [1, 184]],
};
const FLIP = { N: (t) => t[0] < 0, S: (t) => t[0] < 0, E: (t) => t[1] < 0, W: (t) => t[1] < 0 };

const inside = (ring, x, z) => { let h = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [ax, az] = ring[j], [bx, bz] = ring[i]; if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) h = !h; } return h; };
// Outward normal of any edge of (or a piece of) the shaft outline, by testing which side is outside the shaft.
const shaftOut = (p, q) => {
  const n = outward(p, q), mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2;
  return inside(CORE, mx + n[0] * 0.05, mz + n[1] * 0.05) ? [-n[0], -n[1]] : n;
};
const hash = (a, b, c) => {
  let h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const LIT = 0.22;

// The strips and the core edges they cover, computed once (pure plan data).
const hallEdges = new Set(), stripCoreEdges = new Set(), towerEdges = new Set();
const coreRing = clockwise(CORE), crownRing = clockwise(CROWN), hallRing = clockwise(HALL);
for (let i = 0; i < hallRing.length; i++) hallEdges.add(edgeKey(hallRing[i], hallRing[(i + 1) % hallRing.length]));
for (let i = 0; i < coreRing.length; i++) towerEdges.add(edgeKey(coreRing[i], coreRing[(i + 1) % coreRing.length]));
const strips = Object.fromEntries(Object.entries(STRIPS).map(([name, poly]) => {
  const strip = decomposeStrip(poly, CORE);
  for (let i = 1; i < strip.inner.length; i++) stripCoreEdges.add(edgeKey(strip.inner[i - 1], strip.inner[i]));
  for (let i = 1; i < strip.outer.length; i++) towerEdges.add(edgeKey(strip.outer[i - 1], strip.outer[i]));
  return [name, strip];
}));
// Tower axis: the north strip's own direction (the mapped plan sits about 8 degrees off the compass).
const tN = strips.N.t[0] < 0 ? [-strips.N.t[0], -strips.N.t[1]] : strips.N.t;
export const AXIS = Math.atan2(tN[1], tN[0]); // radians, map x toward z (negative: the face climbs to the north-east)

export function create({ detail = 'near' } = {}) {
  const far = detail === 'far';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const mats = { granite: meshBuilder(), spandrel: meshBuilder(), glass: meshBuilder(), glow: meshBuilder(), roof: meshBuilder(), metal: meshBuilder() };
  const { coreRoof, crownRoof, hallRoof, floor0, pitch, mechanical } = DESIGN;
  const cfg = far
    ? { off: 0.4, glowOff: 0.65, margin: 1.0, pier: 1.1, pierOff: 0.3, colW: 9, sill: 0.85 } // far: continuous glass spans between the louvre floors, a few lit bands
    : { pitch, sill: 0.85, win: 2.75, off: 0.15, margin: 0.95, pier: 0.8, pierOff: 0.09, colW: 4.2 };
  let seed = 1;

  // A wall piece between p and q (either order) from y0 to y1, facing nWant, drawn with its normal pointing out.
  const orient = (p, q, nWant) => {
    const n = [q[1] - p[1], -(q[0] - p[0])];
    return n[0] * nWant[0] + n[1] * nWant[1] >= 0 ? [p, q] : [q, p];
  };
  const wall = (mat, p, q, y0, y1, nWant) => {
    if (y1 - y0 < 0.05) return;
    const [a, c] = orient(p, q, nWant);
    mats[mat].quad([a[0], y0, a[1]], [a[0], y1, a[1]], [c[0], y1, c[1]], [c[0], y0, c[1]]);
  };
  // Window panels on that wall piece, one per column per floor, offset out of the granite.
  const windows = (p, q, y0, y1, nWant, { lobby = true, wall: surface = 'granite' } = {}) => {
    const [a, c] = orient(p, q, nWant);
    const dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz);
    if (L < 1.2) return;
    const nx = dz / L, nz = -dx / L, cols = Math.max(1, Math.round(L / cfg.colW)), w = L / cols, id = seed++;
    const put = (mat, u0, u1, ya, yb, inset = cfg.off) => {
      const f0 = u0 / L, f1 = u1 / L;
      const A = [a[0] + dx * f0 + nx * inset, ya, a[1] + dz * f0 + nz * inset], B = [A[0], yb, A[2]];
      const C = [a[0] + dx * f1 + nx * inset, yb, a[1] + dz * f1 + nz * inset], D = [C[0], ya, C[2]];
      mats[mat].quad(A, B, C, D);
    };
    if (lobby && y0 < 1) for (let k = 0; k < cols; k++) {
      const u0 = k * w + cfg.margin, u1 = (k + 1) * w - cfg.margin;
      if (u1 - u0 > 0.5) put('glass', u0, u1, 1.1, floor0 - 1.3);
    }
    if (far) { // one glass span per facet between the louvre floors (merged tier bands), plus a few lit bands
      const gaps = mechanical.map((r) => [floor0 + r * pitch, floor0 + (r + 1) * pitch]);
      let spans = [[Math.max(y0 + 0.4, floor0 + cfg.sill), y1 - 0.4]];
      for (const [g0, g1] of gaps) spans = spans.flatMap(([a0, a1]) => (g1 <= a0 || g0 >= a1 ? [[a0, a1]] : [[a0, Math.min(a1, g0)], [Math.max(a0, g1), a1]]));
      spans.filter(([a0, a1]) => a1 - a0 > 5).forEach(([a0, a1], i) => {
        const u0 = cfg.margin, u1 = L - cfg.margin;
        if (u1 - u0 < 0.5) return;
        put('glass', u0, u1, a0, a1);
        const bands = Math.floor((a1 - a0) / 90) + (hash(id, i, 7) < 0.34 ? 1 : 0); // lit floors, as bands proud of the glass
        for (let n = 0; n < bands; n++) { const y = a0 + 3 + hash(id, i, 11 + n) * Math.max(0, a1 - a0 - 18); const gw = Math.min(u1 - u0, 2.8), g0 = u0 + hash(id, i, 29 + n) * (u1 - u0 - gw); put('glow', g0, g0 + gw, y, y + 8.5, cfg.glowOff); }
      });
      return;
    }
    const r0 = Math.max(0, Math.ceil((y0 - (floor0 + cfg.sill) - 1e-6) / cfg.pitch));
    for (let r = r0; ; r++) {
      const base = floor0 + r * cfg.pitch, ya = base + cfg.sill, yb = ya + cfg.win;
      if (yb > y1 - 0.2) break;
      const slit = !far && mechanical.includes(r);
      for (let k = 0; k < cols; k++) {
        let u0 = k * w + cfg.margin, u1 = (k + 1) * w - cfg.margin;
        if (u1 - u0 < 0.5) continue;
        if (slit) { const mid = (u0 + u1) / 2, half = (u1 - u0) * 0.14; put('glass', mid - half, mid + half, ya + 0.1, yb - 0.5); continue; }
        put(!far && hash(id, k, r) < LIT ? 'glow' : 'glass', u0, u1, ya, yb);
      }
    }
  };
  // Granite piers: a vertical strip at each end of a facet, so every tooth vertex carries one (the vertical ribbing).
  const piers = (p, q, y0, y1, nWant) => {
    const [a, c] = orient(p, q, nWant);
    const dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz);
    if (L < 1.2) return;
    const nx = dz / L, nz = -dx / L, f = cfg.pier / L, o = cfg.pierOff;
    const strip = (f0, f1) => mats.granite.quad([a[0] + dx * f0 + nx * o, y0, a[1] + dz * f0 + nz * o], [a[0] + dx * f0 + nx * o, y1, a[1] + dz * f0 + nz * o], [a[0] + dx * f1 + nx * o, y1, a[1] + dz * f1 + nz * o], [a[0] + dx * f1 + nx * o, y0, a[1] + dz * f1 + nz * o]);
    strip(0, f); if (!far) strip(1 - f, 1); // far: one pier per facet, so every tooth vertex still has one
  };
  const face = (p, q, y0, y1, nWant, opts) => { wall('spandrel', p, q, y0, y1, nWant); piers(p, q, y0, y1, nWant); windows(p, q, y0, y1, nWant, opts); };

  // 1. The 48-level outer layer, tooth by tooth.
  for (const [name, strip] of Object.entries(strips)) {
    const heights = profileHeights(strip, PROFILES[name], FLIP[name](strip.t));
    const cells = Array.from({ length: strip.cells }, (_, k) => stripCell(strip, k));
    cells.forEach((cell, k) => {
      const H = heights[k];
      for (let i = 1; i < cell.outer.length; i++) {
        const p = cell.outer[i - 1], q = cell.outer[i];
        face(p, q, hallEdges.has(edgeKey(p, q)) ? hallRoof : 0, H, strip.n);
      }
      for (let i = 1; i < cell.inner.length; i++) face(cell.inner[i - 1], cell.inner[i], H, coreRoof, shaftOut(cell.inner[i - 1], cell.inner[i])); // the shaft above the cutouts
      mats.granite.cap(cell.poly, H);
      if (k + 1 < cells.length) { // riser between two teeth of different height, facing the lower one
        const lower = heights[k] < heights[k + 1] ? -1 : 1, bk = cells[k].ends[1];
        if (heights[k] !== heights[k + 1]) wall('granite', bk[0], bk[1], Math.min(heights[k], heights[k + 1]), Math.max(heights[k], heights[k + 1]), [strip.t[0] * lower, strip.t[1] * lower]);
      }
    });
  }

  // 2. The shaft's corner arms (every core edge not covered by an outer-layer strip) from the ground.
  for (let i = 0; i < coreRing.length; i++) {
    const p = coreRing[i], q = coreRing[(i + 1) % coreRing.length];
    if (stripCoreEdges.has(edgeKey(p, q))) continue;
    face(p, q, hallEdges.has(edgeKey(p, q)) ? hallRoof : 0, coreRoof, outward(p, q));
  }
  mats.granite.cap(coreRing, coreRoof, [crownRing]); // the ledge round the crown

  // 3. The crown block with its own bays, and its roof.
  for (let i = 0; i < crownRing.length; i++) {
    const p = crownRing[i], q = crownRing[(i + 1) % crownRing.length];
    face(p, q, coreRoof, crownRoof, outward(p, q), { lobby: false });
  }
  mats.roof.cap(crownRing, crownRoof);

  // 4. The low hall beside the tower: granite base and fascia round a glazed band.
  for (let i = 0; i < hallRing.length; i++) {
    const p = hallRing[i], q = hallRing[(i + 1) % hallRing.length];
    if (towerEdges.has(edgeKey(p, q))) continue; // shared with the tower: no wall
    const n = outward(p, q), [a, c] = orient(p, q, n), L = Math.hypot(c[0] - a[0], c[1] - a[1]);
    wall('granite', p, q, 0, hallRoof, n);
    const cols = Math.max(1, Math.round(L / (far ? 12 : 4.6))), w = L / cols, dx = (c[0] - a[0]) / L, dz = (c[1] - a[1]) / L;
    for (let k = 0; k < cols; k++) {
      const u0 = k * w + 0.5, u1 = (k + 1) * w - 0.5, off = far ? 0.4 : 0.15;
      mats.glass.quad([a[0] + dx * u0 + n[0] * off, 1.3, a[1] + dz * u0 + n[1] * off], [a[0] + dx * u0 + n[0] * off, hallRoof - 2.2, a[1] + dz * u0 + n[1] * off], [a[0] + dx * u1 + n[0] * off, hallRoof - 2.2, a[1] + dz * u1 + n[1] * off], [a[0] + dx * u1 + n[0] * off, 1.3, a[1] + dz * u1 + n[1] * off]);
    }
  }
  mats.roof.cap(hallRing, hallRoof);

  for (const [name, m] of Object.entries(mats)) if (m.count()) b.put(m.geometry(), name);

  // 5. Roof equipment on the crown (estimated): a mechanical penthouse, two masts, a window-washing gantry.
  const a = -AXIS;
  b.box('roof', [0, crownRoof + 1.0, 1.0], [19, 2.6, 9], a); // sunk 0.3 m into the roof deck
  if (!far) {
    b.box('metal', [12, crownRoof + 0.9, -2.5], [6, 2.4, 3], a);
    b.box('metal', [-14, crownRoof + 0.7, 5], [5, 2, 3], a);
    b.bar('metal', [-8.5, crownRoof + 2.0, 1.0], [-8.5, crownRoof + 2.8, 1.0], 0.35, 0.35);
  }
  b.bar('metal', [6.4, crownRoof + 2.0, 0.6], [6.4, SPEC.height, 0.6], 0.16, 0.16);
  return b.finish();
}
