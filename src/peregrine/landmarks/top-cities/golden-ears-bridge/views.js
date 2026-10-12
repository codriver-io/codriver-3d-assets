import { PROFILE as p,TOWERS,MAIN_START,MAIN_END } from './golden-ears-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const mid=(MAIN_START+MAIN_END)/2;
export const VIEWS={
 overview:[at(mid,1100,450),at(mid,0,35)],
 facade:[at(mid,670,100),at(mid,0,39)],
 back:[at(mid,-670,100),at(mid,0,39)],
 roof:[at(mid,40,1100),at(mid,0,0)],
 deck:[at(TOWERS[0]-100,-6,47),at(TOWERS[1],-6,48)],
 tower:[at(TOWERS[0]-70,75,72),at(TOWERS[0],0,54)],
 detail:[at(TOWERS[0]-26,34,58),at(TOWERS[0],13.7,65)],
 underside:[at(TOWERS[0]-75,30,15),at(TOWERS[0],0,36)]};
