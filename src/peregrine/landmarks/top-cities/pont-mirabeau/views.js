import {PROFILE as p,MAIN_START as A,MAIN_END as Z,PIERS} from './pont-mirabeau-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const C=(A+Z)/2;
export const VIEWS={
 overview:[at(A-35,175,90),at(C,0,5)],
 facade:[at(C,170,26),at(C,0,5)],
 back:[at(C,-170,26),at(C,0,5)],
 roof:[at(C,20,210),at(C,0,4)],
 deck:[at(A+2,3,11),at(C,0,8.5)],
 underside:[at(C,50,2),at(C,0,3.5)],
 tower:[at(PIERS[0]+15,30,9),at(PIERS[0],11.9,4.5)],
 detail:[at(PIERS[1]+10,-26,8),at(PIERS[1],-11.9,4.5)],
};
