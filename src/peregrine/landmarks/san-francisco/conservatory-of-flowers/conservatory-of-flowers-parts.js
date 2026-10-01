import { sub, add, mul, norm } from './conservatory-of-flowers-kit.js';

// Building frame: p along the long axis (east-ish), q across it (south-ish, toward the vestibule),
// origin on the dome axis. Dimensions are metres. Sources and estimates: docs/3d-san-francisco-conservatory-of-flowers.md.
export const D = {
  PL: 0.5,                 // masonry foundation course height (plinth)
  HW: 5.4,                 // half width of every wing hall and lobe (walls 10.8 m apart)
  YE: 2.6, YR: 5.0,        // wing eaves and ridge heights
  NA: 2.3,                 // Tudor-arch squareness of the wing vaults
  PC: 31.5,                // lobe axis p (cupola stands here)
  QE: 9.6,                 // where a lobe's vault ends and its faceted dome end begins
  PX0: 8.7, PX1: 36.9,     // east hall from the pavilion face to the lobe's outer wall
  PA: 8.7, PB: 8.5, PCH: 3.1,   // pavilion: half widths and chamfer
  WT: 5.6,                 // pavilion cornice top
  RING: 8.6,               // top of the arched shoulder roof (drum base)
  DRUM: 10.8,              // drum cornice top, springing of the dome
  DOME_R: 4.4, DOME_H: 4.3,
  LAN: 15.0,               // lantern base
};
const { PL, HW, YE, YR, NA, PC, QE, PX0, PX1, PA, PB, PCH, WT, RING, DRUM, DOME_R, DOME_H, LAN } = D;

export const arch = (s) => YE + (YR - YE) * Math.pow(1 - Math.pow(Math.min(1, Math.abs(s)), NA), 1 / NA);
const grid = (near) => (near ? [0, 0.259, 0.5, 0.707, 0.866, 0.966, 1] : [0, 0.5, 0.866, 1]);
export const oct = (A, B, c) => [[-(A - c), -B], [A - c, -B], [A, -(B - c)], [A, B - c], [A - c, B], [-(A - c), B], [-A, B - c], [-A, -(B - c)]];
const lerp = (a, b, t) => a + (b - a) * t;

// polygon [[p, q], ...] in clockwise order (p right, q down), grown outward by d (mitred)
export function offsetPoly(poly, d) {
  const n = poly.length;
  return poly.map((v, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n];
    const d1 = norm([v[0] - a[0], 0, v[1] - a[1]]), d2 = norm([b[0] - v[0], 0, b[1] - v[1]]);
    const n1 = [d1[2], -d1[0]], n2 = [d2[2], -d2[0]], k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
    return [v[0] + (n1[0] + n2[0]) * k, v[1] + (n1[1] + n2[1]) * k];
  });
}

