import alignment from './pont-laviolette-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the Pont Laviolette: station s runs NORTH-WEST TO SOUTH-EAST (Trois-Rivières to
// Bécancour) along the A-55, lateral d is positive to the RIGHT of southbound travel (south-west, the
// southbound carriageway). The bridge is mapped as two straight one-way carriageways (OSM 84720759
// southbound, 84720761 northbound) 7.9 m apart; the alignment is their average, exactly straight between
// the two mapped bridge ends and continued straight onto the approach roads for the flat-map ramps (the
// A-55 carriageways stay within 1.2 m of it there). Geometry, the car, the route, the camera and the HD
// pavement share it (bridge-profile.js).

/** Road surface at the crest, m above local y = 0 (high water). Published (MTQ, 2005 impact study):
 * 52.02 m from the water to the top of the deck at high water (56.97 m at low water). */
export const TOP = 52.0;
/** High water: published 6.02 m (mean spring high water); the AWS Terrarium DEM reads 6 m over the
 * river at the bridge. Full 3D world adds it to the real deck (y = 0 is sea level there). */
export const WATER = 6.0;
/** Published: 2,707 m long (2,702 m in the MTQ study); steel structure 1,383 m (1,375 m): the central
 * 335 m span (a 269 m arch hung between two 33 m cantilevers) between two 167 m anchor spans and three
 * through-truss spans each side; steel approaches of 641 m (north) and 683 m (south). */
export const LENGTH = 2707;
export const MAIN_SPAN = 335;
export const CANTILEVER = 33;
export const ANCHOR_SPAN = 167;
export const NORTH_APPROACH = 641;
/**
 * Roads pass UNDER both ends of the bridge (mapped): an emergency U-turn loop 67 m and Rue Notre-Dame
 * Ouest (two carriageways, a footway and a cycleway) 128-152 m from the north end, Boulevard Bécancour 25 m
 * from the south end. So the deck already stands on embankments at the abutments, and on the flat map
 * the ramps start on the approach roads: EXTEND_N metres beyond the north end (just past the U-turn
 * loop's two junctions, 71 and 83 m out) and EXTEND_S metres beyond the south end (the next join is a
 * service crossover 128 m out). The alignment ends there, on the plain motorway.
 */
export const EXTEND_N = 75;
export const EXTEND_S = 115;
/**
 * Vertical profile (one shape, two datums): from each ramp foot a cubic eases (zero grade at the foot)
 * up to a knee KNEE_N / KNEE_S metres inside the bridge, KNEE_RISE_N / KNEE_RISE_S above the foot, where
 * a constant grade takes over; the main span is crossed on a parabolic crest curve VC_TOP long centred on
 * the arch. Chosen so the deck clears the roads underneath (about 6 m under the girders) and the grade
 * stays under 9 %; estimated, not a survey (the published crest height is the only sourced level).
 */
export const KNEE_N = 80;
export const KNEE_RISE_N = 10.5;
export const KNEE_S = 50;
export const KNEE_RISE_S = 9.0;
export const VC_TOP = 700;

/** Cross-section (lateral metres, + = south-west). Published: 16.7 m overall, four lanes, a central
 * concrete wall since 2007. Mapped: carriageway centres 3.8-4.1 m either side of the axis. Estimated:
 * 7.2 m carriageways (two 3.6 m lanes, no shoulder) either side of a 0.7 m median wall. */
export const DECK_HALF = 8.35;
export const KERB = 7.55;
export const MEDIAN = 0.35;
export const ROAD_EDGES = [[-KERB, -MEDIAN], [MEDIAN, KERB]];

