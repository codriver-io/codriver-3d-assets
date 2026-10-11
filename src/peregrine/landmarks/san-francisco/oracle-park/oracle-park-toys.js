import { BOTTLE, T, EDGE_H } from './oracle-park-site.js';
import { edge } from './oracle-park-facade.js';

// The two oversized souvenirs beyond left field, the flagpoles and the entrance sign.
const DECK = 12.2; // top of the left-field concourse behind the bleachers (roof strips at 12.5)

// The 80 ft (24 m) Coca-Cola bottle lying tilted on the deck, neck toward centre field. Its footprint
// is the mapped part (OSM way 499568652); the body is a lofted profile, the red label a wider band.
export function cokeBottle(b, B, near) {
  const pts = BOTTLE; let best = [0, 1], d = 0;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const l = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (l > d) { d = l; best = [i, j]; } }
  let [p, q] = best.map((i) => pts[i]); if (p[0] > q[0]) [p, q] = [q, p];
  const dir = [(q[0] - p[0]) / d, (q[1] - p[1]) / d], tilt = 30 * Math.PI / 180, L = 24;
  const D = [dir[0] * Math.cos(tilt), Math.sin(tilt), dir[1] * Math.cos(tilt)];
  const e1 = [-dir[1], 0, dir[0]], e2 = [D[1] * e1[2] - D[2] * e1[1], D[2] * e1[0] - D[0] * e1[2], D[0] * e1[1] - D[1] * e1[0]];
  const base = [p[0] + dir[0] * 1.2, DECK + 3.4, p[1] + dir[1] * 1.2];
  const prof = [[0, 0.0], [0.02, 3.0], [0.06, 3.5], [0.48, 3.5], [0.6, 3.25], [0.7, 2.4], [0.79, 1.45], [0.86, 1.05], [0.95, 1.0], [0.985, 1.3], [1, 0.0]];
  const seg = near ? 12 : 7, ring = (t, r, grow = 0) => Array.from({ length: seg }, (_, k) => {
    const a = k / seg * Math.PI * 2, c = Math.cos(a) * (r + grow), s = Math.sin(a) * (r + grow);
    return [base[0] + D[0] * t * L + e1[0] * c + e2[0] * s, base[1] + D[1] * t * L + e1[1] * c + e2[1] * s, base[2] + D[2] * t * L + e1[2] * c + e2[2] * s];
  });
  const tube = (buf, rings) => {
    for (let r = 0; r < rings.length - 1; r++) for (let k = 0; k < seg; k++) {
      const k2 = (k + 1) % seg, A = rings[r][k], Bk = rings[r][k2], C = rings[r + 1][k2], Dd = rings[r + 1][k];
      const mid = [(A[0] + C[0]) / 2 - base[0] - D[0] * L / 2, (A[1] + C[1]) / 2 - base[1] - D[1] * L / 2, (A[2] + C[2]) / 2 - base[2] - D[2] * L / 2];
      buf.quad(A, Bk, C, Dd, mid);
    }
  };
  const body = prof.filter((_, i) => near || i % 2 === 0 || i === prof.length - 1).map(([t, r]) => ring(t, Math.max(r, 0.001)));
  tube(B('copper'), body);
  // red label: a wider band around the belly
  tube(B('sign'), (near ? [0.2, 0.3, 0.42] : [0.2, 0.42]).map((t) => ring(t, 3.5, 0.14)));
  // supports from the deck to the belly
  for (const t of [0.2, 0.45]) {
    const c = [base[0] + D[0] * t * L, base[1] + D[1] * t * L, base[2] + D[2] * t * L];
    b.bar('steel', [c[0] + e1[0] * 1.6, DECK - 0.2, c[2] + e1[2] * 1.6], [c[0] + e1[0] * 1.6, c[1] - 2.9, c[2] + e1[2] * 1.6], 0.28, 0.28);
    b.bar('steel', [c[0] - e1[0] * 1.6, DECK - 0.2, c[2] - e1[2] * 1.6], [c[0] - e1[0] * 1.6, c[1] - 2.9, c[2] - e1[2] * 1.6], 0.28, 0.28);
  }
}

