// Builds the Château Frontenac from its plan data (chateau-frontenac-plan.js) with the mesh kit: walls with only their exposed parts,
// stone string courses and cornices, window grids, the ground-floor arcade, hipped and gabled copper roofs with their dormers,
// round turrets with conical caps, tall chimneys, and the tower's slate roof and finials. Everything is quads and fans merged per material.
import { inside, at, U, V } from './chateau-frontenac-site.js';
import { ringEdges, insetRing } from './chateau-frontenac-kit.js';
import { BLOCKS, TURRETS, HEX, CHIMNEYS, GF, FL, eaveOf } from './chateau-frontenac-plan.js';

const add3 = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// where the segment p->q crosses the segment r->s, as a parameter on p->q (or null)
function segCross(p, q, r, s) {
  const d1 = [q[0] - p[0], q[1] - p[1]], d2 = [s[0] - r[0], s[1] - r[1]], den = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(den) < 1e-9) return null;
  const t = ((r[0] - p[0]) * d2[1] - (r[1] - p[1]) * d2[0]) / den, w = ((r[0] - p[0]) * d1[1] - (r[1] - p[1]) * d1[0]) / den;
  return t > 0.001 && t < 0.999 && w > 0.001 && w < 0.999 ? t : null;
}
const minWidth = (ring) => {
  let best = Infinity;
  for (const e of ringEdges(ring)) { let depth = 0; for (const p of ring) depth = Math.max(depth, -((p[0] - e.p[0]) * e.n[0] + (p[1] - e.p[1]) * e.n[1])); best = Math.min(best, depth); }
  return best;
};

