// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
import { xyz, U_CENTRE, PIERS, U_END_S, U_END_N, RIVER } from './pont-royal-profile.js';
// Heights are authored above the river level (y = 0 is the quay grade, RIVER below it).
const v = (u, d, y) => xyz(u, d, y + RIVER);
const mid = U_CENTRE;
export const VIEWS = {
  overview: [v(mid - 95, -120, 45), v(mid, 0, 4)],
  facade: [v(mid, -125, 7), v(mid, 0, 4.5)], // downstream (west) face, looking upstream
  back: [v(mid, 125, 7), v(mid, 0, 4.5)], // upstream (east) face
  roof: [v(mid, 0, 230), v(mid, 0, 0)],
  deck: [v(U_END_S - 22, -3, 9.5), v(mid, 0, 8)],
  underside: [v(PIERS[1] + 6, -32, 1.5), v(PIERS[1] + 6, 0, 5)],
  tower: [v(PIERS[0] + 9, -20, 4), v(PIERS[0], -9, 3)],
  detail: [v(PIERS[0] + 5.5, -14.5, 2.2), v(PIERS[0], -10.5, 1.6)],
  south: [v(U_END_S - 45, -30, 14), v(U_END_S + 10, 0, 6)],
  north: [v(U_END_N + 40, 32, 14), v(U_END_N - 10, 0, 6)],
};
