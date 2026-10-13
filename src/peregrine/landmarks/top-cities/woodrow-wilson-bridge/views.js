import { PROFILE as p, BASCULE_S, TRUNNIONS, CONTROL } from './woodrow-wilson-bridge-profile.js';
const view=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,y,q.z];};
export const VIEWS={
 overview:[view(-180,330,140),view(750,0,12)],
 facade:[view(BASCULE_S-220,220,65),view(BASCULE_S,0,16)],
 roof:[view(880,80,1200),view(880,0,10)],
 deck:[view(BASCULE_S-160,-18,30),view(BASCULE_S+40,-18,25)],
 underside:[view(1180,170,7),view(1180,0,12)],
 tower:[view(CONTROL.s+35,-65,40),view(CONTROL.s+7,CONTROL.lateral,29)],
 back:[view(1000,-700,220),view(900,0,12)],
};