// Tapered closed tube from p0 to p1 with a rounded tip (a finger or the thumb of the glove).
function capsule(buf, p0, p1, r0, r1, seg) {
  const d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], L = Math.hypot(...d), a = d.map((v) => v / L);
  const ref = Math.abs(a[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let u = [a[1] * ref[2] - a[2] * ref[1], a[2] * ref[0] - a[0] * ref[2], a[0] * ref[1] - a[1] * ref[0]]; const ul = Math.hypot(...u); u = u.map((v) => v / ul);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  const rings = [[p0, r0], [p1, r1], [p1.map((x, i) => x + a[i] * r1 * 0.6), r1 * 0.8], [p1.map((x, i) => x + a[i] * r1 * 0.93), r1 * 0.38]];
  const pts = rings.map(([c, r]) => Array.from({ length: seg }, (_, k) => { const th = k / seg * Math.PI * 2; return c.map((x, i) => x + (u[i] * Math.cos(th) + v[i] * Math.sin(th)) * r); }));
  for (let r = 0; r < pts.length - 1; r++) for (let k = 0; k < seg; k++) {
    const k2 = (k + 1) % seg, A = pts[r][k], B = pts[r][k2], C = pts[r + 1][k2], D = pts[r + 1][k], c = rings[r][0];
    buf.quad(A, B, C, D, [(A[0] + C[0]) / 2 - c[0] - a[0] * 0.01, (A[1] + C[1]) / 2 - c[1], (A[2] + C[2]) / 2 - c[2]]);
  }
  const tip = p1.map((x, i) => x + a[i] * r1), last = rings[3][0];
  for (let k = 0; k < seg; k++) buf.tri(pts[3][k], pts[3][(k + 1) % seg], tip, [pts[3][k][0] - last[0], pts[3][k][1] - last[1], pts[3][k][2] - last[2]]);
}
function ellipsoid(buf, c, ra, ry, rl, seg, rings) {
  const P = (i, k) => { const th = i / rings * Math.PI, ph = k / seg * Math.PI * 2; return [c[0] + ra * Math.sin(th) * Math.cos(ph), c[1] - ry * Math.cos(th), c[2] + rl * Math.sin(th) * Math.sin(ph)]; };
  for (let i = 0; i < rings; i++) for (let k = 0; k < seg; k++) {
    const A = P(i, k), B = P(i, k + 1), C = P(i + 1, k + 1), D = P(i + 1, k), m = [(A[0] + C[0]) / 2 - c[0], (A[1] + C[1]) / 2 - c[1], (A[2] + C[2]) / 2 - c[2]];
    if (i === 0) buf.tri(A, C, D, m); else if (i === rings - 1) buf.tri(A, B, C, m); else buf.quad(A, B, C, D, m);
  }
}

// The giant 1927 four-fingered glove, opening toward home plate (west): a rounded heel and palm, four
// fanned tapered fingers and a thumb, on a support post.
export function giantGlove(b, B, near) {
  const g = T(84, -33), W = (a, y, l) => [g[0] - a, y, g[1] + l], hand = B('clay'), seg = near ? 8 : 5;
  ellipsoid(hand, W(0.2, DECK + 3.3, 0.5), 2.8, 3.5, 5.0, seg, near ? 6 : 4);
  const fingers = [[-3.5, 5.8, -9], [-1.2, 6.8, -3], [1.2, 6.4, 3.5], [3.5, 5.2, 8]];
  for (const [l, len, splay] of fingers) {
    const s = splay * Math.PI / 180;
    capsule(hand, W(0.2, DECK + 5.2, l), W(1.0, DECK + 5.2 + len * Math.cos(s), l + len * Math.sin(s)), 1.5, 1.25, seg);
  }
  capsule(hand, W(0.3, DECK + 2.8, 3.8), W(1.1, DECK + 7.0, 7.6), 1.8, 1.35, seg); // thumb, toward the south
  b.bar('steel', W(-0.4, DECK - 0.2, -1.4), W(-0.4, DECK + 1.2, -1.4), 0.3, 0.3);
}

// Flagpoles with pennants along the east plaza.
export function flagpoles(b, B, near) {
  const base = T(106, 24);
  for (let k = 0; k < 6; k++) {
    const x = base[0], z = base[1] + k * 4.6, h = 15 + (k % 3) * 1.8;
    b.bar('steel', [x, 0, z], [x, h, z], 0.14, 0.14, 0, true);
    if (near) B('sign').tri([x, h - 0.2, z], [x, h - 1.5, z], [x + 2.6, h - 0.85, z + 0.4], [0, 0, 1]), B('sign').tri([x, h - 0.2, z], [x, h - 1.5, z], [x + 2.6, h - 0.85, z + 0.4], [0, 0, -1]);
  }
}

// ORACLE PARK in tall orange block letters on the roof of the entrance pavilion, facing the plaza.
const GLYPH = {
  O: [[0.6, 0, 2.4, 1], [0.6, 4, 2.4, 5], [0, 0.6, 1, 4.4], [2, 0.6, 3, 4.4]],
  R: [[0, 0, 1, 5], [1, 4, 3, 5], [2, 2.5, 3, 4], [1, 2, 3, 3], [1.5, 1, 2.5, 2], [2, 0, 3, 1]],
  A: [[0, 0, 1, 4], [2, 0, 3, 4], [0, 4, 3, 5], [1, 2, 2, 3]],
  C: [[0.6, 0, 3, 1], [0.6, 4, 3, 5], [0, 0.6, 1, 4.4]],
  L: [[0, 0, 1, 5], [1, 0, 3, 1]],
  E: [[0, 0, 1, 5], [1, 0, 3, 1], [1, 2, 2.6, 3], [1, 4, 3, 5]],
  P: [[0, 0, 1, 5], [1, 4, 3, 5], [2, 2, 3, 4], [1, 2, 3, 3]],
  K: [[0, 0, 1, 5], [1, 2, 2, 3], [2, 3, 3, 5], [2, 0, 3, 2]],
};
export function entranceSign(B, near) {
  const i = 13, e = edge(i), word = 'ORACLE PARK', u = 0.64, pitch = 3.9 * u, total = pitch * word.length - 0.9 * u;
  const s0 = (e.L - total) / 2, y0 = EDGE_H[i] - 0.1, inset = 0.9, yaw = -Math.atan2(e.u[1], e.u[0]);
  if (!near) { const c = [e.a[0] + e.u[0] * e.L / 2 - e.n[0] * inset, y0 + 1.7, e.a[1] + e.u[1] * e.L / 2 - e.n[1] * inset]; B('sign').box(c, [total, 3.4, 0.5], yaw); return; }
  [...word].forEach((ch, n) => {
    for (const [x0, ya, x1, yb] of GLYPH[ch] || []) {
      const s = s0 + n * pitch + (x0 + x1) / 2 * u, c = [e.a[0] + e.u[0] * s - e.n[0] * inset, y0 + (ya + yb) / 2 * u, e.a[1] + e.u[1] * s - e.n[1] * inset];
      B('sign').box(c, [(x1 - x0) * u, (yb - ya) * u, 0.5], yaw);
    }
  });
}

// Arched openings in the 24 ft right-field wall (fenced archways onto McCovey Cove) and the four
// fountain pillars on top of it. The wall line is the mapped field edge.
export function rightFieldWall(B, near, near_chain) {
  const pts = near_chain, c = T(5, 10);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 8) continue;
    const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    let n = [u[1], -u[0]];
    if (n[0] * (c[0] - a[0]) + n[1] * (c[1] - a[1]) < 0) n = [-n[0], -n[1]];
    const count = Math.floor(L / 5.2), pitch = L / count, at = (s, off, y) => [a[0] + u[0] * s + n[0] * off, y, a[1] + u[1] * s + n[1] * off];
    for (let k = 0; k < count; k++) {
      const sc = (k + 0.5) * pitch, r = 1.5, pts2 = [at(sc - r, 0.1, 0.5), at(sc + r, 0.1, 0.5)];
      for (let j = 0; j <= (near ? 5 : 2); j++) { const t = j * Math.PI / (near ? 5 : 2); pts2.push(at(sc + r * Math.cos(t), 0.1, 3.4 + r * Math.sin(t))); }
      B('glass').poly3(pts2, [n[0], 0, n[1]]);
    }
  }
}

