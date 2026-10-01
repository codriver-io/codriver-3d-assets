import alignment from './golden-gate-bridge-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';

// One metric frame for the Golden Gate Bridge: station s runs SOUTH TO NORTH (San Francisco to
// Marin), lateral d is positive to the RIGHT of travel (east, the northbound carriageway). The
// bridge is mapped as two one-way carriageways ~9.2 m apart; the alignment is their average,
// made exactly straight between pylon S2 and pylon N1 on the line through the two mapped tower
// centres, and continued along both carriageways of US 101 beyond the bridge ends (the toll plaza
// and Presidio Parkway to the south, Redwood Highway to the north) for the flat-map ramps.
// Geometry, the car, the route, the camera and the HD pavement share it (bridge-profile.js).

/** Road surface at the towers, m above local y = 0 (mean high water). Towers 227.4 m above the
 * water and 152 m above the roadway (GGBHTD): 75.4 m. Mid-span clearance 67 m + 7.6 m truss
 * + ~0.9 m floor gives the same; the deck is authored level across all three suspension spans. */
export const DECK_H = 75.4;
/** Published spans (GGBHTD): main 4,200 ft, side spans 1,125 ft. */
export const MAIN_SPAN = 1280.2;
export const SIDE_SPAN = 342.9;
/**
 * Flat-map convention (docs/3d-san-francisco-golden-gate-bridge.md): Cityscape has no water and
 * no bluffs, so the deck rises from the approach roads ('start'/'end', measured from the loaded
 * HD road at run time) to DECK_H over RAMP metres, reaching it at pylon S2 (the south end of the
 * Fort Point arch) and leaving it at pylon N1 (the north end of the north side span). The ramps
 * run over the approach viaducts and out along the mapped approach roads. Steepest grade
 * 1.5 * DECK_H / RAMP (smoothstep), 12.6 % at 900 m. Visual choice, not survey.
 */
export const RAMP_SOUTH = 900;
export const RAMP_NORTH = 900;

/** Deck cross-section (lateral metres, + = east). Main cables 90 ft (27.4 m) apart centre to
 * centre; roadway 62 ft (18.9 m) kerb to kerb, three lanes each way with the movable median
 * barrier on the centreline; 10 ft (3.05 m) sidewalks outside the kerbs, inside the cable planes. */
export const CABLE_D = 13.72;
export const KERB = 9.45;
export const BARRIER = 0.3;
export const SIDEWALK = 12.5;
export const DECK_HALF = 14.3;
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

