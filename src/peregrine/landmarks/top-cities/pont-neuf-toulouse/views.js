import {PROFILE as p,START,END,PIERS} from './pont-neuf-toulouse-profile.js';
const v=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const mid=(START+END)/2;
export const VIEWS={
 overview:[v(START+15,155,65),v(mid,2,5)],
 facade:[v(mid,240,25),v(mid,2,5)],
 back:[v(mid,-240,28),v(mid,2,5)],
 roof:[v(mid,0,285),v(mid,2,0)],
 deck:[v(START+4,0,13),v(mid,0,11)],
 underside:[v(mid+15,42,3),v(mid,2,5)],
 tower:[v(PIERS[3]+12,32,9),v(PIERS[3],12,7)],
 detail:[v(PIERS[3]+7,35,10),v(PIERS[3],12,7)]
};
