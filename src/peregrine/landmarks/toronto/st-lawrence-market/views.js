// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. The hall is turned 17.13 degrees: its Front Street
// facade faces NNW (towards -Z and a little -X), its Esplanade end faces SSE.
const p = 17.13 * Math.PI / 180, c = Math.cos(p), s = Math.sin(p);
// Model (u, v) -> world (x, z): x = u c + v s, z = -u s + v c
const w = (u, y, v) => [Math.round((u * c + v * s) * 10) / 10, y, Math.round((-u * s + v * c) * 10) / 10];
export const VIEWS = {
  overview: [w(-70, 62, -120), w(0, 8, 0)],
  facade: [w(4, 9, -92), w(0, 10, -52)],
  roof: [w(46, 68, 40), w(0, 15, 6)],
  structure: [w(-58, 15, 96), w(0, 6, 40)],
  entrance: [w(-30, 4, -68), w(-12, 6, -54)],
  colonnade: [w(38, 3.4, 86), w(6, 6, 52)],
  side: [w(-72, 14, -10), w(0, 8, -10)],
};
