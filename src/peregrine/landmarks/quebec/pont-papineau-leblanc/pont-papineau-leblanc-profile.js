import alignment from './pont-papineau-leblanc-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the Pont Papineau-Leblanc: station s runs NORTH-WEST TO SOUTH-EAST (Laval to
// Montréal) along the A-19, lateral d is positive to the RIGHT of southbound travel (south-west, the
// southbound carriageway). The bridge is mapped as two straight one-way carriageways (OSM 965280263
// southbound, 165090517 northbound) 14 m apart; the alignment is their average, exactly straight between the
// two mapped bridge ends and continued straight onto the approach roads for the flat-map ramps (the A-19
// carriageways stay within 1.2 m of it there). Geometry, the car, the route, the camera and the HD pavement
// share it (bridge-profile.js).

/** Road surface over the river spans, m above local y = 0 (the water). Published (Wikipédia): the deck
 * 11.3 m above the water, 7.6 m clearance under it. */
export const TOP = 11.3;
/** River level: the AWS Terrarium DEM reads 16.9 m over the whole crossing (Rivière des Prairies above
 * the dam). Full 3D world adds it to the real deck (y = 0 is sea level there). */
export const WATER = 16.9;
/** Published: a three-span cable-stayed structure, 241 m main span (790 ft) between two 90 m side spans,
 * 421 m (Structurae; 420.6 m on Wikipedia, 458.6 m over the abutments on Wikipédia). The mapped bridge
 * ways are 444.9 m: the cable-stayed unit is centred on them and two short end spans reach the abutments. */
export const MAIN_SPAN = 241;
export const SIDE_SPAN = 90;
export const STAYED = MAIN_SPAN + 2 * SIDE_SPAN;
/** Pylon height above the deck: published 126 ft (Structurae) / 38.4 m (Wikipédia). */
export const PYLON_ABOVE = 38.4;
/**
 * Junctions near the ends (mapped): on the Laval side the northbound exit to Boulevard Lévesque leaves 90 m
 * beyond the bridge end and the southbound entrance from it merges 122 m beyond (Boulevard Lévesque crosses
 * over the A-19 at 111 m). On the Montréal side nothing joins the A-19 until Boulevard Henri-Bourassa,
 * 684 m beyond the bridge end, where the freeway ends. So the flat-map ramps start on the approach roads
 * EXTEND_N metres beyond the Laval end (short of the exit gore) and EXTEND_S beyond the Montréal end (still
 * on the level riverside terrace, DEM 19.9 m, before the ground falls away south of it: Full 3D world takes the
 * ramp feet from the terrain there).
 */
export const EXTEND_N = 85;
export const EXTEND_S = 120;

/** Cross-section (lateral metres, + = south-west). Published: 27.2 m wide (27.6 m on Wikipédia), six
 * lanes, the pylons in the median. Mapped: carriageway centres 7.0 m either side of the axis. Estimated:
 * 11.25 m carriageways (three 3.75 m lanes) either side of a 3.0 m median, 0.85 m outer parapets. */
export const DECK_HALF = 13.6;
export const KERB = 12.75;
export const MEDIAN = 1.5;
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
export const BRIDGE_ENDS = [mean([br.southbound.line[0], br.northbound.line[0]].map(plane)), mean([br.southbound.line.at(-1), br.northbound.line.at(-1)].map(plane))];
const [EN, ES] = BRIDGE_ENDS, MAPPED = len(sub(ES, EN)), AXIS = sub(ES, EN).map((v) => v / MAPPED);
const onAxis = (u) => [EN[0] + AXIS[0] * u, EN[1] + AXIS[1] * u];
const centerline = [onAxis(-EXTEND_N), onAxis(MAPPED + EXTEND_S)].map(unplane);

/** Stations on the alignment (Laval ramp foot = 0). */
export const BRIDGE_START = EXTEND_N;
export const BRIDGE_END = EXTEND_N + MAPPED;
/** The cable-stayed unit, centred on the mapped bridge but SHIFT metres towards Montréal so the riverside
 * cycleway (mapped in a tunnel 14 m inside the Montréal end) passes clear of the end pier: end piers, then
 * the two pylons. */
export const SHIFT = 1.5;
export const STAYED_START = BRIDGE_START + (MAPPED - STAYED) / 2 + SHIFT;
export const STAYED_END = STAYED_START + STAYED;
export const PYLON_S = [STAYED_START + SIDE_SPAN, STAYED_END - SIDE_SPAN];
export const MID_S = (PYLON_S[0] + PYLON_S[1]) / 2;
/** Mid-span (the model origin) in lng/lat. */
export const MID_LNGLAT = unplane(onAxis(MID_S - EXTEND_N));

