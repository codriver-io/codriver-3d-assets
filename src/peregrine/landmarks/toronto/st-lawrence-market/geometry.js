import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  PHI, HW, V_N, V_S, BASE_H, SILL, SPRING, EAVE, LANTERN_TOP, LANTERN_U, LANTERN_EAVE, LANTERN_END_S,
  MODULE, WIN_W, WIN_RISE, PAVILION_LEN, PAVILION_PROUD, BAY_FIRST, BAYS, DECK_FROM, DECK_OUT,
  roofY, archPoints, REMNANT, layoutText,
} from './st-lawrence-market-site.js';

// The South Market of the St. Lawrence Market: a 43 x 106 m brick hall under one
// arched metal roof with a clerestory lantern, entered through the 1845 City Hall
// centre block kept in the Front Street facade. Original procedural geometry.
//
// Authoring works in the hall's own frame: u along the Front Street facade, v
// along the hall towards The Esplanade, y up. Every wall is drawn in its own 2D
// frame (a along the wall, b up, c into the wall, so c < 0 stands proud), which
// is how arches, reveals and lettering are written once and placed on all four
// sides. The exported root is turned once, by PHI, into the mapped orientation.

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
function frame(origin, ex) {
  const X = V3(...ex), Y = V3(0, 1, 0), Z = new THREE.Vector3().crossVectors(X, Y);
  return new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(...origin);
}
const FRAMES = {
  north: frame([0, 0, V_N], [1, 0, 0]),
  south: frame([0, 0, V_S], [-1, 0, 0]),
  east: frame([HW, 0, 0], [0, 0, 1]),
  west: frame([-HW, 0, 0], [0, 0, -1]),
};
// a-coordinate along a wall for a world coordinate p (u on the ends, v on the long sides).
const A = { north: (p) => p, south: (p) => -p, east: (p) => p, west: (p) => -p };
const SIDES = ['east', 'west'];

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, m) => b.put(g, m, 0, 0);
  const box = (m, u, y, v, w, h, d) => b.box(m, [u, y, v], [w, h, d], 0, 0, 0);
  const range = (m, u0, u1, y0, y1, v0, v1) => box(m, (u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2, Math.abs(u1 - u0), Math.abs(y1 - y0), Math.abs(v1 - v0));
  const ARC = near ? 8 : 4;

  // --- 2D wall primitives -------------------------------------------------
  // Height of the head above the springing line at offset x from the window's axis:
  // a semicircle by default, a shallow segment when `rise` < w / 2.
  const headY = (w, rise, x) => {
    const r = w / 2; if (rise >= r - 1e-6) return Math.sqrt(Math.max(0, r * r - x * x));
    const R = (r * r + rise * rise) / (2 * rise); return Math.sqrt(Math.max(0, R * R - x * x)) - (R - rise);
  };
  const archHole = (side, p, b0, w, spring, segs = ARC, rise = w / 2) => {
    const a = A[side](p), r = w / 2, pts = [[a - r, b0], [a + r, b0], [a + r, spring]];
    for (let i = 1; i < segs; i++) { const x = r - w * i / segs; pts.push([a + x, spring + headY(w, rise, x)]); }
    pts.push([a - r, spring]);
    return pts;
  };
  const rectHole = (side, p0, p1, b0, b1) => { const a0 = A[side](p0), a1 = A[side](p1); return [[a0, b0], [a1, b0], [a1, b1], [a0, b1]]; };
  // A wall panel: outline in (p, y), holes already in (a, b), extruded `depth` into the wall from c0.
  function panel(side, outline, holes, depth, c0, material) {
    const shape = new THREE.Shape(outline.map(([p, y]) => new THREE.Vector2(A[side](p), y)));
    for (const h of holes) shape.holes.push(new THREE.Path(h.map(([a, y]) => new THREE.Vector2(a, y))));
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, c0); g.applyMatrix4(FRAMES[side]); put(g, material);
  }
  // A flat convex polygon at depth c, facing out of the wall.
  function fan(side, pts, c, material) {
    const m = FRAMES[side], out = V3(0, 0, -1).transformDirection(m);
    const P = pts.map(([a, y]) => V3(a, y, c).applyMatrix4(m)), index = [];
    for (let i = 1; i < P.length - 1; i++) {
      const n = new THREE.Vector3().crossVectors(P[i].clone().sub(P[0]), P[i + 1].clone().sub(P[0]));
      index.push(...(n.dot(out) >= 0 ? [0, i, i + 1] : [0, i + 1, i]));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap((p) => p.toArray()), 3)); g.setIndex(index); g.computeVertexNormals();
    put(g, material);
  }
  // A straight bar in the wall plane, `thick` across, `depth` out of it, centred at depth c.
  function stroke(side, a1, b1, a2, b2, thick, depth, c, material) {
    const len = Math.hypot(a2 - a1, b2 - b1); if (len < 1e-4) return;
    const g = new THREE.BoxGeometry(len, thick, depth);
    g.rotateZ(Math.atan2(b2 - b1, a2 - a1)); g.translate((a1 + a2) / 2, (b1 + b2) / 2, c);
    g.applyMatrix4(FRAMES[side]); put(g, material);
  }
  // Block lettering read left to right by someone standing outside the wall.
  function text(side, str, aC, bBase, h, c, material, thick = 0.17, depth = 0.1) {
    const e = thick * h / 2;
    for (const { glyph, x } of layoutText(str).items) {
      for (const [x1, y1, x2, y2] of glyph.strokes) {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
        stroke(side, aC - (x + x1 - ux * e / h) * h, bBase + (y1 - uy * e / h) * h, aC - (x + x2 + ux * e / h) * h, bBase + (y2 + uy * e / h) * h, thick * h, depth, c, material);
      }
    }
  }
  // An arched window: pane recessed at c, muntins in front of it.
  function furnish(side, p, b0, w, spring, c, pane = 'glow', rise = w / 2) {
    fan(side, archHole(side, p, b0, w, spring, ARC, rise), c, pane);
    if (!near) return;
    const a = A[side](p), r = w / 2;
    for (const dx of [-w / 4, 0, w / 4]) stroke(side, a + dx, b0, a + dx, spring + headY(w, rise, dx), 0.09, 0.1, c - 0.1, 'copper');
    for (const y of [b0 + (spring - b0) / 3, b0 + 2 * (spring - b0) / 3, spring]) stroke(side, a - r, y, a + r, y, 0.09, 0.1, c - 0.1, 'copper');
  }
  // A prism: polygon in (x, y) extruded `len` along the frame's inward axis.
  function prism(fr, poly, len, material, z0 = 0) {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x, y))), { depth: len, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, z0); g.applyMatrix4(fr); put(g, material);
  }

  // --- The arched roof, its lantern and the roof vents --------------------
  const half = archPoints(near ? 16 : 7, 0);
  const profile = [...half, ...half.slice(0, -1).reverse().map(([u, y]) => [-u, y])];
  {
    const pos = [], index = [];
    for (const [u, y] of profile) pos.push(u, y, V_N, u, y, V_S);
    for (let i = 0; i < profile.length - 1; i++) {
      const s = 2 * i, up = profile[i + 1][0] > profile[i][0];
      index.push(...(up ? [s, s + 1, s + 2, s + 1, s + 3, s + 2] : [s, s + 2, s + 1, s + 1, s + 2, s + 3]));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(index); g.computeVertexNormals();
    put(g, 'roof');
  }
  {
    const v0 = V_N + 0.6, v1 = LANTERN_END_S, len = v1 - v0, vMid = (v0 + v1) / 2, yLow = roofY(LANTERN_U) - 0.15, yMid = (yLow + LANTERN_EAVE) / 2, hgt = LANTERN_EAVE - yLow;
    for (const sg of [1, -1]) {
      box('glow', sg * LANTERN_U, yMid, vMid, 0.18, hgt, len);
      box('concrete', sg * (LANTERN_U + 0.03), LANTERN_EAVE - 0.06, vMid, 0.34, 0.16, len);
      if (near) {
        box('concrete', sg * (LANTERN_U + 0.03), yLow + 0.85, vMid, 0.3, 0.14, len);
        for (let v = v0 + 1.2; v < v1; v += 2.4) box('concrete', sg * (LANTERN_U + 0.05), yMid, v, 0.28, hgt, 0.14);
      }
    }
    // cap: a shallow gable, overhanging the glazing
    const ce = LANTERN_EAVE - 0.23, cap = [[-7.55, ce], [0, LANTERN_TOP], [7.55, ce], [7.55, ce - 0.16], [0, LANTERN_TOP - 0.16], [-7.55, ce - 0.16]];
    prism(new THREE.Matrix4().setPosition(0, 0, V_N + 0.3), cap, v1 + 0.25 - (V_N + 0.3), 'roof');
    // the lantern's Esplanade end
    prism(new THREE.Matrix4().setPosition(0, 0, v1 - 0.3), [[-7.25, yLow], [7.25, yLow], [7.25, LANTERN_EAVE], [0, LANTERN_TOP - 0.05], [-7.25, LANTERN_EAVE]], 0.3, 'roof');
    for (const sg of [1, -1]) for (let v = V_N + 12; v < V_S - 6; v += 9.6) { // roof vents, brown stacks on the slope
      const y = roofY(13);
      box('brick', sg * 13, y + 0.9, v, 1.0, 2.6, 1.0); box('concrete', sg * 13, y + 2.3, v, 1.4, 0.22, 1.4);
    }
  }

  // --- Long walls: brick, arched windows between piers, pent eave ----------
  const bayP = (k) => BAY_FIRST + MODULE * k;
  const pierP = (j) => V_N + 8.4 + MODULE * j;
  for (const side of SIDES) {
    const sg = side === 'east' ? 1 : -1;
    const holes = [];
    if (near) {
      for (let k = 0; k < BAYS; k++) holes.push(archHole(side, bayP(k), SILL, WIN_W, SPRING, ARC, WIN_RISE));
      for (const k of [1, 3]) holes.push(archHole(side, bayP(k), 0, 1.6, 1.9)); // doors into the solid base
    }
    panel(side, [[V_N, 0], [DECK_FROM, 0], [DECK_FROM, BASE_H], [V_S, BASE_H], [V_S, EAVE], [V_N, EAVE]], holes, 0.6, 0, 'brick');
    if (near) {
      for (let k = 0; k < BAYS; k++) { furnish(side, bayP(k), SILL, WIN_W, SPRING, 0.42, 'glow', WIN_RISE); range('buff', sg * HW, sg * (HW + 0.28), SILL - 0.14, SILL, bayP(k) - WIN_W / 2 - 0.2, bayP(k) + WIN_W / 2 + 0.2); }
      for (const k of [1, 3]) fan(side, archHole(side, bayP(k), 0, 1.6, 1.9), 0.42, 'ink');
    } else {
      range('glow', sg * HW, sg * (HW + 0.08), SILL, 9.0, V_N + 8.4, pierP(BAYS));
    }
    for (let j = 0; j <= BAYS; j++) { // brick piers with stone caps
      const p = pierP(j), y0 = p < DECK_FROM ? 0 : BASE_H;
      range('brick', sg * HW, sg * (HW + 0.32), y0, 9.25, p - 0.7, p + 0.7);
      range('buff', sg * HW, sg * (HW + 0.4), 9.25, 9.6, p - 0.88, p + 0.88);
    }
    range('buff', sg * HW, sg * (HW + 0.3), 9.75, 10.1, V_N + 8.4, V_S);
    // the pent: a green copper eave flaring out below the roof
    const run = V_S - (V_N + 8.4);
    prism(side === 'east' ? frame([HW, 0, V_N + 8.4], [1, 0, 0]) : frame([-HW, 0, V_S], [-1, 0, 0]),
      [[-0.2, EAVE], [0, EAVE], [1.35, 9.95], [1.35, 9.8], [0, 10.05], [-0.2, 10.05]], run, 'copper');
    // the open lower storey: a dark recessed wall behind the colonnade
    range('ink', sg > 0 ? HW - 1.2 : -HW + 0.6, sg > 0 ? HW - 0.6 : -HW + 1.2, 0, BASE_H, DECK_FROM, V_S);
  }

  // --- Green awnings and the lit shopfronts of the lower storey (photographs) ---
  if (near) {
    const awning = (fr, y) => prism(fr, [[0, y], [1.3, y - 0.55], [1.3, y - 0.72], [0, y - 0.18]], 3.4, 'copper');
    for (const side of SIDES) {
      const sg = side === 'east' ? 1 : -1;
      for (let k = 0; k < BAYS; k++) {
        const p = bayP(k), onDeck = p > DECK_FROM;
        if (onDeck ? k % 2 === 1 : k === 2 || k === 4) awning(side === 'east' ? frame([HW, 0, p - 1.7], [1, 0, 0]) : frame([-HW, 0, p + 1.7], [-1, 0, 0]), onDeck ? BASE_H + 1.5 : 2.9);
        if (onDeck) range('glass', sg > 0 ? HW - 0.6 : -HW + 0.52, sg > 0 ? HW - 0.52 : -HW + 0.6, 0.4, BASE_H - 1.1, p - 1.7, p + 1.7);
      }
    }
    for (let k = 0; k < 9; k++) {
      const u = (k - 4) * MODULE;
      if (k % 2 === 1) awning(frame([u + 1.7, 0, V_S], [0, 0, 1]), BASE_H + 1.5);
      range('glass', u - 1.7, u + 1.7, 0.4, BASE_H - 1.1, V_S - 0.6, V_S - 0.52);
    }
  }

  // --- South (Esplanade) end: brick storey, big arched gable, sign --------
  {
    const holes = [];
    if (near) for (let k = 0; k < 9; k++) holes.push(archHole('south', (k - 4) * MODULE, SILL, WIN_W, SPRING - 0.4));
    panel('south', [[-HW, BASE_H], [HW, BASE_H], [HW, EAVE], [-HW, EAVE]], holes, 0.6, 0, 'brick');
    if (near) for (let k = 0; k < 9; k++) { furnish('south', (k - 4) * MODULE, SILL, WIN_W, SPRING - 0.4, 0.42); range('buff', (k - 4) * MODULE - WIN_W / 2 - 0.2, (k - 4) * MODULE + WIN_W / 2 + 0.2, SILL - 0.14, SILL, V_S, V_S + 0.28); }
    else range('glow', -HW + 1.4, HW - 1.4, SILL, 9.0, V_S, V_S + 0.08);
    for (let k = 1; k <= 8; k++) {
      const u = (k - 4.5) * MODULE;
      range('brick', u - 0.7, u + 0.7, BASE_H, 9.25, V_S, V_S + 0.32); range('buff', u - 0.88, u + 0.88, 9.25, 9.6, V_S, V_S + 0.4);
    }
    range('buff', -HW, HW, 9.75, 10.1, V_S, V_S + 0.3);
    prism(frame([HW + 1.35, 0, V_S], [0, 0, 1]), [[-0.2, EAVE], [0, EAVE], [1.35, 9.95], [1.35, 9.8], [0, 10.05], [-0.2, 10.05]], 2 * (HW + 1.35), 'copper');
    range('ink', -HW, HW, 0, BASE_H, V_S - 1.2, V_S - 0.6);
    // the arched gable in dark ribbed metal, set back behind the eave
    const arch = archPoints(near ? 24 : 10, -HW);
    panel('south', arch.map(([u, y]) => [u, y]), [], 0.5, 0.35, 'cladding');
    for (let i = 0; i < arch.length - 1; i++) stroke('south', A.south(arch[i][0]), arch[i][1] - 0.2, A.south(arch[i + 1][0]), arch[i + 1][1] - 0.2, 0.5, 0.3, 0.22, 'copper');
    stroke('south', -6.9, 14.3, 6.9, 14.3, 2.3, 0.14, 0.28, 'copper'); // sign board
    if (near) text('south', 'ST LAWRENCE MARKET', 0, 14.3 - 0.5, 1.0, 0.16, 'sign', 0.17, 0.1);
    else stroke('south', -5.6, 14.3, 5.6, 14.3, 0.55, 0.1, 0.16, 'sign');
  }

  // --- The deck and its colonnade -----------------------------------------
  {
    const top = BASE_H, bot = BASE_H - 0.55, ext = HW + DECK_OUT;
    for (const sg of [1, -1]) range('concrete', sg > 0 ? HW - 0.6 : -ext, sg > 0 ? ext : -HW + 0.6, bot, top, DECK_FROM, V_S + DECK_OUT);
    range('concrete', -ext, ext, bot, top, V_S - 0.6, V_S + DECK_OUT);
    const col = (u, v) => box('concrete', u, bot / 2, v, 0.55, bot, 0.55);
    const eu = ext - 0.3, ev = V_S + DECK_OUT - 0.3;
    for (const sg of [1, -1]) { for (let v = ev; v > DECK_FROM + 3; v -= 9.6) col(sg * eu, v); col(sg * eu, DECK_FROM + 0.3); }
    for (let k = 1; k < 5; k++) col(-eu + k * (2 * eu) / 5, ev);
    // railing round the outer edge
    const rail = (u0, v0, u1, v1) => {
      b.bar('copper', [u0, top + 1.0, v0], [u1, top + 1.0, v1], 0.07, 0.07, 0, false, 0);
      if (!near) return;
      b.bar('copper', [u0, top + 0.5, v0], [u1, top + 0.5, v1], 0.05, 0.05, 0, false, 0);
      const n = Math.max(1, Math.round(Math.hypot(u1 - u0, v1 - v0) / 1.5));
      for (let i = 0; i <= n; i++) box('copper', u0 + (u1 - u0) * i / n, top + 0.5, v0 + (v1 - v0) * i / n, 0.06, 1.0, 0.06);
    };
    const ru = ext - 0.06, rv = V_S + DECK_OUT - 0.06;
    rail(-ru, rv, ru, rv);
    for (const sg of [1, -1]) { rail(sg * ru, rv, sg * ru, DECK_FROM); rail(sg * ru, DECK_FROM, sg * (HW - 0.4), DECK_FROM); }
  }

  // --- Front Street (north) facade ----------------------------------------
  {
    const shoulder = archPoints(near ? 12 : 5, LANTERN_U);
    const outline = [[-HW, 0], [HW, 0], ...shoulder, [LANTERN_U, LANTERN_EAVE], [0, LANTERN_TOP], [-LANTERN_U, LANTERN_EAVE], ...shoulder.slice().reverse().map(([u, y]) => [-u, y])];
    const R = REMNANT, archH = (a) => archHole('north', a.u, 0, a.w, a.h - a.w / 2, near ? 10 : 5);
    const wingWin = [-16, -10.9, 10.9, 16], wing = { w: 3.6, b0: SILL, spring: 8.0 };
    const holes = R.arches.map(archH);
    if (near) {
      for (const u of wingWin) { holes.push(archHole('north', u, wing.b0, wing.w, wing.spring)); holes.push(archHole('north', u, 0, 1.9, 2.0)); }
    }
    panel('north', outline, holes, 0.6, 0, 'brick');
    for (const a of R.arches) fan('north', archH(a), 0.72, 'ink');
    if (near) for (const u of wingWin) { furnish('north', u, wing.b0, wing.w, wing.spring, 0.42); fan('north', archHole('north', u, 0, 1.9, 2.0), 0.42, 'ink'); }
    else for (const u of wingWin) range('glow', u - 1.6, u + 1.6, wing.b0, 9.0, V_N - 0.08, V_N);
    for (let i = 0; i < shoulder.length - 1; i++) for (const sg of [1, -1]) {
      stroke('north', sg * shoulder[i][0], shoulder[i][1] - 0.2, sg * shoulder[i + 1][0], shoulder[i + 1][1] - 0.2, 0.45, 0.3, -0.05, 'copper');
    }
    for (const sg of [1, -1]) stroke('north', sg * LANTERN_U, LANTERN_EAVE - 0.15, 0, LANTERN_TOP - 0.15, 0.45, 0.3, -0.05, 'copper');

    // the 1845 City Hall centre block: stone arcade, red brick, buff pilasters, two window rows
    const r = R.halfWidth, c0 = -R.proud;
    panel('north', [[-r, 0], [r, 0], [r, R.baseTop], [-r, R.baseTop]], R.arches.map(archH), R.proud, c0, 'buff');
    const winHoles = [];
    if (near) for (const u of R.windowCols) for (const [y0, y1] of R.rows) winHoles.push(rectHole('north', u - 0.55, u + 0.55, y0, y1));
    panel('north', [[-r, R.baseTop], [r, R.baseTop], [r, R.top], [-r, R.top]], winHoles, R.proud, c0, 'brick');
    if (near) for (const u of R.windowCols) for (const [y0, y1] of R.rows) {
      fan('north', rectHole('north', u - 0.55, u + 0.55, y0, y1), -0.15, 'glass');
      stroke('north', A.north(u), y0, A.north(u), y1, 0.08, 0.1, -0.24, 'concrete'); stroke('north', A.north(u) - 0.55, (y0 + y1) / 2, A.north(u) + 0.55, (y0 + y1) / 2, 0.08, 0.1, -0.24, 'concrete');
      range('buff', u - 0.7, u + 0.7, y0 - 0.14, y0, V_N - R.proud - 0.16, V_N - R.proud);
    } else for (const [y0, y1] of R.rows) range('glass', -r + 0.9, r - 0.9, y0, y1, V_N - R.proud - 0.08, V_N - R.proud);
    for (const u of R.pilasters) range('buff', u - 0.5, u + 0.5, R.baseTop, R.top, V_N - R.proud - 0.14, V_N - R.proud);
    range('buff', -r - 0.1, r + 0.1, R.baseTop - 0.15, R.baseTop + 0.15, V_N - R.proud - 0.18, V_N - R.proud);
    range('buff', -r - 0.1, r + 0.1, 8.5, 8.75, V_N - R.proud - 0.14, V_N - R.proud);
    range('buff', -r - 0.2, r + 0.2, R.top, R.top + 0.4, V_N - R.proud - 0.7, V_N - R.proud + 0.2);
    box('ink', 0, 13.0, V_N - R.proud - 0.1, 13.3, 1.3, 0.2); // sign board on the cornice
    if (near) text('north', 'ST LAWRENCE MARKET', 0, 13.0 - 0.42, 0.84, -(R.proud + 0.2) - 0.05, 'sign', 0.17, 0.1);
    else box('sign', 0, 13.0, V_N - R.proud - 0.22, 9.6, 0.42, 0.06);
    for (const ch of R.chimneys) { // two brick stacks on the gable
      const y0 = 19.9;
      box('brick', ch.u, (y0 + ch.top) / 2, V_N + 0.7, 1.5, ch.top - y0, 1.3); box('concrete', ch.u, ch.top + 0.12, V_N + 0.7, 1.95, 0.25, 1.75);
      if (near && ch.u < 0) box('concrete', ch.u, ch.top + 0.7, V_N + 0.7, 0.34, 1.0, 0.34);
    }
  }

  // --- Corner pavilions with the pedimented entrances ---------------------
  for (const side of SIDES) {
    const sg = side === 'east' ? 1 : -1, p0 = V_N - 0.4, p1 = p0 + PAVILION_LEN, mid = (p0 + p1) / 2, cw = -PAVILION_PROUD;
    const win = { b0: 3.6, w: 3.4, spring: 6.3 }, door = { w: 2.0, spring: 1.7 };
    panel(side, [[p0, 0], [p1, 0], [p1, EAVE], [p0, EAVE]], [archHole(side, mid, win.b0, win.w, win.spring), archHole(side, mid, 0, door.w, door.spring)], PAVILION_PROUD + 0.6, cw, 'brick');
    furnish(side, mid, win.b0, win.w, win.spring, cw + 0.5);
    fan(side, archHole(side, mid, 0, door.w, door.spring), cw + 0.5, 'ink');
    range('brick', sg > 0 ? 19.8 : -HW, sg > 0 ? HW : -19.8, 0, EAVE, V_N - 0.4, V_N); // the pavilion's return on the facade
    range('roof', sg > 0 ? 19.8 : -HW, sg > 0 ? HW : -19.8, EAVE, EAVE + 0.12, V_N - 0.4, V_N);
    const outer = HW + PAVILION_PROUD + 0.55;
    range('plaster', sg > 0 ? HW + PAVILION_PROUD - 0.45 : -outer, sg > 0 ? outer : -HW - PAVILION_PROUD + 0.45, 8.6, EAVE, p0 - 0.3, p1 + 0.3); // fascia board
    range('copper', sg > 0 ? HW + PAVILION_PROUD - 0.45 : -outer - 0.07, sg > 0 ? outer + 0.07 : -HW - PAVILION_PROUD + 0.45, EAVE - 0.16, EAVE, p0 - 0.32, p1 + 0.32);
    range('copper', sg > 0 ? HW + PAVILION_PROUD - 0.45 : -outer - 0.07, sg > 0 ? outer + 0.07 : -HW - PAVILION_PROUD + 0.45, 8.6, 8.76, p0 - 0.32, p1 + 0.32);
    if (near) text(side, 'ST LAWRENCE MARKET', A[side](mid), 8.76 + 0.34, 0.55, -(outer - HW) - 0.05, 'ink', 0.17, 0.1);
    else range('ink', sg > 0 ? outer : -outer - 0.05, sg > 0 ? outer + 0.05 : -outer, 9.4, 9.9, p0 + 0.6, p1 - 0.6);
    // the pediment: a gabled roof running back into the hall roof, green tympanum
    const fr = frame([sg * outer, 0, mid], [0, 0, sg]);
    prism(fr, [[-4.4, EAVE], [4.4, EAVE], [0, 13.4]], outer - 16.5, 'roof');
    prism(fr, [[-3.9, EAVE + 0.32], [3.9, EAVE + 0.32], [0, 13.05]], 0.12, 'copper', -0.12);
    if (near) { const d = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 14); d.rotateZ(Math.PI / 2); d.translate(sg * (outer + 0.16), 11.55, mid); put(d, 'concrete'); }
  }

  const root = b.finish();
  root.rotation.y = PHI;
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  root.userData.elevationDatum = 'Local grade y=0 on the flat map; lower storey drawn as a solid base (north half) and an open colonnade (south half).';
  return root;
}
