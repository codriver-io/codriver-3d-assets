// The Château Frontenac's plan as data: roofed blocks, round turrets and chimneys, in the hotel grid (u along the
// terrace facade toward the east-north-east, v across it toward the river, metres from SPEC.origin) or in plain x/z.
// The blocks tile the mapped outline of relation 32580 (outer way 27072105, minus its two courtyards): the north
// wing, the central slab with the tower, the long south-east terrace facade, the west wing and the east wing come from
// the building:part ways and the outline; the heights come from their storey counts; the roofs are estimated from photographs.
import { at } from './chateau-frontenac-site.js';

export const GF = 4.5, FL = 3.6; // ground storey and upper storey heights (estimated)
export const eaveOf = (levels) => GF + (levels - 1) * FL; // 5 storeys 18.9 m, 6 storeys 22.5 m, 14 storeys 54.9 m before the tower's own cornice

const R = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => at(u, v));
const X = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
const P = (pts) => pts.map(([u, v]) => at(u, v));

// levels: mapped storeys (building:part levels) where there is a part, estimated elsewhere. roof: 'hip' (flat top where the span is
// wide) or 'gable' (ridge along `axis`, vertical gable ends). arcade: the ground floor of south-east-facing walls is a stone arcade.
export const BLOCKS = [
  // --- north wing along rue Mont-Carmel (way 397610024, 5 storeys) and its filler towards the west wing ---
  { id: 'north', ring: R(-37.8, 6.8, -41.3, -21.7), levels: 5, slope: 1.55, maxRise: 13, dormer: 4.4 },
  { id: 'nw', ring: R(-41.4, -29, -21.7, -8.4), levels: 4, slope: 1.55, maxRise: 10, dormer: 4.4 },
  // --- west wing (outline only) ---
  { id: 'west', ring: R(-76.3, -41.4, -17, 20.7), levels: 5, slope: 1.55, maxRise: 13, dormer: 4.4 },
  // --- the long terrace facade, from the west end to the east turret: south-west corner, pavilion, middle, centre bay, east ---
  { id: 'se-west', ring: R(-76.3, -40.7, 20.7, 38.3), levels: 6, slope: 1.9, maxRise: 14.5, dormer: 4.2, arcade: true },
  { id: 'pavilion', ring: R(-40.7, -22.1, 20.7, 37.9), levels: 6, slope: 1.5, maxRise: 14, roof: 'gable', axis: 'v', dormer: 4.2, arcade: true }, // way 396948396, 6 storeys
  { id: 'se-mid', ring: R(-22.1, 5.9, 22.2, 37.3), levels: 6, slope: 1.9, maxRise: 14.5, dormer: 4.2, arcade: true },
  { id: 'centre', ring: R(5.9, 20.2, 21.4, 39.2), levels: 6, slope: 1.6, maxRise: 13, roof: 'gable', axis: 'v', dormer: 4.2, arcade: true },
  { id: 'se-east-a', ring: R(20.2, 29.5, 21.4, 38.5), levels: 6, slope: 1.9, maxRise: 14.5, dormer: 4.2, arcade: true },
  { id: 'se-east-b', ring: R(29.5, 41.1, 23.1, 38.5), levels: 6, slope: 1.9, maxRise: 14.5, dormer: 4.2, arcade: true },
  // cross-gabled bays on the facade: a gabled pavilion (ridge toward the river) that stands about 0.8 m proud of the wall and runs back into the roof
  { id: 'bay-w1', ring: R(-69, -61, 33, 39.1), levels: 6, slope: 1.5, maxRise: 8, roof: 'gable', axis: 'v', arcade: true },
  { id: 'bay-w2', ring: R(-54, -46, 33, 39.1), levels: 6, slope: 1.5, maxRise: 8, roof: 'gable', axis: 'v', arcade: true },
  { id: 'bay-m1', ring: R(-17, -9, 32, 38.1), levels: 6, slope: 1.5, maxRise: 8, roof: 'gable', axis: 'v', arcade: true },
  { id: 'bay-e1', ring: R(22, 29, 33, 38.9), levels: 6, slope: 1.5, maxRise: 8, roof: 'gable', axis: 'v', arcade: true },
  // --- the central slab: the north block (way 396948398, 6 storeys) and the tower (way 396293672, 14 storeys) ---
  { id: 'slab', ring: R(5.9, 26.7, -42.3, -20.2), levels: 6, slope: 1.55, maxRise: 13, dormer: 4.4 },
  { id: 'tower', ring: R(5.9, 26.7, -20.2, 21.4), levels: 14, eave: 53.4, slope: 2.3, maxRise: 24.2, dormer: 6.2, roofMat: 'slate', pitch: 3.3, tower: true },
  { id: 'strip', ring: R(26.7, 29.5, -25.7, 21.4), eave: 11.7, slope: 1.2, maxRise: 3 }, // a narrow copper hip between the tower and the east wing
  // --- the north-east link, the east wing, the gallery across the east courtyard ---
  { id: 'link', ring: R(26.7, 43.5, -40.8, -25.7), levels: 6, slope: 1.55, maxRise: 12, dormer: 4.4, gate: { u: 35.1 } },
  { id: 'ne', ring: P([[43.5, -25.2], [43.5, -40.4], [52, -40], [61.6, -32], [68.5, -14.5], [66.5, -8], [54.9, -5.3]]), levels: 6, slope: 1.55, maxRise: 12, dormer: 4.4 },
  { id: 'east', ring: X(47.4, 63.5, -26.4, 3.5), levels: 6, slope: 1.9, maxRise: 14, dormer: 4.2 }, // way 397610021, 6 storeys
  { id: 'east-front', ring: X(63.5, 69.1, -24.4, 4.5), levels: 2, eave: 8.1, slope: 1.0, maxRise: 3, stone: true, pitch: 4.4 },
  { id: 'gallery', ring: R(29.5, 50.9, -5.5, -2.1), eave: 8.6, slope: 0.95, maxRise: 2 },
  { id: 'square', ring: R(50.9, 57.8, -5.3, 1.2), levels: 6, slope: 1.9, maxRise: 12, dormer: 0 }, // way 396294279, pyramidal
  // --- the wing inside the south-west courtyard (way 396293674) and its link to the north wing (way 1365627869) ---
  { id: 'court', ring: R(-26.7, -14.2, -17.6, 17.3), levels: 4, slope: 1.5, maxRise: 8, dormer: 4.4 },
  { id: 'court-link', ring: R(-25.9, -19.9, -21.7, -17.6), eave: 11.7, slope: 1.2, maxRise: 3 },
];

