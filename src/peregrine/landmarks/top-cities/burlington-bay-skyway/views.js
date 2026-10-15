import {PROFILE as p,MID,L,MAIN,DECK_H} from './burlington-bay-skyway-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
export const VIEWS={
 overview:[q(MID-500,900,300),q(MID-70,0,28)],
 facade:[q(MID,410,27),q(MID,10,40)],
 back:[q(MID,-430,36),q(MID,0,40)],
 roof:[q(L/2,0,3800),q(L/2,0,0)],
 deck:[q(MID-120,12.5,DECK_H+4),q(MID+30,12.5,51)],
 tower:[q(MAIN[0]-75,100,14),q(MAIN[0],12.5,37)],
 underside:[q(MID-80,80,5),q(MID,0,37)],
 detail:[q(MID-40,65,65),q(MID,12.5,54)],
 approach:[q(160,150,30),q(180,0,8)],
};
