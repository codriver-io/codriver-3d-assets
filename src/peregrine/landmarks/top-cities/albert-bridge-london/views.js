import { PROFILE as P, TOWER_S, CENTRE_S, BOOTH_S } from './albert-bridge-london-profile.js';
// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// Lateral d is west of the road; negative d looks from the east (downstream) side.
const at = (s, d, y) => { const q = P.bridgePoint(s, d, y); return [q.x, q.y, q.z]; };
export const VIEWS = {
  overview: [at(CENTRE_S - 110, -125, 48), at(CENTRE_S, 0, 12)],
  facade: [at(CENTRE_S, -205, 12), at(CENTRE_S, 0, 14)],
  back: [at(CENTRE_S + 50, 175, 22), at(CENTRE_S, 0, 13)],
  roof: [at(CENTRE_S - 30, -40, 260), at(CENTRE_S, 0, 0)],
  deck: [at(BOOTH_S[0] - 14, 1.2, 2.2), at(TOWER_S[0] + 10, 0, 12)],
  underside: [at(TOWER_S[0] + 30, -45, 1.5), at(CENTRE_S, 0, 5)],
  tower: [at(TOWER_S[1] + 28, -30, 16), at(TOWER_S[1], 0, 20)],
  booth: [at(BOOTH_S[1] + 12, -12, 3.5), at(BOOTH_S[1], -6, 2.5)],
};
