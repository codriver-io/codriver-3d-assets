// Inspector cameras, [eye, target] in model metres (+x east, +y up, +z south).
import { toWorld } from './rijksmuseum-plan.js';

const cam = (eu, ey, ev, tu, ty, tv) => [toWorld(eu, ey, ev), toWorld(tu, ty, tv)];

export const VIEWS = {
  overview: cam(70, 46, -95, 6, 20, -8),
  // Far enough, and aimed at mid-height, that the 54 m spires stay in the 40° frame.
  facade: cam(6, 20, -145, 6, 27, -40),
  south: cam(8, 14, 130, 6, 16, 15),
  roof: cam(18, 150, 8, 6, 24, 0),
  passage: cam(6.2, 5, -78, 6.2, 7, -40),
  tower: cam(-20, 36, -78, -9.3, 40, -38),
  east: cam(130, 22, -10, 40, 16, -6),
};
