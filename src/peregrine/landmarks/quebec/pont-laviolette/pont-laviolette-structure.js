import {
  PROFILE as p, TOP, MAIN_SPAN, CANTILEVER, ANCHOR_SPAN, TRUSS_SPAN, TRUSS_START, TRUSS_END, MAIN_S, CREST_S,
  BRIDGE_START, BRIDGE_END, DECK_HALF, KERB, MEDIAN, ROAD_EDGES,
} from './pont-laviolette-profile.js';

// Structural layout shared by the geometry, the views and the tests. Heights are metres above local
// y = 0 (high water) on the authored (flat-map) profile; stations and laterals are the profile's frame
// (s north-west to south-east, d + south-west). Published values are named in pont-laviolette-profile.js;
// everything here is estimated from photographs unless it says otherwise.
export const h = p.deckHeight;
const HALF = MAIN_SPAN / 2;

// ---- Supports -------------------------------------------------------------------------------------
/** The cantilever tips, 33 m out from the main piers (published), where the 269 m arch is hung. */
export const TIP_S = [MAIN_S[0] + CANTILEVER, MAIN_S[1] - CANTILEVER];
/** Truss-span piers north to south: N5..N2 (N5 also carries the last approach girder), then S2..S5. */
export const TRUSS_PIER_S = [0, 1, 2, 3].map((k) => TRUSS_START + k * TRUSS_SPAN)
  .concat([0, 1, 2, 3].map((k) => MAIN_S[1] + ANCHOR_SPAN + k * TRUSS_SPAN));
/** Approach piers (estimated positions; the MTQ numbering N6-N14 and S6-S20). North: ten plate-girder
 * spans over the published 641 m (64.1 m on average), the piers placed in the gaps between the mapped
 * roads that pass under the approach (the U-turn loop at 67 m, Rue Notre-Dame Ouest at 126-154 m, a
 * cycleway at 363 m, Rue du Pont at 535 m, a service road at 575-590 m from the north end). South: five
 * plate-girder spans of 64.1 m (S5-S10), then eleven precast-concrete spans (S10-S21, 32.4 m, the last
 * one 39 m over Boulevard Bécancour, 25 m from the south end). */
export const GIRDER_SPAN = (TRUSS_START - BRIDGE_START) / 10;
export const CONCRETE_START = TRUSS_END + 5 * GIRDER_SPAN;
export const CONCRETE_SPAN = 32.4;
export const APPROACH_PIER_S = [
  ...[45, 108, 172, 236, 300, 380, 450, 515, 555].map((u) => BRIDGE_START + u),
  ...Array.from({ length: 5 }, (_, k) => TRUSS_END + (k + 1) * GIRDER_SPAN),
  ...Array.from({ length: 9 }, (_, k) => CONCRETE_START + (k + 1) * CONCRETE_SPAN),
  BRIDGE_END - 39,
];

// ---- Cross-section ---------------------------------------------------------------------------------
/** The two truss (and arch) planes just outside the 16.7 m deck. */
export const TRUSS_D = 9.3;
export const TRUSSES = [-TRUSS_D, TRUSS_D];
/** Chords: the through-truss top chord centre 11 m above the road (photographs: about 12 m to its top),
 * the bottom chord centre 1.3 m below it, beside the floor. */
export const TOP_ABOVE = 11.0;
export const BOT_BELOW = 1.3;
export const CHORD = 1.1;
/** Floor system between the trusses (stringers and floor beams under the slab). */
export const FLOOR_TOP = -0.25;
export const FLOOR_BOT = -1.7;
/** Approach girders: three steel plate girders 2.9 m deep (span/22) under a 0.3 m slab; the precast
 * spans: AASHTO type IV girders (1.37 m, published type) under the same slab. */
export const SLAB = 0.3;
export const PLATE_DEPTH = 2.9;
export const PRECAST_DEPTH = 1.45;
export const PLATE_D = [-5.6, 0, 5.6];
/** The lowest transverse member over the road (portal struts, knee braces, arch struts). */
export const PORTAL_CLEAR = 6.5;

// ---- The arch and the deep trusses at the main piers (photographs, scaled to the published heights) --
/** Arch crown: top of the top chord at the published 106.6 m overall height; the arch truss is about
 * 9.5 m deep at the crown (centre to centre). */
