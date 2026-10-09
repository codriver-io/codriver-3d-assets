// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// +s is the keel toward NNE; +a faces the lake. The road facade is −a.
import { world } from './vikingskipet-hull.js';

const shot = (s, a, y, ts, ta, ty) => [world(s, a, y), world(ts, ta, ty)];

export const VIEWS = {
  overview: shot(-80, -110, 48, 6, 0, 14),
  facade: shot(8, -145, 10, 8, -30, 12),
  roof: shot(-16, 20, 175, 0, 0, 16),
  prow: shot(-190, -36, 14, -40, 0, 8),
  lake: shot(10, 165, 18, 0, 12, 12),
  detail: shot(16, -70, 7, 9, -46, 5),
};
