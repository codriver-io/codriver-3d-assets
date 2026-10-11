// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, DESIGN } from './config.js';
import { TOWERS, TOWER_RINGS, PODIUM, NEIGHBOURS } from './bankers-hall-plan.js';
import { meshBuilder, clockwise, outward, inside, hash } from './bankers-hall-parts.js';

// Bankers Hall: two identical 197 m towers (West 2000, East 1989; the plans are mirror images) on a shared
// four-level retail podium.
//   * Each tower is the mapped plan (two staggered blocks): a main rectangle with a 6 m "ear" at each end on opposite
//     sides, the ears topping out at 116 m. The main rectangle rises flat on its south face to the 173 m shaft top and
//     steps down to the north in three tiers (158 m, 134 m, 116 m), which is the stepped silhouette in the photographs.
//   * Facade: a pink-tan stone wall with a grid of punched windows (one pane per window near, banded far), a
//     double-height glass lobby where the tower meets the street.
//   * Crown: the signature truncated-pyramid roof of ribbed gold-bronze metal above a ledge, with a pedimented
//     glass slot (a dormer gable over a 7 m wide light strip) on the south and north faces, masts and red beacons.
//   * Podium: the three mapped building parts (4, 5 and 3 levels) as dark stone with glazed bands, and a glazed
//     ridge skylight over the galleria between the towers.

const { podium: PODIUM_H, shaftTop: TOP, tiers, cuts, crownH, crownInset, topInset, floor0, pitch, rows } = DESIGN;
const SLOT_U = { west: 1.36, east: -9.0 }; // slot centre across the tower: beside the stagger seam of the mapped plan, its pediment clear of the 2 m jog in the East tower's south wall
const MATS = ['stone', 'glass', 'glow', 'light', 'lamp', 'crown', 'silver', 'metal', 'podium', 'roof'];
const PARTS = [['p5', PODIUM_H.p5, PODIUM.p5], ['roof', PODIUM_H.roof, PODIUM.roof], ['p4', PODIUM_H.p4, PODIUM.p4]];
// Roof height of whatever stands at a point next to the model: its own podium parts, then the neighbouring buildings
// that stay provider geometry (0 = street level).
const probe = (x, z) => { for (const [, h, ring] of PARTS) if (inside(ring, x, z)) return { h, ext: false }; for (const n of NEIGHBOURS) if (inside(n.ring, x, z)) return { h: n.h, ext: true }; return { h: 0, ext: false }; };
const SHY = 0.3; // a wall shared with a provider building is recessed this far into the model, so the two cannot flicker
const lerp2 = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

