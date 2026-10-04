import { PROFILE as p, DECK_H, MAIN_SPAN, SIDE_SPAN, TOWER_S, ANCHOR_S, BRIDGE_START, BRIDGE_END, VIADUCT_END, CABLE_D } from './pont-pierre-laporte-profile.js';

// Structural layout shared by the geometry, the views and the tests. Heights are metres above local
// y = 0 (mean high water); stations and laterals are the profile's frame (s north to south, d + west).
// Published values are named in pont-pierre-laporte-profile.js; everything here is estimated from
// photographs unless it says otherwise.
export const h = p.deckHeight;

// ---- Deck section ---------------------------------------------------------------------------------
/** Road surface to the underside of the stiffening truss: the published 45.7 m (150 ft) clearance at
 * mid-span below the 54.0 m road. Truss chords 1.0 m deep, ~7.3 m between chord centres. */
export const TRUSS_BOTTOM = DECK_H - 45.7;
export const TRUSS_TOP = 0.1;
/** The two stiffening trusses (Warren with verticals) stand just inside the tower legs. */
export const TRUSS_D = 12.6;
/** Steel floor (orthotropic grid under the road) out to the trusses. */
export const FLOOR_HALF = 13.0;
/** Truss panels: two per suspender interval (88 in the main span, 24 in each side span). */
export const MAIN_PANELS = 88;
export const SIDE_PANELS = 24;

// ---- Towers ("deux colonnes cruciformes liées à leur sommet ainsi qu'au niveau du tablier") ---------
/** Pier top: each leg on a concrete pedestal over a common footing at the water's edge. */
export const PIER_TOP = 9;
export const FOOTING_TOP = 4;
/** Leg tops (the portal's top) and the saddle housings to the published 122.5 m. */
export const LEG_TOP = 120.5;
export const TOWER_TOP = 122.5;
/** Leg sections [y, along, across]: cruciform (deep notched corners), tapering on the outer side and
 * along the bridge; the inner face is vertical, just outside the trusses. */
export const LEG_INNER = 13.0;
export const LEG = [[PIER_TOP, 6.2, 5.6], [LEG_TOP, 4.6, 3.4]];
/** Across-bridge leg width and centre (lateral) at height y. */
export function legAt(y) {
  const t = Math.max(0, Math.min(1, (y - LEG[0][0]) / (LEG[1][0] - LEG[0][0])));
  const along = LEG[0][1] + (LEG[1][1] - LEG[0][1]) * t, across = LEG[0][2] + (LEG[1][2] - LEG[0][2]) * t;
  return { along, across, centre: LEG_INNER + across / 2 };
}
/** The top portal: a beam between the leg tops whose underside is a round (elliptical) arch springing
 * from the legs' inner faces 14 m below the top, its crown 4.5 m below the top (photographs). */
export const PORTAL = { top: LEG_TOP, crown: LEG_TOP - 4.5, rise: 9.5, depth: 3.4 };
/** The deck-level strut under the trusses: a deep box whose underside is a shallow segmental arch,
 * 10.5 m deep at the legs and 6.0 m at the centre (photographs from the shore and under the deck). */
export const STRUT = { top: DECK_H - TRUSS_BOTTOM - 0.05, atLegs: 10.5, atCentre: 6.0, depth: 4.4 };

// ---- Main cables and suspenders --------------------------------------------------------------------
/** Published 62 cm cables (12,580 parallel wires), 27.4 m apart. */
export const CABLE_R = 0.31;
/** Cable centre over the saddles, inside the housings on the leg tops. */
export const SADDLE_Y = 121.0;
/** Cable centre at mid-span: it comes down to just above the railing (estimated). */
export const CABLE_LOW = DECK_H + 2.4;
/** Where each side-span cable enters its anchorage housing (estimated). */
export const CABLE_END_Y = DECK_H + 2.2;
const F_MAIN = SADDLE_Y - CABLE_LOW;
/** Side-span sag below its chord, for the same horizontal tension and load per metre as the main span. */
export const SIDE_SAG = F_MAIN * (SIDE_SPAN / MAIN_SPAN) ** 2;
/** Where each cable ends inside its anchorage housing (station). */
export const CABLE_END_S = [ANCHOR_S[0] + 2, ANCHOR_S[1] - 2];
/** Centre height of a main cable at station s, or null off the suspension spans. */
export function cableY(s) {
  const [a, b] = TOWER_S, [e0, e1] = CABLE_END_S;
  if (s >= a && s <= b) { const u = (s - a) / (b - a); return CABLE_LOW + F_MAIN * (2 * u - 1) ** 2; }
  if (s >= e0 && s < a) { const u = (s - e0) / (a - e0); return CABLE_END_Y + (SADDLE_Y - CABLE_END_Y) * u - 4 * SIDE_SAG * u * (1 - u); }
  if (s > b && s <= e1) { const u = (s - b) / (e1 - b); return SADDLE_Y + (CABLE_END_Y - SADDLE_Y) * u - 4 * SIDE_SAG * u * (1 - u); }
  return null;
}
/** Suspender stations: 43 in the main span (15.17 m) and 11 in each side span (15.54 m). */
export const SUSPENDERS = (() => {
  const [a, b] = TOWER_S, out = [];
  for (let k = 1; k < MAIN_PANELS / 2; k++) out.push(a + k * (b - a) / (MAIN_PANELS / 2));
  for (let k = 1; k < SIDE_PANELS / 2; k++) out.push(a - k * SIDE_SPAN / (SIDE_PANELS / 2), b + k * SIDE_SPAN / (SIDE_PANELS / 2));
  return out.sort((u, v) => u - v);
})();

// ---- Anchorages and approaches ---------------------------------------------------------------------
/** Anchorage blocks at the clifftops: from 4 m on the span side of the anchorage station to 36 m
 * outward; their tops stay under the road, the cable housings rise beside it. */
export const ANCHOR_BLOCK = [[ANCHOR_S[0] - 36, ANCHOR_S[0] + 4], [ANCHOR_S[1] - 4, ANCHOR_S[1] + 36]];
export const ANCHOR_HALF = 19;
/** Beyond the anchorages (the flat-map ramps and the Marie-Victorin viaduct): a concrete girder on
 * two-column piers, on fill only below the girder's depth (in Full 3D world the south ramp's last
 * stretch crosses the Pont Risi ravine 30-40 m up: piers, not a wall). */
export const FILL_BELOW = 3.2;

export { DECK_H, MAIN_SPAN, SIDE_SPAN, TOWER_S, ANCHOR_S, BRIDGE_START, BRIDGE_END, VIADUCT_END, CABLE_D };
