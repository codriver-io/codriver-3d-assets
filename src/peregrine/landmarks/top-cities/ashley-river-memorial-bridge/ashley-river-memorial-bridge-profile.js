import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import mapped from './ashley-river-memorial-bridge-alignment.js';

// Preserve the approved structural grade and all 528.10 m of the original span.
export const HALF_LENGTH = 264.05;
export const height = x => 7 - 2.2 * (Math.abs(x + 46.15) / 310.2) ** 1.5;
const grade = x => -3.3 / 310.2 * Math.sign(x + 46.15) * Math.sqrt(Math.abs(x + 46.15) / 310.2);
const frame = createBridgeProfile({ ...SPEC, width: 14.1, roadEdges: [[-5.5, 5.5]],
  centerline: mapped.road, profile: ({ length }) => [[0, 0], [length, 0]] });
const distance = (a, b) => { const p = frame.bridgeLocal(...a), q = frame.bridgeLocal(...b); return Math.hypot(q.x - p.x, q.z - p.z); };
function head(line, metres) {
  const out = [line[0]]; let total = 0;
  for (let i = 1; i < line.length; i++) {
    const d = distance(line[i - 1], line[i]);
    if (total + d >= metres) { out.push(line[i - 1].map((v, k) => v + (line[i][k] - v) * (metres - total) / d)); return out; }
    total += d; out.push(line[i]);
  }
  return out;
}
const west = head(mapped.west, 100);
// Entire at-grade east link, stopping at the next provider viaduct. No ownership beyond it.
export const CENTERLINE = [...west.slice(1).reverse(), ...mapped.road, ...mapped.east.slice(1)];
export const START = 100, END = START + frame.BRIDGE_LENGTH;
export const station = x => START + (x + HALF_LENGTH) * frame.BRIDGE_LENGTH / (2 * HALF_LENGTH);
export const structuralX = s => (s - START) * 2 * HALF_LENGTH / frame.BRIDGE_LENGTH - HALF_LENGTH;

// Constant grade, with 10 m parabolic vertical curves at either end. Match the approved
// span's end derivative as well as its height, without flattening or shortening an arch.
export function ramp(s, length, y0, y1, m0, m1) {
  const c = 10, m = (y1 - y0 - (m0 + m1) * c / 2) / (length - c);
  if (s < c) return y0 + m0 * s + (m - m0) * s * s / (2 * c);
  if (s > length - c) { const u = length - s; return y1 - m1 * u - (m - m1) * u * u / (2 * c); }
  return y0 + (m0 + m) * c / 2 + m * (s - c);
}
const base = createBridgeProfile({ ...SPEC, modelDir: 'bridges', palette: PALETTES.light,
  width: 14.1, roadEdges: [[-5.5, 5.5]], centerline: CENTERLINE,
  terrainPolicy: 'absolute-deck', clipStandardEnds: true, buildingFootprints: FOOTPRINTS,
  // No separate building tags at the four houses in the captured OSM extract. The exact
  // Memorial outline masks provider bridge/tower parts and never crosses onto Legare.
  profile: ({ length }) => [[0, 'start'], [START, height(-HALF_LENGTH)], [station(-46.15), 7], [END, height(HALF_LENGTH)], [length, 'end']],
});
export function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(base.BRIDGE_LENGTH, s));
  if (s < START) return ramp(s, START, approaches[0], height(-HALF_LENGTH), 0, grade(-HALF_LENGTH));
  if (s > END) return ramp(s - END, base.BRIDGE_LENGTH - END, height(HALF_LENGTH), approaches[1], grade(HALF_LENGTH), 0);
  return height(structuralX(s));
}
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  if (base.bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) === null) return null;
  const q = base.bridgeLocal(lng, lat);
  return deckHeight(base.projectBridge(q.x, q.z).s, approaches);
}
// A shared mitred cross-section at each mapped bend prevents either road edge opening
// between the previous and next segment. Centres remain exactly on the OSM polyline.
const normals = base.ALIGNMENT.map((v, i, line) => {
  const normal = (a, b) => { const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz); return [-dz / l, dx / l]; };
  const a = normal(line[Math.max(0, i - 1)], line[Math.max(1, i)]);
  const b = normal(line[Math.min(line.length - 2, i)], line[Math.min(line.length - 1, i + 1)]);
  const scale = 1 + a[0] * b[0] + a[1] * b[1];
  return [(a[0] + b[0]) / scale, (a[1] + b[1]) / scale];
});
function bridgePoint(s, d = 0, y = null) {
  s = Math.max(0, Math.min(base.BRIDGE_LENGTH, s));
  const q = base.bridgePoint(s, 0, y ?? deckHeight(s));
  let i = 1; while (i < base.ALIGNMENT.length - 1 && base.ALIGNMENT[i].s < s) i++;
  const a = base.ALIGNMENT[i - 1], b = base.ALIGNMENT[i], t = (s - a.s) / (b.s - a.s);
  q.x += d * (normals[i - 1][0] + (normals[i][0] - normals[i - 1][0]) * t);
  q.z += d * (normals[i - 1][1] + (normals[i][1] - normals[i - 1][1]) * t);
  return q;
}
export const PROFILE = { ...base, deckHeight, bridgeRoadHeight,
  bridgePoint,
  // The three-lane concrete/bascule deck is rigid, even when HD samples are fragmentary.
  fittedLateral: (s, d) => d,
  ownershipMargin: 0.5,
  ownsPoint(x, z) { const q = base.projectBridge(x, z); return !q.beyond && Math.abs(q.lateral) <= 7.55; },
};