// ---- walls -----------------------------------------------------------------------------------
// A glazed wall run a->b ([p, q], clockwise so the outward normal is (dq, -dp)): painted base board,
// lit glazing, posts at ~1.8 m, cornice. Far keeps only glazing and cornice.
function wall(k, near, a, b, y0, y1, o = {}) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), d = [dx / L, dz / L], n = [d[1], -d[0]];
  const board = o.board ?? 0.8, cor = o.cornice ?? 0.3, sp = o.spacing ?? 2.6;
  const seg = (t0, t1, ya, yb, off, thick, m, skip = 0) => {
    const tc = (t0 + t1) / 2;
    k.bx(m, [a[0] + d[0] * tc + n[0] * off, (ya + yb) / 2, a[1] + d[1] * tc + n[1] * off], [d[0] * (t1 - t0) / 2, 0, d[1] * (t1 - t0) / 2], [0, (yb - ya) / 2, 0], [n[0] * thick / 2, 0, n[1] * thick / 2], skip);
  };
  const yb = y0 + (near ? board : 0), yt = y1 - cor;
  seg(0, L, yb, yt, 0, 0.06, 'glow', 44);
  seg(0, L, yt, y1, 0, 0.36, 'frame', near ? 32 : 40);
  if (!near) return;
  seg(0, L, y0, yb, 0, 0.2, 'frame', 40);
  const cnt = Math.max(1, Math.round(L / sp));
  for (let i = 1; i < cnt; i++) seg(L * i / cnt - 0.09, L * i / cnt + 0.09, yb, yt, 0, 0.16, 'frame', 44);
  if (yt - yb > 3) seg(0, L, (yb + yt) / 2 - 0.06, (yb + yt) / 2 + 0.06, 0, 0.19, 'frame', 32);
}
function chain(k, near, pts, y0, y1, o = {}, closed = false) {
  const n = pts.length, last = closed ? n : n - 1, cor = o.cornice ?? 0.3, board = o.board ?? 0.8;
  for (let i = 0; i < last; i++) wall(k, near, pts[i], pts[(i + 1) % n], y0, y1, o);
  if (!near) return;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n === 0 && !closed ? i - 1 : (i + 1) % n];
    const d = norm([b[0] - a[0], 0, b[1] - a[1]]) , s = i === n - 1 && !closed ? -1 : 1;
    k.bx('frame', [a[0], (y0 + board + y1 - cor) / 2, a[1]], [d[0] * 0.12 * s, 0, d[2] * 0.12 * s], [0, (y1 - cor - y0 - board) / 2, 0], [-d[2] * 0.12, 0, d[0] * 0.12], 12);
  }
}

// A vertical glazed gable/tympanum: plane through `origin` ([p, q]) running along dir (clockwise
// traversal, outward normal (dir.q, -dir.p)); xs = offsets along dir, ys = top heights; floor y0.
function gable(k, near, origin, dir, xs, ys, y0, sp = 3) {
  const n = [dir[1], -dir[0]];
  const pt = (x, y, off = 0) => [origin[0] + dir[0] * x + n[0] * off, y, origin[1] + dir[1] * x + n[1] * off];
  const ref = pt((xs[0] + xs[xs.length - 1]) / 2, y0, -3);
  for (let i = 0; i < xs.length - 1; i++) k.quad('glow', pt(xs[i], y0), pt(xs[i + 1], y0), pt(xs[i + 1], ys[i + 1]), pt(xs[i], ys[i]), ref);
  if (!near) return;
  const top = (x) => { for (let i = 0; i < xs.length - 1; i++) if (x >= xs[i] - 1e-9 && x <= xs[i + 1] + 1e-9) return lerp(ys[i], ys[i + 1], (x - xs[i]) / (xs[i + 1] - xs[i] || 1)); return y0; };
  const x0 = xs[0], x1 = xs[xs.length - 1], cnt = Math.max(2, Math.round((x1 - x0) / sp));
  for (let i = 1; i < cnt; i++) {
    const x = x0 + ((x1 - x0) * i) / cnt, t = top(x);
    k.bx('frame', pt(x, (y0 + t) / 2), [dir[0] * 0.065, 0, dir[1] * 0.065], [0, (t - y0) / 2, 0], [n[0] * 0.08, 0, n[1] * 0.08], 44);
  }
  k.sweep('frame', xs.map((x, i) => pt(x, ys[i])), [n[0], 0, n[1]], 0.26, 0.16, 0.02);
}

// A rib across the wing roof at `station`: axis 'p' stations run across q, axis 'q' across p.
function archRib(k, near, axis, station, c0, Q) {
  if (Q < 0.7) return;
  const G = grid(near), ds = [-Q];
  for (const g of [...G].reverse()) if (g * HW < Q - 0.25) ds.push(-g * HW);
  for (const g of G.slice(1)) if (g * HW < Q - 0.25) ds.push(g * HW);
  ds.push(Q);
  const uniq = [...new Set(ds.map((v) => +v.toFixed(3)))].sort((a, b) => a - b);
  const pts = uniq.map((d) => (axis === 'p' ? [station, arch(d / HW), c0 + d] : [c0 + d, arch(d / HW), station]));
  k.sweep('frame', pts, axis === 'p' ? [1, 0, 0] : [0, 0, 1], 0.18, 0.1, 0.05);
}

