import { PROFILE as p, STRUCTURE_START as A, STRUCTURE_END as Z, PIVOT_S } from './pont-de-la-fonderie-profile.js';
const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
const C=(A+Z)/2;
export const VIEWS = {
  overview: [xyz(C-22,34,21),xyz(C,0,1.7)],
  facade: [xyz(C,36,7),xyz(C,0,1.7)],
  back: [xyz(C,-36,7),xyz(C,0,1.7)],
  roof: [xyz(C,0,47),xyz(C,0,0)],
  deck: [xyz(A-9,.2,3.3),xyz(Z,0,2.2)],
  underside: [xyz(C+2,16,.45),xyz(C,0,1.1)],
  tower: [xyz(PIVOT_S,13,.85),xyz(PIVOT_S,0,.78)],
  detail: [xyz(A+9,10,3.8),xyz(A+9,4.3,2.2)],
};
