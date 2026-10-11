import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS } from './canadian-museum-of-history-site.js';
import { Mesh, inPoly, triangulate, centroid, simplifyRing, stations, nearestIndex, splitLobes } from './canadian-museum-of-history-mesh.js';

const TAU = Math.PI * 2;
const ring = (id) => PARTS[id].ring;

/**
 * Canadian Museum of History, Gatineau, in metres: +X east, +Y up, +Z south, origin = the centroid of the two mapped
 * wings, y = 0 the perimeter/plaza level. Authoring only (exporter, inspector, tests); never the map.
 *
 * The plan is the OSM outlines themselves (so the orientation on the mapped footprint is exact and nothing is rotated).
 * Each OSM building:part is a block (walls from the ground or from the block it stands on, a roof at its mapped
 * height); a wall is drawn only where it is exposed (not where another, taller block stands against it). Outer walls
 * get the museum's signature: courses of buff stone under a layered, wave-like cornice (three stacked bands whose
 * projections drift in and out) or, on the low terraces, a projecting lip. The Grand Hall's river front is a
 * colonnade of flared stone piers in front of a recessed glass wall; the domes and strip roofs are verdigris copper.
 */

// Blocks, bottom to top. `style`: 'cornice' (tall walls: courses + three layered bands) or 'lip' (low terraces: courses +
// one projecting lip). `roof`: 'roof' (flat) or 'copper' (flat copper with a chamfered edge of `rise` metres).
const BLOCKS = [
  // public wing (way 68588595): the Grand Hall slab with its colonnade (arc) and the glazed entrance front (north)
  { name: 'hall', ring: ring(1043614704), base: 0, top: 14, style: 'cornice', roof: 'roof',
    runs: [{ from: [4.3, -5.2], to: [66.2, 104.1], pitch: 6.4, flare: true }, { from: [-67.9, 0.8], to: [-24.9, -9.2], pitch: 9.5, flare: false }],
    windows: { y0: 3.4, y1: 6.3, at: (p) => Math.hypot(p[0] + 12.9, p[1] + 11.2) < 17 } },
  { name: 'drum', ring: ring(1043614705), base: 0, top: 18, style: 'cornice', roof: 'roof', windows: { y0: 5, y1: 8, at: (p) => p[0] < -66 } },
  { name: 'copperStrip', ring: ring(1043614697), base: 0, top: 14, style: 'lip', roof: 'copper', rise: 1 },
  { name: 'b700', ring: ring(1043614700), base: 0, top: 9, style: 'lip', roof: 'roof', windows: { y0: 3, y1: 5.6, at: () => true } },
  { name: 'b699', ring: ring(1043614699), base: 0, top: 4, style: 'lip', roof: 'roof', windows: { y0: 1.2, y1: 2.9, at: () => true } },
  { name: 'b696', ring: ring(1043614696), base: 4, top: 9, style: 'lip', roof: 'copper', rise: 1 },
  { name: 'b707', ring: ring(1043614707), base: 0, top: 8, style: 'lip', roof: 'roof' },
  { name: 'b703', ring: ring(1043614703), base: 0, top: 14, style: 'cornice', roof: 'roof', windows: { y0: 3.2, y1: 5.6, at: () => true } },
  { name: 'b701', ring: ring(1043614701), base: 0, top: 14, style: 'cornice', roof: 'roof', windows: { y0: 3.2, y1: 5.6, at: () => true } },
  { name: 'b702', ring: ring(1043614702), base: 0, top: 8, style: 'lip', roof: 'roof', windows: { y0: 2.4, y1: 4.4, at: () => true } },
  // curatorial wing (way 68588601): a cascade of four stepped terraces
  { name: 'cur1', ring: ring(1043614713), base: 0, top: 4.5, style: 'lip', roof: 'roof', windows: { y0: 1.4, y1: 3.1, at: () => true } },
  { name: 'cur2', ring: ring(1043614712), base: 4.5, top: 8, style: 'lip', roof: 'roof' },
  { name: 'cur3', ring: ring(1043614711), base: 8, top: 11.5, style: 'lip', roof: 'roof', windows: { y0: 9.4, y1: 10.8, at: () => true } },
  { name: 'cur4', ring: ring(1043614710), base: 11.5, top: 14, style: 'lip', roof: 'copper', rise: 1 }, // 14 m walls + a 1 m copper roof = the mapped 15 m
];
BLOCKS.forEach((b, i) => {
  b.idx = i; b.phase = 1.7 * i + 0.4;
  b.bbox = b.ring.reduce((m, p) => [Math.min(m[0], p[0]), Math.min(m[1], p[1]), Math.max(m[2], p[0]), Math.max(m[3], p[1])], [1e9, 1e9, -1e9, -1e9]);
});

