import { PROFILE as p, MAIN_PIERS, CREST, STRUCTURE_START, STRUCTURE_END, LENGTH } from './viaduc-de-calix-profile.js';
const P=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS = {
  overview: [P(LENGTH/2,-1300,780),P(LENGTH/2,0,16)],
  facade: [P(LENGTH/2,-1250,130),P(LENGTH/2,0,18)],
  back: [P(LENGTH/2,1250,150),P(LENGTH/2,0,18)],
  roof: [P(LENGTH/2,-40,1650),P(LENGTH/2,0,0)],
  deck: [P(CREST-90,-3.4,42),P(CREST+60,-3.4,38)],
  underside: [P(CREST-90,-28,6),P(MAIN_PIERS[0]+30,0,28)],
  tower: [P(MAIN_PIERS[0]-36,-35,12),P(MAIN_PIERS[0],0,20)],
  approach: [P(STRUCTURE_END+45,-52,15),P(STRUCTURE_END-35,0,12)],
  north: [P(STRUCTURE_START+80,-50,16),P(STRUCTURE_START+10,0,12)],
};
