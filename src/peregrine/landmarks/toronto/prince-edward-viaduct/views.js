import { PROFILE as p, PIER_S, DECK_CENTER } from './prince-edward-viaduct-profile.js';
import { h } from './prince-edward-viaduct-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written in (station along the roadway, lateral, height) so they follow the bridge's 74.7 degree
// bearing: lateral is positive to the right of travel (south).
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
// A point at `up` metres above the road surface at station s (deck-relative views).
const dk = (s, d, up) => pt(s, d, h(s) + up);
const [P0, P1, P2, P3, P4, P5] = PIER_S;
const mid = (P2 + P3) / 2;

export const VIEWS = {
  // Three-quarter view from the valley floor, south-west of the middle: five arches, the piers and the Veil.
  overview: [pt(mid - 190, 330, 95), pt(mid + 10, 0, 20)],
  // Side elevation from the south (the Don Valley Parkway side): the classic photograph.
  facade: [pt(mid, 330, 36), pt(mid, 0, 22)],
  // From above and to the side: the deck, sidewalks, bike lanes and the Veil's leaning posts.
  roof: [pt(mid - 60, 95, 118), pt(mid + 10, 0, 40)],
  // What a driver sees crossing eastbound in the right-hand lane: the Veil closing in on both sides.
  crossing: [dk(P1 + 15, 6.2, 1.6), dk(P4 + 40, 6.2, 1.4)],
  // Under the deck at the valley floor, looking along the arches: crescent ribs, spandrel columns, piers.
  underside: [pt(P1 - 6, 30, 4), pt(P3 - 40, -2, 30)],
  // The three main arches from below and to the side: the crescent ribs and their hinges.
  arches: [pt(mid - 30, 150, 9), pt(mid + 5, 0, 26)],
  // Close on the Luminous Veil: leaning masts, top rail and the stainless rods.
  veil: [pt(P1 + 26, 10.5, 45.5), pt(P1 + 62, 14.4, 43.5)],
  // The west approach: the ramp on fill and piers up to the first arch (the flat-map ramp, see the docs).
  approach: [pt(P0 - 190, 170, 40), pt(P0 - 40, 0, 16)],
  // The east end: the last arch over the Don Valley Parkway and the ramp down to Danforth Avenue.
  east: [pt(P5 + 190, 170, 40), pt(P5 + 40, 0, 16)],
  // The subway room seen through the side of the deck, and the lamps beneath it.
  structure: [pt(P3 + 25, 52, 23), pt(P3 + 60, DECK_CENTER, 33)],
};