/** A carriageway south to north: its south approach (mapped outward, reversed), the bridge, its north approach. */
const carriageway = (key) => [
  ...[...alignment.south[key].line].reverse(), ...alignment.bridge[key].line.slice(1), ...alignment.north[key].line.slice(1),
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

const st = alignment.structure;
/** Mapped tower centres (mean of the two leg bases) and the line through them. */
export const TOWER_CENTRES = [st.southTower.legs, st.northTower.legs].map((legs) => mean(legs.map(plane)));
const [TS, TN] = TOWER_CENTRES, AXIS = (() => { const v = sub(TN, TS), l = len(v); return [v[0] / l, v[1] / l]; })();
const MID = lerp(TS, TN, 0.5);
const along = (p) => dot(sub(p, MID), AXIS);
const onAxis = (u) => [MID[0] + AXIS[0] * u, MID[1] + AXIS[1] * u];
const PYLON = Object.fromEntries(Object.entries(st.pylons).map(([k, v]) => [k, mean(v.centres.map(plane))]));
const uS2 = along(PYLON.S2), uN1 = along(PYLON.N1);

// The averaged carriageways, every 5 m along the northbound line, then exactly straight from S2 to N1.
const nb = carriageway('northbound'), sb = carriageway('southbound');
const averaged = resample(nb, 5).map((p) => lerp(p, nearestOn(sb, p), 0.5));
const south = averaged.filter((p) => along(p) < uS2 - 2), north = averaged.filter((p) => along(p) > uN1 + 2);
const full = simplify([...south, onAxis(uS2), onAxis(uN1), ...north], 0.2);
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
// Clip the ends so the ramps are exactly RAMP_SOUTH / RAMP_NORTH long.
const S2_FULL = stationOf(onAxis(uS2)), N1_FULL = stationOf(onAxis(uN1));
const START = S2_FULL - RAMP_SOUTH, END = N1_FULL + RAMP_NORTH;
if (START < 0 || END > stations.at(-1)) throw new Error('golden-gate-bridge: an approach road is shorter than its ramp');
const clipped = [at(START), ...full.filter((_, i) => stations[i] > START + 0.5 && stations[i] < END - 0.5), at(END)];
const centerline = clipped.map(unplane);

/** Stations on the final alignment (south end = 0). */
const shift = (s) => s - START;
export const MID_S = shift(stationOf(MID));
export const TOWER_S = [MID_S - MAIN_SPAN / 2, MID_S + MAIN_SPAN / 2];
/** Side spans end at pylons S1 and N1 (the published 1,125 ft each). */
export const S1 = TOWER_S[0] - SIDE_SPAN;
export const N1 = TOWER_S[1] + SIDE_SPAN;
/** Pylon S2 (the south end of the Fort Point arch) and N2 (the north end of the north anchorage), as mapped. */
export const S2 = shift(S2_FULL);
export const N2 = shift(stationOf(PYLON.N2));
/** The mapped bridge ways' ends: the south abutment at the toll plaza, the north abutment. */
export const BRIDGE_START = shift(stationOf(mean([alignment.bridge.northbound.line[0], alignment.bridge.southbound.line[0]].map(plane))));
export const BRIDGE_END = shift(stationOf(mean([alignment.bridge.northbound.line.at(-1), alignment.bridge.southbound.line.at(-1)].map(plane))));
/** Mapped positions, for the tests: tower centres and pylon pairs as stations. */
export const MAPPED = {
  towers: TOWER_CENTRES.map((p) => shift(stationOf(p))),
  pylons: Object.fromEntries(Object.entries(PYLON).map(([k, p]) => [k, shift(stationOf(p))])),
  /** Mid-span (the model origin) in lng/lat. */
  mid: unplane(MID),
};

// ---- Road edges along the approaches -----------------------------------------------------------------
// On the bridge the carriageways are 9.2 m apart and the authored edges are ROAD_EDGES. On the
// approach roads they separate (20-29 m apart through the toll plaza and on the Presidio Parkway),
// so the authored edges there follow each mapped carriageway's offset from the averaged centreline,
// +/- APPROACH_HALF; the car, the route and the HD pavement are owned where they really run.
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
      if (d < dist) { dist = d; best = [shift(stationOf(f)), (ab[1] * (q[0] - f[0]) - ab[0] * (q[1] - f[1])) / L]; }
    }
    if (best && dist < 40) rows.push(best);
  }
  return rows.sort((u, v) => u[0] - v[0]);
};
const table = { 1: offsets('northbound'), 0: offsets('southbound') };
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
  const n = offsetAt(1, s), w = offsetAt(0, s);
  const mapped = [[w - APPROACH_HALF, Math.min(-BARRIER, w + APPROACH_HALF)], [Math.max(BARRIER, n - APPROACH_HALF), n + APPROACH_HALF]];
  return ROAD_EDGES.map((e, side) => e.map((v, i) => mix(v, mapped[side][i])));
}

export const PROFILE = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, modelDir: 'bridges', terrainPolicy: SPEC.terrainPolicy,
  width: 2 * DECK_HALF, roadEdges: ROAD_EDGES, roadEdgesAt, centerline,
  palette: PALETTES.light,
  // The deck is level from pylon S2 to pylon N1 and eases to the approach roads beyond.
  profile: ({ length }) => [[0, 'start'], [S2, DECK_H], [N1, DECK_H], [length, 'end']],
});

export default PROFILE;
