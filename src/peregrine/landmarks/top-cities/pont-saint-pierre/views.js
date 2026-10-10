import { PROFILE as p, STRUCTURE_START as A, STRUCTURE_END as Z, PIER_S, DECK_CENTER as C } from './pont-saint-pierre-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
const mid=(A+Z)/2;
export const VIEWS = {
  overview: [q(A-15,125,64),q(mid,C,4)],
  facade: [q(mid,205,24),q(mid,C,5)],
  back: [q(mid,-205,28),q(mid,C,5)],
  roof: [q(mid,35,225),q(mid,C,4)],
  deck: [q(A+8,C, p.deckHeight(A+8)+2.0),q(mid,C,9)],
  underside: [q(PIER_S[1]-24,C,2.4),q(PIER_S[1]+20,C,6)],
  tower: [q(PIER_S[1]-13,28,13),q(PIER_S[1],C+7.5,7)],
  detail: [q(mid-8,18,13),q(mid,C+6.3,11)],
};
