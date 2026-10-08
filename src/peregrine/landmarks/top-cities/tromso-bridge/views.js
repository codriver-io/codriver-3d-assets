import { PROFILE as p, CREST, LENGTH as L } from './tromso-bridge-profile.js';
const pt = (s, d, y) => { const q = p.bridgePoint(s, d); return [q.x, y, q.z]; };
export const VIEWS = {
  overview: [pt(CREST - 160, 920, 100), pt(CREST, 0, 22)],
  facade: [pt(CREST, 1000, 75), pt(CREST, 0, 20)],
  back: [pt(CREST, -1000, 75), pt(CREST, 0, 20)],
  roof: [pt(CREST, 20, 1250), pt(CREST, 0, 0)],
  deck: [pt(CREST - 110, 1.5, p.deckHeight(CREST - 110) + 1.7), pt(CREST + 10, 1.5, 41)],
  underside: [pt(CREST - 40, 75, 10), pt(CREST - 25, 0, 27)],
  tower: [pt(CREST - 90, -65, 15), pt(CREST - 40, 0, 24)],
  approach: [pt(L - 65, 65, 15), pt(L - 220, 0, 17)],
};
