// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south). Each value is [eye, target].
// The block runs at 18.2 degrees true (rue Saint-Paul front on the west-north-west side, the river on the east-south-east);
// `w(u, y, v)` places a point in the facade frame (u along the market toward the NNE end, v from rue Saint-Paul toward the river)
// so the views stay square to it.
const beta = (18.2 * Math.PI) / 180, s = Math.sin(beta), c = Math.cos(beta);
const w = (u, y, v) => [+(u * s + v * c).toFixed(1), y, +(-u * c + v * s).toFixed(1)];

export const VIEWS = {
  overview: [w(-150, 62, -120), w(0, 14, 0)],
  facade: [w(-45, 9, -70), w(0, 14, -10)],
  roof: [w(40, 130, -60), w(0, 18, 0)],
  dome: [w(40, 38, -50), w(0, 31, 0)],
  river: [w(-70, 10, 85), w(0, 17, 0)],
  portico: [w(-14, 5, -38), w(0, 8, -12)],
  pavilion: [w(115, 14, -50), w(72, 10, -8)],
  end: [w(135, 8, 15), w(80, 8, 0)],
  arcade: [w(-20, 3, 30), w(-5, 3, 10)],
};
