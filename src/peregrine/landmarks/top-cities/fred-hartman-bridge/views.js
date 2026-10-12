import {PROFILE as p,SOUTH_TOWER,NORTH_TOWER,DECK_H} from './fred-hartman-bridge-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
const mid=(SOUTH_TOWER+NORTH_TOWER)/2;
export const VIEWS={
 overview:[q(mid-780,-1050,360),q(mid,0,52)],
 facade:[q(mid,-660,80),q(mid,0,62)],
 back:[q(mid,660,145),q(mid,0,60)],
 roof:[q(mid,-140,970),q(mid,0,0)],
 tower:[q(SOUTH_TOWER-210,-150,93),q(SOUTH_TOWER,0,72)],
 deck:[q(SOUTH_TOWER-170,12,DECK_H+4),q(SOUTH_TOWER+75,12,DECK_H+31)],
 underside:[q(SOUTH_TOWER-50,-60,8),q(SOUTH_TOWER,0,39)],
 detail:[q(SOUTH_TOWER-22,-53,121),q(SOUTH_TOWER,-12.5,120)]
};
