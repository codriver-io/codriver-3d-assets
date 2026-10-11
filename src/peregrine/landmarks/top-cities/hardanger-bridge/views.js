import { PROFILE as p, START, MID, END, TOWERS, ANCHORS, cablePoint } from './hardanger-bridge-profile.js';
const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const C = (s,d,y) => { const q=cablePoint(s,d,y); return [q.x,y,q.z]; };
export const VIEWS = {
  northAnchorage: [C((ANCHORS[0]+TOWERS[0])/2, -500, 180), C((ANCHORS[0]+TOWERS[0])/2, 0, 95)],
  southAnchorage: [C((ANCHORS[1]+TOWERS[1])/2, 500, 180), C((ANCHORS[1]+TOWERS[1])/2, 0, 95)],
  overview: [P(MID, -1650, 530), P(MID, 0, 100)],
  facade: [P(MID, 1650, 300), P(MID, 0, 105)],
  roof: [P(MID, -600, 1600), P(MID, 0, 50)],
  deck: [P(TOWERS[0] - 24, 0, p.deckHeight(TOWERS[0]) + 3), P(MID, 0, 75)],
  underside: [P(MID, 160, 5), P(MID, 0, 55)],
  tower: [P(TOWERS[0] + 115, 150, 140), P(TOWERS[0], 0, 130)],
  portals: [P(START + 20, 25, 60), P(START - 8, -2, 51)],
  opposite: [P(END - 20, -25, 60), P(END + 8, -2, 51)],
};
