import { PROFILE, ARCH_START, DECK } from './margaret-mcdermott-bridge-profile.js';
const p=(s,d,y)=>{const q=PROFILE.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS={
  overview:[p(210,450,260),p(510,0,40)],
  facade:[p(500,620,85),p(500,0,50)],
  back:[p(560,-660,165),p(500,0,45)],
  roof:[p(500,90,850),p(500,0,0)],
  deck:[p(ARCH_START-70,-25,DECK+5),p(600,-27,DECK+13)],
  underside:[p(510,115,8),p(490,20,15)],
  tower:[p(ARCH_START+40,120,38),p(ARCH_START+38,61,46)],
};
