import { hash01, planFrame, wallFrame } from './edifice-marie-guyart-mesh.js';
import { BASE_BEARING, WINGS } from './edifice-marie-guyart-site.js';

// The low complex: three 4-level wings round a court open to the tower, and six 5-level cores (stairs and plant) where they meet. Each is a
// flat-roofed box on the mapped rectangle. A wall exists only where nothing taller stands against it (the boxes touch, they do not overlap);
// a wing wall is concrete with a glazed ground storey between piers and three ribbon windows over proud floor fascias, a core wall is blank
// concrete with one band of louvres.
const LIT = 0.3, GLASS_R = 0.15, GLOW_R = 0.3, PROUD = 0.5;
const neg = (v) => [-v[0], -v[1], -v[2]];
const UP = [0, 1, 0], DOWN = [0, -1, 0];
const front = (wf, s0, s1, y0, y1, r) => [wf.P(s0, y0, r), wf.P(s1, y0, r), wf.P(s1, y1, r), wf.P(s0, y1, r)];
const side = (wf, s, y0, y1, r0, r1) => [wf.P(s, y0, r0), wf.P(s, y0, r1), wf.P(s, y1, r1), wf.P(s, y1, r0)];
const flat = (wf, s0, s1, y, r0, r1) => [wf.P(s0, y, r0), wf.P(s1, y, r0), wf.P(s1, y, r1), wf.P(s0, y, r1)];

// The runs of one wall that nothing taller covers, as [s0, s1, yLow] (yLow is the height of the lower neighbour that hides its foot).
function visibleRuns(box, a, b, others) {
  const du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv), t = [du / L, dv / L], n = [t[1], -t[0]];
  const along = Math.abs(t[0]) > 0.5 ? 0 : 1, across = 1 - along;
  const covers = [];
  for (const o of others) {
    const [u0, u1, v0, v1] = o.rect, lo = along === 0 ? [u0, u1] : [v0, v1], cr = across === 0 ? [u0, u1] : [v0, v1];
    const q = a[across] + n[across] * 0.05;
    if (q <= cr[0] || q >= cr[1]) continue;
    const s0 = (lo[0] - a[along]) / t[along], s1 = (lo[1] - a[along]) / t[along];
    covers.push({ s0: Math.min(s0, s1), s1: Math.max(s0, s1), h: o.h });
  }
  const cuts = [0, L];
  for (const c of covers) for (const s of [c.s0, c.s1]) if (s > 1e-3 && s < L - 1e-3) cuts.push(s);
  cuts.sort((x, y) => x - y);
  const runs = [];
  for (let i = 0; i + 1 < cuts.length; i++) {
    const s0 = cuts[i], s1 = cuts[i + 1];
    if (s1 - s0 < 1e-3) continue;
    const mid = (s0 + s1) / 2;
    let yLow = 0;
    for (const c of covers) if (mid > c.s0 && mid < c.s1) yLow = Math.max(yLow, c.h);
    if (yLow >= box.h - 1e-6) continue;
    const last = runs[runs.length - 1];
    if (last && Math.abs(last[1] - s0) < 1e-6 && last[2] === yLow) last[1] = s1; else runs.push([s0, s1, yLow]);
  }
  return runs;
}

