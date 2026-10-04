// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The rue Notre-Dame front looks toward bearing
// 119.45 (ESE), the rear toward 299.45 (WNW, the Champ-de-Mars), the right end toward 209.45 and the left end toward 29.45.
// `at(s, d, y)` is a point in building axes (s along the front to the right, d outward from it); `cam(bearing, dist, y, target)`
// puts the camera `dist` metres toward `bearing` from the target.
import { AXIS_S, BEARING } from './hotel-de-ville-de-montreal-plan.js';
const rad = (d) => (d * Math.PI) / 180;
const at = (s, d, y) => [Math.round(Math.sin(rad(BEARING)) * (s + AXIS_S) + Math.cos(rad(BEARING)) * d), y, Math.round(-Math.cos(rad(BEARING)) * (s + AXIS_S) + Math.sin(rad(BEARING)) * d)];
const cam = (bearing, dist, y, target) => [[Math.round(target[0] + dist * Math.sin(rad(bearing))), y, Math.round(target[2] - dist * Math.cos(rad(bearing)))], target];
export const VIEWS = {
  overview: cam(150, 150, 62, at(0, -6, 14)),
  facade: cam(119.45, 95, 6, at(0, 18, 13)),
  portico: cam(112, 34, 5, at(0, 21, 8)),
  campanile: cam(125, 60, 32, at(0, 9, 30)),
  roof: cam(119.45, 30, 105, at(0, 3, 14)),
  rear: cam(299.45, 110, 13, at(0, -20, 12)),
  corner: cam(75, 85, 12, at(0, 0, 14)),
  end: cam(209.45, 100, 14, at(0, 0, 13)),
  pavilion: cam(70, 40, 9, at(-28, 18, 12)),
  terrace: cam(330, 70, 14, at(0, -30, 6)),
  dormers: cam(119.45, 38, 36, at(-18, 14, 22)),
};
