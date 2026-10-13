import { PROFILE as p,N,S } from './queen-elizabeth-ii-bridge-profile.js';
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS={
 overview:[at((N+S)/2,-1500,510),at((N+S)/2,0,45)],
 facade:[at((N+S)/2,-600,160),at((N+S)/2,0,68)],
 back:[at((N+S)/2,600,160),at((N+S)/2,0,68)],
 roof:[at((N+S)/2,-150,1100),at((N+S)/2,0,0)],
 deck:[at(N-160,0,p.deckHeight(N-160)+2.5),at(N,0,88)],
 tower:[at(N-120,-110,100),at(N,0,91)],
 detail:[at(N+120,-50,82),at(N+75,-9,68)],
 underside:[at((N+S)/2,-250,18),at((N+S)/2,0,54)],
};
