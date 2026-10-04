import { TAU, polar, area, outward, wall, cap, prism, column, bar, inPoly } from './casino-de-montreal-mesh.js';
import {
  Y, R, TERRACE_OUT, TERRACE_ARC, DECK_K, DECK_PITCH, DECK_Y0, DECK_T, CANOPY, MUSHROOM, SHAFTS, LINK, CORRIDOR, WEDGE, wedgeY, W0, WU, WL,
} from './casino-de-montreal-site.js';
import { shaftPoly } from './casino-de-montreal-drum.js';

// Everything round the drum except the Québec pavilion: the west terrace tower, the concrete shaft stack, the entrance
// canopy and mushroom, the low link block with its corridor, and the south-east ramp.

/** The outline of deck k: the outer edge pulled toward the drum by k / DECK_K, closed by an arc on the drum's rim. */
function deckPoly(k, inset = 0) {
  const out = TERRACE_OUT.map(([x, z]) => {
    const d = Math.hypot(x, z), f = (R - 0.1 + (d - R + 0.1) * (1 - k / DECK_K) - inset) / d;
    return [x * f, z * f];
  });
  const a0 = TERRACE_ARC[0], a1 = TERRACE_ARC[1], n = 9, rim = [];
  for (let i = 0; i <= n; i++) rim.push(polar(R - 0.1, a1 + (a0 - a1) * i / n)); // from the north end back round to the south end
  const first = polar(R - 0.1, a0);
  return { poly: [first, ...out, ...rim.slice(0, -1)], outerCount: out.length + 1 };
}

/** White piers every ~`pitch` m on a glazed wall a->b (flat 0.6 m strips standing 0.12 m proud of the glass), under the white band above. */
function piers(soup, a, b, y0, y1, sa, pitch = 6) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = outward(a, b, sa), count = Math.max(1, Math.round(l / pitch)), tx = (b[0] - a[0]) / l, tz = (b[1] - a[1]) / l;
  for (let k = 0; k < count; k++) {
    const u = (k / count) * l, cx = a[0] + tx * u + n[0] * 0.12, cz = a[1] + tz * u + n[1] * 0.12, w = 0.3;
    soup.quad([cx - tx * w, y0, cz - tz * w], [cx + tx * w, y0, cz + tz * w], [cx + tx * w, y1, cz + tz * w], [cx - tx * w, y1, cz - tz * w], [cx + n[0] * 5, (y0 + y1) / 2, cz + n[1] * 5]);
  }
}

