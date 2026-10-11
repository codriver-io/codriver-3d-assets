// Inspector cameras, [eye, target] in model metres (+x east, +y up, +z south).
// The building frame is rotated 4.7°; these are world positions from palacio-real-de-madrid-plan.js.
import { world } from './palacio-real-de-madrid-plan.js';

const cam = (eu, ey, ev, tu, ty, tv) => [world(eu, ey, ev), world(tu, ty, tv)];

export const VIEWS = {
  overview: cam(100, 72, 130, 0, 22, 8),
  facade: cam(0, 16, 148, 0, 20, 58), // Plaza de la Armería, the south front
  roof: cam(24, 210, -16, 0, 20, 4),
  entrance: cam(7, 5.5, 96, 0, 8, 62),
  east: cam(145, 18, -6, 58, 18, -6), // Plaza de Oriente
  west: cam(-150, 24, 4, -58, 16, 4), // Campo del Moro
  north: cam(4, 18, -145, 0, 20, -60),
  court: cam(22, 48, 6, -2, 14, -6),
};
