import {PROFILE as p,WEST_TOWER as W,EAST_TOWER as E} from './pitt-river-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS={overview:[at(W-100,-340,180),at((W+E)/2,0,24)],
 facade:[at((W+E)/2,300,55),at((W+E)/2,0,26)],back:[at((W+E)/2,-300,65),at((W+E)/2,0,26)],
 roof:[at((W+E)/2,-90,470),at((W+E)/2,0,0)],deck:[at(W-135,-9,23),at(W+50,-9,26)],
 tower:[at(W-35,-70,36),at(W,-12,34)],underside:[at((W+E)/2,85,7),at(W,0,16)],detail:[at(W-14,-37,20),at(W,-21,24)]};