// ---- one wing: hall, lobe, cross-vault corner, dome end, cupola (east; the west is its mirror) ----
function wing(k, near) {
  const G = grid(near), K = G.length - 1;
  const hall = [(PX0 + PX1) / 2, 0, 0], lobeRef = [PC, 0, 2];
  // hall vault strips (two triangles of the cross vault stay on the hall, west and east of the corner)
  for (const sg of [-1, 1]) for (let i = 0; i < K; i++) {
    const qa = sg * HW * G[i], qb = sg * HW * G[i + 1], ya = arch(G[i]), yb = arch(G[i + 1]);
    k.quad('glass', [PX0, ya, qa], [PC - Math.abs(qa), ya, qa], [PC - Math.abs(qb), yb, qb], [PX0, yb, qb], hall);
    k.quad('glass', [PC + Math.abs(qa), ya, qa], [PX1, ya, qa], [PX1, yb, qb], [PC + Math.abs(qb), yb, qb], hall);
    // lobe vault strips: north gable triangle and the south run to the dome end
    const da = qa, db = qb;
    k.quad('glass', [PC + da, ya, Math.abs(da)], [PC + da, ya, QE], [PC + db, yb, QE], [PC + db, yb, Math.abs(db)], lobeRef);
    k.quad('glass', [PC + da, ya, -HW], [PC + da, ya, -Math.abs(da)], [PC + db, yb, -Math.abs(db)], [PC + db, yb, -HW], lobeRef);
  }
  // faceted dome end: five gores around (PC, QE)
  const ring = [];
  for (let j = 0; j <= 5; j++) ring.push([PC + HW * Math.cos((j * Math.PI) / 5), QE + HW * Math.sin((j * Math.PI) / 5)]);
  const rho = [...G].reverse();
  const V = (j, r) => [PC + rho[r] * HW * Math.cos((j * Math.PI) / 5), arch(rho[r]), QE + rho[r] * HW * Math.sin((j * Math.PI) / 5)];
  for (let j = 0; j < 5; j++) for (let r = 0; r < K; r++) k.quad('glass', V(j, r), V(j + 1, r), V(j + 1, r + 1), V(j, r + 1), [PC, 0, QE]);

  // walls: north, east end and the faceted end, then the lobe's inner side and the hall's south wall
  const wallPts = [[PX0, -HW], [PX1, -HW], ...ring, [PC - HW, HW], [PX0, HW]];
  chain(k, near, wallPts, PL, YE, { board: 0.7, cornice: 0.25 });
  gable(k, near, [PX1, 0], [0, 1], G.slice().reverse().map((g) => -g * HW).concat(G.slice(1).map((g) => g * HW)), G.slice().reverse().concat(G.slice(1)).map(arch), YE);
  gable(k, near, [PC, -HW], [1, 0], G.slice().reverse().map((g) => -g * HW).concat(G.slice(1).map((g) => g * HW)), G.slice().reverse().concat(G.slice(1)).map(arch), YE);

  // cupola where hall and lobe cross: glazed octagonal lantern, cornice, ogee roof, ball finial (tip 2.5 m over the ridge)
  const lb = [PC, 0, 0];
  const cs = near ? 8 : 6;
  k.lathe('glow', [[1.15, YR - 0.3], [1.15, YR + 0.95]], lb, cs);
  k.lathe('frame', [[1.5, YR + 0.95], [1.5, YR + 1.2], [1.3, YR + 1.2]], lb, cs);
  k.lathe('frame', near ? [[1.38, YR + 1.2], [1.2, YR + 1.4], [0.9, YR + 1.72], [0.55, YR + 2.0], [0.28, YR + 2.18], [0.1, YR + 2.28]] : [[1.38, YR + 1.2], [0.85, YR + 1.75], [0.35, YR + 2.15], [0.1, YR + 2.28]], lb, cs);
  k.lathe('frame', near ? [[0.1, YR + 2.28], [0.17, YR + 2.34], [0.1, YR + 2.4], [0, YR + 2.5]] : [[0.1, YR + 2.28], [0, YR + 2.5]], lb, near ? 6 : 4);
  if (near) for (let j = 0; j < 8; j++) {
    const a = (j / 8) * 2 * Math.PI + Math.PI / 8, ca = Math.cos(a), sa = Math.sin(a);
    k.sweep('frame', [[PC + 1.15 * ca, YR - 0.1, 1.15 * sa], [PC + 1.15 * ca, YR + 0.95, 1.15 * sa]], [-sa, 0, ca], 0.16, 0.1, 0, [ca, 0, sa]);
  }

  // ribs and purlins
  const st = near ? 2 : 4, hp = 1.88 * st, lq = 1.875 * st;
  for (let i = 1; i * hp < PX1 - PX0 - 0.5; i++) { const p = PX0 + hp * i; archRib(k, near, 'p', p, 0, Math.min(HW, Math.abs(p - PC))); }
  for (let j = 1; j * lq <= QE + HW + 0.1; j++) { const q = -HW + lq * j; archRib(k, near, 'q', q, PC, Math.min(HW, Math.abs(q))); }
  for (const gi of near ? [0, 3] : [0]) for (const sg of gi ? [-1, 1] : [1]) {
    const d = sg * G[gi] * HW, y = arch(G[gi]), ad = Math.abs(d);
    k.sweep('frame', [[PX0, y, d], [PC - ad, y, d]], [0, 0, 1], 0.16, 0.1, 0.05);
    k.sweep('frame', [[PC + ad, y, d], [PX1, y, d]], [0, 0, 1], 0.16, 0.1, 0.05);
    k.sweep('frame', [[PC + d, y, -HW], [PC + d, y, -ad]], [1, 0, 0], 0.16, 0.1, 0.05);
    k.sweep('frame', [[PC + d, y, ad], [PC + d, y, QE]], [1, 0, 0], 0.16, 0.1, 0.05);
  }
  // valley bars on the four diagonals of the crossing
  for (const [sp, sq] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const pts = G.map((g) => [PC + sp * g * HW, arch(g), sq * g * HW]);
    k.sweep('frame', pts, norm([sq, 0, -sp]), 0.2, 0.12, 0.04);
  }
  // dome-end meridians
  for (let j = 1; j < 5; j++) k.sweep('frame', rho.map((_, r) => V(j, r)), norm([-Math.sin((j * Math.PI) / 5), 0, Math.cos((j * Math.PI) / 5)]), 0.18, 0.1, 0.05);
  // a small gabled door porch on the lobe's south face
  const sq = QE + 4.95, x0 = PC; // 0.2 m behind the end wall plane so the porch is bedded into it
  k.bx('frame', [x0, 1.5, sq + 0.35], [0.9, 0, 0], [0, 1.0, 0], [0, 0, 0.55]);
  k.quad('glow', [x0 - 0.5, 0.6, sq + 0.93], [x0 + 0.5, 0.6, sq + 0.93], [x0 + 0.5, 2.3, sq + 0.93], [x0 - 0.5, 2.3, sq + 0.93], [x0, 1.5, sq]);
  k.tri3('frame', [x0 - 1.1, 2.5, sq + 0.95], [x0 + 1.1, 2.5, sq + 0.95], [x0, 3.3, sq + 0.95], [x0, 2.5, sq - 1]);
  k.quad('frame', [x0 - 1.1, 2.5, sq + 0.95], [x0, 3.3, sq + 0.95], [x0, 3.3, sq - 0.3], [x0 - 1.1, 2.5, sq - 0.3], [x0, 0, sq + 0.3]);
  k.quad('frame', [x0 + 1.1, 2.5, sq + 0.95], [x0, 3.3, sq + 0.95], [x0, 3.3, sq - 0.3], [x0 + 1.1, 2.5, sq - 0.3], [x0, 0, sq + 0.3]);
}