export function buildComplex(kit, near) {
  const rand = rng(1893);
  // --- 1. prepare blocks: eave, roof parameters, edges ---
  const blocks = BLOCKS.map((b) => {
    const eave = b.eave ?? eaveOf(b.levels), edges = ringEdges(b.ring), w = minWidth(b.ring);
    const out = { ...b, eave, edges, w, mat: b.stone ? 'stone' : 'brick', roofMat: b.roofMat ?? 'copper', pitch: b.pitch ?? 3.4 };
    if (b.flat) { out.rise = 0; out.k = 0; out.inset = 0; return out; }
    if (b.roof === 'gable') {
      // the ridge runs along `axis` (v): slope edges are the two whose normals face across it
      const ax = b.axis === 'v' ? V : [-V[1], V[0]];
      out.slopeEdges = edges.filter((e) => Math.abs(e.n[0] * ax[0] + e.n[1] * ax[1]) < 0.5);
      out.endEdges = edges.filter((e) => Math.abs(e.n[0] * ax[0] + e.n[1] * ax[1]) >= 0.5);
      const span = out.slopeEdges.length ? Math.abs((out.slopeEdges[0].p[0] - out.slopeEdges[1].p[0]) * out.slopeEdges[0].n[0] + (out.slopeEdges[0].p[1] - out.slopeEdges[1].p[1]) * out.slopeEdges[0].n[1]) : w;
      out.rise = Math.min(b.maxRise, (span / 2) * b.slope); out.inset = span / 2; out.k = out.rise / out.inset;
    } else {
      out.inset = Math.min(w / 2, b.maxRise / b.slope); out.rise = out.inset * b.slope; out.k = b.slope; out.slopeEdges = edges;
      // where the span is wider than the steep slope reaches, a shallow copper hip closes the top (a Château roof has no flat grey deck): it keeps
      // going up at k2 until its own ridge, or to rise2 at most with a copper deck left on top
      if (out.inset < w / 2 - 0.05) {
        const top = insetRing(b.ring, out.inset), w2 = minWidth(top);
        out.k2 = 0.65; out.d2 = Math.min(w2 / 2, 6 / out.k2); out.rise2 = out.d2 * out.k2; out.deck = out.d2 < w2 / 2 - 0.05;
      }
    }
    return out;
  });
  const byId = Object.fromEntries(blocks.map((b) => [b.id, b]));
  const inBlock = (b, x, z) => inside(b.ring, x, z);
  // is the plan point inside another block that is taller than y (so a window or slit there would be buried)?
  const coveredAt = (x, z, y, except) => blocks.some((o) => o !== except && inBlock(o, x, z) && o.eave > y);
  // roof surface height of a block at a plan point
  const roofY = (b, x, z) => {
    if (b.flat) return b.eave;
    let d = Infinity;
    for (const e of b.slopeEdges) d = Math.min(d, -((x - e.p[0]) * e.n[0] + (z - e.p[1]) * e.n[1]));
    const lower = b.eave + Math.min(b.rise, Math.max(0, d) * b.k);
    return b.k2 && d > b.inset ? lower + Math.min(b.rise2, (d - b.inset) * b.k2) : lower;
  };
  // turret discs for occlusion tests: [x, z, radius, y0, y1]
  const discs = [...TURRETS.map((t) => [t.c[0], t.c[1], t.r + 0.45, t.y0 > 0 ? t.y0 - 2 : 0, t.y1]), [HEX.c[0], HEX.c[1], HEX.r + 0.45, 0, HEX.y1]];
  const blocked = (x, z, y0, y1) => discs.some(([cx, cz, r, a, c]) => Math.hypot(x - cx, z - cz) < r && y1 > a && y0 < c);

  // --- 2. exposed wall segments of each block ---
  for (const b of blocks) {
    b.segs = [];
    for (const e of b.edges) {
      const cuts = new Set([0, 1]);
      for (const o of blocks) {
        if (o === b) continue;
        for (const w of o.ring) {
          const rx = w[0] - e.p[0], rz = w[1] - e.p[1], along = (rx * e.t[0] + rz * e.t[1]) / e.L, off = rx * e.n[0] + rz * e.n[1];
          if (Math.abs(off) < 0.45 && along > 0.001 && along < 0.999) cuts.add(along);
        }
        for (const f of o.edges) { const t = segCross(e.p, e.q, f.p, f.q); if (t !== null) cuts.add(t); }
      }
      const ts = [...cuts].sort((a, c) => a - c);
      let last = null;
      for (let k = 0; k + 1 < ts.length; k++) {
        const a = ts[k], c = ts[k + 1];
        if ((c - a) * e.L < 0.25) continue;
        const mx = e.p[0] + e.t[0] * e.L * (a + c) / 2 + e.n[0] * 0.2, mz = e.p[1] + e.t[1] * e.L * (a + c) / 2 + e.n[1] * 0.2;
        let hidden = false, y0 = 0;
        for (const o of blocks) if (o !== b && inBlock(o, mx, mz)) { if (o.eave >= b.eave - 0.01) { hidden = true; break; } y0 = Math.max(y0, o.eave); }
        if (hidden) { last = null; continue; }
        if (last && last.e === e && Math.abs(last.y0 - y0) < 1e-6 && Math.abs(last.u1 - a * e.L) < 1e-6) { last.u1 = c * e.L; continue; }
        last = { e, u0: a * e.L, u1: c * e.L, y0 }; b.segs.push(last);
      }
    }
  }

  // --- 3. walls, trim, windows, arcade ---
  for (const b of blocks) for (const s of b.segs) {
    const { e } = s, { p: o, t, n } = e, top = b.eave;
    const seFacing = n[0] * V[0] + n[1] * V[1] > 0.7;
    // the porte-cochere: a three-arch stone gateway through the north link wing toward Place d'Armes
    const gc = b.gate && n[0] * V[0] + n[1] * V[1] < -0.7 ? (at(b.gate.u, 0)[0] - o[0]) * t[0] + (at(b.gate.u, 0)[1] - o[1]) * t[1] : null;
    const gateHere = gc !== null && gc > s.u0 + 6 && gc < s.u1 - 6;
    const groundStone = b.stone || (b.arcade && seFacing) || gateHere, baseH = gateHere ? 8.1 : GF;
    if (s.y0 < baseH && groundStone && top > baseH) {
      kit.panel('stone', o, t, n, s.u0, s.u1, s.y0, baseH, 0);
      kit.panel(b.mat, o, t, n, s.u0, s.u1, baseH, top, 0);
    } else kit.panel(b.mat, o, t, n, s.u0, s.u1, s.y0, top, 0);
    // cornice under the eave (stone, corbelled), and the string course over a stone ground floor
    kit.slab('stone', o, t, n, s.u0, s.u1, top - 0.9, top, 0.55, { sides: near });
    if (near && s.y0 < baseH && groundStone && top > baseH + 1) kit.slab('stone', o, t, n, s.u0, s.u1, baseH - 0.45, baseH, 0.3, { sides: false, bottom: true });
    if (near && b.tower) for (const k of [4, 8, 12]) { const y = GF + (k - 1) * FL; if (y > s.y0 + 1) kit.slab('stone', o, t, n, s.u0, s.u1, y - 0.25, y + 0.25, 0.3, { sides: false }); }
    const len = s.u1 - s.u0, rows = b.levels ? b.levels - 1 : 0;
    if (!near) { // far: slim dark slots, about 40 % of a cell wide and one band per two storeys, so the brick dominates; a quarter of them lit at night
      if (!rows || len < 5) continue;
      const cells = Math.max(1, Math.round((len - 2.4) / 8)), cw = (len - 2.4) / cells, half = 0.2 * cw;
      for (let k = 1; k <= rows; k += 2) {
        const y = GF + (k - 1) * FL + 0.7; if (y < s.y0) continue;
        for (let c = 0; c < cells; c++) { const uc = s.u0 + 1.2 + (c + 0.5) * cw; kit.panel(rand() < 0.25 ? 'glow' : 'glass', o, t, n, uc - half, uc + half, y, y + (k < rows ? 3.6 : 2.0), 0.2); }
      }
      if (s.y0 < GF && groundStone && seFacing && len > 6) { // the arcade: a dark arch every cell between stone piers
        const cells0 = Math.max(1, Math.round((len - 2.4) / 4.1)), cw0 = (len - 2.4) / cells0;
        for (let c = 0; c < cells0; c++) { const uc = s.u0 + 1.2 + (c + 0.5) * cw0; kit.panel('glass', o, t, n, uc - 0.3 * cw0, uc + 0.3 * cw0, 0.6, 3.0, 0.2); }
      }
      continue;
    }
    if (!rows) continue;
    if (gateHere) {
      kit.arch('glass', o, t, n, gc - 2.7, gc + 2.7, 0.2, 4.2, 0.2, 6);
      for (const d of [-6.4, 6.4]) kit.arch('glass', o, t, n, gc + d - 1.5, gc + d + 1.5, 0.2, 2.5, 0.2, 5);
    }
    // ground floor: arches on the south-east arcade, else plain windows
    if (s.y0 < GF - 0.5) {
      const pitchG = b.arcade && seFacing ? 4.1 : 4.4, n0 = Math.floor((len - 2) / pitchG);
      for (let i = 0; i < n0; i++) {
        const uc = s.u0 + 1 + (len - 2) * (i + 0.5) / n0;
        const px = o[0] + t[0] * uc, pz = o[1] + t[1] * uc;
        if (blocked(px, pz, 0, GF) || coveredAt(px + n[0] * 0.4, pz + n[1] * 0.4, GF, b) || (gateHere && Math.abs(uc - gc) < 9.5)) continue;
        if (b.arcade && seFacing) kit.arch('glass', o, t, n, uc - 1.35, uc + 1.35, 0.2, 2.75, 0.2, 5);
        else { kit.panel('stone', o, t, n, uc - 0.95, uc + 0.95, 0.9, 3.7, 0.15); kit.panel(rand() < 0.3 ? 'glow' : 'glass', o, t, n, uc - 0.7, uc + 0.7, 1.15, 3.45, 0.24); }
      }
    }
    // upper storeys: stone-framed paired-light windows
    const n1 = Math.max(1, Math.floor((len - 2) / b.pitch));
    for (let k = 1; k <= rows; k++) {
      const y0 = GF + (k - 1) * FL + 0.7;
      if (y0 < s.y0) continue;
      for (let i = 0; i < n1; i++) {
        const uc = s.u0 + 1 + (len - 2) * (i + 0.5) / n1;
        const px = o[0] + t[0] * uc, pz = o[1] + t[1] * uc;
        if (blocked(px, pz, y0, y0 + 2) || coveredAt(px + n[0] * 0.4, pz + n[1] * 0.4, y0 + 1, b) || (gateHere && y0 < baseH && Math.abs(uc - gc) < 9.5)) continue;
        kit.panel('stone', o, t, n, uc - 0.95, uc + 0.95, y0 - 0.3, y0 + 2.3, 0.15);
        kit.panel(rand() < 0.3 ? 'glow' : 'glass', o, t, n, uc - 0.7, uc + 0.7, y0, y0 + 2.0, 0.24);
        kit.panel('stone', o, t, n, uc - 0.06, uc + 0.06, y0, y0 + 2.0, 0.31);
      }
    }
    // stone quoins on the corners of the wall (a strip on this wall at each end that is a real corner)
    for (const [u, sgn] of [[0, 1], [e.L, -1]]) {
      if (Math.abs((sgn > 0 ? s.u0 : s.u1) - u) > 0.01) continue;
      const px = o[0] + t[0] * (u + sgn * 0.5), pz = o[1] + t[1] * (u + sgn * 0.5);
      if (blocked(px, pz, s.y0, top) || coveredAt(px + n[0] * 0.4, pz + n[1] * 0.4, s.y0 + 1, b)) continue;
      kit.panel('stone', o, t, n, sgn > 0 ? u : u - 0.95, sgn > 0 ? u + 0.95 : u, Math.max(s.y0, GF), top - 0.9, 0.12);
    }
  }

  // --- 4. roofs ---
  const yaw = Math.atan2(U[1], U[0]);
  const square = (x, z, hh) => [[-hh, -hh], [hh, -hh], [hh, hh], [-hh, hh]].map(([a, d]) => [x + a * Math.cos(yaw) - d * Math.sin(yaw), z + a * Math.sin(yaw) + d * Math.cos(yaw)]);
  for (const b of blocks) {
    const mat = b.roofMat;
    if (b.flat) { kit.cap('slate', b.ring, b.eave, true); continue; }
    if (b.roof === 'gable') {
      const [s1, s2] = b.slopeEdges, yr = b.eave + b.rise;
      const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      // the ridge runs between the midpoints of the two end edges
      const [g1, g2] = b.endEdges, m1 = mid(g1.p, g1.q), m2 = mid(g2.p, g2.q);
      for (const s of [s1, s2]) { // each slope: eave edge -> ridge
        const toRidge = (pt) => { const d1 = Math.hypot(pt[0] - m1[0], pt[1] - m1[1]), d2 = Math.hypot(pt[0] - m2[0], pt[1] - m2[1]); return d1 < d2 ? m1 : m2; };
        const a = toRidge(s.p), c = toRidge(s.q);
        kit.quad(mat, [s.p[0], b.eave, s.p[1]], [s.q[0], b.eave, s.q[1]], [c[0], yr, c[1]], [a[0], yr, a[1]], [s.n[0], 0.7, s.n[1]]);
      }
      for (const g of b.endEdges) { // vertical gable ends in brick, with a window
        const m = mid(g.p, g.q);
        kit.tri(b.mat, [g.p[0], b.eave, g.p[1]], [g.q[0], b.eave, g.q[1]], [m[0], yr, m[1]], [g.n[0], 0, g.n[1]]);
        if (near && g.L > 6) {
          const y1 = b.eave + 1.3;
          for (const d of [-1.05, 1.05]) { kit.panel('stone', g.p, g.t, g.n, g.L / 2 + d - 0.85, g.L / 2 + d + 0.85, y1 - 0.25, y1 + 2.3, 0.1); kit.panel(rand() < 0.3 ? 'glow' : 'glass', g.p, g.t, g.n, g.L / 2 + d - 0.6, g.L / 2 + d + 0.6, y1, y1 + 2.0, 0.18); }
        }
      }
    } else {
      const top = insetRing(b.ring, b.inset), yr = b.eave + b.rise;
      b.edges.forEach((e) => {
        const a = top[e.i], c = top[(e.i + 1) % top.length];
        kit.quad(mat, [e.p[0], b.eave, e.p[1]], [e.q[0], b.eave, e.q[1]], [c[0], yr, c[1]], [a[0], yr, a[1]], [e.n[0], 0.7, e.n[1]]);
      });
      if (b.k2) { // the shallow upper hip, from the top of the steep slopes to its own ridge
        const t2 = insetRing(top, b.d2), yr2 = yr + b.rise2;
        ringEdges(top).forEach((e) => { const a = t2[e.i], c = t2[(e.i + 1) % t2.length]; kit.quad(mat, [e.p[0], yr, e.p[1]], [e.q[0], yr, e.q[1]], [c[0], yr2, c[1]], [a[0], yr2, a[1]], [e.n[0], 0.4, e.n[1]]); });
        if (b.deck) kit.cap(mat, t2, yr2, true);
        else if (near) { const pts = []; for (const q of t2) if (!pts.some((r) => Math.hypot(r[0] - q[0], r[1] - q[1]) < 0.3)) pts.push(q); if (pts.length === 2) crest(kit, pts[0], pts[1], yr2); }
      }
    }
    // metal crest along the ridge, a stone finial on each gable apex
    if (near) {
      const yr2 = b.eave + b.rise;
      if (b.roof === 'gable') {
        const [g1, g2] = b.endEdges, m1 = [(g1.p[0] + g1.q[0]) / 2, (g1.p[1] + g1.q[1]) / 2], m2 = [(g2.p[0] + g2.q[0]) / 2, (g2.p[1] + g2.q[1]) / 2];
        crest(kit, m1, m2, yr2);
        for (const g of b.endEdges) {
          const m = [(g.p[0] + g.q[0]) / 2, (g.p[1] + g.q[1]) / 2], tip = [m[0] + g.n[0] * 0.25, m[1] + g.n[1] * 0.25];
          if (!coveredAt(tip[0] + g.n[0] * 0.5, tip[1] + g.n[1] * 0.5, b.eave + 0.5, b)) { kit.prism('stone', square(tip[0], tip[1], 0.28), yr2 - 0.2, yr2 + 1.1, { top: false }); kit.cone('stone', square(tip[0], tip[1], 0.28), yr2 + 1.1, [tip[0], yr2 + 2.2, tip[1]]); }
        }
      } else if (b.inset >= b.w / 2 - 0.01 && b.w > 4) {
        const topR = insetRing(b.ring, b.inset), pts = []; for (const q of topR) if (!pts.some((r) => Math.hypot(r[0] - q[0], r[1] - q[1]) < 0.3)) pts.push(q);
        if (pts.length === 2) crest(kit, pts[0], pts[1], yr2);
      }
    }
    // dormers on the slopes, wherever a neighbouring roof does not bury them: a row near the eave and, on tall roofs, a staggered second row
    if (!near || !b.dormer || b.inset < 3) continue;
    const sc = b.tower ? 1.25 : 0.9, dh = 3.8 * sc;
    for (const e of b.slopeEdges) {
      const count = Math.floor((e.L - 3) / b.dormer);
      if (count < 1) continue;
      for (const [frac, stagger] of [[0.38, false], [0.74, true]]) {
        if (stagger && (b.inset < 6.2 || b.k * b.inset * 0.74 + dh > b.rise + 0.2 || b.inset * (1 - frac) < dh / b.k + 0.5 + 0.5)) continue;
        const dIn = stagger ? b.inset * frac : Math.min(Math.max(b.inset * frac, 1.1), 5), sill = b.eave + dIn * b.k;
        if (sill + dh > b.eave + b.rise + 0.3 && !b.tower) continue;
        const rowCount = stagger ? count - 1 : count;
        for (let i = 0; i < rowCount; i++) {
          const uc = 1.5 + (e.L - 3) * (stagger ? (i + 1) / count : (i + 0.5) / count);
          const bx = e.p[0] + e.t[0] * uc - e.n[0] * dIn, bz = e.p[1] + e.t[1] * uc - e.n[1] * dIn;
          const ox = bx + e.n[0] * (dIn + 0.6), oz = bz + e.n[1] * (dIn + 0.6);
          if (blocks.some((o) => o !== b && ((inBlock(o, bx, bz) && roofY(o, bx, bz) > sill - 1.2) || (inBlock(o, ox, oz) && roofY(o, ox, oz) > b.eave - 0.5)))) continue;
          if (blocked(bx, bz, 0, 99)) continue;
          dormer(kit, [bx, sill, bz], e.n, e.t, b.k, sc, mat, b.tower ? 'stone' : mat, rand);
        }
      }
    }
  }

  // --- 5. chimneys ---
  for (const [id, u, v, h, size] of CHIMNEYS) {
    const b = byId[id], c = at(u, v);
    if (!b || !inBlock(b, c[0], c[1])) throw new Error(`chimney ${id} (${u}, ${v}) is off its roof`);
    const ry = roofY(b, c[0], c[1]), hs = size / 2, y1 = ry + h;
    kit.prism('brick', square(c[0], c[1], hs), ry - 0.4, y1, { top: false });
    kit.prism('stone', square(c[0], c[1], hs + 0.2), y1, y1 + 0.45, { top: true });
    if (near) kit.prism('stone', square(c[0], c[1], hs - 0.1), y1 + 0.45, y1 + 0.9, { top: true });
  }

  // --- 6. turrets and the hexagonal tower ---
  const env = { anyBlock: (x, z, y) => coveredAt(x, z, y, null), rand };
  for (const t of TURRETS) turret(kit, near, t, { ...env, sides: t.sides ?? (near ? 12 : 6), cap: t.cap ?? 'copper' });
  turret(kit, near, { id: 'hex', c: HEX.c, r: HEX.r, y0: 0, y1: HEX.y1, tip: HEX.tip, dormers: 3, mat: 'brick', windows: true }, { ...env, sides: 6, cap: 'copper', phase: 0.3 });

  // --- 7. the tower's two pinnacles at the ends of its ridge, reaching the published 80 m ---
  const tw = byId.tower, topRing = insetRing(tw.ring, tw.inset), yr = tw.eave + tw.rise;
  const ends = []; for (const p of topRing) if (!ends.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.3)) ends.push(p);
  for (const [x, z] of ends) {
    const r = near ? 0.55 : 0.8;
    kit.prism('metal', square(x, z, r), yr - 0.6, yr + 1.4, { top: false });
    kit.cone('metal', square(x, z, r), yr + 1.4, [x, 80, z]);
  }
}