// The east-bank one-lane feeder joins the same southbound structure (OSM 631693898).
// Use the current High Level / Cambie partitioned-road precedent: independent ground
// at its free end, and an explicitly linked main-deck datum at the merge.
const forkLine = mapped.fork.slice();
let lo = 0, hi = 1;
const fa = forkLine.at(-2), fb = forkLine.at(-1);
for (let i = 0; i < 40; i++) {
  const t = (lo + hi) / 2, q = base.bridgeLocal(fa[0] + (fb[0] - fa[0]) * t, fa[1] + (fb[1] - fa[1]) * t);
  if (base.projectBridge(q.x, q.z).lateral < -5.5) lo = t; else hi = t;
}
forkLine[forkLine.length - 1] = fa.map((v, i) => v + (fb[i] - v) * (lo + hi) / 2);
export const FORK_JOIN = base.stationAt(forkLine.at(-1));
const forkBase = createBridgeProfile({ ...SPEC, palette: PALETTES.light, modelDir: 'bridges',
  centerline: forkLine, width: 4, roadEdges: [[-1.8, 1.8]], terrainPolicy: 'absolute-deck',
  clipStandardEnds: true, profile: ({ length }) => [[0, 'start'], [length, 'end']] });
export const FORK_LENGTH = forkBase.BRIDGE_LENGTH;
const forkHeight = (s, a = [0, deckHeight(FORK_JOIN)]) => ramp(Math.max(0, Math.min(FORK_LENGTH, s)), FORK_LENGTH, a[0], a[1], 0, 0);
// In the final 40 m the feeder joins the main pavement's actual plane, including
// its longitudinal grade across the skewed mouth. Geometry and navigation use this alike.
export function feederSurface(x, z, a) {
  const q = forkBase.projectBridge(x, z), main = base.projectBridge(x, z);
  const t = Math.max(0, Math.min(1, (q.s - (FORK_LENGTH - 40)) / 40)), blend = t * t * (3 - 2 * t);
  const target = deckHeight(main.s, a?.main) + (a?.mainGround?.bankYAt(main.s) || 0) / base.STRETCH;
  return forkHeight(q.s, a) * (1 - blend) + target * blend;
}
const forkDeck = (s, a) => { const q = forkBase.bridgePoint(s, 0); return feederSurface(q.x, q.z, a); };
export const FORK = { ...forkBase, key: 'fork', deckHeight: forkDeck,
  bridgePoint: (s, d = 0, y = null) => forkBase.bridgePoint(s, d, y ?? forkDeck(s)),
  fittedLateral: (s, d) => d, ownershipMargin: .2,
  bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
    if (forkBase.bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) === null) return null;
    const q = forkBase.bridgeLocal(lng, lat); return feederSurface(q.x, q.z, approaches);
  },
};
PROFILE.key = 'main';
export const PROFILES = [PROFILE, FORK];
const mainResample = PROFILE.resampleBridgeLine;
PROFILE.resampleBridgeLine = line => FORK.resampleBridgeLine(mainResample(line));
