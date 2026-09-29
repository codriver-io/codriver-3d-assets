import { site } from './rogers-centre-site.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Eyes are written in the stadium's own axes (u across,
// v along, toward the lake) and rotated by site(), so "south" means the lake end.
const at = (u, y, v) => site(u, y, v);
export const VIEWS = {
  overview: [at(260, 200, 330), at(0, 38, 0)],
  facade: [at(20, 14, 470), at(0, 44, 0)],          // the lake end and its gates, from the harbour
  roof: [at(60, 330, 90), at(0, 55, -6)],           // the closed roof from above
  structure: [at(-360, 50, -40), at(0, 44, 0)],     // the west wall (Blue Jays Way) and the profile
  north: [at(-90, 120, -390), at(0, 42, -50)],      // hotel end, from the CN Tower side
  street: [at(-160, 6, 190), at(-80, 26, 60)],      // gate level, south-west prow
  prow: [at(-150, 20, 110), at(-92, 20, 66)],       // the sculpted prow, close
  east: [at(330, 30, 40), at(0, 44, 0)],
};
