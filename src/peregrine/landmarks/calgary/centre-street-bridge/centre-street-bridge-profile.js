import alignment from './centre-street-bridge-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the Centre Street Bridge: station s runs SOUTH to NORTH along the mapped
// upper roadway (Centre Street, OSM 4637525 + 1323929195), continued onto the mapped at-grade
// approaches (Centre Street S from the 2 Avenue SE junction, the Centre Street N embankment up to the
// 1 Street NE link) on which the flat-map ramps run out. Lateral d is positive to the RIGHT of
// northbound travel (east). Geometry, the car, the route, the camera and the HD road share it.
//
// The bridge is a DOUBLE DECK, but unlike the Bay Bridge both decks carry both directions: the upper
// deck (layer 2, four lanes) is this landmark's road; the lower deck (layer 1, two reversible lanes,
// Riverfront Avenue to Memorial Drive) runs UNDER it, mapped 3.9 to 5.5 m east of the upper roadway.
// Position and heading cannot tell the two apart, so the lower roadway's own band (its mapped
// centreline +- LOWER_BAND) is left to the provider: heightAt answers null there (the HD car tracker
// keeps the car on the provider's lower deck) and the HD pavement there stays unclaimed (ownsPoint).

// ---- Published / mapped facts --------------------------------------------------------------------
/** Kerb to kerb on the upper deck: four lanes (estimate, 13.4 m), centred on the mapped roadway. */
export const ROAD_EDGES = [[-6.7, 6.7]];
/** Outer face of the balconies (the mapped outline is 21.3 m wide; published deck 15 m + balconies). */
export const HALF = 10.6;
/** Upper road surface on the flat map: 4.0 m above the provider's 5 m lower deck (LEVEL_M x layer 1),
 *  i.e. its 2.7 m published clearance plus the 1.3 m upper floor (slab and floor beams). */
export const DECK_H = 9.0;
/** The provider's stylised lower-deck road surface on the flat map (osm-lanes.js: 5 m per layer). */
export const LOWER_H = 5.0;
/** Half width of the lower roadway's own band (mapped centreline +- this) that heightAt leaves to the provider. */
export const LOWER_BAND = 2.6;
/** Provider heights (m above their ground) below this in the lower band belong to the lower deck. */
export const LOWER_SPLIT = 7.5;

// ---- The alignment --------------------------------------------------------------------------------
const { south, upper, north } = alignment.road;
const plain = [...south, ...upper.slice(1), ...north.slice(1)];
const frame = createBridgeProfile({ id: SPEC.id, name: SPEC.name, origin: SPEC.origin, width: 2 * HALF, roadEdges: ROAD_EDGES,
  centerline: plain, profile: ({ length }) => [[0, 0], [length, 0]] });
// Two extra vertices on the (straight) bridge chord, at the ends of the mapped lower-deck chain: the
// Full 3D world datum is sampled at alignment vertices, and these two are where the provider's HD
// datum for the lower deck is taken (hd-terrain.js: linear between the terrain at a chain's ends).
const chainS = alignment.lower.chain.map((ll) => frame.stationAt(ll));
const insert = (line, s) => {
  const q = frame.bridgePoint(s, 0, 0), ll = frame.bridgeLngLat(q.x, q.z);
  let acc = 0, i = 1;
  for (; i < line.length; i++) {
    const a = frame.bridgeLocal(...line[i - 1]), b = frame.bridgeLocal(...line[i]);
    acc += Math.hypot(b.x - a.x, b.z - a.z);
    if (acc > s) break;
  }
  return [...line.slice(0, i), ll, ...line.slice(i)];
};
const centerline = insert(insert(plain, chainS[0]), chainS.at(-1));

const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges',
  width: 2 * HALF, roadEdges: ROAD_EDGES, centerline, palette: PALETTES.light,
  // Full 3D world: no corridor flattening (a trench through the Crescent Heights escarpment would be a
  // defect). The layer subclass (layer.js) supplies a datum through the DEM at the mapped deck ends;
  // with it the structure keeps its relative heights and the supports reach their local ground.
  terrainPolicy: 'absolute-deck',
  profile: ({ length }) => [[0, 'start'], [length, 'end']],
  // While the followed car is on the lower deck the upper road, its paint and its slab fade (layer.js).
  upperDeck: { materials: ['asphalt', 'paint', 'yellow', 'deck'], pavement: 'asphalt', opacity: 0.2 },
});
const { BRIDGE_LENGTH, bridgeLocal, projectBridge, bounds } = base;
export const L = BRIDGE_LENGTH;