// Round turrets: stone shaft from y0 to y1, conical cap to `tip`. uv = grid position (or xz = plain). Corbelled turrets (y0 > 0) start on a stone cone.
const T = (id, uv, r, y0, y1, tip, o = {}) => ({ id, c: at(uv[0], uv[1]), r, y0, y1, tip, ...o });
export const TURRETS = [
  // the tower's four corner turrets, corbelled, slate caps
  T('tw-nw', [6.9, -19.5], 2.2, 14, 58, 70, { cap: 'slate', corbel: true }), T('tw-ne', [25.7, -19.5], 2.2, 14, 58, 70, { cap: 'slate', corbel: true }),
  T('tw-sw', [6.9, 20.7], 2.2, 14, 58, 70, { cap: 'slate', corbel: true }), T('tw-se', [25.7, 20.7], 2.2, 14, 58, 70, { cap: 'slate', corbel: true }),
  // the centre bay's two flanking turrets (conical green caps), the pavilion's and the facade ends'
  T('c-w', [6.6, 37.4], 2.6, 0, 22.5, 31.5), T('c-e', [19.4, 37.4], 2.6, 0, 22.5, 31.5),
  T('p-w', [-39.0, 35.4], 2.4, 0, 22.5, 31), T('p-e', [-22.8, 35.6], 2.4, 0, 22.5, 31),
  T('se-w', [-74.3, 35.4], 2.8, 0, 22.5, 32), T('se-e', [36.5, 36.8], 2.5, 0, 22.5, 31),
  T('w-nw', [-74.3, -15.1], 2.6, 0, 18.9, 27.5), T('w-sw', [-74.3, 19.6], 2.2, 0, 18.9, 26.5),
  T('n-w', [-35.9, -39.3], 2.5, 0, 18.9, 27), T('n-e', [5.0, -39.4], 2.5, 0, 18.9, 27),
  T('sl-nw', [7.5, -41.0], 2.5, 0, 22.5, 30.5), T('sl-ne', [25.9, -41.0], 2.4, 0, 22.5, 30.5), // the mapped bumps on the north wall of the slab
  // the big round towers: the terrace turret (way 1365627870) and the north-east round tower (way 396293665)
  T('terrace', [40.2, 35.8], 4.2, 0, 24, 37.5, { sides: 14, windows: true }),
  T('round', [71.0, -3.2], 8.0, 0, 22.5, 41, { sides: 20, dormers: 6, mat: 'brick', windows: true }),
  T('e-ne', [66.0, -9.5], 2.4, 0, 22.5, 30.5),
];
// The hexagonal tower (way 396940763): a six-sided stone shaft with a six-sided steep copper roof.
export const HEX = { c: at(56.6, -35.8), r: 6.3, y1: 22.5, tip: 39.5 };

// Chimneys: [block id, u, v, height above the roof there, size]. Tall brick stacks with a stone cap.
export const CHIMNEYS = [
  ['pavilion', -36.8, 29.5, 9, 1.7], ['pavilion', -26.5, 29.5, 7.5, 1.5], ['se-west', -60, 29.5, 7.5, 1.5], ['se-west', -48, 29.8, 6.5, 1.4],
  ['se-mid', -12, 29.8, 6.5, 1.4], ['se-mid', 0.5, 30.0, 6.5, 1.4], ['se-east-a', 25, 30.5, 6.5, 1.4], ['north', -22, -31.5, 7, 1.5],
  ['north', -2, -31.5, 7, 1.4], ['west', -58, 2, 8, 1.6], ['slab', 16, -33, 7, 1.5], ['court', -20.5, 0, 6, 1.4],
  ['link', 35, -33, 6.5, 1.4], ['east', 55.0, 14.0, 6.5, 1.5], ['tower', 12, -3, 8, 1.8], ['tower', 21, 5, 8, 1.8],
];