// Domes sit on a block's roof: a short skirt sunk into the roof deck (`sink`, so no rim shows), then an ellipsoidal cap (the
// footprint scaled about its centroid). The long dome is the OSM `roof:shape=round` part with its stated 6 m rise (14 to
// 20 m): two overlapping ellipsoid lobes along its axis, each crowning at 20 m, with a shallow saddle between them.
const DOMES = [
  { name: 'long dome', ring: ring(1043614698), base: 14, sink: 0.4, skirt: 0.3, top: 20, scale: 1, lobes: 2, overlap: 0.24 },
  { name: 'north rotunda dome', ring: ring(1043614694), base: 14, skirt: 1.2, top: 19, scale: 0.94 },
  { name: 'west dome', ring: ring(1043614706), base: 18, skirt: 1.2, top: 27, scale: 0.95 },
];

const GLASS_INSET = -2.3; // the glass wall stands this far behind the colonnade's outer line
const COURSE = 2.1;

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const meshes = new Map();
  // far folds the minor materials into their neighbours (draw budget)
  const FOLD = { stoneLight: 'stone', stoneDark: 'stone', copperDark: 'copper', glass: 'glow', frame: 'glow' };
  const M = (name) => { const k = near ? name : (FOLD[name] || name); if (!meshes.has(k)) meshes.set(k, new Mesh()); return meshes.get(k); };

  const STEP = near ? 3 : 14;
  const probe = (q, self) => {
    let h = 0, inside = false;
    for (const o of BLOCKS) {
      if (o === self || q[0] < o.bbox[0] || q[0] > o.bbox[2] || q[1] < o.bbox[1] || q[1] > o.bbox[3]) continue;
      if (inPoly(q, o.ring)) { inside = true; if (o.top > h) h = o.top; }
    }
    return { h, inside };
  };

  function block(blk) {
    const T = blk.top, cornice = blk.style === 'cornice', thr = cornice ? 5.5 : 1.6;
    const st = stations(near ? blk.ring : simplifyRing(blk.ring, 0.7), STEP), N = st.length;
    // exposure of each interval: how high its wall stands above whatever is against it. A station is 'layered' (its
    // facade stepped in behind the footprint line) only when both of its intervals are exposed, so every wall tapers back
    // to the mapped outline where it meets another block and the joints stay closed.
    const iv = st.map((a, i) => {
      const c = st[(i + 1) % N], mid = [(a.p[0] + c.p[0]) / 2, (a.p[1] + c.p[1]) / 2];
      const nm = [a.n[0] + c.n[0], a.n[1] + c.n[1]], nl = Math.hypot(nm[0], nm[1]) || 1, out = [nm[0] / nl, 0, nm[1] / nl];
      const q = probe([mid[0] + out[0] * 0.9, mid[1] + out[2] * 0.9], blk), yb = Math.max(blk.base, q.h);
      return { mid, out, yb, ex: T - yb >= thr };
    });
    st.forEach((a, i) => { const pv = iv[(i + N - 1) % N]; a.layered = iv[i].ex && pv.ex && Math.abs(iv[i].yb - pv.yb) < 0.3; });
    // colonnade runs (only on the hall): station index ranges, in ring order
    const pts = st.map((a) => a.p);
    const runs = (blk.runs || []).map((r) => ({ ...r, i0: nearestIndex(pts, r.from), i1: nearestIndex(pts, r.to) }));
    const inRun = (i) => runs.find((r) => r.i0 <= i && i < r.i1);
    // layer tables; waves are periodic over the outline so the seam has no crack
    const last = st[N - 1], total = last.s + Math.hypot(last.p[0] - st[0].p[0], last.p[1] - st[0].p[1]);
    const wave = (s, lam, ph) => Math.sin(TAU * s * Math.max(1, Math.round(total / lam)) / total + ph);
    const bodyOff = cornice ? () => -1.1 : (s) => -0.7 + 0.3 * wave(s, 19, blk.phase + 0.7);
    // the bands alternate about +-8 % lightness (dark/light or light/dark, flipped from block to block), the top band mid
    const bandTone = blk.idx % 2 ? ['stoneLight', 'stoneDark'] : ['stoneDark', 'stoneLight'];
    const layers = cornice
      ? [
        { y0: T - 4, y1: T - 2.7, mat: bandTone[0], off: (s) => -0.55 + 0.45 * wave(s, 26, blk.phase) },
        { y0: T - 2.7, y1: T - 1.4, mat: bandTone[1], off: (s) => -0.35 + 0.3 * wave(s, 17, blk.phase + 1.3) },
        { y0: T - 1.4, y1: T, mat: 'stone', off: (s) => -0.6 + 0.5 * wave(s, 31, blk.phase + 2.4) },
      ]
      : [{ y0: T - 0.8, y1: T, mat: 'stoneLight', off: (s) => -0.2 + 0.2 * wave(s, 23, blk.phase) }];
    const layersFar = near ? layers : [{ ...layers[0], y0: layers[0].y0, y1: T, mat: 'stone', off: (s) => -0.3 + 0.2 * wave(s, 40, blk.phase) }];
    const L = layersFar, c0 = L[0].y0;
    const posAt = (a, off, y) => [a.p[0] + a.n[0] * off, y, a.p[1] + a.n[1] * off];
    const topOff = (a) => (a.layered ? L[L.length - 1].off(a.s) : 0);

    for (let i = 0; i < N; i++) {
      const a = st[i], c = st[(i + 1) % N];
      const { mid, out, yb } = iv[i];
      if (T - yb < 0.1) continue;
      const run = inRun(i) || null;
      const lay = iv[i].ex;
      const sA = a.s, sC = c.s > a.s ? c.s : a.s + Math.hypot(c.p[0] - a.p[0], c.p[1] - a.p[1]);
      // segments, bottom to top: [y0, y1, material, offset fn]
      const segs = [];
      const bodyTop = lay ? Math.min(T, c0) : T;
      const lowY = run ? c0 : yb;
      if (!run || !lay) {
        if (near) {
          for (let y = Math.max(yb, 0); y < bodyTop - 0.05;) {
            const next = Math.min(bodyTop, (Math.floor(y / COURSE + 1e-6) + 1) * COURSE);
            segs.push([y, next, Math.floor(y / COURSE + 1e-6) % 2 ? 'stoneDark' : 'stone', bodyOff]);
            y = next;
          }
        } else if (bodyTop > yb) segs.push([yb, bodyTop, 'stone', bodyOff]);
      }
      if (lay) for (const l of L) { const y0 = Math.max(l.y0, lowY, yb), y1 = l.y1; if (y1 - y0 > 0.05) segs.push([y0, y1, l.mat, l.off]); }
      const o = (fn, s, station) => (station.layered ? fn(s) : 0);
      // walls and the ledges between them
      segs.forEach((sg, k) => {
        const [y0, y1, mat, fn] = sg, oa = o(fn, sA, a), oc = o(fn, sC, c);
        const na = [a.n[0], 0, a.n[1]], nc = [c.n[0], 0, c.n[1]];
        M(mat).quadN(posAt(a, oa, y0), posAt(c, oc, y0), posAt(c, oc, y1), posAt(a, oa, y1), na, nc, nc, na);
        if (k > 0) {
          const pv = segs[k - 1], pa = o(pv[3], sA, a), pc = o(pv[3], sC, c);
          const da = oa - pa, dc = oc - pc;
          if (Math.abs(da) > 0.02 || Math.abs(dc) > 0.02) {
            M(mat).quad(posAt(a, pa, y0), posAt(c, pc, y0), posAt(c, oc, y0), posAt(a, oa, y0), [0, da + dc > 0 ? -1 : 1, 0]);
          }
        }
      });
      // a wall that stands on a lower neighbour is stepped in behind the outline: floor the strip it leaves (no light leaks)
      if (yb > 0.01 && segs.length) {
        const [, , , f0] = segs[0], fa = o(f0, sA, a), fc = o(f0, sC, c);
        if (Math.abs(fa) > 0.02 || Math.abs(fc) > 0.02) M('roof').quad(posAt(a, fa, yb), posAt(c, fc, yb), posAt(c, 0, yb), posAt(a, 0, yb), [0, 1, 0]);
      }
      // colonnade: glass wall, soffit, mullions, transoms
      if (run) {
        const l1 = L[0], oa = o(l1.off, sA, a), oc = o(l1.off, sC, c);
        const na = [a.n[0], 0, a.n[1]], nc = [c.n[0], 0, c.n[1]];
        M('glow').quadN(posAt(a, GLASS_INSET, 0), posAt(c, GLASS_INSET, 0), posAt(c, GLASS_INSET, c0), posAt(a, GLASS_INSET, c0), na, nc, nc, na);
        M('stoneDark').quad(posAt(a, GLASS_INSET, c0), posAt(c, GLASS_INSET, c0), posAt(c, oc, c0), posAt(a, oa, c0), [0, -1, 0]);
        if (near) {
          for (const y of [3.4, 6.7]) M('frame').quad(posAt(a, GLASS_INSET + 0.12, y), posAt(c, GLASS_INSET + 0.12, y), posAt(c, GLASS_INSET + 0.12, y + 0.16), posAt(a, GLASS_INSET + 0.12, y + 0.16), out);
        }
      }
      // ribbon windows on stone walls
      if (near && blk.windows && lay && !run && a.layered && c.layered && yb <= blk.windows.y0 + 0.01 && blk.windows.at(mid)) {
        const w = blk.windows, wa = bodyOff(sA) + 0.12, wc = bodyOff(sC) + 0.12, len = Math.hypot(c.p[0] - a.p[0], c.p[1] - a.p[1]);
        if (len > 1.6) {
          const t0 = 0.12, t1 = 0.88, pa = posAt(a, wa, w.y0), pc = posAt(c, wc, w.y0);
          const lerp = (p, q2, t) => [p[0] + (q2[0] - p[0]) * t, p[1], p[2] + (q2[2] - p[2]) * t];
          const A0 = lerp(pa, pc, t0), A1 = lerp(pa, pc, t1);
          M('glass').quad(A0, A1, [A1[0], w.y1, A1[2]], [A0[0], w.y1, A0[2]], out);
        }
      }
    }

    // colonnade run ends: close the opening between the glass line and the neighbouring wall, and stand the piers
    for (const r of runs) {
      for (const [idx, sign] of [[r.i0, 1], [r.i1, -1]]) {
        const a = st[idx % N], bo = bodyOff(a.s);
        M('stone').quad(posAt(a, GLASS_INSET, 0), posAt(a, bo, 0), posAt(a, bo, c0), posAt(a, GLASS_INSET, c0), [a.t[0] * sign, 0, a.t[1] * sign]);
      }
      const s0 = st[r.i0].s, s1 = st[r.i1].s, len = s1 - s0, count = Math.max(2, Math.round(len / r.pitch));
      const at = (s) => {
        let k = r.i0;
        while (k + 1 < r.i1 && st[k + 1].s <= s) k++;
        const a = st[k], c = st[k + 1], t = (s - a.s) / Math.max(1e-6, c.s - a.s);
        const p = [a.p[0] + (c.p[0] - a.p[0]) * t, a.p[1] + (c.p[1] - a.p[1]) * t];
        let nx = a.n[0] * (1 - t) + c.n[0] * t, nz = a.n[1] * (1 - t) + c.n[1] * t; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        return { p, n: [nx, nz], t: [-nz, nx] };
      };
      // the pier: rows of [height, half width, front offset]
      const rows = r.flare
        ? [[0, 1.0, -0.45], [4.6, 0.85, -0.5], [7.4, 0.95, -0.42], [9.2, 1.25, -0.32], [c0 - 0.05, 1.4, -0.3]]
        : [[0, 0.55, -0.5], [c0 - 0.05, 0.55, -0.5]];
      const rr = near ? rows : (r.flare ? [rows[0], rows[2], rows[4]] : rows);
      for (let k = 1; k < count; k++) {
        const { p, n, t } = at(s0 + (k * len) / count);
        const corner = (row, side, off) => [p[0] + n[0] * off + t[0] * side * row[1], row[0], p[1] + n[1] * off + t[1] * side * row[1]];
        const BACK = GLASS_INSET - 0.15, topRow = rr[rr.length - 1];
        const capY = topRow[0], cap = (side, off) => [p[0] + n[0] * off + t[0] * side * topRow[1], capY, p[1] + n[1] * off + t[1] * side * topRow[1]];
        M('stoneLight').quad(cap(-1, BACK), cap(1, BACK), cap(1, topRow[2]), cap(-1, topRow[2]), [0, 1, 0]);
        for (let m = 0; m + 1 < rr.length; m++) {
          const u = rr[m], v = rr[m + 1], mat = 'stoneLight';
          M(mat).quad(corner(u, -1, u[2]), corner(u, 1, u[2]), corner(v, 1, v[2]), corner(v, -1, v[2]), [n[0], 0, n[1]]);
          M(mat).quad(corner(u, -1, BACK), corner(u, -1, u[2]), corner(v, -1, v[2]), corner(v, -1, BACK), [-t[0], 0, -t[1]]);
          M(mat).quad(corner(u, 1, u[2]), corner(u, 1, BACK), corner(v, 1, BACK), corner(v, 1, v[2]), [t[0], 0, t[1]]);
        }
      }
      if (near) { // mullions: a slim frame bar every ~2.1 m on the glass
        const mc = Math.round(len / 2.1);
        for (let k = 1; k < mc; k++) {
          const { p, n, t } = at(s0 + (k * len) / mc), off = GLASS_INSET + 0.12, hw = 0.08;
          const P = (side, y) => [p[0] + n[0] * off + t[0] * side * hw, y, p[1] + n[1] * off + t[1] * side * hw];
          M('frame').quad(P(-1, 0.1), P(1, 0.1), P(1, c0 - 0.25), P(-1, c0 - 0.25), [n[0], 0, n[1]]);
        }
      }
    }

    // roof: a flat polygon on the station outline at the layered top; copper roofs have a chamfered edge
    const deckRing = st.map((a) => [a.p[0] + a.n[0] * topOff(a), a.p[1] + a.n[1] * topOff(a)]);
    if (blk.roof === 'copper') {
      const rise = blk.rise, inner = st.map((a, i) => [deckRing[i][0] - a.n[0] * 1.4, deckRing[i][1] - a.n[1] * 1.4]);
      const rows = [deckRing.map((p) => [p[0], T, p[1]]), inner.map((p) => [p[0], T + rise, p[1]])];
      M('copper').grid(rows, { closed: true, dir: [0, 1, 0] });
      for (const t of triangulate(inner)) M('copper').tri([t[0][0], T + rise, t[0][1]], [t[1][0], T + rise, t[1][1]], [t[2][0], T + rise, t[2][1]], [0, 1, 0]);
    } else {
      for (const t of triangulate(deckRing)) M('roof').tri([t[0][0], T, t[0][1]], [t[1][0], T, t[1][1]], [t[2][0], T, t[2][1]], [0, 1, 0]);
    }
  }

  function dome(d) {
    const c = centroid(d.ring), base = d.base - (d.sink || 0), y1 = d.base + d.skirt, rise = d.top - y1;
    const rim = (near ? d.ring : simplifyRing(d.ring, 0.7)).map((p) => [c[0] + (p[0] - c[0]) * d.scale, c[1] + (p[1] - c[1]) * d.scale]);
    const R = rim.map((p) => [p[0], base, p[1]]), R1 = rim.map((p) => [p[0], y1, p[1]]);
    M('copperDark').grid([R, R1], { closed: true, dir: (f) => [f[0] - c[0], 0, f[2] - c[1]] });
    const steps = near ? 8 : 4;
    // one ellipsoidal cap per lobe: the lobe's own outline (a slice of the rim) scaled about its own centroid
    for (const lobe of d.lobes ? splitLobes(rim, d.lobes, d.overlap) : [rim]) {
      const lc = centroid(lobe), rows = [lobe.map((p) => [p[0], y1, p[1]])];
      for (let k = 1; k <= steps; k++) {
        const th = (k / steps) * Math.PI / 2, s = Math.cos(th);
        rows.push(lobe.map((p) => [lc[0] + (p[0] - lc[0]) * s, y1 + rise * Math.sin(th), lc[1] + (p[1] - lc[1]) * s]));
      }
      M('copper').grid(rows, { closed: true, dir: (f) => [f[0] - lc[0], f[1] - (base - 4), f[2] - lc[1]] });
    }
  }

  BLOCKS.forEach(block);
  DOMES.forEach(dome);
  for (const [name, mesh] of meshes) if (!mesh.empty) b.put(mesh.geometry(), name);
  const root = b.finish();
  root.userData.parts = [...meshes].map(([k, m]) => `${k}:${m.triangles}`).join(' ');
  return root;
}
