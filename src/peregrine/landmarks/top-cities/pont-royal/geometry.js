// Pont Royal: five three-centred masonry arches, four piers with pointed cutwaters under pyramidal
// chaperons, a plain cornice and solid parapet over a gently humped deck, flared mouths at the
// quays and the hydrometric scales on the two end piers. Original procedural geometry.
import { BufferGeometry, Float32BufferAttribute, ShapeUtils, Vector2 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import * as P from './pont-royal-profile.js';

const clamp01 = v => Math.max(0, Math.min(1, v));
const { TX, TZ } = P.AXIS;
// Structural direction (u, d, y) to world (x, y, z).
const dirWorld = ([hu, hd, hy]) => [TX * hu - TZ * hd, hy, TZ * hu + TX * hd];

// Chaperon and cutwater heights above the normal river level P.RIVER (photographic estimates).
export const CUTWATER = { reach: 4.3, base: 4.6, top: 3.6, coping: 4.15, apex: 6.4 };
export const APRON = 1.2, WALK_W = 2.85, CORNICE_Y = [-0.52, -0.1], PARAPET_TOP = 1.1, COPING_TOP = 1.22, WALK_Y = 0.15;

/** Cosine of the parapet line's angle to the axis at u (1 on the straight faces). */
export function cosFlare(u, side) {
  if (u > P.U_FLARE_S && u < P.U_FLARE_N) return 1;
  const [a, c, f] = u <= P.U_FLARE_S ? [P.U_END_S, P.U_FLARE_S, P.flareHalf(P.U_END_S, side)] : [P.U_FLARE_N, P.U_END_N, P.flareHalf(P.U_END_N, side)];
  return Math.cos(Math.atan2(f - P.FACE, Math.abs(c - a)));
}

/** Height of the face's solid edge above an arch (ring extrados), or 0 off the arches. */
export function extradosY(u) {
  for (const arch of P.ARCHES) {
    const curve = P.archCurve(arch, P.RING);
    if (u < arch.a - P.RING || u > arch.c + P.RING) continue;
    let lo = 0, hi = Math.PI, right = u > arch.mid;
    // Bisection on phi over the half that contains u (x decreases monotonically with phi).
    if (right) hi = Math.PI / 2; else lo = Math.PI / 2;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (curve(m)[0] > u) lo = m; else hi = m; }
    return Math.max(P.RIVER, curve((lo + hi) / 2)[1]);
  }
  return P.RIVER;
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', p = P.PROFILE, b = bridgeBuilder(p, detail);
  const ch = u => (near && u > P.U_CENTRE ? 1 : 0);
  // Rigid masonry: everything rides with the deck (lift 1); the piers and quay walls reach FOOT,
  // below the riverbed, so a bank-fitted deck never leaves a support short of the ground.
  const structLift = () => 1;

  /** Triangles of (u, d, y) points, each oriented so its normal follows hint(centroid). */
  function tris(mat, verts, faces, hint, lift = 'struct', smooth = false) {
    const pos = [], idx = [], w = [];
    const W = verts.map(([u, d, y]) => P.xyz(u, d, y));
    const push = (i) => { pos.push(...W[i]); w.push(lift === 'struct' ? structLift(verts[i][0], verts[i][2]) : lift); return pos.length / 3 - 1; };
    const shared = smooth ? verts.map((_, i) => push(i)) : null;
    for (const [a, c, e] of faces) {
      const A = W[a], C = W[c], E = W[e];
      const n = [(C[1] - A[1]) * (E[2] - A[2]) - (C[2] - A[2]) * (E[1] - A[1]), (C[2] - A[2]) * (E[0] - A[0]) - (C[0] - A[0]) * (E[2] - A[2]), (C[0] - A[0]) * (E[1] - A[1]) - (C[1] - A[1]) * (E[0] - A[0])];
      if (Math.hypot(...n) < 1e-6) continue; // degenerate (a zero-width end of a flare)
      const m = [0, 1, 2].map(k => (verts[a][k] + verts[c][k] + verts[e][k]) / 3), h = dirWorld(hint(m));
      const order = n[0] * h[0] + n[1] * h[1] + n[2] * h[2] >= 0 ? [a, c, e] : [a, e, c];
      if (smooth) idx.push(...order.map(i => shared[i])); else idx.push(...order.map(push));
    }
    if (!idx.length) return;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const u0 = verts.reduce((s, v) => s + v[0], 0) / verts.length;
    b.put(g, mat, ch(u0), 1);
    const lw = g.attributes.bridgeLift; w.forEach((v, i) => lw.setX(i, v));
  }
  /** Quad strip between two polylines of (u, d, y) points. */
  function strip(mat, left, right, hint, lift = 'struct', smooth = false) {
    const verts = [...left, ...right], n = left.length, faces = [];
    for (let i = 0; i < n - 1; i++) faces.push([i, i + 1, n + i], [i + 1, n + i + 1, n + i]);
    tris(mat, verts, faces, hint, lift, smooth);
  }
  /** Planar polygon (u, y) at lateral d facing side. */
  function facePolygon(mat, contour, d, side, lift = 'struct') {
    const v2 = contour.map(([u, y]) => new Vector2(u, y));
    const faces = ShapeUtils.triangulateShape(v2, []);
    tris(mat, contour.map(([u, y]) => [u, d, y]), faces, () => [0, side, 0], lift);
  }

  const archN = near ? 36 : 14;
  const sampleU = (a, c, step) => { const out = []; const n = Math.max(1, Math.ceil(Math.abs(c - a) / step)); for (let i = 0; i <= n; i++) out.push(a + (c - a) * i / n); return out; };

  // ---- Spandrel faces with the five openings, and the arch soffits. ----
  // Each opening runs from the riverbed (FOOT) up the pier faces to the springing and round the
  // arch. The face is split at grade: below it is 'masonry' (shown on terrain only, layer.js), and
  // the strip of face above grade under the humped crown is 'stone', so in Cityscape the cornice
  // never hovers over the water.
  const contour = [];
  for (const arch of P.ARCHES) {
    const curve = P.archCurve(arch);
    contour.push([arch.a, P.FOOT]);
    for (let i = 0; i <= archN; i++) contour.push(curve(Math.PI - Math.PI * i / archN));
    contour.push([arch.c, P.FOOT]);
  }
  const faceTop = sampleU(P.U_SPRING_S, P.U_SPRING_N, near ? 2 : 4).map(u => [u, P.deckTop(u) - 0.35]);
  for (const [u, y] of faceTop.slice().reverse()) contour.push([u, Math.min(y, 0)]);
  for (const side of [-1, 1]) {
    facePolygon('masonry', contour, side * P.FACE, side);
    strip('stone', faceTop.map(([u, y]) => [u, side * P.FACE, Math.min(y, 0)]), faceTop.map(([u, y]) => [u, side * P.FACE, y]), () => [0, side, 0]);
  }

  for (const arch of P.ARCHES) {
    const curve = P.archCurve(arch), rows = [[arch.c, P.FOOT]];
    for (let i = 0; i <= archN; i++) rows.push(curve(Math.PI * i / archN));
    rows.push([arch.a, P.FOOT]);
    const mid = [arch.mid, 0, P.SPRING_Y + arch.rise * 0.45];
    strip('glow', rows.map(([u, y]) => [u, -P.FACE, y]), rows.map(([u, y]) => [u, P.FACE, y]), m => [mid[0] - m[0], 0, mid[2] - m[2]], 'struct', true);
  }

  // ---- Voussoir head rings, 0.12 m proud of both faces. ----
  for (const arch of P.ARCHES) {
    const inner = P.archCurve(arch), outer = P.archCurve(arch, P.RING);
    const fi = 0, fo = 0; // from springing to springing
    const count = near ? 2 * Math.round(arch.half / 0.95) + 1 : 11, gap = near ? 0.05 / (arch.half * 1.2) : 0;
    for (const side of [-1, 1]) {
      const d0 = side * (P.FACE - 0.05), d1 = side * (P.FACE + 0.12);
      for (let k = 0; k < count; k++) {
        const a = fi + (Math.PI - 2 * fi) * k / count + (k ? gap : 0), c = fi + (Math.PI - 2 * fi) * (k + 1) / count - (k < count - 1 ? gap : 0);
        const ia = inner(a), ic = inner(c), oa = outer(k ? a : fo), oc = outer(k === count - 1 ? Math.PI - fo : c);
        const q = [ia, ic, oc, oa];
        const centre = [arch.mid, 0, P.SPRING_Y];
        const verts = [...q.map(([u, y]) => [u, d1, y]), ...q.map(([u, y]) => [u, d0, y])];
        // Front, intrados, extrados and the two radial joints (the back is buried in the face).
        const faces = [[0, 1, 2], [0, 2, 3], [0, 1, 5], [0, 5, 4], [3, 2, 6], [3, 6, 7], [0, 3, 7], [0, 7, 4], [1, 2, 6], [1, 6, 5]];
        // Joint faces point along the ring; intrados faces point to the centre.
        const orient = (fa) => {
          const [i, j, l] = fa, m = [0, 1, 2].map(t => (verts[i][t] + verts[j][t] + verts[l][t]) / 3);
          if (Math.abs(m[1]) > P.FACE + 0.11) return [0, side, 0];
          const set = new Set(fa.map(v => v % 4));
          const du = m[0] - centre[0], dy = m[2] - centre[2], r = Math.hypot(du, dy) || 1;
          if ((set.has(0) && set.has(1)) && !set.has(2) && !set.has(3)) return [-du / r, 0, -dy / r];
          if ((set.has(2) && set.has(3)) && !set.has(0) && !set.has(1)) return [du / r, 0, dy / r];
          const tang = [-dy / r, 0, du / r]; // increasing phi
          return set.has(0) && set.has(3) ? tang.map(v => -v) : tang;
        };
        for (const fa of faces) tris('ring', verts, [fa], () => orient(fa));
      }
    }
  }

  // ---- Cutwaters, copings and pyramidal chaperons on both faces of every pier. ----
  for (const s of P.PIERS) for (const side of [-1, 1]) {
    const back = side * (P.FACE - 0.3), R = P.RIVER, cw = CUTWATER;
    const plan = (half, reach) => [[s - half, back], [s, side * (P.FACE + reach)], [s + half, back]];
    const out = m => { const du = m[0] - s, dd = m[1] - back; return [du, dd, 0]; };
    const prism = (mat, pts, y0, y1, top, bottom) => {
      const v = [...pts.map(([u, d]) => [u, d, y0]), ...pts.map(([u, d]) => [u, d, y1])];
      const f = [[0, 1, 4], [0, 4, 3], [1, 2, 5], [1, 5, 4]];
      tris(mat, v, f, out);
      if (top) tris(mat, v, [[3, 4, 5]], () => [0, 0, 1]);
      if (bottom) tris(mat, v, [[0, 1, 2]], () => [0, 0, -1]);
    };
    prism('masonry', plan(cw.base / 2, cw.reach), P.FOOT, R + cw.top, false, false);
    prism('ring', plan(cw.base / 2 + 0.22, cw.reach + 0.33), R + cw.top, R + cw.coping, true, true);
    const base = plan(cw.base / 2 + 0.06, cw.reach + 0.1), apex = [s, back, R + cw.apex];
    const v = [...base.map(([u, d]) => [u, d, R + cw.coping]), apex];
    tris('masonry', v, [[0, 1, 3], [1, 2, 3]], m => { const n = out(m); return [n[0], n[1], 0.8]; });
  }

  // ---- Flood scales on the downstream flank of the two end piers (engraved metres + gauge). ----
  if (near) for (const [s, toward] of [[P.PIERS[0], 1], [P.PIERS.at(-1), -1]]) {
    const side = -1, back = side * (P.FACE - 0.3), tip = [s, side * (P.FACE + CUTWATER.reach)], heel = [s + toward * CUTWATER.base / 2, back];
    const A = P.xyz(heel[0], heel[1], 0), B = P.xyz(tip[0], tip[1], 0), fx = B[0] - A[0], fz = B[2] - A[2], fl = Math.hypot(fx, fz);
    const fdir = [fx / fl, fz / fl];
    // Outward normal of that flank, away from the pier centre.
    const C = P.xyz(s, back, 0); let nx = -fdir[1], nz = fdir[0];
    const mx = (A[0] + B[0]) / 2 - C[0], mz = (A[2] + B[2]) / 2 - C[2]; if (nx * mx + nz * mz < 0) { nx = -nx; nz = -nz; }
    const angle = Math.atan2(-fdir[1], fdir[0]);
    const at = (t, off, y) => [A[0] + fx * t + nx * off, y, A[2] + fz * t + nz * off];
    const put = (mat, t, off, y, size) => b.localBox(mat, at(t, off, P.RIVER + y), size, angle, ch(s), 1);
    for (let k = 0; k < 11; k++) put('mark', 0.42, 0.05, 0.35 + k * 0.3, [k % 2 ? 0.22 : 0.4, 0.06, 0.14]);
    put('gauge', 0.2, 0.06, 1.65, [0.3, 2.9, 0.16]);
    for (let k = 0; k < 14; k++) put('mark', 0.2 + (k % 2 ? 0.025 : -0.025), 0.18, 0.4 + k * 0.2, [k % 2 ? 0.1 : 0.16, 0.05, 0.12]);
  }

  // ---- Outer line per side: straight faces, flared to the quay corners. ----
  const pathPts = side => [[P.U_END_S, side * P.flareHalf(P.U_END_S, side)], [P.U_FLARE_S, side * P.FACE], [P.U_FLARE_N, side * P.FACE], [P.U_END_N, side * P.flareHalf(P.U_END_N, side)]];
  /** Points along the outer line, each offset inward by `off` (mitred), with its u for heights. */
  function along(side, off, step) {
    const pts = pathPts(side), out = [];
    const normal = (a, c) => { const du = c[0] - a[0], dd = c[1] - a[1], l = Math.hypot(du, dd); return [-dd / l * side * -1, du / l * side * -1]; };
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], c = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / step));
      for (let k = i ? 1 : 0; k <= n; k++) {
        const t = k / n, u = a[0] + (c[0] - a[0]) * t, d = a[1] + (c[1] - a[1]) * t;
        let nrm = normal(a, c);
        if ((k === n && i < pts.length - 2) || (k === 0 && i > 0)) { const m = k === n ? normal(c, pts[i + 2]) : normal(pts[i - 1], a); const sx = nrm[0] + m[0], sd = nrm[1] + m[1], dot = (sx * nrm[0] + sd * nrm[1]) / 2 || 1; nrm = [sx / 2 / dot, sd / 2 / dot]; }
        out.push([u + nrm[0] * off, d + nrm[1] * off]);
      }
    }
    return out;
  }
  const inward = side => m => [0, -side, 0];
  const outwardOf = side => m => [0, side, 0];
  const step = near ? 2 : 4;
  for (const side of [-1, 1]) {
    // Inward offsets: positive towards the axis. Cornice -0.30..0, parapet 0..0.5, coping -0.06..0.56.
    const line = (off, y) => along(side, off, step).map(([u, d]) => [u, d, P.deckTop(u) + y]);
    // Cornice band.
    strip('trim', line(-0.30, CORNICE_Y[0]), line(-0.30, CORNICE_Y[1]), outwardOf(side), 1);
    strip('trim', line(-0.30, CORNICE_Y[1]), line(0, CORNICE_Y[1]), () => [0, 0, 1], 1);
    strip('trim', line(-0.30, CORNICE_Y[0]), line(0.25, CORNICE_Y[0]), () => [0, 0, -1], 1);
    // Solid parapet and its coping.
    const top = near ? PARAPET_TOP : COPING_TOP;
    strip('stone', line(0, CORNICE_Y[1]), line(0, top), outwardOf(side), 1);
    strip('stone', line(0.5, WALK_Y), line(0.5, top), inward(side), 1);
    if (near) {
      strip('trim', line(-0.06, COPING_TOP), line(0.56, COPING_TOP), () => [0, 0, 1], 1);
      strip('trim', line(-0.06, PARAPET_TOP), line(-0.06, COPING_TOP), outwardOf(side), 1);
      strip('trim', line(0.56, PARAPET_TOP), line(0.56, COPING_TOP), inward(side), 1);
    } else strip('stone', line(0, top), line(0.5, top), () => [0, 0, 1], 1);
  }

  // ---- Flared mouths: wing spandrels over the bank arches, and the quay end walls. ----
  for (const [uFlare, uSpring, uEnd] of [[P.U_FLARE_S, P.U_SPRING_S, P.U_END_S], [P.U_FLARE_N, P.U_SPRING_N, P.U_END_N]]) {
    const dirU = Math.sign(uEnd - uFlare);
    for (const side of [-1, 1]) {
      const us = sampleU(uFlare, uSpring, near ? 1 : 2.5);
      // A corbelled apron: the flared parapet stands on a 1.6 m slab over the bank arch, which
      // stays open beneath it; the quay end wall carries its outer corner.
      const outer = us.map(u => [u, side * P.flareHalf(u, side)]), lowY = u => Math.max(P.deckTop(u) - APRON, extradosY(u) + 0.03);
      strip('masonry', outer.map(([u, d]) => [u, d, lowY(u)]), outer.map(([u, d]) => [u, d, P.deckTop(u) - 0.35]), outwardOf(side));
      strip('masonry', us.map(u => [u, side * P.FACE, lowY(u)]), outer.map(([u, d]) => [u, d, lowY(u)]), () => [0, 0, -1]);
      // Quay end wall: flared outer face, end face, and its return beside the bank arch.
      const fS = P.flareHalf(uSpring, side), fE = P.flareHalf(uEnd, side);
      strip('masonry', [[uSpring, side * fS, P.FOOT], [uEnd, side * fE, P.FOOT]], [[uSpring, side * fS, P.deckTop(uSpring) - 0.35], [uEnd, side * fE, P.deckTop(uEnd) - 0.35]], outwardOf(side));
      strip('masonry', [[uSpring, side * P.FACE, P.FOOT], [uSpring, side * fS, P.FOOT]], [[uSpring, side * P.FACE, lowY(uSpring)], [uSpring, side * fS, lowY(uSpring)]], () => [-dirU, 0, 0]);
    }
    // Abutment end face across the full width, buried under the quay street; and the parapet's
    // end caps at the quay corners, where the walks run on to the quay pavements.
    const fW = P.flareHalf(uEnd, -1), fE = P.flareHalf(uEnd, 1);
    strip('masonry', [[uEnd, -fW, P.FOOT], [uEnd, fE, P.FOOT]], [[uEnd, -fW, P.deckTop(uEnd) - 0.3], [uEnd, fE, P.deckTop(uEnd) - 0.3]], () => [dirU, 0, 0]);
    const cy = P.deckTop(uEnd), endAt = (side, off) => { const pts = along(side, off, 1); return dirU < 0 ? pts[0] : pts.at(-1); };
    const cap = (mat, side, [o0, o1], [y0, y1]) => { const p0 = endAt(side, o0), p1 = endAt(side, o1);
      strip(mat, [[...p0, cy + y0], [...p1, cy + y0]], [[...p0, cy + y1], [...p1, cy + y1]], () => [dirU, 0, 0], 1); };
    for (const side of [-1, 1]) {
      cap('trim', side, [-0.30, 0.25], CORNICE_Y);
      cap('stone', side, near ? [-0.06, 0.56] : [0, 0.5], [CORNICE_Y[1], COPING_TOP]);
    }
  }

  // ---- Walks along the parapets (2.85 m, narrowing only where the turning carriageway needs
  // it) and, in the flared mouths, ONE fan of setts from walk to walk at the deck level (0.10 m
  // over the quay grade): the turning carriageway and the quay links are the same paving, so there
  // is no second surface to step, and on terrain no part of it sits under the ground. ----
  const walkInner = (u, side) => {
    const fh = P.flareHalf(u, side), c = cosFlare(u, side), fan = side * (fh - 0.5 / c - WALK_W), edge = P.roadEdgeD(u, side);
    const lim = side * (fh - 1.4 / c);
    const v = side < 0 ? Math.min(fan, edge) : Math.max(fan, edge);
    return side < 0 ? Math.max(v, lim) : Math.min(v, lim);
  };
  const walkUs = [...new Set([...sampleU(P.U_END_S, P.U_FLARE_S, 0.5), ...sampleU(P.U_FLARE_S, P.U_FLARE_N, near ? 2 : 4), ...sampleU(P.U_FLARE_N, P.U_END_N, 0.5), P.U_HUMP_S, P.U_HUMP_N].map(v => +v.toFixed(4)))].sort((a, c) => a - c);
  for (const side of [-1, 1]) {
    const us = walkUs;
    const inner = us.map(u => [u, walkInner(u, side), P.deckTop(u) + WALK_Y]);
    const outer = us.map(u => [u, side * (P.flareHalf(u, side) - 0.5 / cosFlare(u, side)), P.deckTop(u) + WALK_Y]);
    strip('walk', inner, outer, () => [0, 0, 1], 1);
    strip('walk', inner.map(([u, d, y]) => [u, d, y - WALK_Y]), inner, () => [0, -side, 0], 1);
    for (const [k, dirU] of [[0, -1], [us.length - 1, 1]]) {
      const [u, d0] = inner[k], d1 = outer[k][1], y = inner[k][2];
      strip('walk', [[u, d0, y - WALK_Y], [u, d1, y - WALK_Y]], [[u, d0, y], [u, d1, y]], () => [dirU, 0, 0], 1);
    }
  }
  for (const [a, c, dirU] of [[P.U_END_S, P.U_HUMP_S, -1], [P.U_HUMP_N, P.U_END_N, 1]]) {
    const us = walkUs.filter(u => u >= a && u <= c);
    const y = P.H_END;
    // Several lanes of vertices across the fan, so on terrain each takes the crossfall of the
    // ground at its own lateral position (lateralBankFit) instead of cutting a chord through it.
    // At the hump line they include the carriageway's own lanes (+-5, +-2.5, 0), so the two
    // surfaces share their seam vertices.
    const across = near ? 24 : 12, at = (u, k) => walkInner(u, -1) + (walkInner(u, 1) - walkInner(u, -1)) * k / across;
    for (let k = 0; k < across; k++) strip('setts', us.map(u => [u, at(u, k), y]), us.map(u => [u, at(u, k + 1), y]), () => [0, 0, 1], 1);
    const end = dirU < 0 ? us[0] : us.at(-1);
    strip('setts', [[end, walkInner(end, -1), y - 0.25], [end, walkInner(end, 1), y - 0.25]], [[end, walkInner(end, -1), y], [end, walkInner(end, 1), y]], () => [dirU, 0, 0], 1);
  }

  // ---- Carriageway: setts over the humped straight, between the two mouth fans. ----
  const samples = (a, c, dense) => { const set = new Set([a, c]); for (let s = Math.ceil(a / dense) * dense; s < c; s += dense) set.add(s); for (const v of p.ALIGNMENT) if (v.s > a && v.s < c) set.add(v.s); return [...set].sort((x, y) => x - y).filter((v, i, all) => !i || v - all[i - 1] > 0.05); };
  function road(mat, a, c, thick, chunkS) {
    const ss = samples(a, c, near ? 2 : 5), pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, q.y, q.z]; };
    const pos = [], idx = [];
    // The top is split across (m lanes) like the mouth fans, whose seam vertices it shares.
    const m = near ? 4 : 2, n = m + 3;
    // An end ring sits exactly on its fan's line (u = U_HUMP_S / U_HUMP_N): a ring square to the
    // road would leave a hairline wedge where the road is a hair off the structural axis.
    const snap = (s, q, uLine) => { if (uLine === null) return q; const { u } = P.axisUV(q[0], q[2]), c = p.bridgePoint(s, 0), k = (uLine - u) / (c.tx * TX + c.tz * TZ);
      return [q[0] + c.tx * k, q[1], q[2] + c.tz * k]; };
    const ring = (s, uLine) => { const [l, r] = p.roadEdges(s)[0], h = p.deckHeight(s), t = thick;
      return [...Array.from({ length: m + 1 }, (_, j) => pt(s, l + (r - l) * j / m, h)), pt(s, l, h - t), pt(s, r, h - t)].map(q => snap(s, q, uLine)); };
    const lineAt = s => (Math.abs(s - P.U_HUMP_S - P.S_OFFSET) < 1e-6 ? P.U_HUMP_S : Math.abs(s - P.U_HUMP_N - P.S_OFFSET) < 1e-6 ? P.U_HUMP_N : null);
    ss.forEach((s, i) => { pos.push(...ring(s, lineAt(s)).flat()); if (!i) return; const x = (i - 1) * n, y = i * n, bl = m + 1, br = m + 2;
      for (let j = 0; j < m; j++) idx.push(x + j, x + j + 1, y + j, x + j + 1, y + j + 1, y + j); // top
      if (thick) idx.push(x + bl, y + bl, x + br, x + br, y + bl, y + br, x, y, x + bl, x + bl, y, y + bl, x + m, x + br, y + m, x + br, y + br, y + m); });
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, mat, chunkS, 1);
  }
  const midS = P.U_CENTRE + P.S_OFFSET;
  road('setts', P.U_HUMP_S + P.S_OFFSET, midS, 0.35, 0); road('setts', midS, P.U_HUMP_N + P.S_OFFSET, 0.35, near ? 1 : 0);
  // Dashed lane divider of the two northbound lanes, on the bridge.
  for (let s = P.S_END_S + 4; s + 3 < P.S_END_N - 4; s += 9) b.strip('paint', s, s + 3, -0.07, 0.07, 0.03, 0, near && s > midS ? 1 : 0);

  return b.finish();
}
