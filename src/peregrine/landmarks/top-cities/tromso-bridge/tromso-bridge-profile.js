import { createBridgeProfile } from '../../bridge-profile.js';
import { CENTERLINE } from './tromso-bridge-alignment.js';
import { SPEC, PALETTES } from './config.js';
export const CREST = 470, TOP = 39.25, MAIN_SPAN = 80;
export const MAIN_PIERS = [CREST - 40, CREST + 40];
export const HALF = 4.15, KERB = 3.0, KNEE = 35, CREST_HALF = 100;
const base = createBridgeProfile({ ...SPEC, clipStandardEnds: true, width: 8.3, roadEdges: [[-KERB, KERB]],
  centerline: CENTERLINE, palette: PALETTES.light,
  profile: ({ length }) => [[0, 'start'], [CREST, TOP], [length, 'end']],
});
export const LENGTH = base.BRIDGE_LENGTH;
// 58 bays: 28 west including 35 m anchor, 80 m main, 29 east including 35 m anchor.
export const PIER_S = [
  ...Array.from({ length: 28 }, (_, i) => i * (MAIN_PIERS[0] - 35) / 27),
  ...MAIN_PIERS,
  ...Array.from({ length: 29 }, (_, i) => MAIN_PIERS[1] + 35 + i * (LENGTH - MAIN_PIERS[1] - 35) / 28),
];
function side(u, run, foot) {
  const grade = (TOP - foot) / (run - KNEE / 2 - CREST_HALF / 2);
  if (u < KNEE) return foot + grade * u * u / (2 * KNEE);
  const x = run - u;
  if (x < CREST_HALF) return TOP - grade * x * x / (2 * CREST_HALF);
  return foot + grade * (u - KNEE / 2);
}
export function deckHeight(s, approaches = [0, 0]) {
  s = Math.max(0, Math.min(LENGTH, s));
  return s <= CREST ? side(s, CREST, approaches[0]) : side(LENGTH - s, LENGTH - CREST, approaches[1]);
}
const bridgePoint = (s, d = 0, y = null) => base.bridgePoint(s, d, y ?? deckHeight(s));
const bridgeRoadHeight = (lng, lat, heading, approaches, joins, sections) => {
  if (base.bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) === null) return null;
  const q = base.bridgeLocal(lng, lat);
  return deckHeight(base.projectBridge(q.x, q.z).s, approaches);
};
export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight, ownershipMargin: 4 };
export function girderDepth(s) {
  return 1.25 + 3.5 * Math.max(...MAIN_PIERS.map(p => Math.max(0, 1 - Math.abs(s - p) / 40) ** 2));
}
