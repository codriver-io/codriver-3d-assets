import { PROFILE as p,NORTH_TOWER,SOUTH_TOWER,L } from './alex-fraser-bridge-profile.js';
const q=(s,d,y)=>{const v=p.bridgePoint(s,d,y);return [v.x,v.y,v.z];};
const middle=(NORTH_TOWER+SOUTH_TOWER)/2;
const landing=(s,direction)=>{const v=p.bridgePoint(s,0,0);return [[v.x-direction*v.tx*135+v.tz*55,42,v.z-direction*v.tz*135-v.tx*55],q(s+direction*40,0,1)];};
export const VIEWS={
  'north-landing':landing(0,1),
  'south-landing':landing(L,-1),
  overview:[q(middle-350,-1050,390),q(middle,50,55)],
  facade:[q(middle,-950,110),q(middle,0,80)],
  back:[q(middle,1000,180),q(middle,0,72)],
  roof:[q(middle,0,1900),q(middle,0,0)],
  deck:[q(NORTH_TOWER-125,-6,67),q(NORTH_TOWER+115,-6,92)],
  tower:[q(NORTH_TOWER-145,-110,90),q(NORTH_TOWER,0,101)],
  detail:[q(NORTH_TOWER-60,-57,105),q(NORTH_TOWER,0,112)],
  underside:[q(middle,-230,20),q(NORTH_TOWER,0,53)],
};
