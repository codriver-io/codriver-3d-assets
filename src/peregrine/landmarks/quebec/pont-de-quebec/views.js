import { PROFILE as p } from './pont-de-quebec-profile.js';
import { ROAD_H, MAIN_S, ANCHOR_S, MID_S, AXIS_D, BRIDGE_START } from './pont-de-quebec-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written as (station along the roadway from the north end, lateral + west, height above the water) so
// they follow the bridge's 157.6 degree axis.
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const [MN, MS] = MAIN_S;

export const VIEWS = {
  // From the north shore downstream (east), low over the water: the north anchor arm, the main post,
  // the cantilever and the suspended span beyond (the classic three-quarter view).
  overview: [pt(MN - 260, -420, 40), pt(MID_S - 60, AXIS_D, 55)],
  // Broadside from downstream (east): the whole cantilever silhouette.
  facade: [pt(MID_S, -1150, 50), pt(MID_S, AXIS_D, 55)],
  // From above the north main post looking south along the deck.
  roof: [pt(MN - 200, -160, 210), pt(MN + 160, AXIS_D, 60)],
  // A driver southbound on Route 175 entering at the north anchor portal.
  deck: [pt(ANCHOR_S[0] - 45, -1.5, ROAD_H + 1.6), pt(ANCHOR_S[0] + 60, -1.0, ROAD_H + 12)],
  // Under the deck at the north main pier: the V of the bottom chords on the shoe.
  underside: [pt(MN + 70, -90, 14), pt(MN, AXIS_D, 35)],
  // The north main post close, from upstream at deck height.
  tower: [pt(MN - 70, 150, 75), pt(MN, AXIS_D, 70)],
  // The north end: abutment, approach spans and the anchor pier with its end portal (as photograph 1).
  approach: [pt(BRIDGE_START - 60, -110, 85), pt(ANCHOR_S[0] + 30, AXIS_D, 50)],
  // The suspended span from the river, upstream (west): the camel-back between the tips.
  span: [pt(MID_S, 520, 20), pt(MID_S, AXIS_D, 60)],
  // At night (use with the dark theme).
  night: [pt(MID_S - 700, -900, 90), pt(MID_S, AXIS_D, 60)],
};
