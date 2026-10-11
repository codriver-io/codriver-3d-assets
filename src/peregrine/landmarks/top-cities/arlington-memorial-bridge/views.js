import { PROFILE as p,START,END } from './arlington-memorial-bridge-profile.js';
const point=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const M=(START+END)/2;
export const VIEWS={overview:[point(M,580,280),point(M,0,5)],facade:[point(M,510,38),point(M,0,5)],back:[point(M,-510,38),point(M,0,5)],roof:[point(M,80,640),point(M,0,4)],deck:[point(END-2,0,5),point(END-120,0,10)],underside:[point(M,105,2),point(M,0,5)],tower:[point(START+29,42,18),point(START+7,12,8)],detail:[point(END-25,37,15),point(END-9,12,8)]};
