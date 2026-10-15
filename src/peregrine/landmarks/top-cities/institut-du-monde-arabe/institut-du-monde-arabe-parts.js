import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';
const A = 44 * Math.PI / 180, S = Math.sin(A), C = Math.cos(A);
// u follows the mapped SE long edge; v points to the southwest forecourt.
export const xyz = (u, y, v) => [u * S - v * C, y, u * C + v * S];
export const uv = ([lng, lat]) => {
  const x = (lng - SPEC.origin[0]) * 111320 * Math.cos(SPEC.origin[1] * Math.PI / 180), z = (SPEC.origin[1] - lat) * 111320;
  return [x * S + z * C, -x * C + z * S];
};
export const OUTLINE = FOOTPRINTS[0].slice(0, -1).map(uv);
export const SOUTH = [OUTLINE[0], OUTLINE[4], OUTLINE[5], [31.55, 0.4], ...OUTLINE.slice(21, 27)];
export const NORTH = [...OUTLINE.slice(6, 21), [31.48, -14.8]];
export const LINK = [[31.48, -14.8], OUTLINE[20], OUTLINE[21], [31.55, 0.4]];
export const PANEL_COLS = 24, PANEL_ROWS = 10;
export const southV = u => OUTLINE[0][1] + (u - OUTLINE[0][0]) / (OUTLINE[4][0] - OUTLINE[0][0]) * (OUTLINE[4][1] - OUTLINE[0][1]);
export const panelCenter = (col, row) => {
  const du = (OUTLINE[4][0] - OUTLINE[0][0]) / PANEL_COLS;
  const u = OUTLINE[0][0] + (col + 0.5) * du;
  return [u, 3.3 + (row + 0.5) * 2.76, southV(u)];
};
export const SPIRAL = { u: -40.1, v: 1.5, radius: 3.35, bottom: 3.3, top: 28.8, turns: 4 };
export const spiralPoint = (t, radius = SPIRAL.radius) => xyz(SPIRAL.u + radius * Math.cos(t * Math.PI * 2 * SPIRAL.turns), SPIRAL.bottom + t * (SPIRAL.top - SPIRAL.bottom), SPIRAL.v + radius * Math.sin(t * Math.PI * 2 * SPIRAL.turns));
