import { PROFILE as p, TOWER_S, ANCHOR_S } from './lions-gate-bridge-profile.js';
const point=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const mid=(TOWER_S[0]+TOWER_S[1])/2;
export const VIEWS = {
  overview: [point(mid+230,-950,480),point(mid+150,0,43)],
  facade: [point(mid,650,140),point(mid,0,62)],
  back: [point(mid,-650,140),point(mid,0,62)],
  roof: [point(mid+250,-200,1400),point(mid+250,0,30)],
  deck: [point(TOWER_S[0]-100,0,66.2),point(TOWER_S[0]+10,0,73)],
  tower: [point(TOWER_S[0]-70,-60,90),point(TOWER_S[0],0,80)],
  underside: [point(TOWER_S[0]+70,-70,18),point(TOWER_S[0],0,47)],
  north: [point(ANCHOR_S[1]+300,-300,200),point(ANCHOR_S[1]+250,0,35)],
};
