import { PROFILE as p, TOWER_S } from './ponte-25-de-abril-profile.js';
const q=p.bridgePoint(TOWER_S[0]);
export const VIEWS = {
 overview: [[2100,850,1800],[0,65,-300]],
 facade: [[1800,350,-200],[0,95,-200]],
 back: [[-1900,500,-500],[0,65,-200]],
 roof: [[400,2200,300],[0,50,-200]],
 tower: [[q.x+100,140,q.z+100],[q.x,110,q.z]],
 deck: [[q.x+15,88,q.z+160],[q.x,90,q.z-80]],
 underside: [[q.x+130,45,q.z+160],[q.x,72,q.z]],
};
