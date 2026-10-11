import { hash01 } from './scotia-plaza-mesh.js';
import { ROOF_Y, FLOOR, LOBBY_Y } from './scotia-plaza-site.js';

// Edges of a polygon with their outward normals (u, v). Winding is detected, not assumed.
export function polyEdges(poly) {
  let area = 0;
  for (let i = 0; i < poly.length; i++) { const [u1, v1] = poly[i], [u2, v2] = poly[(i + 1) % poly.length]; area += u1 * v2 - u2 * v1; }
  const s = area >= 0 ? 1 : -1;
  return poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length], dx = b[0] - a[0], dv = b[1] - a[1], len = Math.hypot(dx, dv);
    return { a, b, len, t: [dx / len, dv / len], n: [s * dv / len, -s * dx / len] };
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

// Office floors: 66 rows counted down from the roof on a 3.95 m pitch, so every step of the
// chevron and the roof land on a row boundary, plus one tall lobby row at the foot.
export const officeRows = (yLo, yHi) => {
  const rows = [];
  if (yLo < 0.5) rows.push({ y0: 0, y1: LOBBY_Y, sill: 1.2, head: 11.6 });
  for (let k = 65; k >= 0; k--) {
    const y1 = ROOF_Y - k * FLOOR, y0 = y1 - FLOOR;
    if (y0 >= yLo - 1e-6 && y1 <= yHi + 1e-6 && y0 >= LOBBY_Y - 1e-6) rows.push({ y0, y1, sill: y0 + 0.85, head: y0 + 0.85 + 2.2 });
  }
  return rows;
};

// Evenly pitched rows over [yLo, yHi] with a window that is `fill` of the pitch, for the heritage building.
export function evenRows(yLo, yHi, pitchTarget, fill = 0.56, sillFrac = 0.22) {
  const n = Math.max(1, Math.round((yHi - yLo) / pitchTarget)), p = (yHi - yLo) / n, rows = [];
  for (let k = 0; k < n; k++) { const y0 = yLo + k * p; rows.push({ y0, y1: y0 + p, sill: y0 + p * sillFrac, head: y0 + p * (sillFrac + fill) }); }
  return rows;
}

/**
 * A wall of recessed windows in a lattice of masonry piers and spandrels.
 *   near: the outer plane is the mapped wall line (r = 0); piers and spandrels are quads on it,
 *         each window has its left and right reveals `rd` deep (sills and heads are sub-pixel at driving range
 *         and left out unless `reveals` asks for them) and one glass quad behind the whole wall.
 *   far:  one wall quad just behind the mapped line and one flat glass quad per two windows and two floors in front of it.
 * `a`,`b` are the wall's ends (u, v), `n` its outward normal. Rows are {y0,y1,sill,head}.
 */