// ---- the pavilion: walls, arched shoulder roof, three dormers, drum, dome, lantern, spire ----
function pavilion(k, near) {
  const E = oct(PA, PB, PCH), S = 0.54, Dm = E.map(([p, q]) => [p * S, q * S]);
  chain(k, near, E, PL, WT, { board: 0.8, cornice: 0.35, spacing: 2.6 }, true);
  const rows = near ? [0, 1 / 3, 2 / 3, 1] : [0, 0.5, 1], f = (t) => 1 - (1 - t) * (1 - t);
  const R = (i, r) => { const e = E[i % 8], d = Dm[i % 8], t = rows[r]; return [lerp(e[0], d[0], t), WT + (RING - WT) * f(t), lerp(e[1], d[1], t)]; };
  for (let i = 0; i < 8; i++) for (let r = 0; r < rows.length - 1; r++) k.quad('glass', R(i, r), R(i + 1, r), R(i + 1, r + 1), R(i, r + 1), [0, 0, 0]);
  {
    for (let i = 0; i < 8; i++) {
      const a = E[i], b = E[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1]), cnt = Math.max(near ? 2 : 1, Math.round(L / (near ? 3.4 : 5.5))), dir = norm([b[0] - a[0], 0, b[1] - a[1]]);
      for (let c = 1; c < cnt; c++) {
        const u = c / cnt;
        k.sweep('frame', rows.map((_, r) => { const A = R(i, r), B = R(i + 1, r); return [lerp(A[0], B[0], u), lerp(A[1], B[1], u), lerp(A[2], B[2], u)]; }), dir, 0.18, 0.1, 0.05);
      }
    }
    if (near) for (const r of [2]) k.sweep('frame', [...Array(8).keys()].map((i) => R(i, r)), [0, 1, 0], 0.12, 0.12, 0.04, [0, 1, 0], { closed: true });
  }
  // drum (with its floor plate under the dome so the interior never shows)
  k.prism('frame', offsetPoly(Dm, -0.12), DRUM - 0.12, DRUM - 0.05);
  chain(k, near, Dm, RING, DRUM, { board: 0.4, cornice: 0.35, spacing: 2.0 }, true);
  // dormers on the south, east and west facets
  for (const [i, j] of [[4, 5], [2, 3], [6, 7]]) {
    const a = E[i], b = E[j], d = norm([b[0] - a[0], 0, b[1] - a[1]]), n = [d[2], -d[0]], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const F = (x, y, off) => [c[0] + d[0] * x + n[0] * off, y, c[1] + d[2] * x + n[1] * off];
    const hwid = 1.4, yb = WT, ye = 7.1, yr = 8.0, dp = 2.4, inner = F(0, 6, -2);
    k.quad('glow', F(-hwid, yb, 0), F(hwid, yb, 0), F(hwid, ye, 0), F(-hwid, ye, 0), inner);
    k.tri3('glow', F(-hwid, ye, 0), F(hwid, ye, 0), F(0, yr, 0), inner);
    k.quad('glass', F(-hwid, ye, 0), F(0, yr, 0), F(0, yr, -dp), F(-hwid, ye, -dp), F(0, 4, -1));
    k.quad('glass', F(hwid, ye, 0), F(0, yr, 0), F(0, yr, -dp), F(hwid, ye, -dp), F(0, 4, -1));
    for (const s of [-1, 1]) k.quad('frame', F(s * hwid, yb, 0), F(s * hwid, ye, 0), F(s * hwid, ye, -1.6), F(s * hwid, yb, -1.6), F(0, 6, -1));
    if (near) {
      for (const x of [-hwid, 0, hwid]) k.bx('frame', F(x, (yb + ye) / 2, 0), [d[0] * 0.07, 0, d[2] * 0.07], [0, (ye - yb) / 2, 0], [n[0] * 0.09, 0, n[1] * 0.09]);
      k.sweep('frame', [F(-hwid - 0.1, ye - 0.05, 0), F(0, yr + 0.05, 0), F(hwid + 0.1, ye - 0.05, 0)], [n[0], 0, n[1]], 0.16, 0.1, 0.03);
      k.sweep('frame', [F(0, yr, 0), F(0, yr, -dp)], d, 0.1, 0.1, 0.05);
    }
  }
  // dome (ellipsoid on the drum), lantern, spire
  const seg = near ? 16 : 10, nr = near ? 8 : 4, phiMax = Math.acos(1 / DOME_R), prof = [];
  for (let r = 0; r <= nr; r++) { const ph = (phiMax * r) / nr; prof.push([DOME_R * Math.cos(ph), DRUM + DOME_H * Math.sin(ph)]); }
  const axis = [0, 0, 0];
  k.lathe('glass', prof, axis, seg);
  {
    for (let j = 0; j < seg; j += near ? 2 : 3) {
      const a = (j / seg) * 2 * Math.PI, ca = Math.cos(a), sa = Math.sin(a);
      k.sweep('frame', prof.map(([r, y]) => [r * ca, y, r * sa]), [-sa, 0, ca], 0.18, 0.1, 0.05);
    }
    if (near) for (const r of [3]) k.sweep('frame', Array.from({ length: seg }, (_, j) => { const a = (j / seg) * 2 * Math.PI; return [prof[r][0] * Math.cos(a), prof[r][1], prof[r][0] * Math.sin(a)]; }), [0, 1, 0], 0.12, 0.12, 0.05, [0, 1, 0], { closed: true });
  }
  k.lathe('glow', [[0.95, LAN - 0.12], [0.95, 16.1]], axis, 8);
  k.lathe('frame', [[1.1, 16.1], [1.1, 16.3], [0.55, 16.45], [0.5, 16.5]], axis, 8);
  k.lathe('frame', [[0.55, 16.45], [0.28, 16.6], [0.28, 16.85], [0.4, 17.0], [0.4, 17.15], [0.15, 17.35], [0.07, 18.0], [0, 18.0]], axis, near ? 8 : 5);
  if (near) for (let j = 0; j < 8; j++) { const a = (j / 8) * 2 * Math.PI + Math.PI / 8; k.sweep('frame', [[0.95 * Math.cos(a), LAN - 0.1, 0.95 * Math.sin(a)], [0.95 * Math.cos(a), 16.1, 0.95 * Math.sin(a)]], [-Math.sin(a), 0, Math.cos(a)], 0.12, 0.1, 0.0, [Math.cos(a), 0, Math.sin(a)]); }
}

