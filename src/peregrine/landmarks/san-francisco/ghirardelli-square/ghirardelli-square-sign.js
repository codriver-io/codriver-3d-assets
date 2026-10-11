import { SIGN, RECT, H } from './ghirardelli-square-plan.js';

// The rooftop "Ghirardelli" sign (1915 Panama-Pacific Exposition, rebuilt in aluminium in 2020): eleven
// serif letters, 152 ft x 19 ft, one-sided, facing the bay, on a steel scaffold over the Mustard and Cocoa
// roofs. Each letter is a handful of block strokes (boxes in the sign plane, one merged 'sign' mesh), so it
// reads as lettering from the water at 800 m and still shows serifs, bowls and the Q-less G at 100 m.
const T = 0.72, HAIR = 0.5, SERIF = 0.3, ASC = 5.8, XH = 3.4, CAP = 5.6;
const rad = (d) => (d * Math.PI) / 180;

function arc(cx, cy, rx, ry, a0, a1, n, w = HAIR) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = rad(a0 + ((a1 - a0) * i) / n); pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  const out = [];
  for (let i = 0; i < n; i++) out.push({ a: pts[i], b: pts[i + 1], w, ext: 0.32 });
  return out;
}
const stem = (s, t0, t1, w = T) => ({ a: [s, t0], b: [s, t1], w, ext: 0 });
const footSerif = (s, len = 1.5) => ({ a: [s - len / 2, SERIF / 2], b: [s + len / 2, SERIF / 2], w: SERIF, ext: 0 });
const topSerif = (s, t, len = 0.8) => ({ a: [s - len, t - 0.28], b: [s, t - 0.06], w: SERIF, ext: 0.2 });
const bar = (a, b, w = HAIR) => ({ a, b, w, ext: 0.2 });

// Glyphs: { w: advance width, strokes(n) }, n = arc segment count (near/far).
const GLYPH = {
  G: { w: 5.4, strokes: (n) => [...arc(2.7, CAP / 2, 2.55, CAP / 2, 38, 345, n, T * 0.9), stem(5.15, 1.55, 3.0, HAIR), bar([2.9, 3.0], [5.2, 3.0], 0.45)] },
  h: { w: 3.9, strokes: (n) => [stem(0.7, 0, ASC), footSerif(0.7), topSerif(0.7, ASC), ...arc(2.1, 2.3, 1.4, 1.1, 175, 0, n, HAIR), stem(3.5, 0, 2.3, HAIR), footSerif(3.5, 1.2)] },
  i: { w: 1.5, strokes: () => [stem(0.75, 0, XH), footSerif(0.75), topSerif(0.75, XH), stem(0.75, 4.5, 5.2, 0.7)] },
  r: { w: 3.0, strokes: () => [stem(0.7, 0, XH), footSerif(0.7), topSerif(0.7, XH), bar([0.7, 2.1], [1.15, 3.0]), bar([1.15, 3.0], [1.85, 3.35]), bar([1.85, 3.35], [2.5, 3.2]), stem(2.6, 2.95, 3.65, 0.6)] },
  a: { w: 3.6, strokes: (n) => [...arc(1.7, 2.5, 1.3, 0.9, 165, -5, n, HAIR), stem(3.05, 0.2, 2.5, 0.45), ...arc(1.65, 1.0, 1.35, 1.0, 0, 360, n + 2, HAIR), footSerif(3.05, 1.0)] },
  d: { w: 4.0, strokes: (n) => [...arc(1.75, 1.7, 1.7, 1.7, 0, 360, n + 2, HAIR), stem(3.3, 0, ASC), footSerif(3.3), topSerif(3.3, ASC)] },
  e: { w: 3.4, strokes: (n) => [...arc(1.7, 1.7, 1.65, 1.7, 5, 325, n + 1, HAIR), bar([0.15, 1.75], [3.3, 1.75], 0.4)] },
  l: { w: 1.5, strokes: () => [stem(0.75, 0, ASC), footSerif(0.75), topSerif(0.75, ASC)] },
};
export const WORD = 'Ghirardelli';

