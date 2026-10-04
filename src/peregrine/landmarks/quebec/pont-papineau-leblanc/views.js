import { PROFILE as p } from './pont-papineau-leblanc-profile.js';
import { h, PYLON_S, MID_S, STAYED_START, STAYED_END, BRIDGE_START, BRIDGE_END, pylonTop } from './pont-papineau-leblanc-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written as (station along the A-19 from the Laval ramp foot, lateral + south-west, height above the water)
// so they follow the bridge's 142.5 degree axis. Upstream is south-west (+d).
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const [PN, PS] = PYLON_S;

export const VIEWS = {
  // From the Laval bank downstream, low over the water: both pylons and their fans (photograph 3's side).
  overview: [pt(PN - 260, -330, 18), pt(MID_S + 40, 0, 20)],
  // Broadside from upstream (south-west), from the water: the whole three-span silhouette (photograph 2).
  facade: [pt(MID_S, 620, 8), pt(MID_S, 0, 22)],
  // From above the north pylon looking along the deck towards Montréal.
  roof: [pt(PN - 120, -70, 90), pt(MID_S + 40, 0, 15)],
  // A driver southbound in the middle lane approaching the north pylon (photograph 1's road).
  deck: [pt(BRIDGE_START - 40, 7.1, h(BRIDGE_START - 40) + 1.6), pt(PN + 60, 3, h(PN) + 12)],
  // Under the deck at the north pylon: the box girder, the cantilever ribs and the round pier.
  underside: [pt(PN - 35, 40, 3), pt(PN + 10, 0, 8)],
  // The south pylon and its fan, close, from downstream at deck height (photograph 4).
  tower: [pt(PS, -95, 14), pt(PS, 0, pylonTop(PS) - 16)],
  // The Laval end: the ramp, the abutment, the end span and the north side span.
  abutment: [pt(BRIDGE_START - 30, 70, 14), pt(STAYED_START + 30, 0, 6)],
  // The Montréal end: the south side span, the end pier and the ramp down to grade.
  approach: [pt(BRIDGE_END + 70, -80, 16), pt(STAYED_END - 40, 0, 6)],
  // A driver northbound in the middle lane, mid-span, towards the north pylon.
  span: [pt(MID_S + 60, -7.1, h(MID_S) + 1.6), pt(PN, -2, h(PN) + 14)],
  // At night (use with the dark theme).
  night: [pt(MID_S - 120, -520, 30), pt(MID_S, 0, 18)],
};
