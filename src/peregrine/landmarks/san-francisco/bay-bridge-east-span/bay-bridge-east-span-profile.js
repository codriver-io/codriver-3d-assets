import alignment from './bay-bridge-east-span-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the East Span: station s runs west (Yerba Buena Island) to east (Oakland)
// along the MIDLINE between the mapped eastbound and westbound carriageways (OSM ways 237731428 and
// 236348361, with the YBI viaduct and the on-grade I-80 beyond the touchdown); lateral d is positive
// to the right of eastbound travel (south). The westbound deck is d < 0, the eastbound deck d > 0.
// Geometry, the car, the route, the camera and the HD pavement share it (bridge-profile.js).

/** Published spans (Caltrans elevation, T.Y. Lin): W2-T1 180 m, T1-E2 385 m; deck 10 m past W2, 49.385 m past E2. */
export const BACK_SPAN = 180, MAIN_SPAN = 385, W_OVERHANG = 10, E_OVERHANG = 49.385;
/** Tower top above local grade (published 160 m / 525 ft above water). */
export const TOWER_H = 160;
/**
 * Real deck (road surface) height over the SAS: about 57 m above the water at the tower, measured on
 * the Caltrans elevation (deck at 0.35 of the 160 m tower above mean sea level; +-3 m). Recorded in
 * SPEC.realDeckM for a terrain mode that uses real heights; NOT used by this flat-map profile.
 *
 * FLAT-MAP COMPROMISE (Cityscape): the YBI approach is short (the westbound viaduct climbs over the
 * eastbound one toward the double-deck tunnel just west of the alignment), so the deck is lowered:
 * ~30 m at the SAS west end, rising at 5.3 % over the back span to 40 m at the tower, level across
 * the main span, then down the Skyway to 22 m at E16 and over the touchdown to the road.
 */
export const DECK_W = 30, DECK_T = 40, DECK_E16 = 22;
/**
 * The REAL profile (Full 3D world, 'absolute-deck', and the authored GLB): about 57 m over the SAS
 * west end and the tower, 1 % down to 51 m at the SAS east end, 1.4 % down the Skyway to 22 m at E16.
 * The GLB is authored on it with plausible real ends (48 m on the YBI transition viaduct at the
 * alignment start, 4 m on the Oakland shore); at run time the ends take the loaded datum.
 */
export const REAL = { sasW: 57, tower: 57, sasE: 51, e16: 22 };
export const AUTHORED_ENDS = [48, 4];
/** Vertical curve lengths (m): foot of each ramp, crest at the SAS west end, tower, SAS east end, E16. */
export const CURVES = { foot: 50, sasW: 60, tower: 80, sasE: 60, e16: 120 };
/** Kerb to kerb of each carriageway: five 12 ft lanes and two 10 ft shoulders (24.4 m). */
export const ROAD_HALF = 12.2;

const base0 = createBridgeProfile({ id: SPEC.id, name: SPEC.name, origin: SPEC.origin, width: 85, roadEdges: [[-33.1, -8.7], [8.7, 33.1]], centerline: alignment.road.centerline, palette: PALETTES.light, profile: ({ length }) => [[0, 0], [length, 0]] });
const centroid = (ring) => ring.slice(0, -1).reduce((n, p, _, a) => [n[0] + p[0] / a.length, n[1] + p[1] / a.length], [0, 0]);

/** Stations of the structure: the tower from its mapped outline, the piers from the published spans. */
export const T1 = base0.stationAt(centroid(alignment.tower.ring));
export const W2 = T1 - BACK_SPAN, E2 = T1 + MAIN_SPAN;
export const SAS_W = W2 - W_OVERHANG, SAS_E = E2 + E_OVERHANG;
/**
 * Skyway piers E3-E16 (14 pairs; four frames of 4, 4, 4 and 2 piers, spans 120-160 m, 2.1 km). Pier
 * positions are not mapped: E3 is 160 m past E2 (aerial photograph), nine 160 m spans, then four
 * 122.5 m spans toward Oakland, so that the Skyway ends ~60 m past E16 and the touchdown reaches
 * the mapped bridge end. Estimated.
 */