// A thin metal crest along a ridge from plan point a to b at height y (a 0.4 m square bar, ends capped).
function crest(kit, a, b, y) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz); if (L < 1) return;
  const t = [dx / L, dz / L], n = [-t[1], t[0]], w = 0.2;
  const c = (s, k, h) => [a[0] + t[0] * s + n[0] * k * w, y + h, a[1] + t[1] * s + n[1] * k * w];
  kit.quad('metal', c(0, -1, 0), c(L, -1, 0), c(L, -1, 0.7), c(0, -1, 0.7), [-n[0], 0, -n[1]]);
  kit.quad('metal', c(0, 1, 0), c(L, 1, 0), c(L, 1, 0.7), c(0, 1, 0.7), [n[0], 0, n[1]]);
  kit.quad('metal', c(0, -1, 0.7), c(L, -1, 0.7), c(L, 1, 0.7), c(0, 1, 0.7), [0, 1, 0]);
}

// A gabled dormer standing on a roof slope. base = the middle of its sill on the roof [x, y, z]; nrm / tan = the horizontal outward and
// along-the-eave unit vectors (x, z); k = rise per run of the roof; sc = size. The back disappears into the roof.
function dormer(kit, base, nrm, tan, k, sc, roofMat, frontMat, rand) {
  const w = 1.9 * sc, hW = 2.5 * sc, gh = 1.3 * sc, D = (hW + gh) / k + 0.5, Y = [0, 1, 0];
  const N3 = [nrm[0], 0, nrm[1]], T3 = [tan[0], 0, tan[1]], back = (p) => add3(p, N3, -D);
  const fl = add3(base, T3, -w / 2), fr = add3(base, T3, w / 2), tl = add3(fl, Y, hW), tr = add3(fr, Y, hW), pk = add3(base, Y, hW + gh);
  kit.fan(frontMat, [fl, fr, tr, pk, tl], N3);
  const gl = (y0, y1) => [add3(add3(base, T3, -w * 0.32), Y, y0), add3(add3(base, T3, w * 0.32), Y, y0), add3(add3(base, T3, w * 0.32), Y, y1), add3(add3(base, T3, -w * 0.32), Y, y1)].map((p) => add3(p, N3, 0.07));
  kit.quad(rand() < 0.3 ? 'glow' : 'glass', ...gl(0.35 * sc, hW - 0.2 * sc), N3);
  kit.quad(roofMat, fl, back(fl), back(tl), tl, add3(T3, [0, 0, 0], -1));
  kit.quad(roofMat, fr, back(fr), back(tr), tr, T3);
  kit.quad(roofMat, tl, back(tl), back(pk), pk, add3(Y, T3, -0.6));
  kit.quad(roofMat, tr, back(tr), back(pk), pk, add3(Y, T3, 0.6));
}

