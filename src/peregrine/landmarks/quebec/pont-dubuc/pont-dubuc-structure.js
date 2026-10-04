import {
  PROFILE as p, TOP, BRIDGE_START, BRIDGE_END, CREST_S, MID_S, DECK_HALF, KERB, MEDIAN, ROAD_EDGES, KNEE_S, KNEE_N, VC_TOP,
} from './pont-dubuc-profile.js';

// Structural layout shared by the geometry, the views and the tests. Heights are metres above local
// y = 0 (the river) on the authored (flat-map) profile; stations and laterals are the profile's frame
// (s south to north, d + east). Published values are named; everything else is estimated from photographs.
export const h = p.deckHeight;

// ---- Spans ------------------------------------------------------------------------------------------
/** Published: 458 m in seven continuous spans. The steel starts on a concrete end pier at the joint the
 * mapped outline shows 26 m from the south end (the first 26 m are a concrete span over the shore path)
 * and ends on the north abutment 1.5 m inside the mapped north end. */
export const STEEL_LENGTH = 458;
export const STEEL_START = BRIDGE_START + 26.0;
export const STEEL_END = STEEL_START + STEEL_LENGTH;
/** Two end spans of 0.75 x the five equal interior spans (photographs: the interior piers are evenly
 * spaced, the first span is shorter): 53.0 m and 70.4 m. Estimated. */
export const END_SPAN = 53.0;
export const SPAN = (STEEL_LENGTH - 2 * END_SPAN) / 5;
/** Supports south to north: P1 the concrete end pier, P2-P7 the twin-column river piers, then the north
 * abutment. Published: "seven reinforced-concrete piers". */
export const P1 = STEEL_START;
export const RIVER_PIERS = Array.from({ length: 6 }, (_, k) => STEEL_START + END_SPAN + k * SPAN);
export const PIERS = [P1, ...RIVER_PIERS];

// ---- Cross-section ---------------------------------------------------------------------------------
/** Pavement over the 0.22 m deck slab; an 0.85 m concrete barrier between each carriageway and its
 * sidewalk; a 2.4 m sidewalk 0.2 m above the road; an 0.5 m parapet with a galvanised railing at the edge. */
export const PAVE = 0.25;
export const SLAB_TOP = -0.22;
export const SLAB_BOT = -0.5;
export const BARRIER = [KERB, KERB + 0.5];
export const BARRIER_H = 0.85;
export const WALK = [KERB + 0.5, DECK_HALF - 0.5];
export const WALK_H = 0.2;
export const PARAPET = [DECK_HALF - 0.5, DECK_HALF];
export const PARAPET_H = 0.5;
export const RAIL_H = 1.2;
/** The steel: one trapezoidal box under the middle of the deck (sloped webs, top flanges at +-4.75 m,
 * bottom flange +-4.0 m, 2.5 m deep under the slab), fascia plate girders at the deck edges (1.2 m deep,
 * the "poutres a ame pleine"), and inclined brackets every BRACKET metres from the box's bottom corners
 * out to the fascia girders, with a floor beam under the slab: the diagonal rhythm that reads under the
 * deck in every photograph. */
export const BOX_TOP = 4.75;
export const BOX_BOT = 4.0;
export const BOX_DEPTH = 2.5;
export const FASCIA_D = DECK_HALF - 0.6;
export const FASCIA_DEPTH = 1.2;
export const BRACKET = SPAN / 12;
/** Steel underside (box bottom) relative to the road surface, and the lowest it may sit on the flat map
 * (near the ramp feet the box gets shallower rather than reach below grade). */
export const UNDERSIDE = SLAB_BOT - BOX_DEPTH;
export const MIN_BOTTOM = 0.3;
export const boxBottom = (s) => Math.max(h(s) + UNDERSIDE, MIN_BOTTOM);
/** The box ends where the flat-map deck is too low to hold it; the solid ramps run beyond. */
export const BOX_MIN_DECK = 1.2;

// ---- Piers -----------------------------------------------------------------------------------------
/** River piers: two square columns (2.6 m, a 3.1 m head over the top 13 %) under the box webs at
 * +-2.5 m, joined by a wall up to 60 % of the height whose outer ends batter out from 34 % to the river
 * bed. P1: a solid concrete wall pier. */
export const COL_D = 2.5;
export const COL = 2.6;
export const HEAD = 3.1;
export const HEAD_FRAC = 0.13;
export const WALL_TOP = 0.6;
export const BATTER_TOP = 0.34;
export const BATTER_OUT = 0.14;
export const WALL_T = 2.3;
export const WALL_END = COL_D + COL / 2 - 0.1;
export const P1_HALF = 5.6;
export const P1_T = 2.8;
/** P1's cap beam under the slab, the width of the deck (photograph 2: the steel ends on it). */
export const P1_CAP = 2.2;

// ---- Lamps -----------------------------------------------------------------------------------------
/** Published: 13 lamp posts with two lamps each. On the median wall, evenly spaced along the steel. */
export const LAMP_COUNT = 13;
export const LAMP_SPACING = STEEL_LENGTH / LAMP_COUNT;
export const LAMPS = Array.from({ length: LAMP_COUNT }, (_, k) => STEEL_START + LAMP_SPACING * (k + 0.5));
export const POLE_H = 12.0;
export const ARM = 2.8;

export { TOP, BRIDGE_START, BRIDGE_END, CREST_S, MID_S, DECK_HALF, KERB, MEDIAN, ROAD_EDGES, KNEE_S, KNEE_N, VC_TOP };
