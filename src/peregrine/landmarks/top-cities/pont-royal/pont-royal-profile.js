// One metric frame for the Pont Royal: the straight structural axis (arches, piers, cutwaters)
// and the road centreline that carries the car, route and HD pavement over it.
import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { SOUTH, MERGE, SPLIT, NORTH } from './pont-royal-alignment.js';

// Structural axis: the mapped carriageway MERGE -> SPLIT (bearing 26.1 deg). u is metres along it
// from MERGE (north-north-east), d metres across it (+ upstream, east-south-east).
const axis = createBridgeProfile({ ...SPEC, width: 17, roadEdges: [[-5, 5]], centerline: [MERGE, SPLIT], profile: ({ length }) => [[0, 0], [length, 0]] });
const A0 = axis.ALIGNMENT[0], A1 = axis.ALIGNMENT[1], AXIS_LENGTH = axis.BRIDGE_LENGTH;
const TX = (A1.x - A0.x) / AXIS_LENGTH, TZ = (A1.z - A0.z) / AXIS_LENGTH;
export const axisPoint = (u, d = 0) => ({ x: A0.x + TX * u - TZ * d, z: A0.z + TZ * u + TX * d });
export const axisUV = (x, z) => { const dx = x - A0.x, dz = z - A0.z; return { u: dx * TX + dz * TZ, d: -TZ * dx + TX * dz }; };
export const AXIS = { TX, TZ, length: AXIS_LENGTH };

// Sourced (fr.wikipedia, Pont Royal (Paris), from the 1685 specification): five three-centred
// basket arches of 64, 69, 72, 69, 64 feet (20.80, 22.42, 23.40, 22.42, 20.80 m), rise one third
// of the opening, piers 14 feet (4.55 m). Centred on the mean of the four mapped pier noses of OSM
// way 176396894 (u = 13.98, 41.41, 70.05, 97.82); each sourced pier lands within 1.1 m of its nose.
export const SPANS = [20.80, 22.42, 23.40, 22.42, 20.80];
export const PIER_W = 4.55;
export const U_CENTRE = 55.81;
const TOTAL = SPANS.reduce((a, b) => a + b, 0) + PIER_W * (SPANS.length - 1);
export const U_SPRING_S = U_CENTRE - TOTAL / 2, U_SPRING_N = U_CENTRE + TOTAL / 2;
export const ARCHES = []; export const PIERS = [];
{ let u = U_SPRING_S; SPANS.forEach((span, i) => { ARCHES.push({ a: u, c: u + span, mid: u + span / 2, half: span / 2, rise: span / 3 }); u += span; if (i < SPANS.length - 1) { PIERS.push(u + PIER_W / 2); u += PIER_W; } }); }
// Abutment ends at the mapped flares' quay corners (OSM outline u = -9.2..-9.9 and 121.6..122.4).
export const U_END_S = -9.6, U_END_N = 122.0;
// Parapet line flares from the straight faces to the quay (mapped flares start at u = 1.0 / 111.8
// and open to 16-19 m). West (downstream) / east (upstream) half-widths at each quay corner, kept
// a little inside the mapped corners but wide enough for the carriageway as it turns off the axis.
export const U_FLARE_S = 1.0, U_FLARE_N = 111.7;
export const FLARE_END = { s: [15.0, 13.0], n: [18.5, 15.0] };
// Measured on the IGN orthophoto (2026-10, z19): 17.3-17.5 m over the cornices, ~10 m cobbled
// carriageway, ~3 m walks. Wikipedia/Structurae give 17 m.
export const FACE = 8.35, CORNICE = 8.65, PARAPET_IN = 7.85, ROAD_HALF = 5.0;
// Flat-map datum: y = 0 is the quay street grade. The deck is flush with the quays (0.10 m proud
// of them at the mouths) and the 1685 dos d'âne rises 0.85 m to the crown; the masonry hangs below
// grade towards the river. The Seine stands about at the springing, 7-8 m under the quays (normal
// level ~26.4 m NGF, quays ~33-34 m); RIVER is that level, the arches spring 1 m under it, and the
// piers and quay walls run on to FOOT so in Full 3D world they always end in the riverbed.
// Measured on the reference photographs (Gornet 2009, scaled by the 23.40 m centre opening): the
// crown soffit is ~1.2 m under the walk, cutwater bodies rise ~4.6 m above the springing and the
// chaperon tips stop just under the crowns.
export const DECK = 0.10, HUMP = 0.85;
export const RIVER = -7.2, FOOT = RIVER - 3.0;
export const SPRING_Y = RIVER - 1.0;
export const H_END = DECK, H_CROWN = DECK + HUMP;
export const RING = 0.75; // voussoir head ring, radial depth

