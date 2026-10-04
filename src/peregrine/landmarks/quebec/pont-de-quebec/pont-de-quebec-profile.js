import alignment from './pont-de-quebec-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the Pont de Québec: station s runs NORTH TO SOUTH (Québec to Lévis) along the
// mapped Route 175 roadway (OSM 25734031, three lanes, the middle one reversible), lateral d is positive
// to the RIGHT of southbound travel (west, towards the CN track and the Pont Pierre-Laporte). The
// alignment is the roadway's centreline, exactly straight between the two mapped bridge ends, continued
// along Route 175 beyond both ends for the flat-map ramps. The trusses, the track and the walkway are
// placed laterally from it. Geometry, the car, the route, the camera and the HD pavement share it.

/** Road surface over the whole structure, m above local y = 0 (high water). Published: 45.72 m (150 ft)
 * clearance under the suspended span at high tide; the bottom chord (1.6 m) and the floor system above
 * it are estimated, 2.3 m in all. Both clifftops stand at about this height (DEM 44-50 m at the ends). */
export const ROAD_H = 48.0;
/** Published: 548.6 m (1,800 ft) between the main piers; anchor arms 157.0 m (515 ft); a 195.07 m
 * (640 ft) suspended span hung between two 176.8 m (580 ft) cantilever arms; 987 m overall. */
export const MAIN_SPAN = 548.6;
export const ANCHOR_ARM = 157.0;
export const SUSPENDED = 195.07;
export const CANTILEVER_ARM = (MAIN_SPAN - SUSPENDED) / 2;
/**
 * Flat-map convention (docs/3d-quebec-pont-de-quebec.md): Cityscape has no river and no cliffs, so the
 * road rises from the approach roads ('start'/'end', the loaded road at run time) to ROAD_H beyond the
 * mapped bridge ends: a constant grade between a VTOP-long parabolic vertical curve at the bridge end and
 * a VFOOT-long one at the foot. Both ends of Route 175 sit in interchanges, so the feet are placed by the
 * mapped junctions (pont-de-quebec-alignment.js `joins`, `links`, `over`, `under`), not by grade:
 * - north, RAMP_NORTH: the foot is just south of Boulevard Champlain's overpass (OSM 103953555, crossing
 *   262-278 m north of the bridge end), so Route 175 passes under it at grade and the exit to Boulevard
 *   Champlain (1561827256, 297 m) and the on-ramp at 457 m (1206717133) leave and join at grade;
 * - south: the foot is the node where the link from the Route Marie-Victorin loop joins (290366580, 241 m:
 *   SOUTH_FOOT); Route Marie-Victorin passes under the P04012 span 32-50 m before it (UNDER_S), the slab >= 4.6 m above it,
 *   and the northbound branch of Boulevard Guillaume-Couture (25794860), which joins 93 m from the bridge
 *   end, gets its own ramp (LEG) from that junction down to grade.
 * Steepest grade ROAD_H / (RAMP - (VTOP + VFOOT) / 2): 20.0 % north, 21.5 % south, twice the 12 % aimed at
 * for a flat-map ramp: the 48 m deck (published clearance) has to reach grade within 241-258 m of the
 * bridge ends, between the clifftop junctions. Visual choice, not survey.
 */
export const RAMP_NORTH = 258;
export const SOUTH_FOOT = [-71.2842104, 46.7396488];
export const VTOP = 24;
export const VFOOT = 12;

/** Cross-section (lateral metres, + = west). Mapped: the roadway is 9.17 m wide (OSM width), the CN track
 * centre 8.0-8.3 m west of the roadway's and the walkway 5.8-6.7 m east of it. Estimated: the two trusses 26.8 m
 * (88 ft) apart, the east truss just outside the walkway, so the track runs near the bridge's centre
 * line (where the two original tracks ran) and the roadway in the east half. */
export const ROAD_HALF = 9.17 / 2;
export const ROAD_EDGES = [[-ROAD_HALF, ROAD_HALF]];
export const TRUSS_E = -8.0;
export const TRUSS_W = TRUSS_E + 26.8;
export const AXIS_D = (TRUSS_E + TRUSS_W) / 2;
export const RAIL_D = 8.2;
export const WALK = [-7.0, -5.0];

