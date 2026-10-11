import { PROFILE as p } from './centre-street-bridge-profile.js';
import { h, PIER_S, S, L } from './centre-street-bridge-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written in (station along the roadway, lateral, height): station runs south to north, lateral is
// positive to the east (right of northbound travel).
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const dk = (s, d, up) => pt(s, d, h(s) + up);
const [A, B, C, D] = PIER_S, mid = (B + C) / 2;

export const VIEWS = {
  // Three-quarter view from the east bank, downstream: the three arches, the arcades, both pavilion pairs.
  overview: [pt(mid - 95, 95, 32), pt(mid + 5, 0, 5)],
  // Side elevation from downstream (east), at river level: the classic photograph of the arches.
  facade: [pt(mid - 10, 95, 4), pt(mid - 10, 0, 5)],
  // From above and to the west: the deck, balconies, balustrades, lamps and the four pavilions.
  roof: [pt(mid - 70, -80, 75), pt(mid, 0, 5)],
  // What a driver sees crossing northbound in the right lane: balustrades, lamps and the north lions.
  deck: [dk(B - 20, 3.3, 1.6), dk(D + 5, 2.0, 2.5)],
  // Under the bridge from the north bank, looking along the east rib: the lower deck between the ribs.
  underside: [pt(C + 6, -26, 1.8), pt(B + 8, 3, 6.5)],
  // The north pavilion pair and its lions, from the east sidewalk.
  tower: [dk(D - 22, 9.5, 2.0), dk(D, 9.5, 5.5)],
  // The south approach over Riverfront Avenue: end span, bents, the lower roadway's portal.
  south: [pt(S.junctionS - 30, 60, 14), pt(S.lowerS, 0, 5)],
  // The north end: the span over Memorial Drive and the embankment ramp up Centre Street N.
  north: [pt(D + 70, 70, 22), pt(D + 40, 0, 4)],
  // A west pavilion close up (the lion on its attic).
  lion: [dk(A + 9, -15, 7.5), dk(A, -10.7, 5.5)],
  // The lower deck from the river, under the middle arch.
  lower: [pt(mid - 5, 40, 2.0), pt(mid + 10, 4, 4.5)],
  // The whole alignment from above (ramps, fills, the underpass on the north embankment).
  plan: [pt(L / 2 - 1, 0, 420), pt(L / 2, 0, 0)],
};
