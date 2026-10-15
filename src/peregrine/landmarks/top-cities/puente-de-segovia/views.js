// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). y = 0 is the
// bank-street grade; the river is RIVER (-9.2 m) below it.
import { PROFILE as p, START, END, MID, PIERS, ARCHES, CENTER, HALF, DECK_H, RIVER } from './puente-de-segovia-profile.js';
const v = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [+q.x.toFixed(2), +y.toFixed(2), +q.z.toFixed(2)]; };
const r = (y) => RIVER + y; // heights above the river
export const VIEWS = {
  overview: [v(START + 10, 115, 40), v(MID, CENTER, r(4))],
  facade: [v(MID, 175, r(7)), v(MID, CENTER, r(5))], // downstream (south): rounded cutwaters
  back: [v(MID, -170, r(7)), v(MID, CENTER, r(5))], // upstream (north): pointed cutwaters
  roof: [v(MID, CENTER, 230), v(MID, CENTER, r(0))],
  deck: [v(START + 2, -2, DECK_H + 3.5), v(MID, 0, DECK_H + 1)],
  underside: [v(ARCHES[4].mid + 2, 32, r(2.2)), v(ARCHES[4].mid - 1, CENTER, r(5))],
  tower: [v(PIERS[3] + 14, -CENTER - HALF - 16, r(5)), v(PIERS[3], -HALF, r(4))], // pier and pointed cutwater
  detail: [v(PIERS[4] - 12, CENTER + HALF + 14, r(6)), v(PIERS[4], CENTER + HALF, r(5))], // rounded cutwater, rings, finials
  street: [v(START + 8, CENTER + HALF + 34, r(1.7)), v(MID, CENTER + HALF, r(4.5))], // river path, like ref 1
  approach: [v(END, 1, 1.6), v(MID, 1, 1.2)], // a driver at the east joint, level with the street
};