export const CROWN_TOP = 106.6;
export const ARCH_CHORD = 1.6;
export const ARCH_TOP_CROWN = CROWN_TOP - ARCH_CHORD / 2;
export const ARCH_BOT_CROWN = ARCH_TOP_CROWN - 9.5;
/** Over the main piers the top chord passes about 28 m above the road; the bottom chords dip in a V to
 * pin bearings on the main piers about 23 m below the road. */
export const TOP_AT_PIER = 78.5;
export const SHOE_Y = 27.5;
export const MAIN_PIER_TOP = SHOE_Y - 2.2;
/** Outboard of the main piers the top chord eases down to the standard truss over TOP_RUN metres and the
 * bottom chord climbs back to the floor over BOT_RUN metres (within the 167 m anchor spans). */
export const TOP_RUN = 128;
export const BOT_RUN = 105;
const SHOE_SLOPE = 0.55;

const slope = (s) => (h(s + 0.5) - h(s - 0.5));
/** Cubic Hermite between (0, y0, m0) and (w, y1, m1) at u in [0, w]. */
function hermite(u, w, y0, m0, y1, m1) {
  const t = u / w, t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * w * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * w * m1;
}
/** Top-chord centre at station s (null off the steel structure). */
export function topY(s) {
  if (s < TRUSS_START - 1e-6 || s > TRUSS_END + 1e-6) return null;
  const x = s - CREST_S, ax = Math.abs(x), dir = Math.sign(x) || 1;
  if (ax <= HALF) return ARCH_TOP_CROWN - (ARCH_TOP_CROWN - TOP_AT_PIER) * (ax / HALF) ** 2;
  if (ax < HALF + TOP_RUN) {
    const se = CREST_S + dir * (HALF + TOP_RUN);
    return hermite(ax - HALF, TOP_RUN, TOP_AT_PIER, -2 * (ARCH_TOP_CROWN - TOP_AT_PIER) / HALF, h(se) + TOP_ABOVE, dir * slope(se));
  }
  return h(s) + TOP_ABOVE;
}
/** Bottom-chord centre at station s (null off the steel structure): the arch's lower chord between the
 * main piers (above the road between the cantilever tips), the anchor spans' dipping chord, then the
 * through trusses' bottom chord beside the floor. */
export function botY(s) {
  if (s < TRUSS_START - 1e-6 || s > TRUSS_END + 1e-6) return null;
  const x = s - CREST_S, ax = Math.abs(x), dir = Math.sign(x) || 1;
  if (ax <= HALF) return ARCH_BOT_CROWN - (ARCH_BOT_CROWN - SHOE_Y) * (ax / HALF) ** 2;
  if (ax < HALF + BOT_RUN) {
    const se = CREST_S + dir * (HALF + BOT_RUN);
    return hermite(ax - HALF, BOT_RUN, SHOE_Y, SHOE_SLOPE, h(se) - BOT_BELOW, dir * slope(se));
  }
  return h(s) - BOT_BELOW;
}
/** The deck-level chord (floor line) in each truss plane. */
export const floorY = (s) => h(s) - BOT_BELOW;

/** Panel points of the steel structure, north to south: ten panels per 119 m truss span, fourteen per
 * 167 m anchor span, thirty across the 335 m main span (three per cantilever, 24 in the arch: one hanger
 * at each, as published "at every panel point of the lower chord"). */
export const PANEL_POINTS = (() => {
  const out = [];
  const run = (x0, x1, n, part) => { for (let k = 0; k < n; k++) out.push({ s: x0 + (x1 - x0) * k / n, part }); };
  for (let k = 0; k < 3; k++) run(TRUSS_START + k * TRUSS_SPAN, TRUSS_START + (k + 1) * TRUSS_SPAN, 10, 'truss');
  run(MAIN_S[0] - ANCHOR_SPAN, MAIN_S[0], 14, 'anchor');
  run(MAIN_S[0], MAIN_S[1], 30, 'main');
  run(MAIN_S[1], MAIN_S[1] + ANCHOR_SPAN, 14, 'anchor');
  for (let k = 0; k < 3; k++) run(MAIN_S[1] + ANCHOR_SPAN + k * TRUSS_SPAN, MAIN_S[1] + ANCHOR_SPAN + (k + 1) * TRUSS_SPAN, 10, 'truss');
  out.push({ s: TRUSS_END, part: 'truss' });
  return out;
})();

export { TOP, MAIN_SPAN, CANTILEVER, ANCHOR_SPAN, TRUSS_SPAN, TRUSS_START, TRUSS_END, MAIN_S, CREST_S, BRIDGE_START, BRIDGE_END, DECK_HALF, KERB, MEDIAN, ROAD_EDGES };
