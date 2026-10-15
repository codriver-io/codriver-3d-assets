import { PROFILE as p } from './pont-de-l-alma-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s-110,d,y-7.9);return [q.x,q.y,q.z];};
export const VIEWS={
 overview:[at(65,170,72),at(181,0,5)],
 facade:[at(181,175,20),at(181,0,5)],
 back:[at(181,-175,20),at(181,0,5)],
 roof:[at(181,45,210),at(181,0,4)],
 deck:[at(118,9,11),at(220,7,9)],
 underside:[at(172,58,2.5),at(202,0,5)],
 tower:[at(210,41,10),at(220,21,4.5)],
 detail:[at(223,33,6.8),at(220,22,4.6)],
};