// ---- the gabled vestibule on the south face ----
function vestibule(k, near) {
  const w = 3.75, q0 = PB, q1 = 15.5, ye = 3.3, yr = 5.1;
  chain(k, near, [[w, q0], [w, q1], [-w, q1], [-w, q0]], PL, ye, { board: 0.8, cornice: 0.3 });
  const ref = [0, 0, (q0 + q1) / 2];
  k.quad('glass', [-w, ye, q0], [-w, ye, q1], [0, yr, q1], [0, yr, q0], ref);
  k.quad('glass', [w, ye, q0], [w, ye, q1], [0, yr, q1], [0, yr, q0], ref);
  k.tri3('glow', [-w, ye, q1], [w, ye, q1], [0, yr, q1], ref);
  if (!near) return;
  for (let q = q0 + 2.3; q < q1 - 0.5; q += 2.3) k.sweep('frame', [[-w, ye, q], [0, yr, q], [w, ye, q]], [0, 0, 1], 0.18, 0.1, 0.05);
  k.sweep('frame', [[0, yr, q0], [0, yr, q1]], [1, 0, 0], 0.14, 0.12, 0.05);
  k.sweep('frame', [[-w - 0.1, ye - 0.05, q1], [0, yr + 0.05, q1], [w + 0.1, ye - 0.05, q1]], [0, 0, 1], 0.2, 0.14, 0.04);
  for (const x of [-1.9, 0, 1.9]) k.bx('frame', [x, (ye + (x ? 4.2 : yr)) / 2, q1 + 0.0], [0.07, 0, 0], [0, ((x ? 4.2 : yr) - ye) / 2, 0], [0, 0, 0.09]);
}