export function create({ detail = 'near' } = {}) {
  const far = detail === 'far';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const mats = Object.fromEntries(MATS.map((m) => [m, meshBuilder()]));
  const off = far ? 0.4 : 0.15; // window stand-off from the wall
  const metal = far ? 'podium' : 'metal'; // far folds the minor metal and the roof grey into the podium colour (draw budget)
  if (far) mats.roof = mats.podium;

  // ---------------------------------------------------------------------------------------------- towers
  function tower(key, index) {
    const T = TOWERS[key], a = T.deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const pt = (u, w) => [T.c[0] + u * ca - w * sa, T.c[1] + u * sa + w * ca];
    const nU = [ca, sa], nW = [-sa, ca];
    const M = T.main, N = T.north, S = T.south;
    const X = T.notch; // a small jog in the main rectangle's south wall (East tower)
    const us = [...new Set([M.u[0], M.u[1], N.u[0], N.u[1], S.u[0], S.u[1], ...(X ? X.u : [])])].sort((p, q) => p - q);
    const ws = [...new Set([N.w[0], M.w[0], ...cuts.slice(1).map((c) => M.w[0] + c), M.w[1], S.w[1], ...(X ? X.w : [])])].sort((p, q) => p - q);
    const within = (r, u, w) => u >= r.u[0] && u <= r.u[1] && w >= r.w[0] && w <= r.w[1];
    const hAt = (u, w) => {
      if (X && within(X, u, w) && !within(S, u, w)) return 0;
      if (within(M, u, w)) { let k = 0; cuts.forEach((c, i) => { if (w - M.w[0] >= c) k = i; }); return tiers[k]; }
      return within(N, u, w) || within(S, u, w) ? tiers[0] : 0;
    };
    const H = us.slice(1).map((_, i) => ws.slice(1).map((__, j) => hAt((us[i] + us[i + 1]) / 2, (ws[j] + ws[j + 1]) / 2)));
    const world = (axis, line, dir, t, o = 0) => (axis === 'w' ? pt(t, line + dir * o) : pt(line + dir * o, t));
    const normalOf = (axis, dir) => (axis === 'w' ? [dir * nW[0], dir * nW[1]] : [dir * nU[0], dir * nU[1]]);

    // Wall segments: every cell edge where this cell is taller than its neighbour, from the neighbour's roof (or the
    // podium / street outside the tower) up to the cell's own roof.
    const segs = [];
    for (let i = 0; i < us.length - 1; i++) for (let j = 0; j < ws.length - 1; j++) {
      const h = H[i][j]; if (!h) continue;
      const du = [us[i], us[i + 1]], dw = [ws[j], ws[j + 1]];
      const around = [
        ['u', us[i + 1], 1, dw, i + 2 < us.length ? H[i + 1][j] : 0], ['u', us[i], -1, dw, i > 0 ? H[i - 1][j] : 0],
        ['w', ws[j + 1], 1, du, j + 2 < ws.length ? H[i][j + 1] : 0], ['w', ws[j], -1, du, j > 0 ? H[i][j - 1] : 0],
      ];
      for (const [axis, line, dir, [r0, r1], hn] of around) {
        if (hn >= h) continue;
        if (hn > 0) { segs.push({ axis, line, dir, t0: r0, t1: r1, y0: hn, y1: h, ext: false }); continue; }
        const n = Math.max(1, Math.ceil((r1 - r0) / 0.5)); let cur = null;
        for (let k = 0; k < n; k++) {
          const t0 = r0 + (r1 - r0) * k / n, t1 = r0 + (r1 - r0) * (k + 1) / n;
          const [x, z] = world(axis, line, dir, (t0 + t1) / 2, 0.6), { h: y0, ext } = probe(x, z);
          if (cur && cur.y0 === y0 && cur.ext === ext) cur.t1 = t1; else { cur = { axis, line, dir, t0, t1, y0, y1: h, ext }; segs.push(cur); }
        }
      }
      mats.roof.facing([0, 1, 0], ...[[du[0], dw[0]], [du[1], dw[0]], [du[1], dw[1]], [du[0], dw[1]]].map(([u, w]) => { const [x, z] = pt(u, w); return [x, h, z]; }));
    }
    const groups = new Map();
    for (const s of segs) { const k = `${s.axis}|${s.line.toFixed(3)}|${s.dir}|${s.y0.toFixed(2)}|${s.y1.toFixed(2)}|${s.ext}`; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(s); }
    const runs = [];
    for (const list of groups.values()) {
      list.sort((p, q) => p.t0 - q.t0); let cur = { ...list[0] };
      for (const s of list.slice(1)) { if (s.t0 <= cur.t1 + 0.01) cur.t1 = Math.max(cur.t1, s.t1); else { runs.push(cur); cur = { ...s }; } }
      runs.push(cur);
    }

    // The pedimented slots: [wall line, outward direction along w, bottom of the slot].
    const slots = [{ line: M.w[1], dir: 1, y0: 150 }, { line: M.w[0] + cuts[3], dir: -1, y0: 160.5 }];
    const inSlot = (r, ta, tb, ya) => r.axis === 'w' && slots.some((s) => s.dir === r.dir && Math.abs(s.line - r.line) < 0.01 && tb > SLOT_U[key] - 3.5 && ta < SLOT_U[key] + 3.5 && ya > s.y0 - 0.4);

    runs.forEach((r, ri) => {
      const nrm = normalOf(r.axis, r.dir), hint = [nrm[0], 0, nrm[1]], L = r.t1 - r.t0;
      const quadAt = (mat, ta, tb, ya, yb, o) => {
        const A = world(r.axis, r.line, r.dir, ta, o), B = world(r.axis, r.line, r.dir, tb, o);
        mats[mat].facing(hint, [A[0], ya, A[1]], [A[0], yb, A[1]], [B[0], yb, B[1]], [B[0], ya, B[1]]);
      };
      quadAt('stone', r.t0, r.t1, r.y0, r.y1, 0);
      if (r.ext) quadAt('stone', r.t0, r.t1, 0, r.y0, -SHY); // against a provider building: recessed, plain, never seen through
      // Double-height glass lobby where the wall reaches the street.
      if (r.y0 < 1) {
        if (far) quadAt('glass', r.t0 + 0.8, r.t1 - 0.8, 1.2, 7, off);
        else for (let k = 0; k < Math.floor(L / 3); k++) { const t = r.t0 + (L - Math.floor(L / 3) * 3) / 2 + k * 3; quadAt('glass', t + 0.35, t + 2.65, 1.2, 7, off); }
      }
      if (far) { // continuous glass bands over two floors, cut into bays by stone piers
        const bays = Math.max(1, Math.ceil(L / 14)), bw = L / bays;
        for (let bi = 0; bi < bays; bi++) for (let j = 0; j < rows - 2; j++) {
          const ya = floor0 + j * pitch + 0.95, yb = ya + 1.75;
          if (ya < r.y0 + 0.4 || yb > r.y1 - 0.3) continue;
          const ta = r.t0 + bi * bw + 0.6, tb = r.t0 + (bi + 1) * bw - 0.6;
          if (inSlot(r, ta, tb, ya)) continue;
          quadAt(hash(index * 97 + ri, bi, j >> 1) < 0.5 ? 'glow' : 'glass', ta, tb, ya, yb, off);
        }
        if (r.y1 >= TOP - 0.01) for (let bi = 0; bi < bays; bi++) { const ta = r.t0 + bi * bw + 0.6, tb = r.t0 + (bi + 1) * bw - 0.6; if (!inSlot(r, ta, tb, TOP - 4) && TOP - 2 * pitch >= r.y0 + 0.4) quadAt(metal, ta, tb, TOP - 2 * pitch + 0.85, TOP - 0.8, off); }
        return;
      }
      const P = 1.5, WW = 1.05, k0 = Math.ceil((r.t0 + 0.25 - (P - WW) / 2) / P), k1 = Math.floor((r.t1 - 0.25 - (P + WW) / 2) / P);
      for (let rr = 0; rr < rows; rr++) {
        const ya = floor0 + rr * pitch + 0.85, yb = ya + 2.2;
        if (ya < r.y0 + 0.4 || yb > r.y1 - 0.3) continue;
        for (let k = k0; k <= k1; k++) {
          const ta = k * P + (P - WW) / 2, tb = ta + WW;
          if (inSlot(r, ta, tb, ya)) continue;
          // the top two floors under the crown are a dark mechanical band (louvres, unlit at night)
          quadAt(r.y1 >= TOP - 0.01 && rr >= rows - 2 ? metal : hash(index * 1000 + ri, k, rr) < 0.5 ? 'glow' : 'glass', ta, tb, ya, yb, off);
        }
      }
    });

    // Slot with its pedimented dormer, on the south face (tall) and the north face (the top tier).
    const uc = SLOT_U[key], crownMat = key === 'west' ? 'crown' : 'silver'; // Wikipedia: West topped by a gold roof, East by silver
    for (const s of slots) {
      const P3 = (u, o, y) => { const [x, z] = pt(u, s.line + s.dir * o); return [x, y, z]; };
      const hint = [s.dir * nW[0], 0, s.dir * nW[1]];
      const gl = mats.light, fr = mats[metal], st = mats.stone;
      const gw = 2.3, jw = 3.1; // glass half width, and the dark jamb outside it
      gl.facing(hint, P3(uc - gw, 0.25, s.y0), P3(uc + gw, 0.25, s.y0), P3(uc + gw, 0.25, TOP), P3(uc - gw, 0.25, TOP));
      for (const sgn of [-1, 1]) fr.facing(hint, P3(uc + sgn * gw, 0.3, s.y0), P3(uc + sgn * jw, 0.3, s.y0), P3(uc + sgn * jw, 0.3, TOP), P3(uc + sgn * gw, 0.3, TOP));
      const span = TOP - s.y0;
      for (const f of far ? [0.5] : [0.33, 0.66]) { const y = s.y0 + span * f; fr.facing(hint, P3(uc - gw, 0.35, y), P3(uc + gw, 0.35, y), P3(uc + gw, 0.35, y + 0.8), P3(uc - gw, 0.35, y + 0.8)); }
      const hw = 4.9, D = 5.6, y1 = TOP + 3.2, ya = TOP + 8.2;
      const F = (u, y) => P3(u, 0, y), B = (u, y) => P3(u, -D, y);
      st.facing(hint, F(uc - hw, TOP), F(uc + hw, TOP), F(uc + hw, y1), F(uc - hw, y1));
      st.facing(hint, F(uc - hw, y1), F(uc + hw, y1), F(uc, ya));
      for (const sgn of [-1, 1]) {
        const side = [sgn * nU[0], 0, sgn * nU[1]], up = [sgn * nU[0], 0.7, sgn * nU[1]];
        st.facing(side, F(uc + sgn * hw, TOP), B(uc + sgn * hw, TOP), B(uc + sgn * hw, y1), F(uc + sgn * hw, y1));
        mats[crownMat].facing(up, F(uc + sgn * hw, y1), F(uc, ya), B(uc, ya), B(uc + sgn * hw, y1));
      }
    }

    // Crown: truncated pyramid on a ledge, with ribs near.
    const u0 = M.u[0] + crownInset, u1 = M.u[1] - crownInset, w0 = M.w[0] + cuts[3] + crownInset, w1 = M.w[1] - crownInset;
    const E = [[u0, w0], [u1, w0], [u1, w1], [u0, w1]].map(([u, w]) => { const [x, z] = pt(u, w); return [x, TOP, z]; });
    const Tp = [[u0 + topInset, w0 + topInset], [u1 - topInset, w0 + topInset], [u1 - topInset, w1 - topInset], [u0 + topInset, w1 - topInset]].map(([u, w]) => { const [x, z] = pt(u, w); return [x, TOP + crownH, z]; });
    const ctr = [(E[0][0] + E[2][0]) / 2, TOP + crownH * 0.4, (E[0][2] + E[2][2]) / 2];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, e0 = E[i], e1 = E[j], t0 = Tp[i], t1 = Tp[j];
      const mid = [(e0[0] + e1[0] + t0[0] + t1[0]) / 4 - ctr[0], (e0[1] + e1[1] + t0[1] + t1[1]) / 4 - ctr[1], (e0[2] + e1[2] + t0[2] + t1[2]) / 4 - ctr[2]];
      mats[crownMat].facing(mid, e0, e1, t1, t0);
      if (!far) { // ribs: 0.3 m wide pinstripes of dark metal, 0.15 m proud of the slope
        const len = Math.hypot(e1[0] - e0[0], e1[2] - e0[2]), n = Math.max(2, Math.round(len / 2.4)), hw = 0.15 / len;
        const sl = [e1[0] - e0[0], 0, e1[2] - e0[2]], up = [t0[0] - e0[0], t0[1] - e0[1], t0[2] - e0[2]];
        const nn = [sl[1] * up[2] - sl[2] * up[1], sl[2] * up[0] - sl[0] * up[2], sl[0] * up[1] - sl[1] * up[0]], nl = Math.hypot(...nn) || 1;
        const sgn = nn[0] * mid[0] + nn[1] * mid[1] + nn[2] * mid[2] < 0 ? -1 : 1, o = nn.map((v) => v / nl * 0.15 * sgn);
        const at = (f, g) => [0, 1, 2].map((c) => { const lo = e0[c] + (e1[c] - e0[c]) * f, hi = t0[c] + (t1[c] - t0[c]) * f; return lo + (hi - lo) * g + o[c]; });
        for (let k = 1; k < n; k++) mats[key === 'west' ? metal : 'roof'].facing(mid, at(k / n - hw, 0.02), at(k / n + hw, 0.02), at(k / n + hw, 0.985), at(k / n - hw, 0.985));
      }
    }
    mats.roof.facing([0, 1, 0], ...Tp);
    // Masts and beacons on the flat top (estimated): two masts on one diagonal, red lamps on the other.
    const sink = 0.1;
    const mastAt = (p) => { b.bar(metal, [p[0], DESIGN.crownH + TOP - sink, p[2]], [p[0], DESIGN.mast - 0.5, p[2]], 0.12, 0.12); b.box('lamp', [p[0], DESIGN.mast - 0.25, p[2]], [0.5, 0.5, 0.5], -a); };
    mastAt(Tp[0]); mastAt(Tp[2]);
    for (const p of [Tp[1], Tp[3]]) b.box('lamp', [p[0], TOP + crownH + 0.35, p[2]], [0.8, 0.9, 0.8], -a);
  }

  // ---------------------------------------------------------------------------------------------- podium
  function podium() {
    for (const [name, Hp, raw] of PARTS) {
      const ring = clockwise(raw);
      mats.roof.cap(ring, Hp, [], true);
      for (let i = 0; i < ring.length; i++) {
        const p = ring[i], q = ring[(i + 1) % ring.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]);
        if (len < 0.05) continue;
        const n = outward(p, q), hint = [n[0], 0, n[1]], steps = Math.max(1, Math.ceil(len)), pieces = [];
        for (let k = 0; k < steps; k++) {
          const m = lerp2(p, q, (k + 0.5) / steps), o = [m[0] + n[0] * 0.6, m[1] + n[1] * 0.6];
          if (inside(TOWER_RINGS.west, o[0], o[1]) || inside(TOWER_RINGS.east, o[0], o[1])) continue;
          const { h: other, ext } = probe(o[0], o[1]);
          if (other >= Hp - 0.01 && !ext) continue;
          const last = pieces[pieces.length - 1];
          if (last && last.y0 === other && last.ext === ext && last.k1 === k) { last.k1 = k + 1; } else pieces.push({ y0: other, ext, k0: k, k1: k + 1 });
        }
        for (const pc of pieces) {
          const A = lerp2(p, q, pc.k0 / steps), B = lerp2(p, q, pc.k1 / steps), L = Math.hypot(B[0] - A[0], B[1] - A[1]);
          if (pc.y0 < Hp - 0.01) mats.podium.facing(hint, [A[0], pc.y0, A[1]], [A[0], Hp, A[1]], [B[0], Hp, B[1]], [B[0], pc.y0, B[1]]);
          if (pc.ext) { const top = Math.min(pc.y0, Hp), sh = [n[0] * SHY, n[1] * SHY]; mats.podium.facing(hint, [A[0] - sh[0], 0, A[1] - sh[1]], [A[0] - sh[0], top, A[1] - sh[1]], [B[0] - sh[0], top, B[1] - sh[1]], [B[0] - sh[0], 0, B[1] - sh[1]]); }
          if (pc.y0 > 0 || L < 3) continue; // glazing only on the street walls
          const glass = (ta, tb, ya, yb, mat = 'glass') => {
            const a0 = lerp2(A, B, ta / L), b0 = lerp2(A, B, tb / L);
            mats[mat].facing(hint, [a0[0] + n[0] * off, ya, a0[1] + n[1] * off], [a0[0] + n[0] * off, yb, a0[1] + n[1] * off], [b0[0] + n[0] * off, yb, b0[1] + n[1] * off], [b0[0] + n[0] * off, ya, b0[1] + n[1] * off]);
          };
          const levels = []; for (let l = 1; l * 4.4 + 3.2 <= Hp - 0.3; l++) levels.push(l * 4.4 + 1.0);
          if (far) { glass(0.8, L - 0.8, 0.8, 4.0); levels.forEach((y, li) => glass(0.8, L - 0.8, y, y + 2.2, hash(Math.round(A[0] * 7), Math.round(A[1] * 7), li + 5) < 0.4 ? 'glow' : 'glass')); continue; }
          const bays = Math.max(1, Math.round(L / 4.5)), bw = L / bays;
          for (let bi = 0; bi < bays; bi++) {
            const ta = bi * bw + 0.5, tb = (bi + 1) * bw - 0.5;
            glass(ta, tb, 0.8, 4.0);
            levels.forEach((y, li) => glass(ta, tb, y, y + 2.2, hash(Math.round(A[0] * 7) + bi, li, name.length) < 0.5 ? 'glow' : 'glass'));
          }
        }
      }
    }
    // Glazed ridge skylight over the galleria between the towers (estimated from the atrium photograph).
    const a = 2.55 * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), c = [6.0, -2.0], hw = 6.5, hl = 20, y0 = PODIUM_H.p4, ridge = y0 + 4.2;
    const G = (u, w, y) => [c[0] + u * ca - w * sa, y, c[1] + u * sa + w * ca];
    for (const sgn of [-1, 1]) mats.glass.facing([sgn * ca, 1, sgn * sa], G(sgn * hw, -hl, y0), G(0, -hl, ridge), G(0, hl, ridge), G(sgn * hw, hl, y0));
    for (const sgn of [-1, 1]) mats[metal].facing([-sgn * sa, 0, sgn * ca], G(-hw, sgn * hl, y0), G(hw, sgn * hl, y0), G(0, sgn * hl, ridge));
  }

  tower('west', 0); tower('east', 1); podium();
  for (const name of MATS) if (!(far && name === 'roof') && mats[name].count()) b.put(mats[name].geometry(), name);
  return b.finish();
}