export function buildWings(S, near) {
  const conc = S('concrete'), glass = S('glass'), alu = S('alu'), glow = S('glow'), roof = S('roof');

  // ---- terrace tower: six decks stepping in and up, a dark glazed ground floor below the lowest, columns, parapets.
  const g0 = deckPoly(0, 1.5);
  const gs = area(g0.poly);
  for (let i = 0; i < g0.outerCount; i++) wall(glass, g0.poly[i], g0.poly[i + 1], 0, DECK_Y0 - 0.2, gs); // outer edges only
  for (let k = 0; k < DECK_K; k++) {
    const { poly, outerCount } = deckPoly(k), y0 = DECK_Y0 + k * DECK_PITCH, y1 = y0 + DECK_T;
    prism(conc, poly, y0, y1, { top: true, bottom: true, topSoup: roof, sides: (i) => i < outerCount });
    if (near) {
      // parapet: a thin wall 0.12 m inside the deck's edge
      const sa = area(poly);
      for (let i = 0; i + 1 < outerCount; i++) {
        const a = poly[i], b = poly[i + 1], n = outward(a, b, sa);
        const pa = [a[0] - n[0] * 0.12, a[1] - n[1] * 0.12], pb = [b[0] - n[0] * 0.12, b[1] - n[1] * 0.12];
        const qa = [a[0] - n[0] * 0.36, a[1] - n[1] * 0.36], qb = [b[0] - n[0] * 0.36, b[1] - n[1] * 0.36];
        const top = y1 + 0.95, mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
        alu.quad([pa[0], y1, pa[1]], [pb[0], y1, pb[1]], [pb[0], top, pb[1]], [pa[0], top, pa[1]], [mx + n[0] * 5, y1 + 0.5, mz + n[1] * 5]);
        alu.quad([pa[0], top, pa[1]], [pb[0], top, pb[1]], [qb[0], top, qb[1]], [qa[0], top, qa[1]], [mx, top + 5, mz]);
        alu.quad([qa[0], y1, qa[1]], [qb[0], y1, qb[1]], [qb[0], top, qb[1]], [qa[0], top, qa[1]], [mx - n[0] * 5, y1 + 0.5, mz - n[1] * 5]);
      }
      // columns under the deck's outer edge, from the deck below (or the ground) up to its soffit
      const below = k === 0 ? 0 : y0 - DECK_PITCH + DECK_T;
      for (let i = 0; i < outerCount; i += 2) {
        const p = poly[i], d = Math.hypot(p[0], p[1]), f = (d - 1.2) / d;
        column(alu, p[0] * f, p[1] * f, 0.4, 0.4, below, y0, 8);
      }
    }
  }

  // ---- shaft stack
  for (const sh of SHAFTS) {
    const poly = shaftPoly(sh), top = sh[4];
    prism(conc, poly, 0, top, { topSoup: roof });
    if (near) { // two dark window slits on the face away from the drum, and one on the side
      const sa = area(poly);
      for (const [i, ts] of [[1, 0.3], [1, 0.7], [2, 0.5]]) {
        const a = poly[i], b = poly[(i + 1) % 4], n = outward(a, b, sa), w = 0.55;
        for (const t of [ts]) {
          const cx = a[0] + (b[0] - a[0]) * t + n[0] * 0.08, cz = a[1] + (b[1] - a[1]) * t + n[1] * 0.08;
          const l = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / l * w / 2, uz = (b[1] - a[1]) / l * w / 2;
          glass.quad([cx - ux, top * 0.2, cz - uz], [cx + ux, top * 0.2, cz + uz], [cx + ux, top * 0.82, cz + uz], [cx - ux, top * 0.82, cz - uz], [cx + n[0] * 5, top * 0.5, cz + n[1] * 5]);
        }
      }
    }
  }
  // two antennas on the tallest shafts
  { const p = shaftPoly(SHAFTS[0]); const cx = (p[0][0] + p[2][0]) / 2, cz = (p[0][1] + p[2][1]) / 2;
    column(alu, cx, cz, 0.18, 0.06, SHAFTS[0][4], SHAFTS[0][4] + 5, 4, true);
    const q = shaftPoly(SHAFTS[1]); column(alu, (q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, 0.16, 0.05, SHAFTS[1][4], SHAFTS[1][4] + 3.5, 4, true); }

  // ---- entrance canopy: a flat white slab on the triangle, a lit leading edge, a fin wall at its tip and columns
  const ca = Y.canopy - 1.0, cb = Y.canopy;
  prism(alu, CANOPY, ca, cb, { top: true, bottom: true, topSoup: roof });
  { // lit edge under the long free side (from the tip to the west corner)
    const a0 = CANOPY[0], b0 = CANOPY[CANOPY.length - 1], sa = area(CANOPY), n = outward(b0, a0, sa);
    const el = Math.hypot(b0[0] - a0[0], b0[1] - a0[1]), ex = (b0[0] - a0[0]) / el, ez = (b0[1] - a0[1]) / el;
    const a = [a0[0] + ex * 1.2, a0[1] + ez * 1.2], b = [b0[0] - ex * 1.2, b0[1] - ez * 1.2]; // keep the strip inside the slab's corners
    const bx = [a, b], d = 0.45;
    const P = (p, y, off) => [p[0] + n[0] * off, y, p[1] + n[1] * off];
    glow.quad(P(bx[0], ca - 0.3, -d), P(bx[1], ca - 0.3, -d), P(bx[1], ca - 0.3, d), P(bx[0], ca - 0.3, d), [0, -10, 0]);
    glow.quad(P(bx[0], ca - 0.3, d), P(bx[1], ca - 0.3, d), P(bx[1], ca, d), P(bx[0], ca, d), [(a[0] + b[0]) / 2 + n[0] * 5, ca, (a[1] + b[1]) / 2 + n[1] * 5]);
  }
  { // the white fin wall under the east edge at the tip: a triangle in elevation, tallest at the tip, thin, set 0.7 m in
    const a = CANOPY[0], b = CANOPY[2], t = 0.7, yB = 3.2;
    const A0 = [a[0], a[1]], B0 = [b[0], b[1]], A1 = [a[0] - t, a[1]], B1 = [b[0] - t, b[1]];
    const P = (p, y) => [p[0], y, p[1]], east = [60, 4, -58], west = [-60, 4, -58];
    alu.quad(P(A0, 0), P(B0, 0), P(B0, yB), P(A0, ca), east);
    alu.quad(P(A1, 0), P(B1, 0), P(B1, yB), P(A1, ca), west);
    alu.quad(P(A0, ca), P(B0, yB), P(B1, yB), P(A1, ca), [a[0], ca + 20, a[1]]);
    alu.quad(P(A0, 0), P(A1, 0), P(A1, ca), P(A0, ca), [a[0], 4, a[1] - 20]);
    alu.quad(P(B0, 0), P(B1, 0), P(B1, yB), P(B0, yB), [b[0], 1, b[1] + 20]);
  }
  if (near) for (const [x, z] of [[22.0, -57.5], [21.4, -45.0], [20.4, -37.0], [19.4, -30.0], [-2.0, -45.0]]) column(alu, x, z, 0.5, 0.5, 0, ca, 8);

  // ---- mushroom canopy (the glass-roofed entrance umbrella)
  {
    const { x, z, r } = MUSHROOM, n = near ? 16 : 10;
    column(alu, x, z, near ? 0.95 : 1.0, near ? 0.7 : 0.8, 0, 5.4, near ? 10 : 6);
    for (let i = 0; i < n; i++) {
      const t0 = i / n * TAU, t1 = (i + 1) / n * TAU, tm = (t0 + t1) / 2;
      glass.tri([x, 7.5, z], [x + r * Math.cos(t0), 6.6, z + r * Math.sin(t0)], [x + r * Math.cos(t1), 6.6, z + r * Math.sin(t1)], [x, 20, z]);
      alu.quad([x + r * Math.cos(t0), 6.3, z + r * Math.sin(t0)], [x + r * Math.cos(t1), 6.3, z + r * Math.sin(t1)], [x + r * Math.cos(t1), 6.6, z + r * Math.sin(t1)], [x + r * Math.cos(t0), 6.6, z + r * Math.sin(t0)], [x + (r + 5) * Math.cos(tm), 6.45, z + (r + 5) * Math.sin(tm)]);
      alu.tri([x + 0.8 * Math.cos(t0), 5.4, z + 0.8 * Math.sin(t0)], [x + r * Math.cos(t0), 6.3, z + r * Math.sin(t0)], [x + r * Math.cos(t1), 6.3, z + r * Math.sin(t1)], [x, -10, z]);
    }
    if (near) for (let i = 0; i < 8; i++) { // curved ribs under the umbrella
      const t = (i + 0.3) / 8 * TAU, c = Math.cos(t), s = Math.sin(t), P = (rr, y) => [x + rr * c, y, z + rr * s];
      bar(alu, P(0.6, 5.2), P(3.0, 5.9), 0.3, 0.25, [0, 1, 0]);
      bar(alu, P(3.0, 5.9), P(r - 0.2, 6.25), 0.3, 0.25, [0, 1, 0]);
    }
  }

  // ---- link block: glazed ground floor, white fascia, flat roof and parapet
  const ls = area(LINK);
  const corridorEdge = (i) => { const a = LINK[i], b = LINK[(i + 1) % LINK.length]; return Math.abs(a[1] - 57.2) < 1 && Math.abs(b[1] - 57.2) < 1 && a[0] < -9 && b[0] < -9 && a[0] > -22 && b[0] > -22; };
  const insideDrum = (i) => { const a = LINK[i], b = LINK[(i + 1) % LINK.length]; return Math.hypot(a[0], a[1]) < 30 && Math.hypot(b[0], b[1]) < 30; };
  for (let i = 0; i < LINK.length; i++) {
    if (corridorEdge(i) || insideDrum(i)) continue;
    wall(glass, LINK[i], LINK[(i + 1) % LINK.length], 0, 5.3, ls);
    wall(conc, LINK[i], LINK[(i + 1) % LINK.length], 5.3, Y.podium, ls);
    piers(alu, LINK[i], LINK[(i + 1) % LINK.length], 0, 5.3, ls);
  }
  cap(roof, LINK, Y.podium);
  prism(glass, CORRIDOR, 0, 5.3, { top: false, sides: (i) => i === 1 || i === 3 });
  prism(conc, CORRIDOR, 5.3, Y.podium, { top: false, sides: (i) => i === 1 || i === 3 });
  for (const i of [1, 3]) piers(alu, CORRIDOR[i], CORRIDOR[(i + 1) % 4], 0, 5.3, area(CORRIDOR));
  cap(roof, CORRIDOR, Y.podium);

  // ---- south-east wedge: a solid ramp coming down to grade at its tip, with stairs scored into its top
  {
    const sa = area(WEDGE);
    for (let i = 0; i < WEDGE.length; i++) {
      const a = WEDGE[i], b = WEDGE[(i + 1) % WEDGE.length];
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.5) continue;
      const n = outward(a, b, sa), mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      conc.quad([a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], wedgeY(b[0], b[1]), b[1]], [a[0], wedgeY(a[0], a[1]), a[1]], [mx + n[0] * 5, 4, mz + n[1] * 5]);
    }
    cap(roof, WEDGE, wedgeY);
    if (near) { // stair nosings: thin pale bars across the ramp every 2 m, clipped to the wedge outline (0.06 m proud of the slope)
      for (let d = 2; d < WL - 1; d += 2) {
        const px = W0[0] + WU[0] * d, pz = W0[1] + WU[1] * d, tx = -WU[1], tz = WU[0]; // a line across the ramp
        const hits = [];
        for (let i = 0; i < WEDGE.length; i++) {
          const a = WEDGE[i], b = WEDGE[(i + 1) % WEDGE.length], ex = b[0] - a[0], ez = b[1] - a[1];
          const den = ex * tz - ez * tx; if (Math.abs(den) < 1e-9) continue;
          const u = ((px - a[0]) * tz - (pz - a[1]) * tx) / den, t = ((px - a[0]) * ez - (pz - a[1]) * ex) / den;
          if (u >= 0 && u < 1) hits.push(t);
        }
        hits.sort((p, q) => p - q);
        for (let i = 0; i + 1 < hits.length; i += 2) {
          const t0 = hits[i] + 0.4, t1 = hits[i + 1] - 0.4; if (t1 - t0 < 1) continue;
          const A = [px + tx * t0, pz + tz * t0], B = [px + tx * t1, pz + tz * t1], y = (q) => wedgeY(q[0], q[1]) + 0.06;
          const hw = 0.12, ux = WU[0] * hw, uz = WU[1] * hw;
          conc.quad([A[0] - ux, y(A), A[1] - uz], [B[0] - ux, y(B), B[1] - uz], [B[0] + ux, y(B), B[1] + uz], [A[0] + ux, y(A), A[1] + uz], [A[0], 20, A[1]]);
        }
      }
    }
  }
}
