import {PROFILE as p, MAIN, PIERS} from './granville-street-bridge-profile.js';
const mid=(MAIN[0]+MAIN[1])/2;
const at=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
export const VIEWS = {
  overview: [at(730,-980,480),at(730,-4,18)],
  facade: [at(mid,310,60),at(mid,-4,22)],
  back: [at(640,-400,105),at(640,-4,22)],
  roof: [at(730,-130,1350),at(730,-4,0)],
  detail: [at(PIERS[4]-20,68,17),at(PIERS[4]+8,5,25)],
  underside: [at(mid-60,60,9),at(mid,-4,28)],
  south: [at(300,-4,34),at(530,-4,36)],
  north: [at(1170,-4,32),at(975,-4,35)],
};
