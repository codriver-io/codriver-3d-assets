// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south), placed in the basilica's own axes
// (front on +z, nave axis along z, +x south-east) and carried onto the mapped grid.
import { toWorld } from './basilique-sainte-anne-de-beaupre-plan.js';
const v = (x, y, z) => toWorld(x, y, z).map((n) => Math.round(n * 10) / 10);
export const VIEWS = {
  overview: [v(120, 70, 135), v(0, 28, -4)],
  facade: [v(0, 20, 150), v(0, 40, 40)],
  roof: [v(60, 150, 70), v(0, 24, -6)],
  towers: [v(40, 60, 100), v(8, 56, 38)],
  side: [v(115, 24, 8), v(0, 20, 0)],
  apse: [v(40, 30, -120), v(0, 15, -38)],
  portal: [v(14, 9, 72), v(0, 11, 44)],
};
