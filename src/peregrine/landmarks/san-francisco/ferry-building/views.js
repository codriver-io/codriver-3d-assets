// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south). Each value is [eye, target].
// The block runs along the Embarcadero at 323.8 degrees true; `w(u, y, v)` places a point in the facade frame
// (u along the building toward the north-north-west end, v from the Market Street front toward the bay) so the
// views stay square to it.
const beta = (323.8 * Math.PI) / 180, s = Math.sin(beta), c = Math.cos(beta);
const w = (u, y, v) => [+(u * s + v * c).toFixed(1), y, +(-u * c + v * s).toFixed(1)];

export const VIEWS = {
  overview: [w(120, 70, -230), w(0, 28, -10)],
  facade: [w(-20, 14, -150), w(0, 24, -25)],
  roof: [w(70, 150, -90), w(0, 15, 0)],
  tower: [w(50, 52, -95), w(0, 46, -19)],
  pavilion: [w(18, 6, -62), w(0.8, 9, -32)],
  bayside: [w(60, 18, 120), w(0, 14, 24)],
  end: [w(190, 14, 10), w(100, 9, 0)],
  sign: [w(-10, 26, 60), w(8, 20, 2)],
};
