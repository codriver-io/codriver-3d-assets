import { PROFILE as p, TOWER_S as T } from './christopher-s-bond-bridge-profile.js';
const point=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,y,q.z];};
export const VIEWS = {
  overview: [point(T-275,-300,170),point(T,0,36)],
  facade: [point(T-200,-260,65),point(T,0,45)],
  back: [point(T+200,280,85),point(T,0,42)],
  roof: [point(T,0,850),point(T,0,0)],
  deck: [point(T-90,8,27),point(T,0,61)],
  tower: [point(T-120,-75,68),point(T,0,53)],
  underside: [point(T-45,-80,10),point(T,0,15)],
  approach: [point(20,-80,32),point(125,0,12)],
};