export const SKYWAY_SPANS = [160, 160, 160, 160, 160, 160, 160, 160, 160, 122.5, 122.5, 122.5, 122.5];
export const PIERS = SKYWAY_SPANS.reduce((list, span) => [...list, list.at(-1) + span], [E2 + 160]);
export const E16 = PIERS.at(-1);
/** Frame hinges at mid-span (the Skyway's four frames); the SAS-Skyway hinge is at SAS_E. */
export const HINGES = [PIERS[3] + 80, PIERS[7] + 80, PIERS[11] + 61.25];
/** The Skyway girder ends here; the Oakland touchdown box girder runs on to the mapped bridge end. */
export const SKYWAY_END = E16 + 61.25;
export const BRIDGE_END = base0.stationAt(alignment.road.bridgeEnds.eb[1]);
/** Mapped crossbeams between the SAS boxes (stations), W2 cap beam first. */
export const CROSSBEAMS = alignment.crossbeams.map((b) => base0.stationAt(b.centre));

// ---- Lateral layout ------------------------------------------------------------------------------
// Separation between the carriageway centres (mapped): ~26 m where the alignment starts on YBI (the
// westbound viaduct still climbing over toward the double-deck tunnel), 41.8 m from 100 m west of W2.
const SEP = alignment.road.separation;
export function half(s) {
  let i = 1; while (i < SEP.length - 1 && SEP[i][0] < s) i++;
  const [a, va] = SEP[i - 1], [b, vb] = SEP[i], t = Math.max(0, Math.min(1, (s - a) / (b - a)));
  return (va + (vb - va) * t) / 2;
}
// Two YBI ramps meet the carriageways inside the first ~120 m: the westbound off-ramp (OSM 322962944)
// and the eastbound on-ramp (329394287). The deck widens to carry them (a gore), so the provider ramp
// continues onto it. Their mapped lateral positions, as (station, lateral) pairs.
const rampCurve = (id) => alignment.links.find((l) => l.way === id).geometry
  .map((ll) => { const v = base0.bridgeLocal(...ll), q = base0.projectBridge(v.x, v.z); return q.beyond ? null : [q.s, q.lateral]; })
  .filter(Boolean).sort((a, b) => a[0] - b[0]);
const RAMPS = { wb: rampCurve(322962944), eb: rampCurve(329394287) };
const RAMP_HALF = 2.6;
const along = (curve, s) => {
  if (!curve.length || s < curve[0][0] - 1 || s > curve.at(-1)[0]) return null;
  let i = 1; while (i < curve.length - 1 && curve[i][0] < s) i++;
  const [a, va] = curve[i - 1], [b, vb] = curve[i] || curve[i - 1];
  return b === a ? va : va + (vb - va) * Math.max(0, Math.min(1, (s - a) / (b - a)));
};
/** Authored kerb-to-kerb edges of [westbound, eastbound] at station s, ramp gores included. */
export function layoutEdges(s) {
  const c = half(s), wb = [-c - ROAD_HALF, -c + ROAD_HALF], eb = [c - ROAD_HALF, c + ROAD_HALF];
  const w = along(RAMPS.wb, s), e = along(RAMPS.eb, s);
  if (w !== null) wb[0] = Math.min(wb[0], w - RAMP_HALF);
  if (e !== null) eb[1] = Math.max(eb[1], e + RAMP_HALF);
  return [wb, eb];
}
/** Nominal (SAS/Skyway) edges: what the shared surface code uses for its side centres. */
export const ROAD_EDGES = [[-20.9 - ROAD_HALF, -20.9 + ROAD_HALF], [20.9 - ROAD_HALF, 20.9 + ROAD_HALF]];

