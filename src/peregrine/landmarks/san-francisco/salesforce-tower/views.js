import { SPEC } from './config.js';

// Inspector cameras, [eye, target] in the model's metres (+X east, +Y up, +Z south). Written in the plan frame
// (u along bearing planBearingDeg, v a quarter turn clockwise from it) and rotated into the model frame, so
// "facade" really is square onto the Mission Street (north-west) face.
const b = SPEC.planBearingDeg * Math.PI / 180, s = Math.sin(b), c = Math.cos(b);
const at = (u, y, v) => [+(u * s + v * c).toFixed(2), y, +(-u * c + v * s).toFixed(2)];

export const VIEWS = {
  overview: [at(340, 190, -440), at(0, 160, 0)],
  facade: [at(0, 110, -250), at(0, 175, 0)],
  roof: [at(25, 395, -60), at(0, 298, 0)],
  crown: [at(70, 335, -85), at(0, 311, 0)],
  base: [at(55, 6, -95), at(0, 14, -20)],
  street: [at(38, 1.7, -78), at(0, 140, 0)],
  corner: [at(190, 190, 190), at(0, 175, 0)],
  skyline: [at(-1050, 160, -420), at(0, 190, 0)],
};
