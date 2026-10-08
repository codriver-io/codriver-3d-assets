// Inspector cameras, [eye, target] in model metres (+x east, +y up, +z south).
// The front faces bearing 120°; these eyes are in the building frame, then baked.
import { world } from './royal-palace-oslo-plan.js';

const cam = (eu, ey, ev, tu, ty, tv) => [world(eu, ey, ev), world(tu, ty, tv)];

export const VIEWS = {
  overview: cam(78, 52, 145, 0, 12, 4),
  facade: cam(0, 16, 175, 0, 12, 12),
  roof: cam(18, 150, 8, 0, 18, 0),
  entrance: cam(7, 4.5, 52, 0, 8, 24),
  north: cam(6, 18, -115, 0, 10, -8),
  side: cam(-145, 24, 18, -10, 12, 0),
  plan: cam(0, 210, 0, 0, 0, 0),
};
