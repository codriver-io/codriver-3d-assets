// "UNION STATION" as raised block letters on the colonnade frieze. No font, no outline data:
// each glyph is a handful of strokes in a unit cell (x right, y up), built from boxes.
const T = 0.17; // stroke thickness in cell units
const GLYPHS = {
  U: [[0, 0, T, 1], [1 - T, 0, 1, 1], [0, 0, 1, T]],
  N: [[0, 0, T, 1], [1 - T, 0, 1, 1], [0.13, 0.66, 0.36, 0.94], [0.36, 0.36, 0.64, 0.66], [0.64, 0.06, 0.87, 0.36]],
  I: [[0.34, 0, 0.66, 1]],
  O: [[0, 0, T, 1], [1 - T, 0, 1, 1], [0, 0, 1, T], [0, 1 - T, 1, 1]],
  S: [[0, 1 - T, 1, 1], [0, 0.5, T, 1], [0, 0.5 - T / 2, 1, 0.5 + T / 2], [1 - T, 0, 1, 0.5], [0, 0, 1, T]],
  T: [[0, 1 - T, 1, 1], [0.5 - T / 2, 0, 0.5 + T / 2, 1]],
  A: [[0, 0, T, 0.72], [1 - T, 0, 1, 0.72], [0.12, 1 - T, 0.88, 1], [0, 0.4, 1, 0.4 + T]],
};

/**
 * Viewed from Front Street the reader's right is west, so the first letter sits at the
 * largest u and the word runs toward smaller u. `at` is the mid-point of the whole line.
 */
export function addLettering({ box }, { u, y, v }, text = 'UNION STATION', height = 1.7) {
  const w = height * 0.78, gap = height * 0.42, space = height * 0.9;
  let total = 0;
  for (const ch of text) total += (ch === ' ' ? space : w + gap);
  total -= gap;
  let x = total / 2; // running position measured from the mid-point toward +u (the start of the word)
  for (const ch of text) {
    if (ch === ' ') { x -= space; continue; }
    const strokes = GLYPHS[ch];
    for (const [x0, y0, x1, y1] of strokes) {
      // glyph x grows to the reader's right = toward -u
      box('metal', u + x - x1 * w, u + x - x0 * w, y + y0 * height, y + y1 * height, v - 0.07, v);
    }
    x -= w + gap;
  }
}
