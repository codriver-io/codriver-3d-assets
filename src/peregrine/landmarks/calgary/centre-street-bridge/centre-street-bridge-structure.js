import { PROFILE as p, S, L, DECK_H, LOWER_H, HALF, lowerD } from './centre-street-bridge-profile.js';
import mapped from './centre-street-bridge-mapped.js';

// Structural layout shared by the geometry, its views and its tests (authoring only). Everything is a
// function of the station s along the mapped roadway, the lateral d (east +) and the deck profile; the
// pier lines come from the mapped pier bays. Nothing here is a survey.
export const h = (s) => p.deckHeight(s);

// ---- Piers: skewed to the deck along the river's flow ---------------------------------------------
// The outline bulges out at each pier on both faces, the east bay ~9.5 m south of the west one: the
// piers run 22 deg off square (tan 0.40), with the Bow's flow. Pier line: s = PIER_S[k] - SKEW * d.
const bays = (side) => mapped.outline.bays[side].map((ll) => { const q = p.bridgeLocal(...ll), r = p.projectBridge(q.x, q.z); return { s: r.s, d: r.lateral }; })
  .sort((a, b) => a.s - b.s);
const east = bays('east'), west = bays('west');
/** tan of the pier skew, fitted to the four mapped bay pairs. */
export const SKEW = east.reduce((n, e, i) => n + (west[i].s - e.s) / (e.d - west[i].d), 0) / east.length;
/** Pier lines at d = 0 (A south bank, B and C in the river, D north bank), from the mapped bay pairs. */
export const PIER_S = east.map((e, i) => { const w = west[i]; return (e.s + w.s) / 2 + SKEW * (e.d + w.d) / 2; });
/** The mapped bays (for the tests): station and lateral of each bulge midpoint, east and west. */
export const BAYS = { east, west };
export const pierAt = (k, d) => PIER_S[k] - SKEW * d;
/** Pier length along the deck axis at the faces (4.6 m across its own axis), and its springing cap. */
export const PIER_LEN = 5.0;
export const PIER_TOP = 1.2;

// ---- Faces, deck, balconies -----------------------------------------------------------------------
/** The two arch ribs carry the spandrel arcades on the outer faces: d in [RIB_IN, RIB_OUT] each side. */
export const RIB_IN = 8.6, RIB_OUT = 10.0;
/** Cornice band under the balconies: the arch crowns meet its underside. */
export const CORNICE = 1.0;
/** Upper deck: slab under the road, floor beams beneath it (road surface minus these). */
export const SLAB_TOP = -0.08, SLAB_BOTTOM = -0.6, FLOOR_BOTTOM = -1.3;
/** Sidewalk (balcony) surface above the road surface, and the balustrade line. */
export const WALK = 0.18;
export const BALUSTRADE = [HALF - 0.45, HALF - 0.05];
/** Pier bays (refuges) and the pavilions on the end piers project to this lateral. */
export const BAY_OUT = 11.8;

// ---- Arches -----------------------------------------------------------------------------------------
/** Springing height of the main arches on the piers, and ring depth at crown and springing. */
export const SPRING = 0.3, RING_CROWN = 1.2, RING_SPRING = 1.9;
/**
 * The three main arches on a face line d: springing at the pilaster faces, intrados a parabola rising
 * to just under the cornice at the crown (the crown meets the cornice, as in the photographs).
 */
export function archAt(k, d) {
  const a = pierAt(k, d) + PIER_LEN / 2, b = pierAt(k + 1, d) - PIER_LEN / 2, span = b - a, mid = (a + b) / 2;
  const crownTop = h(mid) - CORNICE, rise = crownTop - RING_CROWN - SPRING;
  const intrados = (u) => SPRING + rise * 4 * u * (1 - u);
  const depth = (u) => RING_CROWN + (RING_SPRING - RING_CROWN) * (1 - 4 * u * (1 - u));
  return { k, d, a, b, span, mid, rise, intrados, extrados: (u) => intrados(u) + depth(u), station: (u) => a + span * u, u: (s) => (s - a) / span };
}
/** Spandrel arcade: three round-headed openings per haunch, starting at the pilaster. */
export const OPENING = 2.8, COLUMN = 0.95, OPENINGS = 3;

// ---- End spans and approaches ---------------------------------------------------------------------
/** The mapped bridge ends (abutments); beyond them the approaches run on retained fill. */
export const ABUT_S = S.bridgeS, ABUT_N = S.bridgeN;
/** South end span bents: either side of Riverfront Avenue (it crosses under at s 81..102). */
export const BENTS = [75, 108];
/** Memorial Drive NW passes under the north fill (OSM 298687480, a short underpass): the gap. */
export const UNDERPASS = (() => {
  const way = mapped.crossings.find((c) => c.way === 298687480).geometry.map((ll) => { const q = p.bridgeLocal(...ll); return p.projectBridge(q.x, q.z); });
  // Where the mapped centreline crosses each balcony face, then 5 m of carriageway either side.
  const at = (d) => { const [a, b] = way, t = (d - a.lateral) / (b.lateral - a.lateral); return a.s + (b.s - a.s) * t; };
  const s = [at(HALF), at(-HALF)].sort((x, y) => x - y);
  return [s[0] - 5.5, s[1] + 5.5];
})();

// ---- Lower deck ---------------------------------------------------------------------------------------
/** Our lower deck slab sits under the provider's (5 m road, 0.9 m generic slab): top, and its half width. */
export const LOWER_TOP = LOWER_H - 1.0, LOWER_HALF = 2.4;
export const LOWER_RANGE = [S.lowerS, S.lowerN];
export { S, L, DECK_H, LOWER_H, HALF, lowerD };

/** Attachment weight: 0 at grade (supports meet their own ground), 1 at the deck. */
export const grip = (y) => Math.max(0, Math.min(1, y / (DECK_H - 1)));
