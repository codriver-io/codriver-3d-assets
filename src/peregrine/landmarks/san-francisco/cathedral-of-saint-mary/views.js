// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The model sits on a grid
// rotated 9.1 degrees, so each eye is the grid-frame position rotated by the same angle.
const R = (9.1 * Math.PI) / 180, c = Math.cos(R), s = Math.sin(R);
const g = (u, y, v) => [+(u * c + v * s).toFixed(1), y, +(-u * s + v * c).toFixed(1)]; // grid frame -> local metres
export const VIEWS = {
  overview: [g(110, 62, -95), g(0, 24, 0)],
  facade: [g(150, 9, 0), g(0, 28, 0)],
  roof: [g(45, 105, -55), g(0, 46, 0)],
  corner: [g(62, 22, -62), g(0, 33, 0)],
  fin: [g(41, 36, 14), g(20, 40, 0)],
  entrance: [g(62, 3, 5), g(31, 6, 0)],
  back: [g(-105, 45, 95), g(0, 28, 0)],
  gough: [g(100, 2, 25), g(0, 26, 0)],
  geary: [g(10, 2, -105), g(0, 26, 0)],
};