/** Stations of the mapped features (south to north). */
export const S = {
  bridgeS: base.stationAt(upper[0]),               // south end of the mapped bridge way (on grade beyond)
  bridgeN: base.stationAt(upper.at(-1)),           // north end (the embankment beyond)
  junctionS: base.stationAt(alignment.lower.line[0]),        // lower roadway meets Riverfront Avenue
  lowerS: base.stationAt(alignment.lower.chain[0]),          // lower deck (bridge chain) south end
  lowerN: base.stationAt(alignment.lower.chain.at(-1)),      // lower deck north end
  junctionN: base.stationAt(alignment.lower.line.at(-1)),    // lower roadway meets Memorial Drive
};

// ---- The lower roadway ------------------------------------------------------------------------------
const lowerLocal = alignment.lower.line.map((ll) => { const p = bridgeLocal(...ll), q = projectBridge(p.x, p.z); return { s: q.s, d: q.lateral }; });
/** Lateral of the mapped lower roadway's centreline at station s (clamped to its ends). */
export function lowerD(s) {
  if (s <= lowerLocal[0].s) return lowerLocal[0].d;
  for (let i = 1; i < lowerLocal.length; i++) if (s <= lowerLocal[i].s) {
    const a = lowerLocal[i - 1], b = lowerLocal[i];
    return a.d + (b.d - a.d) * (s - a.s) / (b.s - a.s);
  }
  return lowerLocal.at(-1).d;
}
/** Whether (s, d) lies on the lower roadway's own band, where the provider owns the road. */
export const inLowerBand = (s, d, below = LOWER_BAND, above = LOWER_BAND, margin = 1) =>
  s >= S.junctionS - margin && s <= S.junctionN + margin && d >= lowerD(s) - below && d <= lowerD(s) + above;

// ---- Vertical alignment: constant grades between intersection points, parabolic vertical curves ----
/**
 * Flat-map convention (docs/3d-calgary-centre-street-bridge.md). The basemap has no river channel and
 * no escarpment, and the provider stacks the lower deck at 5 m, so the upper road is level at DECK_H
 * from 7 m south of the lower deck (over the Riverfront Avenue junction) to 15 m north of it (past
 * Memorial Drive), and ramps on constant grades onto the mapped approaches: south to the 2 Avenue SE
 * junction ('start'), north down the Centre Street N embankment to the 1 Street NE link ('end').
 * The ends are tangent to the approach roads at the loaded datum (deckHeight(0, [a, b]) = a).
 */
export const LEVEL_S = S.lowerS - 7, LEVEL_N = S.lowerN + 15;
const CURVE = { foot: 16, crest: 24 };
const verticals = new Map();
function vertical(a, b) {
  const key = `${a},${b}`;
  let v = verticals.get(key);
  if (v) return v;
  const P = [[CURVE.foot / 2, a], [LEVEL_S, DECK_H], [LEVEL_N, DECK_H], [L - CURVE.foot / 2, b]];
  const Lc = [CURVE.foot, CURVE.crest, CURVE.crest, CURVE.foot];
  const g = P.slice(1).map((q, i) => (q[1] - P[i][1]) / (q[0] - P[i][0]));
  v = { P, Lc, gin: [0, ...g], gout: [...g, 0] };
  if (verticals.size > 64) verticals.clear();
  verticals.set(key, v);
  return v;
}
/** Datum knots of a Full 3D world surface: [station, ground] pairs, piecewise linear between. */
const datumAt = (knots, s) => {
  let i = 1; while (i < knots.length - 1 && knots[i][0] < s) i++;
  const [s0, y0] = knots[i - 1], [s1, y1] = knots[i];
  return y0 + (y1 - y0) * Math.max(0, Math.min(1, (s - s0) / (s1 - s0)));
};
/** Stations where the Full 3D world datum is sampled (layer.js): the alignment ends, the mapped bridge
 *  way ends and the lower-deck chain ends (all alignment vertices). */
