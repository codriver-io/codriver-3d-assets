import { PROFILE as p,N,S,DECK_H,L } from './sunshine-skyway-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];};const mid=(N+S)/2;
export const VIEWS={
 overview:[at(mid-280,-650,235),at(mid,0,65)],
 facade:[at(mid,-800,125),at(mid,0,65)],
 back:[at(mid,800,140),at(mid,0,65)],
 roof:[at(L/2,0,5100),at(L/2,0,0)],
 deck:[at(N-150,-8,DECK_H+3),at(N,0,94)],
 tower:[at(N-100,-90,110),at(N,0,91)],
 underside:[at(mid-35,-85,20),at(mid,0,59)],
 approach:[at(240,-80,20),at(600,0,32)],
};
