import { PROFILE as p } from './pont-pierre-laporte-profile.js';
import { h, TOWER_S, ANCHOR_S, VIADUCT_END } from './pont-pierre-laporte-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written as (station along the roadway from the north end, lateral + west, height above the water) so
// they follow the bridge's 157.6 degree axis.
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const [TN, TS] = TOWER_S, MID = (TN + TS) / 2;

export const VIEWS = {
  // From the north shore upstream (west), low over the water, as in the classic photographs with the
  // Pont de Québec behind: the north tower close, the span sweeping to the south tower.
  overview: [pt(TN - 330, 380, 30), pt(TN + 260, 0, 62)],
  // Broadside from upstream (west): both towers, the cable curves and the deep truss.
  facade: [pt(MID, 1050, 45), pt(MID, 0, 62)],
  // From above the north tower looking south along the deck: lanes, barrier, cables, lamps.
  roof: [pt(TN - 220, 120, 230), pt(TN + 200, 0, 60)],
  // A driver southbound in the right lane approaching the north tower: the arched portal and the cables.
  deck: [pt(TN - 240, 5.5, h(TN) + 1.6), pt(TN + 40, 0, h(TN) + 30)],
  // Under the deck at the south tower: the arched strut, the trusses and the lateral bracing.
  underside: [pt(TS + 90, -50, 22), pt(TS, 0, 46)],
  // The north tower close, from the north-west at deck height: legs, grooves, portal and strut.
  tower: [pt(TN - 150, 110, 80), pt(TN, 0, 80)],
  // The north end: the side span over the cliff, the anchorage and the approach girder.
  approach: [pt(ANCHOR_S[0] - 160, -170, 70), pt(ANCHOR_S[0] + 40, 0, 40)],
  // The south end: the anchorage and the Marie-Victorin viaduct.
  south: [pt(VIADUCT_END + 80, 200, 60), pt(ANCHOR_S[1] + 30, 0, 40)],
  // At night the lamps and the tower lights (use with the dark theme).
  night: [pt(MID - 900, -900, 120), pt(MID, 0, 70)],
};
