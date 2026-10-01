// Sutro Tower: every number the geometry, the tests and the docs share. Metres, +X east, +Y up, +Z south,
// origin on the tower axis (the mean of the three leg sections). A point at compass bearing b (degrees,
// clockwise from north), radius r and height y is (r sin b, y, -r cos b).
//
// Sourced (sutrotower.org, Wikipedia, FCC ASR 1001289): 297.8 m to the tip; Level 2 at 56.7 m, Level 3 at
// 116.4 m, Level 4 at 169.8 m, Level 5 at 200.3 m; the Level 6 crossarms are mapped at 228-232 m, published
// at 241.4 m and measure about 233-240 m on photographs, so the beams are modelled at 236.5-240.5 m (their
// top chords, staggered by up to 1 m, reach the published 241.4 m);
// painted in alternating aviation-orange and white bands.
// Mapped (OSM relation 3829019 and its building:part ways): the three legs at bearings 270 (west, with the lift),
// 30 and 150, their position and slope (26 m runs), the 26 m paint bands, the platform and crossarm plans,
// the 1.9 m width and 4 m depth of the beams.
// Estimated from photographs: the leg section taper, lattice and mast construction, cables and pods.
export const HEIGHT = 297.8;
export const RAD = Math.PI / 180;
export const at = (bearing, r, y) => [r * Math.sin(bearing * RAD), y, -r * Math.cos(bearing * RAD)];

export const LEG_BEARINGS = [270, 30, 150]; // west leg (the lift), north-east leg, south-east leg
export const WAIST = 169.75;                 // legs lean in below it and flare out above it (Level 4)
export const LEG_TOP = 239;                  // legs end inside the Level 6 crossarms; masts continue

// Distance from the tower axis to the centre of a leg's triangular section. The mapped 26 m runs give
// 26.3 m at 13 m, 10.5 m at 169 m (the waist) and 17.5 m at 220 m; the two crossarm bars and the masts sit at
// 17.85 m. So the legs lean in by 0.1015 m per metre below the waist, flare out by 0.141 m per metre above it
// until about 222 m, and stand vertical for the last 17 m under the crossarms (as in the photographs).
const RADIUS = [[0, 27.63], [WAIST, 10.4], [222.2, 17.85], [LEG_TOP + 1, 17.85]];
/** Heights where the leg changes direction: the waist and the start of the vertical tail. */
export const LEG_KINKS = RADIUS.slice(1, 3).map((r) => r[0]);
export function legRadius(h) {
  if (h >= RADIUS[RADIUS.length - 1][0]) return RADIUS[RADIUS.length - 1][1];
  let k = 0; while (h > RADIUS[k + 1][0]) k++;
  const [h0, r0] = RADIUS[k], [h1, r1] = RADIUS[k + 1];
  return r0 + (r1 - r0) * (h - h0) / (h1 - h0);
}
// Each leg is a triangular prism: flat face toward the axis, apex outward; side 3.8 m at grade to 2.9 m at the top.
export const legSide = (h) => 3.8 - 0.9 * Math.min(1, h / 232.25);
export const legDepth = (h) => legSide(h) * 0.8660254;

// Paint bands of the legs (the mapped 26 m parts): white 0-52, then orange / white alternately to 232.
export const BANDS = [
  [0, 52, 'white'], [52, 78, 'orange'], [78, 104, 'white'], [104, 130, 'orange'],
  [130, 156, 'white'], [156, 182, 'orange'], [182, 208, 'white'], [208, LEG_TOP, 'orange'],
];

// Platforms (mapped 4 m slabs): Levels 2, 3 and 4 are solid triangular plates, Level 5 a white lattice
// triangle, Level 6 the three orange crossarms. y0 / y1 bound the slab.
export const PLATES = [
  { name: 'level 2', y0: 53, y1: 57 },
  { name: 'level 3', y0: 112.5, y1: 116.5 },
  { name: 'level 4', y0: 165.75, y1: 169.75 },
];
export const LEVEL5 = { y0: 196.25, y1: 200.25, width: 1.95 };
// Level 6: three 60 m lattice crossarms, each through two leg tops and 14.3 m past each. Staggered by 0.5 m
// so that where two cross over a leg no two faces are coplanar.
export const LEVEL6 = { y0: 236.5, y1: 240.5, width: 1.9, extend: 14.3, stagger: 0.5, radius: 17.85 };
export const PLATE_INSET = 0.6; // plate corners sit 0.6 m inside the leg apex so no two faces are coplanar

// The three masts stand on the leg tops: lattice to 284.4 m (266 m for the south-east one), then a radome.
export const MAST = { radius: 17.85, base: LEG_TOP, wide: 2.4, narrow: 1.8, latticeTop: [284.4, 284.4, 266], radome: 0.8, tip: HEIGHT };
