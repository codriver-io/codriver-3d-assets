// Stroke letters for the red ROGERS CENTRE signs: polylines on a 3 x 5 grid (x right, y up),
// drawn as merged bars. Only the letters the words need.
const G = {
  R: [[[0, 0], [0, 5], [2.5, 5], [3, 4.5], [3, 3], [2.5, 2.5], [0, 2.5]], [[1.3, 2.5], [3, 0]]],
  O: [[[0.3, 0], [0, 0.5], [0, 4.5], [0.3, 5], [2.7, 5], [3, 4.5], [3, 0.5], [2.7, 0], [0.3, 0]]],
  G: [[[3, 4.4], [2.7, 5], [0.3, 5], [0, 4.5], [0, 0.5], [0.3, 0], [2.7, 0], [3, 0.5], [3, 2.4], [1.6, 2.4]]],
  E: [[[3, 5], [0, 5], [0, 0], [3, 0]], [[0, 2.5], [2.3, 2.5]]],
  S: [[[3, 4.4], [2.7, 5], [0.3, 5], [0, 4.5], [0, 3.1], [0.4, 2.5], [2.6, 2.5], [3, 1.9], [3, 0.5], [2.7, 0], [0.3, 0], [0, 0.6]]],
  C: [[[3, 4.4], [2.7, 5], [0.3, 5], [0, 4.5], [0, 0.5], [0.3, 0], [2.7, 0], [3, 0.6]]],
  N: [[[0, 0], [0, 5], [3, 0], [3, 5]]],
  T: [[[0, 5], [3, 5]], [[1.5, 5], [1.5, 0]]],
};
export const LETTER_W = 3, LETTER_H = 5;

/** Segments [[x0,y0],[x1,y1]] in metres for a word, x from 0 at the left edge, y up from 0. */
export function wordSegments(text, height, gap = 1.1) {
  const s = height / LETTER_H, out = [];
  let x = 0;
  for (const ch of text) {
    if (ch === ' ') { x += (LETTER_W * 0.82 + gap * 0.9) * s * 0.9; continue; }
    for (const line of G[ch]) for (let i = 1; i < line.length; i++) out.push([[x + line[i - 1][0] * s * 0.82, line[i - 1][1] * s], [x + line[i][0] * s * 0.82, line[i][1] * s]]);
    x += (LETTER_W * 0.82 + gap * 0.9) * s * 1;
  }
  return { segments: out, width: x - gap * 0.9 * s };
}
