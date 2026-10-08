import { PROFILE as p, NORTH_TOWER as N, SOUTH_TOWER as S, DECK_H, L } from './helgeland-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];};
const mid=(N+S)/2;
export const VIEWS={
  overview:[at(N-130,-330,165),at(mid,0,55)],
  facade:[at(mid,-900,135),at(mid,0,50)],
  back:[at(mid,900,165),at(mid,0,50)],
  roof:[at(L/2,0,3100),at(L/2,0,0)],
  deck:[at(N-175,-2,p.deckHeight(N-175)+1.9),at(N+35,0,72)],
  tower:[at(N-72,-68,75),at(N,0,76)],
  detail:[at(N-40,-32,16),at(N,0,26)],
  underside:[at(mid-45,-65,23),at(mid,0,46)],
};
