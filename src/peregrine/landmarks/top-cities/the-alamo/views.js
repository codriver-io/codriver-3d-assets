import {sitePoint} from './the-alamo-parts.js';
const p=(u,y,v)=>sitePoint(u,y,v).toArray();
export const VIEWS={
  overview:[p(70,35,-90),p(23,3,0)],
  facade:[p(0,6,-40),p(0,4.8,0)],
  back:[p(-28,23,64),p(2,4,14)],
  roof:[p(12,100,12),p(22,0,1)],
  street:[p(-19,1.8,-28),p(0,4,0)],
  detail:[p(-6,5,-16),p(0,3.5,0)],
  barrack:[p(45,11,-65),p(43,2,-20)],
};