export function wall(M, near, o) {
  const { a, b, n, rows, yLo, yHi, mat = 'granite', bay = 2.95, winMin = 1.2, winMax = 2.2, winFrac = 0.55, rd = 0.9, tag = 0, lit = near ? 0.13 : 0.10, solid = false, reveals = 'lr' } = o;
  const dx = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(dx, dv);
  if (L < 1e-3) return;
  const t = [dx / L, dv / L], N = [n[0], 0, n[1]], T = [t[0], 0, t[1]];
  const P = (s, y, r) => [a[0] + t[0] * s + n[0] * r, y, a[1] + t[1] * s + n[1] * r];
  const wallQ = M.get(mat), glass = M.get('glass'), glow = M.get('glow');
  if (solid || L < 1.8 || !rows.length) { wallQ.quad(P(0, yLo, 0), P(L, yLo, 0), P(L, yHi, 0), P(0, yHi, 0), N); return; }
  const nb = Math.max(1, Math.round(L / bay)), pitch = L / nb;
  const ww = Math.min(winMax, Math.max(winMin, pitch * winFrac));
  const win = (j) => { const c = (j + 0.5) * pitch; return [c - ww / 2, c + ww / 2]; };
  if (!near) {
    wallQ.quad(P(0, yLo, -0.06), P(L, yLo, -0.06), P(L, yHi, -0.06), P(0, yHi, -0.06), N);
    // One glass quad per two bays and two floors, twice the window width and height: the same glass-to-granite
    // ratio at a quarter of the cost (a floor is 3 px at 500 m). A lobby or odd row stays alone.
    for (let ri = 0; ri < rows.length; ri++) {
      const r = rows[ri], r2 = rows[ri + 1], twin = r2 && Math.abs((r.y1 - r.y0) - (r2.y1 - r2.y0)) < 1e-3 && Math.abs(r.y1 - r2.y0) < 1e-3;
      const yc = twin ? (r.y0 + r2.y1) / 2 : (r.sill + r.head) / 2, hh = twin ? r.head - r.sill : (r.head - r.sill) / 2;
      for (let j = 0; j < nb; j += 2) {
        const pair = j + 1 < nb, c = pair ? (j + 1) * pitch : (j + 0.5) * pitch, h = pair ? ww : ww / 2;
        (hash01(tag, ri, j) < lit ? glow : glass).quad(P(c - h, yc - hh, 0), P(c + h, yc - hh, 0), P(c + h, yc + hh, 0), P(c - h, yc + hh, 0), N);
      }
      if (twin) ri++;
    }
    return;
  }
  // Spandrels: full-width bands between window heads and the next sill, and above/below the first/last window.
  const bands = [];
  let y = yLo;
  for (const row of rows) { bands.push([y, row.sill]); y = row.head; }
  bands.push([y, yHi]);
  for (const [y0, y1] of bands) if (y1 - y0 > 1e-4) wallQ.quad(P(0, y0, 0), P(L, y0, 0), P(L, y1, 0), P(0, y1, 0), N);
  // One glass quad for the whole wall at the back of the reveals: the piers and spandrels hide all but the windows,
  // so a quad per row (4 000 of them) was pure cost. A lit window is a warm quad 8 cm in front of it.
  glass.quad(P(0, rows[0].sill, -rd), P(L, rows[0].sill, -rd), P(L, rows[rows.length - 1].head, -rd), P(0, rows[rows.length - 1].head, -rd), N);
  rows.forEach((row, ri) => {
    // Piers between windows.
    for (let i = 0; i <= nb; i++) {
      const s0 = i === 0 ? 0 : win(i - 1)[1], s1 = i === nb ? L : win(i)[0];
      if (s1 - s0 > 1e-4) wallQ.quad(P(s0, row.sill, 0), P(s1, row.sill, 0), P(s1, row.head, 0), P(s0, row.head, 0), N);
    }
    for (let j = 0; j < nb; j++) {
      const [w0, w1] = win(j);
      if (reveals.includes('l')) wallQ.quad(P(w0, row.sill, 0), P(w0, row.sill, -rd), P(w0, row.head, -rd), P(w0, row.head, 0), T);                       // left reveal
      if (reveals.includes('r')) wallQ.quad(P(w1, row.sill, 0), P(w1, row.sill, -rd), P(w1, row.head, -rd), P(w1, row.head, 0), [-T[0], 0, -T[2]]);     // right reveal
      if (reveals.includes('s')) wallQ.quad(P(w0, row.sill, 0), P(w1, row.sill, 0), P(w1, row.sill, -rd), P(w0, row.sill, -rd), [0, 1, 0]);             // sill
      if (reveals.includes('h')) wallQ.quad(P(w0, row.head, 0), P(w1, row.head, 0), P(w1, row.head, -rd), P(w0, row.head, -rd), [0, -1, 0]);            // head
      if (hash01(tag, ri, j) < lit) glow.quad(P(w0, row.sill, -rd + 0.08), P(w1, row.sill, -rd + 0.08), P(w1, row.head, -rd + 0.08), P(w0, row.head, -rd + 0.08), N);
    }
  });
}