// ---- The alignment --------------------------------------------------------------------------------
const K = mercStretch(SPEC.origin[1]);
/** Plane metres, x east, y NORTH (latitude stretch removed at the origin). */
const plane = ([lng, lat]) => [lngToMercX(lng) / K, latToMercY(lat) / K];
const unplane = ([x, y]) => [mercXToLng(x * K), mercYToLat(y * K)];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Douglas-Peucker: keep the vertices that bend the line by more than `tol` metres. */
function simplify(line, tol) {
  const keep = new Uint8Array(line.length); keep[0] = keep[line.length - 1] = 1;
  const stack = [[0, line.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop(), a = line[i], ab = sub(line[j], a), L = len(ab);
    let worst = -1, w = 0;
    for (let k = i + 1; k < j; k++) { const d = Math.abs(ab[0] * (line[k][1] - a[1]) - ab[1] * (line[k][0] - a[0])) / L; if (d > w) { w = d; worst = k; } }
    if (w > tol) { keep[worst] = 1; stack.push([i, worst], [worst, j]); }
  }
  return line.filter((_, i) => keep[i]);
}

/** The mapped bridge ends (the roadway way's end nodes) and the straight axis between them. */
export const BRIDGE_ENDS = [plane(alignment.bridge.line[0]), plane(alignment.bridge.line.at(-1))];
const [EN, ES] = BRIDGE_ENDS;
/** Mid-span: centred on the mapped bridge (no pier is mapped; the published spans then put the north
 * main pier ~80 m out in the river and the south one on the south shore, as in the photographs). */
const MID = lerp(EN, ES, 0.5);
const full = simplify([...[...alignment.north.line].reverse().map(plane).slice(0, -1), EN, ES, ...alignment.south.line.map(plane).slice(1)], 0.2);
const stations = (() => { const s = [0]; for (let i = 1; i < full.length; i++) s.push(s[i - 1] + len(sub(full[i], full[i - 1]))); return s; })();
const at = (s) => { let i = 1; while (i < full.length - 1 && stations[i] < s) i++; return lerp(full[i - 1], full[i], (s - stations[i - 1]) / (stations[i] - stations[i - 1])); };
function stationOf(p) {
  let best = 0, dist = Infinity;
  for (let i = 1; i < full.length; i++) {
    const a = full[i - 1], ab = sub(full[i], a), L = len(ab), t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / (L * L)));
    const d = len(sub(p, lerp(a, full[i], t)));
    if (d < dist) { dist = d; best = stations[i - 1] + t * L; }
  }
  return best;
}
// Clip the ends: the north ramp RAMP_NORTH long beyond its bridge end, the south one ending at SOUTH_FOOT.
const sN = stationOf(EN), sS = stationOf(ES);
const START = sN - RAMP_NORTH, END = stationOf(plane(SOUTH_FOOT));
/** The south ramp's length beyond the bridge end (241.2 m). */
export const RAMP_SOUTH = END - sS;
if (START < 0 || END > stations.at(-1)) throw new Error('pont-de-quebec: an approach road is shorter than its ramp');
const clipped = [at(START), ...full.filter((_, i) => stations[i] > START + 0.5 && stations[i] < END - 0.5), at(END)];
const centerline = clipped.map(unplane);

