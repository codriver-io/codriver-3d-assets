import {PROFILE as p,MID,L,MAIN_PIERS} from './oak-street-bridge-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return[v.x,v.y,v.z];};
export const VIEWS={
 overview:[q(MID-250,-520,220),q(MID+40,0,13)],
 facade:[q(MID,-410,60),q(MID,0,16)],
 back:[q(MID,460,85),q(MID,0,16)],
 roof:[q(L/2,0,1800),q(L/2,0,0)],
 deck:[q(MID-65,-3.7,29),q(MID+100,-3.7,26)],
 tower:[q(MAIN_PIERS[1]-30,-42,12),q(MAIN_PIERS[1],0,14)],
 underside:[q(MID-45,-38,5),q(MAIN_PIERS[1]+12,0,23)],
 detail:[q(MAIN_PIERS[1]-15,-22,21),q(MAIN_PIERS[1],-7.8,23)],
 'north-landing':[q(0,-50,36),q(65,0,1)],
 'south-landing':[q(L,-50,36),q(L-65,0,1)],
};