// ---- The alignment --------------------------------------------------------------------------------
const K = mercStretch(SPEC.origin[1]);
/** Plane metres, x east, y NORTH (latitude stretch removed at the origin). */
const plane = ([lng, lat]) => [lngToMercX(lng) / K, latToMercY(lat) / K];
const unplane = ([x, y]) => [mercXToLng(x * K), mercYToLat(y * K)];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len = (a) => Math.hypot(a[0], a[1]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const mean = (list) => [list.reduce((n, p) => n + p[0], 0) / list.length, list.reduce((n, p) => n + p[1], 0) / list.length];

/** The mapped bridge ends (mean of the two carriageway end nodes) and the straight axis between them. */
const br = alignment.bridge;
export const BRIDGE_ENDS = [mean([br.southbound.line[0], br.northbound.line[0]].map(plane)), mean([br.southbound.line.at(-1), br.northbound.line.at(-1)].map(plane))];
const [EN, ES] = BRIDGE_ENDS, MAPPED = len(sub(ES, EN)), AXIS = sub(ES, EN).map((v) => v / MAPPED);
const onAxis = (u) => [EN[0] + AXIS[0] * u, EN[1] + AXIS[1] * u];
const centerline = [onAxis(-EXTEND_N), onAxis(MAPPED + EXTEND_S)].map(unplane);

/** Stations on the alignment (north-west end = 0). */
export const BRIDGE_START = EXTEND_N;
export const BRIDGE_END = EXTEND_N + MAPPED;

// ---- Spans (published lengths from the mapped north end) ------------------------------------------
export const SOUTH_APPROACH = 683;
export const STEEL = LENGTH - NORTH_APPROACH - SOUTH_APPROACH;
/** The truss spans either side of the anchor spans: (steel structure - main - 2 anchors) / 6 = 119 m
 * (estimated: equal spans; photographs show three each side). */
export const TRUSS_SPAN = (STEEL - MAIN_SPAN - 2 * ANCHOR_SPAN) / 6;
/** The supports of the steel structure, north to south: N5 (the north approach meets the trusses), N4-N2,
 * the main piers N1/S1 either side of the navigation channel, S2-S4, S5. */
export const TRUSS_START = BRIDGE_START + NORTH_APPROACH;
export const MAIN_S = [TRUSS_START + 3 * TRUSS_SPAN + ANCHOR_SPAN, TRUSS_START + 3 * TRUSS_SPAN + ANCHOR_SPAN + MAIN_SPAN];
export const TRUSS_END = MAIN_S[1] + ANCHOR_SPAN + 3 * TRUSS_SPAN;
export const CREST_S = (MAIN_S[0] + MAIN_S[1]) / 2;
/** Mid-span (the model origin) in lng/lat. */
export const MID_LNGLAT = unplane(onAxis(CREST_S - EXTEND_N));

// ---- Two vertical profiles of one shape: the flat-map compromise and the real deck -------------------
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges', terrainPolicy: SPEC.terrainPolicy,
  width: 2 * DECK_HALF, roadEdges: ROAD_EDGES, centerline,
  palette: PALETTES.light,
  // Knots for the shared helpers (strip sampling); deckHeight below is the real contract.
  profile: ({ length }) => [[0, 'start'], [CREST_S, TOP], [length, 'end']],
});
const L = base.BRIDGE_LENGTH;
/** Full 3D world only: the deck rides REAL_LIFT above the terrain roads, eased in over LIFT_RUN metres
 * from each ramp foot, so the DEM's own lattice cannot show through the pavement (the Pont de Québec
 * keeps 0.6 m too). */
export const REAL_LIFT = 0.6;
export const LIFT_RUN = 25;
/** Marks an approach pair as the real-height surface (Full 3D world): see layer.js. */
export const realSurface = (approaches) => Object.assign([...approaches], { real: true });
/** Cubic Hermite between (0, y0, m0) and (w, y1, m1) at u in [0, w]. */
function hermite(u, w, y0, m0, y1, m1) {
  const t = u / w, t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * w * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * w * m1;
}
/** One side of the profile: `u` metres from the ramp foot (base height `base`, lift-eased), the knee at
 * `knee` (rise `rise`), the crest at `crest` (height `top`). */
function side(u, knee, rise, crest, base, top, lift) {
  const kneeY = base + lift + rise, g = (top - kneeY) / (crest - knee - VC_TOP / 4);
  if (u <= knee) return base + lift * Math.min(1, u / LIFT_RUN) + hermite(u, knee, 0, 0, rise, g);
  const x = crest - u, half = VC_TOP / 2;
  return x > half ? top - g * (x - half / 2) : top - g * x * x / (2 * half);
}
/**
 * The deck surface at station s, chosen by the argument (the Pont Pierre-Laporte's convention):
 * - no `approaches`: the AUTHORED surface the GLB is built on (flat map, approach roads at grade 0);
 * - a plain [a, b] (Cityscape): the ramps leave the loaded approach roads at the alignment ends and the
 *   deck climbs to TOP (52 m) over the channel;
 * - realSurface([a, b]) (Full 3D world, absolute heights): the same shape from the terrain roads at the
 *   alignment ends (DEM ~10 m on both shore terraces, plus REAL_LIFT) to TOP + WATER (58 m above sea
 *   level) at the crest.
 * The shared fit moves each vertex by deckHeight(s, approaches) - deckHeight(s).
 */
function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(L, s));
  const real = !!approaches.real, top = TOP + (real ? WATER : 0), lift = real ? REAL_LIFT : 0;
  if (s <= CREST_S) return side(s, BRIDGE_START + KNEE_N, KNEE_RISE_N, CREST_S, approaches[0], top, lift);
  return side(L - s, L - BRIDGE_END + KNEE_S, KNEE_RISE_S, L - CREST_S, approaches[1], top, lift);
}
const bridgePoint = (station, lateral = 0, height = null) => base.bridgePoint(station, lateral, height ?? deckHeight(station));
/** The shared bridgeRoadHeight with this profile's two surfaces. */
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  const p = base.bridgeLocal(lng, lat), b = base.bounds;
  if (p.x < b.minX - 10 || p.x > b.maxX + 10 || p.z < b.minZ - 10 || p.z > b.maxZ + 10) return null;
  const q = base.projectBridge(p.x, p.z);
  if (q.beyond || !base.roadEdges(q.s, joins, sections).some(([lo, hi]) => q.lateral >= lo - 0.6 && q.lateral <= hi + 0.6)) return null;
  if (Number.isFinite(heading)) { const h = heading * Math.PI / 180; if (Math.abs(Math.sin(h) * q.tx - Math.cos(h) * q.tz) < 0.8) return null; }
  return deckHeight(q.s, approaches);
}
/** Road ownership: the deck carries only the A-55 (no sidewalk, no track); the provider corridor is the
 * deck plus 4 m (bridge-roads.js), well clear of the shore streets. */
export const OWNERSHIP_MARGIN = 4;

export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight, ownershipMargin: OWNERSHIP_MARGIN };
export default PROFILE;
