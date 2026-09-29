import { PROFILE as p, PIER_S, PIER_BASE, DECK_H, STRUCTURE_START, STRUCTURE_END } from './prince-edward-viaduct-profile.js';

// Structural layout shared by the geometry and its tests. Everything is a function of the
// station along the mapped roadway and of the deck height profile; nothing here is a survey.
export const h = p.deckHeight;

/** Road surface down to the underside of the subway deck (the arch crowns touch it). */
export const UNDER = 8.2;
/** Top of the subway room floor below the road surface. */
export const ROOM_FLOOR = 7.4;
/** Underside of the road slab and its edge beams below the road surface. */
export const SLAB_BOTTOM = 1.7;
export const deckBottom = (s) => h(s) - UNDER;

/**
 * Intrados foot height (m above the valley floor) of each arch at its two pin ends.
 * The three main arches spring near the floor; the two end arches sit on the valley slope, so
 * their outer feet are higher.
 */
const FEET = [[8, 2.5], [2.5, 2.5], [2.5, 2.5], [2.5, 2.5], [2.5, 8]];

/**
 * The five steel arch spans between the six piers. `top(u)`/`bottom(u)` are the extrados and
 * intrados heights at u in [0,1] along the pin span; the extrados meets the underside of the
 * subway deck at the crown and never rises past it. The crescent: thick at the crown, pinched
 * to a hinge at each foot.
 */
export const ARCHES = PIER_S.slice(0, -1).map((s0, i) => {
  const a = s0 + PIER_BASE / 2, b = PIER_S[i + 1] - PIER_BASE / 2, span = b - a, mid = a + span / 2;
  const crown = 0.075 * span, hinge = 0.9, [ya, yb] = FEET[i];
  const depth = (u) => hinge + (crown - hinge) * Math.pow(4 * u * (1 - u), 0.8);
  const rise = deckBottom(mid) - 0.35 - crown - (ya + yb) / 2;
  const bottom = (u) => ya + (yb - ya) * u + 4 * rise * u * (1 - u);
  const top = (u) => Math.min(bottom(u) + depth(u), deckBottom(a + span * u) - 0.3);
  return { index: i, a, b, span, mid, crown, rise, ya, yb, depth, bottom, top, station: (u) => a + span * u, pins: [a, b] };
});

/** Where the subway room (and its lower deck) exists: the mapped structure, where h - UNDER >= 0.4. */
export function roomRange() {
  let lo = STRUCTURE_START + 0.02, hi = STRUCTURE_END - 0.02;
  while (lo < hi && deckBottom(lo) < 0.4) lo += 0.5;
  while (hi > lo && deckBottom(hi) < 0.4) hi -= 0.5;
  return [lo, hi];
}

/**
 * The deck beyond the last arches: a solid concrete girder on piers while it is high, then a solid
 * ramp on fill once it is lower than FILL_BELOW m. Stations: [start of the girder run, end of the run].
 */
export const FILL_BELOW = 12;
export const WEST_RUN = (() => { let a = 0; while (h(a) < FILL_BELOW) a += 0.5; return [a, PIER_S[0] - PIER_BASE / 2]; })();
export const EAST_RUN = (() => { let c = p.BRIDGE_LENGTH; while (h(c) < FILL_BELOW) c -= 0.5; return [PIER_S[5] + PIER_BASE / 2, c]; })();

/** Attachment weight of a steel/stone member: 0 at the valley floor to 1 at the deck. */
export const grip = (y) => Math.max(0, Math.min(1, y / (DECK_H - 0.5)));
