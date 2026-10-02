import { hash01 } from './suncor-energy-centre-mesh.js';

// Edges of a plan polygon (x, z) with outward unit normals. Winding is detected, not assumed.
export function polyEdges(poly) {
  let area = 0;
  for (let i = 0; i < poly.length; i++) { const [x1, z1] = poly[i], [x2, z2] = poly[(i + 1) % poly.length]; area += x1 * z2 - x2 * z1; }
  const s = area >= 0 ? 1 : -1;
  return poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length], dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    return { a, b, len, t: [dx / len, dz / len], n: [s * dz / len, -s * dx / len] };
  });
}

export function pointInPoly([x, z], poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[j], [bx, bz] = poly[i];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) inside = !inside;
  }
  return inside;
}

// The polygon moved inward by d: vertex i is the corner between edge i-1 and edge i, so edge i of the
// inset runs from inset[i] to inset[i+1] exactly as it does in the outline.
export function insetPoly(poly, d) {
  const E = polyEdges(poly), n = poly.length;
  return poly.map((p, i) => {
    const e0 = E[(i + n - 1) % n], e1 = E[i];
    const det = e0.n[0] * e1.n[1] - e0.n[1] * e1.n[0];
    if (Math.abs(det) < 1e-6) return [p[0] - e1.n[0] * d, p[1] - e1.n[1] * d];
    const r0 = e0.n[0] * p[0] + e0.n[1] * p[1] - d, r1 = e1.n[0] * p[0] + e1.n[1] * p[1] - d;
    return [(r0 * e1.n[1] - r1 * e0.n[1]) / det, (e0.n[0] * r1 - e1.n[0] * r0) / det];
  });
}

// Office rows from `base` upward on a `pitch`: a window of `win` m on a `sill` m sill. Far replaces the floors by a few
// ribbon strips (one per ~8 floors: six on the west tower, four on the east, one on the block), each with the near window's
// glass share (sill at 20 % of its slot, head at 72 %): the dark-and-granite banding survives at 800 m for a fraction of the
// quads (three strips per tower were cheaper still, but read as a different building).
export function officeRows(base, pitch, count, near, { sill = 0.78, win = 2.05 } = {}) {
  const rows = [];
  if (!near) {
    const slots = Math.max(1, Math.round(count / 8)), slot = (count * pitch) / slots;
    for (let k = 0; k < slots; k++) {
      const y0 = base + k * slot;
      rows.push({ sill: y0 + slot * (sill / pitch), head: y0 + slot * ((sill + win) / pitch), y0, y1: y0 + slot });
    }
    return rows;
  }
  for (let k = 0; k < count; k++) {
    const y0 = base + k * pitch;
    rows.push({ sill: y0 + sill, head: y0 + sill + win, y0, y1: y0 + pitch });
  }
  return rows;
}

// Convex region y1 <= y <= min(y2, top(s)) over s in [s0, s1] as [s, y] vertices, or null when top(s) never clears y1.
function clip(s0, s1, y1, y2, top) {
  let a = s0, b = s1, ta = top(s0), tb = top(s1);
  if (ta <= y1 + 1e-6 && tb <= y1 + 1e-6) return null;
  if (ta < y1) { a = s0 + (s1 - s0) * (y1 - ta) / (tb - ta); ta = y1; } else if (tb < y1) { b = s0 + (s1 - s0) * (y1 - ta) / (tb - ta); tb = y1; }
  if (b - a < 1e-4) return null;
  const v = [[a, y1], [b, y1], [b, Math.min(y2, tb)]];
  if ((ta - y2) * (tb - y2) < 0) v.push([a + (b - a) * (y2 - ta) / (tb - ta), y2]);
  v.push([a, Math.min(y2, ta)]);
  return v;
}

/**
 * One wall of granite spandrels and corner piers, with recessed dark glass behind the window runs.
 *   a, b      wall ends (x, z), n its outward normal; inA, inB the same ends on the inset outline (the glass plane)
 *   topAt     y of the roof at a plan point (flat or the sloped plane); the wall is cut by it
 *   rows      [{ sill, head, lit? }] windows; yLo the bottom of the wall (above a podium where one hides the foot)
 *   near      full rhythm (3 m bays, piers as proud fins, lit windows); far has 12 m bays and a few ribbon strips
 * A window exists where its head clears the roof line by 0.5 m, so the top floors step down with the slope.
 */
