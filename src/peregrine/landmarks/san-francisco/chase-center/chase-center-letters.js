// Block letters for the "CHASE CENTER" sign, as axis-aligned rectangles and diagonal bars.
// Each glyph lives in a 0.7 wide x 1 tall cell; strokes are 0.17 thick. Original geometry.
const T = 0.17, W = 0.7;
const R = (x0, y0, x1, y1) => ({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, a: 0 });
const D = (x0, y0, x1, y1) => ({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: Math.hypot(x1 - x0, y1 - y0) + T * 0.5, h: T, a: Math.atan2(y1 - y0, x1 - x0) });
const GLYPHS = {
  C: [R(0, 0, T, 1), R(T, 1 - T, W, 1), R(T, 0, W, T)],
  H: [R(0, 0, T, 1), R(W - T, 0, W, 1), R(T, 0.415, W - T, 0.585)],
  A: [R(0, 0, T, 0.83), R(W - T, 0, W, 0.83), R(0, 0.83, W, 1), R(T, 0.4, W - T, 0.57)],
  S: [R(0, 1 - T, W, 1), R(0, 0.585, T, 1 - T), R(T, 0.415, W - T, 0.585), R(W - T, T, W, 0.415), R(0, 0, W, T)],
  E: [R(0, 0, T, 1), R(T, 1 - T, W, 1), R(T, 0.415, 0.55, 0.585), R(T, 0, W, T)],
  N: [R(0, 0, T, 1), R(W - T, 0, W, 1), D(T + 0.04, 0.9, W - T - 0.04, 0.1)],
  T: [R(0, 1 - T, W, 1), R(W / 2 - T / 2, 0, W / 2 + T / 2, 1 - T)],
  R: [R(0, 0, T, 1), R(T, 1 - T, W - T, 1), R(T, 0.415, W - T, 0.585), R(W - T, 0.415, W, 1), D(0.3, 0.42, 0.62, 0.04)],
};
const GAP = 0.28;
// Returns { strokes: [{ s, h, w, ht, a }], logoAt, length }: positions along the text and height up, in
// metres, for a letter height H. The logo (a blue octagon) sits between the two words.
export function signLayout(H = 2.4, logoGap = 0.5) {
  const strokes = []; let s = 0; let logoAt = 0;
  const word = (text) => {
    for (const ch of text) {
      for (const g of GLYPHS[ch]) strokes.push({ s: s + g.cx * H, h: g.cy * H, w: g.w * H, ht: g.h * H, a: g.a });
      s += (W + GAP) * H;
    }
    s -= GAP * H;
  };
  word('CHASE'); s += logoGap * H; logoAt = s + 0.5 * H; s += H + logoGap * H; word('CENTER');
  return { strokes, logoAt, logoR: 0.5 * H, length: s };
}
