import alignment from './pont-pierre-laporte-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the Pont Pierre-Laporte: station s runs NORTH TO SOUTH (Québec to Lévis),
// lateral d is positive to the RIGHT of southbound travel (west, the southbound carriageway). The
// bridge is mapped as two straight one-way carriageways ~10 m apart; the alignment is their average,
// exactly straight between the two anchorages, centred on the mapped bridge (no tower is mapped),
// and continued along both carriageways of the A-73 beyond the bridge ends (Autoroute Henri-IV to
// the north; the Marie-Victorin approach viaduct, Autoroute Robert-Cliche and the Pont Risi to the
// south) for the flat-map ramps. Geometry, the car, the route, the camera and the HD pavement share
// it (bridge-profile.js).

/** Road surface over the suspended spans, m above local y = 0 (mean high water). Published: 45.7 m
 * (150 ft) clearance at mid-span and towers 122.5 m (402 ft) above mean high water; the truss and floor
 * below the road (8.3 m) are estimated from photographs. The deck is authored level from anchorage to
 * anchorage, which also matches the two clifftops it joins (DEM 54-60 m at both bridge ends). */
export const DECK_H = 54.0;
/** Published spans: main 667.5 m (2,190 ft), side spans 186.5 m (612 ft), 1,040.6 m between anchorages. */
export const MAIN_SPAN = 667.5;
export const SIDE_SPAN = 186.5;
/**
 * Flat-map convention (docs/3d-quebec-pont-pierre-laporte.md): Cityscape has no river and no cliffs,
 * so the deck rises from the approach roads ('start'/'end', the loaded road at run time) to DECK_H over
 * RAMP metres, reaching it at each anchorage. Steepest grade 1.5 * DECK_H / RAMP (smoothstep), 10.1 %
 * at 800 m. Visual choice, not survey.
 */
export const RAMP_NORTH = 800;
export const RAMP_SOUTH = 800;

/** Deck cross-section (lateral metres, + = west). Cable planes 27.4 m (90 ft) apart, roadway 21.9 m
 * (72 ft) between kerbs: three lanes each way either side of a concrete median barrier. The stiffening
 * trusses stand in the cable planes. */
export const CABLE_D = 13.7;
export const KERB = 10.95;
export const BARRIER = 0.3;
export const DECK_HALF = 14.0;
export const ROAD_EDGES = [[-KERB, -BARRIER], [BARRIER, KERB]];

// ---- The alignment --------------------------------------------------------------------------------
const K = mercStretch(SPEC.origin[1]);
/** Plane metres, x east, y NORTH (latitude stretch removed at the origin). */
const plane = ([lng, lat]) => [lngToMercX(lng) / K, latToMercY(lat) / K];
const unplane = ([x, y]) => [mercXToLng(x * K), mercYToLat(y * K)];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const mean = (list) => [list.reduce((n, p) => n + p[0], 0) / list.length, list.reduce((n, p) => n + p[1], 0) / list.length];

/** A carriageway north to south: its north approach (mapped outward, reversed), the bridge, its south approach. */
const carriageway = (key) => [
  ...[...alignment.north[key].line].reverse(), ...alignment.bridge[key].line.slice(1), ...alignment.south[key].line.slice(1),
].map(plane);
function resample(line, step) {
  const out = [line[0]];
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i], n = Math.max(1, Math.ceil(len(sub(b, a)) / step));
    for (let k = 1; k <= n; k++) out.push(lerp(a, b, k / n));
  }
  return out;
}
function nearestOn(line, p) {
  let best = null, dist = Infinity;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], ab = sub(line[i], a), t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / dot(ab, ab)));
    const q = lerp(a, line[i], t), d = len(sub(p, q));
    if (d < dist) { dist = d; best = q; }
  }
  return best;
}
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