// ---- rear service houses behind the alley: low glazed gable houses and a flat-roofed core ----
const REAR = [
  { p: [-4.5, 4.5], q: [-17.65, -8.6], flat: true },
  { p: [-25.5, -4.5], q: [-17.0, -8.6], ye: 2.6, yr: 4.8 },
  { p: [-31.85, -25.5], q: [-14.35, -8.6], ye: 2.5, yr: 4.4 },
  { p: [4.5, 19.45], q: [-17.65, -8.6], ye: 2.6, yr: 4.8 },
  { p: [19.45, 29.4], q: [-13.05, -8.6], ye: 2.5, yr: 4.4 },
  { p: [29.4, 34.85], q: [-11.9, -8.6], ye: 2.5, yr: 4.4 },
];
function rear(k, near) {
  for (const h of REAR) {
    const [p0, p1] = h.p, [q0, q1] = h.q, i = 0.1, qm = (q0 + q1) / 2, pm = (p0 + p1) / 2;
    k.prism('stone', [[p0, q0], [p1, q0], [p1, q1], [p0, q1]], 0, PL);
    const ring = [[p0 + i, q0 + i], [p1 - i, q0 + i], [p1 - i, q1 - i], [p0 + i, q1 - i]];
    if (h.flat) {
      chain(k, near, ring, PL, 4.4, { board: 0.9, cornice: 0.3 }, true);
      k.prism('roof', [[p0, q0], [p1, q0], [p1, q1], [p0, q1]], 4.4, 4.6);
      continue;
    }
    chain(k, near, ring, PL, h.ye, { board: 0.9, cornice: 0.25 }, true);
    const ref = [pm, 0, qm], a = p0 + i, b = p1 - i, c = q0 + i, e = q1 - i;
    k.quad('glass', [a, h.ye, c], [b, h.ye, c], [b, h.yr, qm], [a, h.yr, qm], ref);
    k.quad('glass', [a, h.ye, e], [b, h.ye, e], [b, h.yr, qm], [a, h.yr, qm], ref);
    k.tri3('glow', [a, h.ye, c], [a, h.ye, e], [a, h.yr, qm], ref);
    k.tri3('glow', [b, h.ye, c], [b, h.ye, e], [b, h.yr, qm], ref);
    if (near) {
      const cnt = Math.max(2, Math.round((b - a) / 3.8));
      for (let s = 0; s <= cnt; s++) { const p = a + ((b - a) * s) / cnt; k.sweep('frame', [[p, h.ye, c], [p, h.yr, qm], [p, h.ye, e]], [1, 0, 0], 0.18, 0.1, 0.05); }
      k.sweep('frame', [[a, h.yr, qm], [b, h.yr, qm]], [0, 0, 1], 0.16, 0.12, 0.05);
    }
  }
}

export function buildConservatory(k, near) {
  // Foundation course: one prism round the whole front body (pavilion, halls, lobes) plus the vestibule.
  const ring = [];
  for (let j = 0; j <= 5; j++) ring.push([PC + HW * Math.cos((j * Math.PI) / 5), QE + HW * Math.sin((j * Math.PI) / 5)]);
  const o = oct(PA, PB, PCH);
  const east = [[PX1, -HW], ...ring, [PC - HW, HW]];
  const west = [...east].reverse().map(([p, q]) => [-p, q]);
  const body = [o[0], o[1], o[2], ...east, o[3], o[4], o[5], o[6], ...west, o[7]];
  k.prism('stone', offsetPoly(body, 0.1), 0, PL);
  k.prism('stone', [[3.85, PB + 0.1], [3.85, 15.6], [-3.85, 15.6], [-3.85, PB + 0.1]], 0, PL);
  k.mapped(([x, y, z]) => [x, y, z], () => wing(k, near));
  k.mapped(([x, y, z]) => [-x, y, z], () => wing(k, near));
  pavilion(k, near);
  vestibule(k, near);
  rear(k, near);
}
void sub; void add; void mul;
