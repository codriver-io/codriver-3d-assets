// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The façade looks toward bearing 303.5
// (west-north-west): in model metres that is (-0.834, -0.552) per metre of building +z, the nave's axis runs the other way.
const dir = (z, x = 0) => { // building (x across, z along the nave toward the façade) -> model east/south, about the dome axis (9.65, 7.04)
  const th = (-123.5 * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
  return [9.65 + x * c + z * s, 7.04 - x * s + z * c];
};
const P = (x, y, z) => { const [e, s] = dir(z, x); return [Math.round(e * 10) / 10, y, Math.round(s * 10) / 10]; };
export const VIEWS = {
  overview: [P(95, 52, 128), P(0, 28, 6)],
  facade: [P(-6, 9, 150), P(0, 26, 40)],
  roof: [P(-60, 190, 90), P(0, 36, -2)],
  dome: [P(-30, 80, 56), P(0, 54, 0)],
  portico: [P(-18, 6, 90), P(0, 12, 64)],
  side: [P(170, 14, 24), P(0, 22, 12)],
  rear: [P(-70, 40, -120), P(0, 28, -10)],
  corner: [P(48, 20, 98), P(10, 24, 50)],
  photo1: [P(72, 3, 108), P(5, 24, 38)],
  photo2: [P(0, 3, 128), P(0, 24, 55)],
  under: [P(-3, 2.5, 67), P(3, 19, 61)],
  oblique: [P(40, 60, 80), P(10, 26, 20)],
  transept: [P(62, 16, -6), P(32, 18, 0)],
  eave: [P(-48, 2, 30), P(-20, 24, 36)],
  left: [P(-95, 14, 30), P(-20, 16, 20)],
  street: [P(34, 2, 170), P(0, 26, 30)],
  distant: [P(380, 30, 760), P(0, 30, 0)],
  lantern: [P(22, 66, 40), P(0, 66, 0)],
};
