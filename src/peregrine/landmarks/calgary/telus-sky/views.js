import { SPEC } from './config.js';

// Inspector cameras, [eye, target] in the model's metres (+X east, +Y up, +Z south). Written in the plan frame (u along the
// east-west grid direction, v along the north-south one, +v south) and rotated into the model frame, so "facade" really is square
// onto the south face, which looks onto 7 Avenue.
const b = SPEC.gridBearingDeg * Math.PI / 180, s = Math.sin(b), c = Math.cos(b);
const at = (u, y, v) => [+(u * c - v * s).toFixed(2), y, +(u * s + v * c).toFixed(2)];

export const VIEWS = {
  overview: [at(330, 170, 520), at(0, 118, 0)],
  facade: [at(0, 95, 350), at(0, 112, 0)],
  roof: [at(110, 300, 170), at(0, 205, -5)],
  crown: [at(70, 232, 80), at(5, 208, -2)],
  east: [at(420, 125, 0), at(0, 112, 0)],
  north: [at(0, 100, -360), at(0, 112, 0)],
  street: [at(55, 1.7, 80), at(0, 105, 0)],
  base: [at(48, 7, 62), at(2, 9, 3)],
  tower: [at(30, 160, 300), at(0, 130, 0)],
  podium: [at(-75, 22, 45), at(-22, 24, 0)],
  overhang: [at(-30, 12, -66), at(-3, 8, -22)],
  skyline: [at(520, 60, 720), at(0, 120, 0)],
};
