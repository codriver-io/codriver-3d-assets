import { F } from './sfmoma-site.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south, origin = centroid of the OSM
// hull). Each value is [eye, target]. Built from design coordinates: u along Third Street (south-east),
// v inward (north-east, away from the street), y up; the entrance faces v < 0.
const at = (u, y, v) => F(u, y, v);

export const VIEWS = {
  overview: [at(-60, 95, -95), at(48, 25, 40)],
  facade: [at(31, 12, -70), at(31, 28, 20)],
  roof: [at(20, 150, -30), at(50, 30, 45)],
  turret: [at(31, 30, -45), at(31, 34, 30)],
  street: [at(31, 2.5, -36), at(31, 34, 30)],
  expansion: [at(120, 20, 5), at(50, 38, 60)],
  back: [at(40, 40, 160), at(55, 30, 60)],
  plan: [at(54, 300, 40), at(54, 0, 39)],
};
