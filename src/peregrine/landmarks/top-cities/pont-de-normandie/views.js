import { PROFILE as p,L,NORTH_TOWER as N,SOUTH_TOWER as S } from './pont-de-normandie-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return[q.x,q.y,q.z];},mid=(N+S)/2;
export const VIEWS={
  overview:[at(N-330,-1550,530),at(L/2,0,62)],
  facade:[at(mid,-3200,330),at(mid,0,55)],
  back:[at(mid,3200,360),at(mid,0,55)],
  roof:[at(L/2,0,4300),at(L/2,0,0)],
  deck:[at(N-180,-4.8,p.deckHeight(N-180)+2.2),at(N+65,-4.8,64)],
  tower:[at(N-145,-135,132),at(N,0,108)],
  detail:[at(N-55,-48,32),at(N,-10,49)],
  underside:[at(mid-60,-80,24),at(mid,0,52)],
};
