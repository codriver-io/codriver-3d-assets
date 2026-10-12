import { PROFILE as p,TOWER_S } from './vincent-thomas-bridge-profile.js';
const mid=(TOWER_S[0]+TOWER_S[1])/2;
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
export const VIEWS = {
  westLanding:[q(80,100,60),q(55,0,3)],
  eastLanding:[q(p.BRIDGE_LENGTH-80,-75,45),q(p.BRIDGE_LENGTH-55,0,2)],
  overview:[q(mid-320,1050,490),q(mid,0,42)],
  facade:[q(mid,630,155),q(mid,0,58)],
  back:[q(mid,-630,155),q(mid,0,58)],
  roof:[q(mid,0,1750),q(mid,0,0)],
  deck:[q(TOWER_S[0]-85,2,62.3),q(TOWER_S[0]+25,2,73)],
  tower:[q(TOWER_S[0]-65,65,85),q(TOWER_S[0],0,80)],
  underside:[q(mid,70,20),q(mid,0,57)],
};
