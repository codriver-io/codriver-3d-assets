import { PROFILE as p,TOWER_S } from './halogaland-bridge-profile.js';
const point=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];},mid=(TOWER_S[0]+TOWER_S[1])/2;
export const VIEWS={
  overview:[point(mid-130,-1300,430),point(mid,0,45)],
  facade:[point(mid,1350,155),point(mid,0,70)],
  back:[point(mid,-1350,155),point(mid,0,70)],
  roof:[point(mid,-150,3200),point(mid,0,35)],
  deck:[point(TOWER_S[0]-65,0,p.deckHeight(TOWER_S[0]-65)+2),point(TOWER_S[0]+20,0,52)],
  tower:[(()=>{const q=p.bridgePoint(TOWER_S[0]);return [q.x-280,150,q.z+250];})(),point(TOWER_S[0],0,88)],
  underside:[point(TOWER_S[0]+85,-75,18),point(TOWER_S[0],0,40)],
  approach:[point(TOWER_S[0]-400,-220,120),point(TOWER_S[0]-130,0,25)],
};
