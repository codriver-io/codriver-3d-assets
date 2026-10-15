// Derived data © OpenStreetMap contributors, ODbL 1.0
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { DECK, PLAZA } from './allianz-arena-plan.js';
import { TAU, rayRing, rOut, rIn, rPlaza, PITCH_CENTRE, pitchPoint, skinRows, skinRadius, columnAngles, SKIN_KNOTS, LIP_DROP } from './allianz-arena-shape.js';

export const DECK_TOP = 8.5, DECK_BOTTOM = 7.5, DECK_THICK = 1, PITCH_Y = 0.5;
// South wedge grading (plaza-edge distances in metres) and the lowest the slab's top is allowed to fall to (a grounded lip).
const RAMP_D0 = 30, RAMP_D1 = 84, TIP_H = 0.06;
export const PITCH = { length: 105, width: 68, runoff: 5 };
export const COUNTS = { near: { rowM: 3.3, colM: 5.4 }, far: { rowM: 7.2, colM: 12 } };

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };

function insideRing(x, z, ring) { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) if ((ring[i][1] > z) !== (ring[j][1] > z) && x < (ring[j][0] - ring[i][0]) * (z - ring[i][1]) / (ring[j][1] - ring[i][1]) + ring[i][0]) c = !c; return c; }
function edgeDistance(x, z, ring) { let best = Infinity; ring.forEach((a, i) => { const b = ring[(i + 1) % ring.length], ex = b[0] - a[0], ez = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * ex + (z - a[1]) * ez) / (ex * ex + ez * ez))); best = Math.min(best, Math.hypot(x - a[0] - ex * t, z - a[1] - ez * t)); }); return best; }
function ringArea(r) { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; }

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const buffers = new Map();
  // Every face is wound to face `want`, then merged once per material.
  function tri(mat, a, c, d, want) {
    const n = cross(sub(c, a), sub(d, a));
    if (Math.hypot(...n) < 1e-9) return;
    if (dot(n, want) < 0) [c, d] = [d, c];
    if (!buffers.has(mat)) buffers.set(mat, []);
    buffers.get(mat).push(...a, ...c, ...d);
  }
  const poly = (mat, ps, want) => { for (let i = 1; i + 1 < ps.length; i++) tri(mat, ps[0], ps[i], ps[i + 1], want); };
  const quad = (mat, a, c, d, e, want) => poly(mat, [a, c, d, e], want);

  // ---- ETFE skin: a rhombus lattice over the lofted shell, each diamond an inflated cushion ---------------------------
  const { rows, length: profileLength } = skinRows(COUNTS[detail].rowM);
  const M = rows.length - 1;
  const { perimeter } = columnAngles(8);
  const K = 2 * Math.round(perimeter / COUNTS[detail].colM / 2);
  const { angles } = columnAngles(K);
  const vertex = (k, j) => {
    const a = angles[((k % K) + K) % K], r = skinRadius(a, rows[j], j === 0);
    return [r * Math.cos(a), rows[j].y, r * Math.sin(a)];
  };
  const gap = 0, bulge = near ? 0.7 : 0.6, rim = 0;
  const centre = [0, 14, 0];
  let cushions = 0;
  for (let j = 0; j <= M; j++) for (let k = 0; k < K; k++) {
    if ((k + j) % 2 === 0) continue;
    const ring = [[k - 1, j], [k, j - 1], [k + 1, j], [k, j + 1]].filter(([, jj]) => jj >= 0 && jj <= M).map(([kk, jj]) => vertex(kk, jj));
    const c = ring[0].map((_, i) => ring.reduce((s, p) => s + p[i], 0) / ring.length);
    const want = sub(c, centre);
    let n = norm(cross(sub(ring[1], ring[0]), sub(ring[2], ring[0])));
    if (dot(n, want) < 0) n = n.map(v => -v);
    const full = ring.length === 4;
    const apex = c.map((v, i) => v + n[i] * (full ? bulge : bulge * 0.12));
    const mat = 'etfe';
    const inner = ring.map(p => mix(p, c, gap).map((v, i) => v + n[i] * rim));
    for (let i = 0; i < ring.length; i++) {
      const i2 = (i + 1) % ring.length;
      tri(mat, inner[i], inner[i2], apex, n); // a pyramid face leans away from the base centre but always up the cell normal
    }
    cushions++;
  }
  // Ribs: one flat strip per lattice edge, 15 cm proud of the pyramids' shared base edges (the cushions are 70 cm tall
  // at the middle, so at a rib's 14 cm half-width the cushion surface is only a few cm up).
  {
    const ribW = near ? 0.14 : 0.3, ribH = near ? 0.15 : 0.22;
    const normalAt = (k, j) => {
      const a = sub(vertex(k + 2, j), vertex(k - 2, j)), b = sub(vertex(k, j + 2 <= M ? j + 2 : j), vertex(k, j - 2 >= 0 ? j - 2 : j));
      const n = norm(cross(b, a)), v = vertex(k, j);
      return dot(n, sub(v, centre)) < 0 ? n.map(x => -x) : n;
    };
    const lift = (v, n, h) => v.map((x, i) => x + n[i] * h);
    for (let j = 0; j <= M; j++) for (let k = 0; k < K; k++) {
      if ((k + j) % 2) continue;
      for (const dj of [1, -1]) {
        if (j + dj < 0 || j + dj > M) continue;
        const A = vertex(k, j), B = vertex(k + 1, j + dj), nA = normalAt(k, j), nB = normalAt(k + 1, j + dj);
        const w = norm(cross(sub(B, A), nA)).map(x => x * ribW), pa = lift(A, nA, ribH), pb = lift(B, nB, ribH);
        quad('frame', pa.map((x, i) => x + w[i]), pb.map((x, i) => x + w[i]), pb.map((x, i) => x - w[i]), pa.map((x, i) => x - w[i]), nA);
      }
    }
  }
  // Inner lining under the roof opening and the soffit seen through it.
  const lipCols = K / 2, lipStep = 2, lipOff = M % 2; // the lining shares the rim row's vertices (those with column + row even)
  const top = rows[M], soffitRows = rows.filter(r => r.f >= 0.27);
  for (let c = 0; c < lipCols; c++) {
    const a0 = angles[(c * lipStep + lipOff) % K], a1 = angles[((c + 1) * lipStep + lipOff) % K];
    const r0 = skinRadius(a0, top, false), r1 = skinRadius(a1, top, false);
    const p0 = [r0 * Math.cos(a0), top.y, r0 * Math.sin(a0)], p1 = [r1 * Math.cos(a1), top.y, r1 * Math.sin(a1)];
    const want = [-(p0[0] + p1[0]), 0, -(p0[2] + p1[2])];
    quad('glow', p0, p1, [p1[0], top.y - LIP_DROP, p1[2]], [p0[0], top.y - LIP_DROP, p0[2]], want);
    // soffit rows from the lining down the shell's underside (1.2 m below the skin)
    let prev0 = [p0[0], top.y - LIP_DROP, p0[2]], prev1 = [p1[0], top.y - LIP_DROP, p1[2]];
    for (let s = soffitRows.length - 2; s >= 0; s -= (near ? 2 : 3)) {
      const row = soffitRows[s], ra = skinRadius(a0, row, false), rb = skinRadius(a1, row, false), y = row.y - 1.2;
      const q0 = [ra * Math.cos(a0), y, ra * Math.sin(a0)], q1 = [rb * Math.cos(a1), y, rb * Math.sin(a1)];
      quad('dark', prev0, prev1, q1, q0, sub(centre, mix(q0, q1, 0.5)));
      prev0 = q0; prev1 = q1;
    }
    // back wall of the bowl up to the soffit
    const bowlTopR0 = prev0, bowlTopR1 = prev1;
    quad('dark', [bowlTopR0[0], 40.6, bowlTopR0[2]], [bowlTopR1[0], 40.6, bowlTopR1[2]], bowlTopR1, bowlTopR0, [-bowlTopR0[0] - bowlTopR1[0], 0, -bowlTopR0[2] - bowlTopR1[2]]);
  }

  // ---- seating bowl and pitch seen through the opening ------------------------------------------------------------------
  const hl = PITCH.length / 2 + PITCH.runoff, hw = PITCH.width / 2 + PITCH.runoff;
  const runoff = [pitchPoint(-hl, -hw), pitchPoint(hl, -hw), pitchPoint(hl, hw), pitchPoint(-hl, hw)];
  const turf = runoff.map(p => [p[0], PITCH_Y, p[1]]);
  quad('turf', ...turf, [0, 1, 0]);
  const tiers = [[0, PITCH_Y], [0.2, 10], [0.25, 11.2], [0.62, 26], [0.68, 27.3], [1, 40.6]];
  const bowlCols = near ? 96 : 36;
  const bowlPoint = (a, t) => {
    const rA = rayRing(runoff, a), rB = skinRadius(a, soffitRows[0], false) - 1.5;
    let i = 1; while (i < tiers.length - 1 && tiers[i][0] < t) i++;
    const [t0, y0] = tiers[i - 1], [t1, y1] = tiers[i], r = rA + (rB - rA) * t;
    return [r * Math.cos(a), y0 + (y1 - y0) * Math.min(1, Math.max(0, (t - t0) / (t1 - t0))), r * Math.sin(a)];
  };
  const bowlT = near ? [0, 0.2, 0.25, 0.45, 0.62, 0.68, 0.85, 1] : [0, 0.25, 0.62, 0.68, 1];
  for (let c = 0; c < bowlCols; c++) {
    const a0 = c * TAU / bowlCols, a1 = (c + 1) * TAU / bowlCols;
    for (let t = 0; t + 1 < bowlT.length; t++) {
      const A = bowlPoint(a0, bowlT[t]), B = bowlPoint(a1, bowlT[t]), C = bowlPoint(a1, bowlT[t + 1]), D = bowlPoint(a0, bowlT[t + 1]);
      const walk = t === 2 && near; // the 11 m concourse gangway reads as a lighter band
      quad(walk ? 'conc' : 'seat', A, B, C, D, [-(A[0] + B[0]), 3, -(A[2] + B[2])]);
    }
  }
  if (near) { // pitch markings, 10 cm proud of the grass
    const y = PITCH_Y + 0.1, w = 0.12, up = [0, 1, 0];
    const line = (u0, v0, u1, v1) => {
      const dx = u1 - u0, dz = v1 - v0, l = Math.hypot(dx, dz), nx = -dz / l * w, nz = dx / l * w;
      quad('paint', ...[[u0 + nx, v0 + nz], [u1 + nx, v1 + nz], [u1 - nx, v1 - nz], [u0 - nx, v0 - nz]].map(([u, v]) => { const p = pitchPoint(u, v); return [p[0], y, p[1]]; }), up);
    };
    const L = PITCH.length / 2, W = PITCH.width / 2;
    for (const [a, c, d, e] of [[-L, -W, L, -W], [L, -W, L, W], [L, W, -L, W], [-L, W, -L, -W], [0, -W, 0, W]]) line(a, c, d, e);
    for (let i = 0; i < 24; i++) line(9.15 * Math.cos(i * TAU / 24), 9.15 * Math.sin(i * TAU / 24), 9.15 * Math.cos((i + 1) * TAU / 24), 9.15 * Math.sin((i + 1) * TAU / 24));
    for (const s of [-1, 1]) {
      line(s * L, -20.15, s * (L - 16.5), -20.15); line(s * (L - 16.5), -20.15, s * (L - 16.5), 20.15); line(s * (L - 16.5), 20.15, s * L, 20.15);
    }
  }

  // ---- esplanade deck (one metre thick, on pillars) and the dark concourse under the arena -------------------------------
  // The mapped deck stays level at 8.5 m round the arena and then grades down to the ground over its south wedge (the
  // mapped promenade/ramp from the U-Bahn leaves that way): the SE tip, 82 m beyond the plaza edge, lands on grade, and
  // the 25 m SW tail tapers to grade at its tip. Heights are set on the ring vertices (the ring is resampled every few
  // metres) and the earcut triangulation interpolates between them, so the surface stays one continuous skin.
  const step = near ? 9 : 18;
  const resample = (ring, closed = true) => {
    const out = [];
    ring.forEach((A, i) => { const B = ring[(i + 1) % ring.length], n = Math.max(1, Math.ceil(Math.hypot(B[0] - A[0], B[1] - A[1]) / step)); for (let k = 0; k < n; k++) out.push([A[0] + (B[0] - A[0]) * k / n, A[1] + (B[1] - A[1]) * k / n]); });
    return out;
  };
  const deckRing = resample(DECK), hole = PLAZA.map(p => new THREE.Vector2(p[0], p[1]));
  const deckH = ([x, z]) => {
    const d = edgeDistance(x, z, PLAZA), t = Math.min(1, Math.max(0, (d - RAMP_D0) / (RAMP_D1 - RAMP_D0)));
    let h = DECK_TOP * (1 - t * t * (3 - 2 * t));
    if (x < -56 && z > 137.9) { const u = Math.min(1, (z - 137.9) / (162 - 137.9)); h = Math.min(h, DECK_TOP * (1 - u * u * (3 - 2 * u))); }
    return Math.max(h, TIP_H);
  };
  const pts = [...deckRing, ...PLAZA], heights = pts.map((q, i) => i < deckRing.length ? deckH(q) : DECK_TOP);
  const topTris = [];
  for (const ids of THREE.ShapeUtils.triangulateShape(deckRing.map(p => new THREE.Vector2(p[0], p[1])), [hole])) topTris.push(ids);
  const bottomOf = (h) => Math.max(0, h - DECK_THICK);
  const edgeCount = new Map(), ekey = (i, j) => (i < j ? i + '_' + j : j + '_' + i);
  for (const ids of topTris) {
    const [A, B, C] = ids.map(i => pts[i]), [hA, hB, hC] = ids.map(i => heights[i]);
    tri('deck', [A[0], hA, A[1]], [B[0], hB, B[1]], [C[0], hC, C[1]], [0, 1, 0]);
    if (Math.max(hA, hB, hC) > DECK_THICK + 0.02) tri('dark', [A[0], bottomOf(hA), A[1]], [B[0], bottomOf(hB), B[1]], [C[0], bottomOf(hC), C[1]], [0, -1, 0]);
    for (let k = 0; k < 3; k++) { const i = ids[k], j = ids[(k + 1) % 3], key = ekey(i, j), e = edgeCount.get(key) || { n: 0, i, j, third: ids[(k + 2) % 3] }; e.n++; edgeCount.set(key, e); }
  }
  // Walls on every boundary edge of the slab (the outer ring faces out, the plaza opening faces the arena).
  for (const { n, i, j, third } of edgeCount.values()) {
    if (n !== 1) continue;
    const A = pts[i], B = pts[j], T = pts[third], ex = B[0] - A[0], ez = B[1] - A[1];
    const away = [(A[0] + B[0]) / 2 - T[0], 0, (A[1] + B[1]) / 2 - T[1]]; // outward of the slab = away from the triangle's third corner
    const outer = i < deckRing.length && j < deckRing.length;
    if (heights[i] - bottomOf(heights[i]) < 0.01 && heights[j] - bottomOf(heights[j]) < 0.01) continue;
    quad(outer ? (near ? 'conc' : 'deck') : 'dark', [A[0], heights[i], A[1]], [B[0], heights[j], B[1]], [B[0], bottomOf(heights[j]), B[1]], [A[0], bottomOf(heights[i]), A[1]], away);
  }
  // Height of the slab's top at a point (barycentric over the same triangles), for pillars and the landmark test.
  const deckAt = (x, z) => {
    for (const ids of topTris) {
      const [A, B, C] = ids.map(k => pts[k]), d = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]);
      if (Math.abs(d) < 1e-9) continue;
      const u = ((B[1] - C[1]) * (x - C[0]) + (C[0] - B[0]) * (z - C[1])) / d, v = ((C[1] - A[1]) * (x - C[0]) + (A[0] - C[0]) * (z - C[1])) / d, w = 1 - u - v;
      if (u >= -1e-6 && v >= -1e-6 && w >= -1e-6) return u * heights[ids[0]] + v * heights[ids[1]] + w * heights[ids[2]];
    }
    return null;
  };
  const outwardSign = ringArea(DECK) > 0 ? 1 : -1; // outward normal of edge (ex, ez) is sign * (ez, -ex)
  // Concourse wall under the deck, set in from the plaza edge.
  const baseCols = near ? 120 : 40;
  for (let c = 0; c < baseCols; c++) {
    const a0 = c * TAU / baseCols, a1 = (c + 1) * TAU / baseCols, r0 = rPlaza(a0) * 0.985, r1 = rPlaza(a1) * 0.985;
    quad('dark', [r0 * Math.cos(a0), 0, r0 * Math.sin(a0)], [r1 * Math.cos(a1), 0, r1 * Math.sin(a1)], [r1 * Math.cos(a1), DECK_BOTTOM, r1 * Math.sin(a1)], [r0 * Math.cos(a0), DECK_BOTTOM, r0 * Math.sin(a0)], [r0 * Math.cos(a0) + r1 * Math.cos(a1), 0, r0 * Math.sin(a0) + r1 * Math.sin(a1)]);
  }
  // Pillars under the outer deck edge: four faces, the tops buried in the slab, no cap on the ground.
  const pillars = [];
  if (near) {
    const spacing = 17;
    let next = spacing / 2; // distance to the next pillar along the perimeter, carried across short edges
    for (let i = 0; i < DECK.length; i++) {
      const A = DECK[i], B = DECK[(i + 1) % DECK.length], ex = B[0] - A[0], ez = B[1] - A[1], len = Math.hypot(ex, ez);
      const inx = -outwardSign * ez / len, inz = outwardSign * ex / len; // inward normal
      let d = next;
      for (; d < len; d += spacing) {
        const t = d / len, cx = A[0] + ex * t + inx * 1.8, cz = A[1] + ez * t + inz * 1.8, h = 0.7;
        if (!insideRing(cx, cz, DECK) || edgeDistance(cx, cz, DECK) < 1.2) continue; // a corner of the ramp tail
        const top = deckAt(cx, cz);
        if (top === null || top < 2.0) continue; // the graded south wedge is a solid ramp: no pillar where the slab nears the ground
        const c4 = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([u, v]) => [cx + u, cz + v]);
        pillars.push([cx, cz]);
        for (let q = 0; q < 4; q++) {
          const p = c4[q], n = c4[(q + 1) % 4];
          quad('conc', [p[0], 0, p[1]], [n[0], 0, n[1]], [n[0], top - 0.5, n[1]], [p[0], top - 0.5, p[1]], [p[0] + n[0] - 2 * cx, 0, p[1] + n[1] - 2 * cz]);
        }
      }
      next = d - len;
    }
  }

  for (const [mat, pos] of buffers) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); b.put(g, mat);
  }
  const model = b.finish();
  model.userData.cushions = cushions; model.userData.columns = K; model.userData.rows = M; model.userData.pillars = pillars; model.userData.deckAt = deckAt;
  return model;
}
