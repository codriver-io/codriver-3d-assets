import alignment from './pont-dubuc-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the Pont Dubuc: station s runs SOUTH TO NORTH (Chicoutimi to Chicoutimi-Nord) along
// Route 175, lateral d is positive to the RIGHT of northbound travel (east, downstream: the northbound
// carriageway). The bridge is mapped as two straight one-way carriageways (OSM 252486247 northbound,
// 1387995420 southbound) 8.6 m apart; the alignment is their average, exactly straight between the two
// mapped bridge ends and continued straight 35 m onto the southern approach (the carriageways stay within
// 1 m of it there). Geometry, the car, the route, the camera and the HD pavement share it
// (bridge-profile.js).

/** Road surface over the river, m above local y = 0 (the Saguenay; the AWS Terrarium DEM reads 4 m there).
 * Not published: estimated from photographs (the twin-column piers about 7.5 m to the steel, a 2.9 m steel
 * box and slab, a 1.2 m railing) and from Route 172, which passes under the Route 175 just north of the
 * bridge on the DEM's 10 m terrace. */
export const TOP = 12.0;
/** The river in the DEM (m above sea level): Full 3D world adds it to the real deck. */
export const WATER = 4.0;
/**
 * Junctions: the southbound exit to Boulevard du Saguenay Ouest leaves 34 m south of the mapped bridge end
 * (the bridge carries no other junction); north of the bridge Route 175 crosses OVER Route 172 on its own
 * overpass (mapped bridge ways 1387995465/49827422) whose underpassing roads start 2 m beyond the mapped
 * north end. So the flat-map ramps cannot start on the approach roads: the alignment starts EXTEND_S
 * metres beyond the south end (1 m before the exit's gore) and ends just past the mapped north end, and both ramps
 * climb over the end spans of the bridge itself. Beyond the alignment the provider draws the curved south
 * viaduct and the north overpass.
 */
export const EXTEND_S = 35;
/** And EXTEND_N metres beyond the mapped north end, so both carriageway end nodes lie on the alignment
 * (the provider's 485 m straight road segments are replaced whole); Route 172 passes under 4.6 m out. */
export const EXTEND_N = 2;
/**
 * Vertical profile (one shape, two datums), the Pont Laviolette's: from each ramp foot a cubic eases (zero
 * grade at the foot) up to a knee KNEE_S / KNEE_N metres from the foot, KNEE_RISE_S / KNEE_RISE_N above it,
 * where a constant grade takes over; the middle of the bridge is crossed on a parabolic crest curve VC_TOP
 * long. Chosen so the steel box clears the ground at the end piers on the flat map and the grade stays
 * under 8 %; estimated, not a survey.
 */
export const KNEE_S = 70;
export const KNEE_RISE_S = 3.3;
export const KNEE_N = 60;
export const KNEE_RISE_N = 3.0;
export const VC_TOP = 160;

/** Cross-section (lateral metres, + = east). Published: four lanes separated by a concrete median wall.
 * Mapped: carriageway centres 4.2-4.5 m either side of the axis, a sidewalk on each side ~10 m out, the
 * bridge outline 22.9 m wide. Estimated: 7.55 m carriageways (two 3.65 m lanes) either side of a 0.9 m
 * median wall, a 0.5 m barrier, a 2.4 m sidewalk and a 0.5 m parapet with a railing on each side. */
export const DECK_HALF = 11.4;
export const KERB = 8.0;
export const MEDIAN = 0.45;
export const ROAD_EDGES = [[-KERB, -MEDIAN], [MEDIAN, KERB]];

// ---- The alignment --------------------------------------------------------------------------------
const K = mercStretch(SPEC.origin[1]);
/** Plane metres, x east, y NORTH (latitude stretch removed at the origin). */
const plane = ([lng, lat]) => [lngToMercX(lng) / K, latToMercY(lat) / K];
const unplane = ([x, y]) => [mercXToLng(x * K), mercYToLat(y * K)];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len = (a) => Math.hypot(a[0], a[1]);
const mean = (list) => [list.reduce((n, p) => n + p[0], 0) / list.length, list.reduce((n, p) => n + p[1], 0) / list.length];

/** The mapped bridge ends (mean of the two carriageway end nodes) and the straight axis between them. */
const br = alignment.bridge;
export const BRIDGE_ENDS = [mean([br.northbound.line[0], br.southbound.line[0]].map(plane)), mean([br.northbound.line.at(-1), br.southbound.line.at(-1)].map(plane))];
const [ES, EN] = BRIDGE_ENDS, MAPPED = len(sub(EN, ES)), AXIS = sub(EN, ES).map((v) => v / MAPPED);
const onAxis = (u) => [ES[0] + AXIS[0] * u, ES[1] + AXIS[1] * u];
const centerline = [onAxis(-EXTEND_S), onAxis(MAPPED + EXTEND_N)].map(unplane);

/** Stations on the alignment (south foot = 0). */
export const BRIDGE_START = EXTEND_S;
export const BRIDGE_END = EXTEND_S + MAPPED;
/** The middle of the mapped bridge (the model origin) in lng/lat. */
export const MID_S = (BRIDGE_START + BRIDGE_END) / 2;
export const MID_LNGLAT = unplane(onAxis(MID_S - EXTEND_S));
/** The crest of the vertical curve: midway between the south foot and the mapped north end. */
export const CREST_S = BRIDGE_END / 2;

// ---- Two vertical profiles of one shape: the flat-map compromise and the real deck -------------------
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges', terrainPolicy: SPEC.terrainPolicy,
  width: 2 * DECK_HALF, roadEdges: ROAD_EDGES, centerline,
  // The provider's northbound carriageway is one straight segment from the south end to past the Route 172
  // overpass: split standard road ribbons at the alignment ends instead of keeping them whole.
  clipStandardEnds: true,
  palette: PALETTES.light,
  // Knots for the shared helpers (strip sampling); deckHeight below is the real contract.
  profile: ({ length }) => [[0, 'start'], [length / 2, TOP], [length, 'end']],
});
const L = base.BRIDGE_LENGTH;
/** Full 3D world only: the deck rides REAL_LIFT above the terrain roads, eased in over LIFT_RUN metres
 * from each ramp foot, so the DEM's own lattice cannot show through the pavement (the Pont Laviolette's). */
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
 *   deck climbs to TOP (12 m) over the river spans;
 * - realSurface([a, b]) (Full 3D world, absolute heights): the same shape from the terrain roads at the
 *   alignment ends (DEM ~4 m south, ~7 m north, plus REAL_LIFT) to TOP + WATER (16 m above sea level).
 * The shared fit moves each vertex by deckHeight(s, approaches) - deckHeight(s).
 */
function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(L, s));
  const real = !!approaches.real, top = TOP + (real ? WATER : 0), lift = real ? REAL_LIFT : 0;
  if (s <= CREST_S) return side(s, KNEE_S, KNEE_RISE_S, CREST_S, approaches[0], top, lift);
  return side(L - s, KNEE_N, KNEE_RISE_N, L - CREST_S, approaches[1], top, lift);
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
/** Road ownership: the provider corridor is the deck plus 1.5 m (bridge-roads.js): the sidewalks are
 * mapped separately ~10 m out and stay on the deck's own footprint; nothing else runs beside the bridge. */
export const OWNERSHIP_MARGIN = 1.5;

export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight, ownershipMargin: OWNERSHIP_MARGIN };
export default PROFILE;