// Three-centred arch with 60 deg segments: r1 = a - d/2, r2 = a + d/2, f = a - 0.366 d.
export function archCurve(arch, extra = 0) {
  const a = arch.half, d = (a - arch.rise) / (Math.sin(Math.PI / 3) - 0.5), r1 = a - d / 2, r2 = a + d / 2;
  const c1 = a - r1, c2 = arch.rise - r2;
  return (phi) => phi <= Math.PI / 3 ? [arch.mid + c1 + (r1 + extra) * Math.cos(phi), SPRING_Y + (r1 + extra) * Math.sin(phi)]
    : phi < 2 * Math.PI / 3 ? [arch.mid + (r2 + extra) * Math.cos(phi), SPRING_Y + c2 + (r2 + extra) * Math.sin(phi)]
      : [arch.mid - c1 + (r1 + extra) * Math.cos(phi), SPRING_Y + (r1 + extra) * Math.sin(phi)];
}
/** Angle at which a curve (intrados, or extrados with `extra`) reaches y. */
export function phiAt(arch, y, extra = 0) {
  const a = arch.half, d = (a - arch.rise) / (Math.sin(Math.PI / 3) - 0.5), r1 = a - d / 2;
  return Math.asin(Math.min(1, (y - SPRING_Y) / (r1 + extra)));
}

// ---- Road centreline: mapped nodes with filleted corners, the bridge part on the axis. ----
const local = ll => axis.bridgeLocal(...ll);
function fillet(points, radius) {
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i], a = points[i - 1], b = points[i + 1];
    const la = Math.hypot(p.x - a.x, p.z - a.z), lb = Math.hypot(b.x - p.x, b.z - p.z);
    const ua = { x: (p.x - a.x) / la, z: (p.z - a.z) / la }, ub = { x: (b.x - p.x) / lb, z: (b.z - p.z) / lb };
    const turn = Math.acos(Math.max(-1, Math.min(1, ua.x * ub.x + ua.z * ub.z)));
    if (turn < 0.01) { out.push(p); continue; }
    const r = radius(i), t = Math.min(r * Math.tan(turn / 2), la * 0.45, lb * 0.45), rr = t / Math.tan(turn / 2);
    const s = { x: p.x - ua.x * t, z: p.z - ua.z * t }, sign = Math.sign(ua.x * ub.z - ua.z * ub.x);
    const c = { x: s.x - ua.z * rr * sign, z: s.z + ua.x * rr * sign };
    const a0 = Math.atan2(s.z - c.z, s.x - c.x), n = Math.max(2, Math.ceil(turn / (4 * Math.PI / 180)));
    for (let k = 0; k <= n; k++) { const ang = a0 + sign * turn * k / n; out.push({ x: c.x + rr * Math.cos(ang), z: c.z + rr * Math.sin(ang) }); }
  }
  out.push(points.at(-1));
  return out;
}
// Drop near-collinear mapped nodes (< 6 deg turn) so the fillets get room, then round the corners:
// 18 m where the road joins and leaves the bridge axis and at the two quay corners (32-47 deg
// turns), 30 m on the gentle street kinks.
function simplify(points, keep) {
  const pts = points.slice();
  for (let changed = true; changed;) {
    changed = false;
    for (let i = 1; i < pts.length - 1; i++) {
      if (keep.has(pts[i])) continue;
      const a = pts[i - 1], p = pts[i], b = pts[i + 1];
      const turn = Math.abs(Math.atan2(b.z - p.z, b.x - p.x) - Math.atan2(p.z - a.z, p.x - a.x));
      if (Math.min(turn, 2 * Math.PI - turn) < 6 * Math.PI / 180) { pts.splice(i, 1); changed = true; break; }
    }
  }
  return pts;
}
const merge = local(MERGE), split = local(SPLIT);
const RAW = simplify([...SOUTH.map(local), merge, split, ...NORTH.map(local)], new Set([merge, split]));
const SMOOTH = fillet(RAW, i => { const p = RAW[i]; const { d } = axisUV(p.x, p.z); return p === merge || p === split || Math.abs(d) > 10 ? 18 : 30; });
// The model is the mapped span only: the centreline runs between the two abutment ends (the
// quay corners of the mapped outline). The streets beyond stay ordinary, live roads.
function crossing(line, u) { for (let i = 1; i < line.length; i++) { const a = axisUV(line[i - 1].x, line[i - 1].z).u, b = axisUV(line[i].x, line[i].z).u; if ((a - u) * (b - u) <= 0 && a !== b) { const t = (u - a) / (b - a); return { i, p: { x: line[i - 1].x + (line[i].x - line[i - 1].x) * t, z: line[i - 1].z + (line[i].z - line[i - 1].z) * t } }; } } throw Error('centreline misses the abutment'); }
const cs = crossing(SMOOTH, U_END_S), cn = crossing(SMOOTH, U_END_N);
export const CENTERLINE = [cs.p, ...SMOOTH.slice(cs.i, cn.i), cn.p].map(p => axis.bridgeLngLat(p.x, p.z));

const frame = createBridgeProfile({ ...SPEC, width: 2 * FACE, roadEdges: [[-ROAD_HALF, ROAD_HALF]], centerline: CENTERLINE, profile: ({ length }) => [[0, 0], [length, 0]] });
const sAt = u => frame.stationAt(axis.bridgeLngLat(axisPoint(u).x, axisPoint(u).z));
export const S_END_S = 0, S_END_N = frame.BRIDGE_LENGTH;
// The carriageway sits on the axis between these stations; the hump lives there and the
// flared mouths either side stay level, so the straight structure and the curved road agree.
export const U_HUMP_S = 5.5, U_HUMP_N = 105.5;
const S_HUMP_S = sAt(U_HUMP_S), S_HUMP_N = sAt(U_HUMP_N), S_CROWN = sAt(U_CENTRE);
export const S_OFFSET = S_CROWN - U_CENTRE; // road station of u on the straight part

