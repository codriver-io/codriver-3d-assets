import { SPEC } from './config.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. They are written in the site frame (u along King Street,
// v along Bay Street toward King) and rotated into the model frame, so "facade" really
// is square onto the west band and the chevron.
const phi = SPEC.siteAngleDeg * Math.PI / 180, c = Math.cos(phi), s = Math.sin(phi);
const at = (u, y, v) => [+(u * c + v * s).toFixed(2), y, +(-u * s + v * c).toFixed(2)];

export const VIEWS = {
  overview: [at(-380, 250, 250), at(0, 125, 0)],
  facade: [at(-215, 185, 9.7), at(-18, 178, 9.7)],
  roof: [at(85, 430, 95), at(-2, 268, 0)],
  structure: [at(-70, 22, -75), at(-2, 70, -30)],
  chevron: [at(-95, 262, 52), at(-18, 250, 9.7)],
  east: [at(230, 185, -9.5), at(19, 178, -9.5)],
  street: [at(-30, 1.7, 100), at(-4, 105, 6)],
  north: [at(70, 110, -300), at(0, 110, -20)],
  south: [at(60, 90, 300), at(0, 100, 20)],
  heritage: [at(-150, 75, 140), at(-45, 50, 30)],
};