/** Stations on the final alignment (north end = 0). */
const shift = (s) => s - START;
export const BRIDGE_START = shift(sN);
export const BRIDGE_END = shift(sS);
export const MID_S = shift(stationOf(MID));
/** Where a mapped way crosses the (unclipped) alignment: [station, sine of the crossing angle], or null. */
function crossing(line) {
  const lat = (q) => { let best = null, dd = Infinity;
    for (let i = 1; i < full.length; i++) { const a = full[i - 1], ab = sub(full[i], a), L2 = dot(ab, ab), t = Math.max(0, Math.min(1, dot(sub(q, a), ab) / L2)), d = len(sub(q, lerp(a, full[i], t)));
      if (d < dd) { dd = d; best = { s: stations[i - 1] + t * Math.sqrt(L2), d: (ab[0] * (q[1] - a[1]) - ab[1] * (q[0] - a[0])) / Math.sqrt(L2), dir: [ab[0] / Math.sqrt(L2), ab[1] / Math.sqrt(L2)] }; } }
    return best; };
  const pts = line.map(plane);
  for (let i = 1; i < pts.length; i++) {
    const a = lat(pts[i - 1]), c = lat(pts[i]);
    if (Math.sign(a.d) === Math.sign(c.d) || Math.abs(a.d) + Math.abs(c.d) > 200) continue;
    const k = a.d / (a.d - c.d), v = sub(pts[i], pts[i - 1]);
    return [shift(a.s + (c.s - a.s) * k), Math.abs(v[0] * a.dir[1] - v[1] * a.dir[0]) / len(v)];
  }
  return null;
}
/** Stations occupied by the mapped roads passing under this alignment (Route Marie-Victorin, westbound one
 * lane and eastbound two lanes: 4 m and 5.5 m half-widths) and by Boulevard Champlain's overpass above it
 * (three lanes and a sidewalk: 7.5 m), across Route 175's width and skew. */
const occupied = (line, half) => { const [s, sin] = crossing(line), cos = Math.sqrt(1 - sin * sin), w = half / sin + ROAD_HALF * cos / sin; return [s - w, s + w]; };
export const UNDER_S = alignment.under.lines.map((line, i) => occupied(line, [4, 5.5][i]));
export const OVER_S = alignment.over.lines.map((line) => occupied(line, 7.5));
/** Mid-span (the model origin) in lng/lat, for the tests. */
export const MID_LNGLAT = unplane(MID);

// ---- Two vertical profiles: the flat-map compromise and the real deck -------------------------------
const flatKnots = (length) => [[0, 'start'], [BRIDGE_START, ROAD_H], [BRIDGE_END, ROAD_H], [length, 'end']];
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges', terrainPolicy: SPEC.terrainPolicy,
  width: 2 * ROAD_HALF, roadEdges: ROAD_EDGES, centerline,
  palette: PALETTES.light,
  profile: ({ length }) => flatKnots(length),
});
const L = base.BRIDGE_LENGTH;
/** The normalised flat-map ramp over `ramp` metres: 0 at the foot (x = 0), 1 at the bridge end (x = 1);
 * a constant grade between a VFOOT-long parabolic vertical curve at the foot and a VTOP-long one at the top. */
export function rampShape(x, ramp) {
  const u = Math.max(0, Math.min(1, x)) * ramp, G = 1 / (ramp - (VTOP + VFOOT) / 2);
  if (u < VFOOT) return G * u * u / (2 * VFOOT);
  if (u > ramp - VTOP) return 1 - G * (ramp - u) ** 2 / (2 * VTOP);
  return G * (u - VFOOT / 2);
}
/**
 * Full 3D world ('absolute-deck'): the real deck is ROAD_H between the mapped bridge ends; Route 175
 * leaves both ends at the clifftops and climbs into Sainte-Foy and Lévis, so beyond the ends the real
 * road follows the ground 0.6 m above it, through the highest of five AWS Terrarium (z15) DEM samples
 * across the roadway (d = -6..+6 m) every 20 m, as [metres out from the bridge end, height], read once at authoring time
 * (tmp/quebec/pont-de-quebec/real-approach.mjs; docs/3d-quebec-pont-de-quebec.md). The layer still never
 * lets the deck dip below the DEM along the alignment (bridge-layer.js). Interpolated by a monotone
 * cubic and ending on the terrain roads ('start'/'end'). One exception: 20 m from the north end the
 * DEM samples climb the cliff edge's smoothing (50.0 m on the centreline, 50.8 m at the west kerb); the
 * profile takes the centreline + 0.5 m there (50.5 m) so the road leaves the abutment at ~15 %, not 23 %.
 */
