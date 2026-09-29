import { site } from './first-canadian-place-site.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Keys used by the catalog record's inspection views.
// Positions are given in the tower's own axes (u along King Street, v toward the
// lake) and rotated into the exported frame, so "south face" always means King Street.
const at = (u, y, v) => site(u, y, v).map((n) => Math.round(n * 10) / 10);
export const VIEWS = {
  overview: [at(-330, 190, 560), at(0, 175, 0)],
  facade: [at(-60, 60, 230), at(0, 150, 0)],
  roof: [at(-80, 360, 100), at(0, 310, 0)],
  structure: [at(-130, 20, -190), at(0, 130, 0)],
  street: [at(50, 3, 120), at(0, 45, 0)],
  crown: [at(85, 300, 100), at(0, 290, 5)],
  back: [at(210, 150, -330), at(0, 150, 0)],
  notch: [at(50, 120, 85), at(24, 118, 22)],
};
