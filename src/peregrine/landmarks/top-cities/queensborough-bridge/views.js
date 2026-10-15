import {PROFILE as p,L,MAIN_MID as M,MAIN_SOUTH as S} from './queensborough-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS={overview:[at(M-270,-600,210),at(L*.52,0,15)],facade:[at(M,330,45),at(M,0,17)],back:[at(M,-330,48),at(M,0,17)],roof:[at(L/2,-80,950),at(L/2,0,0)],deck:[at(M-85,-4,29),at(M+35,-4,26)],tower:[at(S-30,65,12),at(S,0,17)],underside:[at(M,65,5),at(M,0,24)],detail:[at(S-15,36,22),at(S,7,23)]};
