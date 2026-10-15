import { toWorld as p, VC, TOWER } from './black-church-brasov-plan.js';
// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). Written in the nave frame (u, y, v).
const TU = (TOWER.u0 + TOWER.u1) / 2, TV = TOWER.v;
export const VIEWS = {
  overview: [p(-95, 62, -80), p(5, 24, VC)],
  facade: [p(-92, 24, VC + 2), p(-24, 30, VC + 2)],
  roof: [p(30, 120, -55), p(0, 30, VC)],
  north: [p(-5, 22, -85), p(-4, 24, VC)],
  south: [p(0, 22, 88), p(-2, 24, VC)],
  apse: [p(100, 28, 20), p(40, 22, 1)],
  tower: [p(-62, 46, 40), p(TU, 44, TV)],
  portal: [p(-5, 10, -32), p(-4, 11, -11)],
  buttress: [p(-30, 9, -36), p(-14, 11, -11.5)],
};