// Lays the word out at the sourced width: letter-spaced, as the real sign is.
export function layout() {
  const widths = [...WORD].map((c) => GLYPH[c === 'G' ? 'G' : c].w), sum = widths.reduce((a, b) => a + b, 0);
  const gap = (SIGN.width - sum) / (widths.length - 1);
  let s = 0; const out = [];
  [...WORD].forEach((c, i) => { out.push({ c, s0: s, w: widths[i] }); s += widths[i] + gap; });
  return { glyphs: out, gap };
}

// roof deck heights under the sign, from the plan: Cocoa (west of u = 4.2) is the taller roof
const deckY = (u) => (u > RECT.cocoa[1] ? H.mustard - 0.7 + 0.02 : H.cocoa - 0.7 + 0.02);

export function buildSign(F, detail) {
  const near = detail === 'near', n = near ? 14 : 7, { glyphs } = layout();
  const v = SIGN.v;
  // letters: one merged mesh
  let k = 0;
  for (const g of glyphs) {
    const strokes = GLYPH[g.c].strokes(n);
    for (const st of strokes) {
      const toWorld = ([s, t]) => [SIGN.uStart - (g.s0 + s), SIGN.baseline + t];
      F.stroke('sign', toWorld(st.a), toWorld(st.b), st.w * (near ? 1 : 1.35), v - 0.3, v + 0.35 + 0.012 * (k++ % 4), st.ext);
    }
  }
  // steel scaffold: posts every ~3.86 m in a front and a rear plane, rails, X-braces, and ties between planes
  const uHi = SIGN.uStart + 0.5, uLo = SIGN.uStart - SIGN.width - 0.5, bays = 12, step = (uHi - uLo) / bays;
  const vf = v + 0.58, vr = v + 0.58 + SIGN.frameDepth, sec = near ? 0.15 : 0.4, top = SIGN.frameTop;
  const levels = [deckY(uHi), 15.2, 18.4, 21.6, SIGN.baseline - 0.5, 27.4, top].filter((y, i, a) => i === 0 || y > a[i - 1] + 1);
  const post = (u, vv) => F.stroke('steel', [u, deckY(u)], [u, top], sec, vv - sec / 2, vv + sec / 2, 0);
  const rail = (y, vv, ua, ub) => F.stroke('steel', [ua, y], [ub, y], sec * 0.9, vv - sec / 2, vv + sec / 2, 0);
  for (let i = 0; i <= bays; i++) {
    const u = uHi - i * step;
    post(u, vf);
    if (near) post(u, vr);
  }
  const lowRoofEnd = RECT.cocoa[1] + 0.35; // rails below the Cocoa roof line stop at the Mustard side
  for (const y of levels.slice(1)) {
    const ua = y < H.cocoa - 0.7 ? lowRoofEnd : uLo, ub = uHi;
    if (!near && ![levels[1], levels[3], top].includes(y)) continue;
    rail(y, vf, ua, ub);
    if (near) rail(y, vr, ua, ub);
  }
  if (!near) return;
  // diagonals in the front plane
  for (let i = 0; i < bays; i++) {
    const ua = uHi - i * step, ub = ua - step;
    for (let j = 0; j < levels.length - 1; j++) {
      const y0 = levels[j], y1 = levels[j + 1];
      if (Math.min(ua, ub) < lowRoofEnd - 0.01 && y1 <= H.cocoa - 0.7) continue; // inside the Cocoa block
      if (y0 < deckY(Math.min(ua, ub)) - 0.01) continue;
      const flip = (i + j) % 2 === 0;
      F.stroke('steel', [flip ? ua : ub, y0], [flip ? ub : ua, y1], sec * 0.7, vf - sec * 0.35, vf + sec * 0.35, 0);
    }
  }
  // ties between the planes at every other post, at each rail level
  for (let i = 0; i <= bays; i += 2) {
    const u = uHi - i * step;
    for (const y of levels.slice(1)) { if (y < deckY(u) + 0.5) continue; F.box('steel', u - sec / 2, u + sec / 2, y - sec / 2, y + sec / 2, vf, vr); }
  }
}