export const REAL_APPROACH = {
  north: [[20, 50.5], [40, 53.7], [60, 55.9], [80, 56.7], [100, 58.4], [120, 60.5], [140, 61.7], [160, 61.7], [180, 61.5], [200, 61.7], [220, 61.8], [240, 60.5], [260, 60.6], [280, 60.6], [300, 59.2], [320, 58.8], [340, 58], [360, 58.3], [380, 58], [400, 57], [420, 56.8], [440, 55.9], [460, 54.9], [480, 54.7], [500, 53.7], [520, 52.8], [540, 52.3]],
  south: [[20, 50.6], [40, 50.6], [60, 50.7], [80, 50.7], [100, 50.6], [120, 50.7], [140, 50.6], [160, 50.7], [180, 50.7], [200, 50.7], [220, 51], [240, 52.9], [260, 55.7], [280, 57.9], [300, 57.9], [320, 55], [340, 52.8], [360, 51.9], [380, 51.6], [400, 50.5], [420, 50.6], [440, 50.6], [460, 50.7]],
};
/** REAL_APPROACH as stations on this alignment, the knots within 10 m of a ramp foot left to 'start'/'end'. */
export const REAL_KNOTS = {
  north: REAL_APPROACH.north.filter(([d]) => d < BRIDGE_START - 10).map(([d, y]) => [BRIDGE_START - d, y]).reverse(),
  south: REAL_APPROACH.south.filter(([d]) => d < L - BRIDGE_END - 10).map(([d, y]) => [BRIDGE_END + d, y]),
};
const realCache = new Map();
function realProfile(a, b) {
  const key = `${a.toFixed(3)},${b.toFixed(3)}`;
  let r = realCache.get(key);
  if (r) return r;
  const pts = [[0, a], ...REAL_KNOTS.north, [BRIDGE_START, ROAD_H], [BRIDGE_END, ROAD_H], ...REAL_KNOTS.south, [L, b]];
  // Fritsch-Carlson monotone cubic slopes
  const n = pts.length, d = pts.slice(1).map((q, i) => (q[1] - pts[i][1]) / (q[0] - pts[i][0])), m = new Array(n);
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]);
  r = { pts, m };
  if (realCache.size > 64) realCache.clear();
  realCache.set(key, r);
  return r;
}
/** Marks an approach pair as the real-height surface (Full 3D world): see layer.js. */
export const realSurface = (approaches) => Object.assign([...approaches], { real: true });
/**
 * The deck surface at station s, chosen by the argument (the Pont Pierre-Laporte's convention):
 * - no `approaches`: the AUTHORED surface the GLB is built on (the flat-map profile at grade 0);
 * - a plain [a, b] (Cityscape): the flat-map ramps, ends at the loaded approach roads;
 * - realSurface([a, b]) (Full 3D world): the real deck, ends at the terrain roads.
 * The shared fit moves each vertex by deckHeight(s, approaches) - deckHeight(s).
 */
function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(L, s));
  if (approaches.real) {
    const { pts, m } = realProfile(approaches[0], approaches[1]);
    let lo = 0, hi = pts.length - 1;
    while (hi - lo > 1) { const k = (lo + hi) >> 1; if (pts[k][0] <= s) lo = k; else hi = k; }
    const [x0, y0] = pts[lo], [x1, y1] = pts[hi], w = x1 - x0, t = (s - x0) / w;
    return (2 * t ** 3 - 3 * t * t + 1) * y0 + (t ** 3 - 2 * t * t + t) * w * m[lo] + (-2 * t ** 3 + 3 * t * t) * y1 + (t ** 3 - t * t) * w * m[hi];
  }
  if (s <= BRIDGE_START) return approaches[0] + (ROAD_H - approaches[0]) * rampShape(s / BRIDGE_START, RAMP_NORTH);
  if (s >= BRIDGE_END) return approaches[1] + (ROAD_H - approaches[1]) * rampShape((L - s) / (L - BRIDGE_END), RAMP_SOUTH);
  return ROAD_H;
}
const bridgePoint = (station, lateral = 0, height = null) => base.bridgePoint(station, lateral, height ?? deckHeight(station));

