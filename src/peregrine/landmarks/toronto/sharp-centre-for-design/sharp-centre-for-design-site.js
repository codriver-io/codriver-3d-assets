// Site plan of the Sharp Centre for Design in the model's own (u, y, v) frame, and the
// map from that frame to Peregrine's east/up/south metres.
//
//   u  along the tabletop's long axis, +u = 163.1 deg (SSE, toward the south lot)
//   v  across it, +v = 253.1 deg (WSW, toward Grange Park); McCaul Street is at -v
//   y  up from local grade
//
// Everything here is a number the geometry, the tests and the docs share.
import { SPEC } from './config.js';

const bearing = SPEC.axisBearing * Math.PI / 180;
// Unit vectors of +u and +v in (east, south).
export const U = [Math.sin(bearing), -Math.cos(bearing)];
export const V = [-U[1], U[0]];
// THREE's rotateY angle that takes a local +X axis onto +u.
export const YAW = -Math.atan2(U[1], U[0]);
/** (u, y, v) -> [east, up, south]. */
export const pt = (u, y, v) => [u * U[0] + v * V[0], y, u * U[1] + v * V[1]];
/** [east, south] -> [u, v]. */
export const toUV = (x, z) => [x * U[0] + z * U[1], x * V[0] + z * V[1]];

// The tabletop: published 84 x 31 x 9 m box, underside 26 m above grade (the OSM outline
// reads 86.7 x 31.6 m, so the model sits inside its footprint).
export const TABLE = { u0: -42, u1: 42, v0: -15.5, v1: 15.5, y0: 26, y1: 35 };
// Roof plant enclosure seen above the parapet in west-side photographs (estimated).
export const PLANT = { u0: -22, u1: -3, v0: -2, v1: 8, y0: 35, y1: 38.6 };

// The Main Building beneath, from OSM way 225377144 and its parts (u, v of the mapped
// outline, shrunk 0.15 m so the model stays inside the ring the provider extrusion is
// removed by). OSM tags every part "4 levels"; photographs show only the block under the
// tabletop that tall, a 3-storey step north of it and the two-storey pale-brick George
// Reid wing (1921) at the McCaul Street north end, so the heights below are estimates.
export const BLOCK = { u0: -92.2, u1: 8.4, v0: -13.1, v1: 28.9 };
export const WINGS = [
  { u0: -92.2, u1: -52, h: 8.5, storeys: 2, brick: 'brick_pale' }, // George Reid wing
  { u0: -52, u1: -32, h: 13, storeys: 3, brick: 'brick' },
  { u0: -32, u1: 8.4, h: 17.5, storeys: 4, brick: 'brick' }, // the block the tabletop floats over
];
export const BLOCK_TOP = 17.5;
export const STEM = { u0: -51.3, u1: -39.5, v0: 28.9, v1: 68.2, wallH: 7, ridgeH: 10 };
// The two 26 m black-clad cores mapped as building:part (961216771, 961216772).
export const CORES = [
  { u0: 0.4, u1: 8.1, v0: -12.4, v1: -6.8 },
  { u0: -25.1, u1: -19.1, v0: -9.3, v1: 3.6 },
];
export const CORE_TOP = TABLE.y0 - 0.02;

// The red stair slab that links the block's roof to the tabletop's underside: it rises
// ~22 deg from the roof and runs into the soffit (its far end is inside the tabletop).
export const SLAB = { from: { u: 5.5, y: 18.6, v: -3.6 }, to: { u: 30, y: 28.6, v: -3.6 }, width: 3.6, depth: 3.6 };

// Twelve legs as six pairs (Canadian Consulting Engineer 2005: six pairs, each with its
// own axis of symmetry, no two aligned alike; 914 mm diameter tapering to 450 mm at both
// ends, 28 m long). A pair is described by where its two tops meet the soffit (centre
// `top`), the direction `axis` (degrees, from +u toward +v) the feet are thrown, the
// half-angle `spread` between the two legs about that axis, the two colours and whether
// the legs `cross` (each leaning toward the other's side).
//
// Where the legs can stand follows from the site: all support is outside the Main
// Building (which fills v -13.1..28.9 north of u 8.4), so beside McCaul Street the tops
// sit in the 2.4 m strip of soffit that overhangs the block's east wall and the four
// A-frames lean along the street onto the sidewalk; the other two pairs stand on the
// open lot south of the block, clear of the house at 74 McCaul (u > 46.6, v -11.6..4.4).
export const LEG = { length: 28, rMid: 0.457, rEnd: 0.225, taper: 0.22, topGap: 1.5 };
export const LEG_RISE = TABLE.y0; // tops on the soffit, feet on grade
export const LEG_REACH = Math.sqrt(LEG.length * LEG.length - LEG_RISE * LEG_RISE); // ~10.4 m
export const PAIRS = [
  { top: [-38, -14.9], axis: -93, spread: 80, colors: ['leg_maroon', 'leg_yellow'] },
  { top: [-10, -14.4], axis: -86, spread: 77, colors: ['leg_yellow', 'leg_blue'] },
  { top: [15, -14.8], axis: -94, spread: 82, colors: ['leg_white', 'leg_black'] },
  { top: [39.5, -14.5], axis: -88, spread: 76, colors: ['leg_purple', 'leg_black'] },
  { top: [16, 9], axis: 40, spread: 35, colors: ['leg_black', 'leg_blue'], cross: true },
  { top: [36, 9], axis: 70, spread: 52, colors: ['leg_yellow', 'leg_yellow'] },
];

/** Both legs of a pair: [{ top: [u, y, v], foot: [u, y, v], color }]. */
export function pairLegs(pair) {
  const [cu, cv] = pair.top, a = pair.axis * Math.PI / 180, s = pair.spread * Math.PI / 180;
  return [-1, 1].map((side, i) => {
    const heading = a + (pair.cross ? -side : side) * s;
    // The two tops sit either side of the pair's centre, across its axis.
    const off = side * LEG.topGap / 2;
    const top = [cu + -Math.sin(a) * off, LEG_RISE, cv + Math.cos(a) * off];
    const foot = [top[0] + Math.cos(heading) * LEG_REACH, 0, top[2] + Math.sin(heading) * LEG_REACH];
    return { top, foot, color: pair.colors[i] };
  });
}
export const LEGS = PAIRS.flatMap(pairLegs);
