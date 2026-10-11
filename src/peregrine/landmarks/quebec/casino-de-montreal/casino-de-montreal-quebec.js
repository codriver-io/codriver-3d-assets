import { bar, cap, area, shrink } from './casino-de-montreal-mesh.js';
import { Y, QUEBEC, QUEBEC_LEAN, QUEBEC_GROUND, quebecCentre } from './casino-de-montreal-site.js';

// The Pavillon du Québec: a box of gold-tinted glass standing on a recessed dark-glazed ground floor, so it overhangs the
// quay. Its four walls lean in slightly, with a white tapered post at each corner, a fine white mullion grid and spandrel
// joints, a white roof band set back from the edge with a row of louvred windows, and a flat roof. The mapped square is
// the outline of the gold body at its base. `S(material)` returns the material's Soup.

const H = Y.quebec, G = QUEBEC_GROUND, TOP = Y.quebecTop;

export function buildQuebec(S, near) {
  // far has no mullion grid: its gold wall is one colour, the near wall's average of gold and white bars (`goldMid`), so the two levels match
  const gold = S(near ? 'gold' : 'goldMid'), alu = S('alu'), glass = S('glass'), roof = S('roof'), conc = S('concrete');
  const Q = quebecCentre(), base = QUEBEC, topPoly = shrink(base, Q, QUEBEC_LEAN);
  const sa = area(base);
  // point on wall i at fraction u along the edge and height y (the wall leans linearly with height above the base ledge)
  const P = (i, u, y) => {
    const f = QUEBEC_LEAN * (y - G) / (H - G), a = base[i], b = base[(i + 1) % 4];
    const x = a[0] + (b[0] - a[0]) * u, z = a[1] + (b[1] - a[1]) * u;
    return [x + (Q[0] - x) * f, y, z + (Q[1] - z) * f];
  };
  const normal = (i) => { const a = base[i], b = base[(i + 1) % 4], l = Math.hypot(b[0] - a[0], b[1] - a[1]); return sa > 0 ? [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] : [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
  const out = (p, n, d) => [p[0] + n[0] * d, p[1], p[2] + n[1] * d];
  const yBand = H - 1.6, yLedge = G + 0.8; // the cornice band starts here; the concrete ledge ends here

  // recessed ground floor: dark glass walls and the soffit of the overhang
  const inner = shrink(base, Q, 0.14), si = area(inner);
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = si > 0 ? [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] : [-(b[1] - a[1]) / l, (b[0] - a[0]) / l], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
    glass.quad([a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], G, b[1]], [a[0], G, a[1]], [mx + n[0] * 5, G / 2, mz + n[1] * 5]);
    conc.quad([base[i][0], G, base[i][1]], [base[(i + 1) % 4][0], G, base[(i + 1) % 4][1]], [b[0], G, b[1]], [a[0], G, a[1]], [mx, -10, mz]);
  }

  for (let i = 0; i < 4; i++) {
    const n = normal(i), far = out(P(i, 0.5, 15), n, 20);
    gold.quad(P(i, 0, yLedge), P(i, 1, yLedge), P(i, 1, yBand), P(i, 0, yBand), far);
    conc.quad(P(i, 0, G), P(i, 1, G), P(i, 1, yLedge), P(i, 0, yLedge), out(P(i, 0.5, G + 0.4), n, 20));
    alu.quad(P(i, 0, yBand), P(i, 1, yBand), P(i, 1, H), P(i, 0, H), out(P(i, 0.5, (yBand + H) / 2), n, 20));
    const len = Math.hypot(base[(i + 1) % 4][0] - base[i][0], base[(i + 1) % 4][1] - base[i][1]);
    // white tapered corner strips (wide at the base, narrow at the roof), 0.1 m proud of the glass, on both walls of each corner
    for (const [u0, sgn] of [[0, 1], [1, -1]]) {
      const wb = 1.5 / len, wt = 0.5 / len;
      alu.quad(out(P(i, u0, yLedge), n, 0.1), out(P(i, u0 + sgn * wb, yLedge), n, 0.1), out(P(i, u0 + sgn * wt, yBand), n, 0.1), out(P(i, u0, yBand), n, 0.1), far);
    }
    if (near) {
      // vertical mullions every 2.0 m and spandrel joints every 3.1 m: fine white bars standing 0.05 m proud of the glass
      const nm = Math.round(len / 2.0);
      for (let k = 1; k < nm; k++) bar(alu, out(P(i, k / nm, yLedge), n, 0.04), out(P(i, k / nm, yBand), n, 0.04), 0.14, 0.18, [n[0], 0, n[1]], true);
      for (let y = yLedge + 3.1; y < yBand - 1; y += 3.1) bar(alu, out(P(i, 0.03, y), n, 0.04), out(P(i, 0.97, y), n, 0.04), 0.2, 0.18, [n[0], 0, n[1]], true);
    }
  }
  // roof, then the set-back white roof band with its louvred windows
  cap(roof, topPoly, H);
  const ct = shrink(topPoly, Q, 0.08), Hc = TOP, sc = area(ct);
  for (let i = 0; i < 4; i++) {
    const a = ct[i], b = ct[(i + 1) % 4], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = sc > 0 ? [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] : [-(b[1] - a[1]) / l, (b[0] - a[0]) / l], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
    alu.quad([a[0], H, a[1]], [b[0], H, b[1]], [b[0], Hc, b[1]], [a[0], Hc, a[1]], [mx + n[0] * 5, (H + Hc) / 2, mz + n[1] * 5]);
    // windows: one long ribbon (far) or a row of louvred bays (near)
    const wy0 = H + 0.7, wy1 = Hc - 0.55, e = 0.06;
    const at = (u, y) => [a[0] + (b[0] - a[0]) * u + n[0] * e, y, a[1] + (b[1] - a[1]) * u + n[1] * e];
    const hint = [mx + n[0] * 5, (wy0 + wy1) / 2, mz + n[1] * 5];
    if (near) {
      const nb = Math.round(l / 3.2);
      for (let k = 0; k < nb; k++) glass.quad(at((k + 0.12) / nb, wy0), at((k + 0.88) / nb, wy0), at((k + 0.88) / nb, wy1), at((k + 0.12) / nb, wy1), hint);
    } else glass.quad(at(0.04, wy0), at(0.96, wy0), at(0.96, wy1), at(0.04, wy1), hint);
  }
  cap(roof, ct, Hc);
}
