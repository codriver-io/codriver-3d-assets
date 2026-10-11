import { PROFILE as p, MAIN } from './burrard-street-bridge-profile.js';
const point=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];};
const mid=(MAIN[0]+MAIN[1])/2;
export const VIEWS = {
  overview: [point(mid-60,260,160),point(mid-110,0,17)],
  facade: [point(mid,185,48),point(mid,0,24)],
  back: [point(mid,-185,52),point(mid,0,25)],
  roof: [point(mid-90,90,180),point(mid,0,26)],
  deck: [point(MAIN[0]-38,0,26),point(MAIN[0]+14,0,32)],
  underside: [point(mid,105,8),point(mid,0,17)],
  tower: [point(MAIN[0]-26,24,38),point(MAIN[0],10,34)],
  south: [point(50,160,72),point(245,0,15)],
  north: [point(920,65,48),point(850,0,13)],
};
