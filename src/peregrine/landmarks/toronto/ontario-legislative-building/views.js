import { PLAN } from './ontario-legislative-building-site.js';

// Inspector cameras in the model's east/up/south metres. They are written in the building's own
// frame (u along the south front, v toward it) and turned by the same angle as the model.
const c = Math.cos(PLAN.angle), s = Math.sin(PLAN.angle);
const at = (u, y, v) => [u * c + v * s, y, -u * s + v * c].map((n) => +n.toFixed(1));

export const VIEWS = {
  overview: [at(70, 95, 175), at(0, 22, 5)],
  facade: [at(-4, 16, 150), at(-0.5, 24, 50)],
  roof: [at(-70, 135, 120), at(0, 28, 5)],
  structure: [at(150, 60, -150), at(0, 15, -10)],
  north: [at(8, 14, -140), at(-2, 12, -60)],
  tower: [at(-42, 30, 100), at(-14, 32, 50)],
  portico: [at(0, 6, 95), at(-0.5, 9, 54)],
  arm: [at(-130, 30, 20), at(-62, 16, 0)],
};