// A wing wall: the two upper storeys (levels 3 and 4) are pale precast panels in cantilever over the two lower storeys, which are steel panels and
// glass set back 1.5 m (RPCQ: two cantilevered storeys on the public sides, window bands and steel panels below, window bands and concrete panels above).
// The envelope (r = 0) is the mapped outline, i.e. the cantilever's edge. Walls meet at corners: the soffit runs through the corner at the end of a wall
// and starts one setback in at the start of the next, the set-back walls stop one setback short of a corner, and a run that ends against another
// volume is closed by an end cap.
const SETBACK = 1.5, CANTILEVER = 8.4;
function wingWall(M, near, wf, s0, s1, L, h, id, tag) {
  const { N, T } = wf, mT = neg(T), concrete = M.get('concrete'), glass = M.get('glass'), glow = M.get('glow'), metal = M.get('metal');
  const D = SETBACK, YC = CANTILEVER, atStart = s0 < 1e-6, atEnd = s1 > L - 1e-6, len = s1 - s0;
  const ribbons = [[9.1, 10.9], [12.7, 14.5]], lowRibbon = [5.5, 7.7];
  const lit = (a, b, y0, y1, r, k, j) => { if (hash01(tag + 5, id * 16 + k, j) < LIT * 0.9) glow.quad(...front(wf, a, b, y0, y1, r), N); };
  if (!near) {
    concrete.quad(...front(wf, s0, s1, 0, h, 0), N);
    glass.quad(...front(wf, s0 + 0.6, s1 - 0.6, 0.4, 4.5, GLASS_R), N);
    for (const [y0, y1] of [lowRibbon, ...ribbons]) glass.quad(...front(wf, s0 + 0.6, s1 - 0.6, y0, y1, GLASS_R), N);
    const seg = Math.max(1, Math.round(len / 9)), w = (len - 1.2) / seg;
    for (let j = 0; j < seg; j++) lit(s0 + 0.6 + j * w + 0.3, s0 + 0.6 + (j + 1) * w - 0.3, 9.3, 10.7, GLOW_R, 0, j);
    return;
  }
  // Cantilevered precast storeys with their ribbons, and the soffit under them.
  concrete.quad(...front(wf, s0, s1, YC, h, 0), N);
  concrete.quad(...flat(wf, atStart ? s0 + D : s0, s1, YC, -D, 0), DOWN);
  ribbons.forEach(([y0, y1], k) => {
    glass.quad(...front(wf, s0 + 0.5, s1 - 0.5, y0, y1, GLASS_R), N);
    const seg = Math.max(1, Math.round(len / 4.5)), w = (len - 1) / seg;
    for (let j = 0; j < seg; j++) lit(s0 + 0.5 + j * w + 0.2, s0 + 0.5 + (j + 1) * w - 0.2, y0 + 0.15, y1 - 0.15, GLOW_R, k, j);
  });
  // The set-back steel and glass storeys.
  const l0 = atStart ? s0 + D : s0, l1 = atEnd ? s1 - D : s1, R = -D;
  if (l1 - l0 > 0.5) {
    metal.quad(...front(wf, l0, l1, 0, YC, R), N);
    const nb = Math.max(1, Math.round((l1 - l0) / 6)), bay = (l1 - l0) / nb;
    for (let i = 0; i < nb; i++) {
      const a = l0 + i * bay + 0.45, b = l0 + (i + 1) * bay - 0.45;
      glass.quad(...front(wf, a, b, 0.4, 4.5, R + GLASS_R), N);
      lit(a + 0.15, b - 0.15, 0.6, 4.3, R + GLOW_R, 3, i);
    }
    glass.quad(...front(wf, l0 + 0.5, l1 - 0.5, lowRibbon[0], lowRibbon[1], R + GLASS_R), N);
    lit(l0 + 0.7, l1 - 0.7, lowRibbon[0] + 0.15, lowRibbon[1] - 0.15, R + GLOW_R, 4, 0);
    for (let i = 0; i <= nb; i++) { // columns of the lower storeys
      const c = l0 + i * bay, a = Math.max(l0, c - 0.45), b = Math.min(l1, c + 0.45);
      concrete.quad(...front(wf, a, b, 0, 4.8, R + 0.5), N);
      if (i > 0) concrete.quad(...side(wf, a, 0, 4.8, R, R + 0.5), mT);
      if (i < nb) concrete.quad(...side(wf, b, 0, 4.8, R, R + 0.5), T);
    }
  }
  if (!atStart) concrete.quad(...side(wf, s0, 0, YC, -D, 0), mT);
  if (!atEnd) concrete.quad(...side(wf, s1, 0, YC, -D, 0), T);
}

export function buildBase(M, near, b, tag = 1) {
  const frame = planFrame(BASE_BEARING), concrete = M.get('concrete'), glass = M.get('glass'), roof = M.get('roof');
  WINGS.forEach((box, bi) => {
    const [u0, u1, v0, v1] = box.rect, others = WINGS.filter((o) => o !== box);
    const corners = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
    for (let i = 0; i < 4; i++) {
      const a = corners[i], c = corners[(i + 1) % 4], wf = wallFrame(frame, a, c);
      for (const [s0, s1, yLow] of visibleRuns(box, a, c, others)) {
        const isCore = box.id.startsWith('core');
        if (!isCore && yLow === 0 && s1 - s0 >= 5) wingWall(M, near, wf, s0, s1, wf.L, box.h, bi * 4 + i, tag);
        else concrete.quad(...front(wf, s0, s1, yLow, box.h, 0), wf.N);
        if (isCore && box.h - yLow >= 9 && s1 - s0 >= 8) glass.quad(...front(wf, s0 + 1.2, s1 - 1.2, box.h - 3.6, box.h - 1.6, GLASS_R), wf.N); // louvres
      }
    }
    const p = ([u, v]) => { const [x, z] = frame.xz(u, v); return [x, box.h, z]; };
    roof.quad(p(corners[0]), p(corners[1]), p(corners[2]), p(corners[3]), [0, 1, 0]);
  });
  if (!near) return;
  // Rooftop units on the long wing and the other wings (uv in the base grid, size u x v x height).
  for (const [u, v, su, sv, sh, h] of [[12, 68, 4, 3, 1.6, 15.6], [64, 68, 5, 3, 1.9, 15.6], [89, 18, 4, 3, 1.6, 15.6], [78, -30, 4, 3, 1.6, 15.6], [88, 70, 3, 3, 1.4, 15.6]]) {
    const [x, z] = frame.xz(u, v);
    b.box('concrete', [x, h + sh / 2, z], [su, sh, sv], frame.angle);
  }
}
