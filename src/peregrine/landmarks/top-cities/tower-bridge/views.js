import { PROFILE as P, TOWER_S, CENTRE_S } from './tower-bridge-profile.js';
const at=(s,d,y)=>{const q=P.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS = {
  overview: [at(CENTRE_S-125,-300,135),at(CENTRE_S,0,23)],
  facade: [at(CENTRE_S,-370,70),at(CENTRE_S,0,26)],
  back: [at(CENTRE_S+80,300,95),at(CENTRE_S,0,25)],
  roof: [at(CENTRE_S,0,430),at(CENTRE_S,0,0)],
  deck: [at(TOWER_S[0]-26,-1.8,10.3),at(TOWER_S[0]+45,0,17)],
  underside: [at(CENTRE_S,-62,2.0),at(TOWER_S[1],0,14)],
  tower: [at(TOWER_S[0]-40,-56,43),at(TOWER_S[0],0,42)],
};