/** The mapped bridge ends (mean of the two carriageway end nodes) and the straight axis between them. */
const br = alignment.bridge;
export const BRIDGE_ENDS = [mean([br.northbound.line[0], br.southbound.line[0]].map(plane)), mean([br.northbound.line.at(-1), br.southbound.line.at(-1)].map(plane))];
const [EN, ES] = BRIDGE_ENDS, AXIS = (() => { const v = sub(ES, EN), l = len(v); return [v[0] / l, v[1] / l]; })();
/** Mid-span: centred on the mapped bridge (the towers are not mapped; both stand at the water's edge). */
const MID = lerp(EN, ES, 0.5);
const along = (p) => dot(sub(p, MID), AXIS);
const onAxis = (u) => [MID[0] + AXIS[0] * u, MID[1] + AXIS[1] * u];
const HALF = MAIN_SPAN / 2 + SIDE_SPAN;   // mid-span to each anchorage

// The averaged carriageways every 5 m along the southbound line, exactly straight between the bridge ends.
const nbLine = carriageway('northbound'), sbLine = carriageway('southbound');
const averaged = resample(sbLine, 5).map((p) => lerp(p, nearestOn(nbLine, p), 0.5));
const uN = along(EN), uS = along(ES);
const north = averaged.filter((p) => along(p) < uN - 2), south = averaged.filter((p) => along(p) > uS + 2);
const full = simplify([...north, onAxis(uN), onAxis(uS), ...south], 0.2);
const stations = (() => { const s = [0]; for (let i = 1; i < full.length; i++) s.push(s[i - 1] + len(sub(full[i], full[i - 1]))); return s; })();
const at = (s) => { let i = 1; while (i < full.length - 1 && stations[i] < s) i++; return lerp(full[i - 1], full[i], (s - stations[i - 1]) / (stations[i] - stations[i - 1])); };
/** Station of a plane point projected on the (unclipped) alignment. */
function stationOf(p) {
  let best = 0, dist = Infinity;
  for (let i = 1; i < full.length; i++) {
    const a = full[i - 1], ab = sub(full[i], a), L = len(ab), t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / (L * L)));
    const d = len(sub(p, lerp(a, full[i], t)));
    if (d < dist) { dist = d; best = stations[i - 1] + t * L; }
  }
  return best;
}
// Clip the ends so the ramps are exactly RAMP_NORTH / RAMP_SOUTH long beyond the anchorages.
const MID_FULL = stationOf(MID);
const START = MID_FULL - HALF - RAMP_NORTH, END = MID_FULL + HALF + RAMP_SOUTH;
if (START < 0 || END > stations.at(-1)) throw new Error('pont-pierre-laporte: an approach road is shorter than its ramp');
const clipped = [at(START), ...full.filter((_, i) => stations[i] > START + 0.5 && stations[i] < END - 0.5), at(END)];
const centerline = clipped.map(unplane);

/** Stations on the final alignment (north end = 0). */
const shift = (s) => s - START;
export const MID_S = shift(MID_FULL);
export const TOWER_S = [MID_S - MAIN_SPAN / 2, MID_S + MAIN_SPAN / 2];
/** The anchorages: the side spans end there (published 612 ft each). */
export const ANCHOR_S = [TOWER_S[0] - SIDE_SPAN, TOWER_S[1] + SIDE_SPAN];
/** The mapped bridge ways' ends (north abutment on the Sainte-Foy clifftop, south end at the Lévis
 * clifftop where the Marie-Victorin approach viaduct begins). */
export const BRIDGE_START = shift(stationOf(EN));
export const BRIDGE_END = shift(stationOf(ES));
/** The south approach viaduct over Route Marie-Victorin (OSM P13960, ways 974494215/6): it ends where
 * the mapped carriageways leave the bridge tagging. */
export const VIADUCT_END = shift(stationOf(mean(alignment.viaduct.ends.map(plane))));
/** Mid-span (the model origin) in lng/lat, for the tests. */
export const MID_LNGLAT = unplane(MID);

