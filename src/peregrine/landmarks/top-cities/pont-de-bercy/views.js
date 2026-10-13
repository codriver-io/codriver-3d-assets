import { PROFILE as p } from './pont-de-bercy-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS={
 overview:[at(35,210,105),at(188,0,7)],
 facade:[at(188,235,40),at(188,0,7)],
 back:[at(188,-235,40),at(188,0,7)],
 roof:[at(188,70,240),at(188,0,7)],
 deck:[at(102,15,11),at(210,8,10)],
 underside:[at(180,62,3),at(185,0,4)],
 tower:[at(173,28,13),at(187,0,12)],
 detail:[at(143,20,11),at(153,3,11)],
};