// ---- Profile ----------------------------------------------------------------------------------------
/**
 * Flat-map convention (docs/3d-san-francisco-bay-bridge-east-span.md): the deck rises from the YBI
 * approach datum ('start', the loaded road) over the YBI transition structure to the SAS height, is
 * near level across the SAS, descends the Skyway, and eases over the Oakland touchdown onto the
 * mapped on-grade I-80 ('end'). The west ramp is short because the westbound viaduct climbs over
 * the eastbound one toward the double-deck tunnel west of the alignment's start.
 */
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges', terrainPolicy: 'absolute-deck',
  // Corridor half width covers the bike path (+41.7 m on the SAS) and the YBI gore (-33.3 m); a 3 m
  // ownership margin keeps the YBI ramps and the at-grade trail beyond it provider roads.
  width: 85, ownershipMargin: 3, roadEdges: ROAD_EDGES, centerline: alignment.road.centerline,
  palette: PALETTES.light, profile: ({ length }) => [[0, 'start'], [length, 'end']],
  // OSM maps the SAS tower as a 160 m building (way 237735191): the layer masks that extrusion.
  buildingFootprints: [alignment.tower.ring],
});
const { BRIDGE_LENGTH, bridgeLocal, projectBridge, bounds } = base;

// ---- Vertical alignment: constant grades between intersection points, parabolic vertical curves ----
// The shared profile eases with a smoothstep between knots (steepest = 1.5 x mean grade); a road
// profile is straight grades joined by short curves. The ends are tangent to the approach roads
// (grade 0) at the loaded datum: deckHeight(0, [a, b]) = a and deckHeight(L, [a, b]) = b exactly.
const verticals = new Map();
function vertical(a, b, real = false) {
  const key = `${real ? 'r' : 'f'}${a},${b}`;
  let v = verticals.get(key);
  if (v) return v;
  const P = real
    ? [[CURVES.foot / 2, a], [SAS_W, REAL.sasW], [T1, REAL.tower], [SAS_E, REAL.sasE], [E16, REAL.e16], [BRIDGE_LENGTH - CURVES.foot / 2, b]]
    : [[CURVES.foot / 2, a], [SAS_W, DECK_W], [T1, DECK_T], [SAS_E, DECK_T], [E16, DECK_E16], [BRIDGE_LENGTH - CURVES.foot / 2, b]];
  const Lc = [CURVES.foot, CURVES.sasW, CURVES.tower, CURVES.sasE, CURVES.e16, CURVES.foot];
  const g = P.slice(1).map((q, i) => (q[1] - P[i][1]) / (q[0] - P[i][0]));
  v = { P, Lc, gin: [0, ...g], gout: [...g, 0] };
  if (verticals.size > 64) verticals.clear();
  verticals.set(key, v);
  return v;
}
/** Marks an approach pair as the real-height surface (Full 3D world): see layer.js. */
export const realSurface = (approaches) => Object.assign([...approaches], { real: true });
/**
 * The deck surface at station s. Three surfaces share one function, chosen by the argument:
 * - no `approaches`: the AUTHORED surface the GLB is built on (the real profile, AUTHORED_ENDS);
 * - a plain [a, b] (Cityscape): the flat-map compromise, ends at the loaded approach datum;
 * - realSurface([a, b]) (Full 3D world, 'absolute-deck'): the real profile, ends at the terrain roads.
 * The shared fit moves each vertex by deckHeight(s, approaches) - deckHeight(s).
 */
