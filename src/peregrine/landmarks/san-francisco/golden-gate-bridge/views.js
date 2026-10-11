import { PROFILE as p } from './golden-gate-bridge-profile.js';
import { h, TOWER_S, S1, S2, N1, ARCH, BRIDGE_START } from './golden-gate-bridge-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written as (station along the roadway from the south end, lateral + east, height above the water)
// so they follow the bridge's 354.7 degree axis.
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const [TS, TN] = TOWER_S, MID = (TS + TN) / 2;

export const VIEWS = {
  // A three-quarter from the north-west (Marin side, over the water): both towers, the sweep and the approaches.
  overview: [pt(MID + 1100, -1900, 420), pt(MID - 60, 0, 95)],
  // Broadside from the bay (east): towers, cable curves, the truss and the Fort Point arch.
  facade: [pt(MID, 2300, 70), pt(MID, 0, 100)],
  // From above the north tower looking south along the deck: lanes, barrier, sidewalks, cables.
  roof: [pt(TN + 260, 160, 330), pt(TN - 200, 0, 90)],
  // A driver northbound in the right lane approaching the south tower: the portal and the cables.
  deck: [pt(TS - 260, 5, h(TS) + 1.6), pt(TS + 40, 0, h(TS) + 40)],
  // Under the deck near the north tower: the open truss, bottom laterals and the X-bracing.
  underside: [pt(TN + 120, 70, 40), pt(TN - 60, 0, 66)],
  // The south tower close, from the south-west at deck height: legs, recesses, portal struts and brackets.
  tower: [pt(TS - 170, -120, 150), pt(TS, 0, 150)],
  // The Fort Point arch between pylons S2 and S1, from the west at the fort's level.
  arch: [pt((S1 + S2) / 2 - 40, -190, 30), pt((S1 + S2) / 2, 0, 40)],
  // The south approach: viaduct bents, the anchorage and the flat-map ramp down to the toll plaza.
  approach: [pt(BRIDGE_START - 150, 260, 90), pt(BRIDGE_START + 120, 0, 50)],
  // The north end: pylon N1, the north anchorage and the curving north approach.
  north: [pt(N1 + 120, 250, 110), pt(N1 + 60, 0, 60)],
  // At night the lit towers and the deck lamps (use with the dark theme).
  night: [pt(TS - 1100, 1500, 160), pt(MID - 100, 0, 110)],
};
