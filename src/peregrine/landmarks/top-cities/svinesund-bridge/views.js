import {PROFILE,MID,DECK_START} from './svinesund-bridge-profile.js';
const v=(s,d,y)=>{const p=PROFILE.bridgePoint(s,d,y);return [p.x,p.y,p.z];};
export const VIEWS={
 overview:[v(MID-280,410,255),v(MID-140,0,25)],
 facade:[v(MID,405,100),v(MID,0,32)],
 back:[v(MID,-410,110),v(MID,0,32)],
 roof:[v(MID-110,0,820),v(MID-110,0,0)],
 deck:[v(MID-115,9,37),v(MID+70,4,46)],
 underside:[v(MID-40,80,13),v(MID,0,30)],
 tower:[v(MID-80,100,78),v(MID-25,0,57)],
 approach:[v(DECK_START+170,80,42),v(DECK_START+260,0,27)],
};
