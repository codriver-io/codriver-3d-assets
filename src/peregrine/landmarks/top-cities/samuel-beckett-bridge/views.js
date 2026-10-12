import { PROFILE as p, PYLON, SOUTH, NORTH } from './samuel-beckett-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];};
export const VIEWS={
 overview:[at(PYLON-35,145,75),at(PYLON+25,0,20)],
 facade:[at(PYLON+30,155,27),at(PYLON+30,0,23)],
 back:[at(PYLON+30,-155,38),at(PYLON+30,0,20)],
 roof:[at(PYLON+32,0,190),at(PYLON+32,0,0)],
 deck:[at(NORTH-10,5,4.1),at(PYLON+15,0,28)],
 tower:[at(PYLON-8,70,28),at(PYLON+12,0,27)],
 detail:[at(PYLON-8,20,8),at(PYLON-5,0,6.7)],
 underside:[at(PYLON+15,45,1),at(PYLON+10,0,1.5)]
};