// Rooftop plant on the big flat roofs of the west entrance block (25 m) and the south-west wing
// (22 m): a few boxes so the roofs read as roofs from above. Positions are estimates.
export function roofPlant(B) {
  const c = B('concrete');
  const west = [[-131, 52, 4.2, 2.6, 3.4, 0.2], [-141, 62, 5.0, 2.8, 3.0, -0.3], [-129, 74, 3.6, 2.4, 3.8, 0.1], [-138, 80, 6.0, 3.0, 3.0, 0.5], [-126, 90, 4.0, 2.6, 3.4, 0], [-124, 40, 3.4, 2.2, 3.0, 0.4]];
  const south = [[-82, 98, 5.0, 2.8, 3.2, 0.7], [-92, 108, 6.0, 3.0, 3.0, 0.7], [-100, 98, 4.0, 2.6, 3.6, -0.7], [-106, 108, 5.2, 2.6, 3.0, 0.7], [-88, 118, 3.8, 2.4, 3.2, 0.7], [-114, 100, 4.4, 2.6, 3.2, 0.7]];
  for (const [list, roof] of [[west, 25], [south, 22]]) {
    for (const [x, z, sx, sy, sz, yaw] of list) { const p = T(x, z); c.box([p[0], roof - 0.3 + sy / 2 - 0.4, p[1]], [sx, sy + 0.4, sz], yaw); }
  }
}
