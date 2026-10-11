// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// Authored in the building frame (+x toward Elizabeth Tower, +z toward the Thames) and turned by PLAN.angle.
import { PLAN } from './palace-of-westminster-plan.js';

const c = Math.cos(PLAN.angle), s = Math.sin(PLAN.angle);
const w = (x, y, z) => [Math.round((x * c + z * s) * 10) / 10, y, Math.round((-x * s + z * c) * 10) / 10];

export const VIEWS = {
  overview: [w(-15, 80, 290), w(10, 32, 0)],
  facade: [w(20, 20, 155), w(20, 24, 20)],
  roof: [w(40, 230, 90), w(5, 30, -5)],
  elizabeth: [w(210, 48, 130), w(151.6, 48, -27)],
  victoria: [w(-280, 55, -140), w(-118, 55, -34)],
  west: [w(45, 26, -175), w(40, 16, -55)],
  clock: [w(151.6, 54.9, 28), w(151.6, 54.9, -27)],
  hall: [w(50, 18, -140), w(50, 14, -70)],
};
