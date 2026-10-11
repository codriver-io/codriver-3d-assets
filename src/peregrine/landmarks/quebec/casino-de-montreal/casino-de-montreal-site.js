import { smooth, deg } from './casino-de-montreal-mesh.js';

// Site frame for the Casino de Montréal, measured from OpenStreetMap ways 26698931 and 439917766 (read 2026-10-03) and
// put in the model frame: +X east, +Y up, +Z south, origin = the centre of the French pavilion's drum, fitted to the two
// mapped rim arcs (radius 32.0 m on the north-west, 39.7 m on the east; centres within 0.5 m of each other). Local metres
// use the Peregrine projection (Mercator / stretch). Plan points are [x, z]. Nothing is rotated: every polygon below is
// mapped, so the real orientation (the Québec pavilion is skewed 1.7 degrees from the grid) is already in the numbers.

export const R = 31.4, RW = 39.7; // drum rim radius (the fitted circle is 32.0 m; the mapped rim wanders between 30.5 and 32.9 m), and the flared east sector
export const Y = {
  podium: 9.0,     // roof of the low link and base of the drum's fan (estimate: two storeys of 4.5 m)
  fan0: 9.6, fan1: 20.0, beam: 21.2, roof: 30.4, crown: 31.6,
  lantern: 33.2, lanternTop: 35.0,
  mast: 44,
  quebec: 28.4, quebecTop: 31.9,
  canopy: 9.8, shafts: 36,
};
export const FLARE = 6.5; // how far the ribs flare out between the fan's base and its top ring (estimate)

/** Rim radius of the fan's top ring at angle th (radians from +x toward +z): 32 m round the drum, 39.7 m on the east/south-east wing. */
export function rTop(th) {
  const d = ((th * 180 / Math.PI) % 360 + 540) % 360 - 180; // (-180, 180]
  return R + (RW - R) * smooth(d / 8) * (1 - smooth((d - 80) / 35));
}
export const rBase = (th) => rTop(th) - FLARE;

// ---- west terrace tower: outer edge of the lowest deck (OSM way 439917766, vertices 17-26)
export const TERRACE_OUT = [
  [-53.6, 16.6], [-52.1, 2.1], [-52.8, -2.8], [-54.3, -7.4], [-58.2, -11.3], [-61.0, -14.2],
  [-47.7, -18.9], [-41.3, -24.3], [-41.4, -29.8], [-34.7, -36.1], [-24.8, -35.8],
];
export const TERRACE_ARC = [deg(143.3), deg(235.3)]; // the deck meets the drum between these angles
export const DECK_K = 6, DECK_PITCH = 3.4, DECK_Y0 = 8.0, DECK_T = 1.1;

// ---- entrance canopy, north-east (OSM way 439917766, the long triangle pointing north-east)
export const CANOPY = [
  [24.4, -65.75], [22.95, -54.0], [22.6, -51.3], [20.9, -32.2], [19.5, -21.0], [9.0, -24.4], [-1.0, -25.5], [-8.0, -25.0],
  [-8.7, -43.4], [-4.6, -46.1],
];
export const MUSHROOM = { x: 13.0, z: -40.0, r: 6.2 }; // under the canopy slab

// ---- shaft stack, on the north apron between the terrace tower and the canopy (the stepped bump of way 439917766)
export const SHAFTS = [ // [centre x, centre z, half width x, half depth z, height]
  [-15.0, -40.0, 4.5, 4.0, 36.0], [-20.5, -41.0, 2.5, 3.5, 31.0], [-11.5, -37.8, 2.4, 2.2, 27.5], [-18.5, -37.0, 2.2, 1.8, 22.0],
];

// ---- the low link block south of the drum (OSM way 26698931), without the corridor and the south-east wedge
export const LINK = [
  [-21.2, 22.4], [-21.1, 25.5], [-42.5, 24.8], [-42.9, 31.5], [-43.2, 39.0], [-36.4, 38.8], [-37.6, 50.8], [-49.9, 51.1],
  [-49.5, 56.2], [-26.7, 56.5], [-20.4, 56.9], [-10.65, 57.2], [-2.1, 57.6], [-1.8, 52.4], [13.1, 52.5], [13.1, 56.6],
  [28.6, 57.3], [32.5, 57.4], [33.0, 53.8], [35.9, 30.7], [38.3, 31.0], [37.5, 15.1], [28.0, 17.0], [16.0, 22.5], [0, 25.5], [-12, 25.0],
];
// the corridor to the Québec pavilion (starts on the link's south edge z = 57, ends inside the pavilion's wall)
export const CORRIDOR = [[-20.4, 57.0], [-20.9, 86.4], [-11.0, 86.4], [-10.65, 57.0]];

// ---- the long wedge on the south-east side: a ramp-and-stairs terrace that comes down to grade at its tip
export const WEDGE = [
  [45.1, -0.1], [85.2, 42.0], [84.95, 42.0], [67.6, 39.8], [65.5, 39.5], [38.8, 36.1], [39.4, 31.1], [38.3, 31.0], [37.5, 15.1], [42.8, 15.1],
];
export const W0 = [40, 12], WU = [0.857, 0.518], WL = 55;
export const wedgeY = (x, z) => 0.3 + (Y.podium - 0.3) * (1 - Math.max(0, Math.min(1, ((x - W0[0]) * WU[0] + (z - W0[1]) * WU[1]) / WL)));

// ---- the Pavillon du Québec: the mapped square at ground level (OSM way 26698931, vertices 36-39)
export const QUEBEC = [[-38.39, 82.65], [9.52, 84.26], [9.12, 131.87], [-40.5, 130.26]];
export const QUEBEC_LEAN = 0.1; // the walls lean in: the roof outline is the base shrunk by this fraction about the centre
export const QUEBEC_GROUND = 6.0; // the gold body starts here, overhanging a recessed glazed ground floor
export const quebecCentre = () => [QUEBEC.reduce((s, p) => s + p[0], 0) / 4, QUEBEC.reduce((s, p) => s + p[1], 0) / 4];
