// The rooftop sign "PALLISER", drawn as geometry: a stroke font (polylines in a unit box) turned into flat ribbons
// lying on the slate slope. Lettering is the hotel's most legible roof feature, so it is real geometry in the
// self-lit `sign` material (pale grey by day, warm lit at night). The letter forms are ours, drawn with as few strokes as
// still read (about 30 bars); the word follows the photographs.

const CAPS = {
  P: [[[0, 0], [0, 1], [0.8, 1], [0.95, 0.76], [0.8, 0.52], [0, 0.52]]],
  A: [[[0, 0], [0.5, 1], [1, 0]], [[0.2, 0.36], [0.8, 0.36]]],
  L: [[[0, 1], [0, 0], [0.85, 0]]],
  I: [[[0.5, 1], [0.5, 0]]],
  S: [[[0.92, 0.86], [0.5, 1], [0.08, 0.82], [0.1, 0.62], [0.5, 0.5], [0.92, 0.36], [0.92, 0.16], [0.5, 0], [0.08, 0.14]]],
  E: [[[0.92, 1], [0, 1], [0, 0], [0.92, 0]], [[0, 0.52], [0.7, 0.52]]],
  R: [[[0, 0], [0, 1], [0.8, 1], [0.95, 0.76], [0.8, 0.52], [0, 0.52]], [[0.5, 0.52], [1, 0]]],
};
const WIDTH = { P: 0.78, A: 0.92, L: 0.66, I: 0.3, S: 0.76, E: 0.7, R: 0.8 };

// Strokes (polylines in sign units: a along the word, b up) for a word of capitals of height h.
export function word(text, h, gap = 0.3) {
  const strokes = []; let a = 0;
  for (const ch of text) {
    const w = (WIDTH[ch] ?? 0.75) * h;
    for (const line of CAPS[ch]) strokes.push(line.map(([x, y]) => [a + x * w, y * h]));
    a += w + gap * h;
  }
  return { strokes, width: a - gap * h };
}

// One ribbon (a quad) per stroke segment, of width `stroke`, as pairs of plan points [a, b].
export function ribbons(strokes, stroke) {
  const out = [];
  for (const line of strokes) {
    for (let i = 0; i + 1 < line.length; i++) {
      const [a0, b0] = line[i], [a1, b1] = line[i + 1], dx = a1 - a0, dy = b1 - b0, L = Math.hypot(dx, dy);
      if (L < 1e-6) continue;
      const px = (-dy / L) * stroke / 2, py = (dx / L) * stroke / 2;
      out.push([[a0 + px, b0 + py], [a1 + px, b1 + py], [a1 - px, b1 - py], [a0 - px, b0 - py]]);
    }
  }
  return out;
}
