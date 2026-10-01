import { site } from './california-academy-of-sciences-site.js';

// Inspector camera presets, [eye, target] in the model's metres (+x east, +y up, +z south).
// Written in the building's own axes (u along the front facade toward the north-east end, v
// from the front into the building) and rotated by site().
const at = (u, y, v) => site(u, y, v);
export const VIEWS = {
  overview: [at(-150, 72, -175), at(0, 12, 0)],
  facade: [at(0, 8, -190), at(0, 11, 0)],            // the Music Concourse front, head-on
  roof: [at(-20, 150, -105), at(0, 14, 5)],          // the living roof from above
  entrance: [at(-10, 1.7, -80), at(4, 6, -39)],      // street level, under the canopy
  back: [at(70, 16, 160), at(0, 11, 20)],
  rainforest: [at(-34, 42, -62), at(-34, 22, 3)],    // the rainforest hill and its glass dome
  planetarium: [at(30, 46, -58), at(30, 20, 3)],     // the planetarium hill and its portholes
  canopy: [at(-100, 4, -70), at(-50, 9, -50)],       // the photovoltaic canopy and its columns
  end: [at(230, 30, 5), at(0, 12, 0)],
};
