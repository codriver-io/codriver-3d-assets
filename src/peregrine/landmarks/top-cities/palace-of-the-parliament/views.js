import { toWorld } from './palace-of-the-parliament-plan.js';

// Inspector cameras in the model's metres after the baked rotation (+x east, +y up, +z south).
const v = (bx, by, bz) => toWorld(bx, by, bz).map((n) => Math.round(n * 10) / 10);

export const VIEWS = {
  overview: [v(-190, 80, 380), v(10, 32, 30)],
  facade: [v(0, 46, 640), v(0, 34, 40)],
  roof: [v(40, 460, 20), v(0, 50, 0)],
  street: [v(36, 7, 230), v(-4, 18, 82)],
  west: [v(8, 50, -460), v(0, 32, -20)],
  detail: [v(22, 12, 145), v(6, 9, 90)],
};
