import { PROFILE as p, NORTH_TOWER as N, SOUTH_TOWER as S, DECK_H } from './port-mann-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];};
const mid=(N+S)/2;
export const VIEWS={
  overview:[at(N-200,-480,230),at(mid,0,58)],
  facade:[at(mid,-750,135),at(mid,0,55)],
  back:[at(mid,750,170),at(mid,0,55)],
  roof:[at(mid,0,3600),at(mid,0,0)],
  deck:[at(N-160,-14,DECK_H+2),at(N,0,83)],
  tower:[at(N-135,-105,100),at(N,0,86)],
  detail:[at(N-35,-52,12),at(N,0,27)],
  underside:[at(mid-30,-100,22),at(mid,0,44)],
};
