// Inspector cameras, [eye, target] in model metres (+x east, +y up, +z south).
import { toWorld } from './nidaros-cathedral-plan.js';

const eye = (u, y, v) => toWorld(u, y, v);

export const VIEWS = {
  overview: [eye(-78, 52, 88), eye(6, 22, 0)],
  facade: [eye(-118, 18, 1.2), eye(-20, 22, 1.1)],
  roof: [eye(18, 140, 62), eye(8, 24, 0)],
  south: [eye(6, 24, 92), eye(4, 18, 0)],
  east: [eye(118, 32, 16), eye(28, 22, 0)],
  rose: [eye(-72, 20.5, 1.1), eye(-47, 20.4, 1.13)],
  portal: [eye(-70, 4.2, 1.1), eye(-47, 4, 1.13)],
  spire: [eye(-36, 48, 52), eye(2, 62, 0)],
};
