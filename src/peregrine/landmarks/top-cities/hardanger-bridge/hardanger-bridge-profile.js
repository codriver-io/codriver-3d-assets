import { createBridgeProfile } from '../../bridge-profile.js';
import { CENTERLINE, BRIDGE_START_LL, BRIDGE_END_LL } from './hardanger-bridge-alignment.js';
import { SPEC, PALETTES } from './config.js';
const base = createBridgeProfile({ ...SPEC, width: 29, palette: PALETTES.light,
  centerline: CENTERLINE, roadEdges: [[-4.25, 4.25]],
  profile: ({ length }) => [[0, 'start'], [length, 'end']],
});
export const START = base.stationAt(BRIDGE_START_LL);
export const END = base.stationAt(BRIDGE_END_LL);
export const MID = (START + END) / 2;
export const TOWERS = [MID - 655, MID + 655];
export const MAIN_SPAN = 1310;
export const DECK_MID = 58.25;
export const DECK_RADIUS = 20000;
export const SADDLE = 200.25;
export const CABLE_D = 9.0;
// Estimated horizontal backstay reach, independent of the truncated tunnel road.
export const BACKSTAY_REACH = 260;
export const ANCHOR_Y = 0.8;
export const ANCHORS = [TOWERS[0] - BACKSTAY_REACH, TOWERS[1] + BACKSTAY_REACH];
// Rock anchorages continue the main-span bearing, rather than curving with roads.
export function cablePoint(s, d = 0, y = cableY(s)) {
  const tower = s < TOWERS[0] ? TOWERS[0] : s > TOWERS[1] ? TOWERS[1] : null;
  if (tower === null) return base.bridgePoint(s, d, y);
  const axis = base.bridgePoint(MID), q = base.bridgePoint(tower);
  return { x: q.x + axis.tx * (s - tower) - axis.tz * d,
    y, z: q.z + axis.tz * (s - tower) + axis.tx * d, tx: axis.tx, tz: axis.tz };
}
export const realSurface = (pair) => Object.assign([...pair], { real: true });
const smooth = (v) => v * v * (3 - 2 * v);
const camber = (s) => DECK_RADIUS - Math.sqrt(DECK_RADIUS ** 2 - (s - MID) ** 2);
const portal = DECK_MID - camber(START);
// Default is the real structural profile; an explicit untagged pair is Cityscape.
function deckHeight(station, approaches) {
  const s = Math.max(0, Math.min(base.BRIDGE_LENGTH, station));
  const real = approaches === undefined || approaches.real;
  const [a, b] = approaches ?? [portal, portal];
  const edge = real ? portal : 4;
  if (s < START) return a + (edge - a) * smooth(s / START);
  if (s > END) return edge + (b - edge) * smooth((s - END) / (base.BRIDGE_LENGTH - END));
  return edge + camber(START) - camber(s);
}
const bridgePoint = (s, d = 0, y = null) => base.bridgePoint(s, d, y ?? deckHeight(s));
function bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) {
  if (base.bridgeRoadHeight(lng, lat, heading, approaches, joins, sections) === null) return null;
  const q = base.bridgeLocal(lng, lat);
  return deckHeight(base.projectBridge(q.x, q.z).s, approaches);
}
export function cableY(s) {
  if (s < TOWERS[0]) return ANCHOR_Y + (SADDLE - ANCHOR_Y) * Math.max(0, (s - ANCHORS[0]) / BACKSTAY_REACH);
  if (s > TOWERS[1]) return ANCHOR_Y + (SADDLE - ANCHOR_Y) * Math.max(0, (ANCHORS[1] - s) / BACKSTAY_REACH);
  const u = (s - TOWERS[0]) / MAIN_SPAN;
  return SADDLE - 4 * (MAIN_SPAN / 10.8) * u * (1 - u);
}
export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight,
  knots: [[0, 'start'], [START, portal], [MID, DECK_MID], [END, portal], [base.BRIDGE_LENGTH, 'end']],
};
// Suppress the world-mode above-ground clamp beneath the mountains.
PROFILE.CHAMPLAIN.tunnels = [[0, START], [END, base.BRIDGE_LENGTH]];