// A round (or many-sided) stone turret from y0 to y1 under a conical cap reaching `tip`; corbelled on a stone cone when it starts above grade.
function turret(kit, near, t, { sides: N, cap, anyBlock, rand, phase = 0 }) {
  const { c, r, y0, y1, tip } = t, ang = (k) => phase + (k / N) * Math.PI * 2;
  const ring = (rad) => Array.from({ length: N }, (_, k) => [c[0] + rad * Math.cos(ang(k)), c[1] + rad * Math.sin(ang(k))]);
  const R0 = ring(r), R1 = ring(r + 0.25), out = (a, b) => [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]];
  const P = (p, y) => [p[0], y, p[1]];
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N, o = out(R0[k], R0[j]);
    kit.quad(t.mat ?? 'stone', P(R0[k], y0), P(R0[j], y0), P(R0[j], y1), P(R0[k], y1), [o[0], 0, o[1]]);
    kit.quad('stone', P(R1[k], y1 - 0.6), P(R1[j], y1 - 0.6), P(R1[j], y1), P(R1[k], y1), [o[0], 0, o[1]]); // belt under the cap
    if (near) kit.quad('stone', P(R0[k], y1 - 0.6), P(R0[j], y1 - 0.6), P(R1[j], y1 - 0.6), P(R1[k], y1 - 0.6), [0, -1, 0]);
    kit.tri(cap, P(R1[k], y1), P(R1[j], y1), [c[0], tip, c[1]], [o[0], 0.6, o[1]]);
    if (y0 > 0) kit.tri('stone', P(R0[k], y0), P(R0[j], y0), [c[0], y0 - 2.4, c[1]], [o[0], -0.6, o[1]]);
  }
  if (!near) return;
  kit.cone('metal', [[c[0] - 0.14, c[1] - 0.14], [c[0] + 0.14, c[1] - 0.14], [c[0] + 0.14, c[1] + 0.14], [c[0] - 0.14, c[1] + 0.14]], tip, [c[0], tip + 1.8, c[1]]); // finial
  if (t.windows) { // brick towers: stone-framed windows on every facet, stone belts every second storey
    for (let k = 0; k < N; k++) {
      const j = (k + 1) % N, L = Math.hypot(R0[j][0] - R0[k][0], R0[j][1] - R0[k][1]), o = out(R0[k], R0[j]), ol = Math.hypot(...o) || 1, nrm = [o[0] / ol, o[1] / ol], tan = [(R0[j][0] - R0[k][0]) / L, (R0[j][1] - R0[k][1]) / L];
      const w = Math.min(1.9, L * 0.8), mx = (R0[k][0] + R0[j][0]) / 2 + nrm[0] * 0.4, mz = (R0[k][1] + R0[j][1]) / 2 + nrm[1] * 0.4;
      for (let row = 1; GF + (row - 1) * FL + 2.7 < y1 - 0.9; row++) {
        const y = GF + (row - 1) * FL + 0.7;
        if (anyBlock(mx, mz, y + 1)) continue;
        kit.panel('stone', R0[k], tan, nrm, L / 2 - w / 2 - 0.2, L / 2 + w / 2 + 0.2, y - 0.3, y + 2.3, 0.15);
        kit.panel(rand() < 0.3 ? 'glow' : 'glass', R0[k], tan, nrm, L / 2 - w / 2 + 0.2, L / 2 + w / 2 - 0.2, y, y + 2.0, 0.24);
      }
      for (let row = 2; GF + (row - 1) * FL < y1 - 3; row += 2) { const y = GF + (row - 1) * FL; if (!anyBlock(mx, mz, y)) kit.panel('stone', R0[k], tan, nrm, 0, L, y - 0.25, y + 0.25, 0.2); }
    }
    return;
  }
  if (N >= 8) for (let k = 0; k < N; k += 2) { // slit windows
    const j = (k + 1) % N, m = [(R0[k][0] + R0[j][0]) / 2, (R0[k][1] + R0[j][1]) / 2], o = out(R0[k], R0[j]), ol = Math.hypot(...o) || 1, nrm = [o[0] / ol, o[1] / ol], tan = [-nrm[1], nrm[0]];
    const half = Math.min(0.32, Math.hypot(R0[j][0] - R0[k][0], R0[j][1] - R0[k][1]) * 0.3);
    for (let y = Math.max(2.4, y0 + 2.6); y + 1.6 < y1 - 1.6; y += FL) {
      if (anyBlock(m[0] + nrm[0] * 0.6, m[1] + nrm[1] * 0.6, y + 0.8)) continue;
      const q = (u, yy) => [m[0] + tan[0] * u + nrm[0] * 0.14, yy, m[1] + tan[1] * u + nrm[1] * 0.14];
      kit.quad(rand() < 0.3 ? 'glow' : 'glass', q(-half, y), q(half, y), q(half, y + 1.5), q(-half, y + 1.5), [nrm[0], 0, nrm[1]]);
    }
  }
  const cnt = t.dormers ?? 0; // dormers on a big cone
  for (let i = 0; i < cnt; i++) {
    const a = phase + (i + 0.5) * (Math.PI * 2 / cnt) * (cnt === 3 ? 1 : 1), f = 0.26, rad = (r + 0.25) * (1 - f), y = y1 + (tip - y1) * f;
    const nrm = [Math.cos(a), Math.sin(a)];
    dormer(kit, [c[0] + nrm[0] * rad, y, c[1] + nrm[1] * rad], nrm, [-nrm[1], nrm[0]], (tip - y1) / (r + 0.25), 0.9, cap, cap, rand);
  }
}