const BASE = createBridgeProfile({
  ...SPEC, width: 2 * FLARE_END.n[0], roadEdges: [[-ROAD_HALF, ROAD_HALF]], centerline: CENTERLINE,
  modelDir: 'bridges', palette: PALETTES.light, terrainPolicy: 'bank-fit', meshStep: 2, clipStandardEnds: true,
  // The live ground tilts across each mouth (the quay walls and terraces smeared by the DEM), so
  // at both quay ends the deck takes the ground at its own lateral position and eases back to the
  // straight bank-to-bank line by the hump (Pont de la Concorde's crossfall fit).
  lateralBankFit: { blendM: 16 },
  // Full 3D world deck datum: the live ground where each street leaves the mouth (the same
  // terrain the quay roads are draped on). The crossing interpolates bank to bank; no riverbed sample.
  groundControls: ({ length }) => [{ s: 0, sampleS: 0 }, { s: length, sampleS: length }],
  profile: ({ length }) => [[0, 'start'], [length, 'end']],
});
const LENGTH = BASE.BRIDGE_LENGTH;
/** Deck surface: the two quay datums joined straight, 0.10 m proud, level through the flared
 * mouths and a parabolic hump of 0.85 m between them (the dos d'âne of the 1685 deck). */
export function deckHeight(s, ends = [0, 0]) {
  s = Math.max(0, Math.min(LENGTH, s));
  const base = ends[0] + (ends[1] - ends[0]) * s / LENGTH + DECK;
  if (s <= S_HUMP_S || s >= S_HUMP_N) return base;
  const t = s < S_CROWN ? (S_CROWN - s) / (S_CROWN - S_HUMP_S) : (s - S_CROWN) / (S_HUMP_N - S_CROWN);
  return base + HUMP * (1 - t * t);
}
const bridgePoint = (s, d = 0, y = null) => BASE.bridgePoint(s, d, y ?? deckHeight(s));
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  if (BASE.bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) === null) return null;
  const q = BASE.bridgeLocal(lng, lat);
  return deckHeight(BASE.projectBridge(q.x, q.z).s, approaches);
}
// Rigid masonry: the authored width never follows a (possibly fragmentary) live pavement sample.
export const PROFILE = { ...BASE, deckHeight, bridgePoint, bridgeRoadHeight, fittedLateral: (s, d) => d,
  knots: [[0, 'start'], [S_HUMP_S, H_END], [S_CROWN, H_CROWN], [S_HUMP_N, H_END], [LENGTH, 'end']] };

/** Deck surface height at a structural station (flat map). */
export const deckTop = u => u <= U_HUMP_S || u >= U_HUMP_N ? H_END : deckHeight(u + S_OFFSET);
/** Half-width of the parapet line at u, flaring to the quay corners. */
export const flareHalf = (u, side) => { const k = side < 0 ? 0 : 1;
  return u < U_FLARE_S ? FACE + (FLARE_END.s[k] - FACE) * Math.min(1, (U_FLARE_S - u) / (U_FLARE_S - U_END_S))
    : u > U_FLARE_N ? FACE + (FLARE_END.n[k] - FACE) * Math.min(1, (u - U_FLARE_N) / (U_END_N - U_FLARE_N)) : FACE; };
/** World point at structural (u, d) and height y. */
export const xyz = (u, d, y) => { const p = axisPoint(u, d); return [p.x, y, p.z]; };
// The road edges over the structure in (u, d), sampled once from the profile.
const EDGES = [-1, 1].map(side => {
  const out = [];
  for (let s = 0; s <= S_END_N; s += 0.5) { const q = PROFILE.bridgePoint(s, side * PROFILE.roadEdges(s)[0][1]); out.push(axisUV(q.x, q.z)); }
  return out;
});
/** The road edge (side -1 west, +1 east) lateral at structural station u. Where the edge turns
 * off before reaching the quay line (the inner edge of the curve), it runs on along its last
 * direction, so the walk beside it never jumps back across the carriageway. */
export function roadEdgeD(u, side) {
  const e = EDGES[side < 0 ? 0 : 1];
  for (let i = 1; i < e.length; i++) if ((e[i - 1].u - u) * (e[i].u - u) <= 0 && e[i].u !== e[i - 1].u) return e[i - 1].d + (e[i].d - e[i - 1].d) * (u - e[i - 1].u) / (e[i].u - e[i - 1].u);
  const [a, c] = u > U_CENTRE ? [e.at(-2), e.at(-1)] : [e[1], e[0]];
  if ((u - c.u) * (c.u - a.u) > 0 && Math.abs(c.u - a.u) > 1e-6) return c.d + (c.d - a.d) * (u - c.u) / (c.u - a.u);
  return side * ROAD_HALF;
}