export const DATUM_S = [0, S.bridgeS, S.lowerS, S.lowerN, S.bridgeN, L];
/** A Full 3D world surface: approach heights plus the DEM datum (baked / stretch) at DATUM_S. */
export const worldSurface = (approaches, ground) => Object.assign([...approaches], { datum: DATUM_S.map((s, i) => [s, ground[i]]) });
/**
 * The upper road surface at station s. With no `approaches`: the AUTHORED surface the GLB is built on
 * (flat map, approaches at 0). A plain [a, b] (Cityscape): the flat-map profile with its ends at the
 * loaded approach datum. A worldSurface (Full 3D world): the same relative profile on the DEM datum.
 * The shared fit moves each vertex by deckHeight(s, approaches) - deckHeight(s).
 */
export function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(L, s));
  const [a, b] = approaches;
  const { P, Lc, gin, gout } = vertical(a, b);
  const datum = approaches.datum ? datumAt(approaches.datum, s) : 0;
  for (let i = 0; i < P.length; i++) {
    const [x, y] = P[i], hl = Lc[i] / 2;
    if (s >= x - hl && s <= x + hl) { const t = s - (x - hl); return datum + y - gin[i] * hl + gin[i] * t + (gout[i] - gin[i]) * t * t / (2 * Lc[i]); }
  }
  let i = 0; while (i < P.length - 2 && P[i + 1][0] < s) i++;
  return datum + P[i][1] + gout[i] * (s - P[i][0]);
}
/** Tangent grades of the flat-map ramps (south ramp rising, north ramp falling) for an approach datum pair. */
export const grades = (a = 0, b = 0) => vertical(a, b).gout.slice(0, -1);
const knots = [[0, 'start'], [LEVEL_S, DECK_H], [LEVEL_N, DECK_H], [L, 'end']];
const bridgePoint = (station, lateral = 0, height = null) => base.bridgePoint(station, lateral, height ?? deckHeight(station));

/** The car, route and camera height: the upper deck, except on the lower roadway's band (provider's). */
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  const p = bridgeLocal(lng, lat);
  if (p.x < bounds.minX - 10 || p.x > bounds.maxX + 10 || p.z < bounds.minZ - 10 || p.z > bounds.maxZ + 10) return null;
  const q = projectBridge(p.x, p.z);
  if (q.beyond || !base.roadEdges(q.s, joins, sections).some(([lo, hi]) => q.lateral >= lo - 0.6 && q.lateral <= hi + 0.6)) return null;
  if (inLowerBand(q.s, q.lateral)) return null;
  if (Number.isFinite(heading)) { const h = heading * Math.PI / 180; if (Math.abs(Math.sin(h) * q.tx - Math.cos(h) * q.tz) < 0.8) return null; }
  return deckHeight(q.s, approaches);
}
/** Whether a point and heading lie on the lower roadway (the layer fades the upper deck for that car). */
export function onLowerDeck(lng, lat, heading) {
  const p = bridgeLocal(lng, lat), q = projectBridge(p.x, p.z);
  if (q.beyond || q.distance > 12 || !inLowerBand(q.s, q.lateral)) return false;
  if (!Number.isFinite(heading)) return true;
  const h = heading * Math.PI / 180;
  return Math.abs(Math.sin(h) * q.tx - Math.cos(h) * q.tz) >= 0.8;
}

export const PROFILE = { ...base, knots, deckHeight, bridgePoint, bridgeRoadHeight };
// Own only the deck corridor (half width + 3 m): parallel footways beyond the balconies stay provider.
PROFILE.ownershipMargin = 3;
/**
 * HD ownership (bridge-roads.js passes the triangle's mean height above its ground as `h`): the
 * provider's lower deck, its covered approaches and their generic walls and piers, all below
 * LOWER_SPLIT in the lower roadway's band, stay provider geometry. The upper deck (10 m in the
 * provider's tiles) and its generic piers on the upper roadway's centreline are claimed as usual.
 */
PROFILE.ownsPoint = (x, z, h) => {
  if (!Number.isFinite(h) || h >= LOWER_SPLIT) return true;
  const q = projectBridge(x, z);
  return !inLowerBand(q.s, q.lateral, 3.0, 4.0, 3);
};

export default PROFILE;
