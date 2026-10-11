// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south), placed in the cathedral's own
// axes (front on +z, nave axis along z, +x north) and carried onto the mapped grid.
import { toWorld } from './grace-cathedral-plan.js';
const v = (x, y, z) => toWorld(x, y, z).map((n) => Math.round(n * 10) / 10);
export const VIEWS = {
  overview: [v(95, 62, 118), v(0, 24, -2)],
  facade: [v(6, 24, 118), v(0, 30, 40)],
  roof: [v(40, 125, 60), v(0, 36, -6)],
  towers: [v(34, 52, 86), v(0, 42, 38)],
  south: [v(-100, 26, 14), v(0, 28, 6)],
  fleche: [v(-34, 54, -66), v(0, 56, -18)],
  apse: [v(-10, 24, -106), v(0, 26, -38)],
  portal: [v(8, 12, 74), v(0, 13, 42)],
};