// ---- Road edges along the approaches -----------------------------------------------------------------
// On the bridge the carriageways are 10.2 m apart and the authored edges are ROAD_EDGES. Beyond it the
// mapped carriageways drift apart (up to 19 m on the Pont Risi), so the authored edges there follow each
// mapped carriageway's offset from the averaged centreline, +/- APPROACH_HALF; the car, the route and the
// HD pavement are owned where they really run (the Golden Gate Bridge's method).
export const APPROACH_HALF = 6.0;
const BLEND = 60;
const offsets = (key) => {
  const rows = [];
  for (const q of resample(carriageway(key), 5)) {
    let best = null, dist = Infinity;
    for (let i = 1; i < clipped.length; i++) {
      const a = clipped[i - 1], ab = sub(clipped[i], a), L = len(ab), t = dot(sub(q, a), ab) / (L * L);
      if (t < 0 || t > 1) continue;
      const f = lerp(a, clipped[i], t), d = len(sub(q, f));
      // lateral + = right of north-to-south travel (west); plane y is north
      if (d < dist) { dist = d; best = [shift(stationOf(f)), -(ab[0] * (q[1] - f[1]) - ab[1] * (q[0] - f[0])) / L]; }
    }
    if (best && dist < 40) rows.push(best);
  }
  return rows.sort((u, v) => u[0] - v[0]);
};
const table = { 0: offsets('northbound'), 1: offsets('southbound') };
const offsetAt = (side, s) => {
  const rows = table[side]; let i = 1;
  while (i < rows.length - 1 && rows[i][0] < s) i++;
  const a = rows[i - 1], b = rows[i], t = Math.max(0, Math.min(1, (s - a[0]) / ((b[0] - a[0]) || 1)));
  return a[1] + (b[1] - a[1]) * t;
};
/** Authored road edges at a station: ROAD_EDGES on the bridge, the mapped carriageways beyond it. */
export function roadEdgesAt(s) {
  const out = s < BRIDGE_START ? BRIDGE_START - s : s > BRIDGE_END ? s - BRIDGE_END : 0;
  if (!out) return ROAD_EDGES;
  const k = Math.min(1, out / BLEND), mix = (a, b) => a + (b - a) * k * k * (3 - 2 * k);
  const e = offsetAt(0, s), w = offsetAt(1, s);
  const mapped = [[e - APPROACH_HALF, Math.min(-BARRIER, e + APPROACH_HALF)], [Math.max(BARRIER, w - APPROACH_HALF), w + APPROACH_HALF]];
  return ROAD_EDGES.map((v, side) => v.map((x, i) => mix(x, mapped[side][i])));
}

// ---- Two vertical profiles: the flat-map compromise and the real deck -------------------------------
const flatKnots = (length) => [[0, 'start'], [ANCHOR_S[0], DECK_H], [ANCHOR_S[1], DECK_H], [length, 'end']];
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges', terrainPolicy: SPEC.terrainPolicy,
  width: 2 * DECK_HALF, roadEdges: ROAD_EDGES, roadEdgesAt, centerline,
  palette: PALETTES.light,
  profile: ({ length }) => flatKnots(length),
});
const L = base.BRIDGE_LENGTH;
/**
 * Full 3D world ('absolute-deck'): the real deck. Between the anchorages and over the Marie-Victorin
 * viaduct (to REAL_LEVEL_END) it is the authored DECK_H; on the approaches the A-73 runs at about the
 * clifftops' level, so the real deck follows the ground. REAL_APPROACH, every 10 m, was read once at
 * authoring time from AWS Terrarium (z15) samples across both carriageways and 1 m beyond their outer
 * edges (roadEdgesAt) every 5 m (tmp/quebec/pont-pierre-laporte/envelope.mjs, smooth.mjs;
 * docs/3d-quebec-pont-pierre-laporte.md): the upper envelope, with grades limited to 8 %, of the first
 * profile (1.0 m over five centreline-area samples every 20 m) and the highest sample + 1.1 m, smoothed
 * over 20 m. It keeps the pavement at least 0.7 m over every sample from 25 m inside each end, and
 * rides over the DEM humps where the real road runs in cuts (up to 3.2 m above the first profile south
 * of the viaduct) instead of climbing them at up to 19 %. The last 25 m at each end blend into the
 * terrain roads ('start'/'end', the DEM on the centreline); layer.js tilts each carriageway there to its
 * own ground. The layer still never lets the deck dip below the DEM along the alignment
 * (bridge-layer.js). Interpolated by a monotone cubic (no overshoot, no flat spots at the samples).
 */
