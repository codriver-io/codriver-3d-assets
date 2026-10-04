// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// Placed in the facade frame (u along the platforms, v toward the city) and converted once.
import { toWorld } from './amsterdam-centraal-site.js';

const cam = (u, y, v) => { const [x, z] = toWorld(u, v); return [+x.toFixed(2), y, +z.toFixed(2)]; };

export const VIEWS = {
  overview: [cam(-90, 55, 210), cam(10, 14, -40)],
  facade: [cam(4, 16, 150), cam(4, 15, -6)],
  roof: [cam(40, 120, 90), cam(6, 16, -15)],
  detail: [cam(4, 8, 38), cam(3.6, 16, 0)],
  sheds: [cam(20, 30, -240), cam(0, 12, -90)],
  east: [cam(270, 36, 20), cam(140, 12, -30)],
};
