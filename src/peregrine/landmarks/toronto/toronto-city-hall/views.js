import { uv } from './toronto-city-hall-site.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south, origin = the chamber's
// central column). Each value is [eye, target]. The street grid is 16.7 degrees north of east, so the square
// (podium front, pool, arches) lies south-south-east of the origin; cameras below are placed on the grid
// with uv(u, v) (u along the grid's east, v along its south) so they read like photographs taken from the square.
const at = (u, y, v) => { const [x, z] = uv(u, v); return [x, y, z]; };

export const VIEWS = {
  overview: [at(120, 120, 300), at(0, 25, 50)],
  facade: [at(40, 18, 235), at(0, 36, 20)],
  roof: [at(60, 175, 70), at(0, 80, -5)],
  structure: [at(-150, 45, 100), at(0, 30, 10)],
  square: [at(-8, 2.2, 118), at(0, 40, 0)],
  street: [at(-30, 2, 225), at(0, 30, 60)],
  arches: [at(-14, 1.8, 146), at(20, 8, 146)],
  north: [at(20, 30, -140), at(0, 45, 0)],
  chamber: [at(-6, 12, 84), at(0, 15, 0)],
  plan: [at(0, 330, 60), at(0, 0, 55)],
  ramp: [at(75, 4, 150), at(20, 12, 50)],
};
