import { PROFILE, TOWER_S, DECK_H } from './margaret-hunt-hill-bridge-profile.js';
const at=(s,d,y)=>{const p=PROFILE.bridgePoint(s,d,y);return[p.x,p.y,p.z];};
export const VIEWS = {
  overview: [at(TOWER_S-260,270,190),at(TOWER_S,0,48)],
  facade: [at(TOWER_S,-460,75),at(TOWER_S,0,52)],
  back: [at(TOWER_S,460,95),at(TOWER_S,0,50)],
  roof: [[160,660,160],[15,20,-5]],
  deck: [at(TOWER_S-170,9,DECK_H+1.7),at(TOWER_S,0,58)],
  tower: [at(TOWER_S-190,0,72),at(TOWER_S,0,65)],
  detail: [at(TOWER_S-24,38,19),at(TOWER_S,21,15)],
  underside: [at(TOWER_S-44,42,4),at(TOWER_S-30,0,12)],
};