function deckHeight(s, approaches) {
  s = Math.max(0, Math.min(BRIDGE_LENGTH, s));
  const authored = approaches === undefined, real = authored || !!approaches.real;
  const [a, b] = authored ? AUTHORED_ENDS : approaches;
  const { P, Lc, gin, gout } = vertical(a, b, real);
  for (let i = 0; i < P.length; i++) {
    const [x, y] = P[i], hl = Lc[i] / 2;
    if (s >= x - hl && s <= x + hl) { const t = s - (x - hl); return y - gin[i] * hl + gin[i] * t + (gout[i] - gin[i]) * t * t / (2 * Lc[i]); }
  }
  let i = 0; while (i < P.length - 2 && P[i + 1][0] < s) i++;
  return P[i][1] + gout[i] * (s - P[i][0]);
}
/** Tangent grades of the flat-map profile for an approach datum pair (west ramp first). */
export const grades = (a = 0, b = 0) => vertical(a, b).gout.slice(0, -1);
const bridgePoint = (station, lateral = 0, height = null) => base.bridgePoint(station, lateral, height ?? deckHeight(station));
const knots = [[0, 'start'], [SAS_W, DECK_W], [T1, DECK_T], [SAS_E, DECK_T], [E16, DECK_E16], [BRIDGE_LENGTH, 'end']];

// The shared profile's road edges are constant along the bridge. The East Span's are not (the YBI
// convergence and gores), so these three functions are the shared ones with layoutEdges(s) as the
// authored edges. HD sections (measured pavement) still win, clamped to 3 m of the layout so a trail
// or ramp captured on the same side cannot stretch a carriageway.
const smooth = (t) => t * t * (3 - 2 * t);
const cache = new WeakMap();
function roadEdges(s, joins, sections) {
  const nominal = layoutEdges(s);
  let sides = sections && cache.get(sections);
  if (sections && !sides) {
    sides = [0, 1].map((i) => sections.filter((v) => v.edges[i] && v.edges[i][1] - v.edges[i][0] >= 14));
    cache.set(sections, sides);
  }
  return nominal.map((edges, side) => {
    const list = sides?.[side];
    if (list?.length) {
      let lo = 0, hi = list.length; while (lo < hi) { const m = (lo + hi) >>> 1; if (list[m].s < s) lo = m + 1; else hi = m; }
      const a = list[Math.max(0, lo - 1)], b = list[Math.min(list.length - 1, lo)], t = a.s === b.s ? 0 : (s - a.s) / (b.s - a.s);
      return a.edges[side].map((v, i) => Math.max(edges[i] - 3, Math.min(edges[i] + 3, v + (b.edges[side][i] - v) * t)));
    }
    const end = s < BRIDGE_LENGTH / 2 ? 0 : 1, t = 1 - smooth(Math.min(1, (end ? BRIDGE_LENGTH - s : s) / 200));
    return edges.map((v, i) => v + ((joins?.[end]?.[side]?.[i] ?? v) - v) * t);
  });
}
function fittedLateral(s, d, joins, sections) {
  const side = d < 0 ? 0 : 1, old = layoutEdges(s)[side], next = roadEdges(s, joins, sections)[side];
  if (d < old[0]) return d + next[0] - old[0];
  if (d > old[1]) return d + next[1] - old[1];
  return next[0] + (d - old[0]) / (old[1] - old[0]) * (next[1] - next[0]);
}
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  const p = bridgeLocal(lng, lat);
  if (p.x < bounds.minX - 10 || p.x > bounds.maxX + 10 || p.z < bounds.minZ - 10 || p.z > bounds.maxZ + 10) return null;
  const q = projectBridge(p.x, p.z);
  if (q.beyond || !roadEdges(q.s, joins, sections).some(([a, b]) => q.lateral >= a - 0.6 && q.lateral <= b + 0.6)) return null;
  if (Number.isFinite(heading)) { const h = heading * Math.PI / 180; if (Math.abs(Math.sin(h) * q.tx - Math.cos(h) * q.tz) < 0.8) return null; }
  return deckHeight(q.s, approaches);
}

export const PROFILE = { ...base, knots, deckHeight, bridgePoint, roadEdges, fittedLateral, bridgeRoadHeight };
/** Steepest grades of the flat-map ramps with a 0 m approach datum: the west and east tangents. */
export const WEST_GRADE = grades()[0];
export const EAST_GRADE = -grades().at(-1);
export { deckHeight };
export default PROFILE;
