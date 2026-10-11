import { PROFILE } from './walterdale-bridge-profile.js';
const p=(s,d,y)=>{const q=PROFILE.bridgePoint(s,d,y);return[q.x,q.y,q.z];};
export const VIEWS={overview:[p(130,300,145),p(295,0,22)],facade:[p(295,370,65),p(295,0,26)],back:[p(295,-370,65),p(295,0,26)],roof:[p(295,25,420),p(295,0,10)],deck:[p(172,0,19),p(295,0,35)],underside:[p(245,70,5),p(295,0,14)],tower:[p(255,52,55),p(295,8,49)]};
