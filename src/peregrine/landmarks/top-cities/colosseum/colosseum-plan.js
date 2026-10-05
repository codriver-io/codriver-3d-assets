// Colosseum plan frame. Pure numbers: no Three.js, so the runtime footprint can import it.
// Platner & Ashby, A Topographical Dictionary of Ancient Rome (1929), Amphitheatrum Flavium:
// outer ellipse 188 × 156 m, major axis north-west–south-east; a fit to the intact northern OSM arc gives
// bearing 105.54°, rounded to 106° (west end 286°). Arena 86 × 54 m.
// Outer wall 48.50 m. Ground arches 7.05 × 4.20 m, piers 2.40 × 2.70 m; upper arches 6.45 and
// 6.40 m. Standing outer wall: arches XXIII–LIV plus the east axial entrance (the north side).

export const OUTER_A = 94; // half of 188 m, major axis
export const OUTER_B = 78; // half of 156 m, minor axis
export const ARENA_A = 43; // half of 86 m
export const ARENA_B = 27; // half of 54 m
export const HEIGHT = 48.5;
export const BAYS = 80;

// East end of the major axis, compass bearing 106° (ESE). +t runs from there toward north.
export const AXIS = 106 * Math.PI / 180;
export const MINOR = 16 * Math.PI / 180; // north end of the minor axis, the intact facade
const M = [Math.sin(AXIS), -Math.cos(AXIS)];
const Nm = [Math.sin(MINOR), -Math.cos(MINOR)];

export const DT = (Math.PI * 2) / BAYS;

// Level datums. Arch crown sits on the entablature; the pedestal above it carries the next order.
// Ground arches start on the stylobate (0.42 m), so the opening is 6.63 m rather than 7.05.
// Openings stay on Platner's 7.05 / 6.45 / 6.40 m. The attic is the remainder of
// the 48.50 m wall, dressed with pilasters so it is not a blank band.
export const LEVELS = [
  { y0: 0.42, crown: 7.47, ent1: 9.05, ped1: 12.2, span: 4.2, proj: 0.46 },
  { y0: 12.2, crown: 18.65, ent1: 20.15, ped1: 23.2, span: 4.2, proj: 0.4 },
  { y0: 23.2, crown: 29.6, ent1: 31.15, ped1: 34.4, span: 4.2, proj: 0.36 },
];
export const ATTIC_Y = 34.4;
export const CROWN_Y0 = 47.4;
export const CROWN_PROJ = 1.15;
export const STEP_OUT = 2.55;
export const STEP_MID = 1.25;
export const WALL_T = 2.7;
// Second wall 5.8 m clear of the outer wall's inner face; third wall 4.5 m clear of that.
export const WALL2 = WALL_T + 5.8;
export const WALL2_T = 2.05;
export const WALL3 = WALL2 + WALL2_T + 4.5;
export const WALL3_T = 1.7;

export function ellipse(a, b, t) {
  const u = a * Math.cos(t), v = b * Math.sin(t);
  return [u * M[0] + v * Nm[0], u * M[1] + v * Nm[1]];
}

// Outward plan normal at parameter t (unit, xz).
export function ellipseNormal(a, b, t) {
  const gu = Math.cos(t) / a, gv = Math.sin(t) / b;
  const x = gu * M[0] + gv * Nm[0], z = gu * M[1] + gv * Nm[1];
  const len = Math.hypot(x, z) || 1;
  return [x / len, z / len];
}

export function ellipseTangent(a, b, t) {
  const du = -a * Math.sin(t), dv = b * Math.cos(t);
  const x = du * M[0] + dv * Nm[0], z = du * M[1] + dv * Nm[1];
  const len = Math.hypot(x, z) || 1;
  return [x / len, z / len];
}

// Metres of arc per radian at t on the outer ellipse.
export function arcSpeed(t) {
  return Math.hypot(-OUTER_A * Math.sin(t), OUTER_B * Math.cos(t));
}

export function bay(i) {
  const tC = i * DT;
  const speed = arcSpeed(tC);
  const axial = i % 20 === 0;
  // Platner's pier is 2.40 m. Bay length changes around the ellipse, so the arch takes
  // whatever is left and the pier stays put. The four axial entrances are wider.
  const pier = axial ? 1.65 : 2.4;
  const span = Math.max(3.4, speed * DT - pier);
  const half = (span / 2) / speed;
  return { i, tC, t0: tC - DT / 2, t1: tC + DT / 2, tL: tC - half, tR: tC + half, axial };
}

// Outer wall stands on bays 0 (east axial entrance) through 36 (toward the west end).
export const STANDING_FROM = 0;
export const STANDING_TO = 36;
export function standing(i) { return i >= STANDING_FROM && i <= STANDING_TO; }

export function southWallTop(i) {
  const w = Math.sin(i * 1.67) * 0.6 + Math.sin(i * 0.51 + 1.1) * 0.4;
  return 27.2 + 4.2 * w;
}

// Inner drum behind the standing outer wall: ragged, and well below the attic,
// so the travertine shell is what crowns the ruin.
export function innerCrown(i) {
  if (!standing(i)) return southWallTop(i);
  const w = Math.sin(i * 1.35 + 0.5) * 0.6 + Math.sin(i * 0.42) * 0.4;
  return 33.4 + 2.6 * w;
}

export function uv(u, v, y) {
  return [u * M[0] + v * Nm[0], y, u * M[1] + v * Nm[1]];
}

