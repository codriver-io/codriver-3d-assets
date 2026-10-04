import { PROFILE as p } from './pont-dubuc-profile.js';
import { h, BRIDGE_START, BRIDGE_END, CREST_S, P1, RIVER_PIERS, STEEL_END } from './pont-dubuc-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written as (station along Route 175 from the south foot, lateral + east, height above the river) so they
// follow the bridge's 20.7 degree axis. Upstream is west (-d).
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const [P2, P3, P4, P5, , P7] = RIVER_PIERS;

export const VIEWS = {
  // From the water upstream of pier P2, low: the piers marching away to Chicoutimi-Nord under the green
  // box (photograph 2's angle; nearer the south end the flat-map ramp is too low to compare).
  overview: [pt(P2 - 45, -48, 4), pt(P5, 0, 8)],
  // Broadside from upstream (west), on the water: the seven spans and six piers.
  facade: [pt(CREST_S, -250, 9), pt(CREST_S, 0, 7)],
  // From above the west side looking along the deck.
  roof: [pt(P2 - 70, -120, 75), pt(P5, 0, 6)],
  // A driver northbound in the right lane on the crest.
  deck: [pt(P3 - 20, 5.9, h(P3 - 20) + 1.5), pt(P5, 4, h(P5) + 1.5)],
  // Under the deck beside pier P3: the box, the brackets and the fascia girders.
  underside: [pt(P3 - 18, -16, 2.5), pt(P3 + 25, 0, 8.5)],
  // Pier P3 close, from upstream at the waterline (photograph 2's near piers).
  tower: [pt(P3 - 16, -24, 3), pt(P3, 0, 6)],
  // The south end: the concrete end pier P1 under the box, which tapers out towards the abutment and the solid ramp.
  abutment: [pt(P1 + 10, -40, 6), pt(P1 - 10, 0, 2)],
  // The north end, from downstream: the last pier and the ramp down to Route 172.
  north: [pt(P7 - 30, 45, 8), pt(STEEL_END - 20, 0, 2)],
  // Broadside from downstream (east), long: the far-LOD silhouette at 1 km.
  far: [pt(CREST_S + 200, 950, 60), pt(CREST_S, 0, 6)],
  // At night (use with the dark theme): the lamp line.
  night: [pt(P2 - 60, -260, 25), pt(P5, 0, 10)],
};
export const PIER_S = [P1, ...RIVER_PIERS];
export { BRIDGE_END };