export const REAL_APPROACH = {
  north: [[30, 71.1], [40, 71.2], [50, 71.2], [60, 71.1], [70, 70.9], [80, 70.3], [90, 69.5], [100, 68.7], [110, 67.9], [120, 67.1], [130, 66.3], [140, 65.5], [150, 64.7], [160, 63.9], [170, 63.1], [180, 62.3], [190, 61.5], [200, 60.7], [210, 59.9], [220, 59.1], [230, 58.5], [240, 58.1], [250, 57.7], [260, 57.3], [270, 57], [280, 56.6], [290, 56.3], [300, 56], [310, 55.6], [320, 55.1], [330, 54.6], [340, 54.2], [350, 54.2], [360, 54.2], [370, 54], [380, 53.8], [390, 53.9], [400, 54.1], [410, 54.1], [420, 54.1], [430, 54.2], [440, 54.5], [450, 54.9], [460, 55.2], [470, 55.4], [480, 55.7], [490, 56], [500, 56.2], [510, 56.5], [520, 56.9], [530, 57.1], [540, 57.3], [550, 57.8], [560, 58.5], [570, 59], [580, 59.3], [590, 59.6], [600, 60.1], [610, 60.7], [620, 61.1], [630, 61.2], [640, 61.2], [650, 61.2], [660, 61.2], [670, 60.9], [680, 60.3], [690, 59.5], [700, 58.7], [710, 57.9], [720, 57.1], [730, 56.3], [740, 55.6], [750, 55.1], [760, 54.8], [770, 54.5]],
  south: [[2040, 55.1], [2050, 55.9], [2060, 56.7], [2070, 57.5], [2080, 58.3], [2090, 59], [2100, 59.5], [2110, 59.9], [2120, 60.4], [2130, 60.9], [2140, 61], [2150, 60.6], [2160, 59.8], [2170, 59], [2180, 58.2], [2190, 57.4], [2200, 56.6], [2210, 55.8], [2220, 55], [2230, 54.2], [2240, 53.7], [2250, 53.9], [2260, 54.6], [2270, 55], [2280, 55.1], [2290, 55], [2300, 54.6], [2310, 53.9], [2320, 53.1], [2330, 52.4], [2340, 51.8], [2350, 51.2], [2360, 50.6], [2370, 50], [2380, 49.4], [2390, 48.7], [2400, 48.1], [2410, 47.5], [2420, 46.8], [2430, 46.1], [2440, 45.5], [2450, 44.8], [2460, 44.1], [2470, 43.5], [2480, 42.8], [2490, 42.1], [2500, 41.4], [2510, 40.7], [2520, 40], [2530, 39.4], [2540, 38.7], [2550, 38], [2560, 37.3], [2570, 36.6], [2580, 35.9], [2590, 35.3], [2600, 34.6], [2610, 33.9]],
};
/** The real deck is level to 40 m before the Marie-Victorin viaduct's end, then rises with the road. */
export const REAL_LEVEL_END = VIADUCT_END - 40;
const realCache = new Map();
function realProfile(a, b) {
  const key = `${a.toFixed(3)},${b.toFixed(3)}`;
  let r = realCache.get(key);
  if (r) return r;
  const pts = [[0, a], ...REAL_APPROACH.north, [ANCHOR_S[0], DECK_H], [ANCHOR_S[1], DECK_H], [REAL_LEVEL_END, DECK_H], ...REAL_APPROACH.south, [L, b]];
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
const smooth = (t) => t * t * (3 - 2 * t);
/**
 * The deck surface at station s, chosen by the argument (the Bay Bridge East Span's convention):
 * - no `approaches`: the AUTHORED surface the GLB is built on (the flat-map profile at grade 0);
 * - a plain [a, b] (Cityscape): the flat-map compromise, ends at the loaded approach roads;
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
  const knots = base.knots;
  let i = 1; while (i < knots.length - 1 && knots[i][0] < s) i++;
  const a = knots[i - 1], b = knots[i], t = smooth((s - a[0]) / (b[0] - a[0]));
  const v = (k) => (k[1] === 'start' ? approaches[0] : k[1] === 'end' ? approaches[1] : k[1]);
  return v(a) + (v(b) - v(a)) * t;
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

export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight };
export default PROFILE;
