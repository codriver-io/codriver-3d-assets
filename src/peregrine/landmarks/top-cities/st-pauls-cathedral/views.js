// Inspector cameras, [eye, target] in model metres (+x east, +y up, +z south).
import { toWorld } from './st-pauls-cathedral-plan.js';

const eye = (u, y, v) => toWorld(u, y, v);

export const VIEWS = {
  overview: [eye(-120, 78, 125), eye(-8, 32, 0)],
  facade: [eye(-155, 20, 18), eye(-50, 30, 0)],
  roof: [eye(24, 200, 18), eye(0, 30, 0)],
  south: [eye(-8, 26, 145), eye(-6, 32, 0)],
  east: [eye(155, 22, 28), eye(40, 26, 0)],
  entrance: [eye(-112, 5, 8), eye(-78, 12, 0)],
  dome: [eye(-46, 62, 54), eye(0, 96, 0)],
  tower: [eye(-118, 40, 46), eye(-78, 46, 18)],
};