// ---- The leg: the northbound branch of Boulevard Guillaume-Couture (Cityscape only) -------------------
/**
 * OSM 25794860 (one lane, northbound, "175 Nord") joins Route 175 93 m beyond the south bridge end, where
 * the flat-map ramp is still ~31 m up. On the flat map it gets its own ramp: from the junction (t = 0) to
 * LEG_MERGE metres out it lies on the main ramp's surface extended sideways (the two run side by side
 * there, so a car changing from one to the other sees one surface), over the next LEG_BLEND metres it
 * blends into its own profile, which eases from the main ramp's grade to a gentler constant one and
 * reaches grade LEG_FOOT_GAP metres before its mapped start (the junction with Route Marie-Victorin and
 * the Guillaume-Couture carriageway, which stays at grade). Frame: t along the branch from the junction
 * outward, lateral u + to the right of that direction. Full 3D world: the real branch runs at grade on
 * the clifftop, so the leg is not owned there and its meshes are hidden (layer.js).
 */
export const LEG_HALF = 3.0;
export const LEG_MERGE = 25;
export const LEG_BLEND = 25;
export const LEG_FOOT_GAP = 10;
const LEG_LINE = [...alignment.joins.lines[0]].reverse().map(([lng, lat]) => base.bridgeLocal(lng, lat));
{ let t = 0; LEG_LINE.forEach((v, i) => { if (i) t += Math.hypot(v.x - LEG_LINE[i - 1].x, v.z - LEG_LINE[i - 1].z); v.t = t; }); }
const LEG_JOIN_S = base.projectBridge(LEG_LINE[0].x, LEG_LINE[0].z).s;
/** Length along the branch to where the leg reaches grade. */
const LEG_END = LEG_LINE.at(-1).t - LEG_FOOT_GAP;
/** The main ramp's surface at a local point (its station's deck height). */
const mainSurface = (x, z, approaches) => deckHeight(base.projectBridge(x, z).s, approaches);
/** Normalised descent of the leg's own profile, every metre from LEG_MERGE (1) to LEG_END (0): the grade
 * eases linearly from the main surface's (along the branch) to a constant one over 30 m, then to 0 over a
 * VFOOT-long curve at the foot. */
const LEG_SHAPE = (() => {
  const c = (t) => { const q = legPoint(t); return mainSurface(q.x, q.z); };
  const H = c(LEG_MERGE), G1 = c(LEG_MERGE - 1) - H;
  const run = LEG_END - LEG_MERGE, G2 = (H - 15 * G1) / (run - 30 - VFOOT / 2 + 15);
  const grade = (u) => (u < 30 ? G1 + (G2 - G1) * u / 30 : u < run - VFOOT ? G2 : G2 * (run - u) / VFOOT);
  const out = [1]; let y = H;
  for (let u = 0; u < Math.ceil(run); u++) { y -= (grade(u) + grade(Math.min(run, u + 1))) / 2 * Math.min(1, run - u); out.push(Math.max(0, y / H)); }
  out[out.length - 1] = 0;
  return out;
})();
/** The leg's own profile at t >= LEG_MERGE (level across the branch). */
function legProfile(t, approaches = [0, 0]) {
  const q = legPoint(LEG_MERGE), H = mainSurface(q.x, q.z, approaches), foot = approaches[1];
  const u = Math.max(0, Math.min(LEG_SHAPE.length - 1, t - LEG_MERGE)), i = Math.floor(u), f = u - i;
  const k = LEG_SHAPE[i] + (LEG_SHAPE[Math.min(LEG_SHAPE.length - 1, i + 1)] - LEG_SHAPE[i]) * f;
  return foot + (H - foot) * k;
}
/** The leg's road surface at a local point (Cityscape; GLB authoring with no `approaches`). */
function legSurface(x, z, approaches = [0, 0]) {
  const t = legProject(x, z).t;
  if (t <= LEG_MERGE) return mainSurface(x, z, approaches);
  const k = Math.min(1, (t - LEG_MERGE) / LEG_BLEND), w = k * k * (3 - 2 * k);
  return (w < 1 ? mainSurface(x, z, approaches) * (1 - w) : 0) + legProfile(t, approaches) * w;
}
/** Project a local point on the branch: { t, u (lateral, + right of outward travel), tx, tz, distance, beyond }. */
function legProject(x, z) {
  let best = null;
  for (let i = 1; i < LEG_LINE.length; i++) {
    const a = LEG_LINE[i - 1], c = LEG_LINE[i], len = c.t - a.t, tx = (c.x - a.x) / len, tz = (c.z - a.z) / len;
    const raw = (x - a.x) * tx + (z - a.z) * tz, along = Math.max(0, Math.min(len, raw));
    const ex = x - a.x - tx * along, ez = z - a.z - tz * along, distance = Math.hypot(ex, ez);
    if (!best || distance < best.distance) best = { t: a.t + along, u: -tz * ex + tx * ez, tx, tz, distance, beyond: (i === 1 && raw < -0.001) || (i === LEG_LINE.length - 1 && raw > len + 0.001) };
  }
  return best;
}
/** A point on the branch: t along, u lateral (+ right of outward travel); local x/z and the tangent. */
function legPoint(t, u = 0) {
  t = Math.max(0, Math.min(LEG_LINE.at(-1).t, t));
  let i = 1; while (i < LEG_LINE.length - 1 && LEG_LINE[i].t < t) i++;
  const a = LEG_LINE[i - 1], c = LEG_LINE[i], len = c.t - a.t, k = (t - a.t) / len, tx = (c.x - a.x) / len, tz = (c.z - a.z) / len;
  return { x: a.x + (c.x - a.x) * k - tz * u, z: a.z + (c.z - a.z) * k + tx * u, tx, tz };
}
const legBounds = { minX: Math.min(...LEG_LINE.map((v) => v.x)) - LEG_HALF, maxX: Math.max(...LEG_LINE.map((v) => v.x)) + LEG_HALF,
  minZ: Math.min(...LEG_LINE.map((v) => v.z)) - LEG_HALF, maxZ: Math.max(...LEG_LINE.map((v) => v.z)) + LEG_HALF };
