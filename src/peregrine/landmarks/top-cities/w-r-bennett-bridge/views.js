import {PROFILE as p,NAV_W,NAV_E,GIRDER_END,FLOAT_END,WEST_LAND} from './w-r-bennett-bridge-profile.js';
// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const N=(NAV_W+NAV_E)/2;
export const VIEWS={overview:[at(N+520,250,60),at(N-20,0,12)],
 facade:[at(N+40,250,22),at(N+40,0,10)],back:[at(N-20,-250,26),at(N-20,0,10)],
 roof:[at(620,-60,900),at(620,0,0)],deck:[at(N-70,-6,25),at(N+260,-6,8)],
 hump:[at(N,105,7),at(N,0,15)],underside:[at(N,40,4),at(NAV_W-60,0,14)],
 floating:[at(900,32,4),at(960,0,2)],landing:[at(WEST_LAND-60,40,14),at(WEST_LAND+40,0,4)],
 east:[at(FLOAT_END+160,60,14),at(FLOAT_END-60,0,3)],detail:[at(GIRDER_END-20,30,10),at(GIRDER_END+10,0,6)]};
