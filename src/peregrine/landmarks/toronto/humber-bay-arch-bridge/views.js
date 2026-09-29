import { SPEC } from './config.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. The bridge runs north-north-east (bearing 31.6 deg), so the
// presets are written in bridge coordinates (u along the deck towards the north-east end,
// v across it towards the south-east side) and turned into scene coordinates here.
const b = SPEC.frontageBearing * Math.PI / 180;
const at = (u, y, v) => [+(u * Math.sin(b) + v * Math.cos(b)).toFixed(2), y, +(-u * Math.cos(b) + v * Math.sin(b)).toFixed(2)];

export const VIEWS = {
  overview: [at(-95, 42, 140), at(0, 10, 0)],
  facade: [at(0, 12, 175), at(0, 12, 0)],
  roof: [at(0, 175, 30), at(0, 5, 0)],
  structure: [at(-150, 3, 60), at(-30, 12, 0)],
  end: [at(-128, 9, 0), at(0, 12, 0)],
  deck: [at(-58, 7.4, -1), at(20, 12, 0)],
  detail: [at(-60, 3.5, 24), at(-46, 4.5, 4)],
  under: [at(-25, 1.5, 38), at(-25, 6, 0)],
};
