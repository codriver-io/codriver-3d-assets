import {PROFILE as p,TOWERS,DECK_H} from './long-beach-international-gateway-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];},m=(TOWERS[0]+TOWERS[1])/2;
export const VIEWS={
 overview:[at(TOWERS[0]-190, -510,240),at(m,0,70)],
 facade:[at(m,-680,140),at(m,0,77)],
 back:[at(m,680,150),at(m,0,77)],
 roof:[[0,3900,0],[0,0,0]],
 deck:[at(TOWERS[0]-125,12,DECK_H+3),at(TOWERS[0]+25,0,100)],
 tower:[at(TOWERS[0]-92,-90,105),at(TOWERS[0],0,105)],
 detail:[at(TOWERS[0]-35,-48,43),at(TOWERS[0],0,58)],
 underside:[at(m-60,-80,32),at(m,0,61)],
};