export function wall(M, near, o) {
  const { a, b, n, inA, inB, topAt, rows, yLo, tag = 0, lit = 0.2, solid = false } = o;
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
  if (L < 1e-3) return;
  const t = [dx / L, dz / L], N = [n[0], 0, n[1]];
  const P = (s, y, r) => [a[0] + t[0] * s + n[0] * r, y, a[1] + t[1] * s + n[1] * r];
  const top = (s) => topAt(a[0] + t[0] * s, a[1] + t[1] * s);
  const granite = M.get('granite');
  const emit = (v, r = 0) => { if (v) granite.poly(v.map(([s, y]) => P(s, y, r)), N); };
  const cw = Math.min(0.5, L / 4);
  // Glass on the inset outline. Every wall carries it, even where granite hides it, so that a window next to a
  // corner never opens onto a neighbour with no glass behind it (a grazing view would slip past the corner pier).
  // Where a low block hides the foot of the wall (yLo > 0) the glass runs down to grade for the same reason.
  const glassOn = (yBottom) => {
    const gv = clip(0, L, yBottom, Infinity, (s) => top(s) - 0.5);
    if (gv && inA && inB) M.get('glass').poly(gv.map(([s, y]) => [inA[0] + (inB[0] - inA[0]) * s / L, y, inA[1] + (inB[1] - inA[1]) * s / L]), N);
  };
  if (solid || L < 2.4 || !rows.length) { emit(clip(0, L, yLo, Infinity, top)); glassOn(yLo > 0 ? 0 : yLo); return; }

  // Far: 12 m bays only so a strip can stop where the roof falls; no piers between them, the strips run on
  const bay = near ? 3.05 : 12.2, pw = near ? 0.32 : 0;
  const nb = Math.max(1, Math.round(L / bay)), pitch = L / nb;
  // Which bays carry which rows: the head must clear the lower end of the bay's roof line by 0.5 m.
  const runs = rows.map((r) => {
    let j0 = -1, j1 = -1;
    if (r.sill >= yLo + 0.3) for (let j = 0; j < nb; j++) if (r.head + 0.5 <= Math.min(top(j * pitch), top((j + 1) * pitch))) { if (j0 < 0) j0 = j; j1 = j; }
    if (j0 < 0) return null;
    const g0 = Math.max(cw, j0 * pitch + pw / 2), g1 = Math.min(L - cw, (j1 + 1) * pitch - pw / 2);
    return g1 - g0 > 0.4 ? { j0, j1, g0, g1 } : null;
  });
  const kf = runs.findIndex(Boolean);
  if (kf < 0) { emit(clip(0, L, yLo, Infinity, top)); glassOn(yLo > 0 ? 0 : yLo); return; }

  // Corner piers run the full height; between them the wall is spandrels and the solid ends of partial rows.
  emit(clip(0, cw, yLo, Infinity, top)); emit(clip(L - cw, L, yLo, Infinity, top));
  emit(clip(cw, L - cw, yLo, rows[kf].sill, top));
  rows.forEach((r, k) => {
    const run = runs[k];
    if (!run) return;
    if (run.g0 - cw > 0.05) emit(clip(cw, run.g0, r.sill, r.head, top));
    if (L - cw - run.g1 > 0.05) emit(clip(run.g1, L - cw, r.sill, r.head, top));
    emit(clip(cw, L - cw, r.head, runs[k + 1] ? rows[k + 1].sill : Infinity, top));
  });

  // The glass: one quad on the inset outline behind all the windows, cut 0.5 m under the roof line.
  glassOn(yLo > 0 ? 0 : rows[kf].sill - 0.05);

  // Piers between neighbouring windows stand 15 cm proud of the spandrels, one quad per boundary.
  if (near) {
    for (let i = 1; i < nb; i++) {
      let lo = Infinity, hi = -Infinity;
      rows.forEach((r, k) => { const run = runs[k]; if (run && run.j0 <= i - 1 && run.j1 >= i) { lo = Math.min(lo, r.sill); hi = Math.max(hi, r.head); } });
      if (hi > lo) M.get('granite').quad(P(i * pitch - pw / 2, lo, 0.15), P(i * pitch + pw / 2, lo, 0.15), P(i * pitch + pw / 2, hi, 0.15), P(i * pitch - pw / 2, hi, 0.15), N);
    }
  }

  // Lit windows: a warm quad 7 cm in front of the glass, so by night a share of the floors glow.
  const glow = M.get('glow');
  rows.forEach((r, k) => {
    const run = runs[k];
    if (!run) return;
    for (let j = run.j0; j <= run.j1; j++) {
      if (hash01(tag, k, j) >= (r.lit ?? lit)) continue;
      const s0 = Math.max(run.g0, j * pitch + pw / 2 + 0.1), s1 = Math.min(run.g1, (j + 1) * pitch - pw / 2 - 0.1);
      if (s1 - s0 > 0.3) glow.quad(P(s0, r.sill + 0.1, -0.08), P(s1, r.sill + 0.1, -0.08), P(s1, r.head - 0.1, -0.08), P(s0, r.head - 0.1, -0.08), N);
    }
  });
}
