import { OUTER, HOLE, GRASS, BOTTLE } from './oracle-park-plan.js';

// Site frame of Oracle Park. Everything is in the model's local metres (+x east, +y up,
// +z south) about SPEC.origin. The mapped outline (OSM, see oracle-park-plan.js) is already
// in that frame, so no rotation is applied here: the ballpark's own axes are

//   street grid : King Street (the north-west facade) runs 44.6 degrees east of north
//                 (it is the line o5->o6 of the mapped ring), 3rd Street perpendicular to it
//   the field   : home plate to centre field points 86 degrees clockwise from north
//                 (the mapped baseball grass reaches the centre-field wall 121 m from the
//                 mapped home area, the published 399 ft), so the left-field line is
//                 almost parallel to King Street.
export const SHIFT = [17.6, -5.6]; // metres from the first scratch frame (about the OSM centre guess) to SPEC.origin
export const T = (x, z) => [x + SHIFT[0], z + SHIFT[1]];
export const Tpts = (list) => list.map(([x, z]) => T(x, z));

export { OUTER, HOLE, GRASS, BOTTLE };
export const FIELD_CENTRE_LOCAL = T(5, 10);
// The batter's eye: the dark-green wall in the mapped notch of the centre-field fence (below the scoreboard).
export const EYE = [[71, 4.1], [89, 2.8], [90.3, 26.4], [72.5, 27.9]].map(([x, z]) => T(x, z));
export const FIELD_OPENING = HOLE.filter(([x, z]) => !EYE.slice(0, 3).some(([ex, ez]) => Math.hypot(ex - x, ez - z) < 0.3));
export const FIELD_BEARING = 86 * Math.PI / 180;
export const AXIS = [Math.sin(FIELD_BEARING), -Math.cos(FIELD_BEARING)]; // home plate -> centre field, in (x, z)
export const RIGHT = [-AXIS[1], AXIS[0]];                                // toward right field (south)
export const HOME = T(-62, 26);
// field coordinates: u toward centre field, v toward right field (metres from home plate)
export const fld = (u, v) => [HOME[0] + AXIS[0] * u + RIGHT[0] * v, HOME[1] + AXIS[1] * u + RIGHT[1] * v];

// Height of the outer wall along each edge i of OUTER (edge i runs OUTER[i] -> OUTER[i + 1]), metres.
// Estimated from photographs and the mapped 21/25/30 m building:part heights; see the doc.
export const EDGE_H = OUTER.map((_, i) => {
  if (i === 0 || i === 1) return 22;                 // north corner, 2nd & King
  if (i <= 5) return 21;                             // King Street facade
  if (i <= 14) return 25;                            // west corner, Willie Mays Plaza, 3rd Street entrance pavilion
  if (i <= 25) return 22;                            // south-west wing
  if (i === 26) return 20;                           // south wall of the first-base stands
  if (i === 27) return 14;                           // the right-field arcade on McCovey Cove
  if (i >= 40) return i === 40 ? 16 : 20;            // 2nd Street, toward the north corner
  return 12.5;                                       // east end and left-field bleachers
});
// Facade material per edge.
export const EDGE_M = OUTER.map((_, i) => (i <= 14 || i >= 36 ? 'brick' : i <= 28 ? 'stone' : 'concrete'));
