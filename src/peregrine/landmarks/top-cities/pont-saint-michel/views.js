import { PROFILE as p, PIER_S } from './pont-saint-michel-profile.js';
const at=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
export const VIEWS={
 overview:[[-390,160,330],[0,5,0]],facade:[[-125,24,175],[-125,4,0]],
 back:[[-125,28,-175],[-125,4,0]],roof:[[0,560,80],[0,0,0]],
 deck:[at(195,7.5,10),at(265,7.5,8)],
 underside:[at(PIER_S[2]+15,32,2.4),at(PIER_S[2],0,4)],
 tower:[at(PIER_S[2],70,5),at(PIER_S[2],0,4)],
 detail:[at(PIER_S[2]+8,31,4),at(PIER_S[2],0,4.5)],
};
