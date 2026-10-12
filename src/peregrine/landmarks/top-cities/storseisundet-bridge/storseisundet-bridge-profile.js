import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, STRUCTURAL_ENDPOINTS, OUTLINE } from './storseisundet-bridge-mapped.js';
const raw = createBridgeProfile({ ...SPEC, width: 7.4, centerline: CENTERLINE,
  roadEdges: [[-3.1, 3.1]], profile: ({length}) => [[0,0],[length,0]] });
export const STRUCTURE = STRUCTURAL_ENDPOINTS.map(ll => raw.stationAt(ll));
export const CROWN = (STRUCTURE[0]+STRUCTURE[1])/2;
export const PIERS = [CROWN-65, CROWN+65];
export const DECK = 25.2;
export const HALF = 3.7;
const shared = createBridgeProfile({
  ...SPEC, palette: PALETTES.light, centerline: CENTERLINE, width: 7.4,
  roadEdges: [[-3.1, 3.1]], terrainPolicy: 'absolute-deck', lateralBankFit: { terrainClamp: true, clearanceM: 0.12 },
  buildingFootprints: [OUTLINE], clipStandardEnds: true,
  profile: ({length}) => [[0,'start'],[STRUCTURE[0],13],[CROWN,DECK],[STRUCTURE[1],13],[length,'end']],
});
// Clamped cubic vertical alignment: continuous grade and curvature through the
// abutments and crown, rather than four independent ease curves with flat shelves.
// Keep this landmark-specific so other bridge profiles remain unchanged.
const xs = [0, STRUCTURE[0], CROWN, STRUCTURE[1], shared.BRIDGE_LENGTH];
const ys = [0, 13, DECK, 13, 0];
const hs = xs.slice(1).map((x, i) => x - xs[i]);
const curvature = (() => {
  const n = xs.length, a = Array(n).fill(0), b = Array(n).fill(0), c = Array(n).fill(0), r = Array(n).fill(0);
  b[0] = 2 * hs[0]; c[0] = hs[0]; r[0] = 6 * (ys[1] - ys[0]) / hs[0];
  for (let i = 1; i < n - 1; i++) {
    a[i] = hs[i - 1]; b[i] = 2 * (hs[i - 1] + hs[i]); c[i] = hs[i];
    r[i] = 6 * ((ys[i + 1] - ys[i]) / hs[i] - (ys[i] - ys[i - 1]) / hs[i - 1]);
  }
  a[n - 1] = hs[n - 2]; b[n - 1] = 2 * hs[n - 2]; r[n - 1] = -6 * (ys[n - 1] - ys[n - 2]) / hs[n - 2];
  for (let i = 1; i < n; i++) { const t = a[i] / b[i - 1]; b[i] -= t * c[i - 1]; r[i] -= t * r[i - 1]; }
  const m = Array(n); m[n - 1] = r[n - 1] / b[n - 1];
  for (let i = n - 2; i >= 0; i--) m[i] = (r[i] - c[i] * m[i + 1]) / b[i];
  return m;
})();
function deckHeight(station, approaches = [0, 0]) {
  const s = Math.max(0, Math.min(shared.BRIDGE_LENGTH, station)); let i = 0;
  while (i < xs.length - 2 && xs[i + 1] < s) i++;
  const u = (xs[i + 1] - s) / hs[i], v = 1 - u;
  // Endpoint fitting cannot move the cantilever span or its supports.
  const ramp = s < STRUCTURE[0] ? [0, s / STRUCTURE[0]]
    : s > STRUCTURE[1] ? [1, (shared.BRIDGE_LENGTH - s) / (shared.BRIDGE_LENGTH - STRUCTURE[1])] : null;
  const join = ramp ? approaches[ramp[0]] * (1 - ramp[1] ** 2 * (3 - 2 * ramp[1])) : 0;
  return join + u * ys[i] + v * ys[i + 1]
    + ((u ** 3 - u) * curvature[i] + (v ** 3 - v) * curvature[i + 1]) * hs[i] ** 2 / 6;
}
export const PROFILE = {
  ...shared, deckHeight,
  bridgePoint: (s, d = 0, y = null) => shared.bridgePoint(s, d, y ?? deckHeight(s)),
  bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
    const height = shared.bridgeRoadHeight(lng, lat, heading, approaches, joins, sections);
    if (height === null) return null;
    const p = shared.bridgeLocal(lng, lat), s = shared.projectBridge(p.x, p.z).s;
    return height + deckHeight(s, approaches) - shared.deckHeight(s, approaches);
  },
};
// Variable-depth cantilever box, not a separate arch: deep at the pier roots.
export function boxDepth(s) {
  if(s<STRUCTURE[0] || s>STRUCTURE[1]) return 0.48;
  const dist=Math.min(...PIERS.map(t=>Math.abs(t-s)));
  return 2.05 + 5.35 * Math.max(0,1-dist/65)**2;
}
