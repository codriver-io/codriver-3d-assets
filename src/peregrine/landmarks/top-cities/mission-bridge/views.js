import {PROFILE as p,RIVER_START,RIVER_END,MAIN_START,MAIN_END} from './mission-bridge-profile.js';
const camera=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS={
 overview:[camera((RIVER_START+RIVER_END)/2,-950,160),camera((RIVER_START+RIVER_END)/2,0,17)],
 facade:[camera((RIVER_START+RIVER_END)/2,-480,65),camera((RIVER_START+RIVER_END)/2,0,17)],
 back:[camera((RIVER_START+RIVER_END)/2,460,70),camera((RIVER_START+RIVER_END)/2,0,16)],
 roof:[camera((RIVER_START+RIVER_END)/2,-80,1000),camera((RIVER_START+RIVER_END)/2,0,10)],
 piers:[camera(MAIN_START+40,-68,12),camera(MAIN_START,0,15)],
 deck:[camera(MAIN_START-32,-3,33),camera(MAIN_END,0,30)]};