/** Cityscape: the leg's height at a local point travelling along `heading` (null off it, past its foot or across it). */
function legRoadHeight(x, z, heading, approaches) {
  if (approaches?.real) return null;
  if (x < legBounds.minX - 10 || x > legBounds.maxX + 10 || z < legBounds.minZ - 10 || z > legBounds.maxZ + 10) return null;
  const q = legProject(x, z);
  if (q.beyond || q.t >= LEG_END || Math.abs(q.u) > LEG_HALF + 0.6) return null;
  if (Number.isFinite(heading)) { const h = heading * Math.PI / 180; if (Math.abs(Math.sin(h) * q.tx - Math.cos(h) * q.tz) < 0.8) return null; }
  return legSurface(x, z, approaches);
}
export const LEG = { line: LEG_LINE, joinS: LEG_JOIN_S, end: LEG_END, length: LEG_LINE.at(-1).t, profile: legProfile, surface: legSurface, project: legProject, point: legPoint, roadHeight: legRoadHeight };

/** The shared bridgeRoadHeight with this profile's two surfaces, plus the leg on the flat map. */
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  const p = base.bridgeLocal(lng, lat), b = base.bounds;
  const leg = () => legRoadHeight(p.x, p.z, heading, approaches);
  if (p.x < b.minX - 10 || p.x > b.maxX + 10 || p.z < b.minZ - 10 || p.z > b.maxZ + 10) return leg();
  const q = base.projectBridge(p.x, p.z);
  if (q.beyond || !base.roadEdges(q.s, joins, sections).some(([lo, hi]) => q.lateral >= lo - 0.6 && q.lateral <= hi + 0.6)) return leg();
  if (Number.isFinite(heading)) { const h = heading * Math.PI / 180; if (Math.abs(Math.sin(h) * q.tx - Math.cos(h) * q.tz) < 0.8) return leg(); }
  return deckHeight(q.s, approaches);
}
/**
 * Road ownership: only Route 175. The CN track (8.0-8.3 m west) and the walkway (5.8-6.7 m east) run on the same
 * structure, so the provider corridor is the roadway plus 0.9 m (bridge-roads.js: halfWidth + margin =
 * 5.5 m), and HD pavement is claimed only within the roadway plus 0.8 m.
 */
export const OWNERSHIP_MARGIN = 0.9;
function ownsPoint(x, z) {
  const q = base.projectBridge(x, z);
  return !q.beyond && q.lateral >= -ROAD_HALF - 0.8 && q.lateral <= ROAD_HALF + 0.8;
}

export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight, ownsPoint, ownershipMargin: OWNERSHIP_MARGIN };
export default PROFILE;
