// The rooftop sign, "Fairmont" over "ROYAL YORK", drawn as geometry: a stroke font (polylines in a
// unit box) turned into square-section bars. Lettering is a landmark feature (it is what a driver
// reads from Front Street and from the lake), so it is real geometry, in the self-lit `sign` material.

const ell = (cx, cy, rx, ry, n = 14, from = 0, to = Math.PI * 2) => Array.from({ length: n + 1 }, (_, i) => { const a = from + (to - from) * i / n; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });

// Block capitals, x in [0, 1], y in [0, 1].
const CAPS = {
  R: [[[0, 0], [0, 1], [0.7, 1], [0.95, 0.86], [0.95, 0.66], [0.7, 0.5], [0, 0.5]], [[0.5, 0.5], [1, 0]]],
  O: [ell(0.5, 0.5, 0.5, 0.5, 12)],
  Y: [[[0, 1], [0.5, 0.52]], [[1, 1], [0.5, 0.52]], [[0.5, 0.52], [0.5, 0]]],
  A: [[[0, 0], [0.5, 1], [1, 0]], [[0.18, 0.36], [0.82, 0.36]]],
  L: [[[0, 1], [0, 0], [0.85, 0]]],
  K: [[[0, 0], [0, 1]], [[0.95, 1], [0.02, 0.4]], [[0.32, 0.62], [1, 0]]],
};
// A flowing lower/upper case for "Fairmont": the same idea, x in [0, 1], y in [0, 1] with ascenders up to 1.
const SCRIPT = {
  F: [[[0.15, 0], [0.4, 1], [1, 1]], [[0.3, 0.52], [0.8, 0.52]]],
  a: [ell(0.48, 0.3, 0.38, 0.3, 10), [[0.86, 0.6], [0.8, 0]]],
  i: [[[0.3, 0], [0.42, 0.6]], [[0.45, 0.82], [0.47, 0.9]]],
  r: [[[0.2, 0], [0.32, 0.6]], [[0.3, 0.42], [0.55, 0.6], [0.9, 0.56]]],
  m: [[[0.05, 0], [0.16, 0.6]], [[0.16, 0.42], [0.3, 0.6], [0.44, 0.4], [0.4, 0]], [[0.44, 0.4], [0.58, 0.6], [0.72, 0.4], [0.7, 0]]],
  o: [ell(0.5, 0.3, 0.42, 0.3, 10)],
  n: [[[0.1, 0], [0.22, 0.6]], [[0.22, 0.42], [0.42, 0.6], [0.62, 0.4], [0.6, 0]]],
  t: [[[0.5, 1], [0.34, 0]], [[0.14, 0.58], [0.78, 0.58]]],
};

// Lay a word out: returns strokes as polylines in sign units (width along u, height along y).
// advance is per-letter (width factor), height is the letter height, shear leans it (italic script).
export function word(text, font, { height, gap = 0.28, shear = 0, widths = {} } = {}) {
  const out = []; let x = 0;
  for (const ch of text) {
    if (ch === ' ') { x += height * 0.55; continue; }
    const glyph = font[ch], w = (widths[ch] ?? 0.72) * height;
    for (const line of glyph) out.push(line.map(([gx, gy]) => [x + gx * w + shear * gy * height, gy * height]));
    x += w + gap * height;
  }
  return { strokes: out, width: x - gap * height };
}
export const royalYork = (h) => word('ROYAL YORK', CAPS, { height: h, widths: { Y: 0.8, A: 0.85, L: 0.6, K: 0.75, R: 0.72, O: 0.78 }, gap: 0.36 });
export const fairmont = (h) => word('Fairmont', SCRIPT, { height: h, shear: 0.22, gap: 0.05, widths: { F: 0.85, a: 0.8, i: 0.5, r: 0.7, m: 1.1, o: 0.8, n: 0.85, t: 0.7 } });
