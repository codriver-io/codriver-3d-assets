import { BufferGeometry, Float32BufferAttribute } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, LENGTH as L, CREST, HALF, KERB, MAIN_PIERS, PIER_S, girderDepth } from './tromso-bridge-profile.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = bridgeBuilder(p, detail), h = p.deckHeight;
  const chunk = s => near ? Math.min(3, Math.floor(s / (L / 4))) : 0;
  const P = (s, d, y) => b.xyz(s, d, y);
  // Closed, crisp ribbons sample haunches and alignment nodes exactly.
  function ribbon(mat, a, c, left, right, top, bottom) {
    const cuts = [a, ...(near ? [L / 4, L / 2, 3 * L / 4].filter(s => s > a && s < c) : []), c];
    for (let k = 1; k < cuts.length; k++) {
      const A = cuts[k - 1], C = cuts[k], step = near ? 5 : 25;
      const set = new Set([A, C]);
      for (let s = Math.ceil(A / step) * step; s < C; s += step) set.add(s);
      for (const s of [...p.ALIGNMENT.map(q => q.s), ...MAIN_PIERS, CREST]) if (s > A && s < C) set.add(s);
      const ss = [...set].sort((x, y) => x - y).filter((s, i, all) => !i || s - all[i - 1] > 0.001);
      const pos = [], idx = [];
      const quad = v => {
        // The ramp toes taper to grade: omit collapsed triangles and unused vertices.
        const valid = [[0, 1, 2], [0, 2, 3]].filter(([a, c, d]) => {
          const u = v[c].map((x, i) => x - v[a][i]), w = v[d].map((x, i) => x - v[a][i]);
          return Math.hypot(u[1]*w[2]-u[2]*w[1], u[2]*w[0]-u[0]*w[2], u[0]*w[1]-u[1]*w[0]) > 1e-8;
        });
        const used = [...new Set(valid.flat())], n = pos.length / 3;
        pos.push(...used.flatMap(i => v[i]));
        for (const t of valid) idx.push(...t.map(i => n + used.indexOf(i)));
      };
      const corners = ss.map(s => [P(s, left, top(s)), P(s, right, top(s)), P(s, left, bottom(s)), P(s, right, bottom(s))]);
      for (let i = 1; i < ss.length; i++) {
        const [a0, a1, a2, a3] = corners[i - 1], [c0, c1, c2, c3] = corners[i];
        quad([a0, a1, c1, c0]); quad([a2, c2, c3, a3]);
        quad([a0, c0, c2, a2]); quad([a1, a3, c3, c1]);
      }
      const [s0, s1, s2, s3] = corners[0], [e0, e1, e2, e3] = corners.at(-1);
      quad([s0, s2, s3, s1]); quad([e0, e1, e3, e2]);
      const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals(); b.put(g, mat, chunk((A + C) / 2));
    }
  }
  const strip = (mat, a, c, dl, dr, off, depth) => ribbon(mat, a, c, dl, dr,
    s => Math.max(0, h(s) + off), s => Math.max(0, h(s) + off - depth));
  // Slab recessed below live pavement; kerbs remain proud.
  strip('concrete', 30, L - 30, -HALF, HALF, -0.18, 0.55);
  strip('asphalt', 0, L, -KERB, KERB, 0, 0.16);
  for (const o of [-1, 1]) {
    strip('concrete', 0, L, o < 0 ? -HALF : KERB, o < 0 ? -KERB : HALF, 0.18, 0.9);
    ribbon('concrete', 30, L - 30, o * 2.2 - 0.3, o * 2.2 + 0.3,
      s => Math.max(0, h(s) - 0.65), s => Math.max(0, h(s) - girderDepth(s)));
  }
  // Slender twin-column bents. Footings stay fixed; shaft attachment interpolates to the cap.
  for (const s of PIER_S.slice(1, -1)) {
    const y = h(s) - girderDepth(s), ck = chunk(s), main = MAIN_PIERS.includes(s);
    if (y < 0.8) continue;
    const capD = main ? 0.9 : 0.45, colTop = y - capD + 0.04;
    for (const d of [-2.2, 2.2]) b.box('concrete', s, d, colTop / 2,
      main ? 1.15 : 0.65, main ? 0.95 : 0.65, colTop, ck,
      yy => Math.max(0, Math.min(1, yy / colTop)));
    b.box('concrete', s, 0, y - capD / 2, main ? 1.7 : 1.0, 5.4, capD + 0.08, ck);
    if (main) {
      b.box('concrete', s, 0, 0.8, 9, 8.3, 1.6, ck, 0);
      if (near) for (const u of [-3.5, 3.5]) for (const d of [-3.3, 3.3])
        b.box('concrete', s + u, d, 1.8, 0.3, 0.3, 2, ck, 0);
    }
  }
  if (near) {
    for (let s = 6; s < L - 5; s += 12) strip('yellow', s, Math.min(L, s + 3), -0.055, 0.055, 0.03, 0.012);
    for (const d of [-2.8, 2.8]) strip('paint', 0, L, d - 0.055, d + 0.055, 0.028, 0.012);
  }
  // Safety fence bends inward above an open lower railing, following the 2008 reference.
  for (const o of [-1, 1]) {
    const d = o * (HALF - 0.10);
    for (const [off, inset] of [[0.85, 0], [1.35, 0], [2.85, 0.42]])
      strip('rail', 2, L - 2, d - o * inset - 0.035, d - o * inset + 0.035, off, 0.07);
    for (let s = 2; s < L - 1; s += near ? 3 : 20) {
      const ck = chunk(s), ys = h(s);
      b.beam('rail', [s, d, ys + 0.18], [s, d, ys + 1.45], near ? 0.06 : 0.095, undefined, ck);
      const count = near ? 3 : 2;
      for (let j = 0; j < count; j++) {
        const t = j / count, u = (j + 1) / count;
        b.beam('rail', [s, d - o * 0.42 * t * t, ys + 1.45 + 1.4 * t],
          [s, d - o * 0.42 * u * u, ys + 1.45 + 1.4 * u], near ? 0.035 : 0.07, undefined, ck);
      }
    }
  }
  // Lamps remain in far for an identical vertical envelope; individual heads are simplified.
  for (let s = 22, i = 0; s < L - 20; s += 38, i++) {
    const o = i % 2 ? 1 : -1, d = o * (HALF - 0.25), y = h(s), ck = chunk(s);
    b.beam('rail', [s, d, y + 0.18], [s, d, y + 8.1], 0.12, undefined, ck);
    b.beam('rail', [s, d, y + 8.1], [s, d - o * 1.5, y + 8.35], 0.095, undefined, ck);
    b.box(near ? 'lamp' : 'rail', s, d - o * 1.5, y + 8.28, 0.75, 0.32, 0.16, ck);
  }
  return b.finish();
}
