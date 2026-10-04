// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The model is authored in its own frame (x along the
// front, z out of it) and turned by 131.1 degrees; `w` converts building-frame points so each view is written where the thing is.
const A = (180 - 48.9) * Math.PI / 180, c = Math.cos(A), s = Math.sin(A);
const w = (x, y, z) => [Math.round((x * c + z * s) * 10) / 10, y, Math.round((-x * s + z * c) * 10) / 10];
export const VIEWS = {
  overview: [w(70, 62, 150), w(0, 22, 0)],
  facade: [w(0, 16, 135), w(0, 22, 0)],
  roof: [w(-90, 125, 95), w(0, 18, 0)],
  tower: [w(14, 44, 78), w(0, 41, 40)],
  back: [w(-60, 30, -115), w(0, 18, -20)],
  pavilion: [w(70, 18, 80), w(38, 15, 36)],
  courtyard: [w(60, 45, -10), w(-10, 12, 5)],
};
