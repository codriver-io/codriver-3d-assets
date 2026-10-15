import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE } from './albert-bridge-london-alignment.js';
import { FOOTPRINTS } from './footprint.js';

// Station s runs north to south along the mapped A3031; lateral d is right of travel (west).
// Deck: 12.8 m over the girders (41 ft published), 8.2 m roadway (27 ft published).
export const ROAD_HALF = 4.1, FOOT_OUT = 6.0, GIRDER_OUT = 6.4;
// Column / pier centres off the road centre, from the mapped tower piers (±8.1-8.8 m).
export const COLUMN_D = 8.5;

const ringCentre = r => { const p = r.slice(0, -1); return [p.reduce((a, v) => a + v[0], 0) / p.length, p.reduce((a, v) => a + v[1], 0) / p.length]; };

const base = createBridgeProfile({
  ...SPEC, width: 2 * GIRDER_OUT, roadEdges: [[-ROAD_HALF, ROAD_HALF]], palette: PALETTES.light,
  centerline: CENTERLINE, buildingFootprints: FOOTPRINTS.slice(1),
  profile: ({ length }) => [[0, 'start'], [length, 'end']],
});
export const L = base.BRIDGE_LENGTH;
const stationOf = i => base.stationAt(ringCentre(FOOTPRINTS[i]));
// Mapped tower piers (rings 3-6) and toll booths (rings 1-2, 7-8), each pair averaged.
export const TOWER_S = [(stationOf(3) + stationOf(4)) / 2, (stationOf(5) + stationOf(6)) / 2];
export const BOOTH_S = [(stationOf(1) + stationOf(2)) / 2, (stationOf(7) + stationOf(8)) / 2];
export const CENTRE_S = (TOWER_S[0] + TOWER_S[1]) / 2;
export const MAIN_SPAN = TOWER_S[1] - TOWER_S[0];
// Published 710 ft (216.4 m) overall: the side spans take what the mapped main span leaves.
export const OVERALL = 216.4, SIDE_SPAN = (OVERALL - MAIN_SPAN) / 2;
export const ABUTMENT_S = [TOWER_S[0] - SIDE_SPAN, TOWER_S[1] + SIDE_SPAN];

// Flat-map profile: constant grades joined by short vertical curves (C1 at the street, C2 at the
// towers), and a parabolic camber over the main span that leaves the towers at GC.
export const FLAT_TOWER_H = 4.6, WORLD_RISE = 1.8, GC = 0.027, C1 = 14, C2 = 10;
const designs = new Map();
function design(a0, a1) {
  const key = a0 + ',' + a1;
  let d = designs.get(key);
  if (!d) {
    // Cityscape ([0,0]) keeps the flat-map 4.6 m; Full 3D world lifts the span above the
    // higher embankment (the real deck stands over both banks).
    const H = Math.max(FLAT_TOWER_H, Math.max(a0, a1) + WORLD_RISE);
    const gN = (H - a0 - GC * C2 / 2) / (TOWER_S[0] - C1 / 2 - C2 / 2);
    const gS = (H - a1 - GC * C2 / 2) / (L - TOWER_S[1] - C1 / 2 - C2 / 2);
    d = { H, gN, gS };
    if (designs.size > 64) designs.clear();
    designs.set(key, d);
  }
  return d;
}
// Height above the ramp's own foot, u metres from the street end, ramp length len, grade g.
function ramp(u, len, g) {
  if (u <= C1) return g * u * u / (2 * C1);
  if (u <= len - C2) return g * C1 / 2 + g * (u - C1);
  const v = u - (len - C2);
  return g * C1 / 2 + g * (len - C2 - C1) + g * v + (GC - g) * v * v / (2 * C2);
}
export function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(L, s));
  const [a0, a1] = approaches, { H, gN, gS } = design(a0, a1);
  if (s <= TOWER_S[0]) return a0 + ramp(s, TOWER_S[0], gN);
  if (s >= TOWER_S[1]) return a1 + ramp(L - s, L - TOWER_S[1], gS);
  const u = s - TOWER_S[0];
  return H + GC * u - GC * u * u / MAIN_SPAN;
}
export const GRADES = [design(0, 0).gN, design(0, 0).gS];

// Authored carriageway edges: rigid 8.2 m on the structure; on land the road eases out to the
// mapped streets (the Chelsea Embankment junction mouth to the north, two lanes to the south).
const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
export const LANDING_HALF = [5.4, 4.5];
export function roadHalfAt(s) {
  if (s < ABUTMENT_S[0]) return ROAD_HALF + (LANDING_HALF[0] - ROAD_HALF) * smooth((ABUTMENT_S[0] - s) / ABUTMENT_S[0]);
  if (s > ABUTMENT_S[1]) return ROAD_HALF + (LANDING_HALF[1] - ROAD_HALF) * smooth((s - ABUTMENT_S[1]) / (L - ABUTMENT_S[1]));
  return ROAD_HALF;
}
export const edgesAt = s => { const w = roadHalfAt(s); return [[-w, w]]; };

const bridgePoint = (s, d = 0, y = null) => base.bridgePoint(s, d, y ?? deckHeight(s));
const accepted = createBridgeProfile({ ...base.CHAMPLAIN, roadEdgesAt: edgesAt });
export const PROFILE = {
  ...base, bridgePoint, deckHeight, roadEdges: s => edgesAt(s),
  // Rigid iron deck: provider pavement samples never squeeze it.
  fittedLateral: (_s, d) => d,
  bridgeRoadHeight(lng, lat, heading, approaches) {
    if (accepted.bridgeRoadHeight(lng, lat, heading, approaches) === null) return null;
    return deckHeight(base.stationAt([lng, lat]), approaches);
  },
  meshStep: 3,
  knots: [[0, 'start'], [C1, 'start'], [TOWER_S[0], FLAT_TOWER_H], [CENTRE_S, FLAT_TOWER_H + GC * MAIN_SPAN / 4], [TOWER_S[1], FLAT_TOWER_H], [L - C1, 'end'], [L, 'end']],
};
export default PROFILE;
