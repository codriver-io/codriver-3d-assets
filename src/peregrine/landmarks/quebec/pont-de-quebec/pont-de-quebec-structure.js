import {
  PROFILE as p, ROAD_H, MAIN_SPAN, ANCHOR_ARM, SUSPENDED, CANTILEVER_ARM, BRIDGE_START, BRIDGE_END, MID_S,
  TRUSS_E, TRUSS_W, AXIS_D, RAIL_D, WALK, ROAD_HALF,
} from './pont-de-quebec-profile.js';

// Structural layout shared by the geometry, the views and the tests. Heights are metres above local
// y = 0 (high water); stations and laterals are the profile's frame (s north to south, d + west).
// Published values are named in pont-de-quebec-profile.js; everything here is estimated from
// photographs unless it says otherwise.
export const h = p.deckHeight;

// ---- Spans: centred on the mapped bridge (published lengths) -------------------------------------
/** The two main piers, 548.6 m apart (published). */
export const MAIN_S = [MID_S - MAIN_SPAN / 2, MID_S + MAIN_SPAN / 2];
/** The anchor piers at the outer ends of the 157.0 m anchor arms (published). */
export const ANCHOR_S = [MAIN_S[0] - ANCHOR_ARM, MAIN_S[1] + ANCHOR_ARM];
/** The cantilever tips, 176.8 m out from the main piers, where the 195.07 m suspended span hangs. */
export const TIP_S = [MAIN_S[0] + CANTILEVER_ARM, MAIN_S[1] - CANTILEVER_ARM];
/** The approach spans between each bridge end and its anchor pier (the remainder of the published
 * 987 m: ~62 m each side), two deck-truss spans on one intermediate masonry pier (estimated). */
export const APPROACH_PIER_S = [(BRIDGE_START + ANCHOR_S[0]) / 2, (ANCHOR_S[1] + BRIDGE_END) / 2];

// ---- Heights ---------------------------------------------------------------------------------------
/** Published 45.72 m clearance at high tide under the suspended span: the underside of the bottom chord,
 * which also runs at deck level at the cantilever tips and the anchor-arm ends. */
export const CLEARANCE = 45.72;
export const BOT_DEPTH = 1.6;
export const BOT_Y = CLEARANCE + BOT_DEPTH / 2;
/** The bottom chords of the anchor and cantilever arms slope down to a pin shoe on each main pier. */
export const SHOE_Y = 10.5;
export const MAIN_PIER_TOP = 9.0;
/** Main posts to the published 104 m overall height (310 ft posts on the shoes); top chord centre just
 * below their caps. */
export const POST_TOP = 104.0;
export const TOP_MAIN = 103.0;
/** Top chord at the cantilever tips and the anchor-arm ends; the suspended span's curved top chord rises
 * to its crown (photographs: about 21 m deep at its ends, 33 m at mid-span). */
export const TOP_END = 66.7;
export const CROWN = 78.5;
/** The tall end posts (pylons) over each anchor pier, carrying the anchor-arm end portal. */
export const END_POST_TOP = 72.5;
/** Panels per arm / span (photographs). */
export const PANELS = { anchor: 10, cantilever: 11, suspended: 12 };
/** Lowest transverse bracing above the road: the car drives inside the truss (portal undersides
 * at least 6.5 m above the road). */
export const PORTAL_CLEAR = 6.5;
/** The anchor piers (masonry, full width) stop just under the bottom-chord bearings. */
export const ANCHOR_PIER_TOP = CLEARANCE - 0.6;
/** Approach deck trusses: 7 m deep under the floor. */
export const APPROACH_DEPTH = 7.0;
/** Floor system: steel floor beams and stringers under the deck. */
export const FLOOR_TOP = ROAD_H - 0.35;
export const FLOOR_DEPTH = 1.3;

/** Top-chord centre height at station s (null off the cantilever structure). */
export function topY(s) {
  const [a0, a1] = ANCHOR_S, [m0, m1] = MAIN_S, [t0, t1] = TIP_S;
  if (s < a0 - 1e-6 || s > a1 + 1e-6) return null;
  const lin = (x0, y0, x1, y1) => y0 + (y1 - y0) * (s - x0) / (x1 - x0);
  if (s <= m0) return lin(a0, TOP_END, m0, TOP_MAIN);
  if (s <= t0) return lin(m0, TOP_MAIN, t0, TOP_END);
  if (s < t1) { const u = (s - t0) / (t1 - t0); return TOP_END + (CROWN - TOP_END) * 4 * u * (1 - u); }
  if (s <= m1) return lin(t1, TOP_END, m1, TOP_MAIN);
  return lin(m1, TOP_MAIN, a1, TOP_END);
}
/** Bottom-chord centre height at station s (null off the cantilever structure). */
export function botY(s) {
  const [a0, a1] = ANCHOR_S, [m0, m1] = MAIN_S, [t0, t1] = TIP_S;
  if (s < a0 - 1e-6 || s > a1 + 1e-6) return null;
  const lin = (x0, y0, x1, y1) => y0 + (y1 - y0) * (s - x0) / (x1 - x0);
  if (s <= m0) return lin(a0, BOT_Y, m0, SHOE_Y);
  if (s <= t0) return lin(m0, SHOE_Y, t0, BOT_Y);
  if (s < t1) return BOT_Y;
  if (s <= m1) return lin(t1, BOT_Y, m1, SHOE_Y);
  return lin(m1, SHOE_Y, a1, BOT_Y);
}
/** Panel points north to south, each { s, part, main } where `main` is the nearer main pier's station. */
export const PANEL_POINTS = (() => {
  const out = [], [a0, a1] = ANCHOR_S, [m0, m1] = MAIN_S, [t0, t1] = TIP_S;
  const run = (x0, x1, n, part) => { for (let k = 0; k < n; k++) out.push({ s: x0 + (x1 - x0) * k / n, part }); };
  run(a0, m0, PANELS.anchor, 'anchor'); run(m0, t0, PANELS.cantilever, 'cantilever'); run(t0, t1, PANELS.suspended, 'suspended');
  run(t1, m1, PANELS.cantilever, 'cantilever'); run(m1, a1, PANELS.anchor, 'anchor'); out.push({ s: a1, part: 'anchor' });
  for (const q of out) q.main = Math.abs(q.s - m0) < Math.abs(q.s - m1) ? m0 : m1;
  return out;
})();

export { ROAD_H, MAIN_SPAN, ANCHOR_ARM, SUSPENDED, CANTILEVER_ARM, BRIDGE_START, BRIDGE_END, MID_S, TRUSS_E, TRUSS_W, AXIS_D, RAIL_D, WALK, ROAD_HALF };
