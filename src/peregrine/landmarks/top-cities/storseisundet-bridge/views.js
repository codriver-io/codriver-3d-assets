import { PROFILE as p, STRUCTURE, CROWN, PIERS } from './storseisundet-bridge-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
export const VIEWS = {
  overview: [[-330,235,480],[0,12,0]],
  facade: [q(CROWN,300,40),q(CROWN,0,13)],
  back: [q(CROWN,-300,40),q(CROWN,0,13)],
  roof: [[0,900,10],[0,0,0]],
  deck: [q(STRUCTURE[0]-25,-1.5,p.deckHeight(STRUCTURE[0]-25)+1.7),q(CROWN,0,26)],
  eastApproach: [q(STRUCTURE[1]+45,1.4,p.deckHeight(STRUCTURE[1]+45)+1.7),q(CROWN,0,24)],
  underside: [q(CROWN,60,6),q(CROWN,0,17)],
  tower: [q(PIERS[0]-16,33,10),q(PIERS[0],0,13)],
  detail: [q(CROWN-13,12,28),q(CROWN,0,25)],
};