// ---- Two vertical profiles: the flat-map compromise and the real deck -------------------------------
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges', terrainPolicy: SPEC.terrainPolicy,
  width: 2 * DECK_HALF, roadEdges: ROAD_EDGES, centerline,
  palette: PALETTES.light,
  // Knots for the shared helpers (strip sampling); deckHeight below is the real contract.
  profile: ({ length }) => [[0, 'start'], [PYLON_S[0], TOP], [PYLON_S[1], TOP], [length, 'end']],
});
const L = base.BRIDGE_LENGTH;
/**
 * Vertical profile: constant grades between points of vertical intersection (PVI), each rounded by a
 * parabolic vertical curve VC metres long; level (grade 0) before the first and after the last, so the
 * ramps leave the approach roads tangentially. The first and last PVIs sit half a curve inside the ramp
 * feet. Flat map: the deck climbs from the Laval foot to TOP just past the north pylon (7.2 %), stays level
 * across the main span and descends from beyond the south pylon to the Montréal foot (6.9 %). Real deck:
 * the same stations, from the terrain road in Laval (higher than the deck: the A-19 comes down the bluff)
 * to WATER + TOP across the main span and down to the Montréal terrace.
 */
export const VC = { foot: 30, north: 40, south: 60, end: 50 };
export const PVI_S = [VC.foot / 2, PYLON_S[0] - 17, PYLON_S[1] + 32, L - VC.end / 2];
/** Full 3D world only: the deck rides REAL_LIFT above the terrain roads, eased in over LIFT_RUN metres from
 * each ramp foot, so the DEM's own lattice cannot show through the pavement (the Pont Laviolette's 0.6 m). */
export const REAL_LIFT = 0.6;
export const LIFT_RUN = 25;
/** Marks an approach pair as the real-height surface (Full 3D world): see layer.js. */
export const realSurface = (approaches) => Object.assign([...approaches], { real: true });

/** Height at s on the PVI polyline [[s, y, vc]...] with parabolic curves and level ends. */
function pvi(s, pts) {
  const g = pts.map((p, i) => (i + 1 < pts.length ? (pts[i + 1][1] - p[1]) / (pts[i + 1][0] - p[0]) : 0));
  for (let i = 0; i < pts.length; i++) {
    const [si, yi, vc] = pts[i], gin = i ? g[i - 1] : 0, gout = g[i];
    if (Math.abs(s - si) <= vc / 2) return yi + gin * (s - si) + (gout - gin) * (s - si + vc / 2) ** 2 / (2 * vc);
  }
  if (s <= pts[0][0]) return pts[0][1];
  if (s >= pts.at(-1)[0]) return pts.at(-1)[1];
  let i = 0; while (pts[i + 1][0] < s) i++;
  return pts[i][1] + g[i] * (s - pts[i][0]);
}
/**
 * The deck surface at station s, chosen by the argument (the Pont Pierre-Laporte's convention):
 * - no `approaches`: the AUTHORED surface the GLB is built on (flat map, approach roads at grade 0);
 * - a plain [a, b] (Cityscape): the ramps leave the loaded approach roads at the alignment ends and the
 *   deck stands TOP (11.3 m) over the river spans;
 * - realSurface([a, b]) (Full 3D world, absolute heights): from the terrain roads at the alignment ends
 *   (DEM ~32 m in Laval, ~20 m in Montréal) to WATER + TOP (28.2 m above sea level) across the main span,
 *   plus REAL_LIFT.
 * The shared fit moves each vertex by deckHeight(s, approaches) - deckHeight(s).
 */
function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(L, s));
  const real = !!approaches.real, [a, b] = approaches, deck = real ? WATER + TOP : a + TOP, deck2 = real ? WATER + TOP : b + TOP;
  const y = pvi(s, [[PVI_S[0], a, VC.foot], [PVI_S[1], deck, VC.north], [PVI_S[2], deck2, VC.south], [PVI_S[3], b, VC.end]]);
  return real ? y + REAL_LIFT * Math.min(1, s / LIFT_RUN, (L - s) / LIFT_RUN) : y;
}
const bridgePoint = (station, lateral = 0, height = null) => base.bridgePoint(station, lateral, height ?? deckHeight(station));
/** The shared bridgeRoadHeight with this profile's two surfaces. */
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  const p = base.bridgeLocal(lng, lat), bb = base.bounds;
  if (p.x < bb.minX - 10 || p.x > bb.maxX + 10 || p.z < bb.minZ - 10 || p.z > bb.maxZ + 10) return null;
  const q = base.projectBridge(p.x, p.z);
  if (q.beyond || !base.roadEdges(q.s, joins, sections).some(([lo, hi]) => q.lateral >= lo - 0.6 && q.lateral <= hi + 0.6)) return null;
  if (Number.isFinite(heading)) { const h = heading * Math.PI / 180; if (Math.abs(Math.sin(h) * q.tx - Math.cos(h) * q.tz) < 0.8) return null; }
  return deckHeight(q.s, approaches);
}
/** Road ownership: the deck carries only the A-19 (no sidewalk); the provider corridor is the deck plus
 * 4 m (bridge-roads.js), clear of the riverside paths and Boulevard Lévesque. */
export const OWNERSHIP_MARGIN = 4;

export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight, ownershipMargin: OWNERSHIP_MARGIN };
export default PROFILE;
