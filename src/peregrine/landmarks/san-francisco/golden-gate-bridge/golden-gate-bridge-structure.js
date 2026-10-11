import alignment from './golden-gate-bridge-alignment.js';
import { PROFILE as p, DECK_H, TOWER_S, S1, S2, N1, N2, BRIDGE_START, BRIDGE_END, CABLE_D, SIDE_SPAN } from './golden-gate-bridge-profile.js';

// Structural layout shared by the geometry, the views and the tests. Heights are metres above
// local y = 0 (mean high water); stations and laterals are the profile's frame.
export const h = p.deckHeight;

// ---- Deck section, below the road surface ---------------------------------------------------------
/** Road surface to the underside of the stiffening truss: 25 ft truss + floor. The truss bottom at
 * DECK_H - 8.4 = 67.0 m is the published 220 ft mid-span clearance. */
export const TRUSS_BOTTOM = 8.4;
export const TRUSS_TOP = 0.1;
/** Truss panel (Warren with verticals) and suspender spacing: 25 ft and 50 ft. */
export const PANEL = 7.62;
export const SUSPENDER_STEP = 15.24;

// ---- Towers (OSM building parts on the mapped legs; heights above the water) -----------------------
export const PIER_TOP = 13;
/** Pier block in plan, from the mapped pier outline: 23.4 m along the bridge, 42.5 m across. */
export const PIER = [23.4, 42.5];
/** Leg sections [y0, y1, along, across]. Along-the-bridge setbacks and heights from the mapped
 * parts; the across width is 7.8 m (mapped) up to the third strut and narrows ~10 % above, as in
 * photographs (the mapped 3.9 m top is not what the towers show). */
export const LEG = [[13, 21, 16.0, 10.1], [21, 74, 14.0, 7.8], [74, 123, 11.9, 7.8], [123, 162, 10.0, 7.8], [162, 195, 10.0, 7.2], [195, 225, 7.7, 6.8]];
export const LEG_TOP = 225;
export const TOWER_TOP = 227.4;
/** Portal struts above the deck (mapped: 111-121, 151-161, 185-193, 215-223 m) and below it
 * (mapped 24-26 and 50-52 m; the floor-beam strut under the truss is estimated). */
export const STRUTS_ABOVE = [[111, 121], [151, 161], [185, 193], [215, 223]];
export const STRUTS_BELOW = [[23.5, 26.5], [50, 53], [DECK_H - TRUSS_BOTTOM - 3.4, DECK_H - TRUSS_BOTTOM]];
export const STRUT_DEPTH = 5.6;

// ---- Main cables ----------------------------------------------------------------------------------
export const CABLE_R = 0.46;
/** Cable centre over the tower saddles, inside the saddle housings on the leg tops. */
export const SADDLE_Y = 225.9;
/** Cable centre at mid-span: it comes down just above the railing (estimated). */
export const CABLE_LOW = DECK_H + 1.9;
/** Where each side-span cable meets pylon S1 / N1 (estimated). */
export const CABLE_END_Y = DECK_H + 4.6;
/** Side-span sag below its chord, for the same horizontal tension and load per metre as the main
 * span: f_side = f_main * (side / main)^2. */
const F_MAIN = SADDLE_Y - CABLE_LOW;
export const SIDE_SAG = F_MAIN * (SIDE_SPAN / (TOWER_S[1] - TOWER_S[0])) ** 2;
/** Centre height of a main cable at station s, or null off the suspension spans. */
export function cableY(s) {
  const [a, b] = TOWER_S;
  if (s >= a && s <= b) { const u = (s - a) / (b - a); return CABLE_LOW + F_MAIN * (2 * u - 1) ** 2; }
  if (s >= S1 && s < a) { const u = (s - S1) / (a - S1); return CABLE_END_Y + (SADDLE_Y - CABLE_END_Y) * u - 4 * SIDE_SAG * u * (1 - u); }
  if (s > b && s <= N1) { const u = (s - b) / (N1 - b); return SADDLE_Y + (CABLE_END_Y - SADDLE_Y) * u - 4 * SIDE_SAG * u * (1 - u); }
  return null;
}
/** Suspender stations: every 50 ft from each tower, 83 in the main span and 22 in each side span. */
export const SUSPENDERS = (() => {
  const [a, b] = TOWER_S, out = [];
  for (let k = 1; k < 84; k++) out.push(a + k * (b - a) / 84);
  for (let k = 1; k <= 22; k++) out.push(a - k * SUSPENDER_STEP, b + k * SUSPENDER_STEP);
  return out.sort((u, v) => u - v);
})();

// ---- Pylons, the Fort Point arch, the anchorages --------------------------------------------------
/** Pylon pairs flank the deck (mapped pair spacing 30.3 m); each block 10 m along, 5.5 m across. */
export const PYLON_D = 15.15;
export const PYLON = { S2, S1, N1, N2 };
/** The Fort Point arch: 97 m (318 ft) between the springings, centred between pylons S2 and S1.
 * Springing height and rise are estimated from photographs (the arch clears the fort's parapet). */
export const ARCH = (() => {
  const c = (S2 + S1) / 2, half = 48.5, y0 = 12, crown = h(c) - TRUSS_BOTTOM - 2.5 - 5.0;
  const rise = crown - y0;
  const bottom = (u) => y0 + 4 * rise * u * (1 - u);
  const depth = (u) => 5.0 + 2.0 * (2 * u - 1) ** 2;
  return { a: c - half, b: c + half, span: 2 * half, y0, rise, rib: 11.0, bottom, top: (u) => bottom(u) + depth(u), station: (u) => c - half + 2 * half * u };
})();
/** Anchorage blocks: station and lateral extents of the mapped outlines (OSM "South Anchorage",
 * "North Anchor"). */
function extents(ring) {
  const q = ring.map(([lng, lat]) => { const l = p.bridgeLocal(lng, lat); return p.projectBridge(l.x, l.z); });
  return { s: [Math.min(...q.map((v) => v.s)), Math.max(...q.map((v) => v.s))], d: [Math.min(...q.map((v) => v.lateral)), Math.max(...q.map((v) => v.lateral))] };
}
export const ANCHORAGE = { south: extents(alignment.structure.anchorages.south.ring), north: extents(alignment.structure.anchorages.north.ring) };
/** The south tower fender, as mapped, in model metres (x east, z south). */
export const FENDER = alignment.structure.fender.ring.map(([lng, lat]) => p.bridgeLocal(lng, lat));

/** Approach viaducts on steel bents: the mapped bridge ends to pylon S2, pylon N2 to the north end. */
export const SOUTH_VIADUCT = [BRIDGE_START, S2];
export const NORTH_VIADUCT = [N2, BRIDGE_END];
/** Beyond the mapped bridge (the flat-map ramps): a concrete girder on piers, on fill below this. */
export const FILL_BELOW = 8;

export { DECK_H, TOWER_S, S1, S2, N1, N2, BRIDGE_START, BRIDGE_END, CABLE_D };
