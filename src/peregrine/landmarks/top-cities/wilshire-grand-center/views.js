import { SPEC } from './config.js';

// Inspector cameras, [eye, target] in the model's metres (+X east, +Y up, +Z south). Written in the tower's plan frame
// (a along the tower axis at bearing planBearingDeg, c across it toward the south-west curved face), centred on the
// tower, and rotated into the model frame.
const t = SPEC.planBearingDeg * Math.PI / 180 - Math.PI / 2, s = Math.sin(t), c = Math.cos(t);
const U = [c, s], V = [-s, c]; // unit vectors (x, z) of the plan axes a and c
const CX = 26.7, CZ = -11.3; // tower centre in the model frame
const at = (a, y, cc) => [+(CX + a * U[0] + cc * V[0]).toFixed(1), y, +(CZ + a * U[1] + cc * V[1]).toFixed(1)];

export const VIEWS = {
  overview: [at(320, 230, 560), at(-10, 150, 0)],
  facade: [at(-20, 150, 420), at(-10, 150, 0)],
  roof: [at(110, 345, 150), at(-20, 270, 0)],
  crown: [at(70, 305, 190), at(-30, 270, 0)],
  podium: [at(-130, 60, 190), at(-30, 20, 0)],
  street: [at(90, 2, 120), at(-30, 60, 0)],
  rear: [at(-60, 160, -520), at(-30, 150, 0)],
  nwend: [at(-190, 160, 110), at(-70, 150, 15)],
  skyline: [at(-750, 220, 900), at(-30, 170, 0)],
};
