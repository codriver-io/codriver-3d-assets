import { PROFILE as p,L,WEST_TOWER as W,EAST_TOWER as E,DECK_H } from './oresund-bridge-profile.js';
const point=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const m=(W+E)/2;
export const VIEWS={
  overview:[point(L/2,6400,2700),point(L/2,0,65)],
  facade:[point(m,1050,275),point(m,0,105)],
  back:[point(m,-1050,250),point(m,0,105)],
  roof:[point(L/2,0,6500),point(L/2,0,0)],
  deck:[point(W-100,0,DECK_H+5),point(W+200,0,DECK_H+15)],
  tower:[point(W-115,120,155),point(W,0,120)],
  detail:[point(W-90,55,63),point(W-20,0,60)],
  underside:[point(m,80,40),point(m+30,0,60)],
};
