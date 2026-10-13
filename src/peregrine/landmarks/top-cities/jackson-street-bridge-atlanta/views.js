import { PROFILE as p, A, B, deckHeight as h } from './jackson-street-bridge-atlanta-profile.js';
const mid=(A+B)/2,pt=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS={
 overview:[pt(mid-70,95,53),pt(mid,0,5)],
 facade:[pt(mid,100,18),pt(mid,0,4)],
 back:[pt(mid,-100,18),pt(mid,0,4)],
 roof:[pt(mid-35,40,108),pt(mid,0,3)],
 crossing:[pt(A+3,-3.3,h(A)+1.65),pt(B+5,-3.3,7.4)],
 detail:[pt(mid-14,15,9),pt(mid+1,9.3,7)],
 underside:[pt(mid-12,36,2),pt(mid,0,3.5)],
 north:[pt(A-45,26,12),pt(A+5,0,5)],
 south:[pt(B+45,-26,12),pt(B-5,0,5)],
};
